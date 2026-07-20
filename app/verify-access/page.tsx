"use client";
import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Key, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';

// Only allow internal owner surfaces as a post-verify destination. This blocks
// open-redirect abuse (e.g. ?next=https://evil.com or ?next=//evil.com) — we
// accept a relative path that points at the builder or the RSVP manager only.
function safeNext(next: string | null, fallback: string): string {
  if (!next) return fallback;
  // Must be a plain internal absolute path: single leading slash, no host,
  // no protocol-relative (`//`) or backslash tricks.
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback;
  if (next.startsWith('/revise/') || next.startsWith('/rsvp/')) return next;
  return fallback;
}

function VerifyAccessInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    tokenId: '', // Dito mase-save ang saktong digits/characters na tina-type nila
    otp: ''
  });

  // 📍 STEP 1: VERIFY EMAIL & TOKEN ID
  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Dynamic clean composition para siguraduhing may tamang prefix bago lumipad sa backend system ninyo
    const fullTokenId = `NVI-${formData.tokenId.trim().toUpperCase()}`;

    try {
      const res = await fetch('/api/verify-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, tokenId: fullTokenId }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2); // Tuloy sa OTP step
      } else {
        setError(data.error || "Invalid credentials. Please check your Email or Token ID.");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📍 STEP 2: VERIFY OTP CODE
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const fullTokenId = `NVI-${formData.tokenId.trim().toUpperCase()}`;

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp,
          tokenId: fullTokenId 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // SUCCESS! Ibalik sa pinanggalingang surface:
        //  - galing sa RSVP manager  → /rsvp/[shortId]/[slug]
        //  - galing sa revision       → /revise/[tokenId] (builder)
        // Default pa rin ang builder kung walang (o hindi valid na) `next`.
        router.push(safeNext(nextParam, `/revise/${fullTokenId}`));
      } else {
        setError(data.error || "Invalid verification code.");
      }
    } catch (err) {
      setError("Verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          
          {/* 📍 HEADER */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Access Revision</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {step === 1 ? "Verify your ownership" : "Check your email for OTP"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* --- STEP 1 FORM --- */
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyCredentials}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="email"
                      placeholder="e.g. maria@gmail.com"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Token ID</label>
                  
                  {/* 🆕 UPGRADED DUAL-ZONE ADAPTIVE LAYOUT CONTAINER */}
                  <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                    <div className="pl-4 flex items-center gap-2 text-slate-400 select-none shrink-0">
                      <Key size={16} />
                      {/* FIXED VISUAL INTERFACE COMPONENT FOR NVI- */}
                      <span className="font-black text-sm tracking-wide text-slate-900 bg-slate-100 px-2 py-1 rounded-md">NVI-</span>
                    </div>
                    
                    <input 
                      required
                      type="text"
                      placeholder="XXXXXX"
                      maxLength={12} // Adjusted parameters space limit safely
                      className="w-full pl-2 pr-4 py-4 bg-transparent outline-none font-mono font-black text-sm uppercase tracking-widest text-slate-800"
                      value={formData.tokenId}
                      // Awtomatikong ginagawang uppercase habang nagpapakita sa input zone
                      onChange={(e) => setFormData({...formData, tokenId: e.target.value.toUpperCase()})}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100 animate-in fade-in zoom-in-95">
                    <AlertCircle size={16} />
                    <p className="text-[10px] font-bold uppercase">{error}</p>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-rose-500 transition-all disabled:bg-slate-300"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>REQUEST ACCESS <ArrowRight size={16} /></>
                  )}
                </button>
              </motion.form>
            ) : (
              /* --- STEP 2 FORM (OTP) --- */
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <CheckCircle2 size={16} />
                    <p className="text-[10px] font-black uppercase">Credentials Verified</p>
                  </div>
                  <p className="text-[10px] text-emerald-600/70 font-bold uppercase leading-relaxed">
                    We've sent a 6-digit code to {formData.email}. Please enter it below.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Verification Code</label>
                  <input 
                    required
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full px-4 py-6 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-black text-3xl text-center tracking-[0.5em]"
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">
                    <AlertCircle size={16} />
                    <p className="text-[10px] font-bold uppercase">{error}</p>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:bg-slate-300"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : "VERIFY CODE"}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 pt-2"
                >
                  Back to login
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center mt-12 text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Trouble accessing? Contact support at <span className="text-slate-900 underline">support@nvitado.com</span>
          </p>
        </div>
      </main>
    </div>
  );
}

// `useSearchParams` (used inside VerifyAccessInner) must sit under a Suspense
// boundary, otherwise the build fails during prerendering (Next 16 requirement).
export default function VerifyAccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF8]" />}>
      <VerifyAccessInner />
    </Suspense>
  );
}