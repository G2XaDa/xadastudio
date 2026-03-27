import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import CursorDistortion from "@/components/CursorDistortion";
import { TransitionProvider } from "@/components/PageTransition";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xada Studio",
  description: "Xada Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable}`}>
      <body className="min-h-full antialiased">
        <TransitionProvider>
          <CursorDistortion />
          <SmoothScroll />
          <Navbar />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
