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
 * @param {object} input
 * @param {'text'|'image'|'pdf'} input.inputType
 * @param {string} [input.text]         pasted text
 * @param {string} [input.base64]       file bytes, base64, no newlines
 * @param {string} [input.mimeType]     e.g. image/jpeg
 * @param {string} [input.note]         the learner's own instruction for this upload
 */
export async function parseMaterial({ inputType, text, base64, mimeType, note }) {
  const content = [];

  if (inputType === 'pdf') {
    if (!base64) throw new Error('No PDF data was supplied');
    content.push(pdfBlock(base64));
  } else if (inputType === 'image') {
    if (!base64) throw new Error('No image data was supplied');
    content.push(imageBlock(base64, mimeType || 'image/jpeg'));
  }

  const instruction = [
    inputType === 'text'
      ? 'Here is the lesson material:\n\n' + (text || '')
      : 'The attached file is the lesson material.',
    note ? `\n\nThe learner added this instruction — follow it:\n${note}` : '',
    '\n\nRead it and build the exercises. Reply with the JSON object and nothing ',
    'else — no explanation before or after it, no markdown code fence.',
  ].join('');

  content.push({ type: 'text', text: instruction });

  const messages = [{ role: 'user', content }];
  let lastProblem = '';

  // Two attempts: a stray character in a long JSON reply shouldn't cost the
  // learner their whole upload, so we hand the problem back and let Claude fix it.
  for (let attempt = 0; attempt < 2; attempt++) {
    let message;
    try {
      message = await client().messages.stream({
        model: MODEL,
        max_tokens: 32000,
        system: SYSTEM,
        thinking: { type: 'adaptive' },
        messages,
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

    if (message.stop_reason === 'max_tokens') {
      throw new Error(
        'That produced more exercises than fit in one response. ' +
        'Try uploading it in smaller pieces — a page at a time.'
      );
    }

    const raw = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    if (!raw.trim()) throw new Error('Claude returned an empty response');

    const parsed = parseJson(raw);
    if (parsed.ok) {
      const result = ParsedContent.safeParse(parsed.value);
      if (result.success) return { content: result.data, usage: message.usage };
      const issue = result.error.issues[0];
      lastProblem = `${issue.path.join('.') || 'the response'}: ${issue.message}`;
    } else {
      lastProblem = parsed.error;
    }

    if (attempt === 0) {
      messages.push(
        { role: 'assistant', content: raw.slice(0, 4000) },
        { role: 'user', content:
          `That didn't match the required shape — ${lastProblem}. ` +
          'Send the whole JSON object again, corrected, with nothing around it.' }
      );
    }
  }

  throw new Error(`Claude's reply did not match the expected shape (${lastProblem})`);
}

/** Pull the JSON object out of a reply, tolerating a code fence or stray prose. */
function parseJson(raw) {
  let text = raw.trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();

  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last <= first) {
    return { ok: false, error: 'no JSON object in the reply' };
  }
  text = text.slice(first, last + 1);

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: `not valid JSON (${err.message})` };
  }
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
