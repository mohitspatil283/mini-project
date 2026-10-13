import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FacilityCard } from '../components/FacilityCard';
import { LeafletMap } from '../components/LeafletMap';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';
import {
  Compass,
  Map as MapIcon,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortOption, setSortOption] = useState<string>(searchParams.get('sort') || 'distance');

  // Search parameters from URL
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'ALL';
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!, 10) : 25;
  const service = searchParams.get('service') || 'ALL';
  const costAvailable = searchParams.get('cost_available') === 'true';
  const city = searchParams.get('city') || 'Pune';
  const locality = searchParams.get('locality') || 'ALL';

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.searchFacilities({
        keyword,
        category,
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        radius,
        service: service !== 'ALL' ? service : undefined,
        cost_available: costAvailable || undefined,
        sort: sortOption,
        city: city !== 'ALL' ? city : undefined,
        locality: locality !== 'ALL' ? locality : undefined,
      });

      if (res.success && res.data) {
        setFacilities(res.data);
      }
    } catch (err) {
      console.error('Search fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams, sortOption]);

  const handleSearchSubmit = (params: any) => {
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
    if (sortOption) q.append('sort', sortOption);
    setSearchParams(q);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Compass className="w-8 h-8 text-brand-600" />
          <span>Find Healthcare Facilities</span>
        </h1>
        <p className="text-sm text-slate-500">
          Discover verified hospitals, diagnostic labs, clinics, and pharmacies with transparent approximate pricing.
        </p>
      </div>

      {/* Embedded Search Filter Bar */}
      <SearchBar
        initialKeyword={keyword}
        initialCategory={category}
        initialRadius={radius}
        initialService={service}
        initialCostOnly={costAvailable}
        initialCity={city}
        initialLocality={locality}
        onSearch={handleSearchSubmit}
      />

      <DisclaimerBanner compact={true} />

      {/* Control bar: Count, Sort, View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-900">
            {loading ? 'Searching...' : `${facilities.length} Facilities Found`}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            📍 {city}
          </span>
          {locality && locality !== 'ALL' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {locality}
            </span>
          )}
          {category !== 'ALL' && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {category.replace('_', ' ')}
            </span>
          )}
          {lat && lng && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              Within {radius} km
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium text-xs focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="distance">Distance (Nearest First)</option>
              <option value="name_asc">Facility Name (A to Z)</option>
              <option value="name_desc">Facility Name (Z to A)</option>
              <option value="services_count">Most Services Offered</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-sm font-medium text-slate-500">Searching healthcare facilities...</p>
        </div>
      ) : facilities.length === 0 ? (
        /* TC-SEARCH-03: Empty State matching SRS Section 33 */
        <div className="py-16 px-4 text-center rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No Facilities Found</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              No healthcare facilities matched your search. Try changing the location, category or radius.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="px-4 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <FacilityCard key={fac.facility_id} facility={fac} onBookmarkChange={fetchResults} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <LeafletMap
            facilities={facilities}
            userLat={lat}
            userLng={lng}
            radiusKm={radius}
            height="550px"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <FacilityCard key={fac.facility_id} facility={fac} onBookmarkChange={fetchResults} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
