import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { VerificationBadge } from '../components/VerificationBadge';
import { DataOriginBadge } from '../components/DataOriginBadge';
import { ReportModal } from '../components/ReportModal';
import { LeafletMap } from '../components/LeafletMap';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Bookmark,
  Scale,
  AlertTriangle,
  IndianRupee,
  Layers,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from 'lucide-react';

export const FacilityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toggleFacility, isInCompare } = useCompare();
  const { toast } = useToast();

  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFacility() {
      try {
        setLoading(false);
        const res = await api.getFacilityDetails(parseInt(id!, 10));
        if (res.success && res.data) {
          setFacility(res.data);
          setIsSaved(res.data.is_saved);
        } else {
          setError('Facility not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Unable to load facility profile.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchFacility();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500">
        <p className="animate-pulse">Loading healthcare facility details...</p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Facility Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested facility does not exist.'}</p>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(facility.facility_id);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast('Please sign in or register to bookmark facilities.', 'info');
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.removeSavedFacility(facility.facility_id);
        setIsSaved(false);
        toast('Facility removed from bookmarks.', 'info');
      } else {
        await api.saveFacility(facility.facility_id);
        setIsSaved(true);
        toast('Facility saved successfully.', 'success');
      }
    } catch (err: any) {
      toast(err.message || 'Unable to update bookmark.', 'error');
    }
  };

  const handleToggleCompare = () => {
    toggleFacility({
      facility_id: facility.facility_id,
      facility_name: facility.facility_name,
      facility_type: facility.facility_type,
      city: facility.city,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Facility profile link copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
        <Link to="/search" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Directory</span>
        </Link>
        <span>/</span>
        <span className="text-slate-600 font-bold">{facility.city}</span>
        {facility.locality && (
          <>
            <span>/</span>
            <span className="text-brand-700 font-bold">{facility.locality}</span>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{facility.facility_name}</span>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {facility.facility_type.replace(/_/g, ' ')}
              </span>
              <VerificationBadge status={facility.status} size="md" showTooltip={true} />
              <DataOriginBadge origin={facility.data_origin} size="md" />
              {facility.locality && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  📍 {facility.locality}, {facility.city}
                </span>
              )}
              {facility.distance_label && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {facility.distance_label}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {facility.facility_name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 flex items-start gap-2">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                {facility.address}, {facility.locality ? `${facility.locality}, ` : ''}{facility.city}, {facility.state} — {facility.pincode}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
            <button
              onClick={handleToggleCompare}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                inCompare
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{inCompare ? 'In Comparison' : 'Compare Costs'}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast('Please sign in or register to submit reports.', 'info');
                  navigate('/login');
                  return;
                }
                setReportModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100/60 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              Direct Phone
            </span>
            <p className="font-semibold text-slate-800">{facility.phone}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              Operating Hours
            </span>
            <p className="font-semibold text-slate-800">{facility.operating_hours}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              Area & City
            </span>
            <p className="font-semibold text-slate-800 truncate">
              {facility.locality ? `${facility.locality}, ` : ''}{facility.city}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              Data Provenance
            </span>
            <p className="font-semibold text-slate-800 truncate">
              {facility.data_origin === 'DEMONSTRATION_SAMPLE'
                ? 'Sample Dataset (Demo)'
                : 'Verified Partner Source'}
            </p>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Services & Cost Transparency Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-brand-600" />
              <span>Healthcare Services & Approximate Costs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Approximate cost tariffs collected from official price lists and verified facility representatives.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Approximate cost. Please confirm final charges with facility.</span>
          </div>
        </div>

        {/* Cost Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Approximate Cost</th>
                <th className="py-3.5 px-4">Unit / Basis</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Source & Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facility.cost_records && facility.cost_records.length > 0 ? (
                facility.cost_records.map((cost: any) => {
                  const isFixed = cost.amount_min === cost.amount_max;
                  return (
                    <tr key={cost.cost_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {cost.service_name}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                        {cost.service_category}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-emerald-700 text-base">
                        {isFixed ? (
                          <span>₹{cost.amount_min.toLocaleString('en-IN')}</span>
                        ) : (
                          <span>
                            ₹{cost.amount_min.toLocaleString('en-IN')} – ₹{cost.amount_max.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-600">
                        {cost.unit_basis}
                      </td>
                      <td className="py-4 px-4">
                        <VerificationBadge status={cost.verification_status} size="sm" />
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        <p className="truncate max-w-[200px]">{cost.source}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {cost.collected_date
                            ? new Date(cost.collected_date).toLocaleDateString()
                            : 'Recent'}
                        </p>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">Cost information unavailable</p>
                    <p className="text-xs text-slate-400 mt-1">
                      No standardized cost tariffs have been published or verified for this facility yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Other available services not in tariff list */}
        {facility.services && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              All Available Services Catalog
            </h4>
            <div className="flex flex-wrap gap-2">
              {facility.services.map((svc: any) => (
                <span
                  key={svc.service_id}
                  className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  {svc.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map & Location Visualization */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>Location & Directions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact GPS Pin: ({facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)})
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            Open in Google Maps ↗
          </a>
        </div>

        <LeafletMap
          facilities={[facility]}
          userLat={facility.latitude}
          userLng={facility.longitude}
          radiusKm={2}
          height="380px"
        />
      </div>

      {/* Report Modal */}
      <ReportModal
        facilityId={facility.facility_id}
        facilityName={facility.facility_name}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
