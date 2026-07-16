import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

// Escape user-derived values before embedding them in email HTML.
const escapeHtml = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    // 🔒 SECURITY: verify the Lemon Squeezy webhook signature before trusting
    // anything in the payload. Without this, anyone could POST a forged
    // "order_created" event to mark invitations as paid for free.
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('WEBHOOK: LEMONSQUEEZY_WEBHOOK_SECRET is not configured — rejecting.');
      return NextResponse.json({ error: 'Webhook not configured.' }, { status: 500 });
    }

    const signature = req.headers.get('x-signature') || '';
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    let signatureValid = false;
    try {
      const sigBuf = Buffer.from(signature, 'hex');
      const expBuf = Buffer.from(expected, 'hex');
      signatureValid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    } catch {
      signatureValid = false;
    }
    if (!signatureValid) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
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
            })
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
        console.log(`WEBHOOK: Processing activation for invitation ${invId}`);

        // Idempotency: if this invitation is already paid, skip re-activation
        // and the duplicate email (Lemon Squeezy may retry deliveries).
        const { data: existingInv } = await supabase
          .from('invitations')
          .select('status')
          .eq('id', invId)
          .maybeSingle();

        if (existingInv?.status === 'paid') {
          console.log('WEBHOOK: Invitation already paid — skipping duplicate processing.');
          return NextResponse.json({ received: true }, { status: 200 });
        }

        // 1. SAFE UPDATE PROCESO: I-set ang status into paid
        const { error: updateError } = await supabase
          .from('invitations')
          .update({ 
            status: 'paid', 
            email: email,
            customer_name: name 
          }) 
          .eq('id', invId);

        if (updateError) {
          console.error("WEBHOOK DB UPDATE ERROR:", updateError.message);
          return NextResponse.json({ error: 'Processing failed.' }, { status: 500 });
        }
        
        console.log("DATABASE UPDATE SUCCESSFUL");

        // 🎯 2. LIFETIME COUNTER INCREMENT: Matapos maging 'paid', dito natin papaganahin ang RPC function para mag Plus 1 ang permanent counter natin
        const { error: counterError } = await supabase.rpc('increment_lifetime_counter');
        if (counterError) {
          console.error("WEBHOOK STATS COUNTER ERROR:", counterError.message);
          // Hindi natin i-bebreak ang code gamit ang return response para tuloy-tuloy pa rin ang email delivery kahit may temporary database function glitch
        } else {
          console.log("LIFETIME COUNTER INCREMENTED SUCCESSFULLY (+1)");
        }

        // 3. DATA EXTRACTION: Kunin ang short_id at slug nang ligtas
        const { data: targetInv, error: fetchError } = await supabase
          .from('invitations')
          .select('short_id, slug, config_data, token_id')
          .eq('id', invId)
          .maybeSingle();

        if (!fetchError && targetInv) {
          // 🆕 RSVP BULK INSERT: Insert pre-loaded guests into rsvp_guests table
          if (targetInv.config_data?.showRSVP && targetInv.config_data?.rsvpGuests?.length > 0) {
            const rsvpRows = targetInv.config_data.rsvpGuests.map((guest: { name: string; status?: string | null }) => ({
              invitation_id: invId,
              name: guest.name,
              status: guest.status || null,
            }));

            const { error: rsvpError } = await supabase
              .from('rsvp_guests')
              .upsert(rsvpRows, { onConflict: 'invitation_id,name' });

            if (rsvpError) {
              console.error("WEBHOOK RSVP INSERT ERROR:", rsvpError.message);
            } else {
              console.log(`RSVP GUESTS INSERTED: ${rsvpRows.length} guest(s) synced`);
            }
          }

          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nvitado.com';
            const invitationLink = `${appUrl}/${targetInv.short_id}/${targetInv.slug}`;
            
            // 🔒 Success/receipt page keyed by the unguessable token, not the public slug.
            const successPageLink = `${appUrl}/success?token=${encodeURIComponent(targetInv.token_id)}`;

            // 🆕 RSVP MANAGER LINK — ipapakita lang sa email kung naka-enable ang RSVP.
            const rsvpManagerLink = `${appUrl}/rsvp/${targetInv.short_id}/${targetInv.slug}`;
            const rsvpButtonHtml = targetInv.config_data?.showRSVP
              ? `
                  <div style="margin-bottom: 24px;">
                    <a href="${rsvpManagerLink}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; background-color: #ffffff; color: #0f172a; padding: 16px 0; border-radius: 16px; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid #0f172a;">
                      👥 View RSVP
                    </a>
                  </div>`
              : '';

            const eventTitle = escapeHtml(targetInv.config_data?.title || "Your Event");
            const safeName = escapeHtml(name);

            console.log(`WEBHOOK EMAIL: Sending activation email for invitation ${invId}`);

            await resend.emails.send({
              from: 'Nvitado <inquiry@nvitado.com>',
              to: email,
              subject: `🎉 Live na ang iyong imbitasyon: ${eventTitle}!`,
              html: `
                <div style="font-family: sans-serif; max-width: 460px; margin: 0 auto; padding: 24px; text-align: center; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
                  <div style="margin-bottom: 24px;">
                    <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: -0.5px;">NVITADO</h1>
                    <p style="font-size: 9px; font-weight: 800; color: #f59e0b; text-transform: uppercase; tracking: 2px; margin-top: 4px; margin-bottom: 0;">Digital Invitation Builder</p>
                  </div>
                  
                  <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 10px; margin-top: 0;">Hi ${safeName}!</h2>
                  <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 28px; margin-top: 0;">
                    Success ang iyong pagbabayad! Live at handa nang i-share ang digital invitation para sa <strong>${eventTitle}</strong>. Maaari mong i-access ang iyong link at opisyal na resibo sa ibaba.
                  </p>

                  <div style="margin-bottom: 12px;">
                    <a href="${invitationLink}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; background-color: #f59e0b; color: #0f172a; padding: 16px 0; border-radius: 16px; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                      🚀 Buksan ang Invitation Page
                    </a>
                  </div>

                  <div style="margin-bottom: 24px;">
                    <a href="${successPageLink}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; background-color: #0f172a; color: #ffffff; padding: 16px 0; border-radius: 16px; font-weight: 900; font-size: 13px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                      📄 View Full Receipt & QR Code
                    </a>
                  </div>

                  ${rsvpButtonHtml}

                  <p style="font-size: 11px; color: #94a3b8; line-height: 1.6; text-align: left; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 0; margin-bottom: 0;">
                    <strong>Invitation Link:</strong> <a href="${invitationLink}" style="color: #f59e0b; text-decoration: none;">${invitationLink}</a><br/>
                    <em>Paalala: Gamitin ang iyong Edit Token mula sa success page kung nais mong baguhin ang mga detalye sa hinaharap.</em>
                  </p>

                  <div style="font-size: 9px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                    Nvitado © 2026 — All Rights Reserved
                  </div>
                </div>
              `
            });
            console.log("WEBHOOK EMAIL: Mail sent successfully via Resend!");
          } catch (mailErr: unknown) {
            console.error("WEBHOOK MAIL ERROR:", mailErr instanceof Error ? mailErr.message : mailErr);
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("WEBHOOK CATCH ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Webhook processing error.' }, { status: 400 });
  }
}