import { db } from './db.js';

/**
 * Everyone whose uploaded content this learner can see: themselves, plus any
 * linked partners. Always includes the learner, so callers can use it directly.
 */
export async function visibleOwnerIds(userId) {
  const sql = db();
  const rows = await sql`
    select partner_id from partnerships where user_id = ${userId}::uuid`;
  return [userId, ...rows.map((r) => r.partner_id)];
}

/** Linked partners, with names, for display. */
export async function listPartners(userId) {
  const sql = db();
  return sql`
    select u.id, u.name, u.email, p.created_at
      from partnerships p join users u on u.id = p.partner_id
     where p.user_id = ${userId}::uuid
     order by p.created_at`;
}

/** Link two learners. Stored both ways round; safe to call twice. */
export async function link(sql, a, b) {
  await sql`
    insert into partnerships (user_id, partner_id) values (${a}::uuid, ${b}::uuid)
      on conflict do nothing`;
  await sql`
    insert into partnerships (user_id, partner_id) values (${b}::uuid, ${a}::uuid)
      on conflict do nothing`;
}

/** Unlink both directions. */
export async function unlink(sql, a, b) {
  await sql`
    delete from partnerships
     where (user_id = ${a}::uuid and partner_id = ${b}::uuid)
        or (user_id = ${b}::uuid and partner_id = ${a}::uuid)`;
}
