# MediGuide Role & Permission Matrix

MediGuide implements backend-enforced Role-Based Access Control (RBAC) across four primary roles.

---

## 1. Role Capabilities Matrix

| Functional Feature | Guest | Registered User | Facility Representative | Administrator |
|---|:---:|:---:|:---:|:---:|
| Search Facilities & Services | ✅ | ✅ | ✅ | ✅ |
| Location GPS & Radius Filtering | ✅ | ✅ | ✅ | ✅ |
| View Public Facility Profiles | ✅ | ✅ | ✅ | ✅ |
| View Transparent Cost Ranges | ✅ | ✅ | ✅ | ✅ |
| Compare Facilities Side-by-Side | ✅ | ✅ | ✅ | ✅ |
| Bookmark / Save Facilities | ❌ | ✅ | ✅ | ✅ |
| Manage User Profile / Password | ❌ | ✅ | ✅ | ✅ |
| Submit Inaccuracy Reports | ❌ | ✅ | ✅ | ✅ |
| Track Submitted Reports & Status | ❌ | ✅ | ✅ | ✅ |
| View Assigned Facility Dashboard | ❌ | ❌ | ✅ (Assigned only) | ✅ (All) |
| Propose Facility Modifications | ❌ | ❌ | ✅ (Assigned only) | ✅ (Direct edit) |
| Submit Service Tariffs / Costs | ❌ | ❌ | ✅ (Assigned only) | ✅ (Direct publish) |
| Facility Moderation Queue | ❌ | ❌ | ❌ | ✅ |
| Approve / Reject Revisions | ❌ | ❌ | ❌ | ✅ |
| Verify Procedure Tariffs | ❌ | ❌ | ❌ | ✅ |
| Resolve Community Reports | ❌ | ❌ | ❌ | ✅ |
| Manage Users & Roles | ❌ | ❌ | ❌ | ✅ |
| Assign Facility Representatives | ❌ | ❌ | ❌ | ✅ |
| Manage Healthcare Catalog | ❌ | ❌ | ❌ | ✅ |
| Inspect Compliance Audit Logs | ❌ | ❌ | ❌ | ✅ |

---

## 2. Security & Object Isolation Rules

1. **Backend Authorization Verification**: Every protected API route enforces role validation on the server via `requireRole('ADMIN')` or `requireRole('FACILITY_REPRESENTATIVE')`. Non-permitted requests terminate with HTTP `403 Forbidden` (`TC-SEC-01`).
2. **Organization Isolation for Representatives**: A Facility Representative can strictly access and submit updates for their assigned facility (`req.user.assigned_facility_id`). Cross-organization modification attempts are rejected by the API layer.
3. **No Silent Live Overwrites**: Representative facility updates must enter a pending `FacilityRevision` queue requiring administrative approval before replacing live data.
