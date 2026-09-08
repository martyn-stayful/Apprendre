import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';

/**
 * Spaced-repetition records. GET returns the whole map in the shape the client
 * keeps it in; PUT upserts a partial map (only the items that changed).
 */
export default route(['GET', 'PUT'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') {
    const rows = await sql`
      select item_id, level, seen, right_count, wrong_count, recent,
             to_char(last_seen, 'YYYY-MM-DD') as last_seen,
             to_char(last_correct_date, 'YYYY-MM-DD') as last_correct_date
        from mastery where user_id = ${user.id}::uuid`;

    const mastery = {};
    for (const r of rows) {
      mastery[r.item_id] = {
        level: r.level,
        seen: r.seen,
        right: r.right_count,
        wrong: r.wrong_count,
        recent: r.recent || [],
        lastSeen: r.last_seen,
        lastCorrectDate: r.last_correct_date,
      };
    }
    return ok(res, { mastery });
  }

  const { records } = body(req);
  if (!records || typeof records !== 'object') return bad(res, 'Expected a "records" object');

  const ids = Object.keys(records).slice(0, 2000);
  for (const id of ids) {
    const r = records[id] || {};
    await sql`
      insert into mastery (user_id, item_id, level, seen, right_count, wrong_count,
                           recent, last_seen, last_correct_date, updated_at)
      values (${user.id}::uuid, ${id},
              ${int(r.level)}, ${int(r.seen)}, ${int(r.right)}, ${int(r.wrong)},
              ${JSON.stringify(Array.isArray(r.recent) ? r.recent.slice(-10) : [])}::jsonb,
              ${r.lastSeen || null}::date, ${r.lastCorrectDate || null}::date, now())
      on conflict (user_id, item_id) do update
        set level = excluded.level, seen = excluded.seen,
            right_count = excluded.right_count, wrong_count = excluded.wrong_count,
            recent = excluded.recent, last_seen = excluded.last_seen,
            last_correct_date = excluded.last_correct_date, updated_at = now()`;
  }

  return ok(res, { saved: ids.length });
}));

function int(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}
