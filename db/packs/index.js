// Lesson packs: shared content added to the library after it first shipped.
//
// db/seed-content.json is loaded once, when a database is first set up, so
// editing it never reaches an app that's already running. A pack does: each
// deployment checks which packs its database has and loads the missing ones
// (see ensurePacks in api/_lib/db.js). Everyone sees them, new accounts and
// existing ones alike.
//
// To add one, write a module in the shape of mathilde-2026.js — the same shape
// the upload parser produces — and list it here. A pack's key is permanent:
// it's how a database remembers having loaded it. Slugs are permanent too,
// because progress is recorded against them; `npm run check` validates both.

import mathilde2026 from './mathilde-2026.js';

export const PACKS = [mathilde2026];
