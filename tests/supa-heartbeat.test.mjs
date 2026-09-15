import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import handler from "../src/pages/api/supa-heartbeat.ts";

const envNames = ["CRON_SECRET", "HEARTBEAT_CRON_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
let originalEnv;
let originalFetch;
let calls;
const inserted = { id: 123, created_at: "2026-09-15T05:00:00.000Z" };

beforeEach(() => {
  originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  originalFetch = globalThis.fetch;
  process.env.CRON_SECRET = "test-cron-secret";
  process.env.HEARTBEAT_CRON_SECRET = "test-legacy-secret";
  process.env.SUPABASE_URL = "https://example.supabase.co/";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
  calls = [];
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return Response.json([inserted], { status: 201 });
  };
});

afterEach(() => {
  mock.timers.reset();
  globalThis.fetch = originalFetch;
  for (const name of envNames) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
});

async function invoke({ method = "GET", headers = {}, query = {} } = {}) {
  const res = {
    headers: {},
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method, headers, query }, res);
  assert.match(res.headers["Cache-Control"], /no-store/);
  return res;
}

const authorized = { authorization: "Bearer test-cron-secret" };

test("Vercel GET inserts into the original table and returns the original response", async () => {
  const res = await invoke({ headers: authorized });
  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, { ok: true, inserted });
  assert.equal(calls.length, 1);
  const [url, options] = calls[0];
  assert.equal(url, "https://example.supabase.co/rest/v1/hearthbeat");
  assert.equal(options.method, "POST");
  assert.equal(options.body, "{}");
  assert.equal(options.headers.apikey, "test-service-role-key");
  assert.equal(options.headers.Authorization, "Bearer test-service-role-key");
  assert.equal(options.headers.Prefer, "return=representation");
  assert.equal(options.cache, "no-store");
  assert.ok(options.signal instanceof AbortSignal);
});

test("GET and POST accept Vercel and both legacy credentials", async () => {
  for (const method of ["GET", "POST"]) {
    for (const credentials of [
      { headers: authorized },
      { headers: { "x-cron-key": "test-legacy-secret" } },
      { query: { key: "test-legacy-secret" } },
    ]) {
      assert.equal((await invoke({ method, ...credentials })).statusCode, 201);
    }
  }
  assert.equal(calls.length, 6);
});

test("missing, wrong and ambiguous credentials cannot write", async () => {
  for (const credentials of [
    {},
    { headers: { authorization: "Bearer wrong" } },
    { headers: { "x-cron-key": "wrong" } },
    { query: { key: "wrong" } },
    { query: { key: ["test-legacy-secret", "wrong"] } },
    { headers: { "user-agent": "vercel-cron/1.0" } },
  ]) {
    const res = await invoke(credentials);
    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { ok: false, error: "Unauthorized" });
  }
  assert.equal(calls.length, 0);
});

test("unset or empty secrets fail closed, including literal Bearer undefined", async () => {
  for (const value of [undefined, ""]) {
    for (const name of ["CRON_SECRET", "HEARTBEAT_CRON_SECRET"]) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    for (const headers of [authorized, { authorization: "Bearer undefined" }, { authorization: "Bearer " }]) {
      assert.equal((await invoke({ headers, query: { key: "" } })).statusCode, 401);
    }
  }
  assert.equal(calls.length, 0);
});

test("Vercel and legacy credentials work independently", async () => {
  delete process.env.HEARTBEAT_CRON_SECRET;
  assert.equal((await invoke({ headers: authorized })).statusCode, 201);
  delete process.env.CRON_SECRET;
  process.env.HEARTBEAT_CRON_SECRET = "test-legacy-secret";
  assert.equal((await invoke({ headers: { "x-cron-key": "test-legacy-secret" } })).statusCode, 201);
});

test("unsupported methods never insert", async () => {
  for (const method of ["HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const res = await invoke({ method, headers: authorized });
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.Allow, "GET, POST");
  }
  assert.equal(calls.length, 0);
});

test("missing database configuration returns 500 before fetch", async () => {
  for (const name of ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) {
    const value = process.env[name];
    delete process.env[name];
    const res = await invoke({ headers: authorized });
    assert.equal(res.statusCode, 500);
    assert.match(res.body.error, /Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/);
    process.env[name] = value;
  }
  assert.equal(calls.length, 0);
});

test("database errors, invalid payloads and network timeouts return 500", async () => {
  for (const fetchResult of [
    async () => new Response("table unavailable", { status: 503 }),
    async () => Response.json([]),
    async () => Response.json({}),
    async () => new Response("invalid JSON"),
    async () => { throw new Error("The operation was aborted due to timeout"); },
  ]) {
    globalThis.fetch = fetchResult;
    const res = await invoke({ headers: authorized });
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.ok, false);
    assert.equal(typeof res.body.error, "string");
  }
});

test("cron writes at Prague midnight in winter, summer and around DST changes", async () => {
  for (const [day, midnightUtcHour] of [
    ["2026-01-15", 23],
    ["2026-07-15", 22],
    ["2026-03-28", 23],
    ["2026-03-29", 22],
    ["2026-10-24", 22],
    ["2026-10-25", 23],
  ]) {
    for (const hour of [22, 23]) {
      for (const minute of ["00", "59"]) {
        mock.timers.enable({ apis: ["Date"], now: new Date(`${day}T${hour}:${minute}:00Z`) });
        const before = calls.length;
        const res = await invoke({ headers: { ...authorized, "user-agent": "vercel-cron/1.0" } });
        const shouldInsert = hour === midnightUtcHour;
        assert.equal(res.statusCode, shouldInsert ? 201 : 200, `${day} ${hour}:${minute}`);
        assert.equal(calls.length - before, shouldInsert ? 1 : 0);
        if (!shouldInsert) assert.equal(res.body.skipped, true);
        mock.timers.reset();
      }
    }
  }
});

test("schedule header also filters cron, while manual calls work at any time", async () => {
  mock.timers.enable({ apis: ["Date"], now: new Date("2026-07-15T12:00:00Z") });
  const res = await invoke({ headers: { ...authorized, "x-vercel-cron-schedule": "0 23 * * *" } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.skipped, true);
  assert.equal(calls.length, 0);
  assert.equal((await invoke({ headers: authorized })).statusCode, 201);
});

test("cron headers without credentials never bypass authorization", async () => {
  mock.timers.enable({ apis: ["Date"], now: new Date("2026-07-15T12:00:00Z") });
  const res = await invoke({ headers: { "x-vercel-cron-schedule": "0 23 * * *" } });
  assert.equal(res.statusCode, 401);
  assert.equal(calls.length, 0);
});
