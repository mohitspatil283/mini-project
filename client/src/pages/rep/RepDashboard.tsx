import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../../components/VerificationBadge';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { Link } from 'react-router-dom';
import {
  Building2,
  Phone,
  Clock,
  MapPin,
  Layers,
  IndianRupee,
  FileEdit,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export const RepDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRepData() {
      try {
        setLoading(true);
        const res = await api.getRepDashboard();
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error || 'Failed to load assigned facility dashboard.');
        }
      } catch (err: any) {
        setError(err.message || 'Access error.');
      } finally {
        setLoading(false);
      }
    }
    loadRepData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
        <p className="text-sm">Loading Facility Representative Portal...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Representative Notice</h2>
        <p className="text-sm text-slate-600">{error}</p>
      </div>
    );
  }

  const { facility, services, cost_records, pending_revisions, active_reports } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Authorized Healthcare Representative
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {facility.facility_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Representative: {user?.name} ({user?.email})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <VerificationBadge status={facility.status} size="lg" />
            <Link
              to="/rep/facility"
              className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <FileEdit className="w-4 h-4" />
              <span>Propose Updates</span>
            </Link>
          </div>
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Facility KPI Cards (All Clickable and Filter Connected) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/rep/facility"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-500 hover:shadow-card-hover transition-all space-y-2 block group cursor-pointer"
          title="Click to view and configure offered medical services"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-brand-600 transition-colors">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Offered Services</span>
          </p>
          <p className="text-2xl font-extrabold text-slate-900 group-hover:text-brand-700 transition-colors">{services.length}</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500">Active procedures</span>
            <span className="text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Manage ↗</span>
          </div>
        </Link>

        <Link
          to="/rep/costs"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-500 hover:shadow-card-hover transition-all space-y-2 block group cursor-pointer"
          title="Click to manage published procedure tariffs"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>Published Tariffs</span>
          </p>
          <p className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">{cost_records.length}</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500">Pricing records</span>
            <span className="text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Edit Tariffs ↗</span>
          </div>
        </Link>

        <Link
          to="/rep/revisions"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-500 hover:shadow-card-hover transition-all space-y-2 block group cursor-pointer"
          title="Click to view history of submitted revisions"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-amber-600 transition-colors">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Revisions</span>
          </p>
          <p className="text-2xl font-extrabold text-amber-700 group-hover:text-amber-800 transition-colors">{pending_revisions.length}</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500">Awaiting review</span>
            <span className="text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Track ↗</span>
          </div>
        </Link>

        <Link
          to="/rep/facility"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-rose-500 hover:shadow-card-hover transition-all space-y-2 block group cursor-pointer"
          title="Click to view facility details and address flagged reports"
        >
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-rose-600 transition-colors">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Active Reports</span>
          </p>
          <p className="text-2xl font-extrabold text-rose-700 group-hover:text-rose-800 transition-colors">{active_reports.length}</p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-500">Flagged reports</span>
            <span className="text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Review ↗</span>
          </div>
        </Link>
      </div>

      {/* Main Grid: Services & Cost Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cost Records */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-brand-600" />
                <span>Service Tariffs & Pricing</span>
              </h2>
              <p className="text-xs text-slate-500">
                Submit approximate pricing to help patients understand anticipated charges.
              </p>
            </div>
            <Link
              to="/rep/costs"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit / Update Cost</span>
            </Link>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Cost Range</th>
                  <th className="py-3 px-4">Unit Basis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cost_records.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No tariffs submitted yet. Click "Submit / Update Cost" to publish prices.
                    </td>
                  </tr>
                ) : (
                  cost_records.map((c: any) => (
                    <tr key={c.cost_id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.service?.name}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                        {c.amount_min === c.amount_max
                          ? `₹${c.amount_min.toLocaleString('en-IN')}`
                          : `₹${c.amount_min.toLocaleString('en-IN')} – ₹${c.amount_max.toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{c.unit_basis}</td>
                      <td className="py-3.5 px-4">
                        <VerificationBadge status={c.verification_status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {c.verified_at ? new Date(c.verified_at).toLocaleDateString() : 'Pending'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Organization Details & Revision Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Facility Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Facility Record Info</span>
              <Link to="/rep/facility" className="text-xs text-brand-700 font-bold hover:underline">
                Edit Details
              </Link>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Physical Address</span>
                <p className="font-semibold text-slate-800">
                  {facility.address}, {facility.city}, {facility.state} — {facility.pincode}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Public Phone</span>
                <p className="font-semibold text-slate-800">{facility.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-medium">Operating Hours</span>
                <p className="font-semibold text-slate-800">{facility.operating_hours}</p>
              </div>
            </div>
          </div>

          {/* Pending Revisions Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Submitted Revisions</h3>
              <Link to="/rep/revisions" className="text-xs text-brand-700 font-bold hover:underline">
                View all ({data.recent_revisions.length})
              </Link>
            </div>

            {data.recent_revisions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No revision history found.</p>
            ) : (
              <div className="space-y-2.5">
                {data.recent_revisions.slice(0, 3).map((rev: any) => (
                  <div
                    key={rev.revision_id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        Revision #{rev.revision_id}
                      </span>
                      <VerificationBadge status={rev.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Submitted: {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
