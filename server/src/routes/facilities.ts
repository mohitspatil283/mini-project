import { Router, Response } from 'express';
import { prisma } from '../config/prisma';
import { calculateHaversineDistance } from '../utils/haversine';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// TC-SEARCH-01, TC-SEARCH-02, TC-SEARCH-03, TC-LOC-01, TC-LOC-02
// Comprehensive search & nearby discovery
router.get('/search', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      keyword,
      category,
      lat,
      lng,
      radius,
      service,
      cost_available,
      verification_status,
      sort,
      city,
      locality,
    } = req.query;

    const userLat = lat ? parseFloat(lat as string) : null;
    const userLng = lng ? parseFloat(lng as string) : null;
    const searchRadius = radius ? parseFloat(radius as string) : 25; // default 25 km

    // Build base query
    const where: any = {};

    // For public search, default to VERIFIED facilities unless specifically filtering
    if (verification_status) {
      where.status = String(verification_status).toUpperCase();
    } else {
      where.status = 'VERIFIED';
    }

    if (category && category !== 'ALL') {
      where.facility_type = String(category).toUpperCase();
    }

    if (city && city !== 'ALL') {
      where.city = { contains: String(city).trim() };
    }

    if (locality && locality !== 'ALL') {
      where.locality = { contains: String(locality).trim() };
    }

    // Keyword filter (searches facility name, address, city, state)
    if (keyword && String(keyword).trim().length > 0) {
      const kw = String(keyword).trim();
      where.OR = [
        { facility_name: { contains: kw } },
        { address: { contains: kw } },
        { city: { contains: kw } },
        { state: { contains: kw } },
        {
          facility_services: {
            some: {
              service: {
                name: { contains: kw },
              },
            },
          },
        },
      ];
    }

    // Specific service filter
    if (service && service !== 'ALL') {
      where.facility_services = {
        some: {
          service: {
            name: { contains: String(service).trim() },
          },
        },
      };
    }

    // Cost availability filter
    if (cost_available === 'true') {
      where.cost_records = {
        some: {
          verification_status: 'VERIFIED',
        },
      };
    }

    // Fetch matching facilities with services and cost records
    const facilities = await prisma.facility.findMany({
      where,
      include: {
        facility_services: {
          include: {
            service: true,
          },
        },
        cost_records: {
          include: {
            service: true,
          },
        },
      },
    });

    // Check saved status for authenticated user
    let savedFacilityIds: Set<number> = new Set();
    if (req.user) {
      const saved = await prisma.savedFacility.findMany({
        where: { user_id: req.user.user_id },
        select: { facility_id: true },
      });
      savedFacilityIds = new Set(saved.map((s) => s.facility_id));
    }

    // Calculate distance and format results
    let results = facilities.map((fac) => {
      let distance_km: number | null = null;
      if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
        distance_km = calculateHaversineDistance(
          userLat,
          userLng,
          fac.latitude,
          fac.longitude
        );
      }

      const services = fac.facility_services.map((fs) => ({
        service_id: fs.service.service_id,
        name: fs.service.name,
        category: fs.service.category,
      }));

      const costSummary = fac.cost_records.map((c) => ({
        cost_id: c.cost_id,
        service_name: c.service.name,
        amount_min: c.amount_min,
        amount_max: c.amount_max,
        currency: c.currency,
        unit_basis: c.unit_basis,
        verification_status: c.verification_status,
      }));

      return {
        facility_id: fac.facility_id,
        facility_name: fac.facility_name,
        facility_type: fac.facility_type,
        address: fac.address,
        locality: fac.locality,
        city: fac.city,
        state: fac.state,
        pincode: fac.pincode,
        latitude: fac.latitude,
        longitude: fac.longitude,
        phone: fac.phone,
        email: fac.email,
        operating_hours: fac.operating_hours,
        status: fac.status,
        data_origin: fac.data_origin,
        verified_at: fac.verified_at,
        created_at: fac.created_at,
        distance_km,
        distance_label: distance_km !== null ? `${distance_km} km away` : null,
        is_saved: savedFacilityIds.has(fac.facility_id),
        services,
        cost_count: fac.cost_records.length,
        has_cost_info: fac.cost_records.length > 0,
        costs: costSummary,
      };
    });

    // Apply radius filter if coordinates were provided
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      results = results.filter(
        (fac) => fac.distance_km !== null && fac.distance_km <= searchRadius
      );
    }

    // Sorting
    if (sort === 'distance' && userLat !== null && userLng !== null) {
      results.sort((a, b) => (a.distance_km ?? 9999) - (b.distance_km ?? 9999));
    } else if (sort === 'name_asc') {
      results.sort((a, b) => a.facility_name.localeCompare(b.facility_name));
    } else if (sort === 'name_desc') {
      results.sort((a, b) => b.facility_name.localeCompare(a.facility_name));
    } else if (sort === 'services_count') {
      results.sort((a, b) => b.services.length - a.services.length);
    } else if (userLat !== null && userLng !== null) {
      // Default to distance if coordinates present
      results.sort((a, b) => (a.distance_km ?? 9999) - (b.distance_km ?? 9999));
    }

    res.json({
      success: true,
      total: results.length,
      filters: {
        keyword: keyword || null,
        category: category || 'ALL',
        user_coordinates: userLat && userLng ? { lat: userLat, lng: userLng } : null,
        radius_km: searchRadius,
      },
      disclaimer:
        'Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility.',
      data: results,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search operation failed. Please try again.',
    });
  }
});

