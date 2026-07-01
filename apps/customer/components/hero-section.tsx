"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  Sparkles,
  MapPin,
  Flame,
  ShoppingBag
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

interface SlideData {
  id: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  description: string;
  primaryCtaText: string;
  primaryCtaAction: "explore" | "reserve" | "track";
  secondaryCtaText: string;
  secondaryCtaAction: "explore" | "reserve" | "about" | "track";
  humanImage: string;
  humanImageAlt: string;
  bgShapeColor: string;
  floatingCards: Array<{
    stepNumber: string;
    title: string;
    subtitle: string;
    time?: string;
  }>;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: "royal-experience",
    headlineLine1: "It's not just Food,",
    headlineLine2: "It's a Royal",
    headlineLine3: "Experience.",
    description: "Order your favorite firewood dishes from Davini's Food Bank in minutes.",
    primaryCtaText: "Order Now",
    primaryCtaAction: "explore",
    secondaryCtaText: "Make a reservation",
    secondaryCtaAction: "reserve",
    humanImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    humanImageAlt: "Smiling customer holding Davini's food delivery bag with both hands",
    bgShapeColor: "from-[#F2A93B] via-[#E88C24] to-[#C86D3B]",
    floatingCards: [
      {
        stepNumber: "1",
        title: "We've Received your order!",
        subtitle: "Awaiting Restaurant acceptance",
        time: "now",
      },
      {
        stepNumber: "2",
        title: "Order Accepted!",
        subtitle: "Your order will be delivered shortly.",
      },
      {
        stepNumber: "3",
        title: "Your Rider is nearby!",
        subtitle: "They are almost there - Get ready.",
        time: "now",
      },
    ],
  },
  {
    id: "firewood-heritage",
    headlineLine1: "Centuries of Craft,",
    headlineLine2: "Served at Your",
    headlineLine3: "Tabletop.",
    description: "Savor authentic Nigerian firewood Jollof and flamed Suya crafted by executive chefs.",
    primaryCtaText: "Explore Menu",
    primaryCtaAction: "explore",
    secondaryCtaText: "Our Story",
    secondaryCtaAction: "about",
    humanImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    humanImageAlt: "Cheerful woman holding warm gourmet takeaway package",
    bgShapeColor: "from-[#2A4C2C] via-[#1E3F20] to-[#142A15]",
    floatingCards: [
      {
        stepNumber: "1",
        title: "Fresh Ingredients Selected",
        subtitle: "100% organic farm grains & spices",
        time: "now",
      },
      {
        stepNumber: "2",
        title: "Firewood Simmering Active",
        subtitle: "Master Chef Adebayo inspecting taste.",
      },
      {
        stepNumber: "3",
        title: "Sealed in Thermal Bag!",
        subtitle: "Guaranteed steaming hot delivery.",
        time: "now",
      },
    ],
  },
  {
    id: "private-banquet",
    headlineLine1: "Flagship Dining,",
    headlineLine2: "Tailored for VIP",
    headlineLine3: "Moments.",
    description: "Reserve executive dining parlors and private balconies for unforgettable celebrations.",
    primaryCtaText: "Book VIP Table",
    primaryCtaAction: "reserve",
    secondaryCtaText: "View Catalog",
    secondaryCtaAction: "explore",
    humanImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    humanImageAlt: "Executive host smiling warmly ready for dining reservation guests",
    bgShapeColor: "from-[#D9822B] via-[#C86D3B] to-[#8C441E]",
    floatingCards: [
      {
        stepNumber: "1",
        title: "Table for 2 Requested",
        subtitle: "Flagship Victoria Island Lounge",
        time: "now",
      },
      {
        stepNumber: "2",
        title: "Concierge Confirmed!",
        subtitle: "Balcony alcove reserved with wine pairing.",
      },
      {
        stepNumber: "3",
        title: "Welcome Cocktail Ready",
        subtitle: "Your private host awaits your arrival.",
        time: "now",
      },
    ],
  },
];

const AUTOPLAY_DURATION = 6000; // Exact 6 seconds per slide

