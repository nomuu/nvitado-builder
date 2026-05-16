"use client";
import React, { useState, useEffect } from 'react';
import { PartyPopper, Hourglass, CheckCircle2 } from 'lucide-react';

export default function GracePeriodCountdown({ expirationTime, title }: { expirationTime: string; title: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(expirationTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        window.location.reload(); 
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expirationTime]);

  if (!isClient) return null;

  return (
    // 👁️ Glassmorphism overlay: Kita pa rin ang invitation sa likod pero blurred at hindi maki-click
    <div className="fixed inset-0 z-[99999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden select-none pointer-events-auto">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] text-center border-t-[12px] border-amber-500 animate-in zoom-in-95 duration-300">
        
        {/* ICON BANNER */}
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
          <PartyPopper className="text-amber-600 animate-bounce" size={44} />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow">
            <CheckCircle2 size={16} />
          </div>
        </div>

        {/* CONGRATS & THANK YOU MESSAGES */}
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Congratulations!</h2>
        <p className="text-amber-700 text-xs font-black uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full inline-block mb-4">
          {title} Was a Success!
        </p>
        
        {/* 🆕 INAYOS NA ANG TEXT: "for your event" at "deleted permanently" */}
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 px-2">
          Thank you for choosing **Nvitado** for your event! This invitation page has fulfilled its purpose and will be deleted permanently soon.
        </p>

        {/* COUNTDOWN TIMER DISPLAY */}
        <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-4 shadow-inner border border-slate-800">
          <div className="flex items-center justify-center gap-2 mb-3 text-slate-400">
            <Hourglass size={12} className="animate-spin text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Permanent Deletion In:</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col p-2 bg-slate-800 rounded-xl">
              <span className="text-2xl font-black font-mono text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Hours</span>
            </div>
            <div className="flex flex-col p-2 bg-slate-800 rounded-xl">
              <span className="text-2xl font-black font-mono text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Mins</span>
            </div>
            <div className="flex flex-col p-2 bg-slate-800 rounded-xl">
              <span className="text-2xl font-black font-mono text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-1">Secs</span>
            </div>
          </div>
        </div>

        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
          Nvitado © 2026 — All Rights Reserved
        </div>
      </div>
    </div>
  );
}