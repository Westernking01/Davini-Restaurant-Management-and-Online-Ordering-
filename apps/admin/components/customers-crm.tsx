"use client";

import React, { useState } from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import { Mail, Phone, ShoppingBag, ExternalLink, Search, Award } from "lucide-react";

export const CustomersCrm: React.FC = () => {
  const { customers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  function getLoyaltyTier(points: number) {
    if (points >= 1000) return { label: "Gold",   color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" };
    if (points >= 500)  return { label: "Silver", color: "#475569", bg: "#F8FAFC", border: "#E2E8F0" };
    return                     { label: "Bronze", color: "#7C2D12", bg: "#FFF7ED", border: "#FED7AA" };
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  // Consistent avatar color based on name
  const AVATAR_COLORS = ["#C9A96E", "#7C3AED", "#0891B2", "#059669", "#DC2626"];
  function getAvatarColor(name: string) {
    const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  }

  return (
    <div className="p-7 space-y-4">
      {/* Header bar */}
      <div className="op-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
            Customer Records
          </span>
          <span
            className="op-mono text-[11px] font-medium px-2 py-0.5 rounded"
            style={{ backgroundColor: "#F9F7F4", color: "#9C948E", border: "1px solid #E8E3DC" }}
          >
            {customers.length} total
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#9C948E" }} />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="op-input pl-8"
            style={{ width: "260px", height: "36px", padding: "0 12px 0 32px", fontSize: "12px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="op-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "20px" }}>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Lifetime Spend</th>
                <th>Loyalty</th>
                <th>Last Order</th>
                <th style={{ textAlign: "right", paddingRight: "20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => {
                const tier      = getLoyaltyTier(cust.loyaltyPoints);
                const initials  = getInitials(cust.name);
                const avatarBg  = getAvatarColor(cust.name);

                return (
                  <tr key={cust.id}>
                    <td style={{ paddingLeft: "20px" }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                          style={{ backgroundColor: avatarBg, color: "#FFFFFF" }}
                        >
                          {initials}
                        </div>
                        <p className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                          {cust.name}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "#6B6560" }}>
                          <Mail className="w-3 h-3 flex-shrink-0" style={{ color: "#9C948E" }} />
                          <span className="truncate max-w-[180px]">{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] op-mono" style={{ color: "#9C948E" }}>
                          <Phone className="w-3 h-3 flex-shrink-0" style={{ color: "#9C948E" }} />
                          {cust.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-[13px]" style={{ color: "#1C1917" }}>
                        <ShoppingBag className="w-3.5 h-3.5" style={{ color: "#C9A96E" }} />
                        <span className="op-mono font-semibold">{cust.ordersCount}</span>
                      </div>
                    </td>
                    <td>
                      <span className="op-mono text-[14px] font-bold" style={{ color: "#1C1917" }}>
                        {formatCurrency(cust.totalSpent)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded"
                          style={{ backgroundColor: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}
                        >
                          {tier.label}
                        </span>
                        <span className="op-mono text-[11px]" style={{ color: "#9C948E" }}>
                          {cust.loyaltyPoints} pts
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-[12px]" style={{ color: "#9C948E" }}>
                        {cust.lastOrderDate}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "20px" }}>
                      <button
                        onClick={() => alert(`Viewing order history for ${cust.name}...`)}
                        className="op-btn-secondary flex items-center gap-1.5"
                        style={{ fontSize: "11px", padding: "4px 10px" }}
                      >
                        <span>History</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
