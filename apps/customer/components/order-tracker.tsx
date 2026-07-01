"use client";

import React from "react";
import { useApp, Order } from "@/lib/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, Clock, Truck, ChefHat, PackageCheck, UtensilsCrossed, XCircle, MapPin } from "lucide-react";

export const OrderTracker: React.FC = () => {
  const { orders, realtimeStatus } = useApp();

  const steps = [
    { key: "PENDING", label: "Received", desc: "Order logged", icon: Clock },
    { key: "CONFIRMED", label: "Confirmed", desc: "Kitchen alerted", icon: CheckCircle2 },
    { key: "PREPARING", label: "Preparation", desc: "Firewood cooking", icon: ChefHat },
    { key: "READY", label: "Plated", desc: "Quality inspection", icon: PackageCheck },
    { key: "OUT_FOR_DELIVERY", label: "En Route", desc: "Courier dispatch", icon: Truck },
    { key: "DELIVERED", label: "Delivered", desc: "Bon appétit", icon: UtensilsCrossed },
  ] as const;

  const getStepIndex = (status: Order["status"]) => {
    if (status === "CANCELLED") return -1;
    return steps.findIndex((s) => s.key === status);
  };

  return (
    <section id="tracking" className="py-24 xl:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[#C86D3B] font-semibold block">
          Live Dispatch Pipeline
        </span>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1817]">
            Track Your Order
          </h2>
          
          {realtimeStatus === "RECONNECTING" && (
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded bg-[#F4F0EA] text-[#6B6560] border border-[#E6E1DA]">
              Reconnecting...
            </span>
          )}
          {realtimeStatus === "CONNECTED" && (
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded bg-[#E8F0E9] text-[#1E3F20] border border-[#1E3F20]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F20] animate-pulse"></span> Live Sync
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-[#6B6560] max-w-xl mx-auto leading-relaxed font-normal">
          Monitor your culinary feast from firewood preparation and plating directly to your delivery doorstep or lounge reservation.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-lg border border-[#E6E1DA] p-16 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
          <Clock className="w-10 h-10 text-[#6B6560] mx-auto" />
          <h3 className="font-serif font-bold text-2xl text-[#1A1817]">No active dining orders</h3>
          <p className="text-xs text-[#6B6560] max-w-xs mx-auto leading-relaxed">Once you complete checkout from our menu catalog, live tracking timeline will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((ord, orderIdx) => {
            const currentIdx = getStepIndex(ord.status);
            const isCancelled = ord.status === "CANCELLED";

            return (
              <div
                key={ord.id}
                style={{ animationDelay: `${orderIdx * 150}ms` }}
                className="bg-[#FFFFFF] rounded-lg border border-[#E6E1DA] shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-10 space-y-8 animate-fade-in"
              >
                {/* Order Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E1DA]">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3 flex-wrap">
                      <span className="font-bold text-lg text-[#1A1817]">
                        #{ord.orderNumber}
                      </span>
                      <StatusBadge status={ord.status} />
                      <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded bg-[#F4F0EA] text-[#6B6560] border border-[#E6E1DA]">
                        {ord.orderType}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6560]">
                      Placed at <span className="text-[#1A1817] font-semibold">{ord.createdAt}</span> by <span className="font-semibold text-[#1A1817]">{ord.customerName}</span> ({ord.phone})
                    </p>
                  </div>
                  <div className="text-left sm:text-right bg-[#F4F0EA] sm:bg-transparent p-4 sm:p-0 rounded border sm:border-0 border-[#E6E1DA]">
                    <span className="text-[10px] text-[#6B6560] uppercase tracking-wider block">Total Amount</span>
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1817]">{formatCurrency(ord.total)}</span>
                  </div>
                </div>

                {/* Progress Stepper Bar */}
                {isCancelled ? (
                  <div className="p-6 rounded bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] flex items-center space-x-4 animate-scale-fade">
                    <XCircle className="w-8 h-8 shrink-0 text-[#E02424]" />
                    <div>
                      <h4 className="font-serif font-bold text-lg">Order Cancelled</h4>
                      <p className="text-xs mt-0.5 leading-relaxed">This transaction was cancelled. If payment was processed, refund protocol has been initiated.</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-2 overflow-x-auto">
                    <div className="min-w-[500px] relative flex items-center justify-between">
                      {/* Connecting Line */}
                      <div className="absolute top-6 left-6 right-6 h-1 bg-[#E6E1DA] -z-0" />
                      
                      {/* Active Line */}
                      <div
                        className="absolute top-6 left-6 h-1 bg-[#1A1817] transition-all duration-700 ease-out -z-0"
                        style={{
                          width: `${Math.max(0, (currentIdx / (steps.length - 1)) * 100)}%`,
                        }}
                      />

                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                                isCurrent
                                  ? "bg-[#C86D3B] text-white shadow-md animate-live-halo scale-110"
                                  : isCompleted
                                  ? "bg-[#1A1817] text-white scale-100"
                                  : "bg-[#FFFFFF] border border-[#E6E1DA] text-[#C5BEBA] scale-95"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-xs font-semibold mt-3 text-center transition-colors duration-300 ${
                                isCurrent ? "text-[#C86D3B] font-bold" : isCompleted ? "text-[#1A1817]" : "text-[#6B6560]"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[10px] text-[#6B6560] hidden sm:block mt-0.5 text-center">
                              {step.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items Summary */}
                <div className="pt-2 bg-[#F4F0EA] rounded p-5 text-xs space-y-3 border border-[#E6E1DA]">
                  <span className="text-[10px] uppercase tracking-widest text-[#1A1817] font-semibold block">Included Dishes</span>
                  <div className="flex flex-wrap gap-2">
                    {ord.items.map((it, idx) => (
                      <span key={idx} className="bg-[#FFFFFF] px-3 py-1.5 rounded border border-[#E6E1DA] font-medium text-[#1A1817]">
                        <span className="text-[#C86D3B] font-bold mr-1">{it.quantity}x</span> {it.product.name}
                      </span>
                    ))}
                  </div>
                  {ord.address && (
                    <p className="text-[#6B6560] text-xs pt-3 border-t border-[#E6E1DA] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C86D3B] shrink-0" />
                      Delivery Destination: <span className="font-semibold text-[#1A1817]">{ord.address}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
