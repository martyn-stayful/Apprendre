import { schemaStatements, SCHEMA_VERSION } from './schema-sql.js';

/** Create or update the tables. Safe to re-run — every statement is idempotent. */
export async function applySchema(sql) {
  for (const statement of schemaStatements()) {
    try {
      await sql.query(statement);
    } catch (err) {
      // Without this, a migration failure surfaces as an unrelated "column does
      // not exist" on some later request, with nothing pointing at the cause.
      const first = statement.split('\n')[0].slice(0, 120);
      throw new Error(`Schema statement failed (${first}…): ${err.message}`);
    }
  }
  await sql`update schema_meta set version = ${SCHEMA_VERSION} where only_row`;
}

/**
 * Load the built-in library as shared content (user_id null). Returns a count
 * of what was written, or null if it was already there.
 */
/**
 * Load the built-in library as shared content (user_id null). Returns a count
 * of what was written, or null if it was already there.
 *
 * Row ids are generated here rather than read back from `returning id`, so the
 * whole load can go up as a handful of batched transactions instead of ~460
 * separate round-trips. Over Neon's HTTP driver that is the difference between
 * a couple of seconds and blowing the function's time budget.
 */
export async function seedBuiltins(sql, data) {
  const [{ count }] = await sql`select count(*)::int as count from decks where user_id is null`;
  if (count > 0) return null;

  const stats = {};
  const bump = (k, n = 1) => { stats[k] = (stats[k] || 0) + n; };
  const queries = [];
  const id = () => crypto.randomUUID();

  const sid = id();
  queries.push(sql`
    insert into sources (id, user_id, kind, input_type, title, status, summary, parsed_at)
    values (${sid}::uuid, null, 'builtin', 'text', 'Built-in library', 'ready',
            'The lessons, decks and workbook chapters the app shipped with.', now())`);

  let pos = 0;
  for (const [slug, deck] of Object.entries(data.decks)) {
    const deckId = id();
    const level = data.DECK_LEVELS?.[slug]?.level || null;
    queries.push(sql`
      insert into decks (id, user_id, source_id, slug, name, category, level, position)
      values (${deckId}::uuid, null, ${sid}::uuid, ${slug}, ${deck.name},
              ${deck.category || 'Vocabulary'}, ${level}, ${pos++})`);
    bump('decks');
    let cpos = 0;
    for (const card of deck.cards) {
      queries.push(sql`
        insert into cards (deck_id, fr, en, ex, level, position)
        values (${deckId}::uuid, ${card.fr}, ${card.en}, ${card.ex || ''}, ${level}, ${cpos++})`);
      bump('cards');
    }
  }

  pos = 0;
  for (const [slug, quiz] of Object.entries(data.quizzes)) {
    const quizId = id();
    queries.push(sql`
      insert into quizzes (id, user_id, source_id, slug, title, level, position)
      values (${quizId}::uuid, null, ${sid}::uuid, ${slug}, ${quiz.title},
              ${data.QUIZ_LEVELS?.[slug]?.level || null}, ${pos++})`);
    bump('quizzes');
    let qpos = 0;
    for (const q of quiz.qs) {
      queries.push(sql`
        insert into quiz_questions (quiz_id, prompt, en, opts, answer_idx, note, position)
        values (${quizId}::uuid, ${q.prompt}, ${q.en || ''},
                ${JSON.stringify(q.opts)}::jsonb, ${q.a}, ${q.note || ''}, ${qpos++})`);
      bump('questions');
    }
  }

  pos = 0;
  for (const [infinitive, v] of Object.entries(data.verbTables)) {
    queries.push(sql`
      insert into verbs (user_id, source_id, infinitive, meaning, forms, level, position)
      values (null, ${sid}::uuid, ${infinitive}, ${v.meaning || ''},
              ${JSON.stringify(v.forms)}::jsonb, ${verbLevel(data, infinitive)}, ${pos++})`);
    bump('verbs');
  }

  pos = 0;
  for (const d of data.dailyDrills) {
    queries.push(sql`
      insert into drills (user_id, source_id, cat, en, fr, note, level, position)
      values (null, ${sid}::uuid, ${d.cat || 'general'}, ${d.en}, ${d.fr}, ${d.note || ''},
              ${data.DRILL_CAT_LEVELS?.[d.cat] || null}, ${pos++})`);
    bump('drills');
  }

  pos = 0;
  for (const [slug, c] of Object.entries(data.concepts)) {
    queries.push(sql`
      insert into concepts (user_id, source_id, slug, title, subtitle, category,
                            paragraphs, table_rows, examples, pitfall, related, position)
      values (null, ${sid}::uuid, ${slug}, ${c.title}, ${c.subtitle || ''},
              ${c.category || 'A1.1'},
              ${JSON.stringify(c.paragraphs || [])}::jsonb,
              ${JSON.stringify(c.table || [])}::jsonb,
              ${JSON.stringify(c.examples || [])}::jsonb,
              ${c.pitfall ? JSON.stringify(c.pitfall) : null}::jsonb,
              ${JSON.stringify(c.related || [])}::jsonb, ${pos++})`);
    bump('concepts');
  }

  pos = 0;
  for (const s of data.stories) {
    queries.push(sql`
      insert into stories (user_id, source_id, slug, title, blurb, level, tags, focus,
                           body, translation, position)
      values (null, ${sid}::uuid, ${slugify(s.title)}, ${s.title}, ${s.blurb || ''},
              ${s.level || 'A1'},
              ${JSON.stringify(s.tags || [])}::jsonb,
              ${JSON.stringify(s.focus || [])}::jsonb,
              ${s.body}, ${s.translation || ''}, ${pos++})`);
    bump('stories');
  }

  pos = 0;
  for (const r of data.roleplays) {
    queries.push(sql`
      insert into roleplays (user_id, source_id, title, ctx, lines, notes, position)
      values (null, ${sid}::uuid, ${r.title}, ${r.ctx || ''},
              ${JSON.stringify(r.lines)}::jsonb, ${r.notes || ''}, ${pos++})`);
    bump('roleplays');
  }

  pos = 0;
  for (const g of data.grammar) {
    queries.push(sql`
      insert into grammar_notes (user_id, source_id, title, body, position)
      values (null, ${sid}::uuid, ${g.title}, ${g.body}, ${pos++})`);
    bump('grammarNotes');
  }

  pos = 0;
  for (const [slug, ch] of Object.entries(data.workbook)) {
    const chapterId = id();
    queries.push(sql`
      insert into workbook_chapters (id, user_id, source_id, slug, book, book_title, num,
                                     title, subtitle, level, rule, vocab, position)
      values (${chapterId}::uuid, null, ${sid}::uuid, ${slug}, ${ch.book || 'I'},
              ${ch.bookTitle || ''}, ${ch.num || pos + 1}, ${ch.title}, ${ch.subtitle || ''},
              ${ch.level || 'A1.1'},
              ${ch.rule ? JSON.stringify(ch.rule) : null}::jsonb,
              ${JSON.stringify(ch.vocab || [])}::jsonb, ${pos++})`);
    bump('chapters');
    let epos = 0;
    for (const ex of ch.exercises || []) {
      const exSlug = String(ex.id || `ex${epos + 1}`).replace(`${slug}-`, '');
      queries.push(sql`
        insert into workbook_exercises (chapter_id, slug, title, instructions, questions, position)
        values (${chapterId}::uuid, ${exSlug}, ${ex.title}, ${ex.instructions || ''},
                ${JSON.stringify(ex.questions)}::jsonb, ${epos++})`);
      bump('exercises');
    }
  }

  // One HTTP request per chunk rather than one per row.
  const CHUNK = 150;
  for (let i = 0; i < queries.length; i += CHUNK) {
    await sql.transaction(queries.slice(i, i + CHUNK));
  }

  return stats;
}

