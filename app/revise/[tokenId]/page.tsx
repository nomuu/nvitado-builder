import { createClient } from '@supabase/supabase-js';
import ReviseClient from './ReviseClient';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Page({ params }: { params: Promise<{ tokenId: string }> }) {
  // Sa bagong version ng Next.js, kailangan i-await ang params
  const { tokenId } = await params;

  console.log("Searching for Token ID:", tokenId);

  const { data: inv, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token_id', tokenId)
    .maybeSingle(); // Gumamit ng maybeSingle para hindi mag-crash pag walang nahanap

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">Supabase Query Error</h1>
        <pre className="bg-gray-100 p-4">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  if (!inv) {
    return (
      <div className="p-10 text-orange-600 border border-orange-200 bg-orange-50 rounded">
        <h1 className="font-bold text-xl">Token Not Found!</h1>
        <p className="mt-2">Ito ang hinahanap ko sa database: <span className="font-mono bg-white px-2 py-1 rounded border font-bold text-black">{tokenId}</span></p>
        <p className="mt-4 text-sm">Paki-check sa Supabase dashboard mo kung ang column <code className="bg-orange-100 px-1">token_id</code> ay may record na eksaktong ganyan.</p>
      </div>
    );
  }

  return <ReviseClient initialData={inv} />;
}