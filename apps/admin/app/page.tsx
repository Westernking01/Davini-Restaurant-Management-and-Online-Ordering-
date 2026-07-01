"use client";

import React from "react";
import { AdminProvider, useAdmin } from "@/lib/context/admin-context";
import { AdminSidebar } from "@/components/sidebar";
import { AdminHeader } from "@/components/header";
import { AdminDashboard } from "@/components/admin-dashboard";
import { LiveOrders } from "@/components/live-orders";
import { KdsMonitor } from "@/components/kds-monitor";
import { MenuManager } from "@/components/menu-manager";
import { InventoryMonitor } from "@/components/inventory-monitor";
import { CustomersCrm } from "@/components/customers-crm";
import { PaymentsPos } from "@/components/payments-pos";
import { AnalyticsReports } from "@/components/analytics-reports";
import { SystemSettings } from "@/components/system-settings";
import { ShieldAlert } from "lucide-react";

const MainContent: React.FC = () => {
  const { activeTab, userRole } = useAdmin();

  // Role verification guard for restricted tabs
  if (userRole === "DELIVERY" && activeTab !== "orders") {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 m-8 max-w-md mx-auto space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="font-extrabold text-base text-slate-900">Access Restricted</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your staff role (<strong className="font-bold text-slate-900">{userRole}</strong>) is restricted to dispatch tracking tickets on the Orders Queue.
        </p>
      </div>
    );
  }

  if (userRole === "STAFF" && (activeTab === "customers" || activeTab === "payments" || activeTab === "reports" || activeTab === "settings")) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 m-8 max-w-md mx-auto space-y-3">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="font-extrabold text-base text-slate-900">Managerial Access Required</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your staff role (<strong className="font-bold text-slate-900">{userRole}</strong>) permits access to Orders, KDS, Menu viewing, and Inventory monitoring.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
      {activeTab === "dashboard" && <AdminDashboard />}
      {activeTab === "orders" && <LiveOrders />}
      {activeTab === "kds" && <KdsMonitor />}
      {activeTab === "menu" && <MenuManager />}
      {activeTab === "inventory" && <InventoryMonitor />}
      {activeTab === "customers" && <CustomersCrm />}
      {activeTab === "payments" && <PaymentsPos />}
      {activeTab === "reports" && <AnalyticsReports />}
      {activeTab === "settings" && <SystemSettings />}
    </main>
  );
};

export default function AdminPortalPage() {
  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-slate-100 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <MainContent />
        </div>
      </div>
    </AdminProvider>
  );
}
