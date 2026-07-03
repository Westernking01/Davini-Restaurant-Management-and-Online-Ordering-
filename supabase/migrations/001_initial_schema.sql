-- Davini's Food Bank Database Schema & Security Foundation (Version 1.1)
-- Adheres strictly to docs/04_DATABASE_SCHEMA.md (20 Normalized Tables)
-- Incorporates verified granular RBAC, customer isolation, FK cascades, and auto-profile triggers.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'MANAGER', 'STAFF', 'DELIVERY');
CREATE TYPE order_type_enum AS ENUM ('DELIVERY', 'PICKUP', 'DINE_IN');
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PAID', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE reservation_status_enum AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE inventory_status_enum AS ENUM ('AVAILABLE', 'LOW_STOCK', 'OUT_OF_STOCK');
CREATE TYPE inventory_transaction_type AS ENUM ('ADD', 'REMOVE', 'ADJUSTMENT');
CREATE TYPE delivery_status_enum AS ENUM ('ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED');
CREATE TYPE discount_type_enum AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');
CREATE TYPE loyalty_tx_type_enum AS ENUM ('EARN', 'REDEEM');

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. CUSTOMER PROFILES (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    landmark TEXT,
    profile_image TEXT,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_customer_profile UNIQUE(user_id)
);

-- ==========================================
-- 3. RESTAURANT SETTINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_name TEXT NOT NULL DEFAULT 'Davini''s Food Bank',
    logo_url TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    opening_hours JSONB DEFAULT '{"monday": "9:00 - 22:00", "tuesday": "9:00 - 22:00", "wednesday": "9:00 - 22:00", "thursday": "9:00 - 22:00", "friday": "9:00 - 23:00", "saturday": "10:00 - 23:00", "sunday": "10:00 - 21:00"}'::jsonb,
    delivery_fee DECIMAL(10,2) DEFAULT 1500.00,
    tax_rate DECIMAL(5,2) DEFAULT 7.50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. CATEGORIES
-- ==========================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. PRODUCTS (FK -> categories.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    preparation_time INTEGER DEFAULT 20,
    available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. FOOD OPTIONS (FK -> products.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS food_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    option_name TEXT NOT NULL,
    option_type TEXT NOT NULL,
    extra_price DECIMAL(10,2) DEFAULT 0.00
);

-- ==========================================
-- 7. CARTS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_cart UNIQUE(user_id)
);

