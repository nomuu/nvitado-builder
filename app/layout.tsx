import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nvitado | Professional Digital Invitations",
  description: "Create stunning, high-performance digital invitations in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* 📍 TUQLAS CHATBOT EMBED - SECURED VIA ENV */}
        <Script 
          src={`${process.env.NEXT_PUBLIC_TUQLAS_API}/embed.js`}
          data-key={process.env.NEXT_PUBLIC_TUQLAS_KEY}
          data-api={process.env.NEXT_PUBLIC_TUQLAS_API}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}