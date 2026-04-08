"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Menu, X, Clock, AlertTriangle, 
  LifeBuoy, MessageSquare, Bot, Zap, ShieldCheck 
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

export default function SupportPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen ${poppins.className} bg-[#FFFDF8] text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* 1. NAVIGATION (Consistent & Fixed Links) */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#FFFDF8]/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="flex justify-between items-center px-6 lg:px-12 py-3 max-w-[1400px] mx-auto font-sans">
          <Link href="/">
            <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto cursor-pointer hover:opacity-70 transition-all" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-8 mr-4 text-[9px] font-black tracking-widest uppercase">
              <Link href="/pricing" className="text-slate-400 hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/terms" className="text-slate-400 hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/support" className="text-slate-900 border-b-2 border-rose-500 pb-1">Support</Link>
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
      </nav>

      {/* 2. HERO */}
      <section className="pt-48 pb-16 px-6 text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-full mb-6 border border-rose-100 shadow-sm">
            <Bot size={12} fill="currentColor" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">AI Assistant Ready</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Get Support <br/>
            <span className="text-rose-500 not-italic">Instantly.</span>
          </h1>
        </motion.div>
      </section>

      {/* 3. CHATBOT REDIRECT CARD */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp} className="bg-slate-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <MessageSquare className="text-rose-500 mx-auto mb-6" size={48} />
              <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-4">Click the Chat bubble</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed max-w-sm mx-auto mb-10">
                Our AI Assistant "Nvi" is located at the bottom right corner of your screen. 
                Whether it's about refunds, technical bugs, or extensions—we've got you covered.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
                <div className="flex flex-col items-center">
                  <Zap size={18} className="text-rose-500 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Instant</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck size={18} className="text-emerald-500 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Encrypted</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock size={18} className="text-amber-500 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest">24/7 Live</span>
                </div>
                <div className="flex flex-col items-center">
                  <LifeBuoy size={18} className="text-indigo-500 mb-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Human Handoff</span>
                </div>
              </div>
            </div>
            
            {/* Glow Accent */}
            <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-rose-500/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* 4. FOOTER (Fixed Links) */}
      <footer className="py-16 border-t border-slate-100 text-center px-6 bg-white flex flex-col items-center">
        <Link href="/">
          <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto mb-8 opacity-40 grayscale" />
        </Link>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
          <Link href="/pricing" className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-rose-500 transition-colors">Pricing</Link>
          <Link href="/terms" className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-rose-500 transition-colors">Terms & Conditions</Link>
          <Link href="/support" className="text-[10px] font-black tracking-widest uppercase text-slate-900 transition-colors">Support</Link>
        </div>
        <p className="text-[9px] font-black text-slate-300 tracking-widest uppercase">© 2026 Nvitado Digital Philippines</p>
      </footer>
    </div>
  );
}