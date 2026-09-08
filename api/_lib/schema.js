import { z } from 'zod';

// The shape Claude must return when it reads a piece of lesson material.
// Every field is required: strict structured outputs have no optional keys, so
// "nothing to say here" is an empty string or an empty array.

const Card = z.object({
  fr: z.string().describe('The French word or phrase, with gender/agreement markers like "grand(e)" where useful'),
  en: z.string().describe('The English meaning'),
  ex: z.string().describe('A short French example sentence using the word, or "" if none fits'),
});

const Deck = z.object({
  slug: z.string().describe('lowercase_snake_case identifier, unique within this upload'),
  name: z.string().describe('Short human name, e.g. "Kitchen vocabulary"'),
  category: z.string().describe('One of: Adjectives, Adverbs, Verbs, Nouns, Grammar, Phrases, Numbers, Vocabulary'),
  level: z.string().describe('CEFR level: A1.1, A1.2, A2.1, A2.2, B1.1, B1.2'),
  cards: z.array(Card),
});

const QuizQuestion = z.object({
  prompt: z.string().describe('The French question, using ___ for the gap to fill'),
  en: z.string().describe('English translation of the complete correct sentence'),
  opts: z.array(z.string()).describe('Exactly 4 answer options; the distractors must be plausible'),
  answer_idx: z.number().int().describe('0-based index of the correct option in opts'),
  note: z.string().describe('One sentence explaining why the answer is right'),
});

const Quiz = z.object({
  slug: z.string(),
  title: z.string(),
  level: z.string(),
  questions: z.array(QuizQuestion),
});

const Drill = z.object({
  cat: z.string().describe('One of: general, meeting, shop, supermarket, bar'),
  en: z.string().describe('The instruction, e.g. "Say: I would like a coffee." or "Ask: Where is the station?"'),
  fr: z.string().describe('The model French answer'),
  note: z.string().describe('A short grammar reminder'),
  level: z.string(),
});

const Verb = z.object({
  infinitive: z.string(),
  meaning: z.string().describe('English meaning, e.g. "to drink"'),
  level: z.string(),
  forms: z.object({
    je: z.string(),
    tu: z.string(),
    'il/elle/on': z.string(),
    nous: z.string(),
    vous: z.string(),
    'ils/elles': z.string(),
  }).describe('Present-tense conjugation. Use the bare form without the pronoun, e.g. "bois".'),
});

const Concept = z.object({
  slug: z.string().describe('kebab-case identifier'),
  title: z.string(),
  subtitle: z.string().describe('A few example forms, e.g. "le / la / les"'),
  category: z.string().describe('CEFR band: A1.1, A1.2, A2.1, A2.2, B1.1, B1.2'),
  paragraphs: z.array(z.string()).describe('2-4 explanation paragraphs. Simple HTML (<strong>, <em>) allowed.'),
  table_rows: z.array(z.object({ en: z.string(), fr: z.string() })),
  examples: z.array(z.object({ fr: z.string(), en: z.string() })),
  pitfall: z.object({
    title: z.string().describe('The mistake English speakers make, or "" if there is nothing worth flagging'),
    body: z.string(),
  }),
});

const Roleplay = z.object({
  title: z.string().describe('French title, e.g. "À la pharmacie"'),
  ctx: z.string().describe('One English sentence setting the scene'),
  lines: z.array(z.object({
    who: z.enum(['them', 'you']),
    fr: z.string(),
    en: z.string(),
  })),
  notes: z.string().describe('Simple HTML with a tip or two about the exchange'),
});

const Story = z.object({
  slug: z.string(),
  title: z.string(),
  blurb: z.string().describe('One English line on what the story practises'),
  level: z.string().describe('A1, A2, B1'),
  tags: z.array(z.string()),
  focus: z.array(z.string()).describe('2-3 bullet points naming the grammar practised. Simple HTML allowed.'),
  body: z.string().describe(
    'The French story as HTML <p> paragraphs. Wrap any word worth glossing as ' +
    '[[french|english]] or [[french|english|short grammar note]]. Gloss generously.'
  ),
  translation: z.string().describe('Plain English translation as HTML <p> paragraphs'),
});

const GrammarNote = z.object({
  title: z.string(),
  body: z.string().describe('Simple HTML explanation. <p>, <strong>, <em>, <table class="gr-table"> allowed.'),
});

const WorkbookExercise = z.object({
  slug: z.string().describe('lowercase identifier unique within the chapter'),
  title: z.string(),
  instructions: z.string(),
  questions: z.array(z.object({
    prompt: z.string().describe('The question, with ___ marking what the learner supplies'),
    answer: z.string().describe('The expected answer — just the missing part, not the whole sentence'),
    hint: z.string().describe('A nudge, or "" for none'),
  })),
});

const WorkbookChapter = z.object({
  slug: z.string(),
  book: z.string().describe('Book number as a roman numeral, e.g. "I"'),
  book_title: z.string(),
  num: z.number().int(),
  title: z.string(),
  subtitle: z.string(),
  level: z.string(),
  rule: z.object({
    heading: z.string(),
    paras: z.array(z.string()),
  }),
  vocab: z.array(z.object({ fr: z.string(), en: z.string() })),
  exercises: z.array(WorkbookExercise),
});

export const ParsedContent = z.object({
  title: z.string().describe('A short title for this material, e.g. "Lesson 12 — the partitive"'),
  summary: z.string().describe('Two or three sentences on what the material covers and what was built from it'),
  decks: z.array(Deck),
  quizzes: z.array(Quiz),
  drills: z.array(Drill),
  verbs: z.array(Verb),
  concepts: z.array(Concept),
  roleplays: z.array(Roleplay),
  stories: z.array(Story),
  grammar_notes: z.array(GrammarNote),
  workbook_chapters: z.array(WorkbookChapter),
});