/**
 * Load any lesson packs (db/packs) the database doesn't have yet, as shared
 * content. Returns what was written, keyed by pack.
 *
 * Packs sit on top of the original library, so they wait for it: on a fresh
 * database, setup seeds the library and then calls this.
 */
export async function seedPacks(sql, packs) {
  const rows = await sql`
    select kind, pack from sources
     where user_id is null and kind in ('builtin', 'pack')`;
  if (!rows.some((r) => r.kind === 'builtin')) return {};

  const have = new Set(rows.map((r) => r.pack));
  const loaded = {};
  for (const pack of packs) {
    if (have.has(pack.key)) continue;
    try {
      loaded[pack.key] = await seedPack(sql, pack);
    } catch (err) {
      // Several functions cold-start together after a deploy, and each tries.
      // The unique index lets one win; for the others that's not a failure.
      const [again] = await sql`select 1 as found from sources where pack = ${pack.key}`;
      if (!again) throw err;
    }
  }
  return loaded;
}

/**
 * Write one pack. Each table goes in as a single statement over a JSON array,
 * so the whole pack is one transaction: it lands complete or not at all, and a
 * deployment never sees half a pack marked as loaded.
 */
export async function seedPack(sql, pack) {
  const id = () => crypto.randomUUID();
  const sid = id();
  // Negative positions put a pack ahead of the original library in every
  // list: it's the material from recent lessons, so it's what to see first.
  const at = (i) => i - 1000;
  const t = {
    decks: [], cards: [], quizzes: [], questions: [], verbs: [], drills: [], concepts: [],
    stories: [], roleplays: [], grammar: [], chapters: [], exercises: [],
  };

  for (const [i, d] of (pack.decks || []).entries()) {
    const deckId = id();
    t.decks.push({ id: deckId, slug: d.slug, name: d.name, category: d.category || 'Vocabulary',
                   level: d.level || null, position: at(i) });
    for (const [j, c] of d.cards.entries()) {
      t.cards.push({ deck_id: deckId, fr: c.fr, en: c.en, ex: c.ex || '', level: d.level || null, position: j });
    }
  }
  for (const [i, q] of (pack.quizzes || []).entries()) {
    const quizId = id();
    t.quizzes.push({ id: quizId, slug: q.slug, title: q.title, level: q.level || null, position: at(i) });
    for (const [j, x] of q.questions.entries()) {
      t.questions.push({ quiz_id: quizId, prompt: x.prompt, en: x.en || '', opts: x.opts,
                         answer_idx: x.answer_idx, note: x.note || '', position: j });
    }
  }
  for (const [i, v] of (pack.verbs || []).entries()) {
    t.verbs.push({ infinitive: v.infinitive, meaning: v.meaning || '', forms: v.forms,
                   level: v.level || null, position: at(i) });
  }
  for (const [i, d] of (pack.drills || []).entries()) {
    t.drills.push({ cat: d.cat, en: d.en, fr: d.fr, note: d.note || '', level: d.level || null, position: at(i) });
  }
  for (const [i, c] of (pack.concepts || []).entries()) {
    t.concepts.push({ slug: c.slug, title: c.title, subtitle: c.subtitle || '', category: c.category || 'A1.1',
                      paragraphs: c.paragraphs || [], table_rows: c.table_rows || [],
                      examples: c.examples || [], pitfall: c.pitfall?.title ? c.pitfall : null,
                      related: c.related || [], position: at(i) });
  }
  for (const [i, s] of (pack.stories || []).entries()) {
    t.stories.push({ slug: s.slug, title: s.title, blurb: s.blurb || '', level: s.level || 'A1',
                     tags: s.tags || [], focus: s.focus || [], body: s.body,
                     translation: s.translation || '', position: at(i) });
  }
  for (const [i, r] of (pack.roleplays || []).entries()) {
    t.roleplays.push({ title: r.title, ctx: r.ctx || '', lines: r.lines, notes: r.notes || '', position: at(i) });
  }
  for (const [i, g] of (pack.grammar_notes || []).entries()) {
    t.grammar.push({ title: g.title, body: g.body, position: at(i) });
  }
  for (const [i, ch] of (pack.workbook_chapters || []).entries()) {
    const chapterId = id();
    t.chapters.push({ id: chapterId, slug: ch.slug, book: ch.book || 'I', book_title: ch.book_title || '',
                      num: ch.num, title: ch.title, subtitle: ch.subtitle || '', level: ch.level || 'A1.1',
                      rule: ch.rule || null, vocab: ch.vocab || [], position: at(i) });
    for (const [j, ex] of (ch.exercises || []).entries()) {
      t.exercises.push({ chapter_id: chapterId, slug: ex.slug, title: ex.title,
                         instructions: ex.instructions || '', questions: ex.questions, position: j });
    }
  }

  const stats = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, v.length]));
  const json = (rows) => JSON.stringify(rows);

  await sql.transaction([
    sql`insert into sources (id, user_id, kind, input_type, title, status, summary, stats, pack, parsed_at)
        values (${sid}::uuid, null, 'pack', 'text', ${pack.title}, 'ready', ${pack.summary || ''},
                ${JSON.stringify(stats)}::jsonb, ${pack.key}, now())`,
    sql`insert into decks (id, user_id, source_id, slug, name, category, level, position)
        select id, null, ${sid}::uuid, slug, name, category, level, position
          from jsonb_to_recordset(${json(t.decks)}::jsonb)
            as x(id uuid, slug text, name text, category text, level text, position int)`,
    sql`insert into cards (deck_id, fr, en, ex, level, position)
        select deck_id, fr, en, ex, level, position
          from jsonb_to_recordset(${json(t.cards)}::jsonb)
            as x(deck_id uuid, fr text, en text, ex text, level text, position int)`,
    sql`insert into quizzes (id, user_id, source_id, slug, title, level, position)
        select id, null, ${sid}::uuid, slug, title, level, position
          from jsonb_to_recordset(${json(t.quizzes)}::jsonb)
            as x(id uuid, slug text, title text, level text, position int)`,
    sql`insert into quiz_questions (quiz_id, prompt, en, opts, answer_idx, note, position)
        select quiz_id, prompt, en, opts, answer_idx, note, position
          from jsonb_to_recordset(${json(t.questions)}::jsonb)
            as x(quiz_id uuid, prompt text, en text, opts jsonb, answer_idx int, note text, position int)`,
    sql`insert into verbs (user_id, source_id, infinitive, meaning, forms, level, position)
        select null, ${sid}::uuid, infinitive, meaning, forms, level, position
          from jsonb_to_recordset(${json(t.verbs)}::jsonb)
            as x(infinitive text, meaning text, forms jsonb, level text, position int)`,
    sql`insert into drills (user_id, source_id, cat, en, fr, note, level, position)
        select null, ${sid}::uuid, cat, en, fr, note, level, position
          from jsonb_to_recordset(${json(t.drills)}::jsonb)
            as x(cat text, en text, fr text, note text, level text, position int)`,
    sql`insert into concepts (user_id, source_id, slug, title, subtitle, category,
                              paragraphs, table_rows, examples, pitfall, related, position)
        select null, ${sid}::uuid, slug, title, subtitle, category,
               paragraphs, table_rows, examples, pitfall, related, position
          from jsonb_to_recordset(${json(t.concepts)}::jsonb)
            as x(slug text, title text, subtitle text, category text, paragraphs jsonb,
                 table_rows jsonb, examples jsonb, pitfall jsonb, related jsonb, position int)`,
    sql`insert into stories (user_id, source_id, slug, title, blurb, level, tags, focus,
                             body, translation, position)
        select null, ${sid}::uuid, slug, title, blurb, level, tags, focus, body, translation, position
          from jsonb_to_recordset(${json(t.stories)}::jsonb)
            as x(slug text, title text, blurb text, level text, tags jsonb, focus jsonb,
                 body text, translation text, position int)`,
    sql`insert into roleplays (user_id, source_id, title, ctx, lines, notes, position)
        select null, ${sid}::uuid, title, ctx, lines, notes, position
          from jsonb_to_recordset(${json(t.roleplays)}::jsonb)
            as x(title text, ctx text, lines jsonb, notes text, position int)`,
    sql`insert into grammar_notes (user_id, source_id, title, body, position)
        select null, ${sid}::uuid, title, body, position
          from jsonb_to_recordset(${json(t.grammar)}::jsonb)
            as x(title text, body text, position int)`,
    sql`insert into workbook_chapters (id, user_id, source_id, slug, book, book_title, num,
                                       title, subtitle, level, rule, vocab, position)
        select id, null, ${sid}::uuid, slug, book, book_title, num, title, subtitle, level,
               rule, vocab, position
          from jsonb_to_recordset(${json(t.chapters)}::jsonb)
            as x(id uuid, slug text, book text, book_title text, num int, title text,
                 subtitle text, level text, rule jsonb, vocab jsonb, position int)`,
    sql`insert into workbook_exercises (chapter_id, slug, title, instructions, questions, position)
        select chapter_id, slug, title, instructions, questions, position
          from jsonb_to_recordset(${json(t.exercises)}::jsonb)
            as x(chapter_id uuid, slug text, title text, instructions text, questions jsonb, position int)`,
  ]);

  return stats;
}

/** VERB_LEVELS uses accented infinitives; verbTables does not. Match either. */
function verbLevel(data, infinitive) {
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
  return stripAccents(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
