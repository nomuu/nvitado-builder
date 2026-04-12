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

    // 1. SAVE/UPSERT SA SUPABASE
    const { error: dbError } = await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
    }, { onConflict: 'slug' });

    if (dbError) {
      console.error("SUPABASE ERROR:", dbError.message);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

    // 2. LEMON SQUEEZY CHECKOUT CREATION
    // IMPORTANT: Ang Store ID at Variant ID ay dapat laging STRING sa JSON:API format
    const storeId = process.env.LEMONSQUEEZY_STORE_ID?.toString();
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID?.toString();
    const apiKey = process.env.LEMONSQUEEZY_API_KEY?.trim();

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
              // Inalis ang parseInt dahil ang ID mo ay string (UUID)
              variant_quantities: [
                {
                  variant_id: variantId,
                  quantity: 1,
                },
              ],
            },
            // PHP amount to Centavos (50.00 -> 5000)
            custom_price: Math.round(amount * 100), 
            product_options: {
              name: `Invitation: ${config.title}`,
              description: `Digital Invitation License for ${config.slug}`,
              receipt_button_text: 'Go to Invitation',
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?slug=${config.slug}`,
            },
            checkout_options: {
              button_color: '#0f172a',
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: storeId,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      },
      {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const checkoutUrl = response.data.data.attributes.url;

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    // Para makita mo sa VS Code Terminal ang exact error kung bakit ayaw
    console.error("LEMON ERROR FULL DETAILS:", error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}