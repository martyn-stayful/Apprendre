import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { withAuth } from '../_lib/auth.js';

const MAX_BYTES = 8 * 1024 * 1024;

const MIME = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  pdf: ['application/pdf'],
};

/**
 * GET    — the learner's uploads, newest first.
 * POST   — accept material and queue it. Parsing happens in /api/uploads/parse.
 * DELETE — remove an upload and everything built from it (?id=...).
 */
export default route(['GET', 'POST', 'DELETE'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') {
    const rows = await sql`
      select id, kind, input_type, title, file_name, file_url, status, error,
             summary, stats, created_at, parsed_at
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
       returning id, file_url`;
    if (!rows.length) return bad(res, 'No such upload', 404);
    await deleteBlob(rows[0].file_url);
    return ok(res, { deleted: rows[0].id });
  }

  // ---- POST -------------------------------------------------------------
  const { inputType, title, note, text, fileName, mimeType, dataBase64 } = body(req);

  if (!['text', 'image', 'pdf'].includes(inputType)) {
    return bad(res, 'inputType must be text, image or pdf');
  }

  let rawText = null;
  let fileUrl = null;
  let fileData = null;

  if (inputType === 'text') {
    rawText = String(text || '').trim();
    if (rawText.length < 20) return bad(res, 'That is too short to build exercises from');
    if (rawText.length > 200000) return bad(res, 'That text is too long — split it into a few uploads');
  } else {
    if (!dataBase64) return bad(res, 'No file data was sent');
    if (!MIME[inputType].includes(mimeType)) {
      return bad(res, `${mimeType || 'That file type'} is not supported. Use a JPEG, PNG, WebP or PDF.`);
    }
    const bytes = Math.floor((dataBase64.length * 3) / 4);
    if (bytes > MAX_BYTES) {
      return bad(res, `That file is ${(bytes / 1024 / 1024).toFixed(1)}MB — the limit is 8MB`, 413);
    }
    const stored = await storeBlob(dataBase64, fileName, mimeType, user.id);
    if (stored) fileUrl = stored;
    else fileData = dataBase64;  // no Blob storage configured — keep the bytes with the row
  }

  const [source] = await sql`
    insert into sources (user_id, kind, input_type, title, file_name, file_url,
                         file_data, mime_type, raw_text, status)
    values (${user.id}::uuid, 'upload', ${inputType},
            ${String(title || '').trim() || defaultTitle(inputType, fileName)},
            ${fileName || null}, ${fileUrl}, ${fileData}, ${mimeType || null},
            ${rawText}, 'pending')
    returning id, title, status, input_type, created_at`;

  // The learner's instruction rides along with the source so parse can use it.
  if (note) {
    await sql`
      update sources set stats = jsonb_set(stats, '{note}', ${JSON.stringify(String(note).slice(0, 2000))}::jsonb)
       where id = ${source.id}::uuid`;
  }

  return ok(res, { upload: source });
}));

function defaultTitle(inputType, fileName) {
  if (fileName) return fileName.replace(/\.[a-z0-9]+$/i, '').slice(0, 120);
  return inputType === 'text' ? 'Pasted notes' : 'Lesson material';
}

async function storeBlob(dataBase64, fileName, mimeType, userId) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { put } = await import('@vercel/blob');
    const safe = (fileName || 'upload').replace(/[^\w.\-]+/g, '_').slice(0, 80);
    const blob = await put(`uploads/${userId}/${Date.now()}-${safe}`, Buffer.from(dataBase64, 'base64'), {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (err) {
    // Storage is a nicety — losing it shouldn't lose the upload.
    console.error('Blob upload failed, falling back to inline storage:', err);
    return null;
  }
}

async function deleteBlob(url) {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { del } = await import('@vercel/blob');
    await del(url);
  } catch (err) {
    console.error('Could not delete blob', url, err);
  }
}
