"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BACKGROUNDS } from '../constants/backgrounds';

export default function Preview({ config, viewMode }: any) {
  const activeBg = BACKGROUNDS.find(b => b.id === config.animationId) || BACKGROUNDS[0];

  // 📍 FIXED: DATE FORMATTING LOGIC BASED ON SIDEBAR SELECTION
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

  return (
    <div 
      className={`transition-all duration-700 ease-in-out relative overflow-hidden flex flex-col items-center justify-center bg-white text-slate-900
        ${viewMode === 'mobile' 
          ? 'w-[360px] h-[720px] rounded-[2.5rem] border-[10px] border-slate-900 shadow-2xl mx-auto my-8' 
          : 'w-full min-h-screen rounded-none border-none shadow-none' 
        }`}
      style={{ background: config.background }}
    >
      {/* ANIMATIONS LOGIC */}
      {activeBg.type === 'blob' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {activeBg.colors?.map((color, i) => (
            <motion.div
              key={i} className="absolute rounded-full blur-[80px] opacity-30"
              style={{ background: color, width: i === 0 ? '450px' : '350px', height: i === 0 ? '450px' : '350px', top: i === 0 ? '-15%' : '55%', left: i === 1 ? '-25%' : '45%' }}
              animate={{ x: [0, 60, -60, 0], y: [0, 90, -90, 0], scale: [1, 1.2, 0.8, 1] }}
              transition={{ duration: 15 + (i * 5), repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {activeBg.type === 'particle' && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i} className="absolute text-2xl select-none"
              initial={{ top: "110%", left: `${Math.random() * 100}%`, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
              animate={{ top: "-10%", opacity: [0, 1, 1, 0], rotate: [0, 360], x: [0, (Math.random() - 0.5) * 150] }}
              transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, delay: Math.random() * 8, ease: "linear" }}
            >
              {activeBg.icon}
            </motion.div>
          ))}
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="flex flex-col items-center justify-center p-10 text-center relative z-10 w-full max-w-4xl">
        <span className="text-[10px] tracking-[0.5em] text-amber-700 uppercase mb-4 font-black font-sans">The Celebration</span>
        
        <h2 className={`leading-tight transition-all duration-700 whitespace-pre-wrap text-slate-900 mb-6 font-light
          ${viewMode === 'mobile' ? 'text-5xl px-4' : 'text-8xl px-12'} 
          ${config.titleFont === 'italic' ? 'italic font-serif' : config.titleFont}`}>
          {config.title || 'Your Event Name'}
        </h2>
        
        <div className="w-16 h-[1.5px] bg-amber-400 mb-8 mx-auto opacity-50"></div>
        
        <div className="space-y-6 w-full px-6">
          <div className={`text-center leading-relaxed max-w-2xl mx-auto text-slate-600 font-medium
            ${viewMode === 'mobile' ? 'text-[12px]' : 'text-2xl'} 
            ${config.messageFont === 'italic' ? 'italic font-serif' : config.messageFont}`}>
            {config.welcomeMessage}
          </div>

          <div className="pt-8 space-y-4">
            <p className={`${viewMode === 'mobile' ? 'text-[14px]' : 'text-3xl'} tracking-[0.2em] font-black text-slate-800 uppercase font-sans`}>
              {formatDate(config.eventDate, config.dateFormat)}
            </p>
            
            {config.showTime && (
              <p className={`${viewMode === 'mobile' ? 'text-[12px]' : 'text-2xl'} tracking-[0.4em] font-medium text-amber-800 uppercase font-sans mt-[-10px]`}>
                {formatTime(config.eventTime)}
              </p>
            )}

            <p className={`${viewMode === 'mobile' ? 'text-[10px]' : 'text-lg'} text-slate-400 uppercase tracking-[0.3em] font-black pt-4 block font-sans`}>
                📍 {config.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}