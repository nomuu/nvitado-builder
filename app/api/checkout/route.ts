import { NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { config, amount, bgName } = await req.json();

    // 1. I-set natin ang Base Fee
    const baseAmount = 50 * 100; // ₱50.00 in centavos
    
    // 2. I-calculate ang Premium Effect fee (Total Amount - 50)
    // Kung ang amount ay 55, ang effectFee ay 5.
    const totalAmountCentavos = amount * 100;
    const effectFee = totalAmountCentavos - baseAmount;

    // 3. BUUIN ANG LINE ITEMS ARRAY (BREAKDOWN)
    const lineItems = [
      {
        currency: 'PHP',
        amount: baseAmount,
        name: 'Nvitado Digital Invitation (Base Fee)',
        quantity: 1,
      }
    ];

    // 4. KUNG MAY PREMIUM EFFECT, I-DAGDAG BILANG HIWALAY NA LINE ITEM
    if (effectFee > 0) {
      lineItems.push({
        currency: 'PHP',
        amount: effectFee,
        name: `${bgName || 'Premium Effect'}`, // Lalabas dito e.g. "Floating Hearts Effect"
        quantity: 1,
      });
    }

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
            show_line_items: true, // SIGURADUHING TRUE ITO PARA LUMABAS ANG BREAKDOWN
            line_items: lineItems, // Dito na papasok yung array na binuo natin sa taas
            payment_method_types: ['card', 'paymaya', 'gcash', 'grab_pay'], 
            description: `Event: ${config.title} | URL: nvitado.com/${config.slug}`,
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?slug=${config.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/`
          }
        }
      }
    };

    const response = await axios.request(options);
    const checkoutUrl = response.data.data.attributes.checkout_url;
    
    // Save to Supabase (No changes here)
    await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      checkout_id: response.data.data.id
    }, { onConflict: 'slug' });

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
    console.error("PAYMONGO ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}