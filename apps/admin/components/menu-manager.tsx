"use client";

import React, { useState } from "react";
import { useAdmin } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import { Plus, Trash2, X, Search } from "lucide-react";

export const MenuManager: React.FC = () => {
  const { products, toggleAvailability, addProduct, deleteProduct, userRole } = useAdmin();
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [showAddModal, setShowAddModal]   = useState(false);

  const [newName, setNewName]       = useState("");
  const [newCategory, setNewCategory] = useState<any>("Soups & Swallows");
  const [newPrice, setNewPrice]     = useState("");
  const [newPrepTime, setNewPrepTime] = useState("15");

  const filteredProducts = products.filter((p) => {
    const matchesCat    = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    addProduct({
      name: newName,
      category: newCategory,
      price: parseFloat(newPrice) || 5000,
      isAvailable: true,
      prepTime: parseInt(newPrepTime) || 15,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    });
    setNewName("");
    setNewPrice("");
    setShowAddModal(false);
  };

  const activeCount   = products.filter((p) => p.isAvailable).length;
  const soldOutCount  = products.filter((p) => !p.isAvailable).length;
  const categories    = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="p-7 space-y-4">
      {/* Filter bar */}
      <div className="op-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className="px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-all"
            style={
              selectedCategory === "ALL"
                ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
            }
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-all"
              style={
                selectedCategory === cat
                  ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                  : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-3 text-[11px] op-mono px-3 py-1.5 rounded"
            style={{ backgroundColor: "#F9F7F4", border: "1px solid #E8E3DC", color: "#6B6560" }}
          >
            <span style={{ color: "#059669" }}>{activeCount} active</span>
            <span style={{ color: "#E8E3DC" }}>·</span>
            <span style={{ color: "#DC2626" }}>{soldOutCount} 86&apos;d</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#9C948E" }} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="op-input pl-8"
              style={{ width: "200px", height: "36px", padding: "0 12px 0 32px", fontSize: "12px" }}
            />
          </div>

          {userRole !== "STAFF" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="op-btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Dish
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="op-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="op-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: "20px" }}>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th style={{ textAlign: "center" }}>Availability</th>
                {userRole !== "STAFF" && <th style={{ textAlign: "right", paddingRight: "20px" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  style={{ opacity: prod.isAvailable ? 1 : 0.6 }}
                >
                  <td style={{ paddingLeft: "20px" }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-9 h-9 rounded object-cover flex-shrink-0"
                        style={{ border: "1px solid #E8E3DC" }}
                      />
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                          {prod.name}
                        </p>
                        <p className="text-[10px] op-mono" style={{ color: "#9C948E" }}>
                          #{prod.id.slice(0, 6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
                    >
                      {prod.category}
                    </span>
                  </td>
                  <td>
                    <span className="op-mono text-[14px] font-bold" style={{ color: "#1C1917" }}>
                      {formatCurrency(prod.price)}
                    </span>
                  </td>
                  <td>
                    <span className="op-mono text-[12px]" style={{ color: "#9C948E" }}>
                      ~{prod.prepTime} min
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {/* Toggle switch */}
                    <label className="op-toggle cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prod.isAvailable}
                        onChange={() => toggleAvailability(prod.id)}
                      />
                      <div className="op-toggle-track">
                        <div className="op-toggle-thumb" />
                      </div>
                      <span
                        className="ml-2 text-[11px] font-medium"
                        style={{ color: prod.isAvailable ? "#059669" : "#9C948E" }}
                      >
                        {prod.isAvailable ? "Active" : "86'd"}
                      </span>
                    </label>
                  </td>
                  {userRole !== "STAFF" && (
                    <td style={{ textAlign: "right", paddingRight: "20px" }}>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="op-btn-danger"
                        title="Remove dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
          style={{ backgroundColor: "rgba(28,25,23,0.6)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="op-card w-full max-w-md p-6 space-y-5"
            style={{ boxShadow: "0 16px 48px rgba(28,25,23,0.2)" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid #E8E3DC" }}>
              <div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded op-mono"
                  style={{ backgroundColor: "#F5EDD9", color: "#A8874E", border: "1px solid #EDD9AA" }}
                >
                  Menu Catalog
                </span>
                <h3
                  className="text-[16px] font-semibold mt-1"
                  style={{ color: "#1C1917" }}
                >
                  Add New Dish
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded cursor-pointer transition-colors hover:bg-[#F9F7F4]"
                style={{ color: "#9C948E" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="op-label">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Asada Jollof & Smoked Turkey"
                  className="op-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="op-label">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="op-input cursor-pointer"
                  >
                    <option value="Soups & Swallows">Soups & Swallows</option>
                    <option value="Grills & Suya">Grills & Suya</option>
                    <option value="Rice Specialties">Rice Specialties</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="op-label">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="14500"
                    className="op-input op-mono"
                  />
                </div>
              </div>

              <div>
                <label className="op-label">Est. Prep Time (minutes)</label>
                <input
                  type="number"
                  value={newPrepTime}
                  onChange={(e) => setNewPrepTime(e.target.value)}
                  className="op-input op-mono"
                />
              </div>

              <div
                className="flex justify-end gap-2 pt-3"
                style={{ borderTop: "1px solid #E8E3DC" }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="op-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="op-btn-primary">
                  <Plus className="w-4 h-4" />
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
