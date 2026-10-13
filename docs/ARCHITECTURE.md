# MediGuide Architecture Overview

## 1. System Overview
**MediGuide** is an Integrated Healthcare Navigation and Cost Transparency Platform designed to provide patients, facility representatives, and healthcare administrators with reliable discovery of facilities and transparent approximate pricing.

MediGuide is strictly an information and navigation service. It does **not** diagnose medical conditions, prescribe medicines, generate treatment plans, process hospital billing, or handle emergency ambulance dispatch.

---

## 2. Multi-Tier Architecture

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  - React 18 + TypeScript + Vite                                         |
|  - Tailwind CSS + Glassmorphism & Healthcare Design System               |
|  - Leaflet / OpenStreetMap (GPS Radius Visualizer & Custom Map Pins)    |
|  - Contexts: AuthContext (RBAC), CompareContext, ToastContext           |
+-------------------------------------------------------------------------+
                                    |
                                    | REST APIs (JSON / Bearer JWT)
                                    v
+-------------------------------------------------------------------------+
|                              SERVER TIER                                |
|  - Node.js & Express.js with TypeScript                                 |
|  - Haversine Mathematical Spherical Distance Engine                     |
|  - JWT Authentication & RBAC Authorization Middleware                   |
|  - Revision Diff & Approval Workflow Engine                             |
|  - Immutable Audit Event Logging System                                 |
+-------------------------------------------------------------------------+
                                    |
                                    | Prisma ORM 5.22
                                    v
+-------------------------------------------------------------------------+
|                             DATABASE TIER                               |
|  - Relational Models (User, Role, Facility, Service, FacilityService,   |
|    CostRecord, SavedFacility, Report, FacilityRevision, AuditEvent)     |
|  - SQLite (Development) / PostgreSQL (Production)                       |
+-------------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### 3.1 Geolocation & Haversine Distance Engine
- Formula:
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  where $R = 6,371\text{ km}$.
- Graceful degradation: If browser location permission is denied by the user, the platform gracefully alerts: *"Location access was not granted. Enter your location manually."* without interrupting search capability.

### 3.2 Pricing Transparency Engine
- Cost records support fixed tariffs (e.g. ₹500 General Consultation) and dynamic ranges (e.g. ₹6,500 – ₹9,500 MRI).
- Integrity constraint: `amount_min <= amount_max`.
- Transparent handling of missing tariffs: Displays *"Cost information unavailable"*, never deceptively showing ₹0.

### 3.3 Side-by-Side Facility Cost Comparison Matrix
- Compares up to 4 user-selected healthcare providers simultaneously.
- Standardizes procedure definitions, unit bases (per consultation, per scan, per profile), data sources, and verification status.

### 3.4 Revision Moderation Pipeline
- Representative updates to contact numbers, operating hours, and physical addresses do not directly replace live records.
- Proposed modifications generate a `FacilityRevision` record displaying a side-by-side diff (Original vs Proposed) in the Administrator Verification Queue.
