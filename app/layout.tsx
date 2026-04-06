import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nvitado | Online Invitation Builder",
  description: "Create your elegant online invitation in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}