// GET /api/facilities/summary-stats: Real-time public database aggregations
router.get('/summary-stats', async (req, res: Response) => {
  try {
    const [
      verifiedFacilities,
      totalFacilities,
      verifiedCosts,
      totalServices,
      puneFacilities,
    ] = await Promise.all([
      prisma.facility.count({ where: { status: 'VERIFIED' } }),
      prisma.facility.count(),
      prisma.costRecord.count({ where: { verification_status: 'VERIFIED' } }),
      prisma.service.count(),
      prisma.facility.count({ where: { city: 'Pune' } }),
    ]);

    res.json({
      success: true,
      data: {
        verifiedFacilities,
        totalFacilities,
        verifiedCosts,
        totalServices,
        puneFacilities,
        puneLocalities: 31,
        supportedCities: 12,
        facilityCategories: 7,
      },
    });
  } catch (error: any) {
    console.error('Summary stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve public summary statistics.' });
  }
});

// GET /api/facilities/locations: Returns supported Maharashtra & Indian cities and their localities with coordinates
router.get('/locations', async (req, res: Response) => {
  const locations = {
    defaultCity: 'Pune',
    state: 'Maharashtra',
    cities: [
      {
        name: 'Pune',
        isDefault: true,
        center: { lat: 18.5204, lng: 73.8567 },
        localities: [
          { name: 'Shivajinagar', lat: 18.5308, lng: 73.8475 },
          { name: 'Kothrud', lat: 18.5074, lng: 73.8077 },
          { name: 'Deccan', lat: 18.5173, lng: 73.8415 },
          { name: 'Baner', lat: 18.5590, lng: 73.7868 },
          { name: 'Aundh', lat: 18.5580, lng: 73.8075 },
          { name: 'Wakad', lat: 18.5987, lng: 73.7631 },
          { name: 'Hinjawadi', lat: 18.5913, lng: 73.7389 },
          { name: 'Pimpri-Chinchwad', lat: 18.6298, lng: 73.7997 },
          { name: 'Hadapsar', lat: 18.5089, lng: 73.9260 },
          { name: 'Kharadi', lat: 18.5516, lng: 73.9348 },
          { name: 'Viman Nagar', lat: 18.5679, lng: 73.9143 },
          { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940 },
          { name: 'Yerawada', lat: 18.5529, lng: 73.8797 },
          { name: 'Swargate', lat: 18.5018, lng: 73.8586 },
          { name: 'Camp', lat: 18.5167, lng: 73.8792 },
          { name: 'Kondhwa', lat: 18.4735, lng: 73.8920 },
          { name: 'Pimple Saudagar', lat: 18.5987, lng: 73.7925 },
          { name: 'Pimple Gurav', lat: 18.5878, lng: 73.8189 },
          { name: 'Bhosari', lat: 18.6247, lng: 73.8436 },
          { name: 'Akurdi', lat: 18.6492, lng: 73.7707 },
          { name: 'Nigdi', lat: 18.6534, lng: 73.7692 },
          { name: 'Chinchwad', lat: 18.6271, lng: 73.7821 },
          { name: 'Dapodi', lat: 18.5815, lng: 73.8315 },
          { name: 'Vishrantwadi', lat: 18.5714, lng: 73.8789 },
          { name: 'Lohegaon', lat: 18.5898, lng: 73.9215 },
          { name: 'Wagholi', lat: 18.5808, lng: 73.9806 },
          { name: 'Sinhagad Road', lat: 18.4867, lng: 73.8245 },
          { name: 'Dhayari', lat: 18.4485, lng: 73.8097 },
          { name: 'Narhe', lat: 18.4552, lng: 73.8219 },
          { name: 'Bavdhan', lat: 18.5135, lng: 73.7698 },
          { name: 'Katraj', lat: 18.4575, lng: 73.8677 },
        ],
      },
      {
        name: 'Mumbai',
        center: { lat: 19.0760, lng: 72.8777 },
        localities: [
          { name: 'Bandra', lat: 19.0596, lng: 72.8295 },
          { name: 'Parel', lat: 19.0096, lng: 72.8427 },
          { name: 'Mahim', lat: 19.0354, lng: 72.8432 },
          { name: 'Andheri', lat: 19.1136, lng: 72.8697 },
          { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
        ],
      },
      {
        name: 'Navi Mumbai',
        center: { lat: 19.0330, lng: 73.0297 },
        localities: [
          { name: 'Vashi', lat: 19.0771, lng: 72.9986 },
          { name: 'Belapur', lat: 19.0180, lng: 73.0416 },
          { name: 'Kharghar', lat: 19.0473, lng: 73.0699 },
          { name: 'Nerul', lat: 19.0330, lng: 73.0182 },
        ],
      },
      {
        name: 'Thane',
        center: { lat: 19.2183, lng: 72.9781 },
        localities: [
          { name: 'Majiwada', lat: 19.2120, lng: 72.9860 },
          { name: 'Ghodbunder Road', lat: 19.2680, lng: 72.9640 },
          { name: 'Naupada', lat: 19.1870, lng: 72.9720 },
        ],
      },
      {
        name: 'Nagpur',
        center: { lat: 21.1458, lng: 79.0882 },
        localities: [
          { name: 'Ramdaspeth', lat: 21.1340, lng: 79.0750 },
          { name: 'Dharampeth', lat: 21.1420, lng: 79.0610 },
          { name: 'Wardha Road', lat: 21.0820, lng: 79.0550 },
        ],
      },
      {
        name: 'Nashik',
        center: { lat: 19.9975, lng: 73.7898 },
        localities: [
          { name: 'College Road', lat: 20.0060, lng: 73.7650 },
          { name: 'Panchavati', lat: 20.0120, lng: 73.7990 },
          { name: 'Indira Nagar', lat: 19.9670, lng: 73.7820 },
        ],
      },
      {
        name: 'Chhatrapati Sambhajinagar',
        center: { lat: 19.8762, lng: 75.3433 },
        localities: [
          { name: 'Cidco', lat: 19.8820, lng: 75.3670 },
          { name: 'Samarthnagar', lat: 19.8870, lng: 75.3280 },
          { name: 'Station Road', lat: 19.8650, lng: 75.3240 },
        ],
      },
      {
        name: 'Kolhapur',
        center: { lat: 16.7050, lng: 74.2433 },
        localities: [
          { name: 'Tarabai Park', lat: 16.7110, lng: 74.2380 },
          { name: 'Rajarampuri', lat: 16.6960, lng: 74.2490 },
          { name: 'Shahupuri', lat: 16.7020, lng: 74.2410 },
        ],
      },
      {
        name: 'Solapur',
        center: { lat: 17.6599, lng: 75.9064 },
        localities: [
          { name: 'Hotgi Road', lat: 17.6430, lng: 75.9220 },
          { name: 'Jule Solapur', lat: 17.6320, lng: 75.9070 },
          { name: 'Civil Lines', lat: 17.6710, lng: 75.9030 },
        ],
      },
      {
        name: 'Satara',
        center: { lat: 17.6805, lng: 73.9934 },
        localities: [
          { name: 'Powai Naka', lat: 17.6890, lng: 73.9980 },
          { name: 'Sadar Bazar', lat: 17.6970, lng: 74.0080 },
        ],
      },
      {
        name: 'Sangli',
        center: { lat: 16.8524, lng: 74.5815 },
        localities: [
          { name: 'Vishrambag', lat: 16.8450, lng: 74.6020 },
          { name: 'Gaon Bhag', lat: 16.8590, lng: 74.5710 },
        ],
      },
      {
        name: 'Ahilyanagar',
        center: { lat: 19.0952, lng: 74.7496 },
        localities: [
          { name: 'Savedi', lat: 19.1230, lng: 74.7340 },
          { name: 'Station Road', lat: 19.0880, lng: 74.7520 },
          { name: 'Maliwada', lat: 19.0970, lng: 74.7430 },
        ],
      },
    ],
  };

  res.json({ success: true, data: locations });
});

// Get single facility details
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const facilityId = parseInt(req.params.id, 10);
    if (isNaN(facilityId)) {
      res.status(400).json({ success: false, error: 'Invalid facility ID.' });
      return;
    }

    const { lat, lng } = req.query;
    const userLat = lat ? parseFloat(lat as string) : null;
    const userLng = lng ? parseFloat(lng as string) : null;

    const facility = await prisma.facility.findUnique({
      where: { facility_id: facilityId },
      include: {
        facility_services: {
          include: {
            service: true,
          },
        },
        cost_records: {
          include: {
            service: true,
          },
          orderBy: {
            service: {
              name: 'asc',
            },
          },
        },
      },
    });

    if (!facility) {
      res.status(404).json({ success: false, error: 'Facility not found.' });
      return;
    }

    let is_saved = false;
    if (req.user) {
      const saved = await prisma.savedFacility.findUnique({
        where: {
          user_id_facility_id: {
            user_id: req.user.user_id,
            facility_id: facility.facility_id,
          },
        },
      });
      is_saved = !!saved;
    }

    let distance_km: number | null = null;
    if (userLat !== null && userLng !== null && !isNaN(userLat) && !isNaN(userLng)) {
      distance_km = calculateHaversineDistance(
        userLat,
        userLng,
        facility.latitude,
        facility.longitude
      );
    }

    res.json({
      success: true,
      data: {
        ...facility,
        distance_km,
        distance_label: distance_km !== null ? `${distance_km} km away` : null,
        is_saved,
        services: facility.facility_services.map((fs) => fs.service),
        cost_records: facility.cost_records.map((c) => ({
          cost_id: c.cost_id,
          service_id: c.service_id,
          service_name: c.service.name,
          service_category: c.service.category,
          amount_min: c.amount_min,
          amount_max: c.amount_max,
          currency: c.currency,
          unit_basis: c.unit_basis,
          source: c.source,
          verification_status: c.verification_status,
          verified_at: c.verified_at,
          collected_date: c.collected_date,
          updated_at: c.updated_at,
        })),
      },
      disclaimer:
        'Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility.',
    });
  } catch (error: any) {
    console.error('Facility details error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve facility details.' });
  }
});

export default router;
