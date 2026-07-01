"use client";

import React, { useState } from "react";
import { useAdmin, Order } from "@/lib/context/admin-context";
import { formatCurrency } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
  Truck,
  UtensilsCrossed,
  XCircle,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
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

function getStatusBarColor(status: string): string {
  switch (status) {
    case "PENDING":          return "#D97706";
    case "CONFIRMED":        return "#0891B2";
    case "PREPARING":        return "#2563EB";
    case "READY":            return "#059669";
    case "OUT_FOR_DELIVERY": return "#7C3AED";
    case "DELIVERED":        return "#64748B";
    case "CANCELLED":        return "#DC2626";
    default:                 return "#9C948E";
  }
}

function getNextActionLabel(status: Order["status"], type: string) {
  switch (status) {
    case "PENDING":          return { label: "Accept Order",      icon: CheckCircle,   color: "#D97706", textColor: "#1C1917" };
    case "CONFIRMED":        return { label: "Fire Kitchen",       icon: ChefHat,       color: "#2563EB", textColor: "#FFFFFF" };
    case "PREPARING":        return { label: "Mark Ready",        icon: PackageCheck,   color: "#059669", textColor: "#FFFFFF" };
    case "READY":
      return type === "DELIVERY"
        ? { label: "Dispatch",    icon: Truck,              color: "#7C3AED", textColor: "#FFFFFF" }
        : { label: "Hand to Guest", icon: UtensilsCrossed, color: "#059669", textColor: "#FFFFFF" };
    case "OUT_FOR_DELIVERY": return { label: "Confirm Delivered", icon: CheckCircle,   color: "#059669", textColor: "#FFFFFF" };
    default:                 return null;
  }
}

function handleNextStatus(order: Order, updateOrderStatus: Function) {
  switch (order.status) {
    case "PENDING":          updateOrderStatus(order.id, "CONFIRMED"); break;
    case "CONFIRMED":        updateOrderStatus(order.id, "PREPARING"); break;
    case "PREPARING":        updateOrderStatus(order.id, "READY"); break;
    case "READY":
      updateOrderStatus(order.id, order.orderType === "DELIVERY" ? "OUT_FOR_DELIVERY" : "DELIVERED");
      break;
    case "OUT_FOR_DELIVERY": updateOrderStatus(order.id, "DELIVERED"); break;
  }
}

