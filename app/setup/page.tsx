"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Cake, Star, PartyPopper, User, HelpCircle,
  ArrowRight, ArrowLeft, Check, Sparkles, 
  Palette
} from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '800', '900'] });

// --- CONFIGURATION OPTIONS ---
const EVENTS = [
  { id: 'wedding', name: 'Wedding', icon: Heart, color: 'bg-rose-500' },
  { id: 'birthday', name: 'Birthday', icon: Cake, color: 'bg-amber-500' },
  { id: 'baptism', name: 'Baptism', icon: Star, color: 'bg-sky-500' },
  { id: 'party', name: 'Party', icon: PartyPopper, color: 'bg-indigo-500' },
  { id: 'success', name: 'Achievement', icon: User, color: 'bg-emerald-500' },
  { id: 'others', name: 'Others', icon: HelpCircle, color: 'bg-slate-500' }, // 🆕 Idinagdag para sa custom/other event categories
];

const THEMES = [
  { id: 'minimalist', name: 'Minimalist', desc: 'Clean, white, and modern.', color: 'bg-white', text: 'text-slate-600' },
  { id: 'luxury', name: 'Luxury Gold', desc: 'Elegant navy with gold accents.', color: 'bg-slate-900', text: 'text-amber-400' },
  { id: 'rose', name: 'Pastel Rose', desc: 'Soft pinks and romantic vibes.', color: 'bg-rose-100', text: 'text-rose-500' },
  { id: 'midnight', name: 'Midnight', desc: 'Deep dark theme with neon.', color: 'bg-black', text: 'text-indigo-400' },
];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    event: '',
    theme: '',
    name: ''
  });

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const handleFinish = () => {
    const params = new URLSearchParams({
      event: formData.event,
      theme: formData.theme,
      celebrant: formData.name,
      init: 'true'
    });
    router.push(`/create?${params.toString()}`);
  };

  const isNextDisabled = () => {
    if (step === 0 && !formData.event) return true;
    if (step === 1 && !formData.theme) return true;
    if (step === 2 && formData.name.length < 2) return true;
    return false;
  };

  return (
    <div className={`min-h-screen bg-[#FFFDF8] text-slate-900 flex flex-col items-center justify-center p-6 ${poppins.className}`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-100/50 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100/50 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-slate-900' : 'bg-slate-200'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: EVENT SELECTION */}
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">What are we <br/><span className="text-rose-500">Celebrating?</span></h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Pick your event type</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EVENTS.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => { setFormData({...formData, event: ev.id}); nextStep(); }}
                    className={`flex items-center gap-4 p-6 rounded-[2rem] border-2 transition-all active:scale-95
                      ${formData.event === ev.id ? 'border-slate-900 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-300'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${ev.color} text-white flex items-center justify-center shadow-lg`}>
                      <ev.icon size={24} />
                    </div>
                    <span className="font-black uppercase italic text-sm tracking-tight">{ev.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 1: THEME SELECTION */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Pick a <br/><span className="text-rose-500">Visual Vibe.</span></h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Choose your starter template</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setFormData({...formData, theme: th.id})}
                    className={`group flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all
                      ${formData.theme === th.id ? 'border-slate-900 bg-white shadow-xl' : 'border-slate-100 bg-white/50 hover:border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${th.color} border border-slate-200 flex items-center justify-center`}>
                        <Palette className={th.text} size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-black uppercase italic text-sm tracking-tight">{th.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{th.desc}</p>
                      </div>
                    </div>
                    {formData.theme === th.id && <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white"><Check size={14} /></div>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: NAME INPUT */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                {/* 🎯 NAAYOS NA HEADER: Mas respectful at generic na para sa kahit anong klase ng event */}
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Whose event <br/>is <span className="text-rose-500">This?</span></h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Enter Host, Couple, or Subject Name</p>
              </div>

              <div className="relative">
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g. Juan & Maria"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border-2 border-slate-100 rounded-[2rem] px-8 py-6 text-xl font-black uppercase tracking-tight focus:border-slate-900 focus:ring-0 transition-all outline-none text-center shadow-sm"
                />
                <div className="absolute top-1/2 -translate-y-1/2 left-6 text-slate-200">
                  <Edit3 size={20} />
                </div>
              </div>
              
              <div className="bg-rose-50 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="text-rose-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] font-bold text-rose-500 uppercase leading-relaxed">
                  We'll use this name to pre-fill your invitation layout data. Don't worry, you can easily change everything later in the main builder!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVIGATION BUTTONS */}
        <div className="mt-12 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          <button 
            disabled={isNextDisabled()}
            onClick={step === 2 ? handleFinish : nextStep}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl active:scale-95
              ${isNextDisabled() ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-rose-500'}`}
          >
            {step === 2 ? 'LAUNCH BUILDER' : 'CONTINUE'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Edit3({ size }: { size: number }) {
  return <User size={size} />;
}