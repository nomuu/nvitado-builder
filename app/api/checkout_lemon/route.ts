import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const generateHashedId = () => {
  const now = new Date();
  const timestamp = 
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getFullYear().toString() +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  return crypto.createHash('sha256').update(timestamp).digest('hex');
};

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
    
    // 1. GENERATE TOKEN ID AND HASHED ID
    const tokenId = generateTokenId();
    const hashedId = generateHashedId();
    const shortId = config.shortId;

    // 2. SAVE/UPSERT SA SUPABASE
    // Idinagdag ang revision_count: 2
    const { error: dbError } = await supabase.from('invitations').upsert({
      id: hashedId,
      short_id: shortId,
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
      token_id: tokenId,
      revision_count: 2, // 📍 Default revisions after payment
    }, { onConflict: 'slug' });

    if (dbError) {
      console.error("SUPABASE ERROR:", dbError.message);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }

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
              // 📍 NILINIS KO DITO: Tinanggal ang empty email field para hindi mag-error
              custom: {
                invitation_slug: config.slug,
                token_id: tokenId,
                invitation_id: hashedId,
                short_id: shortId,
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
              description: `License for ${config.slug} | Ref: ${tokenId}`, 
              receipt_button_text: 'Go to Invitation',
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?slug=${config.slug}&shortId=${shortId}&token=${tokenId}`,
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