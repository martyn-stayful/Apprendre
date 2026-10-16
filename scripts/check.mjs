// Quick sanity pass before deploying: every API module imports, the parser's
// schema still converts to a strict JSON schema, and index.html's inline
// scripts parse. Catches the mistakes that would otherwise surface as a
// broken deployment.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
const ok = (msg) => console.log(`  ok    ${msg}`);
const bad = (msg, err) => { failures++; console.log(`  FAIL  ${msg}\n        ${err}`); };

console.log('\nAPI modules');
const routes = [];
for (const dir of ['api', 'api/auth', 'api/uploads', 'api/_lib']) {
  for (const file of fs.readdirSync(path.join(root, dir))) {
    if (file.endsWith('.js')) routes.push(`${dir}/${file}`);
  }
}
for (const route of routes.sort()) {
  try { await import(path.join(root, route)); ok(route); }
  catch (err) { bad(route, err.message); }
}

console.log('\nParser schema');
try {
  const { zodOutputFormat } = await import('@anthropic-ai/sdk/helpers/zod');
  const { ParsedContent } = await import(path.join(root, 'api/_lib/schema.js'));
  const format = zodOutputFormat(ParsedContent, 'lesson_content');
  if (format.schema.additionalProperties !== false) throw new Error('schema is not strict');
  ok(`converts to a strict JSON schema (${format.schema.required.length} sections)`);
} catch (err) { bad('parser schema', err.message); }

console.log('\nSchema');
try {
  const { SCHEMA_SQL } = await import(path.join(root, 'api/_lib/schema-sql.js'));
  const onDisk = fs.readFileSync(path.join(root, 'db/schema.sql'), 'utf8');
  if (SCHEMA_SQL !== onDisk) throw new Error('db/schema.sql is out of date — run: npm run schema');
  ok('db/schema.sql matches api/_lib/schema-sql.js');
} catch (err) { bad('schema', err.message); }

console.log('\nBuilt-in content');
try {
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'db/seed-content.json'), 'utf8'));
  const cards = Object.values(seed.decks).reduce((n, d) => n + d.cards.length, 0);
  ok(`${Object.keys(seed.decks).length} decks, ${cards} cards, ${seed.dailyDrills.length} drills`);
} catch (err) { bad('db/seed-content.json', err.message); }

console.log('\nLesson packs');
try {
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'db/seed-content.json'), 'utf8'));
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const { PACKS } = await import(path.join(root, 'db/packs/index.js'));
  for (const pack of PACKS) {
    const problems = checkPack(pack, seed, html);
    if (problems.length) bad(`pack ${pack.key}`, problems.join('\n        '));
    else ok(`${pack.key}: ${packSummary(pack)}`);
  }
} catch (err) { bad('db/packs', err.message); }

console.log('\nFrontend');
try {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 3) throw new Error(`expected 3 inline scripts, found ${blocks.length}`);
  blocks.forEach((code, i) => new vm.Script(code, { filename: `index.html script ${i + 1}` }));
  ok(`${blocks.length} inline scripts parse`);
  for (const name of ['bootApp', 'renderUpload', 'submitAuth', 'window.Store', 'window.Api']) {
    if (!html.includes(name)) throw new Error(`${name} is missing from index.html`);
  }
  ok('boot, auth, store and upload entry points present');
} catch (err) { bad('index.html', err.message); }

console.log(failures ? `\n${failures} problem(s) found` : '\nAll checks passed');
process.exit(failures ? 1 : 0);

/**
 * A pack is hand-written and loads into every account, and a slug clash with
 * the built-in library would fail the whole load — so catch it here.
 */
