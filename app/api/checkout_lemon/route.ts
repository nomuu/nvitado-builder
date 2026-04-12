import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- TOKEN GENERATOR (Same as your PayMongo logic) ---
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
    const { config, amount } = await req.json();
    
    // 1. GENERATE TOKEN ID
    const tokenId = generateTokenId();

    // 2. SAVE/UPSERT SA SUPABASE (Added token_id here)
    const { error: dbError } = await supabase.from('invitations').upsert({
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
      token_id: tokenId, // <--- Isinama na natin 'to
    }, { onConflict: 'slug' });

    if (dbError) {
      console.error("SUPABASE ERROR:", dbError.message);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

    // 3. LEMON SQUEEZY CHECKOUT CREATION
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
                token_id: tokenId, // <--- Ipinasa rin sa Lemon Squeezy Metadata
              },
              variant_quantities: [
                {
                  variant_id: variantId,
                  quantity: 1,
                },
              ],
            },
            custom_price: Math.round(amount * 100), 
            product_options: {
              name: `Invitation: ${config.title}`,
              // Nilagay din natin sa description para sa resibo
              description: `License for ${config.slug} | Ref: ${tokenId}`, 
              receipt_button_text: 'Go to Invitation',
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?slug=${config.slug}&token=${tokenId}`,
            },
            checkout_options: {
              button_color: '#0f172a',
            }
          },
          relationships: {
            store: { data: { type: 'stores', id: storeId } },
            variant: { data: { type: 'variants', id: variantId } },
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
    const checkoutId = response.data.data.id;

    // 4. UPDATE CHECKOUT ID SA SUPABASE (Para match sa flow mo)
    await supabase.from('invitations').update({ 
      checkout_id: checkoutId 
    }).eq('slug', config.slug);

    return NextResponse.json({ checkout_url: checkoutUrl });

  } catch (error: any) {
    console.error("LEMON ERROR FULL DETAILS:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}