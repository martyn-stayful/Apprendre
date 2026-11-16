import { db } from './db.js';
import { visibleOwnerIds } from './partners.js';
import { PACKS } from '../../db/packs/index.js';

// The day each lesson pack's lesson took place, where the pack says. Its
// source row only knows when the pack was loaded.
const PACK_DATES = Object.fromEntries(PACKS.filter((p) => p.date).map((p) => [p.key, p.date]));

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

  // Content uploaded by this learner or by anyone they learn with. Progress is
  // never shared this way — only the material itself.
  //
  // `week` is when an upload or a lesson pack arrived. Review puts the current
  // week's items first, so recent lessons come up before older material.
  //
  // Passed as a JSON string rather than an array parameter: array serialisation
  // differs between Postgres drivers, and a JSON text parameter behaves the
  // same everywhere.
  const owners = JSON.stringify(userId ? await visibleOwnerIds(userId) : []);

  // One HTTP round-trip for the lot.
  const [
    deckRows, cardRows, quizRows, questionRows, verbRows, drillRows,
    conceptRows, storyRows, roleplayRows, grammarRows, chapterRows, exerciseRows, lessonRows,
  ] = await sql.transaction([
    sql`select id, slug, name, category, level, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from decks
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, name`,

    sql`select c.deck_id, c.fr, c.en, c.ex, c.level
          from cards c join decks d on d.id = c.deck_id
         where d.user_id is null or d.user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by c.position`,

    sql`select id, slug, title, level, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from quizzes
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, title`,

    sql`select q.quiz_id, q.prompt, q.en, q.opts, q.answer_idx, q.note
          from quiz_questions q join quizzes z on z.id = q.quiz_id
         where z.user_id is null or z.user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by q.position`,

    sql`select infinitive, meaning, forms, level, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from verbs
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, infinitive`,

    sql`select id, cat, en, fr, note, level, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from drills
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, id`,

    sql`select slug, title, subtitle, category, paragraphs, table_rows, examples,
               pitfall, related, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from concepts
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, title`,

    // Your own and your partners' stories first, newest at the top: that's
    // where a story the app has just written for you belongs.
    sql`select slug, title, blurb, level, tags, focus, body, translation, meta, source_id,
               coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared
          from stories
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id is null, case when user_id is not null then created_at end desc, position, title`,

    sql`select title, ctx, lines, notes, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from roleplays
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, title`,

    sql`select title, body, source_id, coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared
          from grammar_notes
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, position, title`,

    sql`select id, slug, book, book_title, num, title, subtitle, level, rule, vocab, source_id,
               coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared,
               case when user_id is not null or source_id in (select id from sources where pack is not null)
                    then to_char(created_at, 'IYYY-"W"IW') end as week
          from workbook_chapters
         where user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by user_id nulls first, book, num`,

    sql`select e.chapter_id, e.slug, e.title, e.instructions, e.questions
          from workbook_exercises e join workbook_chapters c on c.id = e.chapter_id
         where c.user_id is null or c.user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
         order by e.position`,

    // Each lesson pack, and each upload that's been read, is a lesson's worth
    // of material: the app groups content by these to revise the latest one.
    sql`select id, kind, title, summary, pack, to_char(created_at, 'YYYY-MM-DD') as day,
               coalesce(user_id = ${uid}::uuid, false) as mine,
               coalesce(user_id is not null and user_id <> ${uid}::uuid, false) as shared
          from sources
         where kind in ('pack', 'upload') and status = 'ready'
           and (user_id is null or user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value))
         order by created_at desc`,
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
      shared: d.shared || undefined,
      week: d.week || undefined,
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
      shared: q.shared || undefined,
      week: q.week || undefined,
      sourceId: q.source_id,
      qs: (questionsByQuiz[q.id] || []).map((x) => ({
        prompt: x.prompt, en: x.en, opts: x.opts, a: x.answer_idx, note: x.note,
      })),
    };
  }

  const verbTables = {};
  for (const v of verbRows) {
    verbTables[v.infinitive] = {
      meaning: v.meaning, forms: v.forms, level: v.level || undefined,
      mine: v.mine, shared: v.shared || undefined, week: v.week || undefined,
      sourceId: v.source_id,
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
      shared: c.shared || undefined,
      rule: c.rule || undefined,
      vocab: c.vocab || [],
      week: c.week || undefined,
      sourceId: c.source_id,
      exercises: (exercisesByChapter[c.id] || []).map((e) => ({
        id: `${c.slug}-${e.slug}`,
        title: e.title,
        // Not stored: an exercise whose questions all offer options is
        // multiple choice, and the rest are typed.
        type: isMultipleChoice(e.questions) ? 'multiple' : undefined,
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
      shared: c.shared || undefined,
      week: c.week || undefined,
      sourceId: c.source_id,
    };
  }

  return {
    decks,
    quizzes,
    verbTables,
    workbook,
    concepts,
    dailyDrills: drillRows.map((d) => ({
      cat: d.cat, en: d.en, fr: d.fr, note: d.note, level: d.level || undefined,
      mine: d.mine, shared: d.shared || undefined, week: d.week || undefined, sourceId: d.source_id,
    })),
    stories: storyRows.map((s) => ({
      slug: s.slug, title: s.title, blurb: s.blurb, level: s.level,
      tags: s.tags || [], focus: s.focus || [],
      body: s.body, translation: s.translation, mine: s.mine, shared: s.shared || undefined,
      meta: s.meta && s.meta.generated ? s.meta : undefined, sourceId: s.source_id,
    })),
    roleplays: roleplayRows.map((r) => ({
      title: r.title, ctx: r.ctx, lines: r.lines, notes: r.notes, mine: r.mine, shared: r.shared || undefined,
      week: r.week || undefined, sourceId: r.source_id,
    })),
    grammar: grammarRows.map((g) => ({
      title: g.title, body: g.body, mine: g.mine, shared: g.shared || undefined, sourceId: g.source_id,
    })),
    // Newest first. `date` is the day of the lesson for a pack, or the day an
    // upload arrived. A pack without a date gathers months of lessons, so it
    // isn't one lesson and is left out.
    lessons: lessonRows
      .filter((l) => l.kind !== 'pack' || PACK_DATES[l.pack])
      .map((l) => ({
        id: l.id, kind: l.kind, title: l.title, summary: l.summary || '',
        date: l.kind === 'pack' ? PACK_DATES[l.pack] : l.day,
        mine: l.mine, shared: l.shared || undefined,
      }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };
}

function isMultipleChoice(questions) {
  return Array.isArray(questions) && questions.length > 0
    && questions.every((q) => Array.isArray(q.options) && q.options.length > 1);
}

function groupBy(rows, key) {
  const out = {};
  for (const row of rows) (out[row[key]] ||= []).push(row);
  return out;
}
