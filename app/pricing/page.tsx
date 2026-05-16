"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, Zap, Calendar, TrendingUp,
  CheckCircle2, AlertTriangle, Calculator, HelpCircle, Edit3, Layers,
  Clock, ShieldAlert 
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

// 📍 FIXED: Explicitly typed as 'any' to bypass Vercel TypeScript build error
const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function PricingPage() {
  // 📍 TANGGAL NA ANG NAVBAR AT FOOTER DITO DAHIL NASA LAYOUT.TSX NA ITO.
  // Isang edit na lang sa shared components, updated na lahat ng pages.

  return (
    <div className={`min-h-screen ${poppins.className} bg-[#FFFDF8] text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* 2. HERO */}
      <section className="pt-48 pb-16 px-6 text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-full mb-6 border border-rose-100 shadow-sm">
            <Zap size={12} fill="currentColor" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Honest Pricing Model</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Fair. Simple. <br/>
            <span className="text-rose-500 not-italic">Professional.</span>
          </h1>
        </motion.div>
      </section>

      {/* 3. SERVICE CARDS (Uniform White Design) */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-8"><Calendar size={28} /></div>
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Base Fee</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-5xl font-black text-slate-900">₱50</span><span className="text-slate-400 font-bold text-[10px] uppercase">/ Start</span></div>
            <ul className="space-y-4 pt-6 border-t border-slate-50 text-[11px] font-black uppercase text-slate-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-emerald-500" /> Event Month Hosting</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-emerald-500" /> 2 Free Revisions</li>
              <li className="flex items-center gap-3"><Clock size={14} className="text-amber-500" /> 48hr Grace Period</li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8"><TrendingUp size={28} /></div>
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Extensions</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-5xl font-black text-slate-900">₱20</span><span className="text-slate-400 font-bold text-[10px] uppercase">/ Extra Month</span></div>
            <ul className="space-y-4 pt-6 border-t border-slate-50 text-[11px] font-black uppercase text-slate-600">
              <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-amber-500" /> Advance Booking</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-amber-500" /> Extended Live Link</li>
              <li className="flex items-center gap-3"><CheckCircle2 size={14} className="text-amber-500" /> Future Hosting</li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8"><Layers size={28} /></div>
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Add-Ons</h3>
            <div className="space-y-4 pt-6 border-t border-slate-50 text-[11px] font-black uppercase text-slate-600">
               <div className="flex justify-between items-center pb-2">
                  <p>Paid 3 Revisions pack<br/><span className="text-[8px] text-slate-400 font-bold">(After 2 Free)</span></p>
                  <span className="text-xl font-black text-indigo-600">₱35.00</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                  <p>Premium Effects</p>
                  <span className="text-xl font-black text-rose-500">₱5.00</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POLICY GRID */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem]">
                <AlertTriangle className="text-amber-500 mb-4 mx-auto" size={32} />
                <h4 className="text-lg font-black uppercase italic text-amber-900">1-Week Policy</h4>
                <p className="text-[10px] font-bold text-amber-800 uppercase mt-2">At least 7 days before event.</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2.5rem]">
                <Edit3 className="text-rose-500 mb-4 mx-auto" size={32} />
                <h4 className="text-lg font-black uppercase italic text-rose-900">Edit Limits</h4>
                <p className="text-[10px] font-bold text-rose-800 uppercase mt-2">2 Free. Max 5. Details only.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
                <ShieldAlert className="text-slate-900 mb-4 mx-auto" size={32} />
                <h4 className="text-lg font-black uppercase italic text-slate-900">Auto-Expiry</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Deleted 48hrs after event.</p>
            </div>
        </div>
      </section>

      {/* 5. COMPUTATION (Uniform & Professional) */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
              <Calculator className="text-rose-500" size={32} />
              <h2 className="text-3xl font-black uppercase italic">Computation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Same Month */}
            <div className="p-8 bg-[#FFFDF8] rounded-[2.5rem] border border-slate-100 flex flex-col h-full shadow-sm">
                <span className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-md uppercase tracking-widest mb-4">Case 01</span>
                <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase">Event in current month</p>
                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between text-[11px] font-black uppercase"><span>Base Fee</span><span>₱50.00</span></div>
                    <div className="flex justify-between text-[11px] font-black uppercase"><span>Extensions</span><span>₱0.00</span></div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-black text-rose-500 uppercase italic"><span>Total</span><span>₱50.00</span></div>
                </div>
            </div>
            {/* Advance */}
            <div className="p-8 bg-[#FFFDF8] rounded-[2.5rem] border border-slate-100 flex flex-col h-full shadow-sm">
                <span className="text-[10px] font-black bg-amber-500 text-white px-3 py-1 rounded-md uppercase tracking-widest mb-4">Case 02</span>
                <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase">Event in 2 months</p>
                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between text-[11px] font-black uppercase"><span>Base Fee</span><span>₱50.00</span></div>
                    <div className="flex justify-between text-[11px] font-black uppercase text-amber-600"><span>Ext (₱20 x 2)</span><span>₱40.00</span></div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-black text-rose-500 uppercase italic"><span>Total</span><span>₱90.00</span></div>
                </div>
            </div>
            {/* Revisions */}
            <div className="p-8 bg-[#FFFDF8] rounded-[2.5rem] border border-slate-100 flex flex-col h-full shadow-sm">
                <span className="text-[10px] font-black bg-indigo-500 text-white px-3 py-1 rounded-md uppercase tracking-widest mb-4">Case 03</span>
                <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase">Exceeded free edits</p>
                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between text-[11px] font-black uppercase"><span>2 Free Edits</span><span>FREE</span></div>
                    <div className="flex justify-between text-[11px] font-black uppercase text-indigo-600"><span>3rd Revision</span><span>₱35.00</span></div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-black text-rose-500 uppercase italic"><span>Total</span><span>₱35.00</span></div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUESTIONS */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12 justify-center"><HelpCircle className="text-rose-500" size={32} /><h2 className="text-3xl font-black uppercase italic leading-none">Questions</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 text-center md:text-left">
          {[
            { q: "Why the 1-week rule?", a: "To ensure system stability and give you enough time to your guests to view the link." },
            { q: "Can I edit design?", a: "No. Design is locked on publish. Details can be edited max 5 times (2 free, 3 paid)." },
            { q: "What is extension fee?", a: "A ₱20 fee per month if your event is scheduled for the coming months." },
            { q: "Is payment secure?", a: "Yes. All payments are handled securely via PayMongo (GCash, Maya, etc)." }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-sm font-black uppercase italic text-slate-800">{item.q}</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed uppercase">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}