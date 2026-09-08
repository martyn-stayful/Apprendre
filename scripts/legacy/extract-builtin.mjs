// ONE-TIME MIGRATION — already run; kept for provenance.
//
// Before this app had a database, every deck, quiz, story and workbook chapter
// was a JavaScript object literal inside index.html. This script pulled them out
// into db/seed-content.json, which is now the source of truth for the built-in
// library and is committed to the repository.
//
// index.html no longer contains those literals, so running this against the
// current file will fail by design. To re-run it, check out a commit from
// before the Neon migration.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const htmlPath = path.join(root, 'index.html');
const outPath = path.join(root, 'db', 'seed-content.json');

const html = fs.readFileSync(htmlPath, 'utf8');

const open = html.indexOf('<script>');
const close = html.lastIndexOf('</script>');
if (open === -1 || close === -1) throw new Error('No inline <script> block found in index.html');
const script = html.slice(open + '<script>'.length, close);

// Everything before this comment is data + pure helpers.
const MARKER = 'STATE + NAV';
const markerAt = script.indexOf(MARKER);
if (markerAt === -1 || !script.includes('const decks = {')) {
  throw new Error(
    'index.html no longer holds the built-in content as object literals — it now loads\n' +
    'them from Neon. db/seed-content.json is the source of truth. This script only runs\n' +
    'against a pre-migration index.html.'
  );
}
const dataSection = script.slice(0, script.lastIndexOf('/* =', markerAt));

// Minimal browser stubs — the data section touches window and localStorage.
const store = new Map();
const sandbox = {
  console,
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  navigator: { userAgent: 'node', language: 'en-GB' },
  Intl,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

const context = vm.createContext(sandbox);
const WANTED = [
  'decks', 'quizzes', 'verbTables', 'roleplays', 'grammar',
  'dailyDrills', 'drillCategories', 'stories', 'workbook', 'concepts',
  'CONCEPT_MAP', 'DECK_LEVELS', 'QUIZ_LEVELS', 'VERB_LEVELS',
  'DRILL_CAT_LEVELS', 'STORY_LEVELS',
];

// DECK_LEVELS and friends live below the marker, so grab those declarations too.
const extras = WANTED.filter((n) => !dataSection.includes(`const ${n}`))
  .map((name) => {
    const decl = `const ${name} = `;
    const start = script.indexOf(decl);
    if (start === -1) return '';
    // Walk to the matching close brace of the object literal.
    const braceAt = script.indexOf('{', start);
    if (braceAt === -1) return '';
    let depth = 0;
    let i = braceAt;
    for (; i < script.length; i++) {
      const ch = script[i];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    return script.slice(start, i) + ';\n';
  })
  .join('\n');

// `const` bindings stay lexical inside the VM, so hand them back explicitly.
const collect = `__extracted = { ${WANTED.map((n) => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(', ')} };`;

vm.runInContext(`${dataSection}\n${extras}\n${collect}\n`, context, { filename: 'index-data.js' });

const out = sandbox.__extracted || {};
const missing = WANTED.filter((n) => out[n] === undefined);
if (missing.length) throw new Error(`Missing after evaluation: ${missing.join(', ')}`);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

const count = (v) => (Array.isArray(v) ? v.length : Object.keys(v).length);
console.log(`Wrote ${path.relative(root, outPath)}`);
for (const name of WANTED) console.log(`  ${name.padEnd(18)} ${count(out[name])}`);
