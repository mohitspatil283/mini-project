import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MediGuide database with Pune Priority & Maharashtra Healthcare Data...');

  // 1. Roles
  const roles = [
    { id: 1, name: 'GUEST', description: 'Unauthenticated public visitor' },
    { id: 2, name: 'USER', description: 'Authenticated registered healthcare seeker' },
    { id: 3, name: 'FACILITY_REPRESENTATIVE', description: 'Authorized healthcare facility representative' },
    { id: 4, name: 'ADMIN', description: 'MediGuide platform administrator' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  // 2. Services
  const services = [
    {
      name: 'General Consultation',
      category: 'Consultations',
      description: 'Primary medical examination, clinical symptom evaluation, and preliminary diagnosis by an MBBS general physician.',
    },
    {
      name: 'Blood Test',
      category: 'Laboratory',
      description: 'Routine blood profiling including glucose, fasting sugar, lipid, and biochemical markers.',
    },
    {
      name: 'Complete Blood Count (CBC)',
      category: 'Laboratory',
      description: 'Detailed analysis of red blood cells, white blood cells, hemoglobin, and platelet counts.',
    },
    {
      name: 'X-Ray',
      category: 'Radiology',
      description: 'Diagnostic plain radiography imaging for bone fractures, chest conditions, and joint assessment.',
    },
    {
      name: 'Ultrasound',
      category: 'Radiology',
      description: 'Non-invasive high-frequency sound wave sonography for abdominal, pelvic, and vascular evaluation.',
    },
    {
      name: 'ECG',
      category: 'Cardiology',
      description: '12-lead electrocardiogram measuring cardiac electrical rhythm and conduction pathways.',
    },
    {
      name: 'MRI',
      category: 'Advanced Imaging',
      description: 'High-resolution magnetic resonance imaging for neuro, brain, spine, and soft-tissue diagnostics.',
    },
    {
      name: 'CT Scan',
      category: 'Advanced Imaging',
      description: 'Computed tomography cross-sectional imaging for trauma, chest, and cranial scans.',
    },
    {
      name: 'Echocardiogram (2D Echo)',
      category: 'Cardiology',
      description: 'Ultrasound imaging of cardiac chambers, valves, and ejection fraction assessment.',
    },
    {
      name: 'Dental Consultation',
      category: 'Dental',
      description: 'Oral hygiene assessment, cavity check, and preventive dental evaluation.',
    },
  ];

  const createdServices: Record<string, any> = {};
  for (const svc of services) {
    const s = await prisma.service.upsert({
      where: { name: svc.name },
      update: { category: svc.category, description: svc.description },
      create: svc,
    });
    createdServices[s.name] = s;
  }
  console.log('Services catalog ready.');

  // Clear existing facility dependent data for clean seed
  await prisma.costRecord.deleteMany();
  await prisma.facilityService.deleteMany();
  await prisma.savedFacility.deleteMany();
  await prisma.report.deleteMany();
  await prisma.facilityRevision.deleteMany();
  await prisma.facility.deleteMany();

  // 3. PUNE HEALTHCARE FACILITIES (Primary Focus - Detailed coverage across 31+ Localities)
  const puneFacilities = [
    // 1. Shivajinagar
    {
      facility_name: 'Sancheti Institute for Orthopaedics & Rehabilitation',
      facility_type: 'HOSPITAL',
      address: '16, Shivajinagar, Narveer Tanaji Wadi',
      locality: 'Shivajinagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      latitude: 18.5308,
      longitude: 73.8475,
      phone: '+91 20 2899 9999',
      email: 'contact@sanchetihospital.demo.org',
      operating_hours: '24 Hours Open (Emergency & Inpatient)',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-10T10:00:00Z'),
    },
    // 2. Kothrud
    {
      facility_name: 'Sahyadri Super Speciality Hospital Kothrud',
      facility_type: 'HOSPITAL',
      address: 'Plot No. 30 C, Erandwane, Karve Road, Near Kothrud',
      locality: 'Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      latitude: 18.5074,
      longitude: 73.8077,
      phone: '+91 20 6721 3000',
      email: 'kothrud@sahyadrihospitals.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-11T11:00:00Z'),
    },
    // 3. Deccan
    {
      facility_name: 'Deenanath Mangeshkar Hospital & Research Center',
      facility_type: 'HOSPITAL',
      address: 'Near Mhatre Bridge, Erandwane, Deccan Vicinity',
      locality: 'Deccan',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411004',
      latitude: 18.5042,
      longitude: 73.8346,
      phone: '+91 20 4015 1000',
      email: 'info@dmhospital.demo.org',
      operating_hours: '24 Hours Emergency & Care',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-08T09:30:00Z'),
    },
    // 4. Baner
    {
      facility_name: 'Jupiter Hospital Pune',
      facility_type: 'HOSPITAL',
      address: 'Near Prathamesh Park, Baner Balewadi Road',
      locality: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      latitude: 18.5590,
      longitude: 73.7868,
      phone: '+91 20 2799 2799',
      email: 'info.pune@jupiterhospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-15T14:00:00Z'),
    },
    // 5. Aundh
    {
      facility_name: 'Shashwat Hospital Aundh',
      facility_type: 'HOSPITAL',
      address: 'DP Road, Opp. DAV School, Ward No 8, Aundh',
      locality: 'Aundh',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411007',
      latitude: 18.5580,
      longitude: 73.8075,
      phone: '+91 20 6744 4444',
      email: 'care@shashwathospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-18T10:15:00Z'),
    },
    // 6. Wakad
    {
      facility_name: 'Lifepoint Multispecialty Hospital Wakad',
      facility_type: 'HOSPITAL',
      address: 'Survey No. 145/1, Mumbai-Bangalore Highway, Wakad',
      locality: 'Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      latitude: 18.5987,
      longitude: 73.7631,
      phone: '+91 20 6710 5555',
      email: 'wakad@lifepointhospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-20T12:00:00Z'),
    },
    // 7. Hinjawadi
    {
      facility_name: 'Ruby Hall Clinic Hinjawadi',
      facility_type: 'HOSPITAL',
      address: 'Rajiv Gandhi Infotech Park, Phase 1, Hinjawadi',
      locality: 'Hinjawadi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      latitude: 18.5913,
      longitude: 73.7389,
      phone: '+91 20 6645 5100',
      email: 'hinjawadi@rubyhall.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-14T09:00:00Z'),
    },
    // 8. Chinchwad & Pimpri-Chinchwad
    {
      facility_name: 'Aditya Birla Memorial Hospital',
      facility_type: 'HOSPITAL',
      address: 'Aditya Birla Hospital Marg, Thergaon, Chinchwad',
      locality: 'Chinchwad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411033',
      latitude: 18.6271,
      longitude: 73.7821,
      phone: '+91 20 3071 7777',
      email: 'info@adityabirla.demo.org',
      operating_hours: '24 Hours Multi-Speciality Care',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-05T08:00:00Z'),
    },
    // 9. Kharadi
    {
      facility_name: 'Manipal Hospital Kharadi',
      facility_type: 'HOSPITAL',
      address: 'Survey No. 22/2A, Mundhwa - Kharadi Road',
      locality: 'Kharadi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      latitude: 18.5516,
      longitude: 73.9348,
      phone: '+91 20 6745 0000',
      email: 'kharadi@manipalhospitals.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-16T15:30:00Z'),
    },
    // 10. Hadapsar
    {
      facility_name: 'Noble Hospital Hadapsar',
      facility_type: 'HOSPITAL',
      address: '153, Magarpatta City Road, Hadapsar',
      locality: 'Hadapsar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411013',
      latitude: 18.5089,
      longitude: 73.9260,
      phone: '+91 20 6628 5000',
      email: 'contact@noblehospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-19T11:45:00Z'),
    },
    // 11. Camp & Sassoon Road
    {
      facility_name: 'Ruby Hall Clinic Sassoon Road',
      facility_type: 'HOSPITAL',
      address: '40 Sassoon Road, Near Pune Railway Station, Camp',
      locality: 'Camp',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      latitude: 18.5298,
      longitude: 73.8762,
      phone: '+91 20 6645 5100',
      email: 'info@rubyhall.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-09T10:00:00Z'),
    },
    // 12. Camp
    {
      facility_name: 'Jehangir Hospital Pune',
      facility_type: 'HOSPITAL',
      address: '32, Sassoon Road, Camp',
      locality: 'Camp',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      latitude: 18.5305,
      longitude: 73.8778,
      phone: '+91 20 6681 1000',
      email: 'care@jehangirhospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-12T14:00:00Z'),
    },
    // 13. Swargate
    {
      facility_name: 'Poona Hospital & Research Centre',
      facility_type: 'HOSPITAL',
      address: '27, Sadashiv Peth, Near Alka Talkies, Swargate Area',
      locality: 'Swargate',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411030',
      latitude: 18.5126,
      longitude: 73.8479,
      phone: '+91 20 6609 6000',
      email: 'poonahospital@demo.org',
      operating_hours: '24 Hours Emergency Service',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-07T11:20:00Z'),
    },
    // 14. Katraj
    {
      facility_name: 'Bharati Hospital & Research Centre',
      facility_type: 'HOSPITAL',
      address: 'Pune-Satara Road, Katraj Dhankawadi',
      locality: 'Katraj',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411043',
      latitude: 18.4575,
      longitude: 73.8677,
      phone: '+91 20 2437 3226',
      email: 'bharatihosp@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-22T13:00:00Z'),
    },
    // 15. Koregaon Park
    {
      facility_name: 'Inlaks & Budhrani Hospital',
      facility_type: 'HOSPITAL',
      address: '7-9, Koregaon Park Road, Koregaon Park',
      locality: 'Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      latitude: 18.5362,
      longitude: 73.8940,
      phone: '+91 20 6609 9999',
      email: 'inlaks@demo.org',
      operating_hours: '24 Hours Emergency & Oncology',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-25T16:00:00Z'),
    },
    // 16. Viman Nagar (Clinic)
    {
      facility_name: 'Apollo Clinic Viman Nagar',
      facility_type: 'CLINIC',
      address: 'Sky Vista, Ground Floor, Near Dorabjee, Viman Nagar',
      locality: 'Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      latitude: 18.5679,
      longitude: 73.9143,
      phone: '+91 20 4141 1234',
      email: 'vimannagar.apollo@demo.org',
      operating_hours: 'Mon-Sat: 08:00 AM - 08:30 PM, Sun: 08:00 AM - 01:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-01T10:00:00Z'),
    },
    // 17. Kothrud (Diagnostic Centre)
    {
      facility_name: 'Golwilkar Metropolis Diagnostic Services Kothrud',
      facility_type: 'DIAGNOSTIC_CENTRE',
      address: 'Plot 18, Mayur Colony, Kothrud',
      locality: 'Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      latitude: 18.5034,
      longitude: 73.8115,
      phone: '+91 20 2544 1122',
      email: 'kothrud.golwilkar@metropolis.demo.org',
      operating_hours: 'Mon-Sat: 06:30 AM - 09:00 PM, Sun: 07:00 AM - 02:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-03T11:00:00Z'),
    },
    // 18. Baner (Diagnostic Centre)
    {
      facility_name: 'Aarthi Scans and Diagnostic Labs Baner',
      facility_type: 'DIAGNOSTIC_CENTRE',
      address: 'S.No. 84/1, High Street, Near Syngenta, Baner',
      locality: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      latitude: 18.5612,
      longitude: 73.7845,
      phone: '+91 20 2729 8899',
      email: 'baner.aarthi@demo.org',
      operating_hours: '24 Hours Diagnostic Imaging',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-05T14:30:00Z'),
    },
    // 19. Deccan (Pharmacy)
    {
      facility_name: 'Wellness Forever 24x7 Express Pharmacy Deccan',
      facility_type: 'PHARMACY',
      address: 'FC Road, Opposite Fergusson College Gate, Deccan',
      locality: 'Deccan',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411004',
      latitude: 18.5173,
      longitude: 73.8415,
      phone: '+91 20 2567 4321',
      email: 'deccan@wellnessforever.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-28T16:00:00Z'),
    },
    // 20. Wakad (Pharmacy)
    {
      facility_name: 'Apollo Pharmacy 24x7 Wakad',
      facility_type: 'PHARMACY',
      address: 'Dange Chowk Road, Near Kalewadi Phata, Wakad',
      locality: 'Wakad',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      latitude: 18.6012,
      longitude: 73.7712,
      phone: '+91 20 4912 8800',
      email: 'wakad.apollo@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-30T17:00:00Z'),
    },
    // 21. Swargate (Blood Centre)
    {
      facility_name: 'Janakalyan Raktakendra Central Blood Bank',
      facility_type: 'BLOOD_CENTRE',
      address: '1003, Shukrawar Peth, Swargate Area',
      locality: 'Swargate',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411002',
      latitude: 18.5018,
      longitude: 73.8586,
      phone: '+91 20 2444 9591',
      email: 'janakalyan.blood@demo.org',
      operating_hours: '24 Hours Emergency Blood Issue',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-10T08:30:00Z'),
    },
    // 22. Viman Nagar (Pathology Lab)
    {
      facility_name: 'Dr. Lal PathLabs Clinical Laboratory Viman Nagar',
      facility_type: 'LABORATORY',
      address: 'Shop 12, Clover Park, Viman Nagar',
      locality: 'Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      latitude: 18.5654,
      longitude: 73.9120,
      phone: '+91 20 3988 5050',
      email: 'vimannagar@lalpathlabs.demo.org',
      operating_hours: 'Mon-Sat: 07:00 AM - 08:00 PM, Sun: 07:00 AM - 01:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-08T12:00:00Z'),
    },
    // 23. Pimple Saudagar
    {
      facility_name: 'Lotus Multispeciality Hospital Pimple Saudagar',
      facility_type: 'HOSPITAL',
      address: 'Kunad Chowk, Pimple Saudagar',
      locality: 'Pimple Saudagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411027',
      latitude: 18.5987,
      longitude: 73.7925,
      phone: '+91 20 2720 9000',
      email: 'lotus@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-10T10:00:00Z'),
    },
    // 24. Pimple Gurav
    {
      facility_name: 'Gurav Multispeciality Health Clinic',
      facility_type: 'CLINIC',
      address: 'Kashid Nagar, Pimple Gurav',
      locality: 'Pimple Gurav',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411061',
      latitude: 18.5878,
      longitude: 73.8189,
      phone: '+91 20 2728 4400',
      email: 'guravclinic@demo.org',
      operating_hours: '08:00 AM - 09:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-11T14:00:00Z'),
    },
    // 25. Bhosari
    {
      facility_name: 'Dr. D. Y. Patil Multispeciality Hospital Bhosari',
      facility_type: 'HOSPITAL',
      address: 'MIDC Telco Road, Bhosari Industrial Area',
      locality: 'Bhosari',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411026',
      latitude: 18.6247,
      longitude: 73.8436,
      phone: '+91 20 2712 0000',
      email: 'bhosari@dypatil.demo.org',
      operating_hours: '24 Hours Trauma & Emergency',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-12T15:00:00Z'),
    },
    // 26. Nigdi
    {
      facility_name: 'Ojas Multispeciality Hospital Nigdi',
      facility_type: 'HOSPITAL',
      address: 'Sector 25, Pradhikaran, Nigdi',
      locality: 'Nigdi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411044',
      latitude: 18.6534,
      longitude: 73.7692,
      phone: '+91 20 2765 8000',
      email: 'ojashospital@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-14T09:30:00Z'),
    },
    // 27. Wagholi
    {
      facility_name: 'Lifeline Multispeciality Hospital Wagholi',
      facility_type: 'HOSPITAL',
      address: 'Pune-Nagar Road, Near Lexicon School, Wagholi',
      locality: 'Wagholi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '412207',
      latitude: 18.5808,
      longitude: 73.9806,
      phone: '+91 20 6712 1111',
      email: 'wagholi@lifeline.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-15T11:00:00Z'),
    },
    // 28. Sinhagad Road & Dhayari
    {
      facility_name: 'Pulse Multispeciality Hospital Sinhagad Road',
      facility_type: 'HOSPITAL',
      address: 'Anand Nagar, Sinhagad Road',
      locality: 'Sinhagad Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411051',
      latitude: 18.4867,
      longitude: 73.8245,
      phone: '+91 20 2435 6677',
      email: 'pulse@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-16T12:00:00Z'),
    },
    // 29. Narhe
    {
      facility_name: 'Smt. Kashibai Navale Medical College & General Hospital Narhe',
      facility_type: 'HOSPITAL',
      address: 'S.No. 49/1, Narhe, Off Mumbai-Bangalore Bypass',
      locality: 'Narhe',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411041',
      latitude: 18.4552,
      longitude: 73.8219,
      phone: '+91 20 2410 6000',
      email: 'sknmc@demo.org',
      operating_hours: '24 Hours Medical Teaching Hospital',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-18T10:00:00Z'),
    },
    // 30. Bavdhan
    {
      facility_name: 'Chellaram Hospital - Diabetes Care & Multispeciality Bavdhan',
      facility_type: 'HOSPITAL',
      address: 'Lalani Quantum, Pune-Bangalore Highway, Bavdhan Budruk',
      locality: 'Bavdhan',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411021',
      latitude: 18.5135,
      longitude: 73.7698,
      phone: '+91 20 6683 9777',
      email: 'chellaram@demo.org',
      operating_hours: '24 Hours Specialized Diabetes & Inpatient',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-20T14:00:00Z'),
    },
    // 31. Kondhwa
    {
      facility_name: 'KIMS Hospital & Research Centre Kondhwa',
      facility_type: 'HOSPITAL',
      address: 'Kondhwa Main Road, Near NIBM',
      locality: 'Kondhwa',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411048',
      latitude: 18.4735,
      longitude: 73.8920,
      phone: '+91 20 2696 2200',
      email: 'kondhwa@kims.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-22T16:00:00Z'),
    },
    // 32. Akurdi
    {
      facility_name: 'Star Multispeciality Care Akurdi',
      facility_type: 'CLINIC',
      address: 'Old Mumbai-Pune Highway, Akurdi Chowk',
      locality: 'Akurdi',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411035',
      latitude: 18.6492,
      longitude: 73.7707,
      phone: '+91 20 2764 1234',
      email: 'akurdi.star@demo.org',
      operating_hours: '08:00 AM - 08:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-24T10:00:00Z'),
    },
    // 33. Yerawada
    {
      facility_name: 'Sahyadri Super Speciality Hospital Yerawada',
      facility_type: 'HOSPITAL',
      address: 'Nagar Road, Near Shastri Nagar, Yerawada',
      locality: 'Yerawada',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411006',
      latitude: 18.5529,
      longitude: 73.8797,
      phone: '+91 20 6727 1111',
      email: 'yerawada@sahyadri.demo.org',
      operating_hours: '24 Hours Open',
      status: 'PENDING',
      data_origin: 'DEMONSTRATION_SAMPLE',
    },
  ];

  // 4. OTHER MAJOR MAHARASHTRA CITIES
  const otherCitiesFacilities = [
    // Mumbai
    {
      facility_name: 'Lilavati Hospital & Research Centre Bandra',
      facility_type: 'HOSPITAL',
      address: 'A-791, Bandra Reclamation, Bandra West',
      locality: 'Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      latitude: 19.0596,
      longitude: 72.8295,
      phone: '+91 22 2675 1000',
      email: 'info@lilavatihospital.demo.org',
      operating_hours: '24 Hours Emergency & Critical Care',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-10T10:00:00Z'),
    },
    {
      facility_name: 'P. D. Hinduja Hospital & Medical Research Centre',
      facility_type: 'HOSPITAL',
      address: 'Veer Savarkar Marg, Mahim',
      locality: 'Mahim',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400016',
      latitude: 19.0354,
      longitude: 72.8432,
      phone: '+91 22 2445 1515',
      email: 'contact@hindujahospital.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-12T14:00:00Z'),
    },
    // Navi Mumbai
    {
      facility_name: 'Apollo Hospitals Navi Mumbai',
      facility_type: 'HOSPITAL',
      address: 'Plot No. 13, Off Uran Road, Sector 23, CBD Belapur',
      locality: 'Belapur',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pincode: '400614',
      latitude: 19.0180,
      longitude: 73.0416,
      phone: '+91 22 3350 3350',
      email: 'navimumbai@apollohospitals.demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-15T09:00:00Z'),
    },
    // Thane
    {
      facility_name: 'Jupiter Hospital Thane',
      facility_type: 'HOSPITAL',
      address: 'Eastern Express Highway, Next to Viviana Mall, Majiwada',
      locality: 'Majiwada',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400601',
      latitude: 19.2120,
      longitude: 72.9860,
      phone: '+91 22 2172 5555',
      email: 'info@jupiterhospital.demo.org',
      operating_hours: '24 Hours Multi-Speciality',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-20T11:00:00Z'),
    },
    // Nagpur
    {
      facility_name: 'All India Institute of Medical Sciences (AIIMS) Nagpur',
      facility_type: 'HOSPITAL',
      address: 'Plot No. 2, Sector 20, MIHAN, Nagpur',
      locality: 'Wardha Road',
      city: 'Nagpur',
      state: 'Maharashtra',
      pincode: '441108',
      latitude: 21.0820,
      longitude: 79.0550,
      phone: '+91 712 282 1000',
      email: 'director@aiimsnagpur.demo.org',
      operating_hours: '24 Hours Tertiary Care & Research',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-22T10:00:00Z'),
    },
    // Nashik
    {
      facility_name: 'Wockhardt Hospital Nashik',
      facility_type: 'HOSPITAL',
      address: 'Wani House, Mumbai Naka, Nashik',
      locality: 'College Road',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422001',
      latitude: 20.0060,
      longitude: 73.7650,
      phone: '+91 253 662 4444',
      email: 'nashik@wockhardthospitals.demo.org',
      operating_hours: '24 Hours Emergency & Cardiology',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-24T12:00:00Z'),
    },
    // Chhatrapati Sambhajinagar (Aurangabad)
    {
      facility_name: 'MGM Medical College & Hospital Sambhajinagar',
      facility_type: 'HOSPITAL',
      address: 'N-6, CIDCO, Chhatrapati Sambhajinagar',
      locality: 'Cidco',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      pincode: '431003',
      latitude: 19.8820,
      longitude: 75.3670,
      phone: '+91 240 660 1100',
      email: 'mgmh@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-26T14:00:00Z'),
    },
    // Kolhapur
    {
      facility_name: 'Aster Aadhar Hospital Kolhapur',
      facility_type: 'HOSPITAL',
      address: 'Near Sasane Ground, R.S. No. 628, ' + 'B' + ' Ward, Kolhapur',
      locality: 'Tarabai Park',
      city: 'Kolhapur',
      state: 'Maharashtra',
      pincode: '416012',
      latitude: 16.7110,
      longitude: 74.2380,
      phone: '+91 231 662 2555',
      email: 'kolhapur@asteraadhar.demo.org',
      operating_hours: '24 Hours Multi-Speciality',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-28T09:00:00Z'),
    },
    // Solapur
    {
      facility_name: 'Ashwini Sahakari Rugnalaya Solapur',
      facility_type: 'HOSPITAL',
      address: 'North Sadar Bazar, Solapur',
      locality: 'Civil Lines',
      city: 'Solapur',
      state: 'Maharashtra',
      pincode: '413003',
      latitude: 17.6710,
      longitude: 75.9030,
      phone: '+91 217 231 9900',
      email: 'ashwinihosp@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-01-30T10:00:00Z'),
    },
    // Satara
    {
      facility_name: 'Satara Diagnostic & Medical Centre',
      facility_type: 'DIAGNOSTIC_CENTRE',
      address: 'Powai Naka, Near Civil Hospital Road, Satara',
      locality: 'Powai Naka',
      city: 'Satara',
      state: 'Maharashtra',
      pincode: '415001',
      latitude: 17.6890,
      longitude: 73.9980,
      phone: '+91 2162 234 567',
      email: 'sataradiagnostics@demo.org',
      operating_hours: 'Mon-Sun: 07:00 AM - 09:00 PM',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-01T11:00:00Z'),
    },
    // Sangli
    {
      facility_name: 'Bharati Vidyapeeth Hospital Sangli',
      facility_type: 'HOSPITAL',
      address: 'Sangli-Miraj Road, Wanlesswadi, Sangli',
      locality: 'Vishrambag',
      city: 'Sangli',
      state: 'Maharashtra',
      pincode: '416414',
      latitude: 16.8450,
      longitude: 74.6020,
      phone: '+91 233 260 1234',
      email: 'sanglibharati@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-02T13:00:00Z'),
    },
    // Ahilyanagar (Ahmednagar)
    {
      facility_name: 'Anandrishi Hospital & Medical Research Centre Ahilyanagar',
      facility_type: 'HOSPITAL',
      address: 'Anandrishi Marg, Savedi, Ahilyanagar',
      locality: 'Savedi',
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      pincode: '414003',
      latitude: 19.1230,
      longitude: 74.7340,
      phone: '+91 241 242 4100',
      email: 'anandrishi@demo.org',
      operating_hours: '24 Hours Open',
      status: 'VERIFIED',
      data_origin: 'DEMONSTRATION_SAMPLE',
      verified_at: new Date('2026-02-03T15:00:00Z'),
    },
  ];

  const allFacilitiesToInsert = [...puneFacilities, ...otherCitiesFacilities];
  const insertedFacilities: any[] = [];

  for (const fac of allFacilitiesToInsert) {
    const f = await prisma.facility.create({
      data: fac,
    });
    insertedFacilities.push(f);
  }
  console.log(`Inserted ${insertedFacilities.length} facilities across Maharashtra with Pune priority.`);

  // 5. MAP SERVICES & REASONABLE TARIFFS FOR DEMONSTRATION
  // Standard Procedure Tariff Matrix in Maharashtra (INR ₹)
  const tariffProfiles: Record<string, { min: number; max: number; unit: string }> = {
    'General Consultation': { min: 400, max: 800, unit: 'per consultation' },
    'Blood Test': { min: 300, max: 700, unit: 'per profile' },
    'Complete Blood Count (CBC)': { min: 250, max: 450, unit: 'per test' },
    'X-Ray': { min: 500, max: 1000, unit: 'per view' },
    'Ultrasound': { min: 1400, max: 2400, unit: 'per scan' },
    'ECG': { min: 350, max: 550, unit: 'per test' },
    'MRI': { min: 6500, max: 10500, unit: 'per scan' },
    'CT Scan': { min: 4000, max: 7500, unit: 'per scan' },
    'Echocardiogram (2D Echo)': { min: 2000, max: 3200, unit: 'per evaluation' },
    'Dental Consultation': { min: 300, max: 500, unit: 'per visit' },
  };

  for (const fac of insertedFacilities) {
    let serviceNames: string[] = [];

    if (fac.facility_type === 'HOSPITAL') {
      serviceNames = [
        'General Consultation',
        'Blood Test',
        'Complete Blood Count (CBC)',
        'X-Ray',
        'Ultrasound',
        'ECG',
        'MRI',
        'CT Scan',
        'Echocardiogram (2D Echo)',
      ];
    } else if (fac.facility_type === 'CLINIC') {
      serviceNames = [
        'General Consultation',
        'Blood Test',
        'Complete Blood Count (CBC)',
        'ECG',
        'Dental Consultation',
      ];
    } else if (fac.facility_type === 'DIAGNOSTIC_CENTRE') {
      serviceNames = [
        'Blood Test',
        'Complete Blood Count (CBC)',
        'X-Ray',
        'Ultrasound',
        'MRI',
        'CT Scan',
        'ECG',
      ];
    } else if (fac.facility_type === 'LABORATORY') {
      serviceNames = ['Blood Test', 'Complete Blood Count (CBC)'];
    }

    for (const sName of serviceNames) {
      const svc = createdServices[sName];
      if (!svc) continue;

      await prisma.facilityService.create({
        data: {
          facility_id: fac.facility_id,
          service_id: svc.service_id,
          is_available: true,
        },
      });

      const profile = tariffProfiles[sName];
      if (profile && fac.status === 'VERIFIED') {
        // Apply minor variance based on facility type for realistic comparison
        let multiplier = 1.0;
        if (fac.facility_name.includes('Jupiter') || fac.facility_name.includes('Apollo') || fac.facility_name.includes('Manipal')) {
          multiplier = 1.25;
        } else if (fac.facility_type === 'CLINIC') {
          multiplier = 0.85;
        }

        const minAmt = Math.round((profile.min * multiplier) / 50) * 50;
        const maxAmt = Math.round((profile.max * multiplier) / 50) * 50;

        await prisma.costRecord.create({
          data: {
            facility_id: fac.facility_id,
            service_id: svc.service_id,
            amount_min: minAmt,
            amount_max: maxAmt,
            currency: 'INR',
            unit_basis: profile.unit,
            source: `${fac.facility_name} Standard Tariff Schedule (Demonstration Sample)`,
            verification_status: 'VERIFIED',
            verified_at: new Date('2026-02-01T10:00:00Z'),
            collected_date: new Date('2026-01-20'),
          },
        });
      }
    }
  }
  console.log('Mapped services and realistic tariffs to facilities.');

  // 6. USERS
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('AdminPassword123!', salt);
  const repPassword = await bcrypt.hash('RepPassword123!', salt);
  const userPassword = await bcrypt.hash('UserPassword123!', salt);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mediguide.org' },
    update: {},
    create: {
      name: 'Dr. Ananya Sharma',
      email: 'admin@mediguide.org',
      phone: '+91 98110 12345',
      password_hash: adminPassword,
      role_id: 4, // ADMIN
      status: 'ACTIVE',
    },
  });

  // Pune Ruby Hall Representative
  const rubyHall = insertedFacilities.find((f) => f.facility_name.includes('Ruby Hall Clinic Sassoon'));
  const jupiterBaner = insertedFacilities.find((f) => f.facility_name.includes('Jupiter Hospital Pune'));

  const repPuneRuby = await prisma.user.upsert({
    where: { email: 'rep.rubyhall@mediguide.org' },
    update: { assigned_facility_id: rubyHall ? rubyHall.facility_id : null },
    create: {
      name: 'Rajesh Kulkarni',
      email: 'rep.rubyhall@mediguide.org',
      phone: '+91 98230 45678',
      password_hash: repPassword,
      role_id: 3, // FACILITY_REPRESENTATIVE
      status: 'ACTIVE',
      assigned_facility_id: rubyHall ? rubyHall.facility_id : null,
    },
  });

  // Pune Jupiter Baner Representative
  const repJupiter = await prisma.user.upsert({
    where: { email: 'rep.jupiter@mediguide.org' },
    update: { assigned_facility_id: jupiterBaner ? jupiterBaner.facility_id : null },
    create: {
      name: 'Sneha Deshmukh',
      email: 'rep.jupiter@mediguide.org',
      phone: '+91 98220 56789',
      password_hash: repPassword,
      role_id: 3, // FACILITY_REPRESENTATIVE
      status: 'ACTIVE',
      assigned_facility_id: jupiterBaner ? jupiterBaner.facility_id : null,
    },
  });

  // Registered Patient 1
  const rahul = await prisma.user.upsert({
    where: { email: 'user.rahul@example.com' },
    update: {},
    create: {
      name: 'Rahul Joshi',
      email: 'user.rahul@example.com',
      phone: '+91 98900 12345',
      password_hash: userPassword,
      role_id: 2, // USER
      status: 'ACTIVE',
    },
  });

  // Registered Patient 2
  const priya = await prisma.user.upsert({
    where: { email: 'user.priya@example.com' },
    update: {},
    create: {
      name: 'Priya Kulkarni',
      email: 'user.priya@example.com',
      phone: '+91 98901 23456',
      password_hash: userPassword,
      role_id: 2, // USER
      status: 'ACTIVE',
    },
  });

  // 7. Saved Facilities for Rahul
  if (rubyHall && jupiterBaner) {
    await prisma.savedFacility.createMany({
      data: [
        { user_id: rahul.user_id, facility_id: rubyHall.facility_id },
        { user_id: rahul.user_id, facility_id: jupiterBaner.facility_id },
      ],
    });
  }

  // 8. Sample Reports
  if (rubyHall) {
    await prisma.report.create({
      data: {
        facility_id: rubyHall.facility_id,
        user_id: rahul.user_id,
        category: 'INCORRECT_HOURS',
        description: 'OPD registration token window opens at 8:30 AM rather than 8:00 AM on weekdays.',
        status: 'UNDER_REVIEW',
        admin_notes: 'Checking updated timing with Ruby Hall administrative desk.',
      },
    });
  }

  // 9. Sample Revision from Rep Rajesh
  if (rubyHall) {
    await prisma.facilityRevision.create({
      data: {
        facility_id: rubyHall.facility_id,
        submitted_by: repPuneRuby.user_id,
        status: 'PENDING',
        existing_data: JSON.stringify({
          phone: '+91 20 6645 5100',
          operating_hours: '24 Hours Open',
        }),
        proposed_data: JSON.stringify({
          phone: '+91 20 6645 5100 / 020 6645 5101',
          operating_hours: '24/7 Multi-Speciality Emergency, Trauma & ICU Care',
        }),
      },
    });
  }

  // 10. Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        user_id: adminUser.user_id,
        action: 'FACILITY_VERIFY',
        entity: 'Facility',
        entity_id: String(rubyHall?.facility_id || 1),
        metadata: JSON.stringify({ city: 'Pune', status: 'VERIFIED' }),
      },
      {
        user_id: adminUser.user_id,
        action: 'REP_ASSIGNED',
        entity: 'User',
        entity_id: String(repPuneRuby.user_id),
        metadata: JSON.stringify({ facility: 'Ruby Hall Clinic Sassoon Road', city: 'Pune' }),
      },
      {
        user_id: rahul.user_id,
        action: 'REPORT_SUBMIT',
        entity: 'Report',
        entity_id: '1',
        metadata: JSON.stringify({ category: 'INCORRECT_HOURS', locality: 'Camp', city: 'Pune' }),
      },
    ],
  });

  console.log('Seeding completed successfully! Pune is set as primary focus.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
