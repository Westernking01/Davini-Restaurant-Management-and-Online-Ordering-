"use client";

import React from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import { Download, TrendingUp, Clock, DollarSign } from "lucide-react";

export const AnalyticsReports: React.FC = () => {
  const { orders, products, revenueToday } = useAdmin();

  const topSelling  = [...products].sort((a, b) => b.ordersToday - a.ordersToday).slice(0, 5);
  const maxOrders   = topSelling[0]?.ordersToday || 1;

  const vatTotal    = revenueToday * 0.075;
  const netRevenue  = revenueToday - vatTotal;

  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const fulfillRate     = orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0;

  return (
    <div className="p-7 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold" style={{ color: "#1C1917" }}>
            Analytics & Reports
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: "#9C948E" }}>
            Real-time throughput and financial shift summary
          </p>
        </div>
        <button
          onClick={() => alert("Downloading CSV...")}
          className="op-btn-secondary flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Revenue",
            value: formatCurrency(revenueToday),
            sub: "Today's shift",
            icon: DollarSign,
            iconColor: "#059669",
            iconBg: "#ECFDF5",
          },
          {
            label: "Net Revenue",
            value: formatCurrency(netRevenue),
            sub: "After 7.5% VAT",
            icon: TrendingUp,
            iconColor: "#2563EB",
            iconBg: "#EFF6FF",
          },
          {
            label: "FIRS VAT Accrual",
            value: formatCurrency(vatTotal),
            sub: "7.5% Lagos rate",
            icon: DollarSign,
            iconColor: "#D97706",
            iconBg: "#FFFBEB",
          },
          {
            label: "Fulfillment Rate",
            value: `${fulfillRate}%`,
            sub: `${deliveredOrders} of ${orders.length} orders`,
            icon: Clock,
            iconColor: "#7C3AED",
            iconBg: "#F5F3FF",
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="op-card px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
                  {m.label}
                </p>
                <div
                  className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: m.iconBg }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: m.iconColor }} />
                </div>
              </div>
              <p className="op-mono text-[22px] font-bold" style={{ color: "#1C1917" }}>
                {m.value}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "#9C948E" }}>
                {m.sub}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2-column: Velocity + Operational */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Item velocity */}
        <div className="op-card p-5 space-y-4">
          <div style={{ borderBottom: "1px solid #E8E3DC", paddingBottom: "12px" }}>
            <h3 className="text-[14px] font-semibold" style={{ color: "#1C1917" }}>
              Menu Velocity
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: "#9C948E" }}>
              Fastest moving items this shift
            </p>
          </div>

          <div className="space-y-3">
            {topSelling.map((prod, idx) => {
              const pct = Math.round((prod.ordersToday / maxOrders) * 100);
              return (
                <div key={prod.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="op-mono text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#F9F7F4", color: "#9C948E", border: "1px solid #E8E3DC" }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-[13px] font-medium" style={{ color: "#1C1917" }}>
                        {prod.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="op-mono text-[11px]" style={{ color: "#9C948E" }}>
                        {prod.ordersToday} sold
                      </span>
                      <span className="op-mono text-[12px] font-bold" style={{ color: "#1C1917" }}>
                        {formatCurrency(prod.price * prod.ordersToday)}
                      </span>
                    </div>
                  </div>
                  <div className="stock-bar-track">
                    <div
                      className="stock-bar-fill optimal"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational intel */}
        <div className="space-y-4">
          {[
            {
              label: "Kitchen Speed",
              value: "18.4 min",
              delta: "-2.1m vs target",
              deltaColor: "#059669",
              note: "Throughput is optimal. Maintain current expeditor allocation for evening surge.",
            },
            {
              label: "Peak Forecast",
              value: "6:30 PM",
              delta: "+45 orders est.",
              deltaColor: "#D97706",
              note: "Ensure firewood grill station prep completed 30 mins before surge.",
            },
            {
              label: "Cancelled Orders",
              value: cancelledOrders.toString(),
              delta: `${orders.length} total today`,
              deltaColor: "#9C948E",
              note: "Review cancelled orders for dispatch or kitchen refusal patterns.",
            },
          ].map((item, i) => (
            <div key={i} className="op-card px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
                  {item.label}
                </p>
                <span className="text-[11px] font-medium" style={{ color: item.deltaColor }}>
                  {item.delta}
                </span>
              </div>
              <p className="op-mono text-[24px] font-bold" style={{ color: "#1C1917" }}>
                {item.value}
              </p>
              <p
                className="text-[11px] leading-relaxed px-3 py-2 rounded"
                style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide block mb-0.5"
                  style={{ color: "#9C948E" }}
                >
                  Action:
                </span>
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
