import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db, ensureSchema } from './db.js';
import { bad } from './http.js';

const COOKIE = 'apprendre_session';
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error('AUTH_SECRET is not set (or is too short). Generate a long random string.');
  }
  return new TextEncoder().encode(s);
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function issueToken(userId) {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export function setSessionCookie(res, token) {
  const parts = [
    `${COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE}`,
  ];
  if (process.env.VERCEL) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

function readCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const chunk of header.split(';')) {
    const eq = chunk.indexOf('=');
    if (eq === -1) continue;
    if (chunk.slice(0, eq).trim() === name) return chunk.slice(eq + 1).trim();
  }
  return null;
}

/** Returns the signed-in user, or null. */
export async function currentUser(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  let uid;
  try {
    ({ payload: { uid } = {} } = await jwtVerify(token, secret()));
  } catch {
    return null;
  }
  if (!uid) return null;
  const sql = db();
  const rows = await sql`
    select id, email, name, is_admin, created_at
    from users where id = ${uid}::uuid limit 1`;
  return rows[0] || null;
}

/**
 * Wrap a handler so it only runs for a signed-in user, passed as the 3rd arg.
 * Also refreshes last_seen_at, cheaply and without blocking the response.
 */
export function withAuth(handler) {
  return async (req, res) => {
    // Every route that touches content comes through here, so this is where a
    // deployment notices its database is behind and catches it up.
    await ensureSchema();
    const user = await currentUser(req);
    if (!user) return bad(res, 'Not signed in', 401);
    return handler(req, res, user);
  };
}

export function normaliseEmail(email) {
  return String(email || '').trim().toLowerCase();
}
