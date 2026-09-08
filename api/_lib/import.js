import { db } from './db.js';

/**
 * Write a parsed upload into the learner's library.
 * Returns a count of what was created, for the "here's what I made" summary.
 */
export async function importContent(userId, sourceId, content) {
  const sql = db();
  const stats = {
    decks: 0, cards: 0, quizzes: 0, questions: 0, verbs: 0, drills: 0,
    concepts: 0, stories: 0, roleplays: 0, grammarNotes: 0,
    chapters: 0, exercises: 0,
  };

  const taken = await usedSlugs(sql, userId);

  for (const [i, deck] of (content.decks || []).entries()) {
    if (!deck.cards?.length) continue;
    const slug = claim(taken.decks, deck.slug);
    const [row] = await sql`
      insert into decks (user_id, source_id, slug, name, category, level, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${slug}, ${deck.name},
              ${deck.category || 'Vocabulary'}, ${deck.level || null}, ${i})
      returning id`;
    stats.decks++;
    for (const [j, card] of deck.cards.entries()) {
      await sql`
        insert into cards (deck_id, fr, en, ex, level, position)
        values (${row.id}::uuid, ${card.fr}, ${card.en}, ${card.ex || ''},
                ${deck.level || null}, ${j})`;
      stats.cards++;
    }
  }

  for (const [i, quiz] of (content.quizzes || []).entries()) {
    const questions = (quiz.questions || []).filter(validQuestion);
    if (!questions.length) continue;
    const slug = claim(taken.quizzes, quiz.slug);
    const [row] = await sql`
      insert into quizzes (user_id, source_id, slug, title, level, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${slug}, ${quiz.title},
              ${quiz.level || null}, ${i})
      returning id`;
    stats.quizzes++;
    for (const [j, q] of questions.entries()) {
      await sql`
        insert into quiz_questions (quiz_id, prompt, en, opts, answer_idx, note, position)
        values (${row.id}::uuid, ${q.prompt}, ${q.en || ''},
                ${JSON.stringify(q.opts)}::jsonb, ${q.answer_idx}, ${q.note || ''}, ${j})`;
      stats.questions++;
    }
  }

  for (const [i, verb] of (content.verbs || []).entries()) {
    if (!verb.infinitive || !verb.forms) continue;
    // A learner re-uploading the same verb should refresh it, not fail.
    await sql`
      insert into verbs (user_id, source_id, infinitive, meaning, forms, level, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${verb.infinitive}, ${verb.meaning || ''},
              ${JSON.stringify(verb.forms)}::jsonb, ${verb.level || null}, ${i})
      on conflict (user_id, infinitive) do update
        set meaning = excluded.meaning, forms = excluded.forms,
            level = excluded.level, source_id = excluded.source_id`;
    stats.verbs++;
  }

  for (const [i, drill] of (content.drills || []).entries()) {
    if (!drill.en || !drill.fr) continue;
    await sql`
      insert into drills (user_id, source_id, cat, en, fr, note, level, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${drill.cat || 'general'},
              ${drill.en}, ${drill.fr}, ${drill.note || ''}, ${drill.level || null}, ${i})`;
    stats.drills++;
  }

  for (const [i, c] of (content.concepts || []).entries()) {
    const slug = claim(taken.concepts, c.slug);
    await sql`
      insert into concepts (user_id, source_id, slug, title, subtitle, category,
                            paragraphs, table_rows, examples, pitfall, related, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${slug}, ${c.title}, ${c.subtitle || ''},
              ${c.category || 'A1.1'},
              ${JSON.stringify(c.paragraphs || [])}::jsonb,
              ${JSON.stringify(c.table_rows || [])}::jsonb,
              ${JSON.stringify(c.examples || [])}::jsonb,
              ${c.pitfall?.title ? JSON.stringify(c.pitfall) : null}::jsonb,
              '[]'::jsonb, ${i})`;
    stats.concepts++;
  }

  for (const [i, s] of (content.stories || []).entries()) {
    if (!s.body) continue;
    const slug = claim(taken.stories, s.slug);
    await sql`
      insert into stories (user_id, source_id, slug, title, blurb, level, tags, focus,
                           body, translation, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${slug}, ${s.title}, ${s.blurb || ''},
              ${s.level || 'A1'},
              ${JSON.stringify(s.tags || [])}::jsonb,
              ${JSON.stringify(s.focus || [])}::jsonb,
              ${s.body}, ${s.translation || ''}, ${i})`;
    stats.stories++;
  }

  for (const [i, r] of (content.roleplays || []).entries()) {
    if (!r.lines?.length) continue;
    await sql`
      insert into roleplays (user_id, source_id, title, ctx, lines, notes, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${r.title}, ${r.ctx || ''},
              ${JSON.stringify(r.lines)}::jsonb, ${r.notes || ''}, ${i})`;
    stats.roleplays++;
  }

  for (const [i, g] of (content.grammar_notes || []).entries()) {
    if (!g.body) continue;
    await sql`
      insert into grammar_notes (user_id, source_id, title, body, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${g.title}, ${g.body}, ${i})`;
    stats.grammarNotes++;
  }

  for (const [i, ch] of (content.workbook_chapters || []).entries()) {
    const slug = claim(taken.chapters, ch.slug);
    const [row] = await sql`
      insert into workbook_chapters (user_id, source_id, slug, book, book_title, num,
                                     title, subtitle, level, rule, vocab, position)
      values (${userId}::uuid, ${sourceId}::uuid, ${slug}, ${ch.book || 'I'},
              ${ch.book_title || ''}, ${ch.num || i + 1}, ${ch.title}, ${ch.subtitle || ''},
              ${ch.level || 'A1.1'},
              ${ch.rule?.heading ? JSON.stringify(ch.rule) : null}::jsonb,
              ${JSON.stringify(ch.vocab || [])}::jsonb, ${i})
      returning id`;
    stats.chapters++;
    for (const [j, ex] of (ch.exercises || []).entries()) {
      if (!ex.questions?.length) continue;
      await sql`
        insert into workbook_exercises (chapter_id, slug, title, instructions, questions, position)
        values (${row.id}::uuid, ${ex.slug || `ex${j + 1}`}, ${ex.title},
                ${ex.instructions || ''}, ${JSON.stringify(ex.questions)}::jsonb, ${j})`;
      stats.exercises++;
    }
  }

  return stats;
}

