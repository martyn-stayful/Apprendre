import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { withAuth } from '../_lib/auth.js';
import { parseMaterial } from '../_lib/claude.js';
import { importContent } from '../_lib/import.js';

/**
 * Read an upload with Claude and turn it into exercises.
 * Long-running: vercel.json gives this route 300s.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const sql = db();
  const { id } = body(req);
  if (!id) return bad(res, 'Which upload? Pass an id.');

  const [source] = await sql`
    select id, input_type, title, file_url, file_data, mime_type, raw_text, status, stats
      from sources where id = ${id}::uuid and user_id = ${user.id}::uuid limit 1`;

  if (!source) return bad(res, 'No such upload', 404);
  if (source.status === 'parsing') return bad(res, 'That upload is already being read', 409);
  if (source.status === 'ready') return bad(res, 'That upload has already been turned into exercises', 409);

  await sql`update sources set status = 'parsing', error = null where id = ${source.id}::uuid`;

  try {
    const base64 = source.input_type === 'text' ? null : await fetchBytes(source);

    const { content, usage } = await parseMaterial({
      inputType: source.input_type,
      text: source.raw_text,
      base64,
      mimeType: source.mime_type,
      note: source.stats?.note || '',
    });

    const stats = await importContent(user.id, source.id, content);

    if (!Object.values(stats).some(Boolean)) {
      throw new Error(
        "Claude read the material but couldn't build any exercises from it. " +
        'If it was a photo, a sharper or better-lit one usually fixes this.'
      );
    }

    await sql`
      update sources
         set status = 'ready',
             title = ${content.title || source.title},
             summary = ${content.summary || ''},
             stats = stats || ${JSON.stringify({ ...stats, usage: tokenSummary(usage) })}::jsonb,
             parsed_at = now(),
             file_data = null
       where id = ${source.id}::uuid`;

    return ok(res, { status: 'ready', title: content.title, summary: content.summary, stats });
  } catch (err) {
    console.error('Parse failed for source', source.id, err);
    const message = String(err?.message || 'Something went wrong reading that material').slice(0, 1000);
    await sql`
      update sources set status = 'failed', error = ${message} where id = ${source.id}::uuid`;
    return bad(res, message, 422);
  }
}));

/** Base64 bytes for the upload, from Blob storage or from the row itself. */
async function fetchBytes(source) {
  if (source.file_data) return source.file_data;
  if (!source.file_url) throw new Error('The file for this upload is missing');
  const resp = await fetch(source.file_url);
  if (!resp.ok) throw new Error(`Could not read the stored file (${resp.status})`);
  const buf = Buffer.from(await resp.arrayBuffer());
  return buf.toString('base64');
}

function tokenSummary(usage) {
  if (!usage) return null;
  return { input: usage.input_tokens, output: usage.output_tokens };
}
