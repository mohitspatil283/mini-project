# MediGuide

> **Integrated Healthcare Navigation and Cost Transparency Platform**
> *Academic Full-Stack Demonstration • B.Tech IT Mini-Project*

[![SRS Aligned](https://img.shields.io/badge/SRS%20Specification-100%25%20Implemented-emerald)](docs/ARCHITECTURE.md)
[![Automated Tests](https://img.shields.io/badge/Test%20Suite-15%20Passed%20%2F%200%20Failed-blue)](docs/TESTING_GUIDE.md)
[![Primary City](https://img.shields.io/badge/Primary%20City-Pune%20(31%2B%20Localities)-indigo)](docs/ARCHITECTURE.md)
[![Database](https://img.shields.io/badge/ORM-Prisma%205.22-purple)](docs/DATABASE_SCHEMA.md)

---

## 1. Project Overview

**MediGuide** is an integrated healthcare navigation and cost transparency platform enabling patients and families to:
- **Discover healthcare facilities**: Hospitals, Polyclinics, Pharmacies, Diagnostic Imaging Centres, Blood Centres, and Laboratories.
- **Location-Based Healthcare Data (Section 50)**:
  - **Primary Focus City: Pune** (31+ Localities covered in depth: Pimpri-Chinchwad, Wakad, Hinjawadi, Baner, Aundh, Shivajinagar, Kothrud, Deccan, Hadapsar, Kharadi, Viman Nagar, Koregaon Park, Yerawada, Swargate, Camp, Kondhwa, Pimple Saudagar, Pimple Gurav, Bhosari, Akurdi, Nigdi, Chinchwad, Dapodi, Vishrantwadi, Lohegaon, Wagholi, Sinhagad Road, Dhayari, Narhe, Bavdhan, Katraj).
  - **Other Maharashtra Cities**: Mumbai, Navi Mumbai, Thane, Nagpur, Nashik, Chhatrapati Sambhajinagar, Kolhapur, Solapur, Satara, Sangli, Ahilyanagar.
  - **Hierarchical Drill-down Workflow**: **City → Area/Locality → Facility/Service → Radius**.
  - **Data Provenance Distinction**: Clear distinction between Demo Sample Data (`DEMONSTRATION_SAMPLE`), Verified Partner Data (`VERIFIED_PARTNER`), and Unverified Submissions (`UNVERIFIED_CROWDSOURCED`).
- **Calculate travel distances**: Accurate spherical Haversine distance computations (`1.3 km away`) with radius filtering (`1 km`, `5 km`, `10 km`, `15 km`, `25 km`, `50 km`).
- **Explore transparent pricing**: Procedure tariff schedules with fixed costs and cost ranges (e.g., General Consultation ₹500, MRI Scan ₹6,500 – ₹9,500, Blood Test ₹250 – ₹400), unit basis, and collection sources.
- **Side-by-side cost comparison**: Compare tariffs across up to 4 healthcare facilities simultaneously with benchmark presets (Ruby Hall Clinic vs Jupiter Hospital vs Sancheti Institute).
- **Bookmark favorite facilities**: Save frequently visited providers for quick access.
- **Report inaccuracies**: Community reporting of outdated telephone numbers, hours, or tariffs.
- **Role-based administration**: Multi-tiered verification pipeline for authorized facility representatives and platform administrators.

### Regulatory Notice
MediGuide is strictly an information and navigation service.
> **"Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility."**
*MediGuide does not provide clinical diagnoses, prescribe medicines, replace emergency services, or process hospital billing.*

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Leaflet (OpenStreetMap), Lucide Icons.
- **Backend**: Node.js, Express.js REST API, TypeScript, JSON Web Tokens (JWT), Bcrypt password hashing.
- **Database & ORM**: Prisma ORM with relational schema (PostgreSQL ready / SQLite default).
- **Security**: Strict RBAC authorization middleware, SQL injection prevention, object-access isolation, immutable audit logging.

---

## 3. Quick Start

### 1. Install Dependencies
```bash
# Server dependencies:
cd server && npm.cmd install

# Client dependencies:
cd ../client && npm.cmd install
```

### 2. Database Migration & Seed
```bash
cd server
npx.cmd prisma generate
npx.cmd prisma db push
npx.cmd tsx prisma/seed.ts
```

### 3. Run Automated SRS Test Suite
```bash
npm.cmd run test
```
*(Executes all 15 SRS test cases: TC-AUTH, TC-SEARCH, TC-LOC, TC-COST, TC-SAVE, TC-REP, TC-ADMIN, TC-SEC)*

### 4. Start Development Servers
From the root directory:
```bash
# Terminal 1 - Backend Server (Port 5000):
cd server && npm.cmd run dev

# Terminal 2 - Frontend Client (Port 5173):
cd client && npm.cmd run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 4. Pre-Configured Demonstration Accounts

| Role | Email | Password | Organization |
|---|---|---|---|
| **Administrator** | `admin@mediguide.org` | `AdminPassword123!` | Platform Operations |
| **Facility Representative** | `rep.rubyhall@mediguide.org` | `RepPassword123!` | Ruby Hall Clinic (Pune) |
| **Facility Representative** | `rep.jupiter@mediguide.org` | `RepPassword123!` | Jupiter Hospital (Pune) |
| **Registered Patient** | `user.rahul@example.com` | `UserPassword123!` | Public User |

*(Quick-autofill buttons are built directly into the `/login` page for instant evaluation!)*

---

## 5. Documentation Directory

- 📐 [Architecture Overview](docs/ARCHITECTURE.md)
- 🗄️ [Database Schema & ERD](docs/DATABASE_SCHEMA.md)
- 🔌 [REST API Documentation](docs/API_DOCUMENTATION.md)
- 🔐 [Role & Permission Matrix](docs/ROLE_PERMISSIONS.md)
- 🚀 [Setup & Deployment Guide](docs/SETUP_DEPLOYMENT.md)
- 🧪 [SRS Test Execution Guide](docs/TESTING_GUIDE.md)
