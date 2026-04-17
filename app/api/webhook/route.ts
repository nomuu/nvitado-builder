import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Lemon Squeezy sends event name in meta.event_name
    const eventName = body.meta?.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const invId = body.meta.custom_data.invitation_id; // Match sa hashedId natin

      // 📍 UPDATE DATABASE
      const { error } = await supabase
        .from('invitations')
        .update({ 
          status: 'paid', 
          email: email 
        })
        .eq('id', invId);

      if (error) {
        console.error("WEBHOOK DB ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log(`Update success for ${email}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}