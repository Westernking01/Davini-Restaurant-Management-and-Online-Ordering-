"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, ChevronDown, Package, LogOut } from "lucide-react";
import { useApp } from "@/lib/context/app-context";
import { BrandLogo } from "@/components/ui/brand-logo";
import { logoutCustomer } from "@/lib/auth";

export const CustomerNavbar: React.FC<{ activeTab?: string; onSelectTab?: (tab: string) => void }> = ({
  activeTab = "home",
  onSelectTab,
}) => {
  const { cartCount, setIsCartOpen, authUser } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (tab: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      if (window.location.pathname !== "/") {
        window.location.href = `/#${tab}`;
      } else {
        const el = document.getElementById(tab);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { id: "home", label: "Lounge Home" },
    { id: "menu", label: "Executive Menu" },
    { id: "reservations", label: "Table Reservation" },
    { id: "tracking", label: "Live Pipeline" },
    { id: "about", label: "Davini Heritage" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1DA] py-3 shadow-xs"
          : "bg-[#FAF8F5] py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              handleNavClick("home", e);
            }
          }}
        >
          <BrandLogo layout="compact" />
        </Link>

        {/* Desktop Navigation Links */}
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
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Account Section / Login & Signup */}
          {authUser ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#E6E1DA] hover:border-[#C86D3B] bg-[#FFFFFF] transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#1A1817] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-xs">
                  {authUser?.user_metadata?.full_name?.charAt(0) || authUser?.email?.charAt(0)?.toUpperCase() || "V"}
                </div>
                <span className="text-xs font-semibold text-[#1A1817] max-w-[110px] truncate">
                  {authUser?.user_metadata?.full_name?.split(" ")[0] || authUser?.email?.split("@")[0] || "VIP Member"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#6B6560] transition-transform duration-200 ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {accountMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] rounded-xl border border-[#E6E1DA] shadow-xl z-50 p-4 space-y-3 animate-fade-in origin-top-right">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-[#E6E1DA]/60">
                      <div className="w-10 h-10 rounded-full bg-[#C86D3B] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-sm">
                        {authUser?.user_metadata?.full_name?.charAt(0) || authUser?.email?.charAt(0)?.toUpperCase() || "V"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#1A1817] truncate">
                          {authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0] || "VIP Member"}
                        </h4>
                        <p className="text-[11px] text-[#6B6560] truncate font-mono">{authUser?.email}</p>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-1">
                      <Link
                        href="/account?tab=profile"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-[#1A1817] hover:bg-[#FAF8F5] hover:text-[#C86D3B] rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-[#C86D3B]" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/account?tab=orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-[#1A1817] hover:bg-[#FAF8F5] hover:text-[#C86D3B] rounded-lg transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#C86D3B]" />
                        <span>My Orders</span>
                      </Link>
                    </div>

                    {/* Divider & Logout */}
                    <div className="pt-2 border-t border-[#E6E1DA]/60">
                      <button
                        type="button"
                        onClick={async () => {
                          setAccountMenuOpen(false);
                          await logoutCustomer();
                          window.location.href = "/";
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-wider text-[#1A1817] hover:text-[#C86D3B] transition-colors py-2 px-3 rounded hover:bg-[#F4F0EA]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold uppercase tracking-wider bg-[#1A1817] text-[#FAF8F5] hover:bg-[#C86D3B] transition-all duration-200 py-2 px-4 rounded-md shadow-2xs active:scale-95"
              >
                Signup
              </Link>
            </div>
          )}

          {/* Cart Trigger */}
          <button
            type="button"
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
            type="button"
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
          
          <div className="pt-2">
            {authUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#FFFFFF] rounded-lg border border-[#E6E1DA]">
                  <div className="w-10 h-10 rounded-full bg-[#C86D3B] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-base">
                    {authUser?.user_metadata?.full_name?.charAt(0) || authUser?.email?.charAt(0)?.toUpperCase() || "V"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm text-[#1A1817] truncate">
                      {authUser?.user_metadata?.full_name || authUser?.email?.split("@")[0]}
                    </h4>
                    <p className="text-[11px] text-[#6B6560] font-mono truncate">{authUser?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/account?tab=profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#FFFFFF] border border-[#E6E1DA] text-xs font-semibold text-[#1A1817]"
                  >
                    <User className="w-3.5 h-3.5 text-[#C86D3B]" /> My Profile
                  </Link>
                  <Link
                    href="/account?tab=orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#FFFFFF] border border-[#E6E1DA] text-xs font-semibold text-[#1A1817]"
                  >
                    <Package className="w-3.5 h-3.5 text-[#C86D3B]" /> My Orders
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logoutCustomer();
                    window.location.href = "/";
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] text-[#DC2626] text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 w-full">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center text-xs font-bold uppercase tracking-wider text-[#1A1817] py-3 border border-[#E6E1DA] rounded-lg bg-[#FFFFFF]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center text-xs font-bold uppercase tracking-wider bg-[#1A1817] text-[#FAF8F5] py-3 rounded-lg shadow-sm"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
