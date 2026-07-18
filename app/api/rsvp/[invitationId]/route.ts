import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId } = await params;

    if (!invitationId) {
      return NextResponse.json({ error: 'invitationId is required' }, { status: 400 });
    }

    // 🔒 Owner-only: the guest list contains PII (email, phone, FB link).
    // Require the verified owner session cookie for this invitation.
    const { data: invRow } = await supabase
      .from('invitations')
      .select('token_id')
      .eq('id', invitationId)
      .maybeSingle();
    const cookieStore = await cookies();
    const verified = !!invRow?.token_id && cookieStore.get(`verified_${invRow.token_id}`)?.value === 'true';
    if (!verified) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('rsvp_guests')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: 'Could not load guests.' }, { status: 500 });

    return NextResponse.json({ guests: data || [] });
  } catch (error: unknown) {
    console.error('RSVP GET ERROR:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Could not load guests.' }, { status: 500 });
  }
}
