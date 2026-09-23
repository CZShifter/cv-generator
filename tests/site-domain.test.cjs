const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { NextRequest } = require("next/server");
const root = path.resolve(__dirname, "..");

// Load TS modules with Next's alias and a fresh cache per configuration.
function loader() {
  const cache = new Map();
  function load(file) {
    file = path.resolve(root, file);
    if (!fs.existsSync(file)) file += ".ts";
    if (cache.has(file)) return cache.get(file).exports;
    if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
    const module = { exports: {} };
    cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    const localRequire = (name) => name.startsWith("@/")
      ? load("src/" + name.slice(2))
      : name.startsWith(".") ? load(path.resolve(path.dirname(file), name)) : require(name);
    new Function("require", "module", "exports", code)(localRequire, module, module.exports);
    return module.exports;
  }
  return load;
}

async function response(load, file, host) {
  let body = "";
  const headers = {};
  await load(file).getServerSideProps({
    req: { headers: { host, "x-forwarded-proto": "https" } },
    res: {
      setHeader: (key, value) => { headers[key] = value; },
      write: (value) => { body += value; },
      end: (value = "") => { body += value; },
    },
  });
  return { body, headers };
}

const slovakHosts = ["rychlyzivotopis.sk", "zivotopisrychle.sk", "zivotopisrychlo.sk"];
for (const host of slovakHosts) {
  test("Configured domain: " + host, async () => {
    const previous = process.env.SITE_URL_SK;
    try {
      const origin = "https://" + host;
      process.env.SITE_URL_SK = origin;
      const load = loader();
      assert.equal(load("next.config.ts").default.env.SITE_URL_SK, origin);
      const site = load("src/config/site.ts");
      assert.equal(site.SITE_URL_SK, origin);
      assert.equal(site.SITE_URL, "https://rychlyzivotopis.cz");
      assert.ok(site.OG_IMAGE_SK.startsWith(origin + "/"));
      const { middleware } = load("src/middleware.ts");
      for (const [domain, prefix] of [[host, "sk"], ["rychlyzivotopis.cz", "cs"]]) {
        const result = middleware(new NextRequest("https://" + domain + "/?refId=example", { headers: { host: domain } }));
        assert.equal(result.status, 308);
        assert.equal(result.headers.get("location"), "https://" + domain + "/" + prefix + "?refId=example");
      }
      for (const domain of [host, "www." + host, "rychlyzivotopis.cz"]) {
        const { body } = await response(load, "src/pages/robots.txt.ts", domain);
        assert.ok(body.includes("Sitemap: https://" + domain + "/sitemap.xml"));
      }
      for (const name of ["sitemap-main.xml", "sitemap-profese.xml"]) {
        for (const domain of [host, "rychlyzivotopis.cz"]) {
          const { body } = await response(load, "src/pages/" + name + ".ts", domain);
          assert.ok(body.includes(origin + "/sk/"));
          assert.ok(body.includes("https://rychlyzivotopis.cz/cs/"));
          assert.ok(!body.includes("https://zivotopisrychle.cz"));
          assert.ok(!body.includes("https://zivotopisrychlo.cz"));
          for (const inactive of slovakHosts.filter(candidate => candidate !== host)) {
            assert.ok(!body.includes("https://" + inactive));
          }
        }
        const { body } = await response(load, "src/pages/" + name + ".ts", "preview.vercel.app");
        assert.ok(body.includes("https://preview.vercel.app/sk/"));
      }
      for (const name of ["llms.txt", "llms-full.txt", "humans.txt"]) {
        const { body, headers } = await response(load, "src/pages/" + name + ".ts", host);
        assert.ok(body.includes(origin));
        assert.ok(!body.includes("{{SITE_URL_SK}}"));
        assert.equal(headers["Content-Type"], "text/plain; charset=utf-8");
      }
      assert.equal(load("src/utils/baseUrl.ts").getBaseUrl({ headers: { host } }), origin);
    } finally {
      if (previous === undefined) delete process.env.SITE_URL_SK;
      else process.env.SITE_URL_SK = previous;
    }
  });
}

test("Configuration normalizes trailing slash and rejects invalid origins", () => {
  const previous = process.env.SITE_URL_SK;
  try {
    process.env.SITE_URL_SK = " https://zivotopisrychlo.sk/ ";
    assert.equal(loader()("next.config.ts").default.env.SITE_URL_SK, "https://zivotopisrychlo.sk");
    for (const value of ["http://zivotopisrychlo.sk", "https://zivotopisrychlo.sk/sk", "https://example.com"]) {
      process.env.SITE_URL_SK = value;
      assert.throws(() => loader()("next.config.ts"), /SITE_URL_SK must be/);
    }
  } finally {
    if (previous === undefined) delete process.env.SITE_URL_SK;
    else process.env.SITE_URL_SK = previous;
  }
});
