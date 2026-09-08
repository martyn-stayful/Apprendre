import { route, ok } from './_lib/http.js';

/**
 * What still needs configuring. Deliberately unauthenticated — it runs before
 * anyone can sign in — so it reports only whether each piece is present, never
 * any value.
 */
export default route('GET', async (req, res) => {
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