-- ==========================================
-- 8. CART ITEMS (FK -> carts.id, products.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_options JSONB DEFAULT '{}'::jsonb,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. ORDERS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number TEXT UNIQUE NOT NULL,
    order_type order_type_enum NOT NULL DEFAULT 'DELIVERY',
    status order_status_enum NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    customer_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 10. ORDER ITEMS (FK -> orders.id, products.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    selected_options JSONB DEFAULT '{}'::jsonb
);

-- ==========================================
-- 11. PAYMENTS (FK -> orders.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    transaction_reference TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    payment_method TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 12. REVIEWS (FK -> users.id, products.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    image_url TEXT,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 13. RESERVATIONS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL,
    special_request TEXT,
    status reservation_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 14. INVENTORY
-- ==========================================
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    minimum_stock DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    status inventory_status_enum NOT NULL DEFAULT 'AVAILABLE',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 15. INVENTORY TRANSACTIONS (FK -> inventory.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    type inventory_transaction_type NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 16. DELIVERIES (FK -> orders.id, users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_person_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status delivery_status_enum NOT NULL DEFAULT 'ASSIGNED',
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ==========================================
-- 17. NOTIFICATIONS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 18. PROMOTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type discount_type_enum NOT NULL DEFAULT 'PERCENTAGE',
    value DECIMAL(10,2) NOT NULL,
    expiry_date TIMESTAMPTZ NOT NULL,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- 19. LOYALTY TRANSACTIONS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    type loyalty_tx_type_enum NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 20. AUDIT LOGS (FK -> users.id)
-- ==========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXING REQUIREMENTS (Section 19)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ==========================================
-- TRIGGERS: UPDATED_AT & AUTOMATIC PROFILE CREATION
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create customer profile when a user registers with CUSTOMER role
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
   IF NEW.role = 'CUSTOMER' THEN
      INSERT INTO customer_profiles (user_id, loyalty_points)
      VALUES (NEW.id, 0)
      ON CONFLICT (user_id) DO NOTHING;
   END IF;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_create_profile
AFTER INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user_profile();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Authorization Functions
CREATE OR REPLACE FUNCTION get_current_user_role() RETURNS user_role AS $$
DECLARE
  current_role user_role;
BEGIN
  SELECT role INTO current_role FROM users WHERE id = auth.uid();
  RETURN current_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PUBLIC CATALOG READS
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read food_options" ON food_options FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public read promotions" ON promotions FOR SELECT USING (active = true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (status = true);

-- 2. CUSTOMER ISOLATION POLICIES (Strictly own data)
CREATE POLICY "Customer view own user record" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Customer update own user record" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Customer insert own user record" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Customer view own profile" ON customer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customer update own profile" ON customer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customer insert own profile" ON customer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customer manage own cart" ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Customer manage own cart items" ON cart_items FOR ALL USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

CREATE POLICY "Customer view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customer insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customer view own order items" ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
CREATE POLICY "Customer insert own order items" ON order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Customer create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customer view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customer manage own reservations" ON reservations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Customer view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customer update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customer view own loyalty points" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);

-- 3. ADMIN FULL MANAGEMENT ACCESS
CREATE POLICY "Admin full access all tables" ON users FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access profiles" ON customer_profiles FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access settings" ON restaurant_settings FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access options" ON food_options FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access orders" ON orders FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access order items" ON order_items FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access payments" ON payments FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access reservations" ON reservations FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access inventory" ON inventory FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access inventory tx" ON inventory_transactions FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access deliveries" ON deliveries FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access notifications" ON notifications FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access promotions" ON promotions FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access loyalty" ON loyalty_transactions FOR ALL USING (get_current_user_role() = 'ADMIN');
CREATE POLICY "Admin full access audit" ON audit_logs FOR ALL USING (get_current_user_role() = 'ADMIN');

-- 4. MANAGER POLICIES (Access Orders, Menu, Inventory, Customers, Reports. Restricted from User management & critical settings)
CREATE POLICY "Manager read users" ON users FOR SELECT USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage profiles" ON customer_profiles FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager read settings" ON restaurant_settings FOR SELECT USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage categories" ON categories FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage products" ON products FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage options" ON food_options FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage orders" ON orders FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage order items" ON order_items FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager read payments" ON payments FOR SELECT USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage reviews" ON reviews FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage reservations" ON reservations FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage inventory" ON inventory FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage inventory tx" ON inventory_transactions FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage deliveries" ON deliveries FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager manage promotions" ON promotions FOR ALL USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager read loyalty" ON loyalty_transactions FOR SELECT USING (get_current_user_role() = 'MANAGER');
CREATE POLICY "Manager insert audit" ON audit_logs FOR INSERT WITH CHECK (get_current_user_role() = 'MANAGER');

-- 5. STAFF POLICIES (Orders + Kitchen Workflow only)
CREATE POLICY "Staff read categories" ON categories FOR SELECT USING (get_current_user_role() = 'STAFF');
CREATE POLICY "Staff read products" ON products FOR SELECT USING (get_current_user_role() = 'STAFF');
CREATE POLICY "Staff read options" ON food_options FOR SELECT USING (get_current_user_role() = 'STAFF');
CREATE POLICY "Staff read inventory" ON inventory FOR SELECT USING (get_current_user_role() = 'STAFF');
CREATE POLICY "Staff manage orders" ON orders FOR ALL USING (get_current_user_role() = 'STAFF');
CREATE POLICY "Staff manage order items" ON order_items FOR ALL USING (get_current_user_role() = 'STAFF');

-- 6. DELIVERY POLICIES (Assigned deliveries & status updates only)
CREATE POLICY "Delivery view assigned orders" ON orders FOR SELECT USING (
  get_current_user_role() = 'DELIVERY' AND id IN (SELECT order_id FROM deliveries WHERE delivery_person_id = auth.uid())
);
CREATE POLICY "Delivery view assigned items" ON order_items FOR SELECT USING (
  order_id IN (SELECT order_id FROM deliveries WHERE delivery_person_id = auth.uid())
);
CREATE POLICY "Delivery manage assigned deliveries" ON deliveries FOR ALL USING (
  get_current_user_role() = 'DELIVERY' AND delivery_person_id = auth.uid()
);
