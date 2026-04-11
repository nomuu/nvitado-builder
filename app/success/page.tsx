import React from 'react';
import Link from 'next/link';
import { PartyPopper, Hash, ReceiptText, Sparkles, CreditCard, User, KeyRound, Mail, BookHeart, MessageCircleQuestion } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import PrintButton from '../components/PrintButton'; 
import QRCodeSection from '../components/QRCodeSection'; 

export const dynamic = 'force-dynamic';

async function getSuccessDetails(slug: string) {
  if (!slug) return null;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: inv, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !inv) return null;

  let payerInfo = { name: 'Valued Customer', email: '---', method: 'E-WALLET' };

  if (inv.checkout_id) {
    try {
      const res = await axios.get(`https://api.paymongo.com/v1/checkout_sessions/${inv.checkout_id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
        }
      });
      const attrs = res.data.data.attributes;
      const billing = attrs.payments?.[0]?.attributes?.billing || attrs.line_items?.[0]?.billing || attrs.customer_details;
      
      if (billing) {
        payerInfo = {
          name: billing.name || 'Valued Customer',
          email: billing.email || '---',
          method: attrs.payment_method_used?.toUpperCase() || 'E-WALLET'
        };
      }
    } catch (e) {
      console.error("PayMongo Error");
    }
  }
  return { inv, payerInfo };
}

export default async function SuccessPage(props: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const sParams = await props.searchParams;
  const slug = typeof sParams.slug === 'string' ? sParams.slug : null;
  const data = await getSuccessDetails(slug as string);

  if (!data) return <div className="p-20 text-center font-black italic text-rose-500 uppercase">404 | NOT FOUND</div>;

  const { inv, payerInfo } = data;

  // 📍 DITO NATIN HAHATAKIN ANG TITLE MULA SA JSON (config_data)
  const config = inv.config_data || {};
  const eventTitle = config.title || inv.title || "Your Invitation";

  const amount = inv.total_paid || 0;

  // 📍 BREAKDOWN CALCULATION LOGIC
  // Base on your route.ts prices:
  const effectPrice = (amount % 50 === 5 || amount % 50 === 55 || amount % 50 === 25 || amount % 50 === 30) ? (amount % 50 === 25 || amount % 50 === 30 ? 25 : 5) : 0;
  const storyPrice = config.showStory ? 5 : 0;
  const extraQACount = Math.max(0, (config.questions?.length || 0) - 3);
  const qaPrice = extraQACount * 2;
  const extensionPrice = Math.max(0, amount - 50 - effectPrice - storyPrice - qaPrice);

  const dateObj = new Date(inv.created_at);
  const fullUrl = `https://nvitado.com/${slug}`; 

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center p-4 font-sans text-slate-900 leading-tight relative">
      
      {/* 📍 SQUARE QR SECTION FOR DOWNLOAD ONLY */}
      <div className="fixed -left-[9999px] top-0 overflow-hidden">
        <div 
          id="qr-only-download" 
          className="bg-white flex flex-col items-center justify-center p-12 text-center"
          style={{ width: '450px', height: '450px' }}
        >
          <div className="mb-6 w-full">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight mb-6">
               {eventTitle}
            </h1>
            <div className="flex justify-center">
               <QRCodeSection url={fullUrl} />
            </div>
          </div>
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-2 font-bold">Invitation Link</p>
          <p className="text-sm font-bold text-slate-900 font-mono lowercase tracking-tighter">
            {fullUrl.replace('https://', '')}
          </p>
        </div>
      </div>

      <div className="max-w-[420px] w-full text-left">
        <div id="receipt-to-download" className="bg-white rounded-t-[3rem] pt-10 px-8 pb-10 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-rose-500" />
          
          <div className="flex justify-between items-start mb-8 text-left text-slate-900">
            <div>
              <div className="mb-1">
                <img src="/assets/images/logo2.png" alt="Logo" style={{ width: '110px', height: 'auto' }} />
              </div>
              <p className="text-[8px] font-black text-rose-500 tracking-[0.3em] uppercase leading-none font-bold italic">Official Payment Receipt</p>
            </div>
            <PartyPopper size={24} className="text-emerald-500 rotate-12" />
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 mb-6 text-center shadow-xl relative overflow-hidden text-white font-bold italic uppercase">
             <div className="absolute top-0 right-0 p-4 opacity-10"><KeyRound size={60} className="-rotate-12" /></div>
             <p className="text-[9px] font-black text-rose-400 uppercase tracking-[0.3em] mb-3 relative z-10 leading-none">SAVE YOUR EDIT TOKEN</p>
             <div className="flex items-center justify-center gap-2 mb-2 font-mono relative z-10 font-bold">
                <Hash size={18} className="text-rose-500" />
                <h2 className="text-2xl font-black text-white tracking-widest leading-none uppercase">{inv.token_id}</h2>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 relative z-10 text-center font-bold italic">Use this code to edit your invitation in the future.</p>
          </div>

          <div className="space-y-5 mb-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left text-slate-900 font-bold">
             <div className="border-b border-slate-200 pb-3">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1.5 tracking-widest leading-none font-bold">Payer Name</p>
                <div className="flex items-center gap-2 font-black uppercase text-xs italic break-all leading-tight">
                   <User size={12} className="text-rose-500 shrink-0" />
                   {payerInfo.name}
                </div>
             </div>

             <div className="border-b border-slate-200 pb-3">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1.5 tracking-widest leading-none font-bold">Contact Email</p>
                <div className="flex items-center gap-2 font-black uppercase text-xs italic break-all leading-tight">
                   <Mail size={12} className="text-rose-500 shrink-0" />
                   {payerInfo.email}
                </div>
             </div>

             <div className="border-b border-slate-200 pb-3">
                <p className="text-[8px] font-black text-rose-500 uppercase mb-1.5 italic tracking-widest leading-none font-bold">Date Paid</p>
                <p className="text-[10px] font-bold uppercase leading-tight tracking-wide">
                   {dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
             </div>

             <div className="">
                <p className="text-[8px] font-black text-rose-500 uppercase mb-1.5 italic tracking-widest leading-none font-bold">Transaction ID</p>
                <p className="text-[10px] font-mono font-bold break-all uppercase leading-tight tracking-tighter">
                   {inv.checkout_id}
                </p>
             </div>
          </div>

          {/* 📍 UPDATED ORDER BREAKDOWN */}
          <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100 text-slate-500 font-bold">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3 text-slate-400">
              <ReceiptText size={14} />
              <p className="text-[9px] font-black uppercase tracking-widest italic leading-none font-bold">Order Breakdown</p>
            </div>
            <div className="space-y-2 mb-4 font-bold uppercase text-[10px]">
              <div className="flex justify-between font-bold"><span>Base Fee</span><span className="text-slate-900">₱50.00</span></div>
              
              {effectPrice > 0 && <div className="flex justify-between items-center gap-1 font-bold"><span><Sparkles size={8}/> Theme Effect</span><span className="text-slate-900">₱{effectPrice.toFixed(2)}</span></div>}
              
              {/* 📍 NEW: STORY BREAKDOWN */}
              {storyPrice > 0 && <div className="flex justify-between items-center gap-1 font-bold"><span><BookHeart size={8}/> Custom section</span><span className="text-slate-900">₱{storyPrice.toFixed(2)}</span></div>}
              
              {/* 📍 NEW: Q&A BREAKDOWN */}
              {qaPrice > 0 && <div className="flex justify-between items-center gap-1 font-bold"><span><MessageCircleQuestion size={8}/> Extra Q&A ({extraQACount})</span><span className="text-slate-900">₱{qaPrice.toFixed(2)}</span></div>}
              
              {extensionPrice > 0 && <div className="flex justify-between"><span>Add-ons / Extension</span><span className="text-slate-900">₱{extensionPrice.toFixed(2)}</span></div>}
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-black uppercase italic text-slate-900 leading-none font-bold">
              <span>Total Paid</span>
              <span className="text-rose-600 text-xl font-black underline underline-offset-4 tracking-tighter font-mono">₱{amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-4 bg-slate-900 rounded-2xl mb-8 text-white shadow-lg text-left font-bold italic">
             <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg text-rose-500"><CreditCard size={14} /></div>
                <div>
                   <p className="text-[7px] font-black text-rose-500 uppercase tracking-widest leading-none mb-1">Method</p>
                   <p className="text-[10px] font-bold uppercase leading-none font-bold">{payerInfo.method}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1 text-right font-bold uppercase">Status</p>
                <p className="text-[9px] font-black text-emerald-400 uppercase italic font-mono leading-none tracking-widest">SUCCESS</p>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <QRCodeSection url={fullUrl} />
            </div>
            <div className="">
              <p className="text-[8px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1 font-bold">Invitation Link</p>
              <p className="text-[10px] font-bold text-slate-900 truncate px-2 italic font-mono lowercase tracking-tight">
                {fullUrl.replace('https://', '')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[420px] w-full mt-6 space-y-3 px-2">
        <PrintButton targetId="receipt-to-download" mode="receipt" />
        <PrintButton targetId="qr-only-download" mode="qr" />
        <Link 
          href={`/${slug}`} 
          className="block w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-center shadow-lg active:scale-95 transition-all font-bold"
        >
          Open Invitation Site
        </Link>
      </div>
    </div>
  );
}