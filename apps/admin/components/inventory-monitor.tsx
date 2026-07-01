"use client";

import React, { useState } from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import { Plus, RefreshCw, Search } from "lucide-react";

export const InventoryMonitor: React.FC = () => {
  const { inventory, updateStock, userRole } = useAdmin();
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [restockingId, setRestockingId] = useState<string | null>(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesCat    = filterCategory === "ALL" || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuickRestock = (id: string, currentStock: number, addAmount: number) => {
    setRestockingId(id);
    setTimeout(() => {
      updateStock(id, currentStock + addAmount);
      setRestockingId(null);
    }, 250);
  };

  const lowStockCount = inventory.filter((i) => i.status === "Low" || i.status === "Critical").length;
  const categories = Array.from(new Set(inventory.map((i) => i.category)));

  return (
    <div className="p-7 space-y-4">
      {/* Header bar */}
      <div className="op-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category filters */}
          <button
            onClick={() => setFilterCategory("ALL")}
            className="px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-all"
            style={
              filterCategory === "ALL"
                ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
            }
          >
            All ({inventory.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-all"
              style={
                filterCategory === cat
                  ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                  : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded"
              style={{ backgroundColor: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FECACA" }}
            >
              {lowStockCount} below par
            </span>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#9C948E" }} />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="op-input pl-8"
              style={{ width: "220px", height: "36px", padding: "0 12px 0 32px", fontSize: "12px" }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="op-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "20px" }}>Ingredient</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Par Level</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Unit Cost</th>
                <th>Last Restocked</th>
                {userRole !== "STAFF" && <th style={{ textAlign: "right", paddingRight: "20px" }}>Restock</th>}
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const isRestocking = restockingId === item.id;
                const stockLevel = Math.min(100, Math.round((item.stock / (item.minStock * 2)) * 100));
                const levelClass = item.status === "Critical" ? "critical" : item.status === "Low" ? "low" : "optimal";

                return (
                  <tr key={item.id}>
                    <td style={{ paddingLeft: "20px" }}>
                      <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                        {item.name}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded"
                        style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className="op-mono text-[14px] font-bold"
                        style={{ color: item.status === "Critical" ? "#DC2626" : "#1C1917" }}
                      >
                        {item.stock}
                      </span>
                      <span className="text-[11px] ml-1" style={{ color: "#9C948E" }}>{item.unit}</span>
                    </td>
                    <td>
                      <span className="op-mono text-[12px]" style={{ color: "#9C948E" }}>
                        {item.minStock} {item.unit}
                      </span>
                    </td>
                    <td style={{ minWidth: "120px" }}>
                      <div className="stock-bar-track" style={{ width: "100px" }}>
                        <div
                          className={`stock-bar-fill ${levelClass}`}
                          style={{ width: `${stockLevel}%` }}
                        />
                      </div>
                      <span className="text-[10px] op-mono mt-1 block" style={{ color: "#9C948E" }}>
                        {stockLevel}%
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide"
                        style={
                          item.status === "Optimal"
                            ? { backgroundColor: "#ECFDF5", color: "#064E3B", border: "1px solid #A7F3D0" }
                            : item.status === "Low"
                            ? { backgroundColor: "#FFF7ED", color: "#7C2D12", border: "1px solid #FED7AA" }
                            : { backgroundColor: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FECACA" }
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="op-mono text-[12px] font-semibold" style={{ color: "#1C1917" }}>
                        {formatCurrency(item.costPerUnit)}
                      </span>
                    </td>
                    <td>
                      <span className="text-[12px]" style={{ color: "#9C948E" }}>
                        {item.lastRestocked}
                      </span>
                    </td>
                    {userRole !== "STAFF" && (
                      <td style={{ paddingRight: "20px" }}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={isRestocking}
                            onClick={() => handleQuickRestock(item.id, item.stock, 10)}
                            className="op-btn-secondary flex items-center gap-1"
                            style={{ padding: "4px 10px", fontSize: "12px" }}
                          >
                            {isRestocking ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            +10
                          </button>
                          <button
                            disabled={isRestocking}
                            onClick={() => handleQuickRestock(item.id, item.stock, 50)}
                            className="op-btn-primary"
                            style={{ padding: "4px 10px", fontSize: "12px" }}
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    )}
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
