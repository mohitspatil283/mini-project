import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  SlidersHorizontal,
  AlertCircle,
  Check,
  ChevronRight,
  Building2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { CITIES_DATA, DEFAULT_CITY, DEFAULT_PUNE_COORDS } from '../constants/locations';

export interface SearchParams {
  keyword: string;
  category: string;
  lat?: number;
  lng?: number;
  radius: number;
  service?: string;
  cost_available?: boolean;
  city?: string;
  locality?: string;
}

interface SearchBarProps {
  initialKeyword?: string;
  initialCategory?: string;
  initialRadius?: string | number;
  initialService?: string;
  initialCostOnly?: boolean;
  initialCity?: string;
  initialLocality?: string;
  onSearch: (params: SearchParams) => void;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialKeyword = '',
  initialCategory = 'ALL',
  initialRadius = 25,
  initialService = 'ALL',
  initialCostOnly = false,
  initialCity = DEFAULT_CITY,
  initialLocality = 'ALL',
  onSearch,
  compact = false,
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [radius, setRadius] = useState<number>(Number(initialRadius) || 25);
  const [service, setService] = useState(initialService);
  const [costOnly, setCostOnly] = useState(initialCostOnly);
  const [city, setCity] = useState(initialCity || DEFAULT_CITY);
  const [locality, setLocality] = useState(initialLocality || 'ALL');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    city === 'Pune' ? DEFAULT_PUNE_COORDS : null
  );

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Find active city object
  const currentCityObj = CITIES_DATA.find((c) => c.name.toLowerCase() === city.toLowerCase()) || CITIES_DATA[0];

  // When city changes, update center coords and reset locality
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setLocality('ALL');
    const found = CITIES_DATA.find((c) => c.name.toLowerCase() === newCity.toLowerCase());
    if (found) {
      setCoords(found.center);
      setLocationSuccess(`Location focused on ${found.name} center`);
      setLocationError(null);
    } else {
      setCoords(null);
    }
  };

  // When locality changes, update center coords to that area
  const handleLocalityChange = (newLocality: string) => {
    setLocality(newLocality);
    if (newLocality === 'ALL') {
      if (currentCityObj) {
        setCoords(currentCityObj.center);
        setLocationSuccess(`Focused on all areas across ${currentCityObj.name}`);
      }
    } else {
      const foundLoc = currentCityObj?.localities.find(
        (l) => l.name.toLowerCase() === newLocality.toLowerCase()
      );
      if (foundLoc) {
        setCoords({ lat: foundLoc.lat, lng: foundLoc.lng });
        setLocationSuccess(`Focused on ${foundLoc.name}, ${currentCityObj.name}`);
      }
    }
    setLocationError(null);
  };

  const handleUseMyLocation = () => {
    setLocationError(null);
    setLocationSuccess(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Enter your location manually.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setLocating(false);
        setLocationSuccess('Current GPS coordinates acquired.');
      },
      () => {
        setLocating(false);
        setLocationError('Location access was not granted. Enter your location manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleQuickLocalityPick = (locName: string) => {
    handleLocalityChange(locName);
    onSearch({
      keyword,
      category,
      lat: currentCityObj.localities.find((l) => l.name === locName)?.lat,
      lng: currentCityObj.localities.find((l) => l.name === locName)?.lng,
      radius,
      service: service !== 'ALL' ? service : undefined,
      cost_available: costOnly ? true : undefined,
      city,
      locality: locName,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      keyword,
      category,
      lat: coords?.lat,
      lng: coords?.lng,
      radius,
      service: service !== 'ALL' ? service : undefined,
      cost_available: costOnly ? true : undefined,
      city: city !== 'ALL' ? city : undefined,
      locality: locality !== 'ALL' ? locality : undefined,
    });
  };

  return (
    <div className={`w-full ${compact ? '' : 'bg-white rounded-3xl shadow-xl border border-slate-200/90 p-4 md:p-6'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Navigation Step Hierarchy Indicator: City -> Area/Locality -> Facility/Service -> Radius */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 overflow-x-auto pb-1 scrollbar-none">
          <span className="flex items-center gap-1 text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
            <span>1. City</span>
            <span className="text-slate-900 font-extrabold">{city}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${locality !== 'ALL' ? 'text-brand-700 bg-brand-50 border-brand-200 font-extrabold' : 'bg-slate-50 border-slate-200'}`}>
            <span>2. Area</span>
            <span className="text-slate-800">{locality === 'ALL' ? 'All Localities' : locality}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${service !== 'ALL' || category !== 'ALL' ? 'text-brand-700 bg-brand-50 border-brand-200 font-extrabold' : 'bg-slate-50 border-slate-200'}`}>
            <span>3. Service</span>
            <span className="text-slate-800">{service !== 'ALL' ? service : category !== 'ALL' ? category : 'Any'}</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
            <span>4. Radius</span>
            <span className="text-slate-800 font-extrabold">{radius} km</span>
          </span>
        </div>

        {/* Primary Search Bar Row: City + Area + Keyword + Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
          {/* Step 1: City Dropdown (Pune as default) */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-600" />
              <span>City (Maharashtra)</span>
            </label>
            <select
              id="search-city-select"
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-900 text-sm font-semibold bg-white transition-all cursor-pointer shadow-2xs"
            >
              <optgroup label="Primary Demonstration City">
                <option value="Pune">Pune (Primary - 31+ Areas)</option>
              </optgroup>
              <optgroup label="Other Maharashtra Cities">
                <option value="Mumbai">Mumbai</option>
                <option value="Navi Mumbai">Navi Mumbai</option>
                <option value="Thane">Thane</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="Solapur">Solapur</option>
                <option value="Satara">Satara</option>
                <option value="Sangli">Sangli</option>
                <option value="Ahilyanagar">Ahilyanagar</option>
              </optgroup>
            </select>
          </div>

          {/* Step 2: Locality / Area Dropdown */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-brand-600" />
              <span>Area / Locality</span>
            </label>
            <select
              id="search-locality-select"
              value={locality}
              onChange={(e) => handleLocalityChange(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-900 text-sm font-semibold bg-white transition-all cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Areas in {city}</option>
              {currentCityObj?.localities.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search Input */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Search className="w-3 h-3 text-slate-400" />
              <span>Facility, Service or Doctor</span>
            </label>
            <input
              type="text"
              id="search-keyword-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Ruby Hall, MRI, Ultrasound, Dr..."
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-slate-900 text-sm font-medium transition-all shadow-2xs"
            />
          </div>

          {/* Filter toggle & Submit */}
          <div className="md:col-span-2 flex items-end gap-2 pt-5">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-2xl border transition-colors flex items-center justify-center ${
                showFilters || costOnly || service !== 'ALL' || category !== 'ALL'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle advanced filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <button
              type="submit"
              id="search-submit-button"
              className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find</span>
            </button>
          </div>
        </div>

        {/* Location Alerts (GPS / Area) */}
        {locationError && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        )}

        {locationSuccess && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{locationSuccess}</span>
            {coords && (
              <span className="text-slate-500 font-normal">
                ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
              </span>
            )}
          </div>
        )}

        {/* Extended filters drawer / panel */}
        {(showFilters || !compact) && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
            {/* Step 3a: Facility Category */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-semibold">Facility Type</label>
              <select
                id="search-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">All Facility Types</option>
                <option value="HOSPITAL">Hospitals</option>
                <option value="CLINIC">Clinics & Polyclinics</option>
                <option value="DIAGNOSTIC_CENTRE">Diagnostic Centres</option>
                <option value="PHARMACY">Pharmacies</option>
                <option value="BLOOD_CENTRE">Blood Centres</option>
                <option value="LABORATORY">Pathology Laboratories</option>
                <option value="OTHER">Other Healthcare Services</option>
              </select>
            </div>

            {/* Step 3b: Healthcare Service Filter */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-semibold">Diagnostic / Medical Service</label>
              <select
                id="search-service-select"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">All Services</option>
                <option value="General Consultation">General Consultation</option>
                <option value="Blood Test">Blood Test</option>
                <option value="X-Ray">X-Ray Imaging</option>
                <option value="Ultrasound">Ultrasound Sonography</option>
                <option value="ECG">ECG Cardiology</option>
                <option value="MRI">MRI Scan</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                <option value="Echocardiogram (2D Echo)">2D Echocardiogram</option>
                <option value="Dental Scaling & Cleaning">Dental Scaling & Cleaning</option>
              </select>
            </div>

            {/* Step 4: Radius Filter */}
            <div>
              <label className="block text-slate-500 mb-1.5 font-semibold">Search Radius (from locality)</label>
              <select
                id="search-radius-select"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-brand-500"
              >
                <option value={1}>Within 1 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={15}>Within 15 km</option>
                <option value={25}>Within 25 km (Standard)</option>
                <option value={50}>Within 50 km (Regional)</option>
              </select>
            </div>

            {/* GPS & Cost Availability */}
            <div className="flex flex-col justify-end space-y-2">
              <button
                type="button"
                id="btn-use-my-location"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full py-2 px-3 rounded-xl border border-brand-300 bg-brand-50/70 hover:bg-brand-100/70 text-brand-800 font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Acquiring GPS...' : 'Use My GPS Position'}</span>
              </button>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="chk-cost-available"
                  checked={costOnly}
                  onChange={(e) => setCostOnly(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span className="text-slate-700 font-semibold text-xs">Only Verified Cost Records</span>
              </label>
            </div>
          </div>
        )}

        {/* Pune Locality Quick Filters (When Pune is selected) */}
        {!compact && city.toLowerCase() === 'pune' && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Explore Pune Localities ({currentCityObj.localities.length} areas):</span>
              </span>
              <span className="text-[11px] text-brand-700 font-semibold">Primary Demo Dataset</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
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
                'Bhosari',
                'Katraj',
                'Dhayari',
                'Bavdhan',
              ].map((locName) => (
                <button
                  key={locName}
                  type="button"
                  onClick={() => handleQuickLocalityPick(locName)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    locality === locName
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {locName}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
