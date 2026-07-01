export type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'DELIVERY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  address?: string;
  landmark?: string;
  profile_image?: string;
  loyalty_points: number;
  created_at: string;
}

export interface RestaurantSettings {
  id: string;
  restaurant_name: string;
  logo_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  opening_hours: Record<string, any>;
  delivery_fee: number;
  tax_rate: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  status: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  preparation_time: number;
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodOption {
  id: string;
  product_id: string;
  option_name: string;
  option_type: string;
  extra_price: number;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  selected_options?: Record<string, any>;
  note?: string;
  created_at: string;
}

export type OrderType = 'DELIVERY' | 'PICKUP' | 'DINE_IN';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  delivery_address?: string;
  customer_note?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  selected_options?: Record<string, any>;
}

export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'CASH';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  amount: number;
  status: PaymentStatus;
  paid_at?: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  rating: number;
  comment?: string;
  image_url?: string;
  created_at: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: string;
  user_id: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  special_request?: string;
  status: ReservationStatus;
  created_at: string;
}

export type InventoryStatus = 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Inventory {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minimum_stock: number;
  status: InventoryStatus;
  updated_at: string;
}

export type InventoryTransactionType = 'ADD' | 'REMOVE' | 'ADJUSTMENT';

export interface InventoryTransaction {
  id: string;
  inventory_id: string;
  type: InventoryTransactionType;
  quantity: number;
  note?: string;
  created_at: string;
}

export type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'ON_ROUTE' | 'DELIVERED';

export interface Delivery {
  id: string;
  order_id: string;
  delivery_person_id: string;
  status: DeliveryStatus;
  assigned_at?: string;
  completed_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  created_at: string;
}

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountType;
  value: number;
  expiry_date: string;
  active: boolean;
}

export type LoyaltyTransactionType = 'EARN' | 'REDEEM';

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  type: LoyaltyTransactionType;
  description?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  created_at: string;
}
