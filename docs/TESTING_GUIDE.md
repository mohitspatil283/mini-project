# MediGuide SRS Test Execution Guide

MediGuide includes an automated test runner validating all test cases specified in **SRS Section 41**.

---

## 1. Automated Test Runner

To execute the entire automated suite against the live database:
```bash
cd server
npm.cmd run test
```

### Test Execution Output Sample:
```
======================================================
 MediGuide SRS Test Suite Execution
======================================================
✅ [PASS] TC-AUTH-01: Registered valid user successfully with token
✅ [PASS] TC-AUTH-02: Duplicate registration rejected with 409 Conflict
✅ [PASS] TC-AUTH-03: Valid login returned JWT token and user profile
✅ [PASS] TC-AUTH-04: Invalid password rejected with 401 Unauthorized
✅ [PASS] TC-SEARCH-01: Search returned 3 hospital facilities
✅ [PASS] TC-SEARCH-02: Search returned 1 pharmacy facilities
✅ [PASS] TC-SEARCH-03: Proper empty state returned for non-matching search term
✅ [PASS] TC-LOC-01: Location search computed distances via Haversine and filtered within 10 km
✅ [PASS] TC-LOC-02: Manual location fallback returned 8 facilities in city
✅ [PASS] TC-COST-01: Cost comparison matrix returned side-by-side rates for 3 facilities across services
✅ [PASS] TC-COST-02: Validation blocked invalid cost where amount_min > amount_max
✅ [PASS] TC-SAVE-01: Facility ID 1 saved to registered user bookmarks
✅ [PASS] TC-REP-01: Report submitted and recorded with status OPEN
✅ [PASS] TC-ADMIN-01: Admin verified pending facility and updated status to VERIFIED
✅ [PASS] TC-SEC-01: Unauthorized access blocked: Non-admin user denied access with 403 Forbidden
======================================================
 Test Summary: 15 Passed | 0 Failed
======================================================
```

---

## 2. Test Cases Specification & Verification Protocol

### Authentication (TC-AUTH)
- **TC-AUTH-01 (Register valid user)**: `POST /api/auth/register` with unique email. Expected: `201 Created` with valid JWT token.
- **TC-AUTH-02 (Duplicate registration)**: `POST /api/auth/register` with existing email. Expected: `409 Conflict` and error response.
- **TC-AUTH-03 (Valid login)**: `POST /api/auth/login` with correct password. Expected: `200 OK` with user profile and token.
- **TC-AUTH-04 (Invalid login)**: `POST /api/auth/login` with incorrect password. Expected: `401 Unauthorized`.

### Facility Search (TC-SEARCH)
- **TC-SEARCH-01 (Search hospital)**: `GET /api/facilities/search?category=HOSPITAL`. Expected: Facilities returned matching `facility_type === 'HOSPITAL'`.
- **TC-SEARCH-02 (Search pharmacy)**: `GET /api/facilities/search?category=PHARMACY`. Expected: Facilities returned matching `facility_type === 'PHARMACY'`.
- **TC-SEARCH-03 (No matching facility)**: `GET /api/facilities/search?keyword=XYZNonExistentKeyword99999`. Expected: `total === 0` and user-friendly empty state.

### Geolocation & Haversine Distance (TC-LOC)
- **TC-LOC-01 (Allow location)**: Coordinates `lat=28.6139&lng=77.2090` provided. Expected: Each facility displays computed distance (e.g. *"2.1 km away"*) and filters within radius.
- **TC-LOC-02 (Deny location)**: Geolocation denied by user. Expected: Graceful fallback alert *"Location access was not granted. Enter your location manually."* Search continues smoothly using city name or manual keywords.

### Cost Transparency (TC-COST)
- **TC-COST-01 (Compare valid costs)**: `GET /api/costs/compare?facility_ids=1,2,4`. Expected: Generates side-by-side comparison matrix with procedure rates, fixed prices, ranges, units, and sources.
- **TC-COST-02 (Invalid cost range)**: `POST /api/costs/submit` with `amount_min = 5000` and `amount_max = 2000`. Expected: `400 Bad Request` with message *"Minimum cost cannot be greater than maximum cost."* Missing cost displays as *"Cost information unavailable"*, never ₹0.

### User Bookmarks (TC-SAVE)
- **TC-SAVE-01 (Save facility)**: Authenticated user saves facility. Duplicate save returns `409 Conflict`. Facility appears under `/user/saved`.

### Community Inaccuracy Reporting (TC-REP)
- **TC-REP-01 (Submit report)**: Authenticated user flags facility with category and description. Expected: Report created in database with status `OPEN` and audit event logged.

### Administrative Verification (TC-ADMIN)
- **TC-ADMIN-01 (Verify facility)**: Administrator approves pending facility. Status updates to `VERIFIED`, `verified_at` and `verified_by` are recorded, and audit event logged.

### Security & RBAC (TC-SEC)
- **TC-SEC-01 (User attempts admin access)**: Authenticated normal patient attempts to access `/api/admin/statistics`. Expected: `403 Forbidden`.
