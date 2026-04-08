"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ShieldCheck, Scale, FileText, 
  Menu, X, Clock, AlertTriangle, Trash2, Edit3, ShieldAlert, Ban, Info,
  Coins, CreditCard
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${poppins.className} bg-[#FFFDF8] text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#FFFDF8]/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="flex justify-between items-center px-6 lg:px-12 py-3 max-w-[1400px] mx-auto font-sans">
          <Link href="/">
            <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto cursor-pointer hover:opacity-70 transition-all" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-8 mr-4 text-[9px] font-black tracking-widest uppercase">
              <Link href="/pricing" className="text-slate-400 hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/terms" className="text-slate-900 border-b-2 border-rose-500 pb-1">Terms</Link>
              <Link href="/support" className="text-slate-400 hover:text-slate-900 transition-colors">Support</Link>
            </div>
            <Link href="/create" className="text-[9px] font-black tracking-widest uppercase bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-rose-500 transition-all flex items-center gap-2 group shadow-md">
              <span>GET STARTED</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-900">
              {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-b border-slate-100 overflow-hidden text-[10px] font-black tracking-widest uppercase">
              <div className="flex flex-col p-6 gap-4 text-center">
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/pricing" className="text-slate-500 py-2">Pricing</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/terms" className="text-slate-900 py-2">Terms & Conditions</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="mailto:hello@nvitado.com" className="text-slate-500 py-2">Support</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

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

          {/* SECTION 2: REFUND POLICY (NEWLY ADDED) */}
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

      {/* 4. FOOTER */}
      <footer className="py-16 border-t border-slate-100 text-center px-6 bg-white flex flex-col items-center">
        <Link href="/">
          <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto mb-8 opacity-40 grayscale hover:opacity-100 transition-all cursor-pointer" />
        </Link>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          <Link href="/pricing" className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-rose-500 transition-colors">Pricing</Link>
          <Link href="/terms" className="text-[10px] font-black tracking-widest uppercase text-slate-900 transition-colors">Terms & Conditions</Link>
          <Link href="/support" className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-rose-500 transition-colors">Support</Link>
        </div>
        <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">
          © 2026 Nvitado Digital Philippines • Crafting Moments Digitally
        </p>
      </footer>
    </div>
  );
}