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
    select id, input_type, title, files, raw_text, status, stats
      from sources where id = ${id}::uuid and user_id = ${user.id}::uuid limit 1`;

  if (!source) return bad(res, 'No such upload', 404);
  if (source.status === 'parsing') return bad(res, 'That upload is already being read', 409);
  if (source.status === 'ready') return bad(res, 'That upload has already been turned into exercises', 409);

  await sql`update sources set status = 'parsing', error = null where id = ${source.id}::uuid`;

  try {
    const files = source.input_type === 'text' ? [] : await loadPages(source);

    if (source.input_type !== 'text' && !files.length) {
      throw new Error('No pages were attached to this upload');
    }

    const { content, usage } = await parseMaterial({
      text: source.raw_text,
      files,
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
             -- Drop the inline bytes now they've been read; keep the page list.
             files = coalesce(
               (select jsonb_agg(page - 'data') from jsonb_array_elements(files) as page),
               '[]'::jsonb)
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

/**
 * Every page as base64, in order. Pages live either in Blob storage or, when
 * that isn't configured, inline on the row itself.
 */
async function loadPages(source) {
  const pages = source.files || [];
  return Promise.all(pages.map(async (page, i) => {
    if (page.data) return { base64: page.data, mimeType: page.mimeType };
    if (!page.url) throw new Error(`Page ${i + 1} of this upload is missing`);
    const resp = await fetch(page.url);
    if (!resp.ok) throw new Error(`Could not read page ${i + 1} (${resp.status})`);
    const buf = Buffer.from(await resp.arrayBuffer());
    return { base64: buf.toString('base64'), mimeType: page.mimeType };
  }));
}

function tokenSummary(usage) {
  if (!usage) return null;
  return { input: usage.input_tokens, output: usage.output_tokens };
}
