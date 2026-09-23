const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

async function invoke(lang, scenario = {}) {
  const calls = [], updates = [], generated = [];
  const row = scenario.exists ? { id: "cv-id", comgate_trans_id: "tx", pdf_status: scenario.ready ? "ready" : "not_started" } : null;
  const client = { from() { return {
    select() { return { eq() { return { async maybeSingle() {
      return { data: row, error: scenario.dbError ? { code: "DB_ERROR" } : null };
    } }; } }; },
    update(value) { updates.push(value); return { async eq() { return { error: null }; } }; },
  }; } };
  function load(file) {
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const module = { exports: {} };
    const mockRequire = (name) => {
      if (name === "@supabase/supabase-js") return { createClient: () => client };
      if (name === "@/server/cvGeneration") return { generateCvArtifacts: async (...args) => generated.push(args) };
      if (name === "@/server/missingCvWebhook") return load("src/server/missingCvWebhook.ts");
      throw new Error("Unexpected import: " + name);
    };
    const mockFetch = async (url, options) => {
      calls.push({ url, options });
      if (scenario.networkError) throw new Error("Network failed");
      return new Response(scenario.raw ?? new URLSearchParams({
        code: scenario.code ?? "0", transId: scenario.returnedTx ?? "tx", refId: "ref",
        status: scenario.status ?? "CANCELLED",
      }).toString(), { status: scenario.http ?? 200 });
    };
    const env = { COMGATE_MERCHANT: "cz-merchant", COMGATE_SECRET: "cz-secret",
      COMGATE_MERCHANT_SK: "sk-merchant", COMGATE_SECRET_SK: "sk-secret",
      SUPABASE_URL: "https://example.invalid", SUPABASE_SERVICE_ROLE_KEY: "test" };
    new Function("require", "module", "exports", "fetch", "process", code)(mockRequire, module, module.exports, mockFetch, { env });
    return module.exports;
  }
  const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; }, end() {} };
  const body = { transId: "tx", refId: "ref", status: "CANCELLED", ...scenario.body };
  await load("src/pages/api/" + lang + "/comgate-webhook.ts").default({ method: "POST", body, query: {} }, res);
  assert.equal(res.headers["Cache-Control"], "no-store");
  return { res, calls, updates, generated };
}

for (const lang of ["cs", "sk"]) {
  test(lang + ": deleted CV cancellation is verified and acknowledged without writes", async () => {
    const { res, calls, updates, generated } = await invoke(lang);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { ok: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].options.body.get("merchant"), lang === "cs" ? "cz-merchant" : "sk-merchant");
    assert.equal(calls[0].options.body.get("secret"), lang === "cs" ? "cz-secret" : "sk-secret");
    assert.equal(calls[0].options.cache, "no-store");
    assert.ok(calls[0].options.signal instanceof AbortSignal);
    assert.deepEqual(updates, []);
    assert.deepEqual(generated, []);
  });
  test(lang + ": missing paid/pending CV and failed verification remain errors", async () => {
    for (const scenario of [
      { status: "PAID", expected: 404 }, { status: "PENDING", expected: 404 },
      { code: "1", expected: 502 }, { http: 500, expected: 502 },
      { returnedTx: "wrong", expected: 502 }, { body: { refId: "wrong" }, expected: 502 },
      { networkError: true, expected: 502 }, { raw: "invalid", expected: 502 },
      { dbError: true, expected: 503 }, { body: { transId: undefined }, expected: 404 },
    ]) {
      const result = await invoke(lang, scenario);
      assert.equal(result.res.statusCode, scenario.expected, JSON.stringify(scenario));
      assert.deepEqual(result.updates, []);
      assert.deepEqual(result.generated, []);
      if (scenario.dbError || scenario.body?.transId === undefined && scenario.expected === 404 && scenario.body) assert.equal(result.calls.length, 0);
    }
  });
  test(lang + ": existing CV keeps cancellation and paid PDF flow", async () => {
    const cancelled = await invoke(lang, { exists: true });
    assert.equal(cancelled.res.statusCode, 200);
    assert.deepEqual(cancelled.updates, [{ payment_status: "cancelled" }]);
    const paid = await invoke(lang, { exists: true, status: "PAID" });
    assert.equal(paid.res.statusCode, 200);
    assert.equal(paid.updates[0].paid, true);
    assert.deepEqual(paid.generated, [["cv-id", lang]]);
    const ready = await invoke(lang, { exists: true, status: "PAID", ready: true });
    assert.equal(ready.res.statusCode, 200);
    assert.deepEqual(ready.generated, []);
  });
}
