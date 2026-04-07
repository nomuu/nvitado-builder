"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Palette, Sparkles, HeartHandshake, ArrowRight, 
  Zap, Globe, Clock, CheckCircle2
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.215, 0.610, 0.355, 1.000] }
  })
};

const AnimatedPastelBackground = () => (
  <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none bg-[#FFFDF8]">
    <motion.div
      animate={{ scale: [1, 1.15, 1], x: [0, 40, -40, 0], y: [0, -40, 40, 0], rotate: [0, 15, -15, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-[800px] h-[800px] bg-rose-200 rounded-full blur-[150px] mix-blend-multiply opacity-30 -top-48 -left-48"
    />
    <motion.div
      animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 30, 0], y: [0, 50, -50, 0], rotate: [0, -10, 10, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute w-[600px] h-[600px] bg-sky-200 rounded-full blur-[120px] mix-blend-multiply opacity-25 top-1/3 -right-32"
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, 60, -60, 0], y: [0, -60, 60, 0], rotate: [0, 20, -20, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      className="absolute w-[900px] h-[900px] bg-amber-100 rounded-full blur-[180px] mix-blend-darken opacity-30 bottom-[-100px] left-[-150px]"
    />
  </div>
);

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${poppins.className} text-slate-900 antialiased selection:bg-rose-100`}>
      <AnimatedPastelBackground />

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#FFFDF8]/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="flex justify-between items-center px-6 lg:px-12 py-4 max-w-[1400px] mx-auto relative z-10 font-sans">
          <img src="/assets/images/logo2.png" alt="Nvitado" className="h-7 w-auto" />
          <Link href="/create" className="text-[10px] font-black tracking-widest uppercase bg-slate-900 text-white px-7 py-3 rounded-full hover:bg-rose-500 transition-all flex items-center gap-2 group shadow-lg shadow-slate-200/50">
            GET STARTED
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-52 pb-32">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp} className="mb-6 bg-rose-100 text-rose-600 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 border border-rose-200 shadow-sm relative z-10">
          <Sparkles className="w-3.5 h-3.5" />
          Modern invitations for modern couples
        </motion.div>
        
        <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeInUp} className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.88] text-slate-950 mix-blend-multiply relative z-10">
          DESIGN. <br />
          PUBLISH. <br />
          <span className="text-rose-500 italic">CELEBRATE.</span>
        </motion.h1>
        
        <motion.p custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="max-w-2xl text-slate-500 text-base md:text-xl mb-12 font-medium leading-relaxed px-4 mix-blend-multiply relative z-10">
          Why wait for prints? Create a breathtaking, mobile-first wedding invitation in minutes. Secure your custom nvitado.com link instantly with our intuitive tools.
        </motion.p>
        
        {/* FIXED: relative at z-10 moved inside className */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
          <Link href="/create" className="bg-rose-500 text-white px-10 py-4.5 rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-600 transition-all flex items-center justify-center gap-3 active:scale-95 group">
            CREATE YOUR INVITATION
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* PREVIEW IMAGE SECTION */}
      <section className="px-6 lg:px-12 pb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto rounded-[3.5rem] p-3 bg-white shadow-3xl shadow-rose-100 border border-slate-50 overflow-hidden relative group"
        >
          <img src="/assets/images/builder-preview.png" alt="Nvitado Builder" className="w-full h-auto rounded-[3rem] group-hover:scale-[1.01] transition-transform duration-1000" />
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 lg:px-12 bg-white/50 border-y border-slate-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 uppercase italic">Why Digital?</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-base">Budget Friendly • Eco Friendly • Effortlessly Efficient</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Global Reach", desc: "Traditional invitations require months. Send your premium digital link instantly via Messenger, Viber, or SMS globally." },
              { icon: Zap, title: "Instant Publishing", desc: "No more long wait times or printing delays. Your breathtaking link is active the moment you're done designing." },
              { icon: Clock, title: "Unlimited Edits", desc: "Unexpected change of plans? No problem. Update your details anytime and it refreshes matik for all your guests." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="p-10 rounded-[2.5rem] bg-white border border-slate-100/50 space-y-5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-500">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg uppercase italic">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden bg-[#FFFDF8]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-none uppercase italic">How it <span className="text-rose-500">Works.</span></h2>
              <div className="space-y-12">
                {[
                  { step: "01", title: "Personalize", desc: "Choose your background, fonts, and details. See your changes in real-time." },
                  { step: "02", title: "Claim your URL", desc: "Select a unique nvitado.com link like juan-maria that guests can easily remember." },
                  { step: "03", title: "Go Live", desc: "Complete the secure payment and your invitation activates instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start">
                    <span className="text-4xl font-black text-rose-200 mt-[-6px]">{item.step}</span>
                    <div className="pt-1">
                      <h4 className="font-black text-lg mb-1 uppercase italic">{item.title}</h4>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full max-w-xs">
              <div className="bg-slate-900 rounded-[3rem] p-3 shadow-3xl shadow-slate-200 -rotate-2 hover:rotate-0 transition-transform duration-700 relative overflow-hidden aspect-[9/16] group">
                <img src="/assets/images/mobile-preview.png" alt="Nvitado Mobile" className="w-full h-auto object-cover rounded-[2.5rem] group-hover:scale-[1.02]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 uppercase italic leading-none">Ready to start <br/>your story?</h2>
          <Link href="/create" className="inline-flex bg-slate-900 text-white px-14 py-6 rounded-[1.8rem] font-black text-sm tracking-widest hover:bg-rose-600 transition-all shadow-xl active:scale-95 group items-center gap-4">
            CREATE NOW
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-400 tracking-widest uppercase px-4">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Instant Setup</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Premium Quality</span>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-100 text-center px-6 bg-white relative z-10">
        <img src="/assets/images/logo2.png" alt="Nvitado" className="h-6 w-auto mx-auto mb-8 opacity-30 grayscale" />
        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">© 2026 Nvitado Digital Philippines</p>
      </footer>
    </div>
  );
}