import { route, ok } from './_lib/http.js';
import { withAuth } from './_lib/auth.js';
import { loadContent } from './_lib/content.js';

/** Everything the app renders, for the signed-in learner. */
export default route('GET', withAuth(async (req, res, user) => {
  const content = await loadContent(user.id);
  return ok(res, { content });
}));
