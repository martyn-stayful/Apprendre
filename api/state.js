import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';

// Keys the client is allowed to sync. Anything else is ignored, so a stray
// localStorage write can't fill the database with junk.
const ALLOWED = new Set([
  'fr_settings', 'fr_streak', 'fr_last', 'fr_time', 'fr_workbook',
  'fr_custom', 'fr_today_done', 'fr_reminder', 'fr_welcomed',
  'fr_translate_history', 'fr_last_backup',
]);

const MAX_VALUE_BYTES = 512 * 1024;

export default route(['GET', 'PUT'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') {
    const rows = await sql`
      select key, value from user_state where user_id = ${user.id}::uuid`;
    const state = {};
    for (const row of rows) state[row.key] = row.value;
    return ok(res, { state });
  }

  const { entries } = body(req);
  if (!entries || typeof entries !== 'object') return bad(res, 'Expected an "entries" object');

  const pairs = Object.entries(entries).filter(([key]) => ALLOWED.has(key));
  if (!pairs.length) return ok(res, { saved: 0 });

  for (const [key, value] of pairs) {
    const encoded = JSON.stringify(value ?? null);
    if (encoded.length > MAX_VALUE_BYTES) {
      return bad(res, `"${key}" is too large to sync (${Math.round(encoded.length / 1024)}KB)`, 413);
    }
    await sql`
      insert into user_state (user_id, key, value)
      values (${user.id}::uuid, ${key}, ${encoded}::jsonb)
      on conflict (user_id, key) do update
        set value = excluded.value, updated_at = now()`;
  }

  return ok(res, { saved: pairs.length });
}));
