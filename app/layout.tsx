import type { Metadata } from "next";
import "./globals.css";
import SmoothScroller from "@/reuseable/SmoothScroller";
import WaveGridBackground from "@/reuseable/wave-grid-background";
import { epilogue, satoshi } from "@/fonts/font";
import Navbar from "@/reuseable/Navbar";
import Footer from "@/reuseable/Footer";



export const metadata: Metadata = {
  title: "Joyzen",
  description: "Joyzen Patient Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${epilogue.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-white text-foreground font-sans">
        {/* Full-site 3D Honeycomb background with localized #EF8F60 border glow */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
          <WaveGridBackground colorBase="#ffffff" colorHigh="#EF8F60" autoAnimate={false} waveAmplitude={0.5} waveMaxHeight={0.5} />
        </div>
        <SmoothScroller>
          <Navbar />
          {children}
          <Footer />
        </SmoothScroller>
      </body>
    </html>
  );
}
