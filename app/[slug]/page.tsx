import { createClient } from '@supabase/supabase-js';
import Preview from '../components/Preview';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function InvitationViewer({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !invitation) return notFound();

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
      {/* Naka-desktop viewMode tayo dito para sagad sa PC */}
      <Preview config={invitation.config_data} viewMode="desktop" />
    </main>
  );
}