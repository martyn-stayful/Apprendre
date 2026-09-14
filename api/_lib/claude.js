import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { ParsedContent } from './schema.js';

// The API compiles a grammar for structured outputs, and this schema — eleven
// sections, several of them deeply nested — is too big for it ("the compiled
// grammar is too large"). Rather than cut content types to fit, we describe the
// shape in the prompt and validate the reply ourselves. Same guarantee at the
// point it matters, no ceiling on how rich the schema can get.
const SHAPE = JSON.stringify(z.toJSONSchema(ParsedContent), null, 0);

const MODEL = 'claude-opus-5';

let _client = null;
function client() {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set. Add it in the Vercel project settings.');
    }
    _client = new Anthropic();
  }
  return _client;
}

const SYSTEM = `You turn French lesson material into practice exercises for a self-study app.

The learner is a British English speaker living in Morzine, in the French Alps. He is
working through roughly A1 to B1. Examples that touch daily life there — the bakery,
the ski lifts, the market, neighbours, the tabac — land better than generic textbook
sentences, but only use them where they fit the material naturally.

You are given a photo, a document or some pasted text: a worksheet, a page from a
grammar book, a vocabulary list, notes from a lesson, a whiteboard. Read it, then
build exercises FROM it. You are not transcribing. The material is the syllabus and
the exercises are what the learner practises with.

Choose the output types the material actually supports:

- decks        — vocabulary. Any word list belongs here. Give every card an example
                 sentence. Include gender markers: "un chien", "grand(e)".
- verbs        — a conjugation table for any verb the material teaches in the present.
- quizzes      — 4-option gap-fill questions. Distractors must be mistakes a learner
                 would plausibly make, never obvious throwaways.
- drills       — English-to-French production prompts ("Say: ...", "Ask: ..."). These
                 are the highest-value exercise in the app. Generate them freely.
- concepts     — a grammar explainer, when the material teaches a rule.
- grammar_notes— a shorter rule reference, when a full concept page is too much.
- roleplays    — a short dialogue, when the material is conversational or situational.
- stories      — a short French passage, when there is enough vocabulary to build one
                 that stays inside what the material teaches.
- workbook_chapters — when the material is clearly a structured textbook chapter with
                 its own exercises. Carry those exercises across.

Rules that matter:

- Return an empty array for every type the material does not support. A vocabulary
  list should not produce a story just to fill the field.
- Never invent French. If you cannot read a word in a photo, leave it out rather than
  guessing at it. If the material contains an error, follow the material and say so in
  the summary.
- Accents and gender agreement must be correct.
- Quiz answer_idx must point at the correct option, and opts must hold exactly 4 entries.
- Slugs are lowercase, use underscores or hyphens, and must not collide inside one upload.
- Levels use the app's CEFR scale: A1.1, A1.2, A2.1, A2.2, B1.1, B1.2.
- Story bodies gloss words as [[french|english]] or [[french|english|note]]. Gloss
  generously — anything past the most basic words.
- Aim for enough to practise with, not everything possible: roughly 10-25 cards per
  deck, 8-12 quiz questions, 10-20 drills. Split genuinely different topics into
  separate decks rather than one long one.

Reply with a single JSON object and nothing else — no prose around it, no markdown
code fence. Every key below must be present; use an empty array where a type does
not apply. It must validate against this JSON Schema:

${SHAPE}`;

function pdfBlock(base64) {
  return { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };
}

function imageBlock(base64, mediaType) {
  return { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } };
}

/**
 * Read one piece of material and return structured exercises.
 *
 * Several pages go up in a single call rather than one call each: a vocabulary
 * list on page one and the exercises using it on page two only make sense read
 * together.
 *
 * @param {object} input
 * @param {string} [input.text]   pasted text, when there are no files
 * @param {Array<{base64: string, mimeType: string}>} [input.files]  pages, in order
 * @param {string} [input.note]   the learner's own instruction for this upload
 */
