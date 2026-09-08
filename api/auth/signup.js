import { db } from '../_lib/db.js';
import { route, body, ok, bad } from '../_lib/http.js';
import { hashPassword, issueToken, setSessionCookie, normaliseEmail } from '../_lib/auth.js';

export default route('POST', async (req, res) => {
  const { email, password, name, code } = body(req);

  const expected = process.env.SIGNUP_CODE;
  if (expected && String(code || '').trim() !== expected) {
    return bad(res, 'That invite code is not right', 403);
  }

  const addr = normaliseEmail(email);
  if (!addr.includes('@') || addr.length < 5) return bad(res, 'Enter a valid email address');
  if (String(password || '').length < 8) return bad(res, 'Password must be at least 8 characters');

  const sql = db();
  const existing = await sql`select 1 from users where email = ${addr} limit 1`;
  if (existing.length) return bad(res, 'There is already an account with that email', 409);

  const hash = await hashPassword(password);
  const displayName = String(name || '').trim() || addr.split('@')[0];

  // The first account to sign up is the admin.
  const [{ count }] = await sql`select count(*)::int as count from users`;

  const [user] = await sql`
    insert into users (email, name, password_hash, is_admin)
    values (${addr}, ${displayName}, ${hash}, ${count === 0})
    returning id, email, name, is_admin`;

  setSessionCookie(res, await issueToken(user.id));
  return ok(res, { user });
});
