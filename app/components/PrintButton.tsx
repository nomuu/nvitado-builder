"use client";
import React from 'react';
import { Download, QrCode } from 'lucide-react';
import { toJpeg } from 'html-to-image';

interface PrintButtonProps {
  targetId: string;
  mode?: 'receipt' | 'qr';
}

export default function PrintButton({ targetId, mode = 'receipt' }: PrintButtonProps) {
  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      const dataUrl = await toJpeg(element, { 
        quality: 0.95,
        backgroundColor: '#FFFFFF',
        style: {
          borderRadius: '0',
        }
      });
      
      const link = document.createElement('a');
      link.download = mode === 'qr' ? `nvitado-qr.jpg` : `nvitado-receipt.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (mode === 'qr') {
    return (
      <button 
        onClick={handleDownload}
        className="flex items-center justify-center gap-3 w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-center shadow-lg hover:bg-rose-600 transition-all active:scale-95"
      >
        <QrCode size={16} className="text-white" /> Download QR Image
      </button>
    );
  }

  return (
    <button 
      onClick={handleDownload}
      className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 border-2 border-slate-200 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-center shadow-sm hover:border-rose-500 transition-all active:scale-95"
    >
      <Download size={16} className="text-rose-500" /> Download Full Receipt
    </button>
  );
}