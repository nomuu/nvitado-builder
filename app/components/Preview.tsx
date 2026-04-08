"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BACKGROUNDS } from '../constants/backgrounds';
import { MapPin } from 'lucide-react';

export default function Preview({ config, viewMode }: any) {
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

  const mapsUrl = `http://googleusercontent.com/maps.google.com/q=${encodeURIComponent(config.location)}`;

  return (
    <div 
      className={`transition-all duration-700 ease-in-out relative overflow-hidden flex flex-col items-center bg-white text-slate-900 shadow-2xl
        ${viewMode === 'mobile' 
          ? 'w-[360px] h-[720px] rounded-[2.5rem] border-[10px] border-slate-900 mx-auto my-8' 
          : 'w-full h-full min-h-screen rounded-none border-none' 
        }`}
      style={{ background: config.background }}
    >
      
      {/* 🎨 BACKGROUND ANIMATIONS */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
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

        {activeBg.type === 'particle' && [...Array(15)].map((_, i) => (
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

      {/* 📜 SCROLL ENGINE */}
      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col">
        <div className={`flex flex-col items-center w-full my-auto py-24 px-6 md:px-10 text-center min-h-min`}>
          
          <span className="text-[10px] tracking-[0.5em] text-amber-700 uppercase mb-4 font-black shrink-0">
            The Celebration
          </span>
          
          <h2 className={`leading-tight transition-all duration-700 whitespace-pre-wrap text-slate-900 mb-6 font-light shrink-0
            ${viewMode === 'mobile' ? 'text-4xl px-2' : 'text-7xl lg:text-9xl px-12'} 
            ${config.titleFont === 'italic' ? 'italic font-serif' : config.titleFont}`}>
            {config.title || 'Your Event Name'}
          </h2>
          
          <div className="w-16 h-[1.5px] bg-amber-400 mb-8 mx-auto opacity-50 shrink-0"></div>
          
          <div className="space-y-6 w-full max-w-4xl">
            <div className={`text-center leading-relaxed whitespace-pre-wrap text-slate-600 font-medium
              ${viewMode === 'mobile' ? 'text-[13px]' : 'text-2xl'} 
              ${config.messageFont === 'italic' ? 'italic font-serif' : config.messageFont}`}>
              {config.welcomeMessage}
            </div>

            <div className="pt-12 space-y-4 flex flex-col items-center shrink-0">
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

          <div className="h-24 shrink-0"></div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}