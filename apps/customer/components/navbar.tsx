"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { BrandLogo } from "@/components/ui/brand-logo";

export const CustomerNavbar: React.FC<{ activeTab?: string; onSelectTab?: (tab: string) => void }> = ({
  activeTab = "home",
  onSelectTab,
}) => {
  const { cartCount, setIsCartOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (tab: string, e: React.MouseEvent) => {
    if (onSelectTab) {
      e.preventDefault();
      onSelectTab(tab);
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "menu", label: "Menu Catalog" },
    { id: "reservations", label: "Reservations" },
    { id: "tracking", label: "Track Order" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1DA] py-3 shadow-md"
          : "bg-transparent py-6 border-b border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={(e) => handleNavClick("home", e)}
          className="group"
        >
          <BrandLogo variant="dark" layout="horizontal" taglineText="Food Bank &bull; Lagos" iconSize={38} />
        </Link>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`group text-sm tracking-wide transition-colors duration-200 py-1.5 relative cursor-pointer font-medium ${
                  isActive ? "text-[#C86D3B] font-semibold" : "text-[#1A1817] hover:text-[#C86D3B]"
                }`}
              >
                {item.label}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#C86D3B] rounded-full transition-transform duration-300 ease-out origin-left ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`} 
                />
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Account Link */}
          <Link
            href="/account"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1A1817] hover:text-[#C86D3B] transition-colors py-2 px-3 rounded-md hover:bg-[#F4F0EA]"
          >
            <User className="w-4 h-4 text-[#6B6560]" />
            <span>Account</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-[#1A1817] hover:bg-[#C86D3B] text-[#FAF8F5] px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-widest transition-all shadow-2xs active:scale-98 cursor-pointer"
            aria-label="View Dining Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#FAF8F5]" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="ml-1 bg-[#C86D3B] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#1A1817] hover:bg-[#F4F0EA]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E6E1DA] px-6 py-6 animate-fade-in space-y-5 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`text-base font-medium py-2 border-b border-[#E6E1DA]/50 ${
                  activeTab === item.id ? "text-[#C86D3B] font-semibold" : "text-[#1A1817]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
          
          <div className="pt-2 flex items-center justify-between">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-[#1A1817]"
            >
              <User className="w-4 h-4 text-[#C86D3B]" />
              <span>VIP Guest Account</span>
            </Link>
            
            <div className="flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold uppercase tracking-wider text-[#6B6560] hover:text-[#1A1817] px-3 py-2 border border-[#E6E1DA] rounded"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold uppercase tracking-wider bg-[#1A1817] text-white px-3 py-2 rounded"
              >
                Join
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
