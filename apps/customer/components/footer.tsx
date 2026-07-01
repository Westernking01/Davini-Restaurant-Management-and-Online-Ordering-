"use client";

import React, { useState } from "react";
import { Utensils, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BrandLogo } from "@/components/ui/brand-logo";

export const CustomerFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#1A1817] text-[#C5BEBA] border-t border-[#1A1817] pt-20 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Newsletter Banner */}
        <ScrollReveal direction="up">
          <div className="p-8 sm:p-12 rounded bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold block">
                Private Dining Club
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
                Curated Tasting Invites & Seasonal Menus
              </h3>
              <p className="text-xs sm:text-sm text-[#C5BEBA] font-normal leading-relaxed">
                Join our executive registry to receive weekly culinary dispatches and priority reservation privileges.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 min-w-[320px]">
              {subscribed ? (
                <div className="p-4 rounded bg-[#E8F0E9] text-[#1E3F20] text-xs font-semibold flex items-center justify-center w-full animate-scale-fade">
                  <span>Welcome to Davini&apos;s Registry</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3.5 rounded bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[#FAF8F5] placeholder:text-[#6B6560] text-xs focus:outline-none focus:border-[#C86D3B] focus:ring-2 focus:ring-[#C86D3B]/20 transition-all duration-200 flex-1 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded bg-[#C86D3B] hover:bg-[#FAF8F5] hover:text-[#1A1817] text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider transition-all duration-300 active:scale-98 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </form>
          </div>
        </ScrollReveal>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pt-4">
          
          {/* Col 1: Brand Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-start">
              <BrandLogo variant="light" layout="vertical" iconSize={36} />
            </div>
            <p className="text-xs text-[#C5BEBA] leading-relaxed font-normal">
              Redefining West African dining. We combine indigenous organic farm sourcing with authentic firewood cooking craftsmanship to deliver exceptional dining experiences.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#E8F0E9]">
              <ShieldCheck className="w-4 h-4 text-[#C86D3B] shrink-0" />
              <span>Certified Hygienic & Halal Kitchen</span>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF8F5]">Explore</h4>
            <ul className="space-y-2 text-xs text-[#C5BEBA]">
              <li><a href="#menu" className="hover:text-[#C86D3B] transition-colors">Menu Catalog</a></li>
              <li><a href="#reservations" className="hover:text-[#C86D3B] transition-colors">Table Bookings</a></li>
              <li><a href="#tracking" className="hover:text-[#C86D3B] transition-colors">Order Tracking</a></li>
              <li><a href="#about" className="hover:text-[#C86D3B] transition-colors">Our Heritage</a></li>
            </ul>
          </div>

          {/* Col 3: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF8F5]">Flagship Lounge</h4>
            <ul className="space-y-2.5 text-xs text-[#C5BEBA]">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#C86D3B] shrink-0 mt-0.5" />
                <span>14 Victoria Island Way, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C86D3B] shrink-0" />
                <span>+234 803 000 DAVINI</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#C86D3B] shrink-0" />
                <span>concierge@davinisfoodbank.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kitchen Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FAF8F5]">Hours of Service</h4>
            <div className="bg-[#FAF8F5]/5 p-4 rounded border border-[#FAF8F5]/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-[#C5BEBA]">
                <span>Mon - Fri</span>
                <span className="font-semibold text-[#FAF8F5]">9:00 AM - 10:30 PM</span>
              </div>
              <div className="flex items-center justify-between text-[#C5BEBA]">
                <span>Sat - Sun</span>
                <span className="font-semibold text-[#C86D3B]">10:00 AM - 11:30 PM</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center text-[#E8F0E9] font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C86D3B]" />
                <span>Concierge Delivery Available</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6560] gap-4">
          <p>&copy; {new Date().getFullYear()} Davini&apos;s Food Bank Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-[#C5BEBA] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#C5BEBA] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#C5BEBA] transition-colors">Hygiene Charter</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
