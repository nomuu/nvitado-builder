// app/wedding/templates/page.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Star, Palette } from 'lucide-react';

// 🎯 Dito natin hihilahin yung data mula sa constant file
import { weddingTemplates } from '../../constants/wedding-templates';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const } 
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

// 🎯 LISTAHAN NG CATEGORIES PARA SA FILTER
const categories = ["All", "Basic", "Standard", "Premium"];

export default function TemplatesPage() {
  // 🎯 STATE PARA SA ACTIVE FILTER
  const [activeFilter, setActiveFilter] = useState("All");

  // 🎯 LOGIC PARA I-FILTER ANG TEMPLATES BASE SA PINILING BUTTON
  const filteredTemplates = weddingTemplates.filter((template) => {
    if (activeFilter === "All") return true;
    return template.category === activeFilter;
  });

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-10 min-h-screen">
      
      {/* 🌸 HEADER SECTION */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-rose-50 text-rose-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-rose-100"
        >
          <Sparkles className="w-3 h-3" />
          Find Your Perfect Match
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 uppercase italic"
        >
          Curated <span className="text-rose-500 not-italic">Themes.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-slate-500 text-sm md:text-base font-medium leading-relaxed"
        >
          From clean minimal aesthetics to luxurious premium layouts. Click on any theme to view its live demo.
        </motion.p>
      </div>

      {/* 🎯 FILTER BUTTONS */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
              activeFilter === category
                ? "bg-slate-900 text-white shadow-md scale-105"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* 🖼️ TEMPLATES GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {filteredTemplates.map((template) => (
            <motion.div 
              key={template.id} 
              layout // 🎯 ITO ANG MAGPAPAGALAW NG SWABE SA MGA CARDS KAPAG NAG-FILTER
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group relative bg-white rounded-[2rem] p-4 border border-slate-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              {/* BUONG CARD AY NAGING LINK NA PAPUNTANG PREVIEW */}
              <Link href={`/wedding/templates/${template.id}`} className="flex flex-col h-full w-full outline-none">
                
                {/* Template Image Placeholder */}
                <div className={`relative w-full aspect-[4/3] rounded-2xl ${template.placeholderBg} overflow-hidden mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-[0.98]`}>
                  
                  {/* Popular Badge */}
                  {template.isPopular && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-500 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1 shadow-sm z-10">
                      <Star className="w-3 h-3 fill-amber-500" /> Best Seller
                    </div>
                  )}

                  {/* Icon / Image Placeholder */}
                  <Palette className="w-12 h-12 text-slate-900/10" />

                  {/* 🎯 HOVER OVERLAY: Nakatutok na lang sa Live Preview */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20">
                    <div className="bg-white text-slate-900 px-8 py-4 rounded-xl font-black text-xs tracking-widest uppercase flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                      <Eye className="w-5 h-5" /> View Live Demo
                    </div>
                  </div>
                </div>

                {/* Template Info (TINANGGAL NA YUNG SELECT BUTTON) */}
                <div className="px-2 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                        {template.category}
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ₱{template.price}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black tracking-tight text-slate-900 mb-1 uppercase italic group-hover:text-rose-500 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">
                      {template.theme}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}