function validQuestion(q) {
  return q && Array.isArray(q.opts) && q.opts.length >= 2
    && Number.isInteger(q.answer_idx)
    && q.answer_idx >= 0 && q.answer_idx < q.opts.length;
}

/** Slugs already used by this learner or by the built-in library. */
async function usedSlugs(sql, userId) {
  const [decks, quizzes, concepts, stories, chapters] = await sql.transaction([
    sql`select slug from decks where user_id is null or user_id = ${userId}::uuid`,
    sql`select slug from quizzes where user_id is null or user_id = ${userId}::uuid`,
    sql`select slug from concepts where user_id is null or user_id = ${userId}::uuid`,
    sql`select slug from stories where user_id is null or user_id = ${userId}::uuid`,
    sql`select slug from workbook_chapters where user_id is null or user_id = ${userId}::uuid`,
  ]);
  const set = (rows) => new Set(rows.map((r) => r.slug));
  return {
    decks: set(decks), quizzes: set(quizzes), concepts: set(concepts),
    stories: set(stories), chapters: set(chapters),
  };
}

/** Take a slug, adding -2, -3 ... until it's free. Mutates the set. */
function claim(used, wanted) {
  const base = slugify(wanted) || 'item';
  let slug = base;
  let n = 2;
  while (used.has(slug)) slug = `${base}-${n++}`;
  used.add(slug);
  return slug;
}

function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
