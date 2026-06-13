"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // 🎯 Nagdagdag tayo ng state para bantayan ang aktwal na domain ng user
  const [isWeddingDomain, setIsWeddingDomain] = useState(false);

  useEffect(() => {
    // 🎯 Kapag nag-load na sa browser, iche-check natin kung nasa wedding subdomain siya
    if (window.location.hostname.includes("wedding.nvitado.com") || window.location.hostname.includes("wedding")) {
      setIsWeddingDomain(true);
    }
  }, []);

  // 📍 Listahan ng mga pages na DAPAT may Navbar at Footer
  // 🎯 Idinagdag natin ang `!isWeddingDomain` para siguraduhing HINDI siya lalabas sa wedding site
  const showSharedUI = !isWeddingDomain && (
    pathname === "/" || 
    pathname === "/pricing" || 
    pathname === "/terms" || 
    pathname === "/support"
  );

  return (
    <html lang="en">
      <head>
        <title>Nvitado | Professional Digital Invitations</title>
        <meta name="description" content="Create stunning, high-performance digital invitations in minutes." />
        <link rel="icon" href="/assets/images/logo.png" />
        <link rel="apple-touch-icon" href="/assets/images/logo.png" />
      </head>
      <body className="antialiased">
        
        {/* 📍 Navbar Logic */}
        {showSharedUI && <Navbar />}
        
        {children}

        {/* 📍 Footer Logic - Lalabas lang sa main pages */}
        {showSharedUI && <Footer />}

        {/* 📍 TUQLAS CHATBOT EMBED */}
        {/*
        <Script 
          src={`${process.env.NEXT_PUBLIC_TUQLAS_API}/embed.js`}
          data-key={process.env.NEXT_PUBLIC_TUQLAS_KEY}
          data-api={process.env.NEXT_PUBLIC_TUQLAS_API}
          strategy="afterInteractive"
        />
        */}

        <Analytics />
      </body>
    </html>
  );
}