// app/wedding/templates/[id]/components/Sidebar.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface SidebarProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  previewData: any;
  setPreviewData: (data: any) => void;
}

export default function Sidebar({ template, isOpen, onClose, previewData, setPreviewData }: SidebarProps) {
  
  // Helper function para madaling mag-update ng state
  const handleInputChange = (field: string, value: string) => {
    setPreviewData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <aside 
      className={`fixed md:relative top-0 left-0 w-[380px] max-w-[85vw] bg-white flex flex-col shrink-0 border-r border-slate-200 z-30 h-screen transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="pt-8 pb-6 px-6 flex flex-col border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <Link href="https://wedding.nvitado.com">
             <img src="/assets/images/logo2.png" alt="Nvitado Builder" className="h-8 object-contain" />
          </Link>
          <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{template.category} Template</h2>
          <h3 className="text-xl font-black text-slate-900 uppercase italic mb-1">{template.name}</h3>
          <p className="text-[10px] font-bold text-slate-500 tracking-wider">THEME: {template.theme}</p>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        
        {/* 01. HEADER SECTION */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">01. Header & Names</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Header Text</label>
              <input 
                type="text" 
                value={previewData.headerText}
                onChange={(e) => handleInputChange("headerText", e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all" 
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Names</label>
              <input 
                type="text" 
                value={previewData.names}
                onChange={(e) => handleInputChange("names", e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all" 
              />
            </div>
          </div>
        </div>

        {/* 02. EVENT DETAILS SECTION */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">02. Event Details</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Event Date</label>
              <input 
                type="date" 
                value={previewData.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all" 
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Event Time</label>
              <input 
                type="time" 
                value={previewData.eventTime}
                onChange={(e) => handleInputChange("eventTime", e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all" 
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Venue / Location</label>
              <input 
                type="text" 
                value={previewData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-900">Total</span>
          <span className="text-lg font-black text-rose-500">₱{template.price}</span>
        </div>
        <Link 
          href={`/create?event=wedding&template=${template.id}`}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-rose-500 transition-colors shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
        >
          SELECT THIS TEMPLATE
        </Link>
      </div>
    </aside>
  );
}