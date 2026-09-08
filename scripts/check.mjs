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
