"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative mt-20 pt-24 pb-12 overflow-hidden bg-slate-50">
      {/* 📩 ENVELOPE FLAP DESIGN */}
      <div 
        className="absolute top-0 left-0 w-full h-16 bg-white shadow-sm z-10"
        style={{
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
        }}
      />
      
      {/* 🕯️ WAX SEAL EFFECT (Logo) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.1 }}
          className="relative w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(244,63,94,0.4)] border-4 border-rose-600 after:content-[''] after:absolute after:inset-1 after:border after:border-white/20 after:rounded-full"
        >
          <Link href="/">
            <img 
              src="/assets/images/logo.png" 
              alt="Nvitado" 
              className="w-8 h-8 object-contain brightness-0 invert opacity-90" 
            />
          </Link>
        </motion.div>
      </div>

      {/* 📄 CONTENT (Inside Envelope) */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center relative z-0">
        <div className="mb-10 mt-4">
           <img 
            src="/assets/images/logo2.png" 
            alt="Nvitado" 
            className="h-5 w-auto opacity-20 grayscale" 
          />
        </div>

        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-10">
          {[
            { name: 'Pricing', href: '/pricing' },
            { name: 'Terms & Conditions', href: '/terms' },
            { name: 'Support', href: '/support' }
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 hover:text-rose-500 transition-all hover:translate-y-[-2px]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* BRANDS / TAGLINE */}
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8" />

        <div className="text-center space-y-2">
          <p className="text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase italic">
            "Your journey begins with a beautiful invitation"
          </p>
          <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">
            © 2026 Nvitado Digital Philippines • Crafting Moments Digitally
          </p>
        </div>
      </div>

      {/* BACKGROUND ACCENT (Mock Envelope Lines) */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-[-1]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="100%" x2="50%" y2="0" stroke="black" strokeWidth="2" />
          <line x1="100%" y1="100%" x2="50%" y2="0" stroke="black" strokeWidth="2" />
        </svg>
      </div>
    </footer>
  );
}