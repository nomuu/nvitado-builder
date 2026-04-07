import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // PayMongo webhook structure check
    if (body.data.attributes.type === 'checkout_session.payment.paid') {
      const checkoutSessionId = body.data.attributes.data.id;

      // Update status to 'active' in Supabase
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'active' })
        .eq('checkout_id', checkoutSessionId);

      if (error) {
        console.error("Supabase Webhook Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log("Invitation activated successfully!");
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}