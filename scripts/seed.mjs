// Set up the Neon database and load the built-in content library.
//
//   node scripts/seed.mjs --schema        create tables, then seed
//   node scripts/seed.mjs                 seed only (safe to re-run)
//   node scripts/seed.mjs --schema --reset  wipe built-in content first
//
// Built-in content is stored with user_id = NULL, so every learner sees it.
// Re-running replaces the built-in rows and leaves learners' own uploads and
// all progress untouched.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Export it, or run with `vercel env pull` first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const seedPath = path.join(root, 'db', 'seed-content.json');
if (!fs.existsSync(seedPath)) {
  console.error(`${path.relative(root, seedPath)} is missing. Run: npm run extract`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

if (args.has('--schema')) {
  console.log('Applying schema...');
  const ddl = fs.readFileSync(path.join(root, 'db', 'schema.sql'), 'utf8');
  for (const statement of splitStatements(ddl)) await sql.query(statement);
  console.log('  schema ready');
}

if (args.has('--reset')) {
  console.log('Removing existing built-in content...');
  await sql`delete from sources where user_id is null`;
  for (const t of ['decks', 'quizzes', 'verbs', 'drills', 'concepts', 'stories',
                   'roleplays', 'grammar_notes', 'workbook_chapters']) {
    await sql.query(`delete from ${t} where user_id is null`);
  }
}

const [{ count }] = await sql`select count(*)::int as count from decks where user_id is null`;
if (count > 0 && !args.has('--reset')) {
  console.log(`Built-in content is already loaded (${count} decks). Use --reset to replace it.`);
  process.exit(0);
}

const [source] = await sql`
  insert into sources (user_id, kind, input_type, title, status, summary, parsed_at)
  values (null, 'builtin', 'text', 'Built-in library', 'ready',
          'The lessons, decks and workbook chapters the app shipped with.', now())
  returning id`;
const sid = source.id;

const stats = {};
const bump = (k, n = 1) => { stats[k] = (stats[k] || 0) + n; };

// ---- decks ---------------------------------------------------------------
let pos = 0;
for (const [slug, deck] of Object.entries(data.decks)) {
  const level = data.DECK_LEVELS?.[slug]?.level || null;
  const [row] = await sql`
    insert into decks (user_id, source_id, slug, name, category, level, position)
    values (null, ${sid}::uuid, ${slug}, ${deck.name}, ${deck.category || 'Vocabulary'},
            ${level}, ${pos++})
    returning id`;
  bump('decks');
  let cpos = 0;
  for (const card of deck.cards) {
    await sql`
      insert into cards (deck_id, fr, en, ex, level, position)
      values (${row.id}::uuid, ${card.fr}, ${card.en}, ${card.ex || ''}, ${level}, ${cpos++})`;
    bump('cards');
  }
}

// ---- quizzes -------------------------------------------------------------
pos = 0;
for (const [slug, quiz] of Object.entries(data.quizzes)) {
  const [row] = await sql`
    insert into quizzes (user_id, source_id, slug, title, level, position)
    values (null, ${sid}::uuid, ${slug}, ${quiz.title}, ${data.QUIZ_LEVELS?.[slug]?.level || null}, ${pos++})
    returning id`;
  bump('quizzes');
  let qpos = 0;
  for (const q of quiz.qs) {
    await sql`
      insert into quiz_questions (quiz_id, prompt, en, opts, answer_idx, note, position)
      values (${row.id}::uuid, ${q.prompt}, ${q.en || ''},
              ${JSON.stringify(q.opts)}::jsonb, ${q.a}, ${q.note || ''}, ${qpos++})`;
    bump('questions');
  }
}

// ---- verbs ---------------------------------------------------------------
pos = 0;
for (const [infinitive, v] of Object.entries(data.verbTables)) {
  await sql`
    insert into verbs (user_id, source_id, infinitive, meaning, forms, level, position)
    values (null, ${sid}::uuid, ${infinitive}, ${v.meaning || ''},
            ${JSON.stringify(v.forms)}::jsonb, ${verbLevel(infinitive)}, ${pos++})`;
  bump('verbs');
}

// ---- drills --------------------------------------------------------------
pos = 0;
for (const d of data.dailyDrills) {
  await sql`
    insert into drills (user_id, source_id, cat, en, fr, note, level, position)
    values (null, ${sid}::uuid, ${d.cat || 'general'}, ${d.en}, ${d.fr}, ${d.note || ''},
            ${data.DRILL_CAT_LEVELS?.[d.cat] || null}, ${pos++})`;
  bump('drills');
}

// ---- concepts ------------------------------------------------------------
pos = 0;
for (const [slug, c] of Object.entries(data.concepts)) {
  await sql`
    insert into concepts (user_id, source_id, slug, title, subtitle, category,
                          paragraphs, table_rows, examples, pitfall, related, position)
    values (null, ${sid}::uuid, ${slug}, ${c.title}, ${c.subtitle || ''}, ${c.category || 'A1.1'},
            ${JSON.stringify(c.paragraphs || [])}::jsonb,
            ${JSON.stringify(c.table || [])}::jsonb,
            ${JSON.stringify(c.examples || [])}::jsonb,
            ${c.pitfall ? JSON.stringify(c.pitfall) : null}::jsonb,
            ${JSON.stringify(c.related || [])}::jsonb, ${pos++})`;
  bump('concepts');
}

// ---- stories -------------------------------------------------------------
pos = 0;
for (const s of data.stories) {
  const slug = slugify(s.title);
  await sql`
    insert into stories (user_id, source_id, slug, title, blurb, level, tags, focus,
                         body, translation, position)
    values (null, ${sid}::uuid, ${slug}, ${s.title}, ${s.blurb || ''}, ${s.level || 'A1'},
            ${JSON.stringify(s.tags || [])}::jsonb,
            ${JSON.stringify(s.focus || [])}::jsonb,
            ${s.body}, ${s.translation || ''}, ${pos++})`;
  bump('stories');
}

// ---- roleplays -----------------------------------------------------------
pos = 0;
for (const r of data.roleplays) {
  await sql`
    insert into roleplays (user_id, source_id, title, ctx, lines, notes, position)
    values (null, ${sid}::uuid, ${r.title}, ${r.ctx || ''},
            ${JSON.stringify(r.lines)}::jsonb, ${r.notes || ''}, ${pos++})`;
  bump('roleplays');
}

// ---- grammar notes -------------------------------------------------------
pos = 0;
for (const g of data.grammar) {
  await sql`
    insert into grammar_notes (user_id, source_id, title, body, position)
    values (null, ${sid}::uuid, ${g.title}, ${g.body}, ${pos++})`;
  bump('grammarNotes');
}

// ---- workbook ------------------------------------------------------------
pos = 0;
for (const [slug, ch] of Object.entries(data.workbook)) {
  const [row] = await sql`
    insert into workbook_chapters (user_id, source_id, slug, book, book_title, num,
                                   title, subtitle, level, rule, vocab, position)
    values (null, ${sid}::uuid, ${slug}, ${ch.book || 'I'}, ${ch.bookTitle || ''},
            ${ch.num || pos + 1}, ${ch.title}, ${ch.subtitle || ''}, ${ch.level || 'A1.1'},
            ${ch.rule ? JSON.stringify(ch.rule) : null}::jsonb,
            ${JSON.stringify(ch.vocab || [])}::jsonb, ${pos++})
    returning id`;
  bump('chapters');
  let epos = 0;
  for (const ex of ch.exercises || []) {
    // Existing ids look like "ch02-ex1"; keep just the exercise part as the slug.
    const exSlug = String(ex.id || `ex${epos + 1}`).replace(`${slug}-`, '');
    await sql`
      insert into workbook_exercises (chapter_id, slug, title, instructions, questions, position)
      values (${row.id}::uuid, ${exSlug}, ${ex.title}, ${ex.instructions || ''},
              ${JSON.stringify(ex.questions)}::jsonb, ${epos++})`;
    bump('exercises');
  }
}

console.log('\nSeeded the built-in library:');
for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(14)} ${v}`);

/** VERB_LEVELS uses accented infinitives; verbTables does not. Match either. */
function verbLevel(infinitive) {
  const exact = data.VERB_LEVELS?.[infinitive];
  if (exact) return exact.level || null;
  const want = stripAccents(infinitive);
  for (const [key, value] of Object.entries(data.VERB_LEVELS || {})) {
    if (stripAccents(key) === want) return value.level || null;
  }
  return null;
}

function stripAccents(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

/** Split a .sql file into statements, ignoring semicolons inside $$ blocks. */
function splitStatements(ddl) {
  return ddl
    .split(/;\s*$/m)
    .map((s) => s.replace(/^\s*--.*$/gm, '').trim())
    .filter(Boolean);
}
