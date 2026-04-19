import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { email, tokenId, otp } = await req.json();

    // 1. I-check kung match ang OTP, Email, at Token sa DB
    const { data: inv, error } = await supabase
      .from('invitations')
      .select('id, slug')
      .eq('email', email)
      .eq('token_id', tokenId)
      .eq('otp_code', otp) // Dapat sakto yung code
      .single();

    if (error || !inv) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
    }

    // 2. SUCCESS: Burahin ang OTP code sa DB (para hindi na magamit ulit)
    await supabase
      .from('invitations')
      .update({ otp_code: null } as any)
      .eq('token_id', tokenId);

    // 3. Return success - pwede ring mag-return ng temporary session token dito kung gusto mo
    return NextResponse.json({ success: true, slug: inv.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}