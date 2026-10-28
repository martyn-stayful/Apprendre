import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { translateInSentence, translationKey } from './_lib/translate.js';

// New lookups each learner can make in a day. Repeats are served from the
// cache and don't count, so this only stops a runaway script spending credit.
const DAILY_LIMIT = 300;

// POST { word, sentence, known? } -> { translation: { word, base, meaning, grammar, sentence } }
export default route('POST', withAuth(async (req, res, user) => {
  const { word, sentence, known } = body(req);
  if (typeof word !== 'string' || !word.trim()) return bad(res, 'Which word?');
  if (typeof sentence !== 'string' || !sentence.trim()) return bad(res, 'The sentence is missing');
  if (word.length > 80 || sentence.length > 600) return bad(res, 'That is too long to look up');

  const sql = db();
  const key = translationKey(word, sentence);
  const [hit] = await sql`select result from translations where key = ${key}`;
  if (hit) return ok(res, { translation: hit.result, cached: true });

  const [{ n }] = await sql`
    select count(*)::int as n from translations
     where user_id = ${user.id}::uuid and created_at > now() - interval '1 day'`;
  if (n >= DAILY_LIMIT) {
    return bad(res, `That's ${DAILY_LIMIT} new lookups today, the daily limit. Words you've looked up before still work.`, 429);
  }

  const translation = await translateInSentence({
    word: word.trim(),
    sentence: sentence.trim(),
    known: typeof known === 'string' ? known.slice(0, 600) : '',
  });
  await sql`
    insert into translations (key, result, user_id)
    values (${key}, ${JSON.stringify(translation)}::jsonb, ${user.id}::uuid)
    on conflict (key) do nothing`;
  return ok(res, { translation });
}));
