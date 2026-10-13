import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import { FacilityCard } from '../../components/FacilityCard';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import {
  Compass,
  Bookmark,
  FileText,
  Scale,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [savedFacilities, setSavedFacilities] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [savedRes, reportsRes] = await Promise.all([
          api.getSavedFacilities(),
          api.getMyReports(),
        ]);
        if (savedRes.success && savedRes.data) {
          setSavedFacilities(savedRes.data);
        }
        if (reportsRes.success && reportsRes.data) {
          setReports(reportsRes.data);
        }
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-200">
              Registered Patient Navigator
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
              Access your bookmarked healthcare providers, review your data accuracy reports, and discover transparent local pricing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="px-4 py-2.5 rounded-2xl bg-white text-brand-800 font-bold text-xs sm:text-sm shadow-sm hover:bg-brand-50 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Explore Facilities</span>
            </Link>
          </div>
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Quick Action Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/user/saved"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-400 hover:shadow-card-hover transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{savedFacilities.length}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Saved Facilities</p>
          </div>
          <p className="text-xs text-brand-700 font-semibold flex items-center gap-1">
            <span>View bookmarks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/user/reports"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-card-hover transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{reports.length}</p>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Reports Submitted</p>
          </div>
          <p className="text-xs text-sky-700 font-semibold flex items-center gap-1">
            <span>Track resolutions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/compare"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-card-hover transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">Cost Compare</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Side-by-Side Matrix</p>
          </div>
          <p className="text-xs text-amber-700 font-semibold flex items-center gap-1">
            <span>Open comparison tool</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>

        <Link
          to="/map"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-card-hover transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">Nearby Map</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">GPS Distance Filter</p>
          </div>
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <span>Explore map</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </p>
        </Link>
      </div>

      {/* Saved Facilities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-brand-600" />
            <span>Recently Saved Facilities</span>
          </h2>
          {savedFacilities.length > 0 && (
            <Link to="/user/saved" className="text-xs font-bold text-brand-700 hover:underline">
              View all ({savedFacilities.length})
            </Link>
          )}
        </div>

        {savedFacilities.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-3xl bg-white border border-slate-200 p-6 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No saved facilities yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Save facilities while searching to quickly revisit their contact details and pricing.
            </p>
            <Link
              to="/search"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs"
            >
              Browse Facility Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedFacilities.slice(0, 3).map((item) => (
              <FacilityCard
                key={item.saved_id}
                facility={{ ...item.facility, is_saved: true }}
                onBookmarkChange={() => {
                  setSavedFacilities((prev) =>
                    prev.filter((f) => f.facility.facility_id !== item.facility.facility_id)
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Reports Tracking Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Your Submitted Data Reports</span>
          </h3>
          <Link to="/user/reports" className="text-xs font-bold text-brand-700 hover:underline">
            View All Reports
          </Link>
        </div>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-3">
            You haven't submitted any data correction reports yet.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 3).map((rep) => {
              const statusColors: Record<string, string> = {
                OPEN: 'bg-amber-50 text-amber-800 border-amber-200',
                UNDER_REVIEW: 'bg-sky-50 text-sky-800 border-sky-200',
                RESOLVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
              };

              return (
                <div
                  key={rep.report_id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">
                      {rep.facility?.facility_name}
                    </p>
                    <p className="text-slate-500 font-medium">
                      Category: {rep.category.replace(/_/g, ' ')}
                    </p>
                    <p className="text-slate-600 line-clamp-1 italic">"{rep.description}"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                        statusColors[rep.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {rep.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
