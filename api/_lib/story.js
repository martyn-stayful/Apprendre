import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { client, explain } from './claude.js';

// Writing a story to a brief (targets, level, grammar, continuity) is where
// the stronger model earns its cost. Refusal fallbacks are on, so a declined
// request is retried on the fallback model inside the same call.
const MODEL = 'claude-opus-5-5';

export const GENRES = {
  everyday: 'everyday life: small problems, neighbours, work, the weather',
  comedy: 'comedy: a misunderstanding or a plan that goes wrong',
  mystery: 'a small mystery to solve by the end',
  romance: 'romance, light and a little awkward',
  adventure: 'an adventure in the mountains',
};

const Sentence = z.object({ fr: z.string(), en: z.string() });

export const GeneratedStory = z.object({
  title: z.string(),
  blurb: z.string(),
  summary: z.string(),
  paragraphs: z.array(z.array(Sentence)),
  focus: z.array(z.string()),
  targets_used: z.array(z.string()),
});

// Only the schema goes to the API: the reply is parsed and checked here, so a
// bad one can be retried instead of failing the whole request.
const { type, schema } = betaZodOutputFormat(GeneratedStory);
const FORMAT = { type, schema };

const SYSTEM = `You write short French stories for a British English speaker learning French
(somewhere between A1 and B1), as reading practice inside their revision app. Each
story is one episode of an ongoing series set in Morzine, a ski village in the French
Alps, with a recurring cast:

- Chloé Martin, 29, runs Le Fournil, the bakery-café on the main street. Practical,
  funny, always busy, up at five every morning.
- Hugo Bernard, 34, ski instructor in winter and mountain-bike guide in summer.
  Charming, always late, and his stories get bigger every time he tells them.
- Madame Perrin, 74, lives in the chalet next to the bakery with her cat, Gaston.
  Knows everybody's business. Secretly kind.
- Sam Taylor, 31, English, new in Morzine, works the bar at the Hôtel L'Étoile and
  is learning French. His mistakes are funny, never stupid.
- Inès, 16, Chloé's cousin, helping in the café for the season. Bored, sharp, always
  on her phone.
- Biscotte, Hugo's dog, who steals croissants.

Not everyone has to appear. Stay consistent with the earlier episodes you're given
and move things on: running jokes, small problems that carry over, relationships
that change.

How to write it:
- Write at the learner's level (a CEFR sub-level). Short sentences; mostly the
  present at A1, with the passé composé and the imparfait from A2. Lean on the words
  the learner already knows and on everyday vocabulary at that level.
- The targets are what the learner is studying right now, and the story exists to
  show them in context. Use every target at least twice, in whatever form fits the
  sentence (a conjugated verb, a feminine adjective).
- Use the grammar point you're given at least three times.
- Apart from the targets, keep new or harder words to a handful.
- Dialogue is welcome, in French quotation marks « like this ».
- Correct French throughout: accents, agreement, elision, and a space before ? ! : ;
  as French typography has it. Use straight apostrophes (').
- Make it a story: something happens, and it ends on a small payoff or twist.

What to return:
- paragraphs: the story as paragraphs, each a list of sentences. Each sentence has
  fr, and en, a natural English translation of that one sentence.
- In fr, gloss every target, every word a learner at this level might not know, and
  every idiom, as [[french|english]] or [[french|english|short note]], for example
  [[est allé|went|passé composé of aller]]. Gloss a whole phrase where the meaning
  needs it: [[y aller|to go there]]. A gloss never contains [, ] or |.
- title: a short French title.
- blurb: one line in English that teases the episode.
- summary: two or three sentences in English saying what happened, for writing the
  next episode.
- focus: two or three short notes on the grammar this story practises, with the
  French in <em>…</em>, for example "<em>je peux y aller</em>: after pouvoir, the
  infinitive".
- targets_used: the targets you used, written exactly as they were given.`;

const LENGTHS = { short: 'about 150 words', long: 'about 300 words' };

/**
 * Write one episode. `targets` are [{ fr, en, kind }], `grammar` is
 * [{ title, rule }], `known` is a list of French words, `episodes` is
 * [{ title, summary }] newest first.
 */
