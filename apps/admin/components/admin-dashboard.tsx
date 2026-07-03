"use client";

import React from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import {
  ClipboardList,
  ChefHat,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  Package,
} from "lucide-react";

function getStatusClass(status: string): string {
  switch (status) {
    case "PENDING":          return "pending";
    case "CONFIRMED":        return "confirmed";
    case "PREPARING":        return "preparing";
    case "READY":            return "ready";
    case "OUT_FOR_DELIVERY": return "delivery";
    case "DELIVERED":        return "delivered";
    case "CANCELLED":        return "cancelled";
    default:                 return "delivered";
  }
}

function ElapsedTime({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = React.useState("—");

  React.useEffect(() => {
    // createdAt is a formatted time string from context, so we can't compute diff
    // Show the created time instead
    setTimeout(() => setElapsed(createdAt), 0);
  }, [createdAt]);

  return <span className="op-mono text-[11px]" style={{ color: "#9C948E" }}>{elapsed}</span>;
}

export const AdminDashboard: React.FC = () => {
  const { orders, inventory, revenueToday, setActiveTab, activeOrdersCount, lowStockCount } = useAdmin();

  const pendingOrders  = orders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED");
  const cookingOrders  = orders.filter((o) => o.status === "PREPARING");
  const readyOrders    = orders.filter((o) => o.status === "READY");
  const criticalItems  = inventory.filter((i) => i.status === "Critical" || i.status === "Low");
  const completedToday = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="p-7 space-y-6">

      {/* Situation Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-lg"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E8E3DC" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: "#059669" }}
          />
          <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
            Restaurant Open
          </span>
          <span style={{ color: "#E8E3DC" }}>·</span>
          <span className="text-[13px]" style={{ color: "#6B6560" }}>
            Lagos Eko Atlantic
          </span>
        </div>

        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Active
            </p>
            <p className="op-mono text-[20px] font-bold leading-tight" style={{ color: "#1C1917" }}>
              {activeOrdersCount}
            </p>
          </div>
          <div style={{ width: "1px", height: "32px", backgroundColor: "#E8E3DC" }} />
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Kitchen
            </p>
            <p className="op-mono text-[20px] font-bold leading-tight" style={{ color: "#1C1917" }}>
              {cookingOrders.length}
            </p>
          </div>
          <div style={{ width: "1px", height: "32px", backgroundColor: "#E8E3DC" }} />
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Revenue
            </p>
            <p className="op-mono text-[20px] font-bold leading-tight" style={{ color: "#1C1917" }}>
              {formatCurrency(revenueToday)}
            </p>
          </div>
          <div style={{ width: "1px", height: "32px", backgroundColor: "#E8E3DC" }} />
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Done
            </p>
            <p className="op-mono text-[20px] font-bold leading-tight" style={{ color: "#059669" }}>
              {completedToday}
            </p>
          </div>

          <button
            onClick={() => setActiveTab("orders")}
            className="op-btn-primary ml-2"
            style={{ fontSize: "12px" }}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            View Orders
          </button>
        </div>
      </div>

      {/* 2-column: Queue + Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Live Order Queue */}
        <div className="op-card overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid #E8E3DC" }}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" style={{ color: "#D97706" }} />
              <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                Needs Attention
              </span>
              {pendingOrders.length > 0 && (
                <span
                  className="op-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}
                >
                  {pendingOrders.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("orders")}
              className="flex items-center gap-1 text-[12px] font-medium cursor-pointer transition-colors"
              style={{ color: "#C9A96E" }}
            >
              All orders <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingOrders.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-2"
            >
              <CheckCircle className="w-8 h-8" style={{ color: "#D4CFC8" }} />
              <p className="text-[13px] font-medium" style={{ color: "#9C948E" }}>
                Queue clear
              </p>
              <p className="text-[11px]" style={{ color: "#9C948E" }}>
                Incoming orders will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "#E8E3DC" }}>
              {pendingOrders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#F9F7F4] transition-colors"
                  style={{ borderLeft: "3px solid #D97706" }}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="op-mono text-[12px] font-bold"
                          style={{ color: "#1C1917" }}
                        >
                          {ord.orderNumber}
                        </span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide"
                          style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
                        >
                          {ord.orderType.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[12px] mt-0.5" style={{ color: "#6B6560" }}>
                        {ord.customerName} · {ord.items.length} item{ord.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="op-mono text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                      {formatCurrency(ord.total)}
                    </span>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="op-btn-primary"
                      style={{ fontSize: "11px", padding: "4px 10px" }}
                    >
                      Action
                    </button>
                  </div>
                </div>
              ))}
              {pendingOrders.length > 5 && (
                <div className="px-5 py-3">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[12px] font-medium cursor-pointer"
                    style={{ color: "#C9A96E" }}
                  >
                    +{pendingOrders.length - 5} more orders →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Kitchen + Stock */}
        <div className="space-y-4">

          {/* Kitchen summary */}
          <div className="op-card px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#EFF6FF" }}
              >
                <ChefHat className="w-4.5 h-4.5" style={{ color: "#2563EB" }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                  Kitchen
                </p>
                <p className="text-[11px]" style={{ color: "#9C948E" }}>
                  {readyOrders.length} plated &amp; waiting
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
                  Cooking
                </p>
                <p className="op-mono text-[22px] font-bold" style={{ color: "#2563EB" }}>
                  {cookingOrders.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
                  Ready
                </p>
                <p className="op-mono text-[22px] font-bold" style={{ color: "#059669" }}>
                  {readyOrders.length}
                </p>
              </div>
              <button
                onClick={() => setActiveTab("kds")}
                className="op-btn-secondary"
                style={{ fontSize: "12px" }}
              >
                KDS <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stock alerts */}
          <div className="op-card overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: "1px solid #E8E3DC" }}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" style={{ color: "#EA580C" }} />
                <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                  Stock Alerts
                </span>
                {criticalItems.length > 0 && (
                  <span
                    className="op-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FECACA" }}
                  >
                    {criticalItems.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setActiveTab("inventory")}
                className="flex items-center gap-1 text-[12px] font-medium cursor-pointer"
                style={{ color: "#C9A96E" }}
              >
                Inventory <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {criticalItems.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-4">
                <CheckCircle className="w-4 h-4" style={{ color: "#059669" }} />
                <p className="text-[13px]" style={{ color: "#6B6560" }}>
                  All stock levels healthy
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "#E8E3DC" }}>
                {criticalItems.slice(0, 4).map((item) => {
                  const pct = Math.min(100, Math.round((item.stock / (item.minStock * 2)) * 100));
                  const level = item.status === "Critical" ? "critical" : "low";
                  return (
                    <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "#1C1917" }}>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="stock-bar-track flex-1" style={{ maxWidth: "120px" }}>
                            <div
                              className={`stock-bar-fill ${level}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="op-mono text-[11px]" style={{ color: "#9C948E" }}>
                            {item.stock} / {item.minStock} {item.unit}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide flex-shrink-0"
                        style={
                          item.status === "Critical"
                            ? { backgroundColor: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FECACA" }
                            : { backgroundColor: "#FFF7ED", color: "#7C2D12", border: "1px solid #FED7AA" }
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Revenue snapshot */}
          <div
            className="op-card px-5 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
                Revenue today
              </p>
              <p className="op-mono text-[26px] font-bold mt-0.5" style={{ color: "#1C1917" }}>
                {formatCurrency(revenueToday)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: "#059669" }}>
              <TrendingUp className="w-4 h-4" />
              <span>+18.4%</span>
              <span style={{ color: "#9C948E" }}>vs yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
