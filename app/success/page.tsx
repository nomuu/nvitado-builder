"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Payment Success!</h1>
        <p className="text-slate-500 mb-8 font-medium">Your invitation is now being activated. You can now share your custom link below.</p>
        
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 mb-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Live Link:</p>
          <p className="text-amber-700 font-bold break-all">nvitado.com/{slug}</p>
        </div>

        <div className="space-y-3">
          <Link 
            href={`/${slug}`}
            className="block w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest hover:bg-amber-900 transition-all"
          >
            VIEW LIVE INVITATION
          </Link>
          <Link 
            href="/"
            className="block w-full text-slate-400 py-2 font-bold text-xs hover:text-slate-600"
          >
            BACK TO BUILDER
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black italic">LOADING...</div>}>
      <SuccessContent />
    </Suspense>
  );
}