export async function writeStory({ level, genre, length, targets, grammar, known, episodes }) {
  const brief = [
    `Level: ${level}`,
    `Genre: ${GENRES[genre] || GENRES.everyday}`,
    `Length: ${LENGTHS[length] || LENGTHS.long}`,
    '',
    'Targets (use each at least twice):',
    ...targets.map((t) => `- ${t.fr} (${t.en})`),
    '',
    grammar.length ? 'Grammar to practise:' : 'Grammar: whatever suits the level.',
    ...grammar.map((g) => `- ${g.title}${g.rule ? `: ${g.rule}` : ''}`),
    '',
    known.length ? `Words the learner already knows: ${known.join(', ')}` : '',
    '',
    episodes.length ? 'Earlier episodes, newest first:' : 'This is the first episode.',
    ...episodes.map((e, i) => `${i + 1}. ${e.title}: ${e.summary}`),
  ].join('\n');

  let lastProblem = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    const ask = attempt === 0 ? brief
      : `${brief}\n\nYour last version had a problem: ${lastProblem}. Write it again and fix that.`;

    let message;
    try {
      message = await client().beta.messages.stream({
        model: MODEL,
        max_tokens: 32000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'medium', format: FORMAT },
        system: SYSTEM,
        messages: [{ role: 'user', content: ask }],
      }).finalMessage();
    } catch (err) {
      throw new Error(explain(err).replace(/Claude could not read that( material)?/, 'Claude could not write the story'));
    }
    if (message.stop_reason === 'refusal') throw new Error('Claude declined to write this story. Try a different genre.');

    const raw = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    let story;
    try {
      story = GeneratedStory.parse(JSON.parse(raw));
    } catch {
      lastProblem = message.stop_reason === 'max_tokens' ? 'it was cut off before the end' : 'it was not valid JSON in the requested shape';
      continue;
    }

    const problem = checkStory(story, targets);
    if (!problem) return { story, usage: message.usage };
    lastProblem = problem;
  }
  throw new Error(`The story didn't come out right (${lastProblem}). Try again.`);
}

const GLOSS = /\[\[([^\]|]+)\|([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/** What's wrong with a story, or '' if nothing. */
export function checkStory(story, targets) {
  const sentences = story.paragraphs.flat();
  if (sentences.length < 4) return 'it was too short';
  for (const s of sentences) {
    if (!s.fr.trim() || !s.en.trim()) return 'a sentence was missing its French or English';
    const opened = (s.fr.match(/\[\[/g) || []).length;
    if (opened !== [...s.fr.matchAll(GLOSS)].length) return `a gloss was malformed in "${s.fr.slice(0, 60)}"`;
  }
  const missing = missingTargets(plainText(story), targets);
  if (missing.length > targets.length / 2) return `it left out these targets: ${missing.map((t) => t.fr).join(', ')}`;
  return '';
}

/** The French of the story with the gloss markup taken out. */
export function plainText(story) {
  return story.paragraphs.flat().map((s) => s.fr.replace(GLOSS, '$1')).join(' ');
}

const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/’/g, "'");

/**
 * Targets that don't appear in the text. A target counts as used if one of its
 * longer words turns up with the same start, so "je voulais" is found in
 * "voulait" and "un casque" in "casques".
 */
export function missingTargets(text, targets) {
  const words = new Set(fold(text).split(/[^a-z0-9]+/).filter(Boolean));
  const stems = [...words];
  return targets.filter((t) => {
    const parts = fold(t.fr).split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
    if (!parts.length) return !fold(text).includes(fold(t.fr).trim());
    return !parts.some((w) => {
      const stem = w.slice(0, Math.max(4, w.length - 2));
      return stems.some((x) => x.startsWith(stem));
    });
  });
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The reader escapes the French inside glosses itself, so the text has to stay
// unescaped; it just can't be allowed to carry markup.
const safeText = (s) => String(s).replace(/[<>]/g, '').replace(/&/g, 'et').replace(/’/g, "'");

/**
 * The story as the reader's HTML: one span per sentence, marked as French and
 * carrying its English, so tapping a word can show the sentence at once and
 * Play can read it a sentence at a time.
 */
export function storyBody(story) {
  return story.paragraphs.map((p) =>
    `<p>${p.map((s) => `<span class="st-s" lang="fr" data-tr-en="${escapeAttr(s.en)}">${safeText(s.fr)}</span>`).join(' ')}</p>`,
  ).join('\n');
}

export function storyTranslation(story) {
  return story.paragraphs.map((p) => `<p>${p.map((s) => escapeAttr(s.en)).join(' ')}</p>`).join('\n');
}

/** Focus notes may carry <em>; nothing else. */
export function safeFocus(note) {
  return escapeAttr(note).replace(/&lt;(\/?)em&gt;/g, '<$1em>');
}
