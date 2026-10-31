import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';

// Keys the client is allowed to sync. Anything else is ignored, so a stray
// localStorage write can't fill the database with junk.
const ALLOWED = new Set([
  'fr_settings', 'fr_streak', 'fr_last', 'fr_time', 'fr_workbook',
  'fr_custom', 'fr_today_done', 'fr_reminder', 'fr_welcomed',
  'fr_translate_history', 'fr_last_backup', 'fr_phone', 'fr_today_plan', 'fr_story_reads',
  'fr_mistakes', 'fr_sticking',
]);

const MAX_VALUE_BYTES = 512 * 1024;

// Practice time is { 'YYYY-MM-DD': seconds }, and the streak is counted from
// it. Each device sends its whole copy, so a phone that had the app open for
// days would wipe out a day practised on the laptop. Merge instead: the most
// time recorded for each day wins, and days past what the app keeps drop off.
const TIME_KEEP_DAYS = 400;

function mergeTime(saved, incoming) {
  const cutoff = new Date(Date.now() - TIME_KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  const out = {};
  for (const source of [saved, incoming]) {
    if (!source || typeof source !== 'object') continue;
    for (const [day, seconds] of Object.entries(source)) {
      if (day < cutoff || !Number.isFinite(seconds)) continue;
      out[day] = Math.max(out[day] || 0, seconds);
    }
  }
  return out;
}

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

  for (const [key, given] of pairs) {
    let value = given;
    if (key === 'fr_time') {
      const [row] = await sql`
        select value from user_state where user_id = ${user.id}::uuid and key = 'fr_time'`;
      value = mergeTime(row?.value, given);
    }
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
