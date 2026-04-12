import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { config, amount } = await req.json();

    // 1. SAVE/UPSERT SA SUPABASE (Retain existing logic)
    const { error: dbError } = await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
    }, { onConflict: 'slug' });

    if (dbError) {
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

    // 2. LEMON SQUEEZY CHECKOUT CREATION
    // Gagamit tayo ng Custom Price para mag-match sa computation mo
    const response = await axios.post(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                invitation_slug: config.slug,
              },
              // Override price: Lemon Squeezy uses Centavos/Sub-units (PHP 50.00 = 5000)
              variant_quantities: [
                {
                  variant_id: parseInt(process.env.LEMONSQUEEZY_VARIANT_ID!),
                  quantity: 1,
                },
              ],
            },
            // Ito ang magic part: binabago natin ang presyo ng variant on-the-fly
            custom_price: Math.round(amount * 100), 
            product_options: {
              name: `Invitation: ${config.title}`,
              description: `Digital Invitation License for ${config.slug}`,
              receipt_button_text: 'Go to Invitation',
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?slug=${config.slug}`,
            },
            checkout_options: {
              button_color: '#0f172a', // Slate-900 para match sa UI mo
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID, // Kailangan mo itong idagdag sa .env
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: process.env.LEMONSQUEEZY_VARIANT_ID,
              },
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
          'Content-Type': 'application/vnd.api+json',
        },
      }
    );

    const checkoutUrl = response.data.data.attributes.url;

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    console.error("LEMON ERROR:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}