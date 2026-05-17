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

        // 1. SAFE UPDATE PROCESO: Status setting
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

        // 2. DATA EXTRACTION: Kunin ang link at config_data details para sa invoice math
        const { data: targetInv, error: fetchError } = await supabase
          .from('invitations')
          .select('short_id, slug, config_data, total_paid, token_id, checkout_id, created_at')
          .eq('id', invId)
          .maybeSingle();

        if (!fetchError && targetInv) {
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nvitado.com';
            const invitationLink = `${appUrl}/${targetInv.short_id}/${targetInv.slug}`;
            
            const config = targetInv.config_data || {};
            const eventTitle = config.title || "Your Invitation";
            const amount = targetInv.total_paid || 0;
            const dateObj = new Date(targetInv.created_at);

            // 🕒 MATH MATCHING LOGIC GALING SA SUCCESS PAGE RECIEPT MO
            const effectPrice = (amount % 50 === 5 || amount % 50 === 55 || amount % 50 === 25 || amount % 50 === 30) ? (amount % 50 === 25 || amount % 50 === 30 ? 25 : 5) : 0;
            const storyPrice = config.showStory ? 5 : 0;
            const extraQACount = Math.max(0, (config.questions?.length || 0) - 3);
            const qaPrice = extraQACount * 2;
            const extensionPrice = Math.max(0, amount - 50 - effectPrice - storyPrice - qaPrice);

            console.log(`WEBHOOK EMAIL: Sending custom theme receipt to ${email}`);

            // 🚀 AUTOMATED PREMIUM HTML LAYOUT GENERATOR MATCHED SA SUCCESS PAGE DESIGN MO
            await resend.emails.send({
              from: 'Nvitado <invitations@nvitado.com>',
              to: email,
              subject: `🎉 Live na ang iyong imbitasyon: ${eventTitle}!`,
              html: `
                <div style="font-family: 'Poppins', sans-serif, system-ui; max-width: 440px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #f1f5f9; border-top: 10px solid #ef4444; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.03); text-align: left;">
                  
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                    <div style="text-align: left;">
                      <h2 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px;">NVITADO</h2>
                      <p style="font-size: 8px; font-weight: 900; color: #ef4444; tracking: 3px; text-transform: uppercase; margin: 2px 0 0 0; font-style: italic;">Official Payment Receipt</p>
                    </div>
                  </div>

                  <div style="background-color: #0f172a; border-radius: 20px; padding: 16px; margin-bottom: 24px; text-align: center; color: #ffffff; position: relative;">
                    <p style="font-size: 8px; font-weight: 900; color: #f43f5e; tracking: 2px; text-transform: uppercase; margin: 0 0 6px 0; font-style: italic;">SAVE YOUR EDIT TOKEN</p>
                    <h3 style="font-size: 22px; font-weight: 900; font-family: monospace; color: #ffffff; margin: 0; letter-spacing: 2px;"># ${targetInv.token_id}</h3>
                    <p style="font-size: 8px; font-weight: bold; color: #94a3b8; tracking: 1px; text-transform: uppercase; margin: 6px 0 0 0; font-style: italic;">Use this code to edit your invitation in the future.</p>
                  </div>

                  <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 20px; padding: 16px; margin-bottom: 24px; font-size: 11px; color: #0f172a; font-weight: bold;">
                    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                      <p style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin: 0 0 4px 0; tracking: 1px;">Payer Name</p>
                      <span style="font-size: 12px; font-weight: 900; text-transform: uppercase; font-style: italic; color: #0f172a;">👤 ${name}</span>
                    </div>
                    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                      <p style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin: 0 0 4px 0; tracking: 1px;">Contact Email</p>
                      <span style="font-size: 12px; font-weight: 900; text-transform: uppercase; font-style: italic; color: #0f172a;">✉️ ${email}</span>
                    </div>
                    <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 10px;">
                      <p style="font-size: 8px; font-weight: 900; color: #ef4444; text-transform: uppercase; margin: 0 0 4px 0; tracking: 1px; font-style: italic;">Date Paid</p>
                      <span style="font-size: 11px; font-weight: bold; color: #334155;">
                        ${dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div>
                      <p style="font-size: 8px; font-weight: 900; color: #ef4444; text-transform: uppercase; margin: 0 0 4px 0; tracking: 1px; font-style: italic;">Transaction ID</p>
                      <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #334155;">${targetInv.checkout_id || 'PROCESSED'}</span>
                    </div>
                  </div>

                  <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 20px; padding: 16px; margin-bottom: 24px; font-size: 11px; color: #64748b; font-weight: bold;">
                    <p style="font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin: 0 0 12px 0; tracking: 1px; font-style: italic;">📋 Order Breakdown</p>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; text-transform: uppercase;">
                      <span>Base Fee</span><span style="color: #0f172a; font-weight: 900;">₱50.00</span>
                    </div>
                    ${effectPrice > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; text-transform: uppercase;">
                      <span>✨ Theme Effect</span><span style="color: #0f172a; font-weight: 900;">₱${effectPrice.toFixed(2)}</span>
                    </div>` : ''}
                    ${storyPrice > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; text-transform: uppercase;">
                      <span>📖 Custom Section</span><span style="color: #0f172a; font-weight: 900;">₱${storyPrice.toFixed(2)}</span>
                    </div>` : ''}
                    ${qaPrice > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; text-transform: uppercase;">
                      <span>❓ Extra Q&A (${extraQACount})</span><span style="color: #0f172a; font-weight: 900;">₱${qaPrice.toFixed(2)}</span>
                    </div>` : ''}
                    ${extensionPrice > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; text-transform: uppercase;">
                      <span>Add-ons / Extension</span><span style="color: #0f172a; font-weight: 900;">₱${extensionPrice.toFixed(2)}</span>
                    </div>` : ''}

                    <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 13px; font-weight: 900; text-transform: uppercase; font-style: italic; color: #0f172a;">
                      <span>Total Paid</span>
                      <span style="color: #dc2626; font-size: 18px; font-weight: 900; text-decoration: underline; font-family: monospace;">₱${amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style="margin-bottom: 16px;">
                    <a href="${invitationLink}" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #0f172a; color: #ffffff; padding: 18px 0; border-radius: 16px; font-weight: 900; font-size: 11px; text-align: center; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);">
                      Open Invitation Site
                    </a>
                  </div>

                  <div style="font-size: 8px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; text-align: center; margin-top: 20px;">
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