// Regenerate db/schema.sql from api/_lib/schema-sql.js, which is the source of
// truth (functions need the DDL in their bundle, not on disk).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_SQL } from '../api/_lib/schema-sql.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
fs.writeFileSync(path.join(root, 'db', 'schema.sql'), SCHEMA_SQL);
console.log('Wrote db/schema.sql');
