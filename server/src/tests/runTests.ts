import http from 'http';
import app from '../app';
import { prisma } from '../config/prisma';

let server: http.Server;
let baseUrl = '';

// Helper for HTTP requests
async function request(path: string, options: RequestInit = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log(' MediGuide SRS Test Suite Execution');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testCase: string, condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testCase}: ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testCase}: ${message}`);
      failed++;
    }
  }

  // Spin up ephemeral test server
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr: any = server.address();
      baseUrl = `http://localhost:${addr.port}`;
      resolve();
    });
  });

  const testEmail = `test.user.${Date.now()}@example.com`;
  let userToken = '';
  let adminToken = '';
  let savedFacilityId = 0;

  try {
    // ----------------------------------------------------
    // AUTHENTICATION TESTS
    // ----------------------------------------------------
    // TC-AUTH-01: Register valid user
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Candidate',
        email: testEmail,
        phone: '+91 99999 88888',
        password: 'ValidPassword123!',
      }),
    });
    assert(
      'TC-AUTH-01',
      regRes.status === 201 && regRes.data.success && !!regRes.data.token,
      'Registered valid user successfully with token'
    );
    userToken = regRes.data.token;

    // TC-AUTH-02: Duplicate registration
    const dupRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Duplicate Candidate',
        email: testEmail,
        password: 'AnotherPassword123!',
      }),
    });
    assert(
      'TC-AUTH-02',
      dupRes.status === 409 && !dupRes.data.success,
      'Duplicate registration rejected with 409 Conflict'
    );

    // TC-AUTH-03: Valid login
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'ValidPassword123!',
      }),
    });
    assert(
      'TC-AUTH-03',
      loginRes.status === 200 && loginRes.data.success && !!loginRes.data.token,
      'Valid login returned JWT token and user profile'
    );

    // Login as Admin for admin tests
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@mediguide.org',
        password: 'AdminPassword123!',
      }),
    });
    adminToken = adminLoginRes.data.token;

    // TC-AUTH-04: Invalid login
    const badLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!',
      }),
    });
    assert(
      'TC-AUTH-04',
      badLoginRes.status === 401 && !badLoginRes.data.success,
      'Invalid password rejected with 401 Unauthorized'
    );

    // ----------------------------------------------------
    // SEARCH TESTS
    // ----------------------------------------------------
    // TC-SEARCH-01: Search hospital
    const searchHospRes = await request('/api/facilities/search?category=HOSPITAL');
    const hasHospital =
      searchHospRes.status === 200 &&
      searchHospRes.data.data.some((f: any) => f.facility_type === 'HOSPITAL');
    assert(
      'TC-SEARCH-01',
      hasHospital,
      `Search returned ${searchHospRes.data.total} hospital facilities`
    );

    if (searchHospRes.data.data.length > 0) {
      savedFacilityId = searchHospRes.data.data[0].facility_id;
    }

    // TC-SEARCH-02: Search pharmacy
    const searchPharmRes = await request('/api/facilities/search?category=PHARMACY');
    const hasPharm =
      searchPharmRes.status === 200 &&
      searchPharmRes.data.data.every((f: any) => f.facility_type === 'PHARMACY');
    assert(
      'TC-SEARCH-02',
      hasPharm && searchPharmRes.data.total > 0,
      `Search returned ${searchPharmRes.data.total} pharmacy facilities`
    );

    // TC-SEARCH-03: No matching facility
    const noMatchRes = await request('/api/facilities/search?keyword=XYZNonExistentKeyword99999');
    assert(
      'TC-SEARCH-03',
      noMatchRes.status === 200 && noMatchRes.data.total === 0,
      'Proper empty state returned for non-matching search term'
    );

    // ----------------------------------------------------
    // LOCATION TESTS (Pune Primary Dataset)
    // ----------------------------------------------------
    // TC-LOC-01: Allow location (Haversine calculation with coordinates in Pune)
    const locRes = await request(
      '/api/facilities/search?lat=18.5204&lng=73.8567&radius=15&sort=distance'
    );
    const hasDistance =
      locRes.status === 200 &&
      locRes.data.data.length > 0 &&
      locRes.data.data[0].distance_km !== null &&
      locRes.data.data[0].distance_km <= 15;
    assert(
      'TC-LOC-01',
      hasDistance,
      `Location search computed distances via Haversine and filtered within 15 km (Closest: ${locRes.data.data[0]?.distance_label})`
    );

    // TC-LOC-02: Deny location (Manual location / keyword fallback for Pune)
    const manualLocRes = await request('/api/facilities/search?city=Pune');
    assert(
      'TC-LOC-02',
      manualLocRes.status === 200 && manualLocRes.data.total > 0,
      `Manual location fallback returned ${manualLocRes.data.total} facilities in Pune`
    );

    // ----------------------------------------------------
    // COST TRANSPARENCY & COMPARISON TESTS
    // ----------------------------------------------------
    // TC-COST-01: Compare valid costs across facilities
    const compareIds = searchHospRes.data.data.slice(0, 3).map((f: any) => f.facility_id).join(',');
    const compareRes = await request(`/api/costs/compare?facility_ids=${compareIds}`);
    const hasMatrix =
      compareRes.status === 200 &&
      compareRes.data.facilities &&
      compareRes.data.facilities.length >= 2 &&
      Array.isArray(compareRes.data.matrix);
    assert(
      'TC-COST-01',
      hasMatrix,
      `Cost comparison matrix returned side-by-side rates for ${compareRes.data.facilities?.length} facilities across services`
    );

    // TC-COST-02: Invalid cost range validation (amount_min > amount_max)
    const invalidCostRes = await request('/api/costs/submit', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        facility_id: savedFacilityId,
        service_id: 1,
        amount_min: 5000,
        amount_max: 2000, // Invalid: min > max
      }),
    });
    assert(
      'TC-COST-02',
      invalidCostRes.status === 400 && !invalidCostRes.data.success,
      'Validation blocked invalid cost where amount_min > amount_max'
    );

    // ----------------------------------------------------
    // SAVED FACILITIES TESTS
    // ----------------------------------------------------
    // TC-SAVE-01: Save facility
    if (savedFacilityId) {
      const saveRes = await request(`/api/saved-facilities/${savedFacilityId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      assert(
        'TC-SAVE-01',
        saveRes.status === 201 && saveRes.data.success,
        `Facility ID ${savedFacilityId} saved to registered user bookmarks`
      );
    }

    // ----------------------------------------------------
    // REPORT INCORRECT INFORMATION TESTS
    // ----------------------------------------------------
    // TC-REP-01: Submit report
    const reportRes = await request('/api/reports', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        facility_id: savedFacilityId,
        category: 'INCORRECT_HOURS',
        description: 'Test report: OPD consultation closes at 7 PM on Saturdays.',
      }),
    });
    assert(
      'TC-REP-01',
      reportRes.status === 201 && reportRes.data.success,
      'Report submitted and recorded with status OPEN'
    );

    // ----------------------------------------------------
    // ADMIN ACTIONS TESTS
    // ----------------------------------------------------
    // TC-ADMIN-01: Verify facility
    // Create a pending facility first to verify
    const pendingFac = await prisma.facility.create({
      data: {
        facility_name: 'Test Diagnostic Lab Under Review',
        facility_type: 'LABORATORY',
        address: '10 J.M. Road, Shivajinagar',
        locality: 'Shivajinagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
        latitude: 18.5308,
        longitude: 73.8475,
        phone: '+91 20 2553 0000',
        operating_hours: '08:00 AM - 06:00 PM',
        status: 'PENDING',
      },
    });

    const verifyRes = await request(`/api/admin/facilities/${pendingFac.facility_id}/verify`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ action: 'APPROVE' }),
    });
    assert(
      'TC-ADMIN-01',
      verifyRes.status === 200 && verifyRes.data.data.status === 'VERIFIED',
      'Admin verified pending facility and updated status to VERIFIED'
    );

    // Clean up test facility
    await prisma.facility.delete({ where: { facility_id: pendingFac.facility_id } });

    // ----------------------------------------------------
    // SECURITY TESTS
    // ----------------------------------------------------
    // TC-SEC-01: Normal user attempts to access admin endpoint
    const secRes = await request('/api/admin/statistics', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      'TC-SEC-01',
      secRes.status === 403 && !secRes.data.success,
      'Unauthorized access blocked: Non-admin user denied access with 403 Forbidden'
    );
  } catch (err: any) {
    console.error('Test suite error:', err);
    failed++;
  } finally {
    // Shutdown server
    server.close();
    await prisma.$disconnect();

    console.log('\n======================================================');
    console.log(` Test Summary: ${passed} Passed | ${failed} Failed`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runAllTests();
