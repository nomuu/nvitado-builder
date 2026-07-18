import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, tooManyRequests, getClientIp } from '../../../lib/ratelimit';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    // Rate limit OTP verification per IP (brute-force protection, in addition
    // to the per-record attempt counter).
    const { allowed, retryAfter } = await rateLimit(`otp_verify:${getClientIp(req)}`, 10, 60);
    if (!allowed) return tooManyRequests(retryAfter);

    const { email, tokenId, otp } = await req.json();

    const MAX_ATTEMPTS = 5;

    // 1. Fetch by email + token (NOT by otp) so we can enforce expiry & attempts.
    const { data: inv, error } = await supabase
      .from('invitations')
      .select('id, slug, token_id, otp_code, otp_expires_at, otp_attempts')
      .eq('email', email)
      .eq('token_id', tokenId)
      .maybeSingle();

    if (error || !inv) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
    }

    // No active OTP — must request a new one.
    if (!inv.otp_code || !inv.otp_expires_at) {
      return NextResponse.json({ error: "No active code. Please request a new one." }, { status: 401 });
    }

    // Expired.
    if (new Date(inv.otp_expires_at).getTime() < Date.now()) {
      await supabase.from('invitations').update({ otp_code: null }).eq('token_id', tokenId);
      return NextResponse.json({ error: "This code has expired. Please request a new one." }, { status: 401 });
    }

    // Too many failed attempts — lock this OTP.
    if ((inv.otp_attempts || 0) >= MAX_ATTEMPTS) {
      await supabase.from('invitations').update({ otp_code: null }).eq('token_id', tokenId);
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    // Wrong code — count the attempt.
    if (String(inv.otp_code) !== String(otp)) {
      await supabase
        .from('invitations')
        .update({ otp_attempts: (inv.otp_attempts || 0) + 1 })
        .eq('token_id', tokenId);
      return NextResponse.json({ error: "Invalid verification code." }, { status: 401 });
    }

    // 2. SUCCESS: clear the OTP + attempt state.
    await supabase
      .from('invitations')
      .update({ otp_code: null, otp_attempts: 0, otp_expires_at: null })
      .eq('token_id', tokenId);

    // 3. 🛡️ SET SECURITY COOKIE
    const response = NextResponse.json({ 
      success: true, 
      slug: inv.slug,
      message: "Verified successfully" 
    });

    response.cookies.set(`verified_${tokenId}`, 'true', {
      httpOnly: true, // 🔒 Crucial: Hindi ito mababasa/mananakaw ng JS scripts
      secure: process.env.NODE_ENV === 'production', // 🔒 HTTPS only sa production
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 🕒 Valid for 2 hours (sapat na para mag-edit)
      path: '/',
    });

    return response;

  } catch (err: unknown) {
    console.error('VERIFY-OTP ERROR:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Could not verify code. Please try again.' }, { status: 500 });
  }
}