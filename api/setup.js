import { route, ok, bad } from './_lib/http.js';
import seedData from '../db/seed-content.json' with { type: 'json' };

/**
 * What still needs configuring. Deliberately unauthenticated — it runs before
 * anyone can sign in — so it reports only whether each piece is present, never
 * any value.
 */
export default route(['GET', 'POST'], async (req, res) => {
  if (req.method === 'POST') return initialise(res);

  const checks = [];

  const secret = process.env.AUTH_SECRET || '';
  checks.push({
    key: 'AUTH_SECRET',
    label: 'Login secret',
    ok: secret.length >= 16,
    required: true,
    detail: secret
      ? (secret.length >= 16 ? 'Set.' : 'Set, but too short — use at least 16 characters.')
      : 'Not set. Any long random string will do.',
  });

  checks.push({
    key: 'ANTHROPIC_API_KEY',
    label: 'Claude API key',
    ok: Boolean(process.env.ANTHROPIC_API_KEY),
    required: true,
    detail: process.env.ANTHROPIC_API_KEY
      ? 'Set.'
      : 'Not set. Uploads cannot be read without it.',
  });

  let database = { key: 'DATABASE_URL', label: 'Neon database', ok: false, required: true, detail: '' };
  if (!process.env.DATABASE_URL) {
    database.detail = 'Not set. Add a Neon database to this project on Vercel.';
  } else {
    try {
      const { db } = await import('./_lib/db.js');
      const rows = await db()`select count(*)::int as decks from decks where user_id is null`;
      const decks = rows[0]?.decks ?? 0;
      database.ok = decks > 0;
      database.detail = decks > 0
        ? `Connected — ${decks} built-in decks loaded.`
        : 'Connected, but empty. Run: npm run db:setup';
    } catch (err) {
      database.detail = /relation .* does not exist/i.test(err.message)
        ? 'Connected, but the tables are missing. Run: npm run db:setup'
        : `Could not connect: ${err.message}`;
    }
  }
  checks.push(database);

  checks.push({
    key: 'BLOB_READ_WRITE_TOKEN',
    label: 'File storage (optional)',
    ok: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    required: false,
    detail: process.env.BLOB_READ_WRITE_TOKEN
      ? 'Set — original photos and PDFs are kept.'
      : 'Not set. Uploads still work; the original file just is not kept.',
  });

  return ok(res, {
    ready: checks.every((c) => c.ok || !c.required),
    checks,
  });
});


/**
 * Create the tables and load the built-in library, from the browser, so nobody
 * needs a terminal and a connection string to get started.
 *
 * Only possible while the app is genuinely uninitialised: once an account
 * exists, or the library is loaded, this refuses. That keeps it from being a
 * way to meddle with a running app.
 */
async function initialise(res) {
  if (!process.env.DATABASE_URL) {
    return bad(res, 'There is no database connected yet. Add Neon to this project on Vercel first.', 409);
  }

  const { db } = await import('./_lib/db.js');
  const { applySchema, seedBuiltins } = await import('./_lib/seed.js');
  const sql = db();

  try {
    const [{ count }] = await sql`select count(*)::int as count from users`;
    if (count > 0) {
      return bad(res, 'This app is already set up — sign in instead.', 409);
    }
  } catch (err) {
    // No users table yet is exactly the case we are here to fix.
    if (!/relation .* does not exist/i.test(err.message)) throw err;
  }

  await applySchema(sql);

  // A previous attempt may have timed out part-way through. Since we've just
  // established there are no accounts, clearing the built-in content is safe
  // and makes a retry start from a clean slate rather than a half-load.
  await sql`delete from sources where user_id is null`;
  for (const table of ['decks', 'quizzes', 'verbs', 'drills', 'concepts', 'stories',
                       'roleplays', 'grammar_notes', 'workbook_chapters']) {
    await sql.query(`delete from ${table} where user_id is null`);
  }

  const stats = await seedBuiltins(sql, seedData);

  return ok(res, {
    initialised: true,
    stats,
    message: stats
      ? 'Database ready and the built-in library is loaded.'
      : 'Database ready — the built-in library was already there.',
  });
}
