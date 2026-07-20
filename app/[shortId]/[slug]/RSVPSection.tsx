"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Link2, Mail, Phone } from 'lucide-react';

interface RSVPSectionProps {
  invitationId: string;
  message?: string;
  rules?: string[];
}

export default function RSVPSection({ invitationId, message, rules }: RSVPSectionProps) {
  const [name, setName] = useState('');
  const [fbLink, setFbLink] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // 🐝 ANTI-SPAM-BOT (no external service needed):
  //  - honeypot: a hidden field real users never see/fill; bots that blindly
  //    fill every input will populate it.
  //  - time-trap: record when the form mounted so the API can reject
  //    submissions that arrive implausibly fast (instant = automated).
  const [hp, setHp] = useState('');
  const loadedAtRef = useRef<number>(0);
  useEffect(() => {
    loadedAtRef.current = Date.now();
  }, []);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name first.');
      return;
    }
    if (!fbLink.trim() && !email.trim() && !contact.trim()) {
      setError('Add at least one contact so the host can verify you: Facebook, email, or phone.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_id: invitationId,
          name: trimmedName,
          // status stays null (pending) until the host verifies the guest
          status: null,
          action: 'register',
          fb_link: fbLink.trim(),
          email: email.trim(),
          contact: contact.trim(),
          // 🐝 anti-spam signals (see honeypot/time-trap notes above)
          _hp: hp,
          _elapsed: loadedAtRef.current ? Date.now() - loadedAtRef.current : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setFbLink('');
    setEmail('');
    setContact('');
    setError('');
    setHp('');
    loadedAtRef.current = Date.now();
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-sm p-8 rounded-[2rem] border border-white/20 shadow-sm space-y-6">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* 🐝 HONEYPOT — hidden from real users (off-screen, not tabbable,
                autocomplete disabled, aria-hidden). Bots that auto-fill every
                field will populate it, and the API silently drops those. */}
            <input
              type="text"
              name="website"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', top: 0, width: '1px', height: '1px', opacity: 0 }}
            />

            {/* OWNER MESSAGE */}
            {message && message.trim() && (
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed whitespace-pre-line text-center bg-white/40 border border-white/30 rounded-2xl p-4">
                {message}
              </p>
            )}

            {/* INSTRUCTIONS / RULES */}
            {rules && rules.length > 0 && (
              <div className="bg-white/40 border border-white/30 rounded-2xl p-4 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Please note</p>
                <ul className="space-y-1.5">
                  {rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-600 leading-relaxed">
                      <span className="text-amber-500 font-black shrink-0">{i + 1}.</span>
                      <span className="break-words">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* NAME INPUT */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Enter your name..."
                className="w-full p-4 bg-white/70 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
              />
            </div>

            {/* CONTACT FIELDS */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                How can the host reach you? <span className="text-slate-300">(at least one)</span>
              </label>

              <div className="relative">
                <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fbLink}
                  onChange={(e) => { setFbLink(e.target.value); setError(''); }}
                  placeholder="Facebook profile link"
                  className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
              </div>

              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Email address"
                  className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
              </div>

              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => { setContact(e.target.value); setError(''); }}
                  placeholder="Contact number"
                  className="w-full pl-9 pr-4 py-3 bg-white/70 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send RSVP'}
            </button>

            {/* ERROR MESSAGE */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl"
              >
                <AlertCircle size={12} className="text-rose-500 flex-shrink-0" />
                <p className="text-[9px] font-bold text-rose-600">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-4 py-6"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 uppercase">Thank You, {name}!</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Your RSVP has been sent. The host will confirm your attendance shortly.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
            >
              Submit Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
