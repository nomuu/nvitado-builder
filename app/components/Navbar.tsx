"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Idinagdag para sa active link state
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Terms', href: '/terms' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#FFFDF8]/80 backdrop-blur-md border-b border-slate-100/50">
      <div className="flex justify-between items-center px-6 lg:px-12 py-3 max-w-[1400px] mx-auto font-sans text-slate-900">
        <Link href="/">
          <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto cursor-pointer hover:opacity-70 transition-all" />
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 mr-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-[9px] font-black tracking-widest uppercase transition-all relative pb-1
                    ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {link.name}
                  {/* 📍 Active Indicator (Line sa ilalim) */}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500" 
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          <Link href="/create" className="text-[9px] font-black tracking-widest uppercase bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-rose-500 transition-all flex items-center gap-2 group shadow-md">
            <span className="hidden sm:inline">GET STARTED</span>
            <span className="sm:hidden">START</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4 text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  href={link.href} 
                  className={`text-[10px] font-black tracking-widest uppercase py-2
                    ${pathname === link.href ? 'text-rose-500' : 'text-slate-500'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}