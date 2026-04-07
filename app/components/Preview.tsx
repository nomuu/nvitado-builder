"use client";
import React from 'react';

export default function Preview({ config, viewMode }: any) {
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
      className={`transition-all duration-700 ease-in-out relative overflow-hidden bg-white text-slate-900 flex flex-col items-center justify-center
        ${viewMode === 'mobile' 
          ? 'w-[360px] h-[720px] rounded-[2.5rem] border-[8px] border-slate-900 shadow-2xl mx-auto my-8' 
          : 'w-full min-h-screen rounded-none border-none shadow-none' 
        }`}
      style={{ background: config.background }}
    >
      <div className="flex flex-col items-center justify-center p-8 text-center transition-all duration-700 relative z-10 w-full max-w-4xl">
        <span className="text-[10px] tracking-[0.5em] text-amber-700 uppercase mb-4 font-bold font-sans">The Celebration</span>
        
        <h2 className={`leading-tight font-light transition-all duration-700 whitespace-pre-wrap text-slate-900 mb-6 
          ${viewMode === 'mobile' ? 'text-5xl' : 'text-8xl'} 
          ${config.titleFont === 'italic' ? 'italic font-serif' : config.titleFont}`}>
          {config.title || 'Your Event Name'}
        </h2>
        
        <div className="w-12 h-[1px] bg-amber-400 mb-8 mx-auto"></div>
        
        <div className="space-y-6 w-full px-6">
          <div className={`text-center leading-relaxed max-w-2xl mx-auto text-slate-600 
            ${viewMode === 'mobile' ? 'text-[11px]' : 'text-2xl'} 
            ${config.messageFont === 'italic' ? 'italic font-serif' : config.messageFont}`}>
            {config.welcomeMessage}
          </div>

          <div className="pt-8 space-y-2">
            <p className={`${viewMode === 'mobile' ? 'text-[12px]' : 'text-2xl'} tracking-[0.2em] font-bold text-slate-700 uppercase font-sans`}>
              {formatDate(config.eventDate, config.dateFormat)}
            </p>
            {config.showTime && (
              <p className={`${viewMode === 'mobile' ? 'text-[10px]' : 'text-xl'} tracking-[0.4em] font-medium text-amber-800 uppercase font-sans`}>
                {formatTime(config.eventTime)}
              </p>
            )}
            <p className={`${viewMode === 'mobile' ? 'text-[10px]' : 'text-lg'} text-slate-400 uppercase tracking-widest font-medium pt-4 block italic font-sans`}>
                📍 {config.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}