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
