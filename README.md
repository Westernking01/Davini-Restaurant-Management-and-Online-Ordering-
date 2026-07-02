# Davini's Food Bank — Restaurant Management & Luxury Online Ordering Platform

An enterprise-grade, full-stack dining concierge and restaurant management monorepo built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Supabase**, and **Paystack**. Designed for warm hospitality, high-concurrency order workflows, and real-time kitchen coordination.

---

## 🏛️ Architecture Overview

The system is organized as a unified npm workspace containing two specialized applications and shared infrastructure:

```
davinis-food-bank/
├── apps/
│   ├── customer/        # Customer Web & Mobile Online Ordering Portal
│   └── admin/           # Executive Kitchen Display & Restaurant Dashboard
├── shared/              # Shared UI components, types, and utility modules
└── supabase/            # Database schemas, migrations, RLS policies, and seeds
```

---

## ✨ Key Features

### 🍽️ Customer Portal (`apps/customer`)
- **Interactive Menu Discovery**: Filter by categories (Signature Jollof, Flame-Grilled Grills, Traditional Soups, Artisan Sides) with dietary tags and rich imagery.
- **Bespoke Dish Customization**: Add portions, spice levels, extras, and special kitchen instructions before ordering.
- **Dining Concierge Cart Drawer**: Content-responsive cart experience featuring instant quantity updates, secure guest delivery protocols, and transparent fee breakdowns.
- **Seamless Checkout & Payments**: Dual payment channel support supporting **Paystack Card Gateway** (with automated verification and dev-mode fallback simulation) and **Pay on Delivery (POS/Cash)**.
- **Customer Dashboard (`/account`)**: Real-time order tracking, order history snapshots, loyalty points preview, and profile management.

### 👨‍🍳 Admin & Kitchen Portal (`apps/admin`)
- **Live Order State Machine**: Transition orders seamlessly across stages (`PENDING` → `CONFIRMED` → `PREPARING` → `READY` → `DELIVERED` / `CANCELLED`).
- **Kitchen Display System (KDS)**: Real-time ticket management with prep timing and item modification tags.
- **Inventory & Menu Control**: Live availability toggling, price management, and stock replenishment alerts.
- **Financial & Refund Management**: Secure transaction auditing and automated refund processing via isolated server-side service role execution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), Lucide Icons, Plus Jakarta Sans / Cormorant Garamond |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL 15+, Auth, Row-Level Security, Service Role API) |
| **Payment Gateway** | [Paystack API v2](https://paystack.com/) & Sandbox Checkout Simulation |
| **Language & Tooling** | TypeScript 5, ESLint 9, Turbopack |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- A **Supabase** project instance
- **Paystack** account (for live card payments)

### 1. Installation

Clone the repository and install dependencies across all workspaces:

```bash
git clone https://github.com/your-org/davinis-food-bank.git
cd davinis-food-bank
npm install
```

### 2. Environment Setup

Create environment configuration files in both `apps/customer` and `apps/admin`.

#### `apps/customer/.env`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

#### `apps/admin/.env`
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

> [!IMPORTANT]
> The `SUPABASE_SERVICE_ROLE_KEY` is strictly isolated to server-side server actions (`createServiceRoleClient()`) and is never bundled into frontend client code.

### 3. Database Initialization

Execute the SQL schemas in your Supabase SQL editor or via the Supabase CLI:
1. Run table creation scripts from `supabase/migrations/` (creates `products`, `categories`, `orders`, `order_items`, `payments`, `customer_profiles`, and `users`).
2. Apply Row-Level Security (RLS) policies.

### 4. Run Development Servers

Start both applications simultaneously or individually:

```bash
# Start all workspaces (or start individually within apps/customer or apps/admin)
npm run dev --workspace=apps/customer
npm run dev --workspace=apps/admin
```

- **Customer Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3001](http://localhost:3001)

---

## 🧪 Verification & Quality Control

To ensure type safety and production readiness across the monorepo:

```bash
# Run TypeScript compilation check
npx tsc --noEmit --project apps/customer/tsconfig.json
npx tsc --noEmit --project apps/admin/tsconfig.json

# Build production bundles
npm run build --workspace=apps/customer
npm run build --workspace=apps/admin
```

---

## 🔒 Security & Architecture Patterns

- **Separation of Concerns**: User session reads rely on `@supabase/ssr` cookies, while atomic database writes (`createAtomicOrder`, inventory syncs) execute via dedicated `@supabase/supabase-js` service role clients to prevent authorization header collisions.
- **Idempotent Checkout**: Order items are snapshotted immutably into `order_items` at checkout time so menu price changes never corrupt historical receipts.
- **Graceful Fallbacks**: In development mode (`NODE_ENV !== "production"`), Paystack card initialization falls back to simulated webhook callbacks for uninterrupted end-to-end testing.

---

## 📄 License

Proprietary — All rights reserved by **Davini's Food Bank**.
