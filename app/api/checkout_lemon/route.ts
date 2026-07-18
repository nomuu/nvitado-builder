import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import crypto from 'crypto';
import { BACKGROUNDS } from '../../constants/backgrounds'; // 🎯 NAAYOS NA PATH
import { calculatePricing } from '../../../lib/pricing';
import { rateLimit, tooManyRequests, getClientIp } from '../../../lib/ratelimit';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    // Rate limit checkout creation (creates DB rows + external API calls).
    const { allowed, retryAfter } = await rateLimit(`checkout:${getClientIp(req)}`, 10, 60);
    if (!allowed) return tooManyRequests(retryAfter);

    const { config } = await req.json();
    // 🔒 SECURITY: the price is computed on the server from the config only.
    // Any client-supplied amount is ignored to prevent price tampering.
    const amount = calculatePricing(config).total;
    const hashedId = crypto.createHash('sha256').update(new Date().toISOString() + config.slug + Math.random()).digest('hex');
    const tokenId = `NVI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

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
    const selectedBg = BACKGROUNDS.find((bg) => bg.id === config.animationId);
    const effectPrice = selectedBg?.price || 0;

    const storyPrice = config.showStory ? 5 : 0;
    const extraQACount = Math.max(0, (config.questions?.length || 0) - 3);
    const qaPrice = extraQACount * 2;
    const rsvpPrice = config.showRSVP ? 5 : 0;
    
    // Ang matitirang butal mula sa amount ay saktong mapupunta sa extensionPrice
    const extensionPrice = Math.max(0, amount - 50 - effectPrice - storyPrice - qaPrice - rsvpPrice);
    
    // 🆕 BINUKAL NA LOGIC: Kunin natin kung ilang buwan ang katumbas ng extensionPrice gamit ang bagong ₱5 rate mo
    const retentionMonths = Math.round(extensionPrice / 5);

    // Kuhanin ang effect name (uppercase para match sa sidebar)
    const effectName = config.effect?.replace(/([A-Z])/g, ' $1').trim().toUpperCase() || 'THEME EFFECT';

    let description = `PUBLISHING FEE — ₱50.00`;
    if (effectPrice > 0) description += `  |  ${effectName} — ₱${effectPrice.toFixed(2)}`;
    if (storyPrice > 0) description += `  |  CUSTOM SECTION FEATURE — ₱${storyPrice.toFixed(2)}`;
    if (qaPrice > 0) description += `  |  EXTRA Q&A (${extraQACount}) — ₱${qaPrice.toFixed(2)}`;
    if (rsvpPrice > 0) description += `  |  RSVP FEATURE — ₱${rsvpPrice.toFixed(2)}`;
    
    // 🆕 IBINALIK ANG MONTH INDICATOR LABEL: Swak na sa bagong 5 pesos allocation math breakdown mo
    if (extensionPrice > 0) {
      description += `  |  LONG-TERM STORAGE (${retentionMonths} ${retentionMonths === 1 ? 'MONTH' : 'MONTHS'}) — ₱${extensionPrice.toFixed(2)}`;
    }
    
    description += `  |  REF: ${tokenId}`;
    
    const origin = req.headers.get('origin') || 'https://nvitado.com'; 
    
    // 🔒 Use the unguessable token as the success lookup key (not the public slug).
    const finalReturnUrl = `${origin}/success?token=${tokenId}`;

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
            description: description,
            redirect_url: finalReturnUrl
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
  } catch (error: unknown) {
    console.error('CHECKOUT_LEMON ERROR:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }
}