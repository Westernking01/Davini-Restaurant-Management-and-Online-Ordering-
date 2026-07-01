"use client";

import React from "react";

export interface BrandLogoProps {
  variant?: "light" | "dark" | "gold";
  layout?: "horizontal" | "vertical" | "compact" | "full";
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  iconSize?: number | string;
}

/**
 * Official Compact Emblem for Davini's Food Bank.
 * Features the transparent emblem icon derived from official brand assets.
 */
export const BrandIcon: React.FC<{
  size?: number | string;
  className?: string;
  variant?: "light" | "dark" | "gold";
}> = ({ size = 38, className = "" }) => {
  const numericSize = typeof size === "number" ? size : parseInt(size.toString(), 10) || 38;

  return (
    <img
      src="/logo-compact.png"
      alt="Davini's Food Bank Emblem"
      width={numericSize}
      height={numericSize}
      className={`shrink-0 object-contain select-none pointer-events-none ${className}`}
      style={{ width: numericSize, height: "auto", maxHeight: numericSize * 1.15 }}
    />
  );
};

/**
 * Complete Professional Brand Logo System for Davini's Food Bank
 * Dynamically switches between transparent Full Logo assets and Compact Emblem + Typography.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "dark",
  layout = "horizontal",
  showTagline = true,
  taglineText = "Premium Nigerian Cuisine • VIP Dining",
  className = "",
  iconSize = 38,
}) => {
  const textColor = variant === "light" ? "text-[#FAF8F5]" : variant === "gold" ? "text-[#EDD9AA]" : "text-[#1A1817]";
  const subColor = variant === "light" ? "text-[#C5BEBA]" : variant === "gold" ? "text-[#C9A96E]" : "text-[#6B6560]";

  // 1. Compact Layout: Only the Emblem / Icon
  if (layout === "compact") {
    return (
      <div className={`inline-flex items-center group cursor-pointer ${className}`}>
        <BrandIcon size={iconSize} variant={variant} className="transition-transform duration-300 group-hover:scale-105" />
      </div>
    );
  }

  // 2. Full / Vertical Layout: Uses official transparent Full Logo asset
  if (layout === "vertical" || layout === "full") {
    const fullLogoSrc = variant === "light" || variant === "gold" ? "/logo-full-light.png" : "/logo-full.png";
    const imgHeight = typeof iconSize === "number" ? iconSize * 3.2 : 120;

    return (
      <div className={`inline-flex flex-col items-center justify-center group cursor-pointer select-none ${className}`}>
        <img
          src={fullLogoSrc}
          alt="Davini's Food Bank - Premium Nigerian Cuisine"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none drop-shadow-sm"
          style={{ height: imgHeight, width: "auto", maxWidth: "100%" }}
        />
      </div>
    );
  }

  // 3. Horizontal Layout: Emblem Icon next to sharp, responsive typography
  return (
    <div className={`inline-flex items-center gap-3 group cursor-pointer select-none ${className}`}>
      <BrandIcon size={iconSize} variant={variant} className="transition-transform duration-300 group-hover:scale-105" />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-serif font-bold text-xl sm:text-2xl tracking-tight leading-none ${textColor}`}>
            Davini&apos;s
          </span>
          <span className="font-serif font-semibold text-[11px] sm:text-xs uppercase tracking-widest text-[#C86D3B]">
            Food Bank
          </span>
        </div>
        {showTagline && taglineText && (
          <span className={`text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-medium mt-1 block leading-none ${subColor}`}>
            {taglineText}
          </span>
        )}
      </div>
    </div>
  );
};