function checkPack(pack, seed, html) {
  const out = [];
  const fail = (msg) => out.push(msg);
  const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  // Progress is stored per item under a lower-cased key, so two items that
  // only differ in case would share a record.
  const key = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
  const unique = (what, values, taken = []) => {
    const seen = new Set(taken.map(key));
    for (const v of values) {
      if (seen.has(key(v))) fail(`${what} "${v}" is used twice (or by the built-in library)`);
      seen.add(key(v));
    }
  };

  if (!pack.key || !pack.title) fail('a pack needs a key and a title');

  unique('deck slug', (pack.decks || []).map((d) => d.slug), Object.keys(seed.decks));
  for (const d of pack.decks || []) {
    if (!d.cards?.length) fail(`deck ${d.slug} has no cards`);
    if ((d.cards || []).some((c) => !c.fr || !c.en)) fail(`deck ${d.slug} has a card missing fr or en`);
    unique(`card in ${d.slug}`, (d.cards || []).map((c) => c.fr));
  }

  unique('quiz slug', (pack.quizzes || []).map((q) => q.slug), Object.keys(seed.quizzes));
  for (const q of pack.quizzes || []) {
    unique(`question in ${q.slug}`, q.questions.map((x) => x.prompt));
    for (const x of q.questions) {
      if (!Array.isArray(x.opts) || x.opts.length < 2) fail(`${q.slug}: "${x.prompt}" needs options`);
      else if (!(x.answer_idx >= 0 && x.answer_idx < x.opts.length)) fail(`${q.slug}: "${x.prompt}" has no valid answer`);
      else if (new Set(x.opts).size !== x.opts.length) fail(`${q.slug}: "${x.prompt}" repeats an option`);
    }
  }

  const seedVerbs = Object.keys(seed.verbTables).map(fold);
  for (const v of pack.verbs || []) {
    if (seedVerbs.includes(fold(v.infinitive))) fail(`verb ${v.infinitive} is already in the built-in library`);
    const persons = ['je', 'tu', 'il/elle/on', 'nous', 'vous', 'ils/elles'];
    if (persons.some((p) => !v.forms?.[p])) fail(`verb ${v.infinitive} is missing a form`);
  }
  unique('verb', (pack.verbs || []).map((v) => fold(v.infinitive)));

  // The Daily 10 screen only offers the categories index.html lists.
  const block = html.match(/const drillCategories = \[([\s\S]*?)\];/);
  const cats = new Set(block ? [...block[1].matchAll(/key: '(\w+)'/g)].map((m) => m[1]) : []);
  for (const d of pack.drills || []) {
    if (!cats.has(d.cat)) fail(`drill category "${d.cat}" isn't in drillCategories in index.html`);
    if (!d.en || !d.fr) fail(`a drill in ${d.cat} is missing en or fr`);
  }

  unique('concept slug', (pack.concepts || []).map((c) => c.slug), Object.keys(seed.concepts));

  const seedStories = seed.stories.map((s) => fold(s.title).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
  unique('story slug', (pack.stories || []).map((s) => s.slug), seedStories);
  for (const s of pack.stories || []) {
    const opened = (s.body.match(/\[\[/g) || []).length;
    const glosses = [...s.body.matchAll(/\[\[([^\]|]+)\|([^\]|]+)(?:\|([^\]]+))?\]\]/g)].length;
    if (opened !== glosses) fail(`story ${s.slug} has a malformed [[french|english]] gloss`);
  }

  for (const r of pack.roleplays || []) {
    if (!r.lines?.length || r.lines.some((l) => !['them', 'you'].includes(l.who) || !l.fr || !l.en)) {
      fail(`role-play "${r.title}" has a bad line`);
    }
  }

  unique('workbook chapter slug', (pack.workbook_chapters || []).map((c) => c.slug), Object.keys(seed.workbook));
  for (const ch of pack.workbook_chapters || []) {
    if (!ch.rule?.heading) fail(`chapter ${ch.slug} needs a rule heading`);
    unique(`exercise in ${ch.slug}`, (ch.exercises || []).map((e) => e.slug));
    for (const ex of ch.exercises || []) {
      const where = `${ch.slug}/${ex.slug}`;
      unique(`question in ${where}`, ex.questions.map((q) => q.prompt));
      const withOptions = ex.questions.filter((q) => q.options);
      // The app treats an exercise as multiple choice only if every question has options.
      if (withOptions.length && withOptions.length !== ex.questions.length) {
        fail(`${where} mixes multiple-choice and typed questions`);
      }
      for (const q of ex.questions) {
        if (!q.prompt || !q.answer) fail(`${where}: a question is missing its prompt or answer`);
        if (q.options && !q.options.includes(q.answer)) fail(`${where}: "${q.prompt}" — the answer isn't one of the options`);
      }
    }
  }

  return out;
}

function packSummary(pack) {
  const n = (k) => (pack[k] || []).length;
  const cards = (pack.decks || []).reduce((sum, d) => sum + d.cards.length, 0);
  const qs = (pack.quizzes || []).reduce((sum, q) => sum + q.questions.length, 0);
  const exercises = (pack.workbook_chapters || []).reduce((sum, c) => sum + c.exercises.length, 0);
  return `${n('drills')} drills, ${n('roleplays')} role-plays, ${n('decks')} decks (${cards} cards), ` +
    `${n('quizzes')} quizzes (${qs} questions), ${n('verbs')} verbs, ${n('concepts')} explainers, ` +
    `${n('grammar_notes')} notes, ${n('stories')} stories, ${n('workbook_chapters')} chapters (${exercises} exercises)`;
}
