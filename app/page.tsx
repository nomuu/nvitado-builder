"use client";
// Dito tayo nagka-error, kailangang i-import si useState sa tabi ni React
import React, { useState } from 'react'; 
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';

export default function NvitadoEditor() {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [config, setConfig] = useState({
    background: '#ffffff',
    title: 'Juan & Maria',
    titleFont: 'font-serif', 
    eventDate: '2026-04-07',
    dateFormat: 'long', 
    showTime: false,
    eventTime: '15:00',
    location: 'Makati City, Metro Manila',
    welcomeMessage: 'We invite you to join us as we celebrate our love and begin our new journey together.',
    messageFont: 'font-serif',
    slug: '',
  });

  const handlePublish = async () => {
    if (!config.slug) return alert("Hoy Chief! Paki-set muna ang Custom URL sa Step 06.");
    
    setIsPublishing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      const data = await res.json();

      if (data.checkout_url) {
        // Lilipat na si user sa PayMongo GCash/Maya portal
        window.location.href = data.checkout_url;
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      alert("Connection Error. Check your internet or API setup.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900">
      <Sidebar 
        config={config} 
        setConfig={setConfig} 
        onPublish={handlePublish} 
        isPublishing={isPublishing} 
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-200 relative text-slate-900">
        <div className="absolute top-8 flex gap-2 bg-white p-1 rounded-full shadow-lg z-30">
          <button 
            onClick={() => setViewMode('mobile')} 
            className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${viewMode === 'mobile' ? 'bg-amber-900 text-white' : 'text-slate-400'}`}
          >
            MOBILE
          </button>
          <button 
            onClick={() => setViewMode('desktop')} 
            className={`px-6 py-2 rounded-full text-[10px] font-black transition-all ${viewMode === 'desktop' ? 'bg-amber-900 text-white' : 'text-slate-400'}`}
          >
            DESKTOP
          </button>
        </div>
        <Preview config={config} viewMode={viewMode} />
      </main>
    </div>
  );
}