function OrderRow({ order, updateOrderStatus, userRole }: {
  order: Order;
  updateOrderStatus: Function;
  userRole: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const nextAction = getNextActionLabel(order.status, order.orderType);
  const barColor = getStatusBarColor(order.status);
  const statusClass = getStatusClass(order.status);

  return (
    <>
      <tr
        className="transition-colors cursor-pointer hover:bg-[#F9F7F4]"
        onClick={() => setExpanded((x) => !x)}
        style={{ borderLeft: `3px solid ${barColor}` }}
      >
        <td className="py-3 pl-5 pr-4">
          <div className="flex items-center gap-2">
            <span className="op-mono text-[13px] font-bold" style={{ color: "#1C1917" }}>
              {order.orderNumber}
            </span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" style={{ color: "#9C948E" }} />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9C948E" }} />
            )}
          </div>
        </td>
        <td className="py-3 px-4">
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
              {order.customerName}
            </p>
            <p className="text-[11px]" style={{ color: "#9C948E" }}>
              {order.phone}
            </p>
          </div>
        </td>
        <td className="py-3 px-4">
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide"
            style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC" }}
          >
            {order.orderType.replace("_", " ")}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className={`status-badge ${statusClass}`}>
            {order.status.replace("_", " ")}
          </span>
        </td>
        <td className="py-3 px-4">
          <span className="text-[11px]" style={{ color: "#9C948E" }}>
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </span>
        </td>
        <td className="py-3 px-4 op-mono text-[13px] font-semibold" style={{ color: "#1C1917" }}>
          {formatCurrency(order.total)}
        </td>
        <td className="py-3 pl-4 pr-5">
          <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            {order.status !== "DELIVERED" && order.status !== "CANCELLED" && userRole !== "DELIVERY" && (
              <button
                onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                className="op-btn-danger p-1.5"
                title="Cancel order"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            {nextAction && (
              <button
                onClick={() => handleNextStatus(order, updateOrderStatus)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-semibold cursor-pointer transition-all active:scale-98"
                style={{
                  backgroundColor: nextAction.color,
                  color: nextAction.textColor,
                  border: "none",
                }}
              >
                <nextAction.icon className="w-3.5 h-3.5" />
                {nextAction.label}
              </button>
            )}
            {!nextAction && (
              <span className="flex items-center gap-1 text-[12px] font-medium" style={{ color: "#059669" }}>
                <CheckCircle className="w-3.5 h-3.5" />
                Done
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded row */}
      {expanded && (
        <tr style={{ backgroundColor: "#FDFCFA" }}>
          <td colSpan={7} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items */}
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3 op-mono"
                  style={{ color: "#9C948E" }}
                >
                  Items ordered
                </p>
                <div className="space-y-2">
                  {order.items.map((item, i) => {
                    const itemName = (item as any).product?.name || item.name;
                    const price = (item as any).itemPrice || item.price;
                    const options = (item as any).selectedOptions || [];
                    return (
                      <div key={i} className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[13px] font-semibold" style={{ color: "#1C1917" }}>
                            ×{item.quantity} {itemName}
                          </span>
                          {options.length > 0 && (
                            <p className="text-[11px] mt-0.5" style={{ color: "#D97706" }}>
                              + {options.join(", ")}
                            </p>
                          )}
                        </div>
                        <span className="op-mono text-[12px] font-semibold flex-shrink-0" style={{ color: "#1C1917" }}>
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <p
                  className="text-[11px] font-semibold uppercase tracking-widest mb-3 op-mono"
                  style={{ color: "#9C948E" }}
                >
                  Order details
                </p>
                {order.address && (
                  <div className="flex gap-2 text-[12px]" style={{ color: "#6B6560" }}>
                    <span className="font-medium flex-shrink-0">Address:</span>
                    <span>{order.address}</span>
                  </div>
                )}
                {(order.note || (order as any).notes) && (
                  <div
                    className="flex gap-2 text-[12px] p-2.5 rounded"
                    style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                    <span style={{ color: "#92400E" }}>{order.note || (order as any).notes}</span>
                  </div>
                )}
                <div className="flex gap-2 text-[12px]" style={{ color: "#6B6560" }}>
                  <span className="font-medium">Total:</span>
                  <span className="op-mono font-bold" style={{ color: "#1C1917" }}>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export const LiveOrders: React.FC = () => {
  const { orders, updateOrderStatus, userRole } = useAdmin();
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((ord) => {
    const matchesType   = filterType === "ALL" || ord.orderType === filterType;
    const matchesStatus =
      filterStatus === "ALL"    ? true :
      filterStatus === "ACTIVE" ? !["DELIVERED", "CANCELLED"].includes(ord.status) :
      filterStatus === "DONE"   ? ord.status === "DELIVERED" :
      ord.status === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.phone && ord.phone.includes(searchTerm));
    return matchesType && matchesStatus && matchesSearch;
  });

  const activeCount = orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length;

  return (
    <div className="p-7 space-y-4">
      {/* Filter bar */}
      <div
        className="op-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filters */}
          {[
            { id: "ACTIVE", label: "Active", count: activeCount },
            { id: "ALL", label: "All orders", count: orders.length },
            { id: "PENDING", label: "Pending", count: orders.filter(o => o.status === "PENDING").length },
            { id: "PREPARING", label: "Cooking", count: orders.filter(o => o.status === "PREPARING").length },
            { id: "READY", label: "Ready", count: orders.filter(o => o.status === "READY").length },
            { id: "DONE", label: "Done", count: orders.filter(o => o.status === "DELIVERED").length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium cursor-pointer transition-all"
              style={
                filterStatus === f.id
                  ? { backgroundColor: "#1C1917", color: "#EDD9AA", border: "1px solid #1C1917" }
                  : { backgroundColor: "transparent", color: "#6B6560", border: "1px solid #E8E3DC" }
              }
            >
              {f.label}
              {f.count > 0 && (
                <span
                  className="op-mono text-[10px] font-bold px-1 py-0.5 rounded"
                  style={
                    filterStatus === f.id
                      ? { backgroundColor: "#C9A96E", color: "#1C1917" }
                      : { backgroundColor: "#F9F7F4", color: "#9C948E" }
                  }
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="ml-2 text-[12px] font-medium px-3 py-1.5 rounded cursor-pointer"
            style={{ backgroundColor: "#F9F7F4", color: "#6B6560", border: "1px solid #E8E3DC", outline: "none" }}
          >
            <option value="ALL">All types</option>
            <option value="DELIVERY">Delivery</option>
            <option value="PICKUP">Pickup</option>
            <option value="DINE_IN">Dine In</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "#9C948E" }}
          />
          <input
            type="text"
            placeholder="Search order, name, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="op-input pl-8"
            style={{ width: "240px", height: "36px", padding: "0 12px 0 32px", fontSize: "12px" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="op-card overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="w-10 h-10" style={{ color: "#D4CFC8" }} />
            <p className="text-[15px] font-semibold" style={{ color: "#9C948E" }}>No orders found</p>
            <p className="text-[13px]" style={{ color: "#9C948E" }}>Adjust filters or search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="op-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: "20px" }}>Order</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th style={{ textAlign: "right", paddingRight: "20px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => (
                  <OrderRow
                    key={ord.id}
                    order={ord}
                    updateOrderStatus={updateOrderStatus}
                    userRole={userRole}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
