import { route, ok } from '../_lib/http.js';
import { clearSessionCookie } from '../_lib/auth.js';

export default route('POST', async (req, res) => {
  clearSessionCookie(res);
  return ok(res, { signedOut: true });
});
