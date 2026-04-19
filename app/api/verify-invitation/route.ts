import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, tokenId } = await req.json();

    // 1. Hugutin ang data (kasama ang revision_count)
    const { data: inv, error: fetchError } = await supabase
      .from('invitations')
      .select('id, customer_name, token_id, config_data, revision_count') 
      .eq('email', email)
      .eq('token_id', tokenId)
      .single();

    if (fetchError || !inv) {
      return NextResponse.json({ error: "Invalid credentials. Double check your Email and Token ID." }, { status: 404 });
    }

    // Kunin ang details mula sa config_data
    const invitationTitle = inv.config_data?.title || "Your Invitation";
    const creditsLeft = inv.revision_count ?? 0;

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. I-save ang OTP sa DB
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ otp_code: otp } as any)
      .eq('token_id', tokenId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to generate security code." }, { status: 500 });
    }

    // 4. I-send ang Email
    await resend.emails.send({
      from: 'Nvitado Verification <no-reply@nvitado.com>',
      to: email,
      subject: `Verification code for ${invitationTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #0f172a; padding: 25px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 4px; font-weight: bold;">NVITADO</h1>
          </div>
          
          <div style="padding: 40px 30px; line-height: 1.6; color: #334155;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Revision Access Request</h2>
            <p>Hi <strong>${inv.customer_name || 'Valued Customer'}</strong>,</p>
            <p>A request was made to access the revision editor. Use the code below to verify your access for:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #e11d48;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b; font-weight: bold; text-transform: uppercase;">Invitation Details</p>
              <p style="margin: 0; font-size: 18px; color: #0f172a; font-weight: bold;">${invitationTitle}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Ref ID: ${inv.token_id}</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #0f172a;"><strong>Remaining Revision Credits:</strong> ${creditsLeft}</p>
            </div>

            <div style="background: #f1f5f9; padding: 25px; text-align: center; font-size: 42px; font-weight: 900; letter-spacing: 15px; border-radius: 12px; color: #0f172a; margin: 30px 0; border: 1px solid #e2e8f0;">
              ${otp}
            </div>

            <p style="font-size: 13px; color: #64748b; text-align: center;">This code is valid for 10 minutes. <strong>Do not share this code with anyone.</strong></p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                <strong>Security Alert:</strong> If you did not request this access, you can safely ignore this email. However, if you feel your account is being accessed maliciously, please report it immediately to 
                <a href="mailto:inquiry@nvitado.com" style="color: #e11d48; text-decoration: none; font-weight: bold;">inquiry@nvitado.com</a>.
              </p>
              <p style="font-size: 11px; color: #cbd5e1; text-align: center; margin-top: 25px;">&copy; 2026 Nvitado Digital Invitations. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}