"use client";

import React from "react";
import { Settings, Shield, Save, CheckCircle, Terminal } from "lucide-react";

export const SystemSettings: React.FC = () => {
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-7 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold" style={{ color: "#1C1917" }}>
            System Settings
          </h2>
          <p className="text-[12px] mt-0.5" style={{ color: "#9C948E" }}>
            POS core parameters, VAT, and access control
          </p>
        </div>
        {saved && (
          <div
            className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded animate-fade-in"
            style={{ backgroundColor: "#ECFDF5", color: "#064E3B", border: "1px solid #A7F3D0" }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: "#059669" }} />
            Configuration saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Operating parameters */}
        <div className="op-card p-6 space-y-5">
          <div style={{ borderBottom: "1px solid #E8E3DC", paddingBottom: "12px" }}>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" style={{ color: "#C9A96E" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "#1C1917" }}>
                Operating Parameters
              </h3>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="op-label">Restaurant Entity Name</label>
              <input
                type="text"
                defaultValue="Davini's Food Bank Limited"
                className="op-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="op-label">Base Currency</label>
                <input
                  type="text"
                  disabled
                  value="NGN (₦)"
                  className="op-input op-mono cursor-not-allowed"
                  style={{ backgroundColor: "#F9F7F4", color: "#9C948E" }}
                />
              </div>
              <div>
                <label className="op-label">FIRS VAT Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue="7.5"
                  className="op-input op-mono"
                />
              </div>
            </div>

            <div>
              <label className="op-label">Kitchen Status</label>
              <select className="op-input cursor-pointer">
                <option value="open">Open — Accepting all orders</option>
                <option value="busy">Busy — +20 min to estimates</option>
                <option value="closed">Closed — Suspend incoming orders</option>
              </select>
            </div>

            <div>
              <label className="op-label">Default Prep Time (minutes)</label>
              <input
                type="number"
                defaultValue="20"
                className="op-input op-mono"
              />
            </div>

            <button type="submit" className="op-btn-primary w-full justify-center py-2.5">
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </form>
        </div>

        {/* RBAC Matrix */}
        <div className="op-card p-6 space-y-4">
          <div style={{ borderBottom: "1px solid #E8E3DC", paddingBottom: "12px" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: "#059669" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: "#1C1917" }}>
                Role-Based Access Control
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                role: "ADMIN",
                label: "Administrator",
                access: "Full Authority",
                accessColor: "#2563EB",
                accessBg: "#EFF6FF",
                accessBorder: "#BFDBFE",
                desc: "Full access to all modules including system config, financial settlement, RBAC, and staff accounts.",
              },
              {
                role: "MANAGER",
                label: "Floor Manager",
                access: "Operations",
                accessColor: "#059669",
                accessBg: "#ECFDF5",
                accessBorder: "#A7F3D0",
                desc: "Access to Orders, KDS, Menu, Inventory, and Financial Reports. Cannot modify staff permissions.",
              },
              {
                role: "STAFF",
                label: "Kitchen Staff",
                access: "KDS Only",
                accessColor: "#D97706",
                accessBg: "#FFFBEB",
                accessBorder: "#FDE68A",
                desc: "Can transition KDS tickets and view stock depletion alerts. Restricted from financial data.",
              },
              {
                role: "DELIVERY",
                label: "Dispatch Rider",
                access: "Logistics",
                accessColor: "#7C3AED",
                accessBg: "#F5F3FF",
                accessBorder: "#DDD6FE",
                desc: "Restricted to assigned out-for-delivery tickets and delivery completion sign-off only.",
              },
            ].map((item) => (
              <div
                key={item.role}
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#F9F7F4", border: "1px solid #E8E3DC" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="op-mono text-[12px] font-bold" style={{ color: "#1C1917" }}>
                      {item.role}
                    </span>
                    <span className="text-[12px]" style={{ color: "#9C948E" }}>
                      / {item.label}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
                    style={{
                      backgroundColor: item.accessBg,
                      color: item.accessColor,
                      border: `1px solid ${item.accessBorder}`,
                    }}
                  >
                    {item.access}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "#6B6560" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
