import { createClient } from '@supabase/supabase-js';
import Preview from '../../components/Preview';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. DYNAMIC TITLE ---
export async function generateMetadata({ params }: { params: Promise<{ shortId: string, slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params; 
  
  // 📍 Fetch gamit ang short_id para sa metadata
  const { data: invitation } = await supabase
    .from('invitations')
    .select('config_data')
    .eq('short_id', resolvedParams.shortId) 
    .single();

  return {
    title: invitation?.config_data?.title || "Digital Invitation | Nvitado",
  };
}

// --- 2. MAIN PAGE ---
export default async function InvitationViewer({ params }: { params: Promise<{ shortId: string, slug: string }> }) {
  const resolvedParams = await params;
  const { shortId } = resolvedParams; // 📍 shortId na ang priority natin dito

  // 📍 Database Query: short_id na ang hinahanap natin
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('short_id', shortId)
    .single();

  if (error || !invitation) return notFound();

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* 📍 Preview is still the same, passing config data */}
      <Preview config={invitation.config_data} viewMode="desktop" />
    </main>
  );
}