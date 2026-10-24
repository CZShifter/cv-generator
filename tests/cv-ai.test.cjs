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
      const text = output === 'points' ? '- První bod\n- Druhý bod\n- Třetí bod\n- Čtvrtý bod' : output === 'summary'
        ? 'Jsem astrofyzik a studuji černé díry. Vlastní teleskop mi umožňuje být v kontaktu s noční oblohou. Zajímá mě propojení pozorování s teorií a hledání souvislostí, které pomáhají lépe porozumět fungování vesmíru.'
        : '  Text s diakritikou: příliš žluťoučký, ľudský prístup.  ';
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
        assert.equal(requests[0].reasoning.effort, 'medium');
        assert.equal(requests[0].temperature, undefined);
      } else if (output === 'summary') {
        assert.equal(requests[0].reasoning.effort, 'low');
        assert.equal(requests[0].temperature, undefined);
      } else {
        assert.equal(requests[0].reasoning_effort, 'none');
        assert.equal(requests[0].temperature, 0.5);
      }
      const messages = requests[0].messages || requests[0].input;
      assert.match(messages[0].content, lang === 'cs' ? /spisovnou češtin(?:ou|u)/ : /spisovn(?:ou slovenčinou|ú slovenčinu)/);
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

const developedBio = 'Jsem astrofyzik a studuji černé díry. Vlastní teleskop mi umožňuje být v kontaktu s noční oblohou. Zajímá mě propojení pozorování s teorií a hledání souvislostí, které pomáhají lépe porozumět fungování vesmíru.';

test('summary revises a one-line paraphrase once on Luna', async () => {
  const requests = [];
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: requests.length === 1 ? 'Jsem astrofyzik.' : developedBio }), requests));
  const messages = [{ role: 'system', content: 'Piš česky.' }, { role: 'user', content: 'Astrofyzik' }];
  assert.equal(await helper.askSummary(messages), developedBio);
  assert.equal(requests.length, 2);
  assert.equal(requests[1].input[0].content, 'Piš česky.');
  assert.equal(requests[1].input[1].content, 'Astrofyzik');
  for (const request of requests) {
    assert.equal(request.model, 'gpt-6-luna');
    assert.equal(request.reasoning.effort, 'low');
    assert.equal(request.max_output_tokens, 1600);
  }
});

test('summary revision is bounded and does not accept another short or oversized text', async () => {
  for (const output of ['Pouze krátká věta.', 'slovo '.repeat(71)]) {
    const requests = [];
    const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: output }), requests));
    await assert.rejects(helper.askSummary([{ role: 'user', content: 'Účetní' }]));
    assert.equal(requests.length, 2);
  }
});

test('summary returns one paragraph and preserves Czech diacritics', async () => {
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: developedBio.replace('Vlastní', '\n\nVlastní') })));
  assert.equal(await helper.askSummary([{ role: 'user', content: 'Astrofyzik' }]), developedBio);
});

test('letters normalize escaped and Markdown line breaks without removing actual content', async () => {
  const slash = String.fromCharCode(92);
  const escaped = 'Vážená paní Nováková,' + slash + 'n' + slash + 'nText dopisu.' + slash + '\n' + slash + '\nS pozdravem  \r\nJan Novák';
  const requests = [];
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: escaped }), requests));
  assert.equal(await helper.askChatGPT([{ role: 'user', content: 'Test' }]), 'Vážená paní Nováková,\n\nText dopisu.\n\nS pozdravem\nJan Novák');
  assert.equal(requests[0].reasoning.effort, 'medium');
  assert.equal(requests[0].max_output_tokens, 3200);
});

test('summary rejects incomplete output without attempting to polish a truncated response', async () => {
  const requests = [];
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'incomplete', output_text: developedBio }), requests));
  await assert.rejects(helper.askSummary([{ role: 'user', content: 'Astrofyzik' }]));
  assert.equal(requests.length, 1);
});

test('letter repairs unresolved gender alternatives once, preserving the original request', async () => {
  const requests = [];
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: requests.length === 1 ? 'Chtěl/a bych pracovat ve společnosti Delta.' : 'Mám zájem o práci ve společnosti Delta.' }), requests));
  assert.equal(await helper.askChatGPT([{ role: 'user', content: 'Jsem účetní. Firma Delta.' }]), 'Mám zájem o práci ve společnosti Delta.');
  assert.equal(requests.length, 2);
  assert.equal(requests[1].input[0].content, 'Jsem účetní. Firma Delta.');
  assert.equal(requests[1].model, 'gpt-6-luna');
});

test('letter does not return unresolved gender alternatives after its bounded repair', async () => {
  const requests = [];
  const helper = loadModule('src/pages/api/chatgpt5.ts', fakeClient(() => ({ status: 'completed', output_text: 'Rád/a přijdu na setkání.' }), requests));
  await assert.rejects(helper.askChatGPT([{ role: 'user', content: 'Účetní' }]));
  assert.equal(requests.length, 2);
});
