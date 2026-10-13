import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VerificationBadge } from './VerificationBadge';
import { DataOriginBadge } from './DataOriginBadge';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  MapPin,
  Phone,
  Clock,
  Bookmark,
  Scale,
  ArrowRight,
  IndianRupee,
  Layers,
  Building,
} from 'lucide-react';

interface FacilityCardProps {
  facility: {
    facility_id: number;
    facility_name: string;
    facility_type: string;
    address: string;
    locality?: string;
    city: string;
    state?: string;
    phone: string;
    operating_hours: string;
    status: string;
    data_origin?: string;
    distance_km?: number | null;
    distance_label?: string | null;
    is_saved?: boolean;
    services?: Array<{ service_id: number; name: string }>;
    has_cost_info?: boolean;
    cost_count?: number;
    costs?: Array<any>;
  };
  onBookmarkChange?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const { isInCompare, toggleFacility } = useCompare();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState<boolean>(facility.is_saved || false);
  const [saving, setSaving] = useState(false);

  const inCompare = isInCompare(facility.facility_id);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please sign in or register to bookmark healthcare facilities.', 'info');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await api.removeSavedFacility(facility.facility_id);
        setIsSaved(false);
        toast('Facility removed from bookmarks.', 'info');
      } else {
        await api.saveFacility(facility.facility_id);
        setIsSaved(true);
        toast('Facility saved successfully.', 'success');
      }
      if (onBookmarkChange) onBookmarkChange();
    } catch (err: any) {
      toast(err.message || 'Unable to update bookmark.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFacility({
      facility_id: facility.facility_id,
      facility_name: facility.facility_name,
      facility_type: facility.facility_type,
      city: facility.city,
    });
  };

  const formatFacilityType = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Category, Status & Data Origin Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              {formatFacilityType(facility.facility_type)}
            </span>
            <VerificationBadge status={facility.status} size="sm" showTooltip={true} />
            <DataOriginBadge origin={facility.data_origin} size="sm" />
          </div>

          {/* Distance Badge */}
          {facility.distance_label && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-600" />
              {facility.distance_label}
            </span>
          )}
        </div>

        {/* Facility Title & Locality/City */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {facility.locality && (
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200/80">
                {facility.locality}
              </span>
            )}
            <span className="text-[11px] font-semibold text-slate-500">
              {facility.city}, Maharashtra
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
            <Link to={`/facility/${facility.facility_id}`}>{facility.facility_name}</Link>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-start gap-1.5 line-clamp-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              {facility.address}
            </span>
          </p>
        </div>

        {/* Contact & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{facility.phone}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{facility.operating_hours}</span>
          </div>
        </div>

        {/* Available Services Chips */}
        {facility.services && facility.services.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Available Services ({facility.services.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {facility.services.slice(0, 4).map((svc) => (
                <span
                  key={svc.service_id}
                  className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-md"
                >
                  {svc.name}
                </span>
              ))}
              {facility.services.length > 4 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-medium rounded-md">
                  +{facility.services.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Cost Transparency Pill */}
        <div className="pt-2">
          {facility.has_cost_info ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Verified Approximate Costs Available ({facility.cost_count} services)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Cost information unavailable</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 sm:px-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Compare Checkbox */}
        <button
          type="button"
          onClick={handleToggleCompare}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
            inCompare
              ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{inCompare ? 'Comparing' : 'Compare'}</span>
        </button>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Save Bookmark */}
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
            }`}
            title={isSaved ? 'Remove from bookmarks' : 'Save facility'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>

          {/* View Details */}
          <Link
            to={`/facility/${facility.facility_id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold shadow-xs hover:shadow-brand-500/20 transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
