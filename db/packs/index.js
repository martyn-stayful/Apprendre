// Lesson packs: shared content added to the library after it first shipped.
//
// db/seed-content.json is loaded once, when a database is first set up, so
// editing it never reaches an app that's already running. A pack does: each
// deployment checks which packs its database has and loads the missing ones
// (see ensurePacks in api/_lib/db.js). Everyone sees them, new accounts and
// existing ones alike.
//
// To add one, write a module in the shape of mathilde-2026.js — the same shape
// the upload parser produces, built with ./helpers.js — and add it to the end
// of the list. A pack's key is permanent: it's how a database remembers having
// loaded it. Slugs are permanent too, because progress is recorded against
// them; `npm run check` validates both.

import mathilde2026 from './mathilde-2026.js';
import notebook2026 from './notebook-2026.js';
import mathilde20261028 from './mathilde-2026-10-28.js';

// Oldest first. Each pack's material goes ahead of the ones before it in every
// list, so the most recent lessons are what you see first.
export const PACKS = [mathilde2026, notebook2026, mathilde20261028];
