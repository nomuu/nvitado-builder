import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventName = body.meta?.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const name = body.data.attributes.user_name; // Ronald Fernandez Mendoza
      const invId = body.meta.custom_data.invitation_id;

      console.log(`WEBHOOK DATA: Email: ${email}, Name: ${name}, ID: ${invId}`);

      // 📍 FORCE UPDATE: Gagamit ng 'as any' para bypass schema cache issue
      const { error } = await supabase
        .from('invitations')
        .update({ 
          status: 'paid', 
          email: email,
          customer_name: name // Sinisiguro nating 'user_name' galing Lemon ang ilalagay dito
        } as any) 
        .eq('id', invId);

      if (error) {
        console.error("WEBHOOK DB ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log("DATABASE UPDATE SUCCESSFUL");
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("WEBHOOK CATCH ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}