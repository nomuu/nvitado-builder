import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { config, amount } = await req.json();
    const hashedId = crypto.createHash('sha256').update(new Date().toISOString() + config.slug).digest('hex');
    const tokenId = `nvi-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // 1. Save initial record
    const { error: dbError } = await supabase.from('invitations').upsert({
      id: hashedId,
      slug: config.slug,
      config_data: config,
      status: 'waiting_payment',
      total_paid: amount,
      token_id: tokenId,
      short_id: config.shortId,
      revision_count: 2
    }, { onConflict: 'id' });

    if (dbError) return NextResponse.json({ error: "DB Save Failed" }, { status: 500 });

    // 2. Call Lemon Squeezy
    const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              invitation_id: hashedId // 📍 IPINASA NATIN ITO
            }
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?slug=${config.slug}`
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID?.toString() } },
          variant: { data: { type: 'variants', id: process.env.LEMONSQUEEZY_VARIANT_ID?.toString() } }
        }
      }
    }, {
      headers: { Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`, 'Content-Type': 'application/vnd.api+json' }
    });

    // 3. I-SAVE ANG CHECKOUT ID MULA KAY LEMON
    const lemonCheckoutId = response.data.data.id;
    await supabase.from('invitations').update({ checkout_id: lemonCheckoutId }).eq('id', hashedId);

    return NextResponse.json({ checkout_url: response.data.data.attributes.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}