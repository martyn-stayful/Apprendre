import { db } from './_lib/db.js';
import { route, body, ok, bad } from './_lib/http.js';
import { withAuth, normaliseEmail } from './_lib/auth.js';
import { listPartners, link, unlink } from './_lib/partners.js';

const MAX_PARTNERS = 10;

/**
 * Learning partners: who you're linked with, and the invites either way.
 *
 * Linking shares uploaded content in both directions. It does not share
 * progress — mastery, streak and practice time stay personal.
 *
 * GET    — partners, invites received, invites sent
 * POST   — { email } to invite, or { inviteId, action } to accept/decline
 * DELETE — ?id=<user id> to unlink, or ?invite=<id> to withdraw an invite
 */
export default route(['GET', 'POST', 'DELETE'], withAuth(async (req, res, user) => {
  const sql = db();

  if (req.method === 'GET') {
    const [partners, received, sent] = await sql.transaction([
      sql`select u.id, u.name, u.email, p.created_at
            from partnerships p join users u on u.id = p.partner_id
           where p.user_id = ${user.id}::uuid
           order by p.created_at`,
      sql`select i.id, i.created_at, u.name as from_name, u.email as from_email
            from partner_invites i join users u on u.id = i.from_user
           where i.to_email = ${user.email} and i.status = 'pending'
           order by i.created_at desc`,
      sql`select id, to_email, created_at
            from partner_invites
           where from_user = ${user.id}::uuid and status = 'pending'
           order by created_at desc`,
    ]);
    return ok(res, { partners, received, sent });
  }

  if (req.method === 'DELETE') {
    const partnerId = req.query?.id;
    const inviteId = req.query?.invite;

    if (inviteId) {
      const rows = await sql`
        update partner_invites set status = 'cancelled', responded_at = now()
         where id = ${inviteId}::uuid and from_user = ${user.id}::uuid and status = 'pending'
         returning id`;
      if (!rows.length) return bad(res, 'No such invitation', 404);
      return ok(res, { cancelled: rows[0].id });
    }

    if (!partnerId) return bad(res, 'Which partner? Pass ?id=');
    await unlink(sql, user.id, partnerId);
    return ok(res, { unlinked: partnerId });
  }

  // ---- POST ---------------------------------------------------------------
  const { email, inviteId, action } = body(req);

  if (inviteId) return respond(res, sql, user, inviteId, action);

  const addr = normaliseEmail(email);
  if (!addr.includes('@')) return bad(res, 'Enter the email address they signed up with');
  if (addr === user.email) return bad(res, 'That is your own address');

  const [{ count }] = await sql`
    select count(*)::int as count from partnerships where user_id = ${user.id}::uuid`;
  if (count >= MAX_PARTNERS) return bad(res, `You can have at most ${MAX_PARTNERS} partners`);

  const [invitee] = await sql`select id, name from users where email = ${addr} limit 1`;
  if (!invitee) {
    return bad(res, 'Nobody has signed up with that address yet. Ask them to create an account first.', 404);
  }

  const [already] = await sql`
    select 1 from partnerships
     where user_id = ${user.id}::uuid and partner_id = ${invitee.id}::uuid limit 1`;
  if (already) return bad(res, 'You are already learning together', 409);

  // If they have already invited you, accept that rather than crossing invites.
  const [theirs] = await sql`
    select id from partner_invites
     where from_user = ${invitee.id}::uuid and to_email = ${user.email} and status = 'pending'
     limit 1`;
  if (theirs) return respond(res, sql, user, theirs.id, 'accept');

  const [outstanding] = await sql`
    select 1 from partner_invites
     where from_user = ${user.id}::uuid and to_email = ${addr} and status = 'pending'
     limit 1`;
  if (outstanding) {
    return bad(res, 'You have already invited them — they just need to accept', 409);
  }

  const [invite] = await sql`
    insert into partner_invites (from_user, to_email)
    values (${user.id}::uuid, ${addr})
    returning id, to_email, created_at`;

  return ok(res, { invited: invite });
}));

async function respond(res, sql, user, inviteId, action) {
  if (!['accept', 'decline'].includes(action)) {
    return bad(res, 'action must be accept or decline');
  }

  const [invite] = await sql`
    select id, from_user from partner_invites
     where id = ${inviteId}::uuid and to_email = ${user.email} and status = 'pending'
     limit 1`;
  if (!invite) return bad(res, 'No such invitation', 404);

  if (action === 'decline') {
    await sql`
      update partner_invites set status = 'declined', responded_at = now()
       where id = ${invite.id}::uuid`;
    return ok(res, { declined: invite.id });
  }

  await link(sql, user.id, invite.from_user);
  await sql`
    update partner_invites set status = 'accepted', responded_at = now()
     where id = ${invite.id}::uuid`;

  const [partner] = await sql`select id, name, email from users where id = ${invite.from_user}::uuid`;
  return ok(res, { accepted: invite.id, partner });
}
