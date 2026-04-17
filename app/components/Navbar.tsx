"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, PlusCircle, Edit3, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false); // 📍 Para sa toggle logic
  const pathname = usePathname();

  // Close menus when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsGetStartedOpen(false);
  }, [pathname]);

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
          
          {/* 📍 GET STARTED DROPDOWN - WORKS FOR BOTH DESKTOP & MOBILE */}
          <div className="relative">
            <button 
              onClick={() => setIsGetStartedOpen(!isGetStartedOpen)}
              onMouseEnter={() => setIsGetStartedOpen(true)}
              className="text-[9px] font-black tracking-widest uppercase bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-rose-500 transition-all flex items-center gap-2 shadow-md"
            >
              <span>GET STARTED</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isGetStartedOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Container */}
            <AnimatePresence>
              {isGetStartedOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseLeave={() => setIsGetStartedOpen(false)}
                  className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[110]"
                >
                  <Link href="/create" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-all border-b border-slate-50 group">
                    <PlusCircle size={18} className="text-emerald-500" />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase text-slate-900">Create Invitation</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase group-hover:text-slate-600">Start building from scratch</p>
                    </div>
                  </Link>
                  <Link href="/verify-access" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-all group">
                    <Edit3 size={18} className="text-amber-500" />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase text-slate-900">Revise Existing Invitation</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase group-hover:text-slate-600">Update your paid invite</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-2">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    href={link.href} 
                    className={`text-[10px] font-black tracking-widest uppercase py-3 border-b border-slate-50/50
                      ${pathname === link.href ? 'text-rose-500' : 'text-slate-400'}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}