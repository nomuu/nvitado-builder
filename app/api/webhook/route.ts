import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventName = body.meta.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const invId = body.meta.custom_data.invitation_id; // Match sa hashedId

      const { error } = await supabase.from('invitations')
        .update({ 
          status: 'paid', 
          email: email 
        })
        .eq('id', invId);

      if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
      console.log("Success: Payment verified for", email);
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}