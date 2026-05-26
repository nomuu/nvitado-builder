// app/wedding/page.tsx
"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { 
  Heart, Sparkles, ArrowRight, CheckCircle2, 
  Clock, Globe, Users, MessageCircle, 
  MapPin, Shirt 
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as const // <-- IDINAGDAG ANG 'as const' PARA MAWALA ANG TYPING ERROR
    }
  })
};

const imageFloat = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function WeddingLandingPage() {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  return (
    <div className="text-slate-900 selection:bg-rose-100 relative overflow-x-hidden">
      
      {/* 🌸 BACKGROUND AESTHETICS */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[140px] -top-40 -left-20" />
        <div className="absolute w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[120px] top-1/3 -right-20" />
      </div>

      {/* 💍 HERO SECTION: 2-COLUMN LAYOUT */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: TEXT CONTENT & ACTION BUTTONS */}
        <div className="text-left flex flex-col items-start space-y-6">
          <motion.div 
            custom={0} initial="hidden" animate="visible" variants={fadeInUp}
            className="bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase flex items-center gap-2 border border-rose-100"
          >
            <Heart className="w-3 h-3 fill-rose-500" />
            The Premium Digital Wedding Invitation Experience
          </motion.div>

          <motion.h1 
            custom={1} initial="hidden" animate="visible" variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-slate-950 uppercase italic"
          >
            Say I Do To <br />
            <span className="text-rose-500 not-italic font-black">Modern</span> Invites.
          </motion.h1>

          <motion.p 
            custom={2} initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-xl text-slate-500 text-sm md:text-base font-medium leading-relaxed"
          >
            Create a breathtaking, interactive digital space for your wedding. Share your love story, motif guidelines, interactive maps, and instantly track RSVP from your guests worldwide.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp} className="pt-4">
            {/* 🎯 PRIMARY CTA BUTTON UPDATED */}
            <Link href="/wedding/templates" className="inline-flex bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-rose-500 transition-all shadow-xl active:scale-95 group items-center gap-3">
              VIEW OUR TEMPLATES
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: LARGE ROUND RADIAL MASK CONTAINER */}
        <div className="w-full flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[640px] aspect-square flex items-center justify-center overflow-hidden rounded-full">
            
            <motion.div 
              animate={imageFloat.animate}
              className="w-full h-full relative z-10 flex items-center justify-center"
            >
              {/* LARGE RADIAL MASK BOUNDARY */}
              <img 
                src="/assets/images/wedding/image1.webp" 
                alt="Premium 3D Wedding Graphic Illustration" 
                className="w-full h-full object-cover scale-[1.15]" 
                style={{
                  WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 72%)',
                  maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 72%)'
                }}
              />
            </motion.div>
          </div>
        </div>

      </header>

      {/* ✨ WEDDING SPECIFIC CORE FEATURES */}
      <section ref={featuresRef} className="py-24 px-6 bg-white border-y border-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em]">Designed for your Big Day</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Everything a Modern Couple Needs</h2>
            <div className="w-12 h-[2px] bg-rose-500 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global RSVP Tracking", desc: "No more messy lists. Guests can view, confirm attendance, and specify details in one smooth click instantly from anywhere." },
              { icon: Shirt, title: "Visual Attire Motif Guide", desc: "Showcase your wedding color palette blocks, dress codes, and visual instructions cleanly so everyone looks perfect in photos." },
              { icon: MapPin, title: "One-Tap Venue Directions", desc: "Embed your reception or church exact coordinates. Guests get real-time Google Maps directions straight from their devices." },
              { icon: Clock, title: "Live Countdown Timer", desc: "Build excitement with a beautiful minimalist ticking clock calculating every second down to your specific ceremony schedule." },
              { icon: MessageCircle, title: "Interactive FAQ Section", desc: "Answer common questions about registry, accommodations, kids, parking, and protocols cleanly without getting repetitive inquiries." },
              { icon: Sparkles, title: "Custom Premium URL", desc: "Claim a gorgeous dedicated link name like wedding.nvitado.com/juan-maria that matches your prenup branding beautifully." }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] bg-[#FFFDF9] border border-slate-100 hover:border-rose-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-sm uppercase italic tracking-tight text-slate-900">{feat.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 💸 WEDDING TRUST INLINE SUMMARY BANNER */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic leading-none">
          Zero stress. <br />More time to <span className="text-rose-500">Celebrate.</span>
        </h2>
        <p className="text-slate-500 font-medium text-xs md:text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Ditch the paper prints, production latency, and expensive shipping fees. Build your dynamic digital platform with full autonomy today.
        </p>

        {/* 🎯 LOWER BANNER BUTTON UPDATED */}
        <Link href="/wedding/templates" className="inline-flex bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-rose-500 transition-all shadow-xl active:scale-95 items-center gap-3">
          VIEW OUR TEMPLATES
        </Link>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-[9px] font-black text-slate-400 tracking-widest uppercase">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Activation</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 2 Free Revisions Included</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Responsive Layouts</span>
        </div>
      </section>

      <footer className="w-full border-t border-slate-100 py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        © {new Date().getFullYear()} Nvitado Weddings • Beautiful Digital Celebrations
      </footer>

    </div>
  );
}