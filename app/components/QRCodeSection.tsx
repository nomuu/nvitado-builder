"use client";
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeSection({ url }: { url: string }) {
  return (
    <div className="bg-white p-2 border-4 border-slate-900 rounded-xl shadow-sm">
      <QRCodeSVG 
        value={url} 
        size={120}
        level={"H"}
        includeMargin={false}
        imageSettings={{
          src: "/assets/images/logo.png", // Optional: Lagyan mo ng logo sa gitna kung gusto mo
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
    </div>
  );
}