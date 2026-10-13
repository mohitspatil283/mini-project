# MediGuide REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public / Guest
- **Body**:
  ```json
  {
    "name": "Rahul Verma",
    "email": "user.rahul@example.com",
    "phone": "+91 98440 45678",
    "password": "UserPassword123!"
  }
  ```
- **Responses**:
  - `201 Created`: `{ "success": true, "token": "...", "user": {...} }`
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Duplicate email registration.

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public / Guest
- **Body**:
  ```json
  {
    "email": "admin@mediguide.org",
    "password": "AdminPassword123!"
  }
  ```
- **Responses**:
  - `200 OK`: `{ "success": true, "token": "...", "user": {...} }`
  - `401 Unauthorized`: Invalid credentials.

### 1.3 Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Authenticated

### 1.4 Update Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Access**: Authenticated

---

## 2. Facilities Search & Directory (`/api/facilities`)

### 2.1 Multi-Parametric Search
- **Endpoint**: `GET /api/facilities/search`
- **Access**: Public
- **Query Parameters**:
  - `city` (string): Filter facilities by city (default: `Pune`).
  - `locality` (string): Filter facilities by area/locality (e.g. `Kothrud`, `Wakad`, `Hinjawadi`, `Baner`, `Shivajinagar`).
  - `keyword` (string): Keyword matching facility name, address, or services.
  - `category` (string): `HOSPITAL`, `CLINIC`, `PHARMACY`, `DIAGNOSTIC_CENTRE`, `BLOOD_CENTRE`, `LABORATORY`.
  - `lat` (float): Latitude for distance calculation.
  - `lng` (float): Longitude for distance calculation.
  - `radius` (number): Radius limit in km (`1`, `5`, `10`, `15`, `25`, `50`).
  - `service` (string): Filter facilities offering this specific service.
  - `cost_available` (boolean): `true` to filter only facilities with pricing tariffs.
  - `sort` (string): `distance`, `name_asc`, `name_desc`, `services_count`.
- **Response**:
  ```json
  {
    "success": true,
    "total": 3,
    "filters": {...},
    "disclaimer": "Information shown on MediGuide is for navigation...",
    "data": [
      {
        "facility_id": 1,
        "facility_name": "Ruby Hall Clinic Sassoon Road",
        "facility_type": "HOSPITAL",
        "locality": "Camp",
        "city": "Pune",
        "state": "Maharashtra",
        "pincode": "411001",
        "data_origin": "DEMONSTRATION_SAMPLE",
        "distance_km": 2.3,
        "distance_label": "2.3 km away",
        "services": [...],
        "costs": [...]
      }
    ]
  }
  ```

### 2.2 Supported Cities & Localities Directory
- **Endpoint**: `GET /api/facilities/locations`
- **Access**: Public
- **Description**: Returns all supported Maharashtra cities and 31+ Pune localities with geographic coordinates for map centering and radius filtering.
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "defaultCity": "Pune",
      "state": "Maharashtra",
      "cities": [
        {
          "name": "Pune",
          "isDefault": true,
          "center": { "lat": 18.5204, "lng": 73.8567 },
          "localities": [
            { "name": "Shivajinagar", "lat": 18.5308, "lng": 73.8475 },
            { "name": "Kothrud", "lat": 18.5074, "lng": 73.8077 }
          ]
        }
      ]
    }
  }
  ```

### 2.3 Facility Profile Details
- **Endpoint**: `GET /api/facilities/:id`
- **Access**: Public (Attaches `is_saved` boolean if token present)

---

## 3. Healthcare Services Catalog (`/api/services`)

### 3.1 List Services
- **Endpoint**: `GET /api/services`
- **Access**: Public

### 3.2 Create Service
- **Endpoint**: `POST /api/services`
- **Access**: Admin only

---

## 4. Cost Transparency & Comparison (`/api/costs`)

### 4.1 Cost Comparison Matrix
- **Endpoint**: `GET /api/costs/compare?facility_ids=1,2,4`
- **Access**: Public
- **Response**: Side-by-side service pricing matrix including fixed tariffs, cost ranges, source, and verification status.

### 4.2 Submit Cost Record
- **Endpoint**: `POST /api/costs/submit`
- **Access**: Facility Representative or Admin
- **Validation**: `amount_min <= amount_max`.

---

## 5. Saved Facilities (`/api/saved-facilities`)

- `GET /api/saved-facilities`: List bookmarked facilities for authenticated user.
- `POST /api/saved-facilities/:facilityId`: Bookmark facility (prevents duplicates).
- `DELETE /api/saved-facilities/:facilityId`: Remove facility bookmark.

---

## 6. Community Reports (`/api/reports`)

- `POST /api/reports`: Submit inaccuracy report (`facility_id`, `category`, `description`).
- `GET /api/reports/my-reports`: View reports submitted by current user with status history.

---

## 7. Facility Representative Portal (`/api/rep`)

- `GET /api/rep/dashboard`: Representative assigned facility overview.
- `POST /api/rep/propose-update`: Propose modifications (enters revision workflow).
- `POST /api/rep/services`: Add service to assigned facility.
- `DELETE /api/rep/services/:serviceId`: Remove service.
- `GET /api/rep/revisions`: View submitted revision tickets.

---

## 8. Administrative Operations (`/api/admin`)

- `GET /api/admin/statistics`: Real database computed KPI statistics.
- `GET /api/admin/facilities`: Facility list with filters.
- `POST /api/admin/facilities`: Add new facility.
- `PUT /api/admin/facilities/:id/verify`: Approve or Reject facility (`TC-ADMIN-01`).
- `DELETE /api/admin/facilities/:id`: Archive or delete facility.
- `GET /api/admin/verification-queue`: List pending facilities & revisions.
- `PUT /api/admin/revisions/:id/review`: Approve or reject proposed revision.
- `GET /api/admin/costs`: List cost records.
- `PUT /api/admin/costs/:id/verify`: Verify procedure tariff.
- `GET /api/admin/reports`: List community reports.
- `PUT /api/admin/reports/:id`: Update report status with admin resolution notes.
- `GET /api/admin/users`: List users.
- `PUT /api/admin/users/:id/status`: Activate or suspend user.
- `PUT /api/admin/users/:id/assign-facility`: Designate user as Facility Representative.
- `GET /api/admin/audit-logs`: Searchable immutable compliance audit trail.
