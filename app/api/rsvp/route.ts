import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Maximum number of CONFIRMED (going) guests allowed per invitation.
const MAX_GOING = 100;

// Anti-spam: max number of UNCONFIRMED (pending) self-registrations that can be
// queued at once. While this many guests are still awaiting the owner's
// confirmation, new self-registrations are held until the owner accommodates them.
const MAX_PENDING = 10;

// Normalize a name for duplicate detection: lowercase + strip ALL whitespace,
// so "Ronald Mendoza", "RONALD MENDOZA" and "RONALDMENDOZA" all collide.
const normalizeName = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export async function POST(req: Request) {
  try {
    const { invitation_id, name, status, action, fb_link, email, contact } = await req.json();

    if (!invitation_id || !name) {
      return NextResponse.json({ error: 'invitation_id and name are required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const normName = normalizeName(trimmedName);

    // Load all guests for this invitation once so we can match on a normalized
    // name (case + whitespace insensitive) and count confirmed guests.
    const { data: allGuests, error: loadError } = await supabase
      .from('rsvp_guests')
      .select('id, name, status')
      .eq('invitation_id', invitation_id);

    if (loadError) return NextResponse.json({ error: loadError.message }, { status: 500 });

    const guests = allGuests || [];
    const existing = guests.find((g) => normalizeName(g.name) === normName);
    const goingCount = guests.filter((g) => g.status === 'going').length;
    // Pending = self-registered guests awaiting the owner's confirmation (no status yet).
    const pendingCount = guests.filter((g) => !g.status).length;

    // --- DELETE ACTION ---
    if (action === 'delete') {
      if (existing) {
        const { error } = await supabase.from('rsvp_guests').delete().eq('id', existing.id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, action: 'deleted' });
    }

    // Normalize contact fields
    const trimmedFbLink = typeof fb_link === 'string' ? fb_link.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedContact = typeof contact === 'string' ? contact.trim() : '';

    const wantsGoing = status === 'going';

    if (existing) {
      // Guard: don't allow confirming a NEW going guest past the cap.
      if (wantsGoing && existing.status !== 'going' && goingCount >= MAX_GOING) {
        return NextResponse.json(
          { error: `The guest list is full — ${MAX_GOING} guests are already confirmed going.` },
          { status: 409 }
        );
      }

      const updatePayload: Record<string, unknown> = {};

      // Self-registration ('register') must never downgrade an owner-confirmed
      // guest; it only refreshes contact details. Owner actions set status.
      if (action !== 'register') {
        updatePayload.status = status || null;
      }
      if (trimmedFbLink) updatePayload.fb_link = trimmedFbLink;
      if (trimmedEmail) updatePayload.email = trimmedEmail;
      if (trimmedContact) updatePayload.contact = trimmedContact;

      // Nothing to change (e.g. re-register with no new contact) — return as-is.
      if (Object.keys(updatePayload).length === 0) {
        return NextResponse.json({ success: true, action: 'unchanged', guest: existing });
      }

      const { data, error } = await supabase
        .from('rsvp_guests')
        .update(updatePayload)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, action: 'updated', guest: data });
    }

    // --- NEW GUEST ---
    if (action === 'owner_add') {
      // Owner adding a confirmed guest: respect the going cap.
      if (wantsGoing && goingCount >= MAX_GOING) {
        return NextResponse.json(
          { error: `The guest list is full — ${MAX_GOING} guests are already confirmed going.` },
          { status: 409 }
        );
      }
    } else {
      // Guest self-registration: once the list is full, no new RSVPs are accepted.
      if (goingCount >= MAX_GOING) {
        return NextResponse.json(
          { error: `Sorry, the guest list is full. ${MAX_GOING} guests have already been confirmed, so no more RSVPs can be accepted.` },
          { status: 409 }
        );
      }
      // Anti-spam: hold new self-registrations while a full queue of pending
      // guests is still awaiting the owner's confirmation.
      if (pendingCount >= MAX_PENDING) {
        return NextResponse.json(
          { error: `Due to a high volume of guests, we're currently accommodating ${MAX_PENDING} pending RSVPs. Please wait for the event owner to confirm the current guests, then try registering again shortly.` },
          { status: 429 }
        );
      }
      // Require at least one contact method so the owner can verify them.
      if (!trimmedFbLink && !trimmedEmail && !trimmedContact) {
        return NextResponse.json(
          { error: 'Please provide at least one contact: Facebook link, email, or contact number.' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('rsvp_guests')
      .insert({
        invitation_id,
        name: trimmedName,
        status: status || null,
        fb_link: trimmedFbLink || null,
        email: trimmedEmail || null,
        contact: trimmedContact || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, action: 'created', guest: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
