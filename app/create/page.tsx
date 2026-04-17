"use client";
import React, { useState, useEffect } from 'react'; 
import Sidebar from '../components/Sidebar';
import Preview from '../components/Preview';
import { BACKGROUNDS } from '../constants/backgrounds';
import { Edit3, Eye, Monitor, Smartphone, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function NvitadoEditor() {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [showDateModal, setShowDateModal] = useState(false);
  const [isEligible, setIsEligible] = useState(true);
  
  // 📍 New state para sa sync ng tabs
  const [activeTab, setActiveTab] = useState('general');
  
  const [config, setConfig] = useState({
    background: '#ffffff',
    useAnimation: false,
    animationId: 'none',
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
    showQA: false,
    showStory: false,
    story: '',
  });

  // 📍 DATE VALIDATION LOGIC
  useEffect(() => {
    if (!config.eventDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(config.eventDate);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      setIsEligible(false);
      setShowDateModal(true);
    } else {
      setIsEligible(true);
      setShowDateModal(false);
    }
  }, [config.eventDate]);

  // --- 📍 CHATBOT HIDER LOGIC ---
  useEffect(() => {
    const hasChatbot = document.querySelector('script[src*="tuqlas.com"]') || 
                      document.querySelector('[class*="tuqlas"]');

    if (hasChatbot) {
      window.location.reload();
      return;
    }

    const hideChatbot = () => {
      const scripts = document.querySelectorAll('script[src*="tuqlas.com"]');
      scripts.forEach(s => s.remove());
      const chatbotElements = document.querySelectorAll('.tuqlas-chatbot-container, #tuqlas-chatbot, [class*="tuqlas"]');
      chatbotElements.forEach(el => {
        if (el instanceof HTMLElement) el.remove(); 
      });
    };

    hideChatbot();
    const interval = setInterval(hideChatbot, 500);
    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handlePublish = async (calculatedTotal: number) => {
    if (!isEligible) return setShowDateModal(true); // Double check
    if (!config.slug) return alert("Hoy Chief! Paki-set muna ang Custom URL sa Step 06.");
    setIsPublishing(true);
    const selectedBg = BACKGROUNDS.find(bg => bg.id === config.animationId);
    try {
      const res = await fetch('/api/checkout_lemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, amount: calculatedTotal, bgName: selectedBg?.name || 'Standard' }),
      });
      const data = await res.json();
      if (data.checkout_url) { window.location.href = data.checkout_url; }
      else { alert("Error: " + (data.error || "Something went wrong")); }
    } catch (err) { alert("Connection Error."); }
    finally { setIsPublishing(false); }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 relative">
      
      {/* 📍 DATE WARNING MODAL */}
      <AnimatePresence>
        {showDateModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border-t-[10px] border-amber-500"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Not Eligible to Publish</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                Sorry Chief! Ang rules natin ay dapat **hindi bababa sa 7 days** bago ang event para makapag-create. 
                Masyado nang malapit ang date na napili mo.
              </p>
              <button 
                onClick={() => setShowDateModal(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase"
              >
                I understand, let me change it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📍 SIDEBAR */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-[380px] max-w-[85vw] transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          onPublish={handlePublish} 
          isPublishing={isPublishing} 
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isEligible={isEligible} // 📍 Pinasa para sa button state
        />
      </div>
      
      {/* 📍 MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 bg-slate-200 relative text-slate-900">
        
        {/* 📍 FIXED SWITCHER */}
        <div className="absolute top-4 md:top-8 flex gap-1 bg-white p-1 rounded-full shadow-xl z-30 border border-slate-100">
          <button 
            onClick={() => setViewMode('mobile')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Smartphone size={12} />
            <span className="hidden sm:inline">MOBILE</span>
          </button>
          <button 
            onClick={() => setViewMode('desktop')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Monitor size={12} />
            <span className="hidden sm:inline">DESKTOP</span>
          </button>
        </div>

        {/* 📱 MOBILE FLOATING BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="lg:hidden fixed bottom-6 right-6 z-[60] bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 active:scale-95 transition-all"
        >
          {isSidebarOpen ? <Eye size={18} /> : <Edit3 size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isSidebarOpen ? 'Preview' : 'Edit'}
          </span>
        </button>

        {/* OVERLAY */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
            />
          )}
        </AnimatePresence>

        <Preview config={config} viewMode={viewMode} activeTab={activeTab} />
      </main>
    </div>
  );
}