export const HeroSection: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slide = HERO_SLIDES[currentIndex];

  const advanceSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / AUTOPLAY_DURATION) * 100);
      setProgress(pct);

      if (pct >= 100) {
        advanceSlide();
      }
    }, 40);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, advanceSlide]);

  const handleActionClick = (action: string) => {
    if (action === "explore") {
      onExplore();
    } else if (action === "reserve") {
      const el = document.getElementById("reservations");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = "#reservations";
    } else if (action === "track") {
      const el = document.getElementById("tracker");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = "#tracker";
    } else if (action === "about") {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.location.hash = "#about";
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Exact Reference Composition Hero Container Card */}
        <div key={slide.id} className="bg-[#FFFFFF] rounded-[2rem] sm:rounded-[2.5rem] border border-[#E6E1DA] shadow-xl p-6 sm:p-10 lg:p-14 xl:p-16 relative overflow-hidden">
          
          {/* Decorative floating geometric shapes matching reference */}
          <div className="absolute top-10 left-1/3 w-8 h-8 rounded-tr-xl rounded-bl-xl bg-[#FDE68A] rotate-45 opacity-60 pointer-events-none animate-pulse" />
          <div className="absolute bottom-16 left-1/4 w-10 h-10 rounded-full bg-[#FCE7F3] opacity-60 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
            
            {/* LEFT SIDE: Large Emotional Headline, Subtitle & Pill CTAs */}
            <div className="lg:col-span-6 space-y-7 text-left lg:pr-6">
              
              <div className="space-y-1 animate-fade-in-up">
                <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold text-[#1A1817] tracking-tight leading-[1.12]">
                  <span className="block">{slide.headlineLine1}</span>
                  <span className="block">{slide.headlineLine2}</span>
                  <span className="block text-[#C86D3B]">{slide.headlineLine3}</span>
                </h1>
              </div>

              <p 
                className="text-sm sm:text-base lg:text-lg text-[#5C554E] max-w-lg font-normal leading-relaxed animate-fade-in-up"
                style={{ animationDelay: "150ms" }}
              >
                {slide.description}
              </p>

              {/* Pill-shaped CTA Buttons matching exact reference */}
              <div 
                className="flex flex-wrap items-center gap-4 pt-2 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <button
                  onClick={() => handleActionClick(slide.primaryCtaAction)}
                  className="bg-[#1E3F20] hover:bg-[#142A15] text-[#FFFFFF] font-bold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  {slide.primaryCtaText}
                </button>
                <button
                  onClick={() => handleActionClick(slide.secondaryCtaAction)}
                  className="bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#1A1817] border border-[#D5CEC8] hover:border-[#C86D3B] font-bold text-xs sm:text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-xs active:scale-95 cursor-pointer"
                >
                  {slide.secondaryCtaText}
                </button>
              </div>

            </div>

            {/* RIGHT SIDE: Bold Brand-Colored Shape + Smiling Human Image + Stacked Order Notification Cards */}
            <div className="lg:col-span-6 relative min-h-[480px] sm:min-h-[540px] flex items-end justify-center lg:justify-end">
              
              {/* Reference Curved Brand Background Backdrop Shape */}
              <div className={`absolute top-4 right-0 bottom-0 left-8 sm:left-16 rounded-[3rem] sm:rounded-[4rem] rounded-tr-none bg-gradient-to-br ${slide.bgShapeColor} shadow-inner overflow-hidden transition-all duration-1000`} />

              {/* Background Outline Numbers behind cards (1, 2, 3) */}
              <div className="absolute right-4 top-8 text-[#FFFFFF]/25 font-serif font-black text-7xl select-none pointer-events-none">
                1
              </div>
              <div className="absolute right-4 top-[42%] text-[#FFFFFF]/25 font-serif font-black text-7xl select-none pointer-events-none">
                2
              </div>
              <div className="absolute right-4 bottom-10 text-[#FFFFFF]/25 font-serif font-black text-7xl select-none pointer-events-none">
                3
              </div>

              {/* Human Portrait facing forward holding bag with natural smile */}
              <div className="relative z-10 w-full max-w-[380px] sm:max-w-[440px] h-[440px] sm:h-[500px] flex items-end justify-center mr-auto sm:mr-16">
                <img
                  key={`human-${slide.id}`}
                  src={slide.humanImage}
                  alt={slide.humanImageAlt}
                  className="w-full h-full object-cover object-top rounded-b-[2.5rem] animate-hero-img-enter drop-shadow-2xl"
                />
              </div>

              {/* Floating Order Notification Cards stacked vertically on right side */}
              <div className="absolute top-6 right-2 sm:right-4 z-20 flex flex-col gap-3.5 max-w-[250px] sm:max-w-[290px]">
                {slide.floatingCards.map((card, idx) => (
                  <div
                    key={`card-${slide.id}-${idx}`}
                    className="bg-[#FFFFFF]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-[#FAF8F5] transition-all duration-500 animate-slide-in-right"
                    style={{ animationDelay: `${idx * 180 + 250}ms` }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center shrink-0">
                          <BrandLogo variant="dark" layout="compact" iconSize={12} showTagline={false} />
                        </div>
                        <span className="font-serif font-bold text-[11px] sm:text-xs text-[#1A1817] truncate">
                          {card.title}
                        </span>
                      </div>
                      {card.time && (
                        <span className="text-[10px] text-[#8C827A] font-medium shrink-0">
                          {card.time}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#5C554E] font-medium leading-snug pl-6">
                      {card.subtitle}
                    </p>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Bottom Center Autoplay Indicator Dots / Progress matching reference footer area */}
          <div className="mt-10 pt-6 border-t border-[#E6E1DA]/60 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={s.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? "w-8 bg-[#1E3F20]" : "w-2 bg-[#D5CEC8]"
                  }`}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
