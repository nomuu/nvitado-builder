"use client";
import React from 'react';

export default function Preview({ config, viewMode }: any) {
  const formatDate = (dateStr: string, format: string) => {
    if (!dateStr) return "SET DATE";
    const date = new Date(dateStr);
    switch (format) {
      case 'short': 
        return date.toLocaleDateString('en-GB').replace(/\//g, ' / '); 
      case 'minimal': 
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)}`;
      case 'long':
      default: 
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
    <div className={`transition-all duration-700 ease-in-out relative overflow-hidden shadow-2xl bg-white text-slate-900
        ${viewMode === 'mobile' ? 'w-[360px] h-[720px] rounded-[2.5rem] border-[8px] border-slate-900' : 'w-[90%] h-[85%] rounded-xl border-[2px] border-slate-300'}`}
      style={{ background: config.background }}
    >
      <div className="h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-700 relative z-10">
        <span className="text-[10px] tracking-[0.5em] text-amber-700 uppercase mb-4 font-bold tracking-widest font-sans">The Celebration</span>
        
        {/* TITLE STYLE */}
        <h2 className={`leading-tight font-light transition-all duration-700 whitespace-pre-wrap text-slate-900 mb-6
          ${viewMode === 'mobile' ? 'text-5xl' : 'text-8xl'}
          ${config.titleFont === 'italic' ? 'italic font-serif' : config.titleFont}`}>
          {config.title || 'Your Event Name'}
        </h2>
        
        <div className="w-12 h-[1px] bg-amber-400 mb-8"></div>
        
        <div className="space-y-6 w-full px-6">
          {/* WELCOME MESSAGE: Matik center at sumusunod sa piniling font */}
          <div className={`text-center leading-relaxed max-w-lg mx-auto text-slate-600
            ${viewMode === 'mobile' ? 'text-[11px]' : 'text-xl'}
            ${config.messageFont === 'italic' ? 'italic font-serif' : config.messageFont}`}>
            {config.welcomeMessage}
          </div>

          <div className="pt-6 space-y-1">
            <p className={`${viewMode === 'mobile' ? 'text-[12px]' : 'text-xl'} tracking-[0.2em] font-bold text-slate-700 uppercase font-sans`}>
              {formatDate(config.eventDate, config.dateFormat)}
            </p>
            {config.showTime && (
              <p className={`${viewMode === 'mobile' ? 'text-[10px]' : 'text-lg'} tracking-[0.4em] font-medium text-amber-800 uppercase font-sans`}>
                {formatTime(config.eventTime)}
              </p>
            )}
            <p className={`${viewMode === 'mobile' ? 'text-[10px]' : 'text-lg'} text-slate-400 uppercase tracking-widest font-medium pt-2 block italic font-sans`}>
                📍 {config.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}