import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventName = body.meta.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const checkoutId = body.data.id; // ID ng checkout session
      const invitationId = body.meta.custom_data.invitation_id; // Yung pinasa natin

      console.log(`Webhook triggered for ${email}. InvitationID: ${invitationId}`);

      // 📍 TRIPLE CHECK UPDATE: Subukan i-update gamit ang ID, kung wala, gamitin ang checkout_id
      const { error } = await supabase
        .from('invitations')
        .update({ 
          status: 'paid', 
          email: email 
        })
        .or(`id.eq.${invitationId},checkout_id.eq.${checkoutId}`); // 📍 HANAPIN SA KAHIT ALIN DYAN SA DALAWA

      if (error) {
        console.error("Update Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}