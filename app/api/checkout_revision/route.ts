import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenId = searchParams.get('token');

    if (!tokenId) {
      return NextResponse.json({ error: "Missing Token ID" }, { status: 400 });
    }

    // 💰 SET TO ₱35.00 PARA MATCH SA GINAWA MONG PRODUCT
    const amount = 35; 
    const description = `EXTRA REVISION CREDITS | 3 CREDITS — ₱35.00 | REF: ${tokenId.toUpperCase()}`;

    // 🔗 Gagamitin na ang bagong Variant ID mula sa .env.local mo
    const REVISION_VARIANT_ID = process.env.LEMONSQUEEZY_REVISION_VARIANT_ID;

    if (!REVISION_VARIANT_ID) {
      return NextResponse.json({ error: "Missing LEMONSQUEEZY_REVISION_VARIANT_ID in env" }, { status: 500 });
    }

    // CALL LEMON SQUEEZY API
    const response = await axios.post('https://api.lemonsqueezy.com/v1/checkouts', {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: {
              token_id: tokenId
            }
          },
          product_options: {
            name: `NVITADO: 3 EXTRA REVISION CREDITS`,
            description: description
          },
          checkout_options: {
            button_color: '#0f172a'
          }
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID?.toString() } },
          variant: { data: { type: 'variants', id: REVISION_VARIANT_ID.toString() } }
        }
      }
    }, {
      headers: { 
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    });

    const lemonCheckoutUrl = response.data.data.attributes.url;
    return NextResponse.redirect(lemonCheckoutUrl);

  } catch (error: any) {
    console.error("LEMON REVISION CHECKOUT ERROR:", error.response?.data || error.message);
    return NextResponse.json({ 
      error: "Failed to generate revision checkout link.",
      details: error.response?.data?.errors?.[0]?.detail || error.message
    }, { status: 500 });
  }
}