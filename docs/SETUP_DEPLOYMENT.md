# MediGuide Setup & Deployment Guide

This guide details installation, database migration, demonstration seeding, and deployment for local and production environments.

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: npm v9+

---

## 2. Quick Local Setup (Development)

### Step 1: Install Dependencies
From the repository root:
```bash
# In server directory:
cd server
npm.cmd install

# In client directory:
cd ../client
npm.cmd install
```

### Step 2: Database Setup & Migrations
In `server/.env`, verify:
```ini
DATABASE_URL="file:./dev.db"
PORT=5000
JWT_SECRET="mediguide-secure-jwt-secret-key-change-in-production-2026"
```

Initialize the database schema:
```bash
cd server
npx.cmd prisma generate
npx.cmd prisma db push
```

### Step 3: Seed Demonstration Data
Populate the database with realistic healthcare facilities, services, cost tariffs, users, and audit logs:
```bash
npx.cmd tsx prisma/seed.ts
```

### Step 4: Run Application
To start both backend server and frontend client concurrently:
From the root directory:
```bash
npm.cmd run dev
```
Or in separate terminals:
- Terminal 1 (Server): `cd server && npm.cmd run dev` (Runs on `http://localhost:5000`)
- Terminal 2 (Client): `cd client && npm.cmd run dev` (Runs on `http://localhost:5173`)

Open `http://localhost:5173` in your browser.

---

## 3. Pre-Seeded Demonstration Accounts

| Role | Email | Password | Assigned Organization |
|---|---|---|---|
| **Administrator** | `admin@mediguide.org` | `AdminPassword123!` | Platform Admin |
| **Facility Representative 1** | `rep.apollo@mediguide.org` | `RepPassword123!` | Apollo Multi-Speciality Hospital |
| **Facility Representative 2** | `rep.max@mediguide.org` | `RepPassword123!` | Max Super Speciality Hospital |
| **Registered Patient 1** | `user.rahul@example.com` | `UserPassword123!` | None (General User) |
| **Registered Patient 2** | `user.priya@example.com` | `UserPassword123!` | None (General User) |

*(Quick-autofill buttons are built directly into the `/login` screen for effortless evaluation!)*

---

## 4. Production Deployment with PostgreSQL

To switch to PostgreSQL:
1. Update `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Configure your production connection string in `server/.env`:
   ```ini
   DATABASE_URL="postgresql://user:password@localhost:5432/mediguide?schema=public"
   ```
3. Run migrations and seed:
   ```bash
   npx.cmd prisma migrate deploy
   npx.cmd tsx prisma/seed.ts
   ```
4. Build the client bundle:
   ```bash
   cd client && npm.cmd run build
   ```
5. Serve the static frontend assets via NGINX or reverse proxy to the Node.js Express server.
