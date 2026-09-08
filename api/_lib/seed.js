import { schemaStatements } from './schema-sql.js';

/** Create the tables. Safe to re-run — everything is IF NOT EXISTS. */
export async function applySchema(sql) {
  for (const statement of schemaStatements()) await sql.query(statement);
}

/**
 * Load the built-in library as shared content (user_id null). Returns a count
 * of what was written, or null if it was already there.
 */
export async function seedBuiltins(sql, data) {
  const [{ count }] = await sql`select count(*)::int as count from decks where user_id is null`;
  if (count > 0) return null;

  const stats = {};
  const bump = (k, n = 1) => { stats[k] = (stats[k] || 0) + n; };

  const [source] = await sql`
    insert into sources (user_id, kind, input_type, title, status, summary, parsed_at)
    values (null, 'builtin', 'text', 'Built-in library', 'ready',
            'The lessons, decks and workbook chapters the app shipped with.', now())
    returning id`;
  const sid = source.id;

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

  pos = 0;
  for (const [slug, quiz] of Object.entries(data.quizzes)) {
    const [row] = await sql`
      insert into quizzes (user_id, source_id, slug, title, level, position)
      values (null, ${sid}::uuid, ${slug}, ${quiz.title},
              ${data.QUIZ_LEVELS?.[slug]?.level || null}, ${pos++})
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

  pos = 0;
  for (const [infinitive, v] of Object.entries(data.verbTables)) {
    await sql`
      insert into verbs (user_id, source_id, infinitive, meaning, forms, level, position)
      values (null, ${sid}::uuid, ${infinitive}, ${v.meaning || ''},
              ${JSON.stringify(v.forms)}::jsonb, ${verbLevel(data, infinitive)}, ${pos++})`;
    bump('verbs');
  }

  pos = 0;
  for (const d of data.dailyDrills) {
    await sql`
      insert into drills (user_id, source_id, cat, en, fr, note, level, position)
      values (null, ${sid}::uuid, ${d.cat || 'general'}, ${d.en}, ${d.fr}, ${d.note || ''},
              ${data.DRILL_CAT_LEVELS?.[d.cat] || null}, ${pos++})`;
    bump('drills');
  }

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

  pos = 0;
  for (const s of data.stories) {
    await sql`
      insert into stories (user_id, source_id, slug, title, blurb, level, tags, focus,
                           body, translation, position)
      values (null, ${sid}::uuid, ${slugify(s.title)}, ${s.title}, ${s.blurb || ''},
              ${s.level || 'A1'},
              ${JSON.stringify(s.tags || [])}::jsonb,
              ${JSON.stringify(s.focus || [])}::jsonb,
              ${s.body}, ${s.translation || ''}, ${pos++})`;
    bump('stories');
  }

  pos = 0;
  for (const r of data.roleplays) {
    await sql`
      insert into roleplays (user_id, source_id, title, ctx, lines, notes, position)
      values (null, ${sid}::uuid, ${r.title}, ${r.ctx || ''},
              ${JSON.stringify(r.lines)}::jsonb, ${r.notes || ''}, ${pos++})`;
    bump('roleplays');
  }

  pos = 0;
  for (const g of data.grammar) {
    await sql`
      insert into grammar_notes (user_id, source_id, title, body, position)
      values (null, ${sid}::uuid, ${g.title}, ${g.body}, ${pos++})`;
    bump('grammarNotes');
  }

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
      const exSlug = String(ex.id || `ex${epos + 1}`).replace(`${slug}-`, '');
      await sql`
        insert into workbook_exercises (chapter_id, slug, title, instructions, questions, position)
        values (${row.id}::uuid, ${exSlug}, ${ex.title}, ${ex.instructions || ''},
                ${JSON.stringify(ex.questions)}::jsonb, ${epos++})`;
      bump('exercises');
    }
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
