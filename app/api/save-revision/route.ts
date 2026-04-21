import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: Request) {
  try {
    const { tokenId, config, currentCredits } = await req.json();
    const cookieStore = await cookies();

    // 1. 🛡️ Security Check: Verified session via cookie
    const isVerified = cookieStore.get(`verified_${tokenId}`)?.value === 'true';
    if (!isVerified) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    // 2. 🔍 Fetch Current Data para sa Comparison
    // Gagamit tayo ng .eq('token_id', tokenId) base sa schema mo
    const { data: currentInv, error: fetchError } = await supabase
      .from('invitations')
      .select('id, config_data, revision_count')
      .eq('token_id', tokenId)
      .maybeSingle();

    if (fetchError || !currentInv) {
      return NextResponse.json({ error: "Invitation record not found in database." }, { status: 404 });
    }

    // 3. 🔍 Deep Comparison (Stringified for simplicity)
    const oldConfigStr = JSON.stringify(currentInv.config_data);
    const newConfigStr = JSON.stringify(config);

    if (oldConfigStr === newConfigStr) {
      return NextResponse.json({ 
        success: false, 
        error: "NO_CHANGES", 
        message: "No changes detected." 
      });
    }

    // 4. 🛡️ Credit Check
    if (currentInv.revision_count <= 0) {
      return NextResponse.json({ error: "No revision credits remaining." }, { status: 403 });
    }

    // 5. 💾 Database Update (Main Table)
    const { data: updated, error: updateError } = await supabase
      .from('invitations')
      .update({ 
        config_data: config,
        revision_count: currentInv.revision_count - 1 
      } as any)
      .eq('token_id', tokenId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 6. 📝 Audit Logging (Revision Logs)
    // Dito tayo mag-i-insert pagkatapos ng success na update
    const logType = currentInv.revision_count > 0 ? 'free' : 'paid';

    await supabase
      .from('revision_logs')
      .insert({
        invitation_id: currentInv.id, // Primary Key 'id' ng invitations
        token_id: tokenId,           // 'nvi-XXXX' identifier
        old_config: currentInv.config_data,
        new_config: config,
        revision_type: logType
      });

    return NextResponse.json({ 
      success: true, 
      newCount: updated.revision_count 
    });

  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}