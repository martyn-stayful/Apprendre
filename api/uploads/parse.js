import { waitUntil } from '@vercel/functions';
import { db } from '../_lib/db.js';
import { route, body, json, bad } from '../_lib/http.js';
import { withAuth } from '../_lib/auth.js';
import { parseMaterial } from '../_lib/claude.js';
import { importContent } from '../_lib/import.js';
import { PARSE_STALE_MINUTES } from '../_lib/files.js';

/**
 * Start reading an upload with Claude and turning it into exercises.
 *
 * Reading takes a few minutes, longer than a phone reliably holds a request
 * open: a locked screen or a switch to another app drops it ("Load failed").
 * So this answers 202 straight away and carries on in the background, and the
 * app polls GET /api/uploads?id= until the status is 'ready' or 'failed'.
 * vercel.json gives this route 300s, which the background work shares.
 */
export default route('POST', withAuth(async (req, res, user) => {
  const sql = db();
  const { id } = body(req);
  if (!id) return bad(res, 'Which upload? Pass an id.');

  const [source] = await sql`
    select id, input_type, title, files, raw_text, status, stats,
           file_url, file_data, mime_type, parsing_started_at
      from sources where id = ${id}::uuid and user_id = ${user.id}::uuid limit 1`;

  if (!source) return bad(res, 'No such upload', 404);
  if (source.status === 'ready') return bad(res, 'That upload has already been turned into exercises', 409);

  // A parse that timed out leaves 'parsing' behind with nothing to clear it, so
  // treat a stale one as abandoned rather than refusing every retry forever.
  if (source.status === 'parsing') {
    const startedAt = source.parsing_started_at ? new Date(source.parsing_started_at) : null;
    const minutes = startedAt ? (Date.now() - startedAt.getTime()) / 60000 : Infinity;
    if (minutes < PARSE_STALE_MINUTES) {
      return bad(res, 'That upload is being read right now — give it a moment.', 409);
    }
    console.log(`Retrying source ${source.id}; previous attempt stalled ${Math.round(minutes)}m ago`);
  }

  await sql`
    update sources set status = 'parsing', error = null, parsing_started_at = now()
     where id = ${source.id}::uuid`;

  waitUntil(readUpload(sql, user.id, source));
  return json(res, 202, { status: 'parsing' });
}));

/** Read the material, save the exercises, and record how it went on the row. */
async function readUpload(sql, userId, source) {
  try {
    const files = source.input_type === 'text' ? [] : await loadPages(source);

    if (source.input_type !== 'text' && !files.length) {
      throw new Error(
        'No pages are attached to this upload. Remove it and upload the photos again.'
      );
    }

    const { content, usage, truncated } = await parseMaterial({
      text: source.raw_text,
      files,
      note: source.stats?.note || '',
    });

    const stats = await importContent(userId, source.id, content);

    if (!Object.values(stats).some(Boolean)) {
      throw new Error(
        "Claude read the material but couldn't build any exercises from it. " +
        'If it was a photo, a sharper or better-lit one usually fixes this.'
      );
    }

    const summary = (content.summary || '') + (truncated
      ? ' (Claude\u2019s reply was cut short, so this may not cover everything on ' +
        'the page — upload it again if something is missing.)'
      : '');

    await sql`
      update sources
         set status = 'ready',
             title = ${content.title || source.title},
             summary = ${summary},
             stats = stats || ${JSON.stringify({ ...stats, usage: tokenSummary(usage) })}::jsonb,
             parsed_at = now(),
             -- Drop the inline bytes now they've been read; keep the page list.
             files = coalesce(
               (select jsonb_agg(page - 'data') from jsonb_array_elements(files) as page),
               '[]'::jsonb)
       where id = ${source.id}::uuid`;
  } catch (err) {
    console.error('Parse failed for source', source.id, err);
    const message = String(err?.message || 'Something went wrong reading that material').slice(0, 1000);
    try {
      await sql`
        update sources set status = 'failed', error = ${message} where id = ${source.id}::uuid`;
    } catch (saveErr) {
      // The row stays 'parsing'; GET /api/uploads reports it failed once it goes stale.
      console.error('Could not record the failure for source', source.id, saveErr);
    }
  }
}

/**
 * Every page as base64, in order. Pages live either in Blob storage or, when
 * that isn't configured, inline on the row itself.
 */
async function loadPages(source) {
  let pages = source.files || [];

  // Uploads made before an upload could hold several pages kept their single
  // file in its own columns. Read those as a one-page upload so they can still
  // be retried rather than being stranded.
  if (!pages.length && (source.file_data || source.file_url)) {
    pages = [{
      data: source.file_data || undefined,
      url: source.file_url || undefined,
      mimeType: source.mime_type || 'image/jpeg',
    }];
  }

  return Promise.all(pages.map(async (page, i) => {
    if (page.data) return { base64: page.data, mimeType: page.mimeType };
    if (!page.url) throw new Error(`Page ${i + 1} of this upload is missing`);
    const resp = await fetch(page.url);
    if (!resp.ok) {
      throw new Error(
        `Page ${i + 1} could not be loaded from storage (${resp.status}). ` +
        'Remove this upload and add the photos again.'
      );
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    return { base64: buf.toString('base64'), mimeType: page.mimeType };
  }));
}

function tokenSummary(usage) {
  if (!usage) return null;
  return { input: usage.input_tokens, output: usage.output_tokens };
}
