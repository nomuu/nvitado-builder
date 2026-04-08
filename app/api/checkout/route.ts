import { NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 📍 SIGURADONG NANDITO 'TONG GENERATOR
const generateTokenId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `nvi-${result}`;
};

export async function POST(req: Request) {
  try {
    const { config, amount, bgName } = await req.json();
    
    // 📍 GENERATE TOKEN FIRST
    const tokenId = generateTokenId();

    const totalAmountCentavos = Math.round(amount * 100);
    const baseAmountCentavos = 50 * 100;
    
    const hasEffect = bgName && bgName !== 'Standard';
    const bgPriceCentavos = hasEffect ? (amount % 50 === 5 || amount % 50 === 55 ? 500 : 2500) : 0;

    const lineItems = [
      {
        currency: 'PHP',
        amount: baseAmountCentavos,
        name: 'Nvitado Base Hosting (Event Month)',
        quantity: 1,
      }
    ];

    if (bgPriceCentavos > 0) {
      lineItems.push({
        currency: 'PHP',
        amount: bgPriceCentavos,
        name: `Effect: ${bgName}`,
        quantity: 1,
      });
    }

    const currentLineItemsTotal = lineItems.reduce((acc, item) => acc + item.amount, 0);
    const extensionFeeCentavos = totalAmountCentavos - currentLineItemsTotal;

    if (extensionFeeCentavos > 0) {
      lineItems.push({
        currency: 'PHP',
        amount: extensionFeeCentavos,
        name: 'Advance Booking / Monthly Extension',
        quantity: 1,
      });
    }

    // --- STEP A: SAVE TO SUPABASE WITH TOKEN ---
    // 📍 SINIGURADO KONG KASAMA ANG token_id DITO
    const { error: dbError } = await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
      token_id: tokenId 
    }, { onConflict: 'slug' });

    if (dbError) {
      console.error("SUPABASE ERROR:", dbError.message);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

    // --- STEP B: PAYMONGO CHECKOUT ---
    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/checkout_sessions',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      data: {
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: lineItems,
            payment_method_types: ['card', 'paymaya', 'gcash', 'grab_pay'], 
            description: `Invitation: ${config.title} | Token: ${tokenId}`,
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?slug=${config.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/create`
          }
        }
      }
    };

    const response = await axios.request(options);
    const checkoutUrl = response.data.data.attributes.checkout_url;
    const checkoutId = response.data.data.id;

    // --- STEP C: UPDATE RECORD WITH CHECKOUT ID ---
    await supabase.from('invitations').update({ 
      checkout_id: checkoutId 
    }).eq('slug', config.slug);

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}