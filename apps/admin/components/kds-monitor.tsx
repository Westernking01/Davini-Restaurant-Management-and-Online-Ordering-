"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { ChefHat, Clock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

type KdsFilter = "ALL" | "NEW" | "COOKING" | "READY";

function useElapsed(createdAt: string): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return createdAt;
}

function TicketCard({
  order,
  onAdvance,
}: {
  order: ReturnType<typeof useAdmin>["orders"][0];
  onAdvance: () => void;
}) {
  const elapsed = useElapsed(order.createdAt);

  const statusClass =
    order.status === "PENDING" || order.status === "CONFIRMED"
      ? "kds-new"
      : order.status === "PREPARING"
      ? "kds-cooking"
      : "kds-ready";

  const nextLabel =
    order.status === "PENDING" || order.status === "CONFIRMED"
      ? "Start Cooking"
      : order.status === "PREPARING"
      ? "Mark Ready"
      : "Deliver / Done";

  const nextColor =
    order.status === "PENDING" || order.status === "CONFIRMED"
      ? "#D97706"
      : order.status === "PREPARING"
      ? "#2563EB"
      : "#059669";

  return (
    <div className={`kds-ticket ${statusClass} flex flex-col`}>
      {/* Ticket header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid #2D2824" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="op-mono text-[15px] font-bold"
            style={{ color: "#EDD9AA" }}
          >
            {order.orderNumber}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
            style={{ backgroundColor: "#2A2420", color: "#A09488" }}
          >
            {order.orderType.replace("_", " ")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" style={{ color: "#5C4F44" }} />
          <span className="text-[11px]" style={{ color: "#6B5E55" }}>
            {elapsed}
          </span>
        </div>
      </div>

      {/* Customer */}
      <div className="px-4 py-2" style={{ borderBottom: "1px solid #2D2824" }}>
        <p className="text-[12px]" style={{ color: "#A09488" }}>
          {order.customerName}
        </p>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span
                className="op-mono text-[13px] font-bold flex-shrink-0 leading-tight"
                style={{ color: "#C9A96E" }}
              >
                ×{item.quantity}
              </span>
              <span
                className="text-[14px] font-semibold leading-snug"
                style={{ color: "#F5EDD9" }}
              >
                {item.name}
              </span>
            </div>
            {item.selectedOptions && item.selectedOptions.length > 0 && (
              <div className="text-[10px] text-right flex-shrink-0" style={{ color: "#6B5E55" }}>
                {item.selectedOptions.map((opt: string, j: number) => (
                  <span key={j} className="block">{opt}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {order.note && (
          <div
            className="mt-2 pt-2"
            style={{ borderTop: "1px solid #2D2824" }}
          >
            <p className="text-[11px] italic" style={{ color: "#6B5E55" }}>
              Note: {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="px-4 pb-4">
        <button
          onClick={onAdvance}
          className="w-full py-3 rounded text-[13px] font-bold cursor-pointer transition-all active:scale-98"
          style={{
            backgroundColor: nextColor,
            color: order.status === "PREPARING" ? "#FFFFFF" : "#1C1917",
            border: "none",
          }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function getNextStatus(current: string): string {
  switch (current) {
    case "PENDING":
    case "CONFIRMED":  return "PREPARING";
    case "PREPARING":  return "READY";
    case "READY":      return "OUT_FOR_DELIVERY";
    default:           return "DELIVERED";
  }
}

export const KdsMonitor: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [filter, setFilter] = useState<KdsFilter>("ALL");

  const kdsOrders = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(o.status)
  );

  const filtered = kdsOrders.filter((o) => {
    if (filter === "ALL")     return true;
    if (filter === "NEW")     return o.status === "PENDING" || o.status === "CONFIRMED";
    if (filter === "COOKING") return o.status === "PREPARING";
    if (filter === "READY")   return o.status === "READY";
    return true;
  });

  const counts = {
    NEW:    kdsOrders.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED").length,
    COOKING: kdsOrders.filter((o) => o.status === "PREPARING").length,
    READY:  kdsOrders.filter((o) => o.status === "READY").length,
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "#0F0D0C", minHeight: "calc(100vh - 56px)" }}
    >
      {/* KDS Header */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ backgroundColor: "#14110F", borderBottom: "1px solid #2A2420" }}
      >
        <div className="flex items-center gap-3">
          <ChefHat className="w-5 h-5" style={{ color: "#C9A96E" }} />
          <span
            className="text-[14px] font-semibold"
            style={{ color: "#EDD9AA" }}
          >
            Kitchen Display
          </span>
          <span className="op-mono text-[11px]" style={{ color: "#5C4F44" }}>
            {kdsOrders.length} active
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(["ALL", "NEW", "COOKING", "READY"] as KdsFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded text-[11px] font-semibold op-mono uppercase tracking-wide cursor-pointer transition-all"
              style={
                filter === f
                  ? { backgroundColor: "#2A2420", color: "#EDD9AA", border: "1px solid #3A3028" }
                  : { backgroundColor: "transparent", color: "#5C4F44", border: "1px solid transparent" }
              }
            >
              {f}
              {f !== "ALL" && counts[f] > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded text-[10px]"
                  style={{
                    backgroundColor: f === "NEW" ? "#D97706" : f === "COOKING" ? "#2563EB" : "#059669",
                    color: "#FFFFFF",
                  }}
                >
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket grid */}
      <div className="flex-1 overflow-auto p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-24">
            <CheckCircle className="w-12 h-12" style={{ color: "#2A2420" }} />
            <p className="text-[15px] font-semibold" style={{ color: "#5C4F44" }}>
              {filter === "ALL" ? "Queue is clear" : `No ${filter.toLowerCase()} tickets`}
            </p>
            <p className="text-[13px]" style={{ color: "#3A3028" }}>
              Incoming orders will appear here automatically
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
            {filtered.map((ord) => (
              <TicketCard
                key={ord.id}
                order={ord}
                onAdvance={async () => {
                  const next = getNextStatus(ord.status) as any;
                  await updateOrderStatus(ord.id, next);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
