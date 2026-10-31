import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { cleanItem, explainMistake, whyKey } from './_lib/sticking.js';

// New explanations each learner can ask for in a day. Repeats come from the
// cache and don't count.
const DAILY_LIMIT = 100;

/**
 * POST { kind, prompt, en, answer, options, note, given } -> { why: { right, wrong, trick, also_ok } }
 *
 * Why the learner's answer was wrong and the right one right, for one question
 * they just missed. `given` is what they answered, or empty if they didn't know.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const input = body(req);
  const item = cleanItem({ ...input, given: [input.given] });
  if (!item) return bad(res, 'Which question? It needs the question and its answer.');

  const sql = db();
  const key = whyKey({ ...item, given: item.given.join(' / ') });
  const [hit] = await sql`select result from explanations where key = ${key}`;
  if (hit) return ok(res, { why: hit.result, cached: true });

  const [{ n }] = await sql`
    select count(*)::int as n from explanations
     where user_id = ${user.id}::uuid and created_at > now() - interval '1 day'`;
  if (n >= DAILY_LIMIT) {
    return bad(res, `That's ${DAILY_LIMIT} explanations today, the daily limit. Ones you've seen before still work.`, 429);
  }

  const why = await explainMistake(item);
  await sql`
    insert into explanations (key, result, user_id)
    values (${key}, ${JSON.stringify(why)}::jsonb, ${user.id}::uuid)
    on conflict (key) do nothing`;
  return ok(res, { why });
}));
