"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Key, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function VerifyAccess() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    tokenId: '',
    otp: ''
  });

  // 📍 STEP 1: VERIFY EMAIL & TOKEN ID
  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Dito tatawag tayo sa API natin para i-check kung valid ang Token+Email combo
      const res = await fetch('/api/verify-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, tokenId: formData.tokenId }),
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

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp,
          tokenId: formData.tokenId 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // SUCCESS! Redirect sa revision page gamit ang token
        router.push(`/revise/${formData.tokenId}`);
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
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="text"
                      placeholder="nvi-XXXXXX"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all font-bold text-sm"
                      value={formData.tokenId}
                      onChange={(e) => setFormData({...formData, tokenId: e.target.value})}
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