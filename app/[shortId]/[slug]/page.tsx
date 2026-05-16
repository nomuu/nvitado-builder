import { createClient } from '@supabase/supabase-js';
import Preview from '../../components/Preview';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import React from 'react';
import GracePeriodCountdown from './GracePeriodCountdown';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- 1. DYNAMIC TITLE ---
export async function generateMetadata({ params }: { params: Promise<{ shortId: string, slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params; 
  
  const { data: invitation } = await supabase
    .from('invitations')
    .select('config_data, status')
    .eq('short_id', resolvedParams.shortId) 
    .single();

  if (!invitation || invitation.status !== 'paid') {
    return { title: "Nvitado | Digital Invitation" };
  }

  return {
    title: invitation?.config_data?.title || "Digital Invitation | Nvitado",
  };
}

// --- 2. MAIN PAGE ---
export default async function InvitationViewer({ params }: { params: Promise<{ shortId: string, slug: string }> }) {
  const resolvedParams = await params;
  const { shortId } = resolvedParams; 

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('short_id', shortId)
    .single();

  if (error || !invitation || invitation.status !== 'paid') {
    return notFound();
  }

  // 🕒 DATE MATH CHECKS
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventDate = new Date(invitation.config_data.eventDate);
  eventDate.setHours(0, 0, 0, 0);

  const expirationDate = new Date(eventDate);
  expirationDate.setDate(eventDate.getDate() + 2);
  expirationDate.setHours(23, 59, 59, 999);

  const diffTime = today.getTime() - eventDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 🛑 AUTOMATIC DELETION: Kung lumagpas na sa 2 araw na grace period, burahin na agad sa Supabase
  if (diffDays > 2) {
    console.log(`AUTO-DELETE: Event expired. Deleting token ${invitation.token_id} permanently.`);
    
    await supabase
      .from('invitations')
      .delete()
      .eq('short_id', shortId);

    return notFound();
  }

  const isGracePeriod = diffDays >= 0 && diffDays <= 2;

  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden relative">
      {/* 🔒 IPAPAKITA PA RIN ANG INVITATION PREVIEW SA LIKOD */}
      <Preview config={invitation.config_data} viewMode="desktop" />

      {/* 🛑 KAPAG GRACE PERIOD, NAKAPATONG ITONG BLUR MODAL WALL */}
      {isGracePeriod && (
        <GracePeriodCountdown 
          expirationTime={expirationDate.toISOString()} 
          title={invitation.config_data.title || "Your Event"}
          // 🆕 PINASA NATIN ANG DYNAMIC NAME DITO GALING SA TABLE RECORD NG INVITATION
          initialCustomerName={invitation.customer_name || "Valued Customer"}
        />
      )}
    </main>
  );
}