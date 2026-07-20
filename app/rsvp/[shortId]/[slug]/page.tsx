import { createClient } from '@supabase/supabase-js';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import React from 'react';
import RsvpOwnerManager from './RsvpOwnerManager';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ shortId: string; slug: string }> }): Promise<Metadata> {
  const { shortId } = await params;
  const { data } = await supabase
    .from('invitations')
    .select('config_data')
    .eq('short_id', shortId)
    .single();

  const title = data?.config_data?.title || 'Your Event';
  return { title: `RSVP Manager | ${title}` };
}

export default async function RsvpOwnerPage({ params }: { params: Promise<{ shortId: string; slug: string }> }) {
  const { shortId, slug } = await params;

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('id, short_id, slug, status, config_data, customer_name, token_id')
    .eq('short_id', shortId)
    .single();

  // Must exist and be a paid invitation.
  if (error || !invitation || invitation.status !== 'paid') {
    return notFound();
  }

  // 🔒 Owner-only: require the verified session cookie (set after the email+OTP
  // flow in /verify-access). Without it, redirect to verify ownership — and pass
  // a `next` return-path so the owner lands back HERE (RSVP manager) after
  // verifying, instead of the revision builder.
  const cookieStore = await cookies();
  const isVerified = cookieStore.get(`verified_${invitation.token_id}`)?.value === 'true';
  if (!isVerified) {
    return redirect(`/verify-access?next=${encodeURIComponent(`/rsvp/${shortId}/${slug}`)}`);
  }

  const config = invitation.config_data || {};
  const eventTitle = config.title || 'Your Event';
  const rsvpEnabled = !!config.showRSVP;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-slate-900 antialiased">
      <div className="max-w-xl mx-auto px-5 py-12">
        {/* HEADER */}
        <div className="text-center mb-8">
          <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">Nvitado · RSVP Manager</p>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">{eventTitle}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Accept or reject the guests who requested to attend.
          </p>
        </div>

        {!rsvpEnabled ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 text-center">
            <p className="text-sm font-black uppercase tracking-wide text-slate-900 mb-2">RSVP is not enabled</p>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              The RSVP feature was not turned on for this invitation, so there is no guest list to manage.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
            <RsvpOwnerManager invitationId={invitation.id} eventDate={config.eventDate || null} />
          </div>
        )}

        <p className="text-center mt-8 text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
          Keep this link private. Anyone with it can manage your guest list.
        </p>
      </div>
    </div>
  );
}
