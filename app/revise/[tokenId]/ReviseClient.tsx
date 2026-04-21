"use client";
import React, { useState, useEffect } from 'react'; 
import Sidebar from '../../components/Sidebar';
import Preview from '../../components/Preview';
import { BACKGROUNDS } from '../../constants/backgrounds';
import { 
  Edit3, Eye, Monitor, Smartphone, AlertTriangle, 
  CheckCircle2, ExternalLink, Info, XCircle, ShoppingCart
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ReviseClient({ initialData }: { initialData: any }) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  
  // 📍 Modal States
  const [showDateModal, setShowDateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
  
  const [isEligible, setIsEligible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // 📍 Load initial config and counts from Supabase
  const [config, setConfig] = useState(initialData.config_data);
  const [revisionCredits, setRevisionCredits] = useState(initialData.revision_count);
  const [purchasableCredits, setPurchasableCredits] = useState(initialData.purchasable_revision_count || 0);

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

  // 📍 SAVE REVISION LOGIC
  const handleUpdateSave = async () => {
    if (!isEligible) {
        setHasInteracted(true);
        return setShowDateModal(true);
    }
    
    if (revisionCredits <= 0) {
        return setShowNoCreditsModal(true);
    }

    setIsSaving(true);
    try {
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
        setShowSuccessModal(true);
      } else if (data.error === "NO_CHANGES") {
        setShowNoChangesModal(true);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleConfigChange = (newConfig: any) => {
    if (newConfig.eventDate !== config.eventDate) setHasInteracted(true);
    setConfig(newConfig);
  };

  const viewLiveInvitation = () => {
    const liveUrl = `/${initialData.short_id}/${config.slug}`;
    window.location.href = liveUrl;
  };

  const handleBuyCredits = () => {
    window.location.href = `/checkout/revision?token=${initialData.token_id}`;
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

        {/* NO CREDITS REMAINING MODAL - INAYOS NA ANG SIZE */}
        {showNoCreditsModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center border-t-[10px] border-rose-500">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="text-rose-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">Out of Credits</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-6">
                You have **0 revision credits** left. {purchasableCredits > 0 ? `You can still purchase up to ${purchasableCredits} more.` : "Maximum revision limit reached."}
              </p>
              
              {purchasableCredits > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 Revision Credit</span>
                  <span className="text-lg font-black text-slate-900">₱20.00</span>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {purchasableCredits > 0 ? (
                  <button 
                    onClick={handleBuyCredits} 
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-emerald-700 transition-all uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
                  >
                    <ShoppingCart size={16} /> Buy 1 Credit
                  </button>
                ) : (
                  <div className="p-4 bg-slate-100 rounded-2xl text-[9px] font-black text-slate-400 uppercase">
                    Maximum Revisions Reached
                  </div>
                )}
                <button 
                  onClick={() => setShowNoCreditsModal(false)} 
                  className="w-full bg-white text-slate-400 py-3 rounded-xl font-bold text-[10px] tracking-widest hover:text-slate-600 transition-all uppercase"
                >
                  Cancel Revision
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* NO CHANGES DETECTED MODAL */}
        {showNoChangesModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border-t-[10px] border-blue-500">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">No Changes Found</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                We didn't detect any updates to save. No revision credits were deducted.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setShowNoChangesModal(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-800 transition-all uppercase">
                  Continue Editing
                </button>
                <button onClick={viewLiveInvitation} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] tracking-widest hover:bg-slate-200 transition-all uppercase">
                  Exit Revision
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SUCCESS SAVED MODAL */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-50 rounded-full z-0" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 shadow-lg shadow-emerald-200">
                  <CheckCircle2 className="text-white" size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Changes Live!</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                  Your updates have been applied. Guests can now see the new version.
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining Credits</span>
                  <span className="text-3xl font-black text-slate-900">{revisionCredits}</span>
                </div>
                <button 
                  onClick={viewLiveInvitation} 
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-slate-900 transition-all uppercase flex items-center justify-center gap-3 group"
                >
                  View Updated Invitation
                  <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-[380px] max-w-[85vw] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Revision Mode</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded text-white ${revisionCredits > 0 ? 'bg-rose-600' : 'bg-slate-600'}`}>
                        {revisionCredits} CREDITS LEFT
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                         {purchasableCredits} Add-ons available
                      </span>
                    </div>
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
                    isRevision={true}
                    revisionCredits={revisionCredits}
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