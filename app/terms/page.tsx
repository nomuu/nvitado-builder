"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, Coins, Ban, Edit3, ShieldAlert
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function TermsPage() {
  // 📍 TANGGAL NA ANG NAVBAR AT FOOTER DITO DAHIL NASA LAYOUT.TSX NA ITO.
  // Isang edit na lang sa shared components, updated na lahat ng pages.

  return (
    <div className={`min-h-screen ${poppins.className} bg-[#FFFDF8] text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* 2. HEADER */}
      <section className="pt-48 pb-16 px-6 text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full mb-6 border border-slate-200">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">User Agreement & Privacy</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Legal & <br/>
            <span className="text-rose-500 not-italic">Policies.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">Effective Date: April 2026</p>
        </motion.div>
      </section>

      {/* 3. CONTENT AREA */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* SECTION 1: CORE RULES */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><AlertTriangle size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">01. Service Limitations</h3>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase mb-2 text-slate-900">1-Week Booking Rule</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                  All invitations must be published at least <span className="font-bold text-slate-900">7 days</span> prior to the event date. Nvitado automatically restricts any rush creations within this period to ensure service quality.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase mb-2 text-slate-900">Automatic Data Purge</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                  Links and guest RSVP data are <span className="font-bold text-rose-500">permanently deleted 48 hours</span> after the event ends. We do not store backups; users must export data manually before this period.
                </p>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: REFUND POLICY */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Coins size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">02. Refund & Payment Policy</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Due to the nature of digital products and instant link activation, <span className="font-bold text-slate-900 underline">all sales are final.</span> However, we allow refunds under specific circumstances:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <h4 className="text-[10px] font-black uppercase text-emerald-700 mb-2">Valid Refund Scenarios:</h4>
                <ul className="text-[9px] font-bold text-emerald-800 space-y-2 uppercase">
                  <li>• Double payment due to system error.</li>
                  <li>• System failure to generate link (24hr unresolved).</li>
                  <li>• Purchased Add-on not appearing on site.</li>
                </ul>
              </div>
              <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                <h4 className="text-[10px] font-black uppercase text-rose-700 mb-2">Invalid Scenarios:</h4>
                <ul className="text-[9px] font-bold text-rose-800 space-y-2 uppercase">
                  <li>• Event cancellation or postponement.</li>
                  <li>• Spelling/detail errors (Use free edits).</li>
                  <li>• Change of mind regarding design.</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-[10px] font-bold text-slate-400 uppercase italic">
              *Refund requests must be sent to hello@nvitado.com with proof of payment within 48 hours of transaction.
            </p>
          </motion.div>

          {/* SECTION 3: CONTENT CONDUCT */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Ban size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">03. Prohibited Content</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 uppercase text-[11px] tracking-tight">
              We reserve the right to deactivate any link without refund if found using our platform for:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-black uppercase text-slate-400">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Fraudulent activities / Scams</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Explicit or Nudity content</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Harassment or Hate speech</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Copyrighted materials</li>
            </ul>
          </motion.div>

          {/* SECTION 4: REVISIONS */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Edit3 size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">04. Revision & Design Lock</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              To maintain system performance, editing is limited after publication.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-900">Text Details (Title, Date, Map)</span>
                <span className="text-[10px] font-black text-indigo-600">2 FREE • MAX 5 TOTAL</span>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-rose-900">Visual Design (BG, Effects, Music)</span>
                <span className="text-[10px] font-black text-rose-600 uppercase italic">LOCKED ON PUBLISH</span>
              </div>
            </div>
          </motion.div>

          {/* SECTION 5: LIABILITY */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><ShieldAlert size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">05. Limitation of Liability</h3>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
              Nvitado is not liable for service interruptions, server downtime, or external app (Messenger/Viber) delivery failures. We provide the tool, but the distribution and guest management remain the User's responsibility.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
}