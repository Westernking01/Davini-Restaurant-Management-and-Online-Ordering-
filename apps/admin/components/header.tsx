"use client";

import React from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { Bell, X, Circle } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  dashboard:  { title: "Dashboard",       description: "Live operations overview" },
  orders:     { title: "Orders",          description: "Manage incoming and active orders" },
  kds:        { title: "Kitchen Display", description: "Ticket queue for kitchen staff" },
  menu:       { title: "Menu",            description: "Products, pricing and availability" },
  inventory:  { title: "Inventory",       description: "Stock levels and restock alerts" },
  customers:  { title: "Customers",       description: "Guest profiles and loyalty" },
  payments:   { title: "Payments",        description: "Transactions and financial records" },
  reports:    { title: "Analytics",       description: "Performance and reporting" },
  settings:   { title: "Settings",        description: "System configuration and access" },
};

export const AdminHeader: React.FC = () => {
  const {
    activeTab,
    lowStockCount,
    activeOrdersCount,
    realtimeStatus,
    newOrderAlert,
    clearNewOrderAlert,
  } = useAdmin();

  const page = PAGE_TITLES[activeTab] || { title: activeTab, description: "" };

  return (
    <div className="flex-shrink-0 sticky top-0 z-30">
      {/* New Order Alert Banner */}
      {newOrderAlert && (
        <div
          className="flex items-center justify-between px-7 py-2.5 text-[13px] font-semibold animate-fade-in"
          style={{ backgroundColor: "#D97706", color: "#1C1917" }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#1C1917", opacity: 0.5 }}
            />
            <Bell className="w-3.5 h-3.5" />
            <span>{newOrderAlert}</span>
          </div>
          <button
            onClick={clearNewOrderAlert}
            className="p-1 rounded cursor-pointer transition-opacity hover:opacity-70"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <header
        className="flex items-center justify-between px-7"
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E8E3DC",
        }}
      >
        {/* Page context */}
        <div className="flex items-center gap-4">
          <div>
            <h1
              className="text-[15px] font-semibold leading-tight"
              style={{ color: "#1C1917" }}
            >
              {page.title}
            </h1>
            <p
              className="text-[11px] hidden sm:block"
              style={{ color: "#9C948E" }}
            >
              {page.description}
            </p>
          </div>
        </div>

        {/* Right indicators */}
        <div className="flex items-center gap-4">
          {/* Stock alert */}
          {lowStockCount > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded"
              style={{ backgroundColor: "#FFF7ED", color: "#92400E", border: "1px solid #FED7AA" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#EA580C" }}
              />
              {lowStockCount} low stock
            </div>
          )}

          {/* Active orders */}
          {activeOrdersCount > 0 && (
            <div
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded"
              style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ backgroundColor: "#D97706" }}
              />
              {activeOrdersCount} active
            </div>
          )}

          {/* Divider */}
          <div
            className="hidden sm:block w-px h-5"
            style={{ backgroundColor: "#E8E3DC" }}
          />

          {/* Realtime status */}
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#9C948E" }}>
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${realtimeStatus === "CONNECTED" ? "animate-pulse" : ""}`}
              style={{
                backgroundColor:
                  realtimeStatus === "CONNECTED"
                    ? "#059669"
                    : realtimeStatus === "RECONNECTING"
                    ? "#D97706"
                    : "#DC2626",
              }}
            />
            <span className="hidden md:inline font-medium">
              {realtimeStatus === "CONNECTED"
                ? "Live"
                : realtimeStatus === "RECONNECTING"
                ? "Syncing"
                : "Offline"}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
};
