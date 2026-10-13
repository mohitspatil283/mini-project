import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { FacilityCard } from '../components/FacilityCard';
import { api } from '../services/api';
import {
  Compass,
  Building2,
  Stethoscope,
  Pill,
  Microscope,
  Droplet,
  FlaskConical,
  Activity,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredFacilities, setFeaturedFacilities] = useState<any[]>([]);
  const [publicStats, setPublicStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const [facRes, statsRes] = await Promise.all([
          api.searchFacilities({ city: 'Pune', radius: 25, sort: 'services_count' }),
          api.getPublicStats().catch(() => null),
        ]);
        if (facRes.success && facRes.data) {
          setFeaturedFacilities(facRes.data.slice(0, 4));
        }
        if (statsRes?.success && statsRes.data) {
          setPublicStats(statsRes.data);
        }
      } catch (err) {
        console.error('Featured facilities load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = (params: any) => {
    const q = new URLSearchParams();
    if (params.keyword) q.append('keyword', params.keyword);
    if (params.category && params.category !== 'ALL') q.append('category', params.category);
    if (params.lat && params.lng) {
      q.append('lat', String(params.lat));
      q.append('lng', String(params.lng));
    }
    if (params.radius) q.append('radius', String(params.radius));
    if (params.service) q.append('service', params.service);
    if (params.cost_available) q.append('cost_available', 'true');
    if (params.city && params.city !== 'ALL') q.append('city', params.city);
    if (params.locality && params.locality !== 'ALL') q.append('locality', params.locality);
    navigate(`/search?${q.toString()}`);
  };

  const categories = [
    {
      type: 'HOSPITAL',
      title: 'Hospitals',
      desc: 'Multi-speciality & secondary inpatient medical centres',
      icon: <Building2 className="w-7 h-7 text-red-600" />,
      bg: 'bg-red-50 hover:border-red-300',
    },
    {
      type: 'CLINIC',
      title: 'Clinics & Polyclinics',
      desc: 'General consultations & outpatient primary care',
      icon: <Stethoscope className="w-7 h-7 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:border-emerald-300',
    },
    {
      type: 'PHARMACY',
      title: 'Pharmacies',
      desc: '24/7 licensed medical stores & prescription dispensaries',
      icon: <Pill className="w-7 h-7 text-sky-600" />,
      bg: 'bg-sky-50 hover:border-sky-300',
    },
    {
      type: 'DIAGNOSTIC_CENTRE',
      title: 'Diagnostic Centres',
      desc: 'MRI, CT Scans, Ultrasound, and medical radiology',
      icon: <Microscope className="w-7 h-7 text-purple-600" />,
      bg: 'bg-purple-50 hover:border-purple-300',
    },
    {
      type: 'BLOOD_CENTRE',
      title: 'Blood Centres',
      desc: 'Licensed blood banks, testing, and component supply',
      icon: <Droplet className="w-7 h-7 text-rose-600" />,
      bg: 'bg-rose-50 hover:border-rose-300',
    },
    {
      type: 'LABORATORY',
      title: 'Pathology Labs',
      desc: 'Diagnostic blood panels, CBC, lipid & biopsy testing',
      icon: <FlaskConical className="w-7 h-7 text-amber-600" />,
      bg: 'bg-amber-50 hover:border-amber-300',
    },
    {
      type: 'OTHER',
      title: 'Urgent Care & Others',
      desc: 'Day surgery centres, rehabilitation & emergency triage',
      icon: <Activity className="w-7 h-7 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:border-indigo-300',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 bg-gradient-to-b from-brand-50/60 via-slate-50 to-white overflow-hidden border-b border-slate-200/60">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-brand-200/30 to-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-200/80 shadow-2xs text-xs font-bold text-brand-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Integrated Healthcare Navigation & Cost Transparency</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Find Healthcare.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-600">
                Compare Costs.
              </span>{' '}
              Navigate with Confidence.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              MediGuide helps you locate nearby verified healthcare facilities, explore approximate service pricing, and access verified contact and location information in your city.
            </p>
          </div>

          {/* Main Search Component */}
          <div className="mt-10 max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Quick Metrics Ribbon (Clickable Real-Time KPIs) */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <Link
              to="/search?verification_status=VERIFIED"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-500 hover:shadow-card-hover transition-all group block cursor-pointer"
              title="Click to view all verified healthcare providers"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                {publicStats ? `${publicStats.verifiedFacilities}+` : '40+'}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Verified Facilities</p>
              <span className="text-[10px] text-brand-600 font-bold flex items-center justify-center gap-0.5 mt-1 group-hover:underline">
                <span>View all verified</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              to="/search?cost_available=true"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-emerald-500 hover:shadow-card-hover transition-all group block cursor-pointer"
              title="Click to filter facilities with verified pricing tariffs"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-brand-600 group-hover:text-emerald-700 transition-colors">
                {publicStats ? `₹ ${publicStats.verifiedCosts}+` : '₹ Transparent'}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Tariffs Published</p>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-0.5 mt-1 group-hover:underline">
                <span>Explore pricing</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              to="/search?city=Pune"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-500 hover:shadow-card-hover transition-all group block cursor-pointer"
              title="Click to search across Pune's 31+ localities"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                {publicStats ? `${publicStats.puneLocalities}+ Areas` : '31+ Areas'}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Pune Primary Focus</p>
              <span className="text-[10px] text-brand-600 font-bold flex items-center justify-center gap-0.5 mt-1 group-hover:underline">
                <span>Browse Pune</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <Link
              to="/search"
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-500 hover:shadow-card-hover transition-all group block cursor-pointer"
              title="Click to browse all healthcare categories"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-sky-600 group-hover:text-sky-700 transition-colors">
                {publicStats ? `${publicStats.facilityCategories} Types` : '7 Types'}
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Hospitals to Labs</p>
              <span className="text-[10px] text-sky-700 font-bold flex items-center justify-center gap-0.5 mt-1 group-hover:underline">
                <span>Directory</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Mandatory Disclaimer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DisclaimerBanner />
      </section>

      {/* Healthcare Category Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Browse Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Healthcare Facility Categories
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.type}
              to={`/search?category=${c.type}`}
              className={`p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group ${c.bg}`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-brand-700">
                <span>Explore category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Verified Providers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Top Verified Healthcare Facilities
            </h2>
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>See full directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFacilities.map((fac) => (
              <FacilityCard key={fac.facility_id} facility={fac} />
            ))}
          </div>
        )}
      </section>

      {/* City-Wise Healthcare Data Coverage (Section 50) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>Location-Based Healthcare Data</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              City-Wise Healthcare Coverage across Maharashtra
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              MediGuide provides comprehensive facility records and approximate cost transparency starting with Pune as the primary focus, plus coverage in other major cities.
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>Open Nearby Map</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Primary Focus Card: Pune */}
        <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500 text-white">
                  Primary Focus City
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-brand-200 border border-white/20">
                  31+ Localities Covered
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                Pune Healthcare Directory
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                Extensive demonstration dataset covering hospitals, diagnostic clinics, pathology laboratories, pharmacies, and blood banks from Hinjawadi &amp; Wakad to Hadapsar &amp; Camp.
              </p>
            </div>
            <Link
              to="/search?city=Pune"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-brand-50 text-brand-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
            >
              <span>Explore All Pune Facilities</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-700" />
            </Link>
          </div>

          {/* Quick Locality Links for Pune */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs font-bold text-slate-300 mb-2">Key Pune Localities with Facilities:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Shivajinagar',
                'Kothrud',
                'Baner',
                'Wakad',
                'Hinjawadi',
                'Aundh',
                'Deccan',
                'Pimpri-Chinchwad',
                'Hadapsar',
                'Kharadi',
                'Viman Nagar',
                'Koregaon Park',
                'Swargate',
                'Camp',
                'Pimple Saudagar',
                'Pimple Gurav',
                'Bhosari',
                'Akurdi',
                'Nigdi',
                'Chinchwad',
                'Dapodi',
                'Vishrantwadi',
                'Lohegaon',
                'Wagholi',
                'Sinhagad Road',
                'Dhayari',
                'Narhe',
                'Bavdhan',
                'Katraj',
                'Kondhwa',
              ].map((loc) => (
                <Link
                  key={loc}
                  to={`/search?city=Pune&locality=${encodeURIComponent(loc)}`}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-medium text-slate-200 transition-colors"
                >
                  {loc}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Other Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'Mumbai', count: 'Hospitals & Labs' },
            { name: 'Navi Mumbai', count: 'Super Speciality' },
            { name: 'Thane', count: 'Clinics & Care' },
            { name: 'Nagpur', count: 'Multi-speciality' },
            { name: 'Nashik', count: 'Diagnostic Hubs' },
            { name: 'Chhatrapati Sambhajinagar', count: 'Regional Labs' },
            { name: 'Kolhapur', count: 'Medical Centres' },
            { name: 'Solapur', count: 'Inpatient Care' },
            { name: 'Satara', count: 'Clinics & Doctors' },
            { name: 'Sangli', count: 'Diagnostics' },
            { name: 'Ahilyanagar', count: 'General Facilities' },
          ].map((c) => (
            <Link
              key={c.name}
              to={`/search?city=${encodeURIComponent(c.name)}`}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <MapPin className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform mb-1.5" />
                <h4 className="font-bold text-slate-900 text-xs group-hover:text-brand-700 transition-colors">
                  {c.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{c.count}</p>
              </div>
              <div className="pt-2 text-[10px] font-bold text-brand-600 flex items-center gap-0.5">
                <span>View</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cost Transparency Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Transparent Healthcare Pricing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                No Surprise Bills. Compare Approximate Costs Before You Visit.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                MediGuide collects official hospital tariff schedules, representative submissions, and standardized rates for common procedures—from general consultations to advanced MRI scans.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Fixed & cost range transparency (min–max)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Clear unit basis (per consultation, per scan)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Verified data sources & collection dates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Side-by-side facility comparison matrix</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/compare"
                  className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>Open Cost Comparison Tool</span>
                </Link>
                <Link
                  to="/services"
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  Explore Services Catalog
                </Link>
              </div>
            </div>

            {/* Visual comparison preview card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-bold text-slate-300">
                <span>Diagnostic Test Comparison</span>
                <span className="text-brand-300">Sample Live Rates</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">General Consultation</p>
                    <p className="text-[11px] text-slate-400">City Polyclinic</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400 text-sm">₹500</p>
                    <p className="text-[10px] text-slate-400">Fixed rate</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">MRI Scan (Brain/Spine)</p>
                    <p className="text-[11px] text-slate-400">Metropolis Diagnostics</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-brand-300 text-sm">₹6,500 – ₹9,500</p>
                    <p className="text-[10px] text-slate-400">Approx. range</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Complete Blood Count (CBC)</p>
                    <p className="text-[11px] text-slate-400">Dr. Lal PathLabs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-emerald-400 text-sm">₹250 – ₹380</p>
                    <p className="text-[10px] text-slate-400">Per profile</p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic text-center pt-1">
                * Approximate charges. Always confirm directly with the provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Pipeline Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Trust & Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How MediGuide Verifies Healthcare Data
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We use a multi-tiered validation workflow to ensure that facility location, hours, contact numbers, and cost records remain accurate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Administrative Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every newly registered facility and representative update enters a moderation queue where administrators review official licenses, tariff schedules, and physical addresses.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Authorized Representatives</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hospital and clinic representatives can only update their assigned organization. Submissions create versioned revision logs preventing silent overwrites.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Community Reporting & Audits</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Patients can flag outdated timings, phone numbers, or costs. Reports trigger instant administrative audit events recorded immutably in our database.
            </p>
          </div>
        </div>
      </section>

      {/* Location Search CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking for Healthcare Nearby?
            </h3>
            <p className="text-brand-100 text-sm max-w-xl">
              Enable browser location or pick your city to view exact distances, interactive maps, and find clinics within 1 km to 25 km.
            </p>
          </div>
          <Link
            to="/map"
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-brand-50 text-brand-900 font-bold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>Open Nearby Map Explorer</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
