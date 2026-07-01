"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ShieldCheck } from "lucide-react";

interface AuthVisualPanelProps {
  bgImageUrl: string;
  quote: string;
  quoteHighlight?: string;
  subquote?: string;
  badges?: string[];
}

export const AuthVisualPanel: React.FC<AuthVisualPanelProps> = ({
  bgImageUrl,
  quote,
  quoteHighlight,
  subquote,
  badges = ["VIP Dining Club", "Firewood Specialties", "Express Dispatch"],
}) => {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:min-h-screen relative flex-col justify-between overflow-hidden bg-[#14110F] select-none animate-fade-in border-r border-[#2A2420]">
      {/* 1. Base Image with Cinematic Zoom */}
      <img
        src={bgImageUrl}
        alt="Davini's Food Bank Dining Experience"
        className="absolute inset-0 w-full h-full object-cover animate-auth-zoom object-center pointer-events-none"
      />

      {/* 2. Controlled Layered Overlay System for WCAG AA/AAA Readability */}
      {/* Base image subtle toning */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Left side directional dark gradient protecting left-aligned text while preserving right image visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent pointer-events-none" />

      {/* Bottom-up rich gradient protecting center heading and footer information */}
      <div className="absolute bottom-0 inset-x-0 h-[70%] bg-gradient-to-t from-[#14110F] via-[#14110F]/85 to-transparent pointer-events-none" />

      {/* 3. Top Header: Protected Logo Area with Subtle Glass Badge */}
      <div className="relative z-10 p-8 xl:p-12 flex items-center justify-between w-full">
        <div className="bg-[#14110F]/65 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#FAF8F5]/20 shadow-lg">
          <Link href="/" className="group block">
            <BrandLogo
              variant="light"
              layout="horizontal"
              taglineText="Dining Registry"
              iconSize={36}
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#FAF8F5] bg-black/55 backdrop-blur-md px-3.5 py-2 rounded-full border border-[#FAF8F5]/30 shadow-md">
          <ShieldCheck className="w-4 h-4 text-[#D97706]" />
          <span className="font-bold tracking-wide">Encrypted VIP Portal</span>
        </div>
      </div>

      {/* 4. Center Storytelling Area with WCAG AAA Contrast */}
      <div className="relative z-10 px-8 xl:px-12 my-auto max-w-xl space-y-4 py-8">
        <span className="inline-block text-[11px] uppercase tracking-[0.24em] font-bold text-[#D97706] bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded border border-[#D97706]/40 shadow-sm">
          Davini&apos;s Hospitality
        </span>

        <h1 className="font-serif text-3xl xl:text-4xl 2xl:text-5xl font-bold tracking-tight text-[#FAF8F5] leading-[1.18] drop-shadow-lg">
          {quote}
          {quoteHighlight && (
            <span className="block text-[#D97706] font-semibold italic mt-1.5 drop-shadow-md">
              {quoteHighlight}
            </span>
          )}
        </h1>

        {subquote && (
          <p className="text-sm xl:text-base text-[#F5F5F5] font-medium leading-relaxed drop-shadow-md opacity-95">
            {subquote}
          </p>
        )}
      </div>

      {/* 5. Bottom Floating Badges & High-Contrast Footer */}
      <div className="relative z-10 p-8 xl:p-12 space-y-6 mt-auto">
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-black/55 backdrop-blur-md border border-[#FAF8F5]/30 text-[#FAF8F5] text-[11px] font-bold tracking-wider uppercase shadow-md transition-transform hover:scale-105"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div className="pt-5 border-t border-[#FAF8F5]/30 flex items-center justify-between text-xs font-semibold text-[#F5F5F5]">
          <span className="tracking-wide">Victoria Island &bull; Maitama &bull; Lekki</span>
          <span className="text-[#D5CEC8] font-medium">&copy; {new Date().getFullYear()} Davini&apos;s Food Bank</span>
        </div>
      </div>
    </div>
  );
};
