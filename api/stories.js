import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { visibleOwnerIds } from './_lib/partners.js';
import {
  writeStory, storyBody, storyTranslation, safeFocus, missingTargets, plainText, GENRES,
} from './_lib/story.js';

// Stories each learner can have written in a day. Each one is a Claude call.
const DAILY_LIMIT = 5;

const LEVELS = ['A1.1', 'A1.2', 'A1.3', 'A2.1', 'A2.2', 'A2.3', 'B1.1', 'B1.2', 'B1.3'];

const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * POST { level, genre, length, targets: [{ fr, en, kind }], grammar: [{ title, rule }], known: [fr] }
 *
 * Writes the next episode from what the learner is studying, saves it to their
 * library (and so to any learning partner's), and returns it in the shape
 * /api/content uses.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const input = body(req);
  const level = LEVELS.includes(input.level) ? input.level : 'A2.1';
  const genre = GENRES[input.genre] ? input.genre : 'everyday';
  const length = input.length === 'short' ? 'short' : 'long';
  const targets = (Array.isArray(input.targets) ? input.targets : [])
    .map((t) => ({ fr: text(t?.fr, 80), en: text(t?.en, 120), kind: text(t?.kind, 20) }))
    .filter((t) => t.fr && t.en)
    .slice(0, 16);
  const grammar = (Array.isArray(input.grammar) ? input.grammar : [])
    .map((g) => ({ title: text(g?.title, 120), rule: text(g?.rule, 400) }))
    .filter((g) => g.title)
    .slice(0, 2);
  const known = (Array.isArray(input.known) ? input.known : [])
    .map((w) => text(w, 60)).filter(Boolean).slice(0, 200);
  if (targets.length < 3) return bad(res, 'Practise a few words first, so the story has something to use.');

  const sql = db();
  const [{ n }] = await sql`
    select count(*)::int as n from stories
     where user_id = ${user.id}::uuid and meta->>'generated' = 'true'
       and created_at > now() - interval '1 day'`;
  if (n >= DAILY_LIMIT) {
    return bad(res, `That's ${DAILY_LIMIT} stories today, the daily limit. You can write more tomorrow.`, 429);
  }

  // The series carries on across you and your learning partners.
  const owners = JSON.stringify(await visibleOwnerIds(user.id));
  const episodes = await sql`
    select title, meta->>'summary' as summary from stories
     where meta->>'generated' = 'true'
       and user_id in (select value::uuid from jsonb_array_elements_text(${owners}::jsonb) as value)
     order by created_at desc
     limit 3`;

  const { story, usage } = await writeStory({ level, genre, length, targets, grammar, known, episodes });
  console.log(`Story written for ${user.id}: ${usage?.input_tokens} in, ${usage?.output_tokens} out`);

  const missing = new Set(missingTargets(plainText(story), targets).map((t) => t.fr));
  const meta = {
    generated: true,
    genre,
    summary: story.summary,
    targets: targets.map((t) => ({ ...t, used: !missing.has(t.fr) })),
  };
  const row = {
    slug: `story-${Date.now().toString(36)}`,
    title: story.title,
    blurb: story.blurb,
    level,
    tags: ['new story', genre],
    focus: story.focus.slice(0, 3).map(safeFocus),
    body: storyBody(story),
    translation: storyTranslation(story),
  };
  await sql`
    insert into stories (user_id, slug, title, blurb, level, tags, focus, body, translation, meta)
    values (${user.id}::uuid, ${row.slug}, ${row.title}, ${row.blurb}, ${row.level},
            ${JSON.stringify(row.tags)}::jsonb, ${JSON.stringify(row.focus)}::jsonb,
            ${row.body}, ${row.translation}, ${JSON.stringify(meta)}::jsonb)`;

  return ok(res, { story: { ...row, mine: true, meta } });
}));
