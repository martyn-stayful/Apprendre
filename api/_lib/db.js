import { neon } from '@neondatabase/serverless';

let _sql = null;

/** Tagged-template SQL client, created lazily so imports don't fail without env. */
export function db() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set. Add a Neon database to the project.');
    _sql = neon(url);
  }
  return _sql;
}

/** Run several statements as one transaction. */
export async function tx(statements) {
  return db().transaction(statements);
}

let _schemaChecked = null;

/**
 * Bring the database up to the DDL this deployment expects.
 *
 * Schema changes used to happen only during first-time setup, which refuses
 * once an account exists — so a live database never picked up a new column and
 * every query against it failed. This runs once per process: a single cheap
 * version check, and the migration only when it's actually behind.
 */
export function ensureSchema() {
  if (!_schemaChecked) _schemaChecked = migrate().catch((err) => {
    _schemaChecked = null;   // let the next request try again
    throw err;
  });
  return _schemaChecked;
}

async function migrate() {
  const sql = db();
  const { SCHEMA_VERSION } = await import('./schema-sql.js');

  try {
    const [row] = await sql`select version from schema_meta where only_row limit 1`;
    if (row && row.version >= SCHEMA_VERSION) return;
  } catch {
    // No schema_meta table yet — either a fresh database or one created before
    // versioning existed. Either way, applying the schema is the right answer.
  }

  const { applySchema } = await import('./seed.js');
  console.log(`Migrating database to schema version ${SCHEMA_VERSION}`);
  await applySchema(sql);
}
