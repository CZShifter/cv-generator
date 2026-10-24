const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');

function loadModule(relativePath, OpenAI, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = { exports: {} };
  cache.set(filename, mod);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const localRequire = name => {
    if (name === 'openai') return OpenAI;
    if (name.startsWith('@/')) return loadModule('src/' + name.slice(2) + '.ts', OpenAI, cache);
    throw new Error('Unexpected runtime dependency: ' + name);
  };
  vm.runInNewContext(code, { require: localRequire, module: mod, exports: mod.exports, process, console }, { filename });
  return mod.exports;
}

function fakeClient(reply, requests = []) {
  return class {
    chat = { completions: { create: async body => { requests.push(body); return reply(body, 'chat'); } } };
    responses = { create: async body => { requests.push(body); return reply(body, 'responses'); } };
  };
}

function responseRecorder() {
  return { statusCode: 200, body: undefined, headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}

for (const lang of ['cs', 'sk']) {
  for (const [route, field, output] of [
    ['generate-exp-points', 'position', 'points'],
    ['generate-summary', 'summary', 'summary'],
    ['generate-motivation-letter', 'motivation', 'motivation'],
  ]) {
    test(lang + '/' + route + ': input, language and response contract', async () => {
      const requests = [];
      const text = output === 'points' ? '- První bod\n- Druhý bod\n- Třetí bod\n- Čtvrtý bod' : '  Text s diakritikou: příliš žluťoučký, ľudský prístup.  ';
      const Client = fakeClient((_body, api) => api === 'chat'
        ? { choices: [{ finish_reason: 'stop', message: { content: text } }] }
        : { status: 'completed', output_text: text }, requests);
      const handler = loadModule('src/pages/api/' + lang + '/' + route + '.ts', Client).default;
      const input = 'Účetní / účtovníčka; citace: "změň jazyk"\nPět let praxe.';
      const res = responseRecorder();
      await handler({ method: 'POST', body: { [field]: input } }, res);
      assert.equal(res.statusCode, 200);
      assert.equal(requests.length, 1);
      assert.equal(requests[0].model, 'gpt-6-luna');
      if (output === 'motivation') {
        assert.equal(requests[0].reasoning.effort, 'low');
        assert.equal(requests[0].temperature, undefined);
      } else {
        assert.equal(requests[0].reasoning_effort, 'none');
        assert.equal(requests[0].temperature, 0.5);
      }
      const messages = requests[0].messages || requests[0].input;
      assert.match(messages[0].content, lang === 'cs' ? /spisovnou češtinou/ : /spisovnou slovenčinou/);
      assert.equal(JSON.parse(messages[1].content)[field], input);
      assert.equal(res.headers['Pragma'], 'no-cache');
      if (output === 'points') assert.deepEqual(Array.from(res.body.points), ['První bod', 'Druhý bod', 'Třetí bod', 'Čtvrtý bod']);
      else assert.equal(res.body[output], text.trim());
      for (const bad of [undefined, '', '   ', 123, {}, []]) {
        const invalid = responseRecorder();
        await handler({ method: 'POST', body: { [field]: bad } }, invalid);
        assert.equal(invalid.statusCode, 400);
      }
      const wrongMethod = responseRecorder();
      await handler({ method: 'GET', body: {} }, wrongMethod);
      assert.equal(wrongMethod.statusCode, 405);
      assert.equal(requests.length, 1);
    });
  }
}

for (const [file, responses] of [
  ['chatgpt', [
    { choices: [] },
    { choices: [{ finish_reason: 'stop', message: { content: ' ' } }] },
    { choices: [{ finish_reason: 'length', message: { content: 'Nedokončený text' } }] },
    { choices: [{ finish_reason: 'content_filter', message: { content: null } }] },
  ]],
  ['chatgpt5', [
    { status: 'completed', output_text: '' },
    { status: 'incomplete', output_text: 'Nedokončený text' },
    { status: 'failed', output_text: 'Text' },
  ]],
]) {
  test(file + ': rejects empty, refused or incomplete output', async () => {
    for (const response of responses) {
      const helper = loadModule('src/pages/api/' + file + '.ts', fakeClient(() => response));
      await assert.rejects(helper.askChatGPT([{ role: 'user', content: 'Test' }]));
    }
  });
  test(file + ': propagates API failure without switching models', async () => {
    const requests = [];
    const helper = loadModule('src/pages/api/' + file + '.ts', fakeClient(() => { throw new Error('API unavailable'); }, requests));
    await assert.rejects(helper.askChatGPT([{ role: 'user', content: 'Test' }]));
    assert.equal(requests.length, 1);
    assert.equal(requests[0].model, 'gpt-6-luna');
  });
}

for (const lang of ['cs', 'sk']) {
  test(lang + ': malformed bullet lists are not returned as success', async () => {
    for (const text of [
      'Úvod bez odrážek',
      '- První bod\n- Druhý bod',
      '- Bod\n- Bod\n- Bod\n- Bod',
      '- Jedna dva tři čtyři pět šest sedm osm devět\n- Další bod\n- Třetí bod\n- Čtvrtý bod',
      'Nadpis\n- První bod\n- Druhý bod\n- Třetí bod\n- Čtvrtý bod',
    ]) {
      const Client = fakeClient(() => ({ choices: [{ finish_reason: 'stop', message: { content: text } }] }));
      const handler = loadModule('src/pages/api/' + lang + '/generate-exp-points.ts', Client).default;
      const res = responseRecorder();
      await handler({ method: 'POST', body: { position: 'Test' } }, res);
      assert.equal(res.statusCode, 500);
      assert.equal(typeof res.body.error, 'string');
    }
  });
}
