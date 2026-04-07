"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { BACKGROUNDS } from '../constants/backgrounds';

export default function Sidebar({ config, setConfig, onPublish, isPublishing }: any) {
  const [showAllBgs, setShowAllBgs] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showDateStyle, setShowDateStyle] = useState(false);
  const [showMessageStyle, setShowMessageStyle] = useState(false);

  // 📍 PRICING LOGIC
  const basePrice = 50;
  const selectedBg = BACKGROUNDS.find(bg => bg.id === config.animationId);
  const bgPrice = selectedBg?.price || 0;
  const totalPrice = basePrice + bgPrice;

  const FONT_OPTIONS = [
    { id: 'font-serif', name: 'Elegant Serif', class: 'font-serif' },
    { id: 'font-sans', name: 'Modern Sans', class: 'font-sans' },
    { id: 'italic', name: 'Script Style', class: 'italic font-serif' },
    { id: 'font-mono', name: 'Minimalist', class: 'font-mono' },
  ];

  const handleSlugChange = (val: string) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    setConfig({...config, slug: cleaned});
  };

  const handleBgSelect = (bg: any) => {
    setConfig({
      ...config, 
      background: bg.value,
      animationId: bg.id, 
      useAnimation: bg.type !== 'solid'
    });
  };

  const handleMessageChange = (val: string) => {
    if (val.length <= 250) {
      setConfig({ ...config, welcomeMessage: val });
    }
  };

  return (
    <aside className="w-[380px] bg-white border-r flex flex-col z-20 overflow-hidden font-sans text-slate-900 shadow-xl">
      <div className="p-8 border-b flex justify-center bg-white text-slate-900">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img src="/assets/images/logo2.png" alt="Nvitado" className="h-10 w-auto object-contain cursor-pointer" />
        </Link>
      </div>

      <div className="p-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
        {/* 01. BACKGROUND & EFFECTS */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-bold">01. Background & Effects</label>
            <button onClick={() => setShowAllBgs(!showAllBgs)} className="text-[10px] font-bold text-amber-600 hover:underline">{showAllBgs ? 'Less' : 'View All'}</button>
          </div>
          <div className={`grid gap-3 transition-all duration-300 ${showAllBgs ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {(showAllBgs ? BACKGROUNDS : BACKGROUNDS.slice(0, 6)).map((bg) => (
              <button 
                key={bg.id} 
                onClick={() => handleBgSelect(bg)} 
                className={`group relative flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all h-20 ${config.animationId === bg.id ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-100 bg-slate-50'}`}
              >
                <div className="w-full h-8 rounded-lg shadow-inner border border-black/5" style={{ background: bg.value }}>
                   {bg.icon && <span className="flex items-center justify-center h-full text-xs">{bg.icon}</span>}
                </div>
                <span className="text-[9px] font-bold text-slate-600 truncate w-full text-center">{bg.name}</span>
                {bg.price > 0 && <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black shadow-sm">+₱{bg.price}</span>}
              </button>
            ))}
          </div>
        </section>

        {/* 02. TITLE & STYLE */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-bold">02. Title & Style</label>
            <button onClick={() => setShowAllStyles(!showAllStyles)} className="text-[10px] font-bold text-amber-600 hover:underline">{showAllStyles ? 'Hide' : 'Style +'}</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900">
              <input type="text" className="bg-transparent outline-none w-full font-bold text-slate-800 text-xs uppercase" placeholder="TITLE" value={config.title} onChange={(e) => setConfig({...config, title: e.target.value})} />
            </div>
            {showAllStyles && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                {FONT_OPTIONS.map((f) => (
                  <button key={f.id} onClick={() => setConfig({...config, titleFont: f.id})} className={`p-2 rounded-lg border text-[10px] font-bold ${config.titleFont === f.id ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                    <span className={f.class}>Abc</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 03. DATE & TIME */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-bold">03. Date & Time</label>
            <button onClick={() => setShowDateStyle(!showDateStyle)} className="text-[10px] font-bold text-amber-600 hover:underline">{showDateStyle ? 'Hide' : 'Format +'}</button>
          </div>
          <div className="space-y-3">
            <input type="date" className="p-3 bg-slate-50 border border-slate-200 rounded-xl w-full font-bold text-xs text-slate-900" value={config.eventDate} onChange={(e) => setConfig({...config, eventDate: e.target.value})} />
            {showDateStyle && (
              <select className="p-3 bg-white border border-amber-200 rounded-xl w-full font-bold text-[10px] text-slate-900 animate-in fade-in slide-in-from-top-1 outline-none" value={config.dateFormat} onChange={(e) => setConfig({...config, dateFormat: e.target.value})}>
                <option value="long">Elegant (April 07, 2026)</option>
                <option value="short">Modern (04 / 07 / 2026)</option>
                <option value="minimal">Minimalist (04.07.26)</option>
              </select>
            )}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-600">Include Time?</span>
              <button onClick={() => setConfig({...config, showTime: !config.showTime})} className={`w-8 h-4 rounded-full relative transition-all ${config.showTime ? 'bg-amber-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.showTime ? 'right-0.5' : 'left-0.5'}`} /></button>
            </div>
            {config.showTime && <input type="time" className="p-3 bg-amber-50 border border-amber-200 rounded-xl w-full font-bold text-xs text-slate-900 animate-in fade-in slide-in-from-top-1" value={config.eventTime} onChange={(e) => setConfig({...config, eventTime: e.target.value})} />}
          </div>
        </section>

        {/* 04. LOCATION */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 font-bold">04. Event Location</label>
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            selectProps={{
              instanceId: "nvitado-location-select",
              onChange: (place: any) => setConfig({...config, location: place.label}),
              placeholder: "📍 Search venue...",
              styles: {
                control: (provided) => ({ ...provided, borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: '700' }),
              }
            }}
          />
        </section>

        {/* 05. WELCOME MESSAGE */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-bold">05. Welcome Message</label>
            <button onClick={() => setShowMessageStyle(!showMessageStyle)} className="text-[10px] font-bold text-amber-600 hover:underline">{showMessageStyle ? 'Hide' : 'Style +'}</button>
          </div>
          <div className="relative">
            <textarea rows={3} className="p-3 bg-slate-50 border border-slate-200 rounded-xl w-full font-bold text-xs resize-none text-slate-900" value={config.welcomeMessage} onChange={(e) => handleMessageChange(e.target.value)} />
            <span className={`absolute bottom-2 right-3 text-[9px] font-bold ${config.welcomeMessage.length >= 250 ? 'text-rose-500' : 'text-slate-400'}`}>{config.welcomeMessage.length}/250</span>
          </div>
          {showMessageStyle && (
            <div className="grid grid-cols-2 gap-2 mt-2 animate-in fade-in zoom-in-95 duration-200">
              {FONT_OPTIONS.map((f) => (
                <button key={f.id} onClick={() => setConfig({...config, messageFont: f.id})} className={`p-2 rounded-lg border text-[10px] font-bold ${config.messageFont === f.id ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                  <span className={f.class}>Abc</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 06. URL */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 font-bold">06. Custom URL</label>
          <div className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            <span className="text-slate-400 font-bold">nvitado.com/</span>
            <input type="text" className="bg-transparent outline-none flex-1 ml-1 text-slate-800 font-bold uppercase" placeholder="EVENT-NAME" value={config.slug} onChange={(e) => handleSlugChange(e.target.value)} />
          </div>
        </section>
      </div>

      {/* 💰 PRICING SUMMARY SECTION */}
      <div className="p-6 bg-slate-50 border-t space-y-3">
        <div className="space-y-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <div className="flex justify-between">
            <span>Publishing Fee</span>
            <span className="text-slate-900">₱{basePrice.toFixed(2)}</span>
          </div>
          {bgPrice > 0 && (
            <div className="flex justify-between text-amber-600 animate-in fade-in slide-in-from-bottom-1">
              <span>{selectedBg?.name} Effect</span>
              <span>+₱{bgPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-[12px] text-slate-900 font-black">
            <span>Total to pay</span>
            <span className="text-amber-600">₱{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => onPublish(totalPrice)} 
          disabled={isPublishing} 
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest shadow-lg hover:bg-amber-900 transition-all active:scale-95 disabled:bg-slate-400"
        >
          {isPublishing ? 'GENERATING LINK...' : 'PUBLISH INVITATION'}
        </button>
      </div>
    </aside>
  );
}