"use client";
import React, { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { BACKGROUNDS } from '../constants/backgrounds';

export default function Sidebar({ config, setConfig }: any) {
  const [showAllBgs, setShowAllBgs] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showDateStyle, setShowDateStyle] = useState(false);
  const [showMessageStyle, setShowMessageStyle] = useState(false);

  const FONT_OPTIONS = [
    { id: 'font-serif', name: 'Elegant Serif', class: 'font-serif' },
    { id: 'font-sans', name: 'Modern Sans', class: 'font-sans' },
    { id: 'italic', name: 'Script Style', class: 'italic font-serif' },
    { id: 'font-mono', name: 'Minimalist', class: 'font-mono' },
  ];

  return (
    <aside className="w-[380px] bg-white border-r flex flex-col z-20 overflow-hidden font-sans text-slate-900">
      <div className="p-8 border-b flex justify-center bg-white text-slate-900">
        <img src="/assets/images/logo2.png" alt="Nvitado" className="h-10 w-auto object-contain" />
      </div>

      <div className="p-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
        {/* 01. BACKGROUND */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">01. Background Style</label>
            <button onClick={() => setShowAllBgs(!showAllBgs)} className="text-[10px] font-bold text-amber-600 hover:underline">{showAllBgs ? 'Less' : 'More +'}</button>
          </div>
          <div className={`grid gap-3 transition-all duration-300 ${showAllBgs ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {(showAllBgs ? BACKGROUNDS : BACKGROUNDS.slice(0, 4)).map((bg) => (
              <button key={bg.id} onClick={() => setConfig({...config, background: bg.value})} className={`h-10 rounded-xl border ${config.background === bg.value ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-100'}`} style={{ background: bg.value }} />
            ))}
          </div>
        </section>

        {/* 02. TITLE */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">02. Title & Style</label>
            <button onClick={() => setShowAllStyles(!showAllStyles)} className="text-[10px] font-bold text-amber-600 hover:underline">{showAllStyles ? 'Hide' : 'Style +'}</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <input type="text" className="bg-transparent outline-none w-full font-bold text-xs uppercase" value={config.title} onChange={(e) => setConfig({...config, title: e.target.value})} />
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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">03. Date & Time</label>
            <button onClick={() => setShowDateStyle(!showDateStyle)} className="text-[10px] font-bold text-amber-600 hover:underline">{showDateStyle ? 'Hide' : 'Format +'}</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <input type="date" className="bg-transparent outline-none w-full font-bold text-xs cursor-pointer" value={config.eventDate} onChange={(e) => setConfig({...config, eventDate: e.target.value})} />
            </div>
            {showDateStyle && (
              <div className="p-3 bg-white border border-amber-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <select className="bg-transparent outline-none w-full font-bold text-slate-800 text-[10px] cursor-pointer" value={config.dateFormat} onChange={(e) => setConfig({...config, dateFormat: e.target.value})}>
                  <option value="long">Elegant (April 07, 2026)</option>
                  <option value="short">Modern (04 / 07 / 2026)</option>
                  <option value="minimal">Minimalist (04.07.26)</option>
                </select>
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Include Time?</span>
              <button onClick={() => setConfig({...config, showTime: !config.showTime})} className={`w-8 h-4 rounded-full relative transition-all ${config.showTime ? 'bg-amber-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.showTime ? 'right-0.5' : 'left-0.5'}`} /></button>
            </div>
            {config.showTime && <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl"><input type="time" className="bg-transparent outline-none w-full font-bold text-xs" value={config.eventTime} onChange={(e) => setConfig({...config, eventTime: e.target.value})} /></div>}
          </div>
        </section>

        {/* 04. LOCATION */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">04. Event Location</label>
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            selectProps={{
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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">05. Welcome Message</label>
            <button onClick={() => setShowMessageStyle(!showMessageStyle)} className="text-[10px] font-bold text-amber-600 hover:underline">{showMessageStyle ? 'Hide' : 'Style +'}</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl group focus-within:border-amber-500 transition-all shadow-sm">
              <textarea 
                rows={3}
                className="bg-transparent outline-none w-full font-bold text-slate-800 text-xs resize-none" 
                placeholder="Enter message..." 
                value={config.welcomeMessage} 
                onChange={(e) => setConfig({...config, welcomeMessage: e.target.value})} 
              />
            </div>
            {showMessageStyle && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                {FONT_OPTIONS.map((f) => (
                  <button key={f.id} onClick={() => setConfig({...config, messageFont: f.id})} className={`p-2 rounded-lg border text-[10px] font-bold transition-all ${config.messageFont === f.id ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                    <span className={f.class}>Abc</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 06. URL */}
        <section>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4 font-bold">06. Custom URL</label>
          <div className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
            <span className="text-slate-400 font-bold">nvitado.com/</span>
            <input type="text" className="bg-transparent outline-none flex-1 ml-1 text-slate-800 font-bold uppercase" placeholder="EVENT-NAME" onChange={(e) => setConfig({...config, slug: e.target.value})} />
          </div>
        </section>
      </div>

      <div className="p-8 border-t bg-slate-50">
        <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-xs tracking-widest shadow-lg hover:bg-amber-900 transition-all active:scale-95">
          PUBLISH INVITATION (₱50)
        </button>
      </div>
    </aside>
  );
}