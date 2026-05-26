// app/wedding/templates/[id]/page.tsx
"use client";
import React, { use, useState } from 'react';
import Link from 'next/link';
import Sidebar from './components/Sidebar';
import PreviewWorkspace from './components/PreviewWorkspace';
import { weddingTemplates } from '../../../constants/wedding-templates';

export default function TemplatePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🎯 SHARED STATE PARA SA LIVE PREVIEW DATA
  const [previewData, setPreviewData] = useState({
    headerText: "The wedding of",
    names: "Romeo & Juliet",
    eventDate: "2026-12-14",
    eventTime: "15:00",
    venue: "Makati City, PH"
  });

  const currentIndex = weddingTemplates.findIndex((t: { id: string }) => t.id === resolvedParams.id);
  const template = weddingTemplates[currentIndex];

  if (!template) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-black text-slate-900 uppercase italic">Template Not Found</h1>
          <Link href="/wedding/templates" className="mt-4 inline-block text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:underline">
            Go Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const prevTemplate = weddingTemplates[currentIndex > 0 ? currentIndex - 1 : weddingTemplates.length - 1];
  const nextTemplate = weddingTemplates[currentIndex < weddingTemplates.length - 1 ? currentIndex + 1 : 0];

  const design = template.design || {
    bgImage: "", fontHeading: "font-sans", fontBody: "font-sans",
    primaryColor: "text-slate-900", secondaryColor: "text-slate-500", accentColor: "border-slate-200"
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F0F2F5] flex font-sans overflow-hidden">
      
      {/* 🎯 IPASA ANG PREVIEW DATA AT SETTER SA SIDEBAR */}
      <Sidebar 
        template={template} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        previewData={previewData}
        setPreviewData={setPreviewData}
      />

      {/* 🎯 IPASA ANG PREVIEW DATA SA WORKSPACE PARA MA-RENDER */}
      <PreviewWorkspace 
        template={template} 
        prevTemplate={prevTemplate} 
        nextTemplate={nextTemplate} 
        design={design} 
        onOpenSidebar={() => setIsSidebarOpen(true)}
        previewData={previewData}
      />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

    </div>
  );
}