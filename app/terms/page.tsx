"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, ShieldCheck, Scale, FileText, 
  Menu, X, Clock, AlertTriangle, Trash2, Edit3, ShieldAlert, Ban, Info
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
              <Link href="mailto:hello@nvitado.com" className="text-slate-400 hover:text-slate-900 transition-colors">Support</Link>
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
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Security & Policy</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Terms of <br/>
            <span className="text-rose-500 not-italic">Service.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">Effective Date: April 8, 2026</p>
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
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  All invitations must be published at least <span className="font-bold text-slate-900">7 days (1 week)</span> prior to the event date. Nvitado reserves the right to block or reject any rush creations that fall within this period.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase mb-2 text-slate-900">Auto-Expiry Policy</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                  Your link and all guest data will be <span className="font-bold text-rose-500">permanently deleted 48 hours</span> after the event ends. Nvitado does not provide backups once data is purged.
                </p>
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: USER CONTENT & PROHIBITED CONDUCT */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Ban size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">02. Prohibited Content</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
              Nvitado reserves the right to terminate any invitation link without refund if the content includes:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-black uppercase text-slate-400">
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Fraudulent activities / Scams</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Explicit or Nudity content</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Harassment or Hate speech</li>
              <li className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-rose-500"/> Copyright infringement</li>
            </ul>
          </motion.div>

          {/* SECTION 3: REVISIONS & RESPONSIBILITY */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Edit3 size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">03. User Responsibility</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              The User is solely responsible for the accuracy of the information provided (e.g., spelling, dates, location).
            </p>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-slate-900">
                <Info size={14} />
                <span className="text-[10px] font-black uppercase">Revision Rule</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
                You are granted 2 FREE edits. Subsequent edits cost ₱5.00 each (Max 5). Visual designs and effects are locked and cannot be changed after publication.
              </p>
            </div>
          </motion.div>

          {/* SECTION 4: LIABILITY */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeInUp} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><ShieldAlert size={20}/></div>
              <h3 className="text-xl font-black uppercase italic">04. Limitation of Liability</h3>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              While we strive for 99.9% uptime, Nvitado is not liable for any service interruptions, server downtimes, or data loss due to unforeseen technical issues. We are a digital invitation tool and <span className="font-bold text-slate-900 italic">do not</span> guarantee guest attendance or external platform (Viber/Messenger) delivery success.
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
          <Link href="mailto:hello@nvitado.com" className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-rose-500 transition-colors">Support</Link>
        </div>
        <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">
          © 2026 Nvitado Digital Philippines • Crafting Moments Digitally
        </p>
      </footer>
    </div>
  );
}