import { schemaStatements } from './schema-sql.js';

/** Create the tables. Safe to re-run — everything is IF NOT EXISTS. */
export async function applySchema(sql) {
  for (const statement of schemaStatements()) await sql.query(statement);
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