export async function parseMaterial({ text, files, note }) {
  const pages = files || [];
  const content = [];

  pages.forEach((page, i) => {
    if (!page?.base64) throw new Error(`Page ${i + 1} has no data`);
    // Label each page so Claude can refer to them and keep their order straight.
    if (pages.length > 1) {
      content.push({ type: 'text', text: `--- Page ${i + 1} of ${pages.length} ---` });
    }
    content.push(page.mimeType === 'application/pdf'
      ? pdfBlock(page.base64)
      : imageBlock(page.base64, page.mimeType || 'image/jpeg'));
  });

  const source = pages.length === 0
    ? 'Here is the lesson material:\n\n' + (text || '')
    : pages.length === 1
      ? 'The attached file is the lesson material.'
      : `The ${pages.length} attached pages are one piece of material, in order. ` +
        'Read them together — vocabulary introduced on one page is often practised ' +
        'on another — and build one combined set of exercises, not one set per page.';

  const instruction = [
    source,
    note ? `\n\nThe learner added this instruction — follow it:\n${note}` : '',
    '\n\nRead it and build the exercises. Reply with the JSON object and nothing ',
    'else — no explanation before or after it, no markdown code fence.',
  ].join('');

  content.push({ type: 'text', text: instruction });

  let lastProblem = '';
  let lastLength = 0;
  let lastStop = '';

  // Two attempts. The second asks for a shorter answer rather than replaying the
  // broken one back: a truncated reply in the history teaches the model that
  // stopping half way is acceptable.
  for (let attempt = 0; attempt < 2; attempt++) {
    const ask = attempt === 0
      ? content
      : content.concat([{
          type: 'text',
          text: 'Your previous answer did not come back as usable JSON — it was ' +
            (lastProblem || 'malformed') + '. Try again, and keep it shorter this ' +
            'time: fewer cards and questions, and leave out the optional sections ' +
            '(stories, role-plays, workbook chapters) entirely. A compact reply that ' +
            'parses is far more useful than a long one that does not.',
        }]);

    let message;
    try {
      message = await client().messages.stream({
        model: MODEL,
        max_tokens: 32000,
        system: SYSTEM,
        thinking: { type: 'adaptive' },
        messages: [{ role: 'user', content: ask }],
      }).finalMessage();
    } catch (err) {
      throw new Error(explain(err));
    }

    if (message.stop_reason === 'refusal') {
      throw new Error(
        'Claude declined to read this material' +
        (message.stop_details?.explanation ? `: ${message.stop_details.explanation}` : '.')
      );
    }

    const raw = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!raw.trim()) throw new Error('Claude returned an empty response');

    lastLength = raw.length;
    lastStop = message.stop_reason || 'unknown';

    const parsed = parseJson(raw);
    if (parsed.ok) {
      // A repaired reply is missing whatever came after the break; the schema
      // wants every section present, so fill the gaps with nothing.
      const filled = { ...EMPTY_SECTIONS, ...parsed.value };
      const result = ParsedContent.safeParse(filled);
      if (result.success) {
        return { content: result.data, usage: message.usage, truncated: Boolean(parsed.truncated) };
      }
      const issue = result.error.issues[0];
      lastProblem = `${issue.path.join('.') || 'the response'}: ${issue.message}`;
    } else {
      lastProblem = parsed.error;
    }
  }

  throw new Error(
    `Claude's reply could not be read (${lastProblem}; ` +
    `${lastLength} characters, finished with "${lastStop}"). ` +
    'Try again, or upload fewer pages at once.'
  );
}

/** Every section the schema requires, empty — the base a partial reply fills in. */
const EMPTY_SECTIONS = {
  title: '', summary: '',
  decks: [], quizzes: [], drills: [], verbs: [], concepts: [],
  roleplays: [], stories: [], grammar_notes: [], workbook_chapters: [],
};

/**
 * Pull the JSON object out of a reply, tolerating a code fence or stray prose,
 * and repairing a reply that stopped part-way.
 *
 * A long answer can end mid-write. Everything before the break is perfectly
 * good content, so rather than discard a worksheet's worth of exercises over a
 * missing brace, we rewind to the last complete item and close what's open.
 */
function parseJson(raw) {
  let text = raw.trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/);
  if (fence) text = fence[1].trim();

  const first = text.indexOf('{');
  if (first === -1) return { ok: false, error: 'no JSON object in the reply' };
  text = text.slice(first);

  // Whole thing parses: nothing to do.
  const direct = tryParse(text);
  if (direct.ok) return direct;

  const repaired = closeTruncated(text);
  if (repaired) {
    const result = tryParse(repaired);
    if (result.ok) return { ok: true, value: result.value, truncated: true };
  }

  return { ok: false, error: `not valid JSON (${direct.error})`, length: raw.length };
}

function tryParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Rewind to the last point where a whole item finished — a closed object or
 * array, or a string inside an array — then close everything still open.
 *
 * Only whole items count. Rewinding to the last comma would keep a half-written
 * object, which then fails validation and loses the rest of the page with it.
 *
 * Returns null if there's nothing salvageable.
 */
function closeTruncated(text) {
  const stack = [];
  let inString = false;
  let escaped = false;
  let lastComplete = -1;   // index just past the last finished value

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') {
        inString = false;
        // A finished string is a whole value only inside an array; inside an
        // object it might be a key still waiting for its value.
        if (stack[stack.length - 1] === ']') lastComplete = i + 1;
      }
      continue;
    }

    if (ch === '"') { inString = true; continue; }
    if (ch === '{') { stack.push('}'); continue; }
    if (ch === '[') { stack.push(']'); continue; }
    if (ch === '}' || ch === ']') {
      stack.pop();
      lastComplete = i + 1;
      continue;
    }
  }

  if (lastComplete <= 0) return null;

  const out = text.slice(0, lastComplete).replace(/,\s*$/, '');
  const open = openBrackets(out);
  if (!open.length) return null;

  // Close everything still open, innermost first.
  return out + open.reverse().join('');
}

/** The closers still owed by a fragment, outermost first. */
function openBrackets(text) {
  const stack = [];
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') stack.pop();
  }
  return stack;
}

/** Turn an SDK error into something worth reading on a phone. */
function explain(err) {
  const status = err?.status;
  const detail = err?.error?.error?.message || err?.message || '';

  if (status === 401) return 'The Claude API key is not valid. Check ANTHROPIC_API_KEY in the project settings.';
  if (status === 403) return 'The Claude API key is not allowed to make this request. Check it in the Anthropic console.';
  if (status === 429) return 'Too many requests to Claude just now, or the account is out of credit. Wait a minute and try again.';
  if (status === 400 && /credit balance|billing/i.test(detail)) {
    return 'The Anthropic account is out of credit. Top it up in the Anthropic console and try again.';
  }
  if (status === 400 && /too large|too long|exceeds/i.test(detail)) {
    return 'That material is too large for one request. Try a single page, or split the text.';
  }
  if (status >= 500) return 'Claude is having trouble at the moment. Try again in a minute.';
  if (err?.name === 'APIConnectionError' || /fetch failed|ECONN/i.test(detail)) {
    return 'Could not reach Claude. Check the connection and try again.';
  }
  return detail ? `Claude could not read that: ${detail}` : 'Claude could not read that material.';
}
