import { db } from './db.js';

/**
 * Everything the app renders, for one learner: the shared built-in library
 * (user_id is null) plus whatever they've uploaded. Shapes match what
 * index.html already expected, so the rendering code did not have to change.
 *
 * Passing a null userId compares against NULL, which is never true — so an
 * anonymous read gets the built-in library and nothing else.
 */
export async function loadContent(userId) {
  const sql = db();
  const uid = userId || null;

  // One HTTP round-trip for the lot.
  const [
    deckRows, cardRows, quizRows, questionRows, verbRows, drillRows,
    conceptRows, storyRows, roleplayRows, grammarRows, chapterRows, exerciseRows,
  ] = await sql.transaction([
    sql`select id, slug, name, category, level, source_id, user_id is not null as mine
          from decks
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, name`,

    sql`select c.deck_id, c.fr, c.en, c.ex, c.level
          from cards c join decks d on d.id = c.deck_id
         where d.user_id is null or d.user_id = ${uid}::uuid
         order by c.position`,

    sql`select id, slug, title, level, source_id, user_id is not null as mine
          from quizzes
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, title`,

    sql`select q.quiz_id, q.prompt, q.en, q.opts, q.answer_idx, q.note
          from quiz_questions q join quizzes z on z.id = q.quiz_id
         where z.user_id is null or z.user_id = ${uid}::uuid
         order by q.position`,

    sql`select infinitive, meaning, forms, level, user_id is not null as mine
          from verbs
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, infinitive`,

    sql`select id, cat, en, fr, note, level, user_id is not null as mine
          from drills
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, id`,

    sql`select slug, title, subtitle, category, paragraphs, table_rows, examples,
               pitfall, related, user_id is not null as mine
          from concepts
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, title`,

    sql`select slug, title, blurb, level, tags, focus, body, translation,
               user_id is not null as mine
          from stories
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, title`,

    sql`select title, ctx, lines, notes, user_id is not null as mine
          from roleplays
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, title`,

    sql`select title, body, user_id is not null as mine
          from grammar_notes
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, position, title`,

    sql`select id, slug, book, book_title, num, title, subtitle, level, rule, vocab,
               user_id is not null as mine
          from workbook_chapters
         where user_id is null or user_id = ${uid}::uuid
         order by user_id nulls first, book, num`,

    sql`select e.chapter_id, e.slug, e.title, e.instructions, e.questions
          from workbook_exercises e join workbook_chapters c on c.id = e.chapter_id
         where c.user_id is null or c.user_id = ${uid}::uuid
         order by e.position`,
  ]);

  const cardsByDeck = groupBy(cardRows, 'deck_id');
  const questionsByQuiz = groupBy(questionRows, 'quiz_id');
  const exercisesByChapter = groupBy(exerciseRows, 'chapter_id');

  const decks = {};
  for (const d of deckRows) {
    decks[d.slug] = {
      name: d.name,
      category: d.category,
      level: d.level || undefined,
      mine: d.mine,
      sourceId: d.source_id,
      cards: (cardsByDeck[d.id] || []).map((c) => ({
        fr: c.fr, en: c.en, ex: c.ex, level: c.level || undefined,
      })),
    };
  }

  const quizzes = {};
  for (const q of quizRows) {
    quizzes[q.slug] = {
      title: q.title,
      level: q.level || undefined,
      mine: q.mine,
      sourceId: q.source_id,
      qs: (questionsByQuiz[q.id] || []).map((x) => ({
        prompt: x.prompt, en: x.en, opts: x.opts, a: x.answer_idx, note: x.note,
      })),
    };
  }

  const verbTables = {};
  for (const v of verbRows) {
    verbTables[v.infinitive] = {
      meaning: v.meaning, forms: v.forms, level: v.level || undefined, mine: v.mine,
    };
  }

  const workbook = {};
  for (const c of chapterRows) {
    workbook[c.slug] = {
      book: c.book,
      bookTitle: c.book_title,
      num: c.num,
      title: c.title,
      subtitle: c.subtitle,
      level: c.level,
      mine: c.mine,
      rule: c.rule || undefined,
      vocab: c.vocab || [],
      exercises: (exercisesByChapter[c.id] || []).map((e) => ({
        id: `${c.slug}-${e.slug}`,
        title: e.title,
        instructions: e.instructions,
        questions: e.questions,
      })),
    };
  }

  const concepts = {};
  for (const c of conceptRows) {
    concepts[c.slug] = {
      title: c.title,
      subtitle: c.subtitle,
      category: c.category,
      paragraphs: c.paragraphs || [],
      table: c.table_rows || [],
      examples: c.examples || [],
      pitfall: c.pitfall?.title ? c.pitfall : undefined,
      related: c.related || [],
      mine: c.mine,
    };
  }

  return {
    decks,
    quizzes,
    verbTables,
    workbook,
    concepts,
    dailyDrills: drillRows.map((d) => ({
      cat: d.cat, en: d.en, fr: d.fr, note: d.note, level: d.level || undefined, mine: d.mine,
    })),
    stories: storyRows.map((s) => ({
      slug: s.slug, title: s.title, blurb: s.blurb, level: s.level,
      tags: s.tags || [], focus: s.focus || [],
      body: s.body, translation: s.translation, mine: s.mine,
    })),
    roleplays: roleplayRows.map((r) => ({
      title: r.title, ctx: r.ctx, lines: r.lines, notes: r.notes, mine: r.mine,
    })),
    grammar: grammarRows.map((g) => ({ title: g.title, body: g.body, mine: g.mine })),
  };
}

function groupBy(rows, key) {
  const out = {};
  for (const row of rows) (out[row[key]] ||= []).push(row);
  return out;
}
