import { createHash } from 'node:crypto';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { client, explain } from './claude.js';
import { PARSE_STALE_MINUTES } from './files.js';

// Sorting mistakes into lessons and explaining one wrong answer are small jobs,
// run at low effort; writing a lesson is where the reasoning pays, at medium.
// Refusal fallbacks are on, so a declined request is retried on the fallback
// model inside the same call.
const MODEL = 'claude-opus-5-5';

const LEARNER = `The learner is a British English speaker living in Morzine, in the French Alps,
working through French at roughly A1 to B1 in a revision app.`;

// ------------------------------------------------------------------ shapes --

export const Plan = z.object({
  lessons: z.array(z.object({
    kind: z.enum(['confusion', 'words']),
    asked: z.boolean(),
    existing: z.string(),
    title: z.string(),
    focus: z.string(),
    items: z.array(z.number().int()),
  })),
});

export const Lesson = z.object({
  title: z.string(),
  summary: z.string(),
  why_confusing: z.string(),
  rule: z.array(z.string()),
  tricks: z.array(z.object({ name: z.string(), how: z.string() })),
  examples: z.array(z.object({ fr: z.string(), en: z.string(), note: z.string() })),
  mistakes: z.array(z.object({
    item: z.number().int(), you: z.string(), right: z.string(), why: z.string(),
  })),
  practice: z.array(z.object({
    fr: z.string(),
    en: z.string(),
    options: z.array(z.string()),
    answer: z.number().int(),
    reasons: z.array(z.string()),
    reason: z.number().int(),
    explain: z.string(),
  })),
});

export const Why = z.object({
  right: z.string(),
  wrong: z.string(),
  trick: z.string(),
  also_ok: z.boolean(),
});

// ----------------------------------------------------------------- prompts --

const PLAN_SYSTEM = `You sort a language learner's repeated mistakes into short lessons.
${LEARNER} You are given the questions they have got wrong more than once:
the question, the right answer, what they answered when the app recorded it,
and how often they have missed it.

Group the questions by what the learner needs to understand or remember to stop
getting them wrong. There are two kinds of lesson:

- confusion: two or more similar things they mix up, or a rule they keep
  breaking. For example "à, en or au?", "savoir or connaître?", "c'est or
  il est?", "du, de la, des, and de after a negative", "être or avoir in the
  passé composé". Look at what they answered as well as at the right answer:
  choosing "à" where "en" was right says more than the question does. Questions
  about the same confusion belong together, whatever exercise they came from.
  Look-alike words and false friends are a confusion too.
- words: vocabulary that won't stick, where there is no rule to learn, only
  something to remember. Put up to eight such words in one lesson, grouped by
  theme where you can.

For each lesson give its kind; asked, true only for the lesson the learner
asked for by name; a short title in the learner's terms (the
confusable things themselves for a confusion; the theme, or "Words that won't
stick", for words); focus, one line on exactly what goes wrong; and items, the
numbers of the questions it covers.

The learner may already have lessons, listed under "Existing lessons". When
questions belong with one of those, return it with its slug in existing and
only the new question numbers in items. Otherwise leave existing empty.

Write no more new lessons than you are told, the most useful first: the most
missed and the most basic. Leave a question out only if it was clearly a slip
(a typo, a missing accent) rather than something not understood. If the
learner asked for a lesson on something, include it, as a new lesson or as the
existing one that covers it, even if none of the questions belong to it.`;

const LESSON_SYSTEM = `You write a short lesson for a learner who keeps getting the same thing wrong.
${LEARNER} They have been guessing at this, so the lesson's job is to make them
understand why the right answer is right and the wrong one is wrong, and to give
them a way to remember it that will still work in a conversation next week.

Write in plain British English: warm, direct and short. Name grammar only when
it helps, and say what the name means the first time ("the partitive: du, de
la, des, meaning 'some'").

There are two kinds of lesson, and you are told which this is.

A confusion lesson is about similar things the learner mixes up, or a rule they
keep breaking:
- title: the confusion itself, as the learner would put it: "à, en or au?",
  "savoir or connaître?". Keep the title you are given unless you can make it
  clearer.
- summary: one sentence on what gets mixed up.
- why_confusing: one to three sentences on why an English speaker trips here:
  what English does that French doesn't.
- rule: two to five short lines, the rule as simply as it can be put while
  still true. Lead with what covers most cases. Add an exception only if their
  mistakes hit it or it is too common to leave out.
- tricks: one to three ways to remember it. Make each one concrete and
  memorable: a mnemonic, a picture, a question to ask yourself before choosing,
  a sound to listen for, a pattern to spot. Never "practise more". Morzine, the
  mountains, the bakery and the ski lifts are good material when they make a
  trick stick. name is a few words; how says what to do.
- examples: four to eight short sentences that put the confusable choices side
  by side, each with its English and a note saying which part of the rule it
  follows.

A words lesson is about vocabulary that won't stick:
- title: the theme, or "Words that won't stick".
- summary: one sentence on what these words have in common, if anything.
- why_confusing: why these slip: they look like English words that mean
  something else, they look like each other, or nothing in English links to
  them.
- rule: one to three lines on any pattern that helps (a gender ending, a family
  of words); otherwise how to use the memory hooks below.
- tricks: one for each word: name is the word with its article ("le casque");
  how is a vivid memory hook, usually an English word it sounds like joined to
  a picture that means it ("casque: a cask on your head, a helmet"), and the
  gender if that is a trap.
- examples: one natural sentence for each word.

Both kinds:
- mistakes: one for each question you are given, in order: item is its number;
  you is what they answered ("—" if the app didn't record it); right is the
  right answer; why is one or two sentences tying the right answer to the rule
  or the meaning, and saying what their answer would mean or where it would be
  right, if anywhere.
- practice: six new questions, none of them the ones they missed, that test
  exactly this. fr is a French sentence with ___ where the answer goes; en is
  its English; options are the two to four confusable choices; answer is the
  index of the right one. reasons are three short reasons someone might give
  for their choice in that sentence: one right, and two plausible wrong ones,
  the kind of thinking behind the learner's mistakes; reason is the index of
  the right one. explain is one sentence on why. Spread the right answers
  across the options.

Accents, elisions and agreement must be correct. Never invent a rule to make
something look tidy: where French is simply irregular, say so and give a trick
for remembering it.`;

const WHY_SYSTEM = `${LEARNER} They just got a question wrong and want to understand why, so they
stop guessing. Explain briefly, in plain British English:

- right: why the right answer is right here, in one to three sentences, tied
  to the rule or meaning that decides it.
- wrong: why what they answered is wrong here: what it means, or where it
  would be right instead. An empty string if they gave no answer.
- trick: one short, concrete way to remember it next time. Never "practise
  more".
- also_ok: true only if what they answered is also correct French in this
  sentence; then say so in wrong, and why the app wanted the other.

No waffle and no praise. Accents must be right.`;

// ---------------------------------------------------------------- requests --

const text = (v, max) => (typeof v === 'string'
  ? v.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '');

/** A question from the app, cut to what Claude needs. Null if it can't be used. */
export function cleanItem(raw) {
  const list = (v, max, n) => (Array.isArray(v) ? v : []).map((x) => text(x, max)).filter(Boolean).slice(0, n);
  const count = (v) => Math.max(0, Math.min(999, Math.floor(Number(v)) || 0));
  const item = {
    id: text(raw?.id, 300),
    kind: text(raw?.kind, 20) || 'question',
    source: text(raw?.source, 100),
    prompt: text(raw?.prompt, 300),
    en: text(raw?.en, 300),
    answer: text(raw?.answer, 200),
    options: list(raw?.options, 100, 6),
    note: text(raw?.note, 400),
    given: list(raw?.given, 100, 5),
    wrong: count(raw?.wrong),
    right: count(raw?.right),
  };
  return item.prompt && item.answer ? item : null;
}

const STALLED = 'Writing this lesson took longer than the server allows, so it stopped. Try again.';

/** A learner's lessons, newest first. One still 'writing' after the time limit has failed. */
export async function listLessons(sql, userId) {
  return sql`
    select slug, title, focus, item_ids, lesson, created_at,
           case when stalled then 'failed' else status end as status,
           case when stalled then ${STALLED} else error end as error
      from (select *, status = 'writing'
                      and updated_at < now() - make_interval(mins => ${PARSE_STALE_MINUTES}) as stalled
              from sticking_lessons
             where user_id = ${userId}::uuid) as l
     order by created_at desc`;
}

// ------------------------------------------------------------------- calls --

/** One structured call to Claude, checked here and retried once if it comes back wrong. */
async function ask({ system, content, schema, effort, maxTokens, what, check }) {
  const { type, schema: jsonSchema } = betaZodOutputFormat(schema);
  let lastProblem = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    let message;
    try {
      message = await client().beta.messages.stream({
        model: MODEL,
        max_tokens: maxTokens,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort, format: { type, schema: jsonSchema } },
        system,
        messages: [{ role: 'user', content }],
      }).finalMessage();
    } catch (err) {
      throw new Error(explain(err).replace(/Claude could not read that( material)?/, `Claude could not ${what}`));
    }
    if (message.stop_reason === 'refusal') throw new Error(`Claude declined to ${what}.`);

    const raw = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    let data;
    try {
      data = schema.parse(JSON.parse(raw));
    } catch {
      lastProblem = message.stop_reason === 'max_tokens'
        ? 'it was cut off before the end' : 'it was not in the requested shape';
      continue;
    }
    const problem = check ? check(data) : '';
    if (!problem) return { data, usage: message.usage };
    lastProblem = problem;
  }
  throw new Error(`Claude couldn't ${what} (${lastProblem}). Try again.`);
}

