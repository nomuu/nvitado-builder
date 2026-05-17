"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKGROUNDS } from '../constants/backgrounds';
import { 
  MapPin, Home, MessageCircleQuestion, BookHeart, 
  Star, Heart, PartyPopper, Cake, Info 
} from 'lucide-react';

// 📍 Icon mapping para sa dynamic rendering
const ICON_MAP: any = {
  BookHeart, Heart, Star, PartyPopper, Cake, Info
};

export default function Preview({ config, viewMode, activeTab, isSidebarOpen = false }: any) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeTab === 'general') {
      setActiveSection('home');
    } else if (activeTab === 'qa' && config.showQA) {
      setActiveSection('qa');
    } else if (activeTab === 'story' && config.showStory) {
      setActiveSection('story');
    }
  }, [activeTab, config.showQA, config.showStory]);

  useEffect(() => {
    if (activeSection === 'qa' && !config.showQA) {
      setActiveSection('home');
    }
    if (activeSection === 'story' && !config.showStory) {
      setActiveSection('home');
    }
  }, [config.showQA, config.showStory, activeSection]);

  const activeBg = BACKGROUNDS.find(b => b.id === config.animationId) || BACKGROUNDS[0];

  const formatDate = (dateStr: string, format: string) => {
    if (!dateStr) return "SET DATE";
    const date = new Date(dateStr);
    switch (format) {
      case 'short': return date.toLocaleDateString('en-GB').replace(/\//g, ' / '); 
      case 'minimal': return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
      default: return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    return `${hh}:${minutes} ${ampm}`;
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.location)}`;

  // 🔒 SECURITY CHECK: Lalabas lang kapag enabled, at mawawala kapag isSidebarOpen === true (Naka-click ang Edit)
  const shouldShowNavbar = (config.showQA || config.showStory) && !isSidebarOpen;

  // 📍 Dynamic Icon para sa Navbar Button
  const CustomIcon = ICON_MAP[config.customIcon] || ICON_MAP['BookHeart'];

  // I-verify kung 'banner' o 'frame' ang style rule
  const isBannerStyle = config.featuredImage && config.imageStyle === 'banner';
  const isFrameStyle = config.featuredImage && (!config.imageStyle || config.imageStyle === 'frame');

  return (
    <div 
      className={`transition-all duration-700 ease-in-out relative overflow-hidden flex flex-col items-center bg-white text-slate-900 shadow-2xl
        ${viewMode === 'mobile' 
          ? 'w-[360px] h-[720px] rounded-[2.5rem] border-[10px] border-slate-900 mx-auto my-8' 
          : 'w-full h-full min-h-screen rounded-none border-none' 
        }`}
      style={{ background: config.background }}
    >
      
      {/* 📍 01. DYNAMIC FULL SCREEN BLURRED BACKGROUND */}
      <AnimatePresence>
        {config.featuredImage && activeSection === 'home' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img 
              src={config.featuredImage} 
              className="w-full h-full object-cover blur-[10px] scale-110" 
              alt="Blurred Background" 
            />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[20px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📍 02. BACKGROUND EFFECTS LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* BLOBS LOOP LAYER */}
        {activeBg.type === 'blob' && activeBg.colors?.map((color: string, i: number) => (
          <motion.div
            key={i} className="absolute rounded-full blur-[80px] opacity-30"
            style={{ 
              background: color, 
              width: i === 0 ? '600px' : '400px', 
              height: i === 0 ? '600px' : '400px', 
              top: i === 0 ? '-10%' : '50%', 
              left: i === 1 ? '-20%' : '40%' 
            }}
            animate={{ x: [0, 40, -40, 0], y: [0, 60, -60, 0], scale: [1, 1.1, 0.9, 1] }}
            transition={{ duration: 12 + (i * 4), repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* CONTROLLED BLOB EMOJI ACCESS TRIGGER */}
        {isMounted && activeBg.type === 'blob' && activeBg.icon && [...Array(6)].map((_, i) => (
          <motion.div
            key={`blob-icon-${i}`} className="absolute text-xl opacity-20"
            initial={{ top: `${Math.random() * 80 + 10}%`, left: `${Math.random() * 80 + 10}%`, scale: 0.8 }}
            animate={{ 
              x: [0, Math.random() * 30 - 15, Math.random() * -30 + 15, 0], 
              y: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
              rotate: [0, 180, 360] 
            }}
            transition={{ duration: Math.random() * 8 + 10, repeat: Infinity, ease: "easeInOut" }}
          >
            {activeBg.icon}
          </motion.div>
        ))}

        {/* PARTICLES FLOATING LAYER */}
        {isMounted && activeBg.type === 'particle' && [...Array(15)].map((_, i) => (
          <motion.div
            key={i} className="absolute text-2xl"
            initial={{ top: "110%", left: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{ top: "-10%", opacity: [0, 1, 1, 0], rotate: [0, 360] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
          >
            {activeBg.icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col px-6 pb-20">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative flex flex-col items-center w-full py-24 text-center min-h-[600px]"
            >
              {/* 📸 Setup A: GUMAGANA LAMANG KUNG NAKA 'FRAME STYLE' OVERLAY */}
              {isFrameStyle && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center z-0 opacity-100 pointer-events-none">
                  <div className={`bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rotate-[-3deg] border-white
                    ${viewMode === 'mobile' 
                      ? 'w-[260px] p-[10px] pb-[40px]' 
                      : 'w-[420px] p-[15px] pb-[60px]'
                    }
                  `}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-slate-100">
                      <img 
                        src={config.featuredImage} 
                        className="w-full h-full object-cover object-center" 
                        alt="Polaroid Overlay" 
                      />
                      <div className="absolute inset-0 bg-white/60" /> 
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-10 w-full flex flex-col items-center">
                <span className="text-[10px] tracking-[0.5em] text-amber-700 uppercase mb-4 font-black">
                  {config.headerTitle || 'The Celebration'}
                </span>

                {/* 📸 Setup B: INLINE BANNER COMPONENT - SAKTONG NAKAPALOB SA PAGITAN NG HEADER AT TITLE */}
                {isBannerStyle && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl my-6 rounded-2xl overflow-hidden shadow-md border border-white/20 bg-slate-100"
                  >
                    <img 
                      src={config.featuredImage} 
                      className="w-full h-auto aspect-[16/9] object-cover" 
                      alt="Event Banner" 
                    />
                  </motion.div>
                )}

                <h2 className={`leading-tight transition-all duration-700 whitespace-pre-wrap text-slate-900 mb-6 font-light
                  ${viewMode === 'mobile' ? 'text-4xl px-2' : 'text-7xl lg:text-9xl px-12'} 
                  ${config.titleFont === 'italic' ? 'italic font-serif' : config.titleFont}`}>
                  {config.title || 'Your Event Name'}
                </h2>
                <div className="w-16 h-[1.5px] bg-amber-400 mb-8 mx-auto opacity-50"></div>
                <div className="space-y-6 w-full max-w-4xl">
                  <div className={`text-center leading-relaxed whitespace-pre-wrap text-slate-600 font-medium
                    ${viewMode === 'mobile' ? 'text-[13px]' : 'text-2xl'} 
                    ${config.messageFont === 'italic' ? 'italic font-serif' : config.messageFont}`}>
                    {config.welcomeMessage}
                  </div>
                  <div className="pt-12 space-y-4 flex flex-col items-center">
                    <p className={`${viewMode === 'mobile' ? 'text-base' : 'text-4xl'} tracking-[0.2em] font-black text-slate-800 uppercase`}>
                      {formatDate(config.eventDate, config.dateFormat)}
                    </p>
                    {config.showTime && (
                      <p className={`${viewMode === 'mobile' ? 'text-sm' : 'text-2xl'} tracking-[0.4em] font-medium text-amber-800 uppercase mt-[-10px]`}>
                        {formatTime(config.eventTime)}
                      </p>
                    )}
                    <div className="pt-8 flex flex-col items-center gap-4 w-full">
                      <p className={`${viewMode === 'mobile' ? 'text-[11px] max-w-[300px]' : 'text-xl max-w-[800px]'} text-slate-400 uppercase tracking-[0.3em] font-black block text-center leading-relaxed`}>
                        📍 {config.location}
                      </p>
                      {config.location && (
                        <a 
                          href={mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-amber-700 transition-all active:scale-95 shadow-xl"
                        >
                          <MapPin size={12} />
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'story' && config.showStory && (
            <motion.div 
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full py-24 text-center max-w-lg mx-auto"
            >
              <span className="text-[10px] tracking-[0.5em] text-rose-500 uppercase mb-4 font-black">
                Featured Details
              </span>
              <h2 className="text-4xl font-serif italic text-slate-900 mb-8">
                {config.customTitle || "Our Story"}
              </h2>
              <div className="w-full bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-white/20 shadow-sm">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm italic font-serif">
                  {config.story || "Once upon a time..."}
                </p>
              </div>
            </motion.div>
          )}

          {activeSection === 'qa' && config.showQA && (
            <motion.div 
              key="qa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full py-24 text-center max-w-lg mx-auto"
            >
              <h2 className="text-4xl font-serif italic text-slate-900 mb-8">Common Questions</h2>
              <div className="w-full space-y-4">
                 {config.questions && config.questions.some((item:any) => item.q || item.a) ? (
                    config.questions.map((item: any, idx: number) => (
                      (item.q || item.a) && (
                        <div key={idx} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-left shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <p className="text-[10px] font-black uppercase text-amber-700 mb-2 leading-tight">{item.q || 'Question?'}</p>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter leading-relaxed">{item.a || 'Thinking of an answer...'}</p>
                        </div>
                      )
                    ))
                 ) : (
                    <div className="bg-white/30 backdrop-blur-sm p-10 rounded-2xl border border-dashed border-white/40">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No questions added yet.</p>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ❌ TINANGGAL ANG Z-10 POWERED BY CONTAINER MULA DITO PARA HINDI NA PAKALAT-KALAT SA SCROLL ENGINE */}
      </div>

      {/* 📍 NAV BAR NAVIGATION CONTROLS */}
      {shouldShowNavbar && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-[10] pointer-events-none no-print">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-1 p-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl pointer-events-auto shrink-0 whitespace-nowrap"
          >
            <button onClick={() => setActiveSection('home')} className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${activeSection === 'home' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}>
              <Home size={18} />
              <span className="text-[7px] font-black uppercase mt-1">Home</span>
            </button>
            {config.showQA && (
              <button onClick={() => setActiveSection('qa')} className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all animate-in fade-in zoom-in duration-300 ${activeSection === 'qa' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}>
                <MessageCircleQuestion size={18} />
                <span className="text-[7px] font-black uppercase mt-1">Q&A</span>
              </button>
            )}
            {config.showStory && (
              <button onClick={() => setActiveSection('story')} className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all animate-in fade-in zoom-in duration-300 ${activeSection === 'story' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}>
                <CustomIcon size={18} />
                <span className="text-[7px] font-black uppercase mt-1">
                  {config.iconTitle || "Custom"}
                </span>
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* 🔒 🆕 COMBINED LOGO & POWERED BY INLINE BRANDING BLOCK */}
      <div className="absolute bottom-5 right-5 z-[35] flex items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity duration-300 no-print select-none">
        <div className="text-right flex flex-col justify-center leading-none">
          <span className="text-[6px] tracking-[0.2em] uppercase font-bold text-slate-400">Powered by</span>
          <span className="text-[8px] font-black tracking-[0.1em] text-slate-500 uppercase mt-0.5">Nvitado</span>
        </div>
        <img src="/assets/images/logo.png" alt="Nvitado Logo" className="w-7 h-7 object-contain" />
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}