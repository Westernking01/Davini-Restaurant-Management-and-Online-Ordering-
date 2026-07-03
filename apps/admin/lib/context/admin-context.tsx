"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  AdminOrder,
  AdminOrderItem,
  InventoryItem,
  AdminProduct,
  CustomerProfile,
  PaymentTransaction,
} from "../data/mock-admin-data";
import {
  fetchAdminDashboardDataAction,
  updateOrderStatusAction,
  restockInventoryAction,
  toggleProductAvailabilityAction,
} from "@/actions/admin-actions";

export type AdminRole = "ADMIN" | "MANAGER" | "STAFF" | "DELIVERY";
export type UserRole = AdminRole;

export type AdminTab =
  | "dashboard"
  | "orders"
  | "kds"
  | "menu"
  | "inventory"
  | "customers"
  | "payments"
  | "reports"
  | "settings";

export interface OrderItem extends AdminOrderItem {
  itemPrice: number;
  selectedOptions?: any[];
}

export interface Order extends Omit<AdminOrder, "items"> {
  note?: string;
  items: OrderItem[];
}

interface AdminContextType {
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: Order["status"]) => Promise<boolean>;
  assignDelivery: (orderId: string, deliveryPerson: string) => void;
  inventory: InventoryItem[];
  updateStock: (itemId: string, newStock: number) => Promise<boolean>;
  products: AdminProduct[];
  toggleAvailability: (productId: string) => Promise<boolean>;
  addProduct: (product: Omit<AdminProduct, "id" | "ordersToday">) => void;
  deleteProduct: (productId: string) => void;
  customers: CustomerProfile[];
  payments: PaymentTransaction[];
  revenueToday: number;
  activeOrdersCount: number;
  lowStockCount: number;
  dbError: string | null;
  isLoading: boolean;
  actionError: string | null;
  clearActionError: () => void;
  realtimeStatus: "CONNECTED" | "RECONNECTING" | "DISCONNECTED";
  newOrderAlert: string | null;
  clearNewOrderAlert: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<AdminRole>("ADMIN");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);

  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<"CONNECTED" | "RECONNECTING" | "DISCONNECTED">("DISCONNECTED");
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  const clearActionError = useCallback(() => setActionError(null), []);
  const clearNewOrderAlert = useCallback(() => setNewOrderAlert(null), []);

  useEffect(() => {
    const savedRole = localStorage.getItem("davinis_admin_role");
    if (savedRole) setTimeout(() => setUserRole(savedRole as AdminRole), 0);

    async function loadBackendIntelligence() {
      setIsLoading(true);
      setDbError(null);

      const res = await fetchAdminDashboardDataAction();
      if (!res.success || !res.data) {
        setDbError(res.errorMessage || "Database connection error. Verify Supabase configuration.");
        setIsLoading(false);
        return;
      }

      // Map Supabase rows to frontend interfaces
      const dbOrders: Order[] = (res.data.orders || []).map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number || o.id.slice(0, 8),
        customerName: "Customer #" + (o.user_id ? o.user_id.slice(-4) : "GUEST"),
        phone: "+234 800 000 0000",
        orderType: o.order_type || "DELIVERY",
        status: o.status,
        total: o.total_amount || 0,
        createdAt: new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        note: o.customer_note || "",
        items: (o.order_items || []).map((i: any, idx: number) => ({
          id: i.id || `${o.id}_item_${idx}`,
          name: i.product_name,
          quantity: i.quantity,
          price: i.price,
          itemPrice: i.price,
          selectedOptions: [],
        })),
      }));
      setOrders(dbOrders);

      const dbProducts: AdminProduct[] = (res.data.products || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: (p.category_id || "Soups & Swallows") as any,
        price: p.price,
        isAvailable: p.available ?? true,
        prepTime: p.preparation_time || 25,
        ordersToday: 0,
        image: p.image_url || "",
      }));
      setProducts(dbProducts);

      const dbInventory: InventoryItem[] = (res.data.inventory || []).map((inv: any) => ({
        id: inv.id,
        name: inv.name,
        category: (inv.category || "Proteins") as any,
        stock: inv.quantity,
        unit: inv.unit || "units",
        minStock: inv.minimum_stock || 10,
        status: inv.quantity <= 0 ? "Critical" : inv.quantity <= inv.minimum_stock ? "Low" : "Optimal",
        costPerUnit: inv.unit_cost || 1500,
        lastRestocked: inv.updated_at ? new Date(inv.updated_at).toLocaleDateString() : "Recent",
      }));
      setInventory(dbInventory);

      const dbPayments: PaymentTransaction[] = (res.data.payments || []).map((p: any) => {
        const matchingOrder = res.data.orders?.find((o: any) => o.id === p.order_id);
        const orderNum = matchingOrder?.order_number || (p.order_id ? p.order_id.slice(0, 8) : "N/A");
        const custName = matchingOrder ? "Customer #" + (matchingOrder.user_id ? matchingOrder.user_id.slice(-4) : "GUEST") : "Paystack Customer";
        return {
          id: p.transaction_reference || p.id?.slice(0, 8) || "N/A",
          orderNumber: orderNum,
          customerName: custName,
          amount: p.amount || 0,
          method: p.provider === "PAYSTACK" || p.payment_method === "CARD" ? "Card (Paystack)" : p.payment_method === "BANK_TRANSFER" ? "Bank Transfer" : "POS / Cash",
          status: p.status === "SUCCESS" ? "Completed" : p.status === "PENDING" ? "Pending" : "Refunded",
          timestamp: p.paid_at ? new Date(p.paid_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Pending",
        };
      });
      setPayments(dbPayments);

      setIsLoading(false);
    }

    loadBackendIntelligence();
  }, []);

  useEffect(() => {
    localStorage.setItem("davinis_admin_role", userRole);
  }, [userRole]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const supabase = createClient();
    const channels: any[] = [];

    // All roles except MANAGER and ADMIN must be blocked from inventory realtime
    if (userRole === "ADMIN" || userRole === "MANAGER") {
      const invChannel = supabase
        .channel("admin_inventory_channel")
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "inventory" }, (payload) => {
          const updatedInv = payload.new as any;
          setInventory((prev) =>
            prev.map((item) =>
              item.id === updatedInv.id
                ? {
                    ...item,
                    stock: updatedInv.quantity,
                    status:
                      updatedInv.quantity <= 0
                        ? "Critical"
                        : updatedInv.quantity <= updatedInv.minimum_stock
                        ? "Low"
                        : "Optimal",
                  }
                : item
            )
          );
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setRealtimeStatus("CONNECTED");
          else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setRealtimeStatus("RECONNECTING");
        });
      channels.push(invChannel);
    }

    // Orders channel allowed for ADMIN, MANAGER, STAFF, DELIVERY
    const ordChannel = supabase
      .channel("admin_orders_channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const newOrd = payload.new as any;
          // RBAC filter for DELIVERY: only receive assigned or dispatchable updates
          if (userRole === "DELIVERY" && newOrd.status !== "READY" && newOrd.status !== "OUT_FOR_DELIVERY") {
            return;
          }
          const formattedOrder: Order = {
            id: newOrd.id,
            orderNumber: newOrd.order_number || newOrd.id.slice(0, 8),
            customerName: "Customer #" + (newOrd.user_id ? newOrd.user_id.slice(-4) : "NEW"),
            phone: "+234 800 000 0000",
            orderType: newOrd.order_type || "DELIVERY",
            status: newOrd.status,
            total: newOrd.total_amount || 0,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            note: newOrd.customer_note || "",
            items: [],
          };
          setOrders((prev) => [formattedOrder, ...prev]);
          setNewOrderAlert(`New Order #${formattedOrder.orderNumber} received!`);
        } else if (payload.eventType === "UPDATE") {
          const updatedOrd = payload.new as any;
          if (userRole === "DELIVERY" && updatedOrd.status !== "READY" && updatedOrd.status !== "OUT_FOR_DELIVERY" && updatedOrd.status !== "DELIVERED") {
            return;
          }
          setOrders((prev) =>
            prev.map((ord) => (ord.id === updatedOrd.id ? { ...ord, status: updatedOrd.status } : ord))
          );
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setRealtimeStatus("CONNECTED");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") setRealtimeStatus("RECONNECTING");
      });
    channels.push(ordChannel);

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [userRole]);

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]): Promise<boolean> => {
    setActionError(null);
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return false;

    const res = await updateOrderStatusAction(orderId, targetOrder.status, newStatus as any, "ADMIN_USER", userRole);
    if (res.success) {
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)));
      return true;
    } else {
      setActionError(res.errorMessage || "Failed to update status.");
      return false;
    }
  };

  const assignDelivery = (orderId: string, deliveryPerson: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, assignedDeliveryPerson: deliveryPerson } : ord))
    );
  };

  const updateStock = async (itemId: string, newStock: number): Promise<boolean> => {
    setActionError(null);
    const targetInv = inventory.find((i) => i.id === itemId);
    if (!targetInv) return false;

    const delta = newStock - targetInv.stock;
    if (delta === 0) return true;

    const res = await restockInventoryAction(itemId, delta, `Manual stock adjustment to ${newStock}`, "ADMIN_USER", userRole);
    if (res.success) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              stock: newStock,
              status: newStock <= 0 ? "Critical" : newStock <= item.minStock ? "Low" : "Optimal",
            };
          }
          return item;
        })
      );
      return true;
    } else {
      setActionError(res.errorMessage || "Failed to restock inventory.");
      return false;
    }
  };

  const toggleAvailability = async (productId: string): Promise<boolean> => {
    setActionError(null);
    const targetProd = products.find((p) => p.id === productId);
    if (!targetProd) return false;

    const res = await toggleProductAvailabilityAction(productId, targetProd.isAvailable, userRole);
    if (res.success) {
      setProducts((prev) =>
        prev.map((prod) => (prod.id === productId ? { ...prod, isAvailable: !prod.isAvailable } : prod))
      );
      return true;
    } else {
      setActionError(res.errorMessage || "Failed to toggle availability.");
      return false;
    }
  };

  const addProduct = (newProdData: Omit<AdminProduct, "id" | "ordersToday">) => {
    const newProd: AdminProduct = {
      ...newProdData,
      id: crypto.randomUUID(),
      ordersToday: 0,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
  };

  const { revenueToday, activeOrdersCount, lowStockCount } = useMemo(() => {
    const rev = payments
      .filter((p) => p.status === "Completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const act = orders.filter(
      (o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "PREPARING" || o.status === "READY"
    ).length;
    const low = inventory.filter((i) => i.status === "Low" || i.status === "Critical").length;
    return { revenueToday: rev, activeOrdersCount: act, lowStockCount: low };
  }, [payments, orders, inventory]);

  return (
    <AdminContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        orders,
        updateOrderStatus,
        assignDelivery,
        inventory,
        updateStock,
        products,
        toggleAvailability,
        addProduct,
        deleteProduct,
        customers,
        payments,
        revenueToday,
        activeOrdersCount,
        lowStockCount,
        dbError,
        isLoading,
        actionError,
        clearActionError,
        realtimeStatus,
        newOrderAlert,
        clearNewOrderAlert,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};
