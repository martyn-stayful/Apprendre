// Set up the database from the command line.
//
//   node scripts/seed.mjs --schema        create tables, then seed
//   node scripts/seed.mjs                 seed only (safe to re-run)
//   node scripts/seed.mjs --schema --reset  wipe built-in content first
//
// You normally don't need this: the app can set itself up from the browser the
// first time you open it. This is here for local work and for reloading the
// built-in library after changing db/seed-content.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { applySchema, seedBuiltins } from '../api/_lib/seed.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Export it, or run `vercel env pull .env.local` first.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const data = JSON.parse(fs.readFileSync(path.join(root, 'db', 'seed-content.json'), 'utf8'));

if (args.has('--schema')) {
  console.log('Applying schema...');
  await applySchema(sql);
  console.log('  schema ready');
}

if (args.has('--reset')) {
  console.log('Removing existing built-in content...');
  await sql`delete from sources where user_id is null`;
  for (const table of ['decks', 'quizzes', 'verbs', 'drills', 'concepts', 'stories',
                       'roleplays', 'grammar_notes', 'workbook_chapters']) {
    await sql.query(`delete from ${table} where user_id is null`);
  }
}

const stats = await seedBuiltins(sql, data);

if (!stats) {
  console.log('Built-in content is already loaded. Use --reset to replace it.');
} else {
  console.log('\nSeeded the built-in library:');
  for (const [key, value] of Object.entries(stats)) console.log(`  ${key.padEnd(14)} ${value}`);
}
