"use client";
import React, { useState, useEffect, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation'; 
import Sidebar from '../components/Sidebar';
import Preview from '../components/Preview';
import { BACKGROUNDS } from '../constants/backgrounds';
import { COLOR_PALETTE } from '../constants/colors'; 
import { Edit3, Eye, Monitor, Smartphone, AlertTriangle, X, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function EditorContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // 📍 Modal States
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSlugModal, setShowSlugModal] = useState(false);
  
  const [isEligible, setIsEligible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  const [config, setConfig] = useState({
    background: '#ffffff',
    useAnimation: false,
    animationId: 'none',
    headerTitle: 'The Celebration',
    imageStyle: 'frame',
    title: 'Juan & Maria',
    titleFont: 'font-serif', 
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateFormat: 'long', 
    showTime: false,
    eventTime: '15:00',
    location: 'Makati City, Metro Manila',
    welcomeMessage: 'We invite you to join us as we celebrate our love and begin our new journey together.',
    messageFont: 'font-serif',
    slug: '', // Naka-default na blangko
    showQA: false,
    showStory: false,
    story: '',
    showAttire: false,
    attireTitle: 'Rustic Pastel Theme',
    attireColors: [COLOR_PALETTE[0].value, COLOR_PALETTE[1].value, COLOR_PALETTE[2].value], 
    menAttireText: 'Long sleeves, slacks, or formal suit',
    womenAttireText: 'Cocktail dress, long gown, or formal attire',
  });

  // 🎯 ONBOARDING ADAPTER: Kumukuha ng wizard variables nang hindi pinapakialaman ang slug status
  useEffect(() => {
    const isFromInit = searchParams.get('init') === 'true';
    if (!isFromInit) return; 

    const eventParam = searchParams.get('event');
    const themeParam = searchParams.get('theme');
    const celebrantParam = searchParams.get('celebrant');

    setConfig((prevConfig) => {
      let nextConfig = { ...prevConfig };

      if (celebrantParam) {
        nextConfig.title = celebrantParam;
      }

      // 🎯 FIXED: Laging blangko ang slug dito para masunod ang gusto mong manual naming rule sa sidebar
      nextConfig.slug = ''; 

      if (eventParam) {
        if (eventParam === 'wedding') {
          nextConfig.headerTitle = 'THE WEDDING OF';
          nextConfig.titleFont = 'font-serif';
          nextConfig.welcomeMessage = 'We invite you to join us as we celebrate our love and exchange vows to begin our beautiful journey together.';
        } else if (eventParam === 'birthday') {
          nextConfig.headerTitle = 'CELEBRATING THE BIRTHDAY OF';
          nextConfig.titleFont = 'font-sans';
          nextConfig.welcomeMessage = 'Cheers to another beautiful year of life, laughter, and blessings! Come and celebrate this special milestone with us.';
        } else if (eventParam === 'baptism') {
          nextConfig.headerTitle = 'THE HOLY BAPTISM OF';
          nextConfig.titleFont = 'font-serif';
          nextConfig.welcomeMessage = 'Please join us as our little angel receives the holy blessing and is welcomed into the grace of God.';
        } else if (eventParam === 'party') {
          nextConfig.headerTitle = 'YOU ARE INVITED TO';
          nextConfig.titleFont = 'font-sans';
          nextConfig.welcomeMessage = 'Get ready for a night full of music, drinks, and unforgettable memories! The celebration won’t be complete without you.';
        } else if (eventParam === 'success') {
          nextConfig.headerTitle = 'IN HONOR OF THE ACHIEVEMENT OF';
          nextConfig.titleFont = 'font-serif';
          nextConfig.welcomeMessage = 'Hard work finally pays off! Share the pride and joy of this milestone achievement as we toast to new beginnings.';
        }
      }

      if (themeParam) {
        if (themeParam === 'minimalist') {
          nextConfig.background = '#ffffff';
          nextConfig.useAnimation = false;
          nextConfig.animationId = 'none';
          nextConfig.showAttire = true;
          nextConfig.attireTitle = 'Minimalist Monochromatic Theme';
          nextConfig.attireColors = ['#F8FAFC', '#64748B', '#0F172A']; 
        } else if (themeParam === 'luxury') {
          nextConfig.background = '#0f172a'; 
          nextConfig.useAnimation = true;
          nextConfig.animationId = 'gold_sparkles'; 
          nextConfig.showAttire = true;
          nextConfig.attireTitle = 'Luxury Black & Gold Formal Attire';
          nextConfig.attireColors = ['#0F172A', '#D97706', '#FEF3C7']; 
        } else if (themeParam === 'rose') {
          nextConfig.background = '#FFF1F2'; 
          nextConfig.useAnimation = true;
          nextConfig.animationId = 'falling_petals'; 
          nextConfig.showAttire = true;
          nextConfig.attireTitle = 'Pastel Pink & Romantic Rose Palette Theme';
          nextConfig.attireColors = ['#FFE4E6', '#F43F5E', '#FB7185']; 
        } else if (themeParam === 'midnight') {
          nextConfig.background = '#000000'; 
          nextConfig.useAnimation = true;
          nextConfig.animationId = 'neon_glow'; 
          nextConfig.showAttire = true;
          nextConfig.attireTitle = 'Midnight Cyber Glow Vibrant Neon Theme';
          nextConfig.attireColors = ['#000000', '#6366F1', '#EC4899']; 
        }
      }

      return nextConfig;
    });
  }, [searchParams]);

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
      if (hasInteracted) setShowDateModal(true);
    } else {
      setIsEligible(true);
      setShowDateModal(false);
    }
  }, [config.eventDate, hasInteracted]);

  // --- 📍 CHATBOT HIDER LOGIC ---
  useEffect(() => {
    const hasChatbot = document.querySelector('script[src*="tuqlas.com"]') || 
                      document.querySelector('[class*="tuqlas"]');
    if (hasChatbot) { window.location.reload(); return; }
    const hideChatbot = () => {
      const scripts = document.querySelectorAll('script[src*="tuqlas.com"]');
      scripts.forEach(s => s.remove());
      const chatbotElements = document.querySelectorAll('.tuqlas-chatbot-container, #tuqlas-chatbot, [class*="tuqlas"]');
      chatbotElements.forEach(el => { if (el instanceof HTMLElement) el.remove(); });
    };
    hideChatbot();
    const interval = setInterval(hideChatbot, 500);
    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const handlePublish = async (calculatedTotal: number) => {
    if (!isEligible) {
        setHasInteracted(true);
        return setShowDateModal(true);
    }
    if (!config.slug) {
        return setShowSlugModal(true);
    }

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

  const handleConfigChange = (newConfig: any) => {
    if (newConfig.eventDate !== config.eventDate) setHasInteracted(true);
    setConfig(newConfig);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 relative">
      <AnimatePresence>
        {/* 1. DATE WARNING MODAL */}
        {showDateModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border-t-[10px] border-amber-500">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Invalid Event Date</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                To ensure high-quality service, invitations must be created at least **7 days prior** to the event. Please select a later date to proceed.
              </p>
              <button onClick={() => setShowDateModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase">
                Update Event Date
              </button>
            </motion.div>
          </div>
        )}

        {/* 2. SLUG/URL WARNING MODAL */}
        {showSlugModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border-t-[10px] border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Link2 className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Missing Custom URL</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                Your invitation requires a unique link. Please provide a custom URL name in **Step 06 (Custom URL)** before publishing.
              </p>
              <button onClick={() => setShowSlugModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase">
                Set Custom URL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-[380px] max-w-[85vw] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar config={config} setConfig={handleConfigChange} onPublish={handlePublish} isPublishing={isPublishing} onClose={() => setIsSidebarOpen(false)} activeTab={activeTab} setActiveTab={setActiveTab} isEligible={isEligible} />
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center p-2 md:p-8 bg-slate-200 relative text-slate-900">
        <div className="absolute top-4 md:top-8 flex gap-1 bg-white p-1 rounded-full shadow-xl z-30 border border-slate-100">
          <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
            <Smartphone size={12} /> <span className="hidden sm:inline">MOBILE</span>
          </button>
          <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black transition-all ${viewMode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
            <Monitor size={12} /> <span className="hidden sm:inline">DESKTOP</span>
          </button>
        </div>

        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed bottom-6 right-6 z-[60] bg-slate-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 active:scale-95 transition-all">
          {isSidebarOpen ? <Eye size={18} /> : <Edit3 size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{isSidebarOpen ? 'Preview' : 'Edit'}</span>
        </button>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          )}
        </AnimatePresence>

        <Preview config={config} viewMode={viewMode} activeTab={activeTab} isSidebarOpen={isSidebarOpen} />
      </main>
    </div>
  );
}

export default function NvitadoEditor() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 font-black text-xs tracking-widest text-slate-400 uppercase">
        ⚡ Loading Onboarding Configuration Preset...
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}