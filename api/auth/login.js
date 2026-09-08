import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { verifyPassword, issueToken, setSessionCookie, normaliseEmail } from '../_lib/auth.js';

export default route('POST', async (req, res) => {
  const { email, password } = body(req);
  const addr = normaliseEmail(email);

  const sql = db();
  const [user] = await sql`
    select id, email, name, is_admin, password_hash
    from users where email = ${addr} limit 1`;

  // Same message either way, so this can't be used to discover who has an account.
  if (!user || !(await verifyPassword(String(password || ''), user.password_hash))) {
    return bad(res, 'Email or password is not right', 401);
  }

  await sql`update users set last_seen_at = now() where id = ${user.id}::uuid`;
  setSessionCookie(res, await issueToken(user.id));

  return ok(res, {
    user: { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin },
  });
});
