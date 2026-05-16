import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventName = body.meta?.event_name;

    if (eventName === 'order_created') {
      const email = body.data.attributes.user_email;
      const name = body.data.attributes.user_name;
      const customData = body.meta.custom_data;
      
      // 📍 REVISION LOGIC: Kung ang pumasok ay token_id, ito ay extra credit purchase
      const tokenId = customData?.token_id;

      if (tokenId) {
        console.log(`WEBHOOK: Processing extra credit for token: ${tokenId}`);

        // 1. Kunin ang current credits bago mag-update
        const { data: currentInv, error: fetchError } = await supabase
          .from('invitations')
          .select('revision_count, purchasable_revision_count')
          .eq('token_id', tokenId)
          .maybeSingle();

        if (!fetchError && currentInv) {
          // 2. Update counts: +3 sa current credits, -3 sa stock (purchasable)
          const { error: revisionUpdateError } = await supabase
            .from('invitations')
            .update({
              revision_count: (currentInv.revision_count || 0) + 3,
              purchasable_revision_count: Math.max(0, (currentInv.purchasable_revision_count || 3) - 3)
            } as any)
            .eq('token_id', tokenId);

          if (revisionUpdateError) {
            console.error("WEBHOOK REVISION ERROR:", revisionUpdateError.message);
          } else {
            console.log("REVISION CREDIT ADDED SUCCESSFULLY");
            return NextResponse.json({ received: true }, { status: 200 });
          }
        }
      }

      // 📍 ORIGINAL LOGIC: Para sa new invitations (Wag gagalawin)
      const invId = customData?.invitation_id;
      if (invId) {
        console.log(`WEBHOOK DATA: Email: ${email}, Name: ${name}, ID: ${invId}`);

        const { error } = await supabase
          .from('invitations')
          .update({ 
            status: 'paid', 
            email: email,
            customer_name: name 
          } as any) 
          .eq('id', invId);

        if (error) {
          console.error("WEBHOOK DB ERROR:", error.message);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
        console.log("DATABASE UPDATE SUCCESSFUL");
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("WEBHOOK CATCH ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}