import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventName = body.meta?.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const name = body.data.attributes.user_name;
      const customData = body.meta.custom_data;
      
      // 📍 REVISION LOGIC: Extra Credit Purchase
      const tokenId = customData?.token_id;

      if (tokenId) {
        console.log(`WEBHOOK: Processing extra credit for token: ${tokenId}`);

        const { data: currentInv, error: fetchError } = await supabase
          .from('invitations')
          .select('revision_count, purchasable_revision_count')
          .eq('token_id', tokenId)
          .maybeSingle();

        if (!fetchError && currentInv) {
          const { error: revisionUpdateError } = await supabase
            .from('invitations')
            .update({
              revision_count: (currentInv.revision_count || 0) + 3,
              purchasable_revision_count: Math.max(0, (currentInv.purchasable_revision_count || 3) - 3)
            } as any)
            .eq('token_id', tokenId);

          if (revisionUpdateError) {
            console.error("WEBHOOK REVISION ERROR:", revisionUpdateError.message);
          } else {
            console.log("REVISION CREDIT ADDED SUCCESSFULLY");
            return NextResponse.json({ received: true }, { status: 200 });
          }
        }
      }

      // 📍 ORIGINAL LOGIC: New Invitations Activation
      const invId = customData?.invitation_id;
      if (invId) {
        console.log(`WEBHOOK DATA: Email: ${email}, Name: ${name}, ID: ${invId}`);

        // 1. SAFE UPDATE PROCESO: I-set ang status into paid nang walang mapanirang selector chain
        const { error: updateError } = await supabase
          .from('invitations')
          .update({ 
            status: 'paid', 
            email: email,
            customer_name: name 
          } as any) 
          .eq('id', invId);

        if (updateError) {
          console.error("WEBHOOK DB UPDATE ERROR:", updateError.message);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
        
        console.log("DATABASE UPDATE SUCCESSFUL");

        // 2. DATA EXTRACTION: Humugot ng hiwalay na select query para makuha ang link records nang ligtas
        const { data: targetInv, error: fetchError } = await supabase
          .from('invitations')
          .select('short_id, slug, config_data')
          .eq('id', invId)
          .maybeSingle();

        if (!fetchError && targetInv) {
          // 🚀 AUTOMATED CUSTOM EMAIL SENDER (WALANG VIEW ORDER NG LEMON SQUEEZY)
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nvitado.com';
            const invitationLink = `${appUrl}/${targetInv.short_id}/${targetInv.slug}`;
            const eventTitle = targetInv.config_data?.title || "Your Event";

            console.log(`WEBHOOK EMAIL: Sending custom email receipt to ${email}`);

            await resend.emails.send({
              from: 'Nvitado <invitations@nvitado.com>', // Siguraduhing gamit muna ang 'onboarding@resend.dev' kung hindi pa verified ang custom domain mo
              to: email,
              subject: `🎉 Live na ang iyong imbitasyon: ${eventTitle}!`,
              html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; text-align: center; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
                  <div style="margin-bottom: 20px;">
                    <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase;">NVITADO</h1>
                    <p style="font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase; tracking: 2px; margin-top: 4px;">Digital Invitation Builder</p>
                  </div>
                  
                  <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 10px;">Hi ${name}!</h2>
                  <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
                    Success ang iyong pagbabayad! Live at handa nang i-share ang digital invitation para sa <strong>${eventTitle}</strong>.
                  </p>

                  <a href="${invitationLink}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; background-color: #f59e0b; color: #0f172a; padding: 16px 0; border-radius: 16px; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                    🚀 Buksan ang Invitation Page
                  </a>

                  <p style="font-size: 11px; color: #94a3b8; line-height: 1.6; margin-top: 24px; text-align: left; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                    <strong>Link mo:</strong> <a href="${invitationLink}" style="color: #f59e0b; text-decoration: none;">${invitationLink}</a><br/>
                    <em>Paalala: Maaari mo pa ring i-edit ang imbitasyon gamit ang iyong builder dashboard.</em>
                  </p>

                  <div style="font-size: 9px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; margin-top: 4px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                    Nvitado © 2026 — All Rights Reserved
                  </div>
                </div>
              `
            });
            console.log("WEBHOOK EMAIL: Mail sent successfully via Resend!");
          } catch (mailErr: any) {
            console.error("WEBHOOK MAIL ERROR:", mailErr.message);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("WEBHOOK CATCH ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}