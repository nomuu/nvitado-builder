import { NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { config } = await req.json();

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
            line_items: [
              {
                currency: 'PHP',
                amount: 5000, 
                name: 'Nvitado Digital Invitation',
                quantity: 1
              }
            ],
            // Gamitin natin ang standard list. 
            // PayMongo will only show what is ACTIVE in your dashboard.
            payment_method_types: ['card', 'paymaya', 'gcash', 'grab_pay'], 
            description: `Invitation URL: nvitado.com/${config.slug}`,
            success_url: `${process.env.NEXT_PUBLIC_URL}/success?slug=${config.slug}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/`
          }
        }
      }
    };

    const response = await axios.request(options);
    const checkoutUrl = response.data.data.attributes.checkout_url;
    
    // Save to Supabase
    await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      checkout_id: response.data.data.id
    }, { onConflict: 'slug' });

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    // Mas detalyadong error logging para makita natin kung bakit ayaw
    const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
    console.error("PAYMONGO ERROR:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}