// app/wedding/templates/[id]/components/PreviewWorkspace.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Smartphone, Monitor } from 'lucide-react';

interface PreviewWorkspaceProps {
  template: any;
  prevTemplate: any;
  nextTemplate: any;
  design: any;
  onOpenSidebar: () => void;
  previewData: any;
}

export default function PreviewWorkspace({ template, prevTemplate, nextTemplate, design, onOpenSidebar, previewData }: PreviewWorkspaceProps) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Helper para i-format yung date
  const formatDate = (dateString: string) => {
    if (!dateString) return "DATE";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  // Helper para hatiin ang "Romeo & Juliet" kapag may '&'
  const renderNames = (names: string) => {
    if (names.includes('&')) {
      const parts = names.split('&');
      return (
        <>
          {parts[0].trim()} <span className="text-3xl italic align-middle mx-2">&amp;</span> {parts[1].trim()}
        </>
      );
    }
    return names;
  };

  return (
    <main className="flex-1 flex flex-col relative h-screen bg-[#F4F7F9]">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shrink-0 z-10 shadow-sm">
        <Link href={`/wedding/templates/${prevTemplate.id}`} className="flex items-center gap-1 md:gap-2 text-slate-500 hover:text-slate-900 transition-colors w-1/3">
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Previous</span>
            <span className="text-[10px] font-black uppercase truncate max-w-[150px]">{prevTemplate.name}</span>
          </div>
        </Link>
        <div className="flex items-center justify-center w-1/3">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-3 md:px-6 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Smartphone className="w-4 h-4" /> <span className="hidden md:inline">Mobile</span>
            </button>
            <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-3 md:px-6 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${viewMode === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <Monitor className="w-4 h-4" /> <span className="hidden md:inline">Desktop</span>
            </button>
          </div>
        </div>
        <Link href={`/wedding/templates/${nextTemplate.id}`} className="flex items-center justify-end gap-1 md:gap-2 text-slate-500 hover:text-slate-900 transition-colors w-1/3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Next</span>
            <span className="text-[10px] font-black uppercase truncate max-w-[150px]">{nextTemplate.name}</span>
          </div>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className={`transition-all duration-500 ease-in-out relative shrink-0 ${viewMode === 'mobile' ? 'w-full max-w-[380px] h-[780px] border-[14px] rounded-[3rem]' : 'w-full max-w-[1024px] h-[600px] border-[14px] rounded-2xl'} bg-white shadow-2xl border-slate-900 overflow-hidden flex flex-col`}>
          <div className="flex-1 relative w-full h-full bg-white">
            
            {design.bgImage ? (
              <div className="absolute inset-0 z-0">
                <img src={design.bgImage} alt="Background" className="w-full h-full object-cover opacity-95" />
              </div>
            ) : (
              <div className={`absolute inset-0 z-0 ${template.placeholderBg}`} />
            )}

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white/40">
              {/* 🎯 HEADER TEXT */}
              <p className={`text-[10px] uppercase tracking-[0.4em] mb-4 ${design.fontBody} ${design.secondaryColor}`}>
                {previewData.headerText || "THE WEDDING OF"}
              </p>
              
              {/* 🎯 NAMES */}
              <h2 className={`text-5xl md:text-6xl leading-tight ${design.fontHeading} ${design.primaryColor}`}>
                 {previewData.names ? renderNames(previewData.names) : "NAME & NAME"}
              </h2>
              
              <div className={`w-16 h-[1px] my-8 border-t ${design.accentColor}`} />
              
              {/* 🎯 EVENT DETAILS */}
              <p className={`text-[10px] md:text-xs font-bold tracking-widest uppercase leading-loose ${design.fontBody} ${design.secondaryColor}`}>
                SAVE THE DATE <br/> 
                {formatDate(previewData.eventDate)} <br/>
                {previewData.venue || "LOCATION"}
              </p>
            </div>

          </div>
        </div>
      </div>

      <button onClick={onOpenSidebar} className="md:hidden absolute bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-10 font-black text-xs tracking-widest uppercase hover:bg-rose-500">
        EDIT
      </button>

    </main>
  );
}