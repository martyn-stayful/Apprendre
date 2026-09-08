import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { withAuth } from '../_lib/auth.js';
import { storeBlob, base64Bytes, MIME, MAX_FILE_BYTES, MAX_FILES } from '../_lib/files.js';

/**
 * Add one page to an upload. Pages go up one request at a time rather than in
 * a single payload, because a serverless request body caps out around 4.5MB and
 * a handful of photos would blow straight through that.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const sql = db();
  const { id, fileName, mimeType, dataBase64 } = body(req);

  if (!id) return bad(res, 'Which upload? Pass an id.');
  if (!dataBase64) return bad(res, 'No file data was sent');

  const kind = MIME.image.includes(mimeType) ? 'image'
    : MIME.pdf.includes(mimeType) ? 'pdf' : null;
  if (!kind) {
    return bad(res, `${mimeType || 'That file type'} is not supported. Use a JPEG, PNG, WebP or PDF.`);
  }

  const bytes = base64Bytes(dataBase64);
  if (bytes > MAX_FILE_BYTES) {
    return bad(res, `${fileName || 'That file'} is ${(bytes / 1024 / 1024).toFixed(1)}MB — the limit is 4MB per page`, 413);
  }

  const [source] = await sql`
    select id, status, files from sources
     where id = ${id}::uuid and user_id = ${user.id}::uuid limit 1`;
  if (!source) return bad(res, 'No such upload', 404);
  if (source.status !== 'pending') return bad(res, 'That upload has already been read', 409);

  const existing = source.files || [];
  if (existing.length >= MAX_FILES) {
    return bad(res, `That's already ${MAX_FILES} pages — split the rest into another upload`, 413);
  }

  const url = await storeBlob(dataBase64, fileName, mimeType, user.id);
  const entry = {
    fileName: fileName || `page-${existing.length + 1}`,
    mimeType,
    bytes,
    ...(url ? { url } : { data: dataBase64 }),
  };

  // Only an upload made entirely of PDFs counts as a 'pdf'; anything mixed is
  // handled as images. This is just for the label shown in the uploads list —
  // parsing looks at each file's own type.
  const allPdf = [...existing, entry].every((f) => f.mimeType === 'application/pdf');

  const [updated] = await sql`
    update sources
       set files = files || ${JSON.stringify([entry])}::jsonb,
           input_type = ${allPdf ? 'pdf' : 'image'}
     where id = ${source.id}::uuid
     returning jsonb_array_length(files) as pages`;

  return ok(res, { pages: Number(updated.pages) });
}));
