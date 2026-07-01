export interface AdminOrderItem {
  id: string;
  name: string;
  quantity: number;
  options?: string[];
  price: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address?: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  orderType: "DELIVERY" | "PICKUP" | "DINE_IN";
  total: number;
  createdAt: string;
  notes?: string;
  assignedDeliveryPerson?: string;
  items: AdminOrderItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Proteins" | "Produce" | "Spices" | "Packaging" | "Grains";
  stock: number;
  unit: string;
  minStock: number;
  status: "Optimal" | "Low" | "Critical";
  costPerUnit: number;
  lastRestocked: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  category: "Soups & Swallows" | "Grills & Suya" | "Rice Specialties" | "Beverages";
  price: number;
  isAvailable: boolean;
  prepTime: number;
  ordersToday: number;
  image: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate: string;
}

export interface PaymentTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: "Card (Paystack)" | "Bank Transfer" | "POS / Cash";
  status: "Completed" | "Pending" | "Refunded";
  timestamp: string;
}

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ord_101",
    orderNumber: "DVB-8834",
    customerName: "Chief Adebayo O.",
    phone: "+234 803 000 1122",
    address: "14 Victoria Island Way, Lagos",
    status: "PREPARING",
    orderType: "DELIVERY",
    total: 15000,
    createdAt: "10 mins ago",
    notes: "Extra spicy pepper sauce on the side",
    assignedDeliveryPerson: "Chinedu Express",
    items: [
      { id: "item_1", name: "Smoked Goat Meat Jollof Feast", quantity: 1, options: ["Large Portion", "Fire Spiced"], price: 8500 },
      { id: "item_2", name: "Flame-Grilled Beef Suya Platter", quantity: 1, options: ["Medium Spice"], price: 6500 }
    ]
  },
  {
    id: "ord_102",
    orderNumber: "DVB-8835",
    customerName: "Ngozi OkaFOR",
    phone: "+234 802 333 4455",
    status: "CONFIRMED",
    orderType: "PICKUP",
    total: 9500,
    createdAt: "5 mins ago",
    items: [
      { id: "item_3", name: "Fisherman's Seafood Pepper Soup", quantity: 1, options: ["Pounded Yam"], price: 9500 }
    ]
  },
  {
    id: "ord_103",
    orderNumber: "DVB-8836",
    customerName: "Dr. Babatunde K.",
    phone: "+234 805 111 9988",
    address: "Table 4 (VIP Lounge)",
    status: "READY",
    orderType: "DINE_IN",
    total: 21000,
    createdAt: "22 mins ago",
    notes: "Serve drinks first",
    items: [
      { id: "item_4", name: "Royal Egusi Soup & Pounded Yam", quantity: 2, options: ["Assorted Meat"], price: 15000 },
      { id: "item_5", name: "Chilled Zobo Hibiscus Infusion", quantity: 3, price: 6000 }
    ]
  },
  {
    id: "ord_104",
    orderNumber: "DVB-8830",
    customerName: "Funke Akindele",
    phone: "+234 809 777 6655",
    address: "Plot 12, Lekki Phase 1, Lagos",
    status: "OUT_FOR_DELIVERY",
    orderType: "DELIVERY",
    total: 12500,
    createdAt: "45 mins ago",
    assignedDeliveryPerson: "Tunde Logistics",
    items: [
      { id: "item_6", name: "Smoked Goat Meat Jollof Feast", quantity: 1, price: 8500 },
      { id: "item_7", name: "Fresh Palm Wine (Calabar Harvest)", quantity: 1, price: 4000 }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv_1", name: "Smoked Goat Meat (Asun)", category: "Proteins", stock: 12, unit: "kg", minStock: 15, status: "Low", costPerUnit: 6500, lastRestocked: "Yesterday" },
  { id: "inv_2", name: "Red Scotch Bonnet Peppers", category: "Produce", stock: 4, unit: "baskets", minStock: 10, status: "Critical", costPerUnit: 12000, lastRestocked: "3 days ago" },
  { id: "inv_3", name: "Long Grain Parboiled Rice", category: "Grains", stock: 85, unit: "50kg bags", minStock: 20, status: "Optimal", costPerUnit: 75000, lastRestocked: "Last week" },
  { id: "inv_4", name: "Fresh Croaker Fish", category: "Proteins", stock: 28, unit: "kg", minStock: 15, status: "Optimal", costPerUnit: 5200, lastRestocked: "Today" },
  { id: "inv_5", name: "Refined Palm Oil", category: "Spices", stock: 18, unit: "25L kegs", minStock: 8, status: "Optimal", costPerUnit: 32000, lastRestocked: "2 weeks ago" },
  { id: "inv_6", name: "Branded Gourmet Takeout Boxes", category: "Packaging", stock: 120, unit: "pcs", minStock: 200, status: "Low", costPerUnit: 350, lastRestocked: "Last month" }
];

export const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = [
  { id: "8a2f1c3e-1111-4111-a111-111111111111", name: "Smoked Goat Meat Jollof Feast", category: "Rice Specialties", price: 8500, isAvailable: true, prepTime: 25, ordersToday: 34, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" },
  { id: "8a2f1c3e-2222-4222-a222-222222222222", name: "Royal Egusi Soup & Pounded Yam", category: "Soups & Swallows", price: 7500, isAvailable: true, prepTime: 20, ordersToday: 28, image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" },
  { id: "8a2f1c3e-3333-4333-a333-333333333333", name: "Flame-Grilled Beef Suya Platter", category: "Grills & Suya", price: 6500, isAvailable: true, prepTime: 15, ordersToday: 42, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" },
  { id: "8a2f1c3e-4444-4444-a444-444444444444", name: "Fisherman's Seafood Pepper Soup", category: "Soups & Swallows", price: 9500, isAvailable: true, prepTime: 30, ordersToday: 16, image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80" },
  { id: "8a2f1c3e-5555-4555-a555-555555555555", name: "Chilled Zobo Hibiscus Infusion", category: "Beverages", price: 2000, isAvailable: true, prepTime: 5, ordersToday: 55, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
  { id: "8a2f1c3e-6666-4666-a666-666666666666", name: "Fresh Palm Wine (Calabar Harvest)", category: "Beverages", price: 4000, isAvailable: false, prepTime: 5, ordersToday: 0, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  { id: "cust_1", name: "Chief Adebayo O.", email: "adebayo.o@vip.ng", phone: "+234 803 000 1122", ordersCount: 24, totalSpent: 385000, loyaltyPoints: 1250, lastOrderDate: "Today" },
  { id: "cust_2", name: "Funke Akindele", email: "funke.a@nollywood.com", phone: "+234 809 777 6655", ordersCount: 18, totalSpent: 290000, loyaltyPoints: 890, lastOrderDate: "Today" },
  { id: "cust_3", name: "Dr. Babatunde K.", email: "dr.babs@lagosmed.ng", phone: "+234 805 111 9988", ordersCount: 31, totalSpent: 520000, loyaltyPoints: 1800, lastOrderDate: "Yesterday" },
  { id: "cust_4", name: "Ngozi Okafor", email: "ngozi@techhub.ng", phone: "+234 802 333 4455", ordersCount: 7, totalSpent: 84000, loyaltyPoints: 210, lastOrderDate: "3 days ago" }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  { id: "txn_901", orderNumber: "DVB-8834", customerName: "Chief Adebayo O.", amount: 15000, method: "Card (Paystack)", status: "Completed", timestamp: "10:45 AM" },
  { id: "txn_902", orderNumber: "DVB-8835", customerName: "Ngozi Okafor", amount: 9500, method: "Bank Transfer", status: "Completed", timestamp: "10:50 AM" },
  { id: "txn_903", orderNumber: "DVB-8836", customerName: "Dr. Babatunde K.", amount: 21000, method: "POS / Cash", status: "Pending", timestamp: "10:33 AM" },
  { id: "txn_904", orderNumber: "DVB-8830", customerName: "Funke Akindele", amount: 12500, method: "Card (Paystack)", status: "Completed", timestamp: "10:10 AM" }
];
