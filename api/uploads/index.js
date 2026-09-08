import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { withAuth } from '../_lib/auth.js';
import { deleteBlobs } from '../_lib/files.js';

/**
 * GET    — the learner's uploads, newest first.
 * POST   — start an upload. Pasted text arrives here whole; photos and PDFs are
 *          added afterwards, a page per request, via /api/uploads/file.
 * DELETE — remove an upload and everything built from it (?id=...).
 */
export default route(['GET', 'POST', 'DELETE'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') {
    const rows = await sql`
      select id, kind, input_type, title, status, error, summary, stats,
             created_at, parsed_at,
             jsonb_array_length(files) as pages
        from sources
       where user_id = ${user.id}::uuid
       order by created_at desc
       limit 100`;
    return ok(res, { uploads: rows });
  }

  if (req.method === 'DELETE') {
    const id = req.query?.id;
    if (!id) return bad(res, 'Which upload? Pass ?id=');
    // Content rows reference the source with on delete cascade, so they go too.
    const rows = await sql`
      delete from sources
       where id = ${id}::uuid and user_id = ${user.id}::uuid
       returning id, files`;
    if (!rows.length) return bad(res, 'No such upload', 404);
    await deleteBlobs(rows[0].files);
    return ok(res, { deleted: rows[0].id });
  }

  // ---- POST -------------------------------------------------------------
  const { inputType, title, note, text } = body(req);

  if (!['text', 'image', 'pdf'].includes(inputType)) {
    return bad(res, 'inputType must be text, image or pdf');
  }

  let rawText = null;
  if (inputType === 'text') {
    rawText = String(text || '').trim();
    if (rawText.length < 20) return bad(res, 'That is too short to build exercises from');
    if (rawText.length > 200000) return bad(res, 'That text is too long — split it into a few uploads');
  }

  const [source] = await sql`
    insert into sources (user_id, kind, input_type, title, raw_text, status, stats)
    values (${user.id}::uuid, 'upload', ${inputType},
            ${String(title || '').trim() || defaultTitle(inputType)},
            ${rawText}, 'pending',
            ${JSON.stringify(note ? { note: String(note).slice(0, 2000) } : {})}::jsonb)
    returning id, title, status, input_type, created_at`;

  return ok(res, { upload: source });
}));

function defaultTitle(inputType) {
  return inputType === 'text' ? 'Pasted notes' : 'Lesson material';
}
