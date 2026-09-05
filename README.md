Yeh raha aapka **`README.md`** file ka complete content bina kisi outer block break ke. Aap ise direct copy karke apni `README.md` file me paste kar sakte hain:

# 🥐 OvenGlow — 24x7 Artisan Patisserie & Kitchen Dispatch Console

A production-ready, full-stack midnight bakery e-commerce platform built with **React 18**, **TypeScript**, and **Supabase**. Designed for 24x7 express midnight deliveries, featuring interactive delivery tracking simulations, enterprise-grade **PostgreSQL Row Level Security (RLS)**, and an authenticated **Live Kitchen Dispatch Console** powered by real-time WebSocket subscriptions.

---

## 🌟 Key Highlights & Features

### 🛍️ Client-Facing Midnight Storefront

* **Dynamic Bakes Catalog**: Real-time product querying directly from Supabase PostgreSQL tables.
* **Multi-Tier Search & Filtering**: Instant client-side search across pastry titles and flavor profiles, category tabs, and a dedicated 100% Eggless dietary toggle.
* **Interactive Shopping Bag**: Fast, persistent global cart state management engineered via **Zustand**.
* **Express Midnight Checkout**: Supports instant 30-minute rush delivery or morning scheduled drop-offs with customer location and contact capture.
* **Interactive 4-Stage Delivery Tracker**: Real-time visual timeline simulation tracking order stages (`Order Received` → `Baking in Hearth` → `Midnight Express Rider` → `Delivered Hot`) with dynamic ETAs.

### 👨‍🍳 Kitchen Staff Operations & Dispatch Console

* **Enterprise Staff Authentication**: Protected internal kitchen route powered by Supabase Auth sessions.
* **WebSocket Real-Time Subscriptions**: Listens to PostgreSQL `INSERT` and `UPDATE` replication events, auto-populating new customer orders with visual alerts without manual browser refresh.
* **One-Click State Transitions**: Kitchen staff can toggle bake lifecycle states (`Bake` → `Dispatch` → `Done`) with immediate database persistence.

### 🛡️ Enterprise Security & Database Architecture

* **Row Level Security (RLS)**:
* **Public / Anonymous Guests**: Granted strictly `INSERT` access to place orders; customer order queries (`SELECT`) and alterations (`UPDATE`) are completely blocked.
* **Authenticated Kitchen Staff**: Granted full `SELECT` and `UPDATE` privileges to manage dispatch queues.


* **Relational Integrity**: Structured PostgreSQL schema with `jsonb` array storage for cart items, timestamps, and order statuses.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│   React 18 + TypeScript + TailwindCSS + Zustand + Vite      │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
       REST API (PostgREST)           WebSocket (Realtime)
     Anonymous Order Insertion      Live Dispatch Notifications
               │                               │
┌──────────────▼───────────────────────────────┴──────────────┐
│                    Supabase Backend                         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                 Supabase Auth                       │   │
│   │     Staff JWT Verification & Session Tokens         │   │
│   └──────────────────────────┬──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │               PostgreSQL Database                   │   │
│   │  • products (Menu items, categories, pricing)       │   │
│   │  • orders (Customer details, order status, JSONB)   │   │
│   │                                                     │   │
│   │  ⚡ Row Level Security (RLS) Enforced Policies       │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

```

---

## 🗄️ Database Schema & RLS Policies

### `orders` Table Structure

| Column Name | Data Type | Constraints / Description |
| --- | --- | --- |
| `id` | `uuid` | Primary Key, default `gen_random_uuid()` |
| `customer_name` | `text` | Non-nullable customer name |
| `customer_phone` | `text` | Contact phone number |
| `delivery_address` | `text` | Complete delivery destination |
| `delivery_slot` | `text` | `'instant'` or `'scheduled'` |
| `total_amount` | `numeric` | Total bill amount in INR |
| `order_status` | `text` | `'baking'`, `'out_for_delivery'`, `'delivered'` |
| `items` | `jsonb` | Structured JSON array of ordered items |
| `created_at` | `timestamptz` | Default `now()` |

### PostgreSQL Security Policies

```sql
-- Enable RLS
alter table orders enable row level security;

-- Public guests can only insert their orders
create policy "Allow public order placement"
  on orders for insert
  to public
  with check (true);

-- Authenticated kitchen personnel can view dispatch queues
create policy "Allow authenticated staff to read orders"
  on orders for select
  to authenticated
  using (true);

-- Authenticated kitchen personnel can update status flags
create policy "Allow authenticated staff to update orders"
  on orders for update
  to authenticated
  using (true);

```

---

## 💻 Tech Stack & Tooling

* **Frontend Core**: React 18, TypeScript, Vite
* **Styling & UI**: TailwindCSS, Lucide React Icons
* **Global State Management**: Zustand
* **Backend & Database**: Supabase (PostgreSQL, Realtime Subscriptions, GoTrue Auth)
* **Deployment & CI/CD**: Vercel (Automated Git Webhook Deployments)

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/rkb-sdet/ovenglow-bakery.git
cd ovenglow-bakery

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and provide your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

```

### 4. Run Development Server

```bash
npm run dev

```

Open `http://localhost:5173` in your browser.

### 5. Build for Production

```bash
npm run build

```

---

## 👨‍🍳 Kitchen Console Demo Access

To review the authenticated dispatch console:

1. Click the floating **"🔒 Staff Kitchen Console"** button in the bottom right corner of the storefront.
2. Sign in with authorized demo staff credentials:
* **Email:** `staff@ovenglow.com`
* **Password:** *(Configured during Supabase Auth setup)*


3. View incoming orders popping up in real time and test status modifications.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.