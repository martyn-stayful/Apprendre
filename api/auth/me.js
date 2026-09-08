import { route, ok } from '../_lib/http.js';
import { currentUser } from '../_lib/auth.js';

export default route('GET', async (req, res) => {
  const user = await currentUser(req);
  return ok(res, {
    user,
    // The sign-up form needs to know whether to ask for an invite code.
    signupCodeRequired: Boolean(process.env.SIGNUP_CODE),
  });
});
