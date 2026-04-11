"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Clock, LifeBuoy, MessageSquare, Bot, Zap, ShieldCheck, ChevronRight
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
  // 📍 TANGGAL NA ANG NAVBAR AT FOOTER DITO DAHIL NASA LAYOUT.TSX NA ITO.
  // Isang edit na lang sa shared components, updated na lahat ng pages.

  return (
    <div className={`min-h-screen ${poppins.className} bg-[#FFFDF8] text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* 2. HERO SECTION */}
      <section className="pt-48 pb-24 px-6 text-center overflow-hidden relative">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-2 rounded-full mb-8 border border-rose-100 shadow-sm">
            <Bot size={12} fill="currentColor" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">AI Assistant Integrated</span>
          </div>
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
            Help is <br/>
            <span className="text-rose-500 not-italic">One Chat</span> Away.
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
            Our AI assistant "Nvitabot" handles everything from tech support 24/7.
          </p>
        </motion.div>
        
        {/* Subtle Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-50/50 via-transparent to-transparent -z-10" />
      </section>

      {/* 3. SUPPORT FEATURES GRID (Clean & Minimalist) */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="text-rose-500" />, title: "Instant Access", desc: "No wait times. Nvi answers in milliseconds." },
              { icon: <ShieldCheck className="text-emerald-500" />, title: "Secure Transactions", desc: "Encrypted handling of payment reference IDs." },
              { icon: <Clock className="text-amber-500" />, title: "24/7 Availability", desc: "Get help even at 3:00 AM for your rush events." },
              { icon: <LifeBuoy className="text-indigo-500" />, title: "Human Handoff", desc: "Nvi can escalate to our team if needed." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                custom={i + 1}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-[#FFFDF8] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-50">
                  {item.icon}
                </div>
                <h4 className="text-sm font-black uppercase italic mb-2 tracking-tight">{item.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 4. CHAT INSTRUCTION (Simplified) */}
          <motion.div 
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-16 text-center space-y-8"
          >
            <div className="h-px w-24 bg-slate-100 mx-auto" />
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic flex items-center justify-center gap-3 text-slate-900">
                <MessageSquare className="text-rose-500" fill="currentColor" size={24} />
                Find the Bubble
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase max-w-md mx-auto leading-relaxed">
                Check the bottom right corner of this screen. 
                Click the chat icon to start a conversation with our support system.
              </p>
            </div>
            
            <div className="inline-flex flex-wrap justify-center gap-4">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest">System Online</span>
              </div>
              <Link href="/pricing" className="bg-white border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors">
                 <span className="text-[9px] font-black uppercase tracking-widest">Check Pricing</span>
                 <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}