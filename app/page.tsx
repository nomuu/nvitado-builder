"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// --- IMPORT SCRIPT PARA SA CHATBOX ---
import Script from 'next/script'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, 
  Zap, Globe, Clock, CheckCircle2,
  Heart, Star, PartyPopper, Cake, User,
  Users, Smartphone, Monitor
} from 'lucide-react';
import { Poppins } from 'next/font/google';
import { createClient } from '@supabase/supabase-js';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] 
    }
  })
};

// --- EMOJI COMPONENT ---
const FloatingEmoji = ({ emoji }: { emoji: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: (Math.random() * 200 - 100), scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -300, 
        x: (Math.random() * 400 - 200),
        scale: [0.5, 1.2, 0.8],
        rotate: Math.random() * 360 
      }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute text-3xl md:text-5xl select-none pointer-events-none z-50"
    >
      {emoji}
    </motion.div>
  );
};

const EventSelector = () => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [emojis, setEmojis] = useState<{id: number, char: string}[]>([]);

  useEffect(() => {
    let interval: any;
    if (hoveredEvent) {
      const activeEvent = events.find(e => e.id === hoveredEvent);
      interval = setInterval(() => {
        if (activeEvent) {
          const newEmoji = {
            id: Date.now() + Math.random(),
            char: activeEvent.emojis[Math.floor(Math.random() * activeEvent.emojis.length)]
          };
          setEmojis(prev => [...prev.slice(-10), newEmoji]); 
        }
      }, 200);
    } else {
      const timeout = setTimeout(() => setEmojis([]), 1000);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [hoveredEvent]);

  const events = [
    { id: 'wedding', name: 'Wedding', icon: <Heart size={20}/>, color: 'bg-rose-500', emojis: ['💍', '👰', '🤵', '💖', '✨'] },
    { id: 'birthday', name: 'Birthday', icon: <Cake size={20}/>, color: 'bg-amber-500', emojis: ['🎂', '🎈', '🎉', '🎁', '🕯️'] },
    { id: 'achievement', name: 'Success', icon: <User size={20}/>, color: 'bg-emerald-500', emojis: ['🎓', '📜', '🏆', '🎖️', '👏'] },
    { id: 'party', name: 'Party', icon: <PartyPopper size={20}/>, color: 'bg-indigo-500', emojis: ['🥳', '🍺', '🎶', '🕺', '🍕'] },
    { id: 'baptism', name: 'Baptism', icon: <Star size={20}/>, color: 'bg-sky-500', emojis: ['👶', '⛪', '🕊️', '☁️', '👼'] },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-6 flex flex-col items-center z-40">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
        {emojis.map((e) => (
          <FloatingEmoji key={e.id} emoji={e.char} />
        ))}
      </div>
      <p className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-400 mb-6">What are we celebrating?</p>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {events.map((event, i) => (
          <motion.div key={event.id} custom={i + 3} initial="hidden" animate="visible" variants={fadeInUp}>
            <Link href="/create" 
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
              className="group relative flex flex-col items-center gap-2"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${event.color} text-white flex items-center justify-center shadow-lg transition-all group-hover:ring-4 ring-white/50`}
              >
                {event.icon}
              </motion.div>
              <span className="text-[8px] font-black tracking-widest uppercase text-slate-500 group-hover:text-slate-900 transition-colors">
                {event.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DevicePreviewSlider = () => {
  const [index, setIndex] = useState(0);
  const slides = [
    { id: 'desktop', title: 'Desktop Builder', icon: <Monitor size={14}/>, img: '/assets/images/desktop-builder.png' },
    { id: 'mobile', title: 'Mobile Builder', icon: <Smartphone size={14}/>, img: '/assets/images/mobile-builder.png' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-6 pb-24 relative z-10 max-w-6xl mx-auto">
      <div className="flex justify-center gap-4 mb-8">
        {slides.map((slide, i) => (
          <button 
            key={slide.id}
            onClick={() => setIndex(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-sm
              ${index === i ? 'bg-slate-900 text-white scale-105 shadow-xl' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          >
            {slide.icon} {slide.title}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-50 p-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <img src={slides[index].img} alt={slides[index].title} className="w-full h-auto rounded-[2rem] block" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const AnimatedPastelBackground = () => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none bg-[#FFFDF8]">
    <motion.div
      animate={{ scale: [1, 1.1, 1], x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[600px] h-[600px] bg-rose-100 rounded-full blur-[120px] mix-blend-multiply opacity-40 -top-24 -left-24"
    />
    <motion.div
      animate={{ scale: [1.1, 1, 1.1], x: [0, -20, 20, 0], y: [0, 30, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute w-[500px] h-[500px] bg-sky-100 rounded-full blur-[100px] mix-blend-multiply opacity-30 top-1/4 -right-24"
    />
  </div>
);

// --- 💯 FIXED FULL-SCREEN COMBINED COMMUNITY STATS & SINGLE CARD AUTO-SCROLL REVIEW SECTION ---
const StatsSection = () => {
  const [count, setCount] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviewCount, setTotalReviewCount] = useState<number>(0);
  
  // State para sa single dynamic text slider index rotation
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    const fetchStatsAndReviews = async () => {
      // 1. Kunin ang kabuuang bilang ng invitations para sa kaliwang bahagi
      const { count: total, error: countError } = await supabase
        .from('invitations')
        .select('*', { count: 'exact', head: true });
      if (!countError) setCount(total);

      // 2. Kunin ang total number of reviews para sa kanang bahagi summary status
      const { count: revCount, error: revCountError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      if (!revCountError && revCount) setTotalReviewCount(revCount);

      // 3. Kunin ang mga reviews (4 at 5 stars)
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*')
        .gte('stars', 4)
        .order('created_at', { ascending: false });
      if (!reviewError && reviewData) setReviews(reviewData);
    };

    fetchStatsAndReviews();
  }, []);

  // 🕒 INTERVAL TIMER: Bawat 4 na segundo ay kusa itong magpapalit ng nadididisplay na review text (fade out / fade in)
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews]);

  return (
    // 🆕 GINAWANG ISANG BUONG SCREEN (min-h-screen) AT HIGHLIGHT BANNER LAYOUT
    <section className="min-h-screen w-full flex items-center justify-center px-6 py-20 relative z-10 max-w-6xl mx-auto select-none">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* 1. KALIWANG BAHAGI: TOTAL INVITATIONS (Naka-animate) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center md:text-left space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-slate-900 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-md">
            <Users size={12} /> The Nvitado Community
          </div>
          <h3 className="text-7xl md:text-9xl font-black tracking-tighter leading-none text-slate-950 font-sans">
            {count !== null ? count.toLocaleString() : '--'}
          </h3>
          <p className="text-slate-500 font-medium text-sm md:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
            Beautiful digital invitations have been crafted, published, and shared globally. Join the modern way of celebrating your special milestones.
          </p>
        </motion.div>

        {/* 2. KANANG BAHAGI: OVERALL STARS & SINGLE CARD FADE AUTO-SCROLL */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center md:items-start justify-center space-y-6 w-full"
        >
          <div className="space-y-2 text-center md:text-left w-full">
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Overall Rating</p>
            
            {/* Static 5 Gold Stars Summary */}
            <div className="flex justify-center md:justify-start gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={26} className="fill-amber-500 text-amber-500" />
              ))}
            </div>

            <p className="text-slate-950 text-sm font-black uppercase tracking-tight">
              5.0 Stars based on {totalReviewCount > 0 ? totalReviewCount.toLocaleString() : '--'} reviews
            </p>
          </div>

          {/* 🚀 SINGLE PREMIUM CARD FOR REVIEW (PA ISA-ISA LANG ANG LABAS NAKA-FADE) */}
          <div className="w-full max-w-md h-[180px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {reviews.length > 0 && (
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex gap-0.5 text-amber-500">
                      {Array.from({ length: reviews[currentReviewIndex].stars }).map((_, sIdx) => (
                        <Star key={sIdx} size={12} className="fill-amber-500" />
                      ))}
                    </div>
                    {/* Comment Area */}
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed italic line-clamp-3">
                      "{reviews[currentReviewIndex].review}"
                    </p>
                  </div>

                  {/* Anonymous Footer & No Live Link Button */}
                  <div className="border-t border-slate-50 pt-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Anonymous User</p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Verified Host</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${poppins.className} text-slate-900 antialiased selection:bg-rose-100`}>
      
      {/* --- TUQLAS CHATBOX SCRIPT --- */}
      <Script
        src="https://www.tuqlas.com/chatbot.js"
        data-key="tq_live_f10996193f9a0d0166bd410424adfe8ca4bfa9bc"
        data-api="https://www.tuqlas.com"
        strategy="afterInteractive"
      />

      <AnimatedPastelBackground />

      {/* 2. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-16">
        <motion.div 
          custom={0} initial="hidden" animate="visible" variants={fadeInUp} 
          className="mb-5 bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase flex items-center gap-2 border border-rose-100 relative z-10"
        >
          <Sparkles className="w-3 h-3" />
          Modern invitations for every occasion
        </motion.div>
        
        <motion.h1 
          custom={1} initial="hidden" animate="visible" variants={fadeInUp} 
          className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] text-slate-950 mix-blend-multiply relative z-10"
        >
          DESIGN. <br />
          PUBLISH. <br />
          <span className="text-rose-500 italic uppercase">Celebrate.</span>
        </motion.h1>
        
        <motion.p 
          custom={2} initial="hidden" animate="visible" variants={fadeInUp} 
          className="max-w-xl text-slate-500 text-sm md:text-base mb-8 font-medium leading-relaxed px-4 relative z-10"
        >
          Create breathtaking digital invitations in minutes. Secure your custom nvitado.com link instantly with our intuitive builder.
        </motion.p>
        
        <EventSelector />
      </section>

      <DevicePreviewSlider />

      <section className="py-24 px-6 bg-white/50 border-y border-slate-100/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 uppercase italic">Why Digital?</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Budget Friendly • Eco Friendly • Instant</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Global Reach", desc: "Send your premium digital link instantly via Messenger, Viber, or SMS globally." },
              { icon: Zap, title: "Instant Publishing", desc: "No more long wait times. Your link is active the moment you're done designing." },
              { icon: Clock, title: "Controlled Edits", desc: "Get 2 free revisions per invite, with an option for 3 more paid edits if needed." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-8 rounded-[2rem] bg-white border border-slate-50 space-y-4 shadow-sm transition-all">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-sm uppercase italic tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative overflow-hidden bg-[#FFFDF8]/30 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-10 leading-none uppercase italic">How it <span className="text-rose-500">Works.</span></h2>
              <div className="space-y-10">
                {[
                  { step: "01", title: "Personalize", desc: "Choose your background, fonts, and details. See your changes in real-time." },
                  { step: "02", title: "Claim your URL", desc: "Select a unique nvitado.com link like juan-maria that guests can remember." },
                  { step: "03", title: "Go Live", desc: "Complete the secure payment and your invitation activates instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-3xl font-black text-rose-200">{item.step}</span>
                    <div>
                      <h4 className="font-black text-sm mb-1 uppercase italic">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full max-w-xs mx-auto">
              <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl -rotate-2 hover:rotate-0 transition-all duration-700 aspect-[9/16]">
                <img src="/assets/images/mobile-preview.png" alt="Nvitado Mobile" className="w-full h-full object-cover rounded-[2rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-32 px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase italic leading-none">Ready to start <br/>your story?</h2>
          <Link href="/create" className="inline-flex bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-rose-500 transition-all shadow-xl active:scale-95 group items-center gap-3">
            CREATE NOW
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-10 flex flex-wrap justify-center gap-5 text-[9px] font-black text-slate-400 tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Instant Setup</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> Premium Quality</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}