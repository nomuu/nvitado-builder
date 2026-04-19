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
      .eq('otp_code', otp) 
      .single();

    if (error || !inv) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
    }

    // 2. SUCCESS: Burahin ang OTP code sa DB
    await supabase
      .from('invitations')
      .update({ otp_code: null } as any)
      .eq('token_id', tokenId);

    // 3. 🛡️ SET SECURITY COOKIE
    // Gagawa tayo ng response object muna para malagyan ng cookie
    const response = NextResponse.json({ 
      success: true, 
      slug: inv.slug,
      message: "Verified successfully" 
    });

    // Isasalpak ang cookie na tinitingnan ng revise/page.tsx natin
    response.cookies.set(`verified_${tokenId}`, 'true', {
      httpOnly: true, // 🔒 Crucial: Hindi ito mababasa/mananakaw ng JS scripts
      secure: process.env.NODE_ENV === 'production', // 🔒 HTTPS only sa production
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 🕒 Valid for 2 hours (sapat na para mag-edit)
      path: '/',
    });

    return response;

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}