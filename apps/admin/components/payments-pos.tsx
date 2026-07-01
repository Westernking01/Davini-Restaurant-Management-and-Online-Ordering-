"use client";

import React, { useState } from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, DollarSign, ArrowDownLeft, ShieldCheck } from "lucide-react";

export const PaymentsPos: React.FC = () => {
  const { payments, revenueToday } = useAdmin();
  const [filterMethod, setFilterMethod] = useState("ALL");

  const filteredPayments = payments.filter((p) =>
    filterMethod === "ALL" || p.method.toLowerCase().includes(filterMethod.toLowerCase())
  );

  const cardVolume     = payments.filter((p) => p.method.includes("Card")).reduce((s, p) => s + p.amount, 0);
  const cashPosVolume  = payments.filter((p) => p.method.includes("POS") || p.method.includes("Transfer")).reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-7 space-y-4">
      {/* Summary ribbon */}
      <div
        className="op-card flex flex-wrap items-center gap-0 overflow-hidden"
        style={{ border: "1px solid #E8E3DC" }}
      >
        <div
          className="flex-1 min-w-[160px] px-6 py-4"
          style={{ borderRight: "1px solid #E8E3DC" }}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
            Shift Revenue
          </p>
          <p className="op-mono text-[24px] font-bold mt-0.5" style={{ color: "#1C1917" }}>
            {formatCurrency(revenueToday)}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#059669" }}>
            +14.2% vs prior shift
          </p>
        </div>

        <div
          className="flex-1 min-w-[160px] px-6 py-4"
          style={{ borderRight: "1px solid #E8E3DC" }}
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Card Volume
            </p>
          </div>
          <p className="op-mono text-[20px] font-bold mt-0.5" style={{ color: "#1C1917" }}>
            {formatCurrency(cardVolume)}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#9C948E" }}>
            Paystack settlement
          </p>
        </div>

        <div
          className="flex-1 min-w-[160px] px-6 py-4"
          style={{ borderRight: "1px solid #E8E3DC" }}
        >
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Cash / Transfer
            </p>
          </div>
          <p className="op-mono text-[20px] font-bold mt-0.5" style={{ color: "#1C1917" }}>
            {formatCurrency(cashPosVolume)}
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#D97706" }}>
            Requires drawer verify
          </p>
        </div>

        <div className="flex-1 min-w-[160px] px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#059669" }} />
            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#9C948E" }}>
              Security
            </p>
          </div>
          <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#1C1917" }}>
            Paystack Encrypted
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#059669" }}>
            Settlement live
          </p>
        </div>
      </div>

      {/* Filter + table */}
      <div className="op-card overflow-hidden">
        {/* Filter row inside card header */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid #E8E3DC" }}
        >
          <span className="text-[11px] font-medium uppercase tracking-wide mr-2" style={{ color: "#9C948E" }}>
            Method:
          </span>
          {["ALL", "card", "transfer", "pos"].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className="px-3 py-1 rounded text-[11px] font-medium op-mono uppercase cursor-pointer transition-all"
              style={
                filterMethod === m
                  ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                  : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
              }
            >
              {m === "ALL" ? "All" : m}
            </button>
          ))}
          <span className="ml-auto text-[11px] op-mono" style={{ color: "#9C948E" }}>
            {filteredPayments.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "20px" }}>Ref</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
                <th style={{ textAlign: "right", paddingRight: "20px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((txn) => (
                <tr key={txn.id}>
                  <td style={{ paddingLeft: "20px" }}>
                    <span className="op-mono text-[12px] font-medium" style={{ color: "#9C948E" }}>
                      {txn.id}
                    </span>
                  </td>
                  <td>
                    <span className="op-mono text-[12px] font-bold" style={{ color: "#2563EB" }}>
                      {txn.orderNumber}
                    </span>
                  </td>
                  <td>
                    <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                      {txn.customerName}
                    </span>
                  </td>
                  <td>
                    <span className="op-mono text-[14px] font-bold" style={{ color: "#1C1917" }}>
                      {formatCurrency(txn.amount)}
                    </span>
                  </td>
                  <td>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded op-mono"
                      style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
                    >
                      {txn.method}
                    </span>
                  </td>
                  <td>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded"
                      style={
                        txn.status === "Completed"
                          ? { backgroundColor: "#ECFDF5", color: "#064E3B", border: "1px solid #A7F3D0" }
                          : txn.status === "Pending"
                          ? { backgroundColor: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }
                          : { backgroundColor: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FECACA" }
                      }
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-[12px]" style={{ color: "#9C948E" }}>
                      {txn.timestamp}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", paddingRight: "20px" }}>
                    <button
                      onClick={() => alert(`Audit for ${txn.id}`)}
                      className="op-btn-secondary"
                      style={{ fontSize: "11px", padding: "4px 10px" }}
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
