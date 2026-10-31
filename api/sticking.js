import { waitUntil } from '@vercel/functions';
import { db } from './_lib/db.js';
import { route, body, ok, json, bad } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { PARSE_STALE_MINUTES } from './_lib/files.js';
import { planLessons, writeLesson, cleanItem, listLessons } from './_lib/sticking.js';

// New lessons each learner can have written in a day. Each one is a Claude call.
const DAILY_LIMIT = 12;
// New lessons from one look at the mistakes, so there are never too many to
// read; a lesson asked for by name comes on its own.
const PER_BUILD = 5;

/**
 * Lessons on the things the learner keeps getting wrong.
 *
 * GET                  — their lessons, newest first.
 * POST { items, ask }  — sort the mistakes in `items`, and a lesson asked for by
 *                        name in `ask`, into lessons. The sorting is quick and
 *                        happens now. The lessons are written in the background
 *                        ('writing', then 'ready' or 'failed') and the app
 *                        polls GET, as writing one can outlast a phone's
 *                        patience with an open request.
 * POST { retry: slug } — write a failed lesson again.
 * DELETE ?slug=        — remove a lesson.
 */
export default route(['GET', 'POST', 'DELETE'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') return ok(res, { lessons: await listLessons(sql, user.id) });

  if (req.method === 'DELETE') {
    const slug = req.query?.slug;
    if (!slug) return bad(res, 'Which lesson? Pass ?slug=');
    const rows = await sql`
      delete from sticking_lessons where user_id = ${user.id}::uuid and slug = ${slug} returning slug`;
    if (!rows.length) return bad(res, 'No such lesson', 404);
    return ok(res, { deleted: slug });
  }

  const input = body(req);

  if (input.retry) {
    const [row] = await sql`
      update sticking_lessons set status = 'writing', error = null, updated_at = now()
       where user_id = ${user.id}::uuid and slug = ${String(input.retry)}
         and (status = 'failed' or (status = 'writing'
              and updated_at < now() - make_interval(mins => ${PARSE_STALE_MINUTES})))
       returning id, brief`;
    if (!row) return bad(res, 'That lesson is already being written, or is finished.', 409);
    waitUntil(write(sql, row.id, row.brief));
    return json(res, 202, { lessons: await listLessons(sql, user.id) });
  }

  const items = (Array.isArray(input.items) ? input.items : []).map(cleanItem).filter(Boolean).slice(0, 40);
  const request = typeof input.ask === 'string' ? input.ask.replace(/\s+/g, ' ').trim().slice(0, 200) : '';
  if (!items.length && !request) return bad(res, 'There is nothing to make a lesson from yet.');

  const [{ n }] = await sql`
    select count(*)::int as n from sticking_lessons
     where user_id = ${user.id}::uuid and created_at > now() - interval '1 day'`;
  const max = Math.min(request ? 1 : PER_BUILD, DAILY_LIMIT - n);
  if (max <= 0) {
    return bad(res, `That's ${DAILY_LIMIT} lessons today, the daily limit. You can make more tomorrow.`, 429);
  }

  const existing = await sql`
    select id, slug, title, focus, item_ids from sticking_lessons
     where user_id = ${user.id}::uuid order by created_at`;
  const plan = await planLessons({ items, ask: request, existing, max });

  const fresh = [];
  // The lesson asked for first, so the limit never squeezes it out.
  for (const group of [...plan].sort((a, b) => Number(b.asked) - Number(a.asked))) {
    const covered = [...new Set(group.items)].map((k) => items[k - 1]).filter(Boolean);
    const known = group.existing && existing.find((l) => l.slug === group.existing);
    if (known) {
      // More of the same: the lesson they have covers these too.
      const ids = [...new Set([...(known.item_ids || []), ...covered.map((it) => it.id)])];
      await sql`
        update sticking_lessons set item_ids = ${JSON.stringify(ids)}::jsonb, updated_at = now()
         where id = ${known.id}::uuid`;
      continue;
    }
    if (fresh.length >= max || (!covered.length && !group.asked)) continue;

    const brief = {
      kind: group.kind,
      title: group.title.trim().slice(0, 120) || 'Something to sort out',
      focus: group.focus.trim().slice(0, 300),
      ask: group.asked ? request : '',
      items: covered,
    };
    const slug = `fix-${Date.now().toString(36)}-${fresh.length}`;
    const [row] = await sql`
      insert into sticking_lessons (user_id, slug, title, focus, item_ids, brief)
      values (${user.id}::uuid, ${slug}, ${brief.title}, ${brief.focus},
              ${JSON.stringify(covered.map((it) => it.id))}::jsonb, ${JSON.stringify(brief)}::jsonb)
      returning id`;
    fresh.push({ id: row.id, brief });
  }

  if (fresh.length) waitUntil(Promise.all(fresh.map((f) => write(sql, f.id, f.brief))));
  return json(res, fresh.length ? 202 : 200, { lessons: await listLessons(sql, user.id), added: fresh.length });
}));

/** Write one lesson and record how it went on its row. */
async function write(sql, id, brief) {
  try {
    const { lesson, usage } = await writeLesson(brief);
    console.log(`Lesson ${id} written: ${usage?.input_tokens} in, ${usage?.output_tokens} out`);
    await sql`
      update sticking_lessons
         set status = 'ready', title = ${lesson.title.trim().slice(0, 120) || brief.title},
             lesson = ${JSON.stringify(lesson)}::jsonb, error = null, updated_at = now()
       where id = ${id}::uuid`;
  } catch (err) {
    console.error('Lesson failed', id, err);
    const message = String(err?.message || 'Something went wrong writing the lesson').slice(0, 1000);
    try {
      await sql`
        update sticking_lessons set status = 'failed', error = ${message}, updated_at = now()
         where id = ${id}::uuid`;
    } catch (saveErr) {
      // The row stays 'writing'; listLessons reports it failed once it goes stale.
      console.error('Could not record the failure for lesson', id, saveErr);
    }
  }
}