/** A question the learner keeps missing, as Claude sees it. */
function describe(item, n) {
  const lines = [`#${n} (${item.kind}${item.source ? `, ${item.source}` : ''}): ` +
    `missed ${item.wrong} time${item.wrong === 1 ? '' : 's'}, right ${item.right}`];
  lines.push(`  Question: ${item.prompt}`);
  if (item.en) lines.push(`  English: ${item.en}`);
  if (item.options.length) lines.push(`  Options: ${item.options.join(' | ')}`);
  lines.push(`  Right answer: ${item.answer}`);
  lines.push(`  They answered: ${item.given.length ? item.given.join(' / ') : 'not recorded'}`);
  if (item.note) lines.push(`  The app's note: ${item.note}`);
  return lines.join('\n');
}

/**
 * Sort the learner's repeated mistakes into lessons: new ones to write, and
 * questions to add to lessons they already have.
 */
export async function planLessons({ items, ask: request, existing, max }) {
  const content = [
    `Write at most ${max} new lesson${max === 1 ? '' : 's'}.`,
    existing.length
      ? 'Existing lessons:\n' + existing.map((l) => `- ${l.slug}: ${l.title} (${l.focus})`).join('\n')
      : 'Existing lessons: none.',
    request ? `The learner asked for a lesson on: ${request}` : '',
    items.length
      ? 'Questions they keep getting wrong:\n\n' + items.map((it, i) => describe(it, i + 1)).join('\n\n')
      : 'No questions this time.',
  ].filter(Boolean).join('\n\n');

  const { data } = await ask({
    system: PLAN_SYSTEM, content, schema: Plan, effort: 'low', maxTokens: 8000,
    what: 'sort your mistakes into lessons',
  });
  return data.lessons;
}

/** Write one lesson from its brief: { kind, title, focus, ask, items }. */
export async function writeLesson(brief) {
  const content = [
    `Kind: ${brief.kind}`,
    `Title: ${brief.title}`,
    `What goes wrong: ${brief.focus}`,
    brief.ask ? `The learner asked for this lesson: ${brief.ask}` : '',
    brief.items.length
      ? 'The questions they got wrong:\n\n' + brief.items.map((it, i) => describe(it, i + 1)).join('\n\n')
      : 'There are no recorded mistakes for this one: leave mistakes empty.',
  ].filter(Boolean).join('\n\n');

  const { data, usage } = await ask({
    system: LESSON_SYSTEM, content, schema: Lesson, effort: 'medium', maxTokens: 16000,
    what: 'write the lesson', check: checkLesson,
  });
  // Point each explained mistake at the app's own question, so the lesson can
  // show it and the app can link back.
  const mistakes = data.mistakes
    .filter((m) => brief.items[m.item - 1])
    .map((m) => ({ ...m, item_id: brief.items[m.item - 1].id }));
  return { lesson: { ...data, kind: brief.kind, mistakes }, usage };
}

/** What's wrong with a lesson, or '' if nothing. */
export function checkLesson(lesson) {
  if (!lesson.rule.length || !lesson.tricks.length) return 'it had no rule or no tricks';
  if (lesson.practice.length < 4) return 'it had too few practice questions';
  for (const q of lesson.practice) {
    if (!q.fr.includes('___')) return `a practice sentence had no gap: "${q.fr.slice(0, 60)}"`;
    if (q.options.length < 2 || q.options.length > 4) return 'a practice question had the wrong number of options';
    if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== q.options.length) {
      return 'a practice question repeated an option';
    }
    if (!(q.answer >= 0 && q.answer < q.options.length)) return 'a practice answer pointed at no option';
    if (q.reasons.length < 2 || !(q.reason >= 0 && q.reason < q.reasons.length)) {
      return 'a practice question had no right reason';
    }
  }
  return '';
}

/** The cache key for an explanation: the same question, answer and mistake, however typed. */
export function whyKey({ kind, prompt, answer, given }) {
  const norm = (s) => String(s || '').normalize('NFC').replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ').trim().toLowerCase();
  return createHash('sha256').update([kind, prompt, answer, given].map(norm).join('\n')).digest('hex');
}

/** Why `given` was wrong and `answer` right, for one question. */
export async function explainMistake(item) {
  const content = [
    `Exercise: ${item.kind}`,
    `Question: ${item.prompt}`,
    item.en ? `English: ${item.en}` : '',
    item.options.length ? `Options: ${item.options.join(' | ')}` : '',
    `Right answer: ${item.answer}`,
    `They answered: ${item.given.length ? item.given.join(' / ') : '(nothing: they did not know)'}`,
    item.note ? `The app's note: ${item.note}` : '',
  ].filter(Boolean).join('\n');

  const { data } = await ask({
    system: WHY_SYSTEM, content, schema: Why, effort: 'low', maxTokens: 4000,
    what: 'explain that',
  });
  return data;
}
