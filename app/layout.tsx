"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // 📍 Import dito

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // 📍 Listahan ng mga pages na DAPAT may Navbar at Footer
  const showSharedUI = pathname === "/" || 
                       pathname === "/pricing" || 
                       pathname === "/terms" || 
                       pathname === "/support";

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
      </body>
    </html>
  );
}