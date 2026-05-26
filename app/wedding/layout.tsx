// app/wedding/layout.tsx
import React from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

// 🎯 ABSOLUTE PATH ALIAS: Gagamit tayo ng '@/app/' para kahit anong gulo ng subdomain sa middleware, siguradong sapul ang CSS!
import '@/app/globals.css'; 

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

export default function WeddingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} bg-[#FFFDF9] min-h-screen antialiased`}>
      
      {/* 👑 NAVIGATION BAR: NAKAPAKO NA SA TAAS AT MAY BLUR EFFECT SA LIKOD */}
      <nav className="fixed top-0 left-0 right-0 w-full bg-[#FFFDF9]/80 backdrop-blur-md border-b border-slate-100/50 py-5 px-6 flex items-center justify-between z-50 transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LOGO & BRAND NAME */}
          <Link href="/wedding" className="flex items-center gap-2 cursor-pointer group">
            <img src="/assets/images/logo.png" alt="Nvitado Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-sm uppercase tracking-wider text-slate-900">
              Nvitado <span className="text-rose-500 font-medium">Weddings</span>
            </span>
          </Link>

          {/* 🎯 CORE NAVIGATION LINKS */}
          <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
            <Link href="/wedding" className="hover:text-rose-500 transition-colors">
              Home
            </Link>
            <Link href="/wedding/templates" className="hover:text-rose-500 transition-colors">
              Templates
            </Link>
            <Link href="/wedding/pricing" className="hover:text-rose-500 transition-colors">
              Pricing
            </Link>
          </div>

        </div>
      </nav>

      {/* Main engine workspace connector */}
      <main>{children}</main>
      
    </div>
  );
}