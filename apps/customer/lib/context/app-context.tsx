"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Product, ProductOption, Category, INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "../data/mock-data";
import { createOrderAction, fetchMenuProductsAction, fetchCategoriesAction, fetchCustomerOrdersAction } from "@/actions/order-actions";
import { createClient } from "@/lib/supabase/client";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: ProductOption[];
  note?: string;
  itemPrice: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedOptions?: ProductOption[];
  price?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address?: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity: number, options?: ProductOption[], note?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  subtotal: number;
  tax: number;
  cartCount: number;
  orders: Order[];
  placeOrderAsync: (orderData: { name: string; phone: string; email?: string; address?: string; note?: string; orderType: "DELIVERY" | "PICKUP" | "DINE_IN"; paymentMethod?: "CARD" | "CASH" }) => Promise<{ success: boolean; orderNumber?: string; authorizationUrl?: string; errorMessage?: string }>;
  placeOrder: (orderData: { name: string; phone: string; address?: string; note?: string; orderType: "DELIVERY" | "PICKUP" | "DINE_IN" }) => Order;
  dbError: string | null;
  isLoading: boolean;
  realtimeStatus: "CONNECTED" | "RECONNECTING" | "DISCONNECTED";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [realtimeStatus, setRealtimeStatus] = useState<"CONNECTED" | "RECONNECTING" | "DISCONNECTED">("DISCONNECTED");
  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    // Initialize stable customer session ID
    let storedId = localStorage.getItem("davinis_customer_user_id");
    if (!storedId) {
      storedId = "cust_guest_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      localStorage.setItem("davinis_customer_user_id", storedId);
    }
    setCustomerId(storedId);

    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setCustomerId(data.session.user.id);
        localStorage.setItem("davinis_customer_user_id", data.session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setCustomerId(session.user.id);
        localStorage.setItem("davinis_customer_user_id", session.user.id);
      } else if (event === "SIGNED_OUT") {
        const newGuestId = "cust_guest_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        setCustomerId(newGuestId);
        localStorage.setItem("davinis_customer_user_id", newGuestId);
      }
    });

    // Check local storage cart
    const savedCart = localStorage.getItem("davinis_customer_cart");
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    // Load backend workflows
    async function loadBackendData() {
      setIsLoading(true);
      setDbError(null);

      const [prodRes, catRes] = await Promise.all([
        fetchMenuProductsAction(),
        fetchCategoriesAction(),
      ]);

      if (!prodRes.success || !catRes.success) {
        const err = prodRes.errorMessage || catRes.errorMessage || "Database configuration error or connection failed.";
        setDbError(err);
        setIsLoading(false);
        return;
      }

      if (prodRes.data && prodRes.data.length > 0) {
        const mappedProducts: Product[] = prodRes.data.map((p: any) => ({
          id: p.id,
          categoryId: p.category_id || "c1111111-1111-4111-a111-111111111111",
          name: p.name,
          description: p.description || "",
          price: p.price,
          image: p.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
          prepTime: p.preparation_time || 20,
          available: p.available ?? true,
          featured: p.featured ?? false,
          options: p.food_options ? p.food_options.map((fo: any) => ({ name: fo.option_name, type: fo.option_type, extraPrice: fo.extra_price })) : [],
        }));
        setProducts(mappedProducts);
      }

      if (catRes.data && catRes.data.length > 0) {
        const mappedCats: Category[] = catRes.data.map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description || "",
          image: c.image_url || "",
        }));
        setCategories(mappedCats);
      }

      setIsLoading(false);
    }

    loadBackendData();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("davinis_customer_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, options: ProductOption[] = [], note?: string) => {
    const optionsCost = options.reduce((sum, opt) => sum + opt.extraPrice, 0);
    const itemPrice = product.price + optionsCost;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(options) &&
          item.note === note
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [
          ...prev,
          {
            id: `${product.id}_${Date.now()}`,
            product,
            quantity,
            selectedOptions: options,
            note,
            itemPrice,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const { subtotal, tax, cartTotal, cartCount } = useMemo(() => {
    const sub = cart.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
    const tx = Math.round(sub * 0.075);
    const tot = sub + tx;
    const cnt = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: sub, tax: tx, cartTotal: tot, cartCount: cnt };
  }, [cart]);

  // Synchronous fallback for legacy calls during transition
  const placeOrder = (orderData: { name: string; phone: string; address?: string; note?: string; orderType: "DELIVERY" | "PICKUP" | "DINE_IN" }): Order => {
    const fallbackOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `DVB-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.name,
      phone: orderData.phone,
      address: orderData.address,
      status: "CONFIRMED",
      orderType: orderData.orderType,
      total: cartTotal + (orderData.orderType === "DELIVERY" ? 1500 : 0),
      createdAt: "Just now",
      items: cart.map((i) => ({ product: i.product, quantity: i.quantity, price: i.itemPrice })),
    };
    setOrders((prev) => [fallbackOrder, ...prev]);
    clearCart();
    return fallbackOrder;
  };

  const placeOrderAsync = async (orderData: { name: string; phone: string; email?: string; address?: string; note?: string; orderType: "DELIVERY" | "PICKUP" | "DINE_IN"; paymentMethod?: "CARD" | "CASH" }) => {
    const payload = {
      userId: customerId || "cust_guest_" + Date.now(),
      customerName: orderData.name,
      email: orderData.email || "guest@davinisfoodbank.com",
      phone: orderData.phone,
      orderType: orderData.orderType,
      deliveryAddress: orderData.address,
      customerNote: orderData.note,
      paymentMethod: orderData.paymentMethod || "CARD",
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        price: i.itemPrice,
        quantity: i.quantity,
        selectedOptions: i.selectedOptions ? { options: i.selectedOptions } : undefined,
      })),
    };

    const res = await createOrderAction(payload);
    if (res.success && res.orderNumber) {
      const newOrder: Order = {
        id: res.orderId || `ord_${Date.now()}`,
        orderNumber: res.orderNumber,
        customerName: orderData.name,
        phone: orderData.phone,
        address: orderData.address,
        status: res.authorizationUrl ? "PENDING" : "CONFIRMED",
        orderType: orderData.orderType,
        total: cartTotal + (orderData.orderType === "DELIVERY" ? 1500 : 0),
        createdAt: "Just now",
        items: cart.map((i) => ({ product: i.product, quantity: i.quantity, price: i.itemPrice })),
      };
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
    }
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        subtotal,
        tax,
        cartCount,
        orders,
        placeOrderAsync,
        placeOrder,
        dbError,
        isLoading,
        realtimeStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
