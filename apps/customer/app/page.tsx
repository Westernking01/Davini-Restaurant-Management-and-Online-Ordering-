"use client";

import React, { useState } from "react";
import { CustomerNavbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { MenuGrid } from "@/components/menu-grid";
import { TableReservation } from "@/components/table-reservation";
import { OrderTracker } from "@/components/order-tracker";
import { AboutSection } from "@/components/about-section";
import { CustomerFooter } from "@/components/footer";

export default function CustomerHomePage() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const handleExploreMenu = () => {
    setActiveTab("menu");
    const menuEl = document.getElementById("menu");
    if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(tab);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CustomerNavbar activeTab={activeTab} onSelectTab={handleSelectTab} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div id="home">
          <HeroSection onExplore={handleExploreMenu} />
        </div>

        {/* Menu Section */}
        <MenuGrid />

        {/* Table Reservation Section */}
        <TableReservation />

        {/* Order Tracker Section */}
        <OrderTracker />

        {/* About Section */}
        <AboutSection />
      </main>

      <CustomerFooter />
    </div>
  );
}
