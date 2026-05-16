"use client";
import React, { useState, useEffect } from 'react';
import { PartyPopper, Hourglass, CheckCircle2, Star, MessageSquarePlus, Eye } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 📡 I-initialize ang Supabase Client para sa client-side verification at insertion
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GracePeriodCountdown({ expirationTime, title, initialCustomerName }: { expirationTime: string; title: string; initialCustomerName: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  
  // 📍 REVIEW MODAL STATES
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [customerName] = useState(initialCustomerName);
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // 🔒 🆕 LOGIC FOR EXISTING REVIEW CHECK
  const [hasExistingReview, setHasExistingReview] = useState(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

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

    // 🔍 🆕 CHECK DATABASE KUNG NAKAPAG-REVIEW NA ITONG SPECIFIC URL LINK
    const checkForExistingReview = async () => {
      try {
        const currentFullUrl = window.location.href;
        const { data, error } = await supabase
          .from('reviews')
          .select('stars, review')
          .eq('invitation_link', currentFullUrl)
          .maybeSingle();

        if (!error && data) {
          setStars(data.stars);
          setReviewText(data.review);
          setHasExistingReview(true);
        }
      } catch (err) {
        console.error("Failed to check existing review status", err);
      } finally {
        setIsLoadingCheck(false);
      }
    };

    updateTimer();
    checkForExistingReview();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expirationTime]);

  // 💾 SAVE REVIEW TO SUPABASE DATABASE
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasExistingReview) return; // Safety block

    if (!customerName.trim() || !reviewText.trim()) {
      alert("Please fill up your review message.");
      return;
    }

    setIsSubmitting(true);
    try {
      const currentFullUrl = window.location.href;

      const { error } = await supabase
        .from('reviews')
        .insert({
          customer_name: customerName,
          review: reviewText,
          stars: stars,
          invitation_link: currentFullUrl
        });

      if (error) throw error;
      
      setReviewSuccess(true);
      setHasExistingReview(true);
    } catch (err: any) {
      console.error("Review Submission Error:", err.message);
      alert("Failed to save review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden select-none pointer-events-auto">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] text-center border-t-[12px] border-amber-500 animate-in zoom-in-95 duration-300">
        
        {!showReviewForm ? (
          /* =========================================================
             Mode A: COUNTDOWN WALL & LEAVE REVIEW BUTTON
             ========================================================= */
          <>
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
            
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 px-2">
              Thank you for choosing **Nvitado** for your event! This invitation page has fulfilled its purpose and will be deleted permanently soon.
            </p>

            {/* COUNTDOWN TIMER DISPLAY */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 mb-6 shadow-inner border border-slate-800">
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

            {/* BUTTON DYNAMIC DISPLAY */}
            <button
              onClick={() => setShowReviewForm(true)}
              disabled={isLoadingCheck}
              className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-amber-600 transition-all uppercase flex items-center justify-center gap-2 shadow-lg mb-6 active:scale-95 disabled:opacity-50"
            >
              {hasExistingReview ? (
                <>
                  <Eye size={16} /> View Your Review
                </>
              ) : (
                <>
                  <MessageSquarePlus size={16} /> Make a Review
                </>
              )}
            </button>
          </>
        ) : (
          /* =========================================================
             Mode B: LIVE REVIEW SUBMISSION FORM / VIEW EXISTING MODE
             ========================================================= */
          <div className="animate-in fade-in duration-200 text-left">
            {!reviewSuccess ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                    {hasExistingReview ? "Your Submitted Review" : "Share Your Experience"}
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">
                    {hasExistingReview ? "Thank you for your response!" : "Your feedback keeps Nvitado growing"}
                  </p>
                </div>

                {/* STAR RATINGS DISPLAY / SELECTOR */}
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    {hasExistingReview ? "Your Rating:" : "Rate your experience:"}
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        disabled={hasExistingReview}
                        onClick={() => setStars(starValue)}
                        className={`transition-transform ${hasExistingReview ? 'cursor-default' : 'active:scale-125'}`}
                      >
                        <Star
                          size={28}
                          className={`${
                            starValue <= stars 
                              ? 'text-amber-500 fill-amber-500' 
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* NAME INPUT */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Customer Name</label>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl select-none">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={customerName}
                      className="bg-transparent outline-none w-full font-black text-slate-500 text-xs uppercase cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* REVIEW COMMENT TEXTAREA */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your Review Message</label>
                  <textarea
                    rows={4}
                    readOnly={hasExistingReview}
                    disabled={hasExistingReview}
                    required
                    placeholder="Tell us what you liked about your digital invitation..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className={`p-3 border rounded-xl w-full font-bold text-xs resize-none text-slate-900 placeholder:text-slate-300 outline-none transition-colors ${
                      hasExistingReview 
                        ? 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-500 font-medium' 
                        : 'bg-slate-50 border-slate-200 focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* FORM CONTROLS */}
                <div className="flex flex-col gap-2 pt-2">
                  {/* 🆕 AUTO-HIDE / REPLACEMENT TRIGGER: Kung tapos na mag-review, tanggal ang Submit button! */}
                  {!hasExistingReview && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-amber-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all uppercase text-center shadow-lg"
                    >
                      {isSubmitting ? 'SAVING REVIEW...' : 'SUBMIT REVIEW'}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="w-full bg-slate-100 text-slate-800 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-200 transition-all uppercase text-center border border-slate-300 shadow-md active:scale-95"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            ) : (
              /* REVIEW SUCCESS MESSAGE SCREEN */
              <div className="text-center py-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight mb-1">Thank You!</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 px-2">
                  Your review has been successfully submitted and recorded. We appreciate your kind words!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReviewSuccess(false);
                    setShowReviewForm(false);
                  }}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase"
                >
                  Return to Countdown
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
          Nvitado © 2026 — All Rights Reserved
        </div>
      </div>
    </div>
  );
}