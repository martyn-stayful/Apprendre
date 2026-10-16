// Builders shared by the lesson packs, so each pack reads as content rather
// than as the shape the database wants.

// A stable stand-in for shuffling: the quiz and workbook screens show options
// in the order given, so the right answer can't always sit in the same place.
function spot(text, n) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h % n;
}

function placed(prompt, right, wrong) {
  const opts = [...wrong];
  const at = spot(prompt, wrong.length + 1);
  opts.splice(at, 0, right);
  return { opts, at };
}

/** Quiz question. The right answer comes first in `options`. */
export function mc(prompt, en, [right, ...wrong], note) {
  const { opts, at } = placed(prompt, right, wrong);
  return { prompt, en, opts, answer_idx: at, note };
}

/** Typed workbook question. Answers without hyphens are accepted too. */
export function typed(prompt, answer, { acceptable = [], hint, notes } = {}) {
  const accept = new Set(acceptable);
  for (const a of [answer, ...acceptable]) {
    if (a.includes('-')) accept.add(a.replace(/-/g, ' '));
  }
  accept.delete(answer);
  const q = { prompt, answer };
  if (accept.size) q.acceptable = [...accept];
  if (hint) q.hint = hint;
  if (notes) q.notes = notes;
  return q;
}

/** Multiple-choice workbook question. The right answer comes first. */
export function choice(prompt, [right, ...wrong], notes) {
  const q = { prompt, answer: right, options: placed(prompt, right, wrong).opts };
  if (notes) q.notes = notes;
  return q;
}

/** Daily 10 prompts for one category: [en, fr, note] triples. */
export function drills(cat, level, rows) {
  return rows.map(([en, fr, note = '']) => ({ cat, en, fr, note, level }));
}

/** A role-play line: [who, fr, en]. */
export const lines = (rows) => rows.map(([who, fr, en]) => ({ who, fr, en }));

/** Present-tense table from the six forms, je to ils/elles. */
export function forms(je, tu, il, nous, vous, ils) {
  return { je, tu, 'il/elle/on': il, nous, vous, 'ils/elles': ils };
}
