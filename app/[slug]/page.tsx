import { createClient } from '@supabase/supabase-js';
import Preview from '../components/Preview';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. DYNAMIC TITLE (Corrected for Next.js 15) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // 📍 Kailangan i-await ang params dito
  const resolvedParams = await params; 
  
  const { data: invitation } = await supabase
    .from('invitations')
    .select('config_data')
    .eq('slug', resolvedParams.slug)
    .single();

  return {
    title: invitation?.config_data?.title || "Digital Invitation | Nvitado",
  };
}

// --- 2. MAIN PAGE ---
export default async function InvitationViewer({ params }: { params: Promise<{ slug: string }> }) {
  // 📍 Kailangan din i-await ang params dito
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !invitation) return notFound();

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      <Preview config={invitation.config_data} viewMode="desktop" />
    </main>
  );
}