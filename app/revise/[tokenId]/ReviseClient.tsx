"use client";
import React, { useState, useEffect } from 'react'; 
// Pakisiguro na tama itong relative path base sa folder mo
import Sidebar from '../../components/Sidebar';
import Preview from '../../components/Preview';
import { BACKGROUNDS } from '../../constants/backgrounds';
import { Edit3, Eye, Monitor, Smartphone, AlertTriangle, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ReviseClient({ initialData }: { initialData: any }) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  
  // 📍 Modal States
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSlugModal, setShowSlugModal] = useState(false);
  
  const [isEligible, setIsEligible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // 📍 Load initial config from Supabase
  const [config, setConfig] = useState(initialData.config_data);
  const [revisionCredits, setRevisionCredits] = useState(initialData.revision_count);

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

  const handleUpdateSave = async () => {
    // 1. Check Date Eligibility
    if (!isEligible) {
        setHasInteracted(true);
        return setShowDateModal(true);
    }
    // 2. Check Credits
    if (revisionCredits <= 0) {
        alert("You have no revision credits left.");
        return;
    }

    setIsSaving(true);
    try {
      // Dito natin tatawagin yung save API (gagawin natin next)
      const res = await fetch('/api/save-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            tokenId: initialData.token_id, 
            config: config,
            currentCredits: revisionCredits 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setRevisionCredits(data.newCount);
        alert("Invitation updated successfully!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigChange = (newConfig: any) => {
    if (newConfig.eventDate !== config.eventDate) setHasInteracted(true);
    setConfig(newConfig);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 relative">
      
      <AnimatePresence>
        {/* DATE WARNING MODAL */}
        {showDateModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border-t-[10px] border-amber-500">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">Invalid Event Date</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                Invitations must be at least **7 days prior** to the event. Please select a later date.
              </p>
              <button onClick={() => setShowDateModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase">
                Update Event Date
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIDEBAR - Injected with Revision UI */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-[380px] max-w-[85vw] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            {/* Revision Header */}
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Revision Mode</span>
                    <span className="text-[10px] font-black bg-rose-600 px-2 py-0.5 rounded text-white">{revisionCredits} CREDITS</span>
                </div>
                <h2 className="text-lg font-black uppercase italic tracking-tighter">Nvitado Editor</h2>
            </div>
            
            <div className="flex-1 overflow-hidden overflow-y-auto">
                <Sidebar 
                    config={config} 
                    setConfig={handleConfigChange} 
                    onPublish={handleUpdateSave} 
                    isPublishing={isSaving} 
                    onClose={() => setIsSidebarOpen(false)} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    isEligible={isEligible}
                    isRevision={true} // Idagdag natin ito para malaman ng Sidebar na Revision ito
                />
            </div>
        </div>
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

        <Preview config={config} viewMode={viewMode} activeTab={activeTab} />
      </main>
    </div>
  );
}