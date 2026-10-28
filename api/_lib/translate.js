import { createHash } from 'node:crypto';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { client, explain } from './claude.js';

// Someone is waiting with their finger on a word, and the job is small, so
// this runs at low effort. Refusal fallbacks are on: a declined lookup is
// retried on the fallback model inside the same call.
const MODEL = 'claude-opus-5-5';

export const Translation = z.object({
  language: z.enum(['fr', 'en', 'other']),
  word: z.string(),
  base: z.string(),
  meaning: z.string(),
  grammar: z.string(),
  sentence: z.string(),
});

const SYSTEM = `You help a British English speaker read French while they learn it (roughly
A1 to B1). In their revision app they tapped or highlighted some text (a word, a
phrase, or a sentence or two) because they want to know what it means. Reply with:

- language: "fr" if the text is French, "en" if it is English, "other" if neither.
- word: the text exactly as given.

When it is French:
- base: its dictionary form — the infinitive for a verb, the masculine singular for an
  adjective, the noun with un or une ("un casque"). For an elided or set chunk such as
  "c'était" or "y aller", give the most useful form ("être", "aller"). For a whole
  sentence, an empty string.
- meaning: what it means here in English: a few words for a word or phrase, a full
  translation for a sentence or more.
- grammar: one short line a learner would find useful — tense and person for a verb,
  gender for a noun, what an elision stands for — or an empty string if nothing is
  worth saying.
- sentence: a natural English translation of the whole sentence it sits in.

When it is English, go the other way, so the learner gets the French:
- meaning: the French for it, as it would be said here.
- base: for a single word, the French dictionary form ("un casque", "aller");
  otherwise an empty string.
- grammar: a short note on the French if it helps (gender, the preposition that goes
  with it), or an empty string.
- sentence: the whole sentence in French.

When it is neither, say which language it is in meaning and leave the rest empty.

A blank (___) is a gap in an exercise; translate around it. English words in brackets
are exercise hints; leave them out. If the app already has an English version of the
sentence it is given too: keep your meaning consistent with it.`;

/** The cache key: the same word in the same sentence, however it was typed. */
export function translationKey(word, sentence) {
  const norm = (s) => String(s).normalize('NFC').replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ').trim().toLowerCase();
  return createHash('sha256').update(`${norm(word)}\n${norm(sentence)}`).digest('hex');
}

/** What `word` means in `sentence`, and the sentence in English. */
export async function translateInSentence({ word, sentence, known }) {
  const ask = `Sentence: ${sentence}\nTapped: ${word}` +
    (known ? `\nThe app's English for the sentence: ${known}` : '');

  let message;
  try {
    message = await client().beta.messages.parse({
      model: MODEL,
      max_tokens: 4000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: betaZodOutputFormat(Translation) },
      system: SYSTEM,
      messages: [{ role: 'user', content: ask }],
    });
  } catch (err) {
    throw new Error(explain(err).replace(/Claude could not read that( material)?/, 'Claude could not translate that'));
  }

  if (message.stop_reason === 'refusal') throw new Error('Claude declined to translate that.');
  if (!message.parsed_output) throw new Error('The translation came back in a shape the app could not read.');
  return message.parsed_output;
}
