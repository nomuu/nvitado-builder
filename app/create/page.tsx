"use client";
import React, { useState } from 'react'; 
import Sidebar from '../components/Sidebar';
import Preview from '../components/Preview';
import { BACKGROUNDS } from '../constants/backgrounds';
import { Edit3, Eye, Monitor, Smartphone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NvitadoEditor() {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  const [config, setConfig] = useState({
    background: '#ffffff',
    useAnimation: false,
    animationId: 'none',
    title: 'Juan & Maria',
    titleFont: 'font-serif', 
    eventDate: '2026-04-07',
    dateFormat: 'long', 
    showTime: false,
    eventTime: '15:00',
    location: 'Makati City, Metro Manila',
    welcomeMessage: 'We invite you to join us as we celebrate our love and begin our new journey together.',
    messageFont: 'font-serif',
    slug: '',
  });

  const handlePublish = async (calculatedTotal: number) => {
    if (!config.slug) return alert("Hoy Chief! Paki-set muna ang Custom URL sa Step 06.");
    setIsPublishing(true);
    const selectedBg = BACKGROUNDS.find(bg => bg.id === config.animationId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, amount: calculatedTotal, bgName: selectedBg?.name || 'Standard' }),
      });
      const data = await res.json();
      if (data.checkout_url) { window.location.href = data.checkout_url; }
      else { alert("Error: " + (data.error || "Something went wrong")); }
    } catch (err) { alert("Connection Error."); }
    finally { setIsPublishing(false); }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 relative">
      
      {/* 📍 SIDEBAR */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-[380px] max-w-[85vw] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          onPublish={handlePublish} 
          isPublishing={isPublishing} 
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      {/* 📍 MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 bg-slate-200 relative text-slate-900">
        
        {/* 📍 FIXED SWITCHER: Visible na ito sa Mobile at Desktop */}
        <div className="absolute top-4 md:top-8 flex gap-1 bg-white p-1 rounded-full shadow-xl z-30 border border-slate-100">
          <button 
            onClick={() => setViewMode('mobile')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone size={12} />
            <span className="hidden sm:inline">MOBILE</span>
          </button>
          <button 
            onClick={() => setViewMode('desktop')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Monitor size={12} />
            <span className="hidden sm:inline">DESKTOP</span>
          </button>
        </div>

        {/* 📱 MOBILE FLOATING BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="lg:hidden fixed bottom-6 right-6 z-[60] bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <Eye size={18} /> : <Edit3 size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isSidebarOpen ? 'Preview' : 'Edit'}
          </span>
        </button>

        {/* OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
            />
          )}
        </AnimatePresence>

        <Preview config={config} viewMode={viewMode} />
      </main>
    </div>
  );
}