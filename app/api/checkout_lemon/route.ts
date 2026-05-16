import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { config, amount } = await req.json();
    const hashedId = crypto.createHash('sha256').update(new Date().toISOString() + config.slug + Math.random()).digest('hex');
    const tokenId = `nvi-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // 1. SAVE INITIAL RECORD
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

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    // 2. GENERATE PROFESSIONAL BREAKDOWN (MATCHING SIDEBAR)
    const effectPrice = (amount % 50 === 5 || amount % 50 === 55 || amount % 50 === 25 || amount % 50 === 30) ? (amount % 50 === 25 || amount % 50 === 30 ? 25 : 5) : 0;
    const storyPrice = config.showStory ? 5 : 0;
    const extraQACount = Math.max(0, (config.questions?.length || 0) - 3);
    const qaPrice = extraQACount * 2;
    const extensionPrice = Math.max(0, amount - 50 - effectPrice - storyPrice - qaPrice);

    // Kuhanin ang effect name (uppercase para match sa sidebar)
    const effectName = config.effect?.replace(/([A-Z])/g, ' $1').trim().toUpperCase() || 'THEME EFFECT';

    let description = `PUBLISHING FEE — ₱50.00`;
    if (effectPrice > 0) description += `  |  ${effectName} — ₱${effectPrice.toFixed(2)}`;
    if (storyPrice > 0) description += `  |  CUSTOM SECTION FEATURE — ₱${storyPrice.toFixed(2)}`;
    if (qaPrice > 0) description += `  |  EXTRA Q&A (${extraQACount}) — ₱${qaPrice.toFixed(2)}`;
    if (extensionPrice > 0) description += `  |  ADD-ONS / EXTENSION — ₱${extensionPrice.toFixed(2)}`;
    
    description += `  |  REF: ${tokenId}`;

    // 3. LEMON SQUEEZY CALL
    const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              invitation_id: hashedId,
              invitation_slug: config.slug 
            }
          },
          custom_price: Math.round(amount * 100),
          product_options: {
            name: `INVITATION: ${config.title.toUpperCase()}`,
            description: description
          },
          checkout_options: {
            button_color: '#0f172a'
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID?.toString() } },
          variant: { data: { type: 'variants', id: process.env.LEMONSQUEEZY_VARIANT_ID?.toString() } }
        }
      }
    }, {
      headers: { 
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    });

    const lemonCheckoutId = response.data.data.id;
    await supabase.from('invitations').update({ checkout_id: lemonCheckoutId }).eq('id', hashedId);

    return NextResponse.json({ checkout_url: response.data.data.attributes.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}