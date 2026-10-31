import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { breakdownKey, explainFrench } from './_lib/sticking.js';

// New explanations each learner can ask for in a day, shared with Why? (the
// same table). Repeats come from the cache and don't count.
const DAILY_LIMIT = 100;

const text = (v, max) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

/**
 * POST { fr, en, ex, concepts: [{ id, title }] }
 *   -> { breakdown: { words: [{ fr, en }], points: [{ title, body }], tip, concept } }
 *
 * How a piece of French works, for a card the learner has just turned over:
 * chunk by chunk, the tenses and grammar in it, and the app's explainer to
 * read next, if one fits.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const input = body(req);
  const fr = text(input.fr, 300);
  if (!fr) return bad(res, 'What should be explained?');
  const concepts = (Array.isArray(input.concepts) ? input.concepts : [])
    .map((c) => ({ id: text(c?.id, 80), title: text(c?.title, 120) }))
    .filter((c) => c.id && c.title)
    .slice(0, 80);

  const sql = db();
  const key = breakdownKey(fr);
  const [hit] = await sql`select result from explanations where key = ${key}`;
  if (hit) return ok(res, { breakdown: hit.result, cached: true });

  const [{ n }] = await sql`
    select count(*)::int as n from explanations
     where user_id = ${user.id}::uuid and created_at > now() - interval '1 day'`;
  if (n >= DAILY_LIMIT) {
    return bad(res, `That's ${DAILY_LIMIT} explanations today, the daily limit. Ones you've seen before still work.`, 429);
  }

  const breakdown = await explainFrench({ fr, en: text(input.en, 300), ex: text(input.ex, 300), concepts });
  await sql`
    insert into explanations (key, result, user_id)
    values (${key}, ${JSON.stringify(breakdown)}::jsonb, ${user.id}::uuid)
    on conflict (key) do nothing`;
  return ok(res, { breakdown });
}));
