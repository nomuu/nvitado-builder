import { createClient } from '@supabase/supabase-js';
import ReviseClient from './ReviseClient';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Page({ params }: { params: Promise<{ tokenId: string }> }) {
  // 1. Await params para makuha ang tokenId mula sa URL ([tokenId])
  const { tokenId } = await params;
  
  // 2. Await cookies para sa security check
  const cookieStore = await cookies();

  // 3. 🛡️ SECURITY CHECK
  // I-check kung may verified cookie para sa specific na tokenId na ito
  const isVerified = cookieStore.get(`verified_${tokenId}`)?.value === 'true';

  if (!isVerified) {
    // Kung walang session/cookie, itatapon sila sa malinis na path ng verification page
    // base sa folder mo: app/verify-access/page.tsx
    return redirect('/verify-access');
  }

  // 4. Pag nakalusot sa bouncer, hugutin ang data sa Supabase
  const { data: inv, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token_id', tokenId)
    .maybeSingle();

  // Database error handling
  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">Supabase Query Error</h1>
        <pre className="bg-gray-100 p-4">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  // Pag walang record na nahanap sa DB gamit ang tokenId, dun lang mag-404
  if (!inv) {
    return notFound();
  }

  // I-render ang Editor
  return <ReviseClient initialData={inv} />;
}