import React, { useState, useEffect } from 'react';
import { LeafletMap } from '../components/LeafletMap';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VerificationBadge } from '../components/VerificationBadge';
import { DataOriginBadge } from '../components/DataOriginBadge';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Building2,
  Clock,
  Phone,
  SlidersHorizontal,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CITIES_DATA, DEFAULT_CITY, DEFAULT_PUNE_COORDS } from '../constants/locations';

export const NearbyMapPage: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [radius, setRadius] = useState<number>(15);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [locality, setLocality] = useState('ALL');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(DEFAULT_PUNE_COORDS);
  const [locating, setLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(
    'Defaulting to Pune center. Choose any of Pune’s 31+ localities or use GPS.'
  );

  const currentCityObj = CITIES_DATA.find((c) => c.name.toLowerCase() === city.toLowerCase()) || CITIES_DATA[0];

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setLocality('ALL');
    const found = CITIES_DATA.find((c) => c.name.toLowerCase() === newCity.toLowerCase());
    if (found) {
      setUserCoords(found.center);
      setLocationNotice(`Map centered on ${found.name} center.`);
    }
  };

  const handleLocalityChange = (newLocality: string) => {
    setLocality(newLocality);
    if (newLocality === 'ALL') {
      if (currentCityObj) {
        setUserCoords(currentCityObj.center);
        setLocationNotice(`Map centered on ${currentCityObj.name} central coordinates.`);
      }
    } else {
      const foundLoc = currentCityObj?.localities.find(
        (l) => l.name.toLowerCase() === newLocality.toLowerCase()
      );
      if (foundLoc) {
        setUserCoords({ lat: foundLoc.lat, lng: foundLoc.lng });
        setLocationNotice(`Map centered on ${foundLoc.name}, ${currentCityObj.name}. Showing facilities within ${radius} km.`);
      }
    }
  };

  const fetchNearby = async () => {
    try {
      setLoading(true);
      const res = await api.searchFacilities({
        category: category !== 'ALL' ? category : undefined,
        lat: userCoords?.lat,
        lng: userCoords?.lng,
        radius,
        city: city !== 'ALL' ? city : undefined,
        locality: locality !== 'ALL' ? locality : undefined,
        sort: 'distance',
      });
      if (res.success && res.data) {
        setFacilities(res.data);
      }
    } catch (err) {
      console.error('Nearby fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [category, radius, userCoords, city, locality]);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Location access was not granted. Enter your location manually.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        setLocationNotice('GPS coordinates updated successfully. Showing nearest facilities.');
      },
      () => {
        setLocating(false);
        setLocationNotice('Location access was not granted. Enter your location manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <MapPin className="w-8 h-8 text-brand-600" />
              <span>Nearby Healthcare Map</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              Primary City: Pune
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visual map navigator with calculated travel distance, locality drill-down, and radius filtering.
          </p>
        </div>

        {/* GPS Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleUseGPS}
            disabled={locating}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Acquiring GPS...' : 'Use My GPS Location'}</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {locationNotice && (
        <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>{locationNotice}</span>
          {userCoords && (
            <span className="text-slate-500 font-normal">
              ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
            </span>
          )}
        </div>
      )}

      {/* City & Locality Selection Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
          {/* City Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-600" />
              <span>City (Maharashtra)</span>
            </label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-800 bg-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
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

          {/* Area / Locality Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-brand-600" />
              <span>Area / Locality</span>
            </label>
            <select
              value={locality}
              onChange={(e) => handleLocalityChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-800 bg-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value="ALL">All Areas in {city}</option>
              {currentCityObj?.localities.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Selector */}
          <div className="md:col-span-4">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              <span>Radius (from {locality === 'ALL' ? city : locality})</span>
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-800 bg-white focus:ring-1 focus:ring-brand-500 cursor-pointer"
            >
              <option value={1}>Within 1 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={15}>Within 15 km (Default)</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          </div>
        </div>

        {/* Quick Pune Locality Buttons */}
        {city.toLowerCase() === 'pune' && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Quick Locality Center:</span>
              </span>
              <span className="text-[11px] text-brand-700 font-semibold">{currentCityObj.localities.length} Areas</span>
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
                'Hadapsar',
                'Kharadi',
                'Viman Nagar',
                'Koregaon Park',
                'Swargate',
                'Camp',
                'Pimpri-Chinchwad',
                'Bhosari',
                'Katraj',
              ].map((locName) => (
                <button
                  key={locName}
                  type="button"
                  onClick={() => handleLocalityChange(locName)}
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

        {/* Category Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Type:
          </span>
          {['ALL', 'HOSPITAL', 'CLINIC', 'DIAGNOSTIC_CENTRE', 'PHARMACY', 'BLOOD_CENTRE', 'LABORATORY'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Types' : cat.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Split View: Map + Facilities List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map */}
        <div className="lg:col-span-8">
          <LeafletMap
            facilities={facilities}
            userLat={userCoords?.lat}
            userLng={userCoords?.lng}
            radiusKm={radius}
            height="620px"
          />
        </div>

        {/* Right: Scrollable list of facilities */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 space-y-4 max-h-[620px] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Nearby Facilities ({facilities.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                {locality === 'ALL' ? city : `${locality}, ${city}`} • Within {radius} km
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {city}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
              <p className="text-xs">Finding nearest healthcare providers...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No facilities in this radius</p>
              <p className="text-xs text-slate-400">
                Try selecting &quot;All Areas in {city}&quot; or expanding the radius to 25 km or 50 km.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {facilities.map((fac) => (
                <div
                  key={fac.facility_id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-300 hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {fac.facility_type.replace(/_/g, ' ')}
                    </span>
                    <DataOriginBadge origin={fac.data_origin} size="sm" />
                    {fac.distance_label && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {fac.distance_label}
                      </span>
                    )}
                  </div>

                  {fac.locality && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                      📍 {fac.locality}
                    </span>
                  )}

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    <Link
                      to={`/facility/${fac.facility_id}`}
                      className="hover:text-brand-700 transition-colors"
                    >
                      {fac.facility_name}
                    </Link>
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1">{fac.address}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-slate-600 font-medium truncate max-w-[150px]">
                      📞 {fac.phone}
                    </span>
                    <Link
                      to={`/facility/${fac.facility_id}`}
                      className="font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
