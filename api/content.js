import { route, ok } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { loadContent } from './_lib/content.js';
import { db, ensurePacks } from './_lib/db.js';
import { listLessons } from './_lib/sticking.js';

/** Everything the app renders, for the signed-in learner. */
export default route('GET', withAuth(async (req, res, user) => {
  await ensurePacks();
  // Lessons on their mistakes come too, so today's plan can pick one at startup.
  const [content, sticking] = await Promise.all([loadContent(user.id), listLessons(db(), user.id)]);
  return ok(res, { content: { ...content, sticking } });
}));
