import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ParsedContent } from './schema.js';

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
  separate decks rather than one long one.`;

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
    '\n\nRead it and build the exercises.',
  ].join('');

  content.push({ type: 'text', text: instruction });

  const stream = client().messages.stream({
    model: MODEL,
    max_tokens: 32000,
    system: SYSTEM,
    thinking: { type: 'adaptive' },
    output_config: { format: zodOutputFormat(ParsedContent, 'lesson_content') },
    messages: [{ role: 'user', content }],
  });

  const message = await stream.finalMessage();

  if (message.stop_reason === 'refusal') {
    throw new Error(
      'Claude declined to process this material' +
      (message.stop_details?.explanation ? `: ${message.stop_details.explanation}` : '.')
    );
  }

  const raw = message.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  if (!raw.trim()) throw new Error('Claude returned an empty response');

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    if (message.stop_reason === 'max_tokens') {
      throw new Error('The material produced more exercises than fit in one response. Try splitting it into smaller uploads.');
    }
    throw new Error('Claude returned something that was not valid JSON');
  }

  const result = ParsedContent.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Claude's output did not match the expected shape: ${result.error.issues[0]?.message || 'unknown mismatch'}`);
  }

  return { content: result.data, usage: message.usage };
}
