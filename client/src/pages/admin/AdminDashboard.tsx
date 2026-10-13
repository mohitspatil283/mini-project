import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Layers,
  FileText,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  History,
  Loader2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
        <p className="text-sm">Calculating real-time database analytics...</p>
      </div>
    );
  }

  const { kpi, facilitiesByType, reportsByStatus } = stats || {
    kpi: {},
    facilitiesByType: {},
    reportsByStatus: {},
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            MediGuide Platform Operations
          </h1>
          <p className="text-sm text-slate-500">
            Real-time analytics computed directly from the live database. No mock values.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/verification"
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Verification Queue ({kpi.pendingFacilities + kpi.pendingRevisions})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (All Clickable and Filter Connected) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/facilities"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to view all facilities in management portal"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-brand-600 transition-colors">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            Total Facilities
          </span>
          <p className="text-3xl font-extrabold text-slate-900 group-hover:text-brand-700 transition-colors">
            {kpi.totalFacilities}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-emerald-600 font-semibold">{kpi.verifiedFacilities} Verified</span>
            <span className="text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to view user accounts and representatives"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-sky-600 transition-colors">
            <Users className="w-3.5 h-3.5 text-sky-600" />
            Total Accounts
          </span>
          <p className="text-3xl font-extrabold text-slate-900 group-hover:text-sky-700 transition-colors">
            {kpi.totalUsers}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Patients & Reps</span>
            <span className="text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Manage ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/facilities?status=PENDING"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to review facilities awaiting verification"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-amber-600 transition-colors">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Facilities
          </span>
          <p className="text-3xl font-extrabold text-amber-600 group-hover:text-amber-700 transition-colors">
            {kpi.pendingFacilities}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Awaiting review</span>
            <span className="text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Review ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/reports?status=OPEN"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-rose-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to inspect open community data correction reports"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-rose-600 transition-colors">
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            Pending Reports
          </span>
          <p className="text-3xl font-extrabold text-rose-600 group-hover:text-rose-700 transition-colors">
            {kpi.pendingReports}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Requires audit</span>
            <span className="text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Investigate ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/services"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to view and configure standardized medical services catalog"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Active Services
          </span>
          <p className="text-3xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
            {kpi.totalServices}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Standardized catalog</span>
            <span className="text-indigo-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Configure ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/verification"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-brand-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to open verification moderation queue"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-brand-600 transition-colors">
            <FileCheck className="w-3.5 h-3.5 text-brand-600" />
            Pending Revisions
          </span>
          <p className="text-3xl font-extrabold text-brand-600 group-hover:text-brand-700 transition-colors">
            {kpi.pendingRevisions}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Representative changes</span>
            <span className="text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Moderate ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/costs?status=VERIFIED"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to view verified published healthcare tariffs"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            Verified Costs
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 group-hover:text-emerald-700 transition-colors">
            {kpi.verifiedCosts}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Published tariffs</span>
            <span className="text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Tariffs ↗</span>
          </div>
        </Link>

        <Link
          to="/admin/costs?status=PENDING"
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-500 hover:shadow-card-hover transition-all space-y-1 block group cursor-pointer"
          title="Click to review pending pricing submissions"
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-slate-700 transition-colors">
            <History className="w-3.5 h-3.5 text-slate-600" />
            Pending Costs
          </span>
          <p className="text-3xl font-extrabold text-slate-700 group-hover:text-slate-900 transition-colors">
            {kpi.pendingCosts}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400">Tariffs to verify</span>
            <span className="text-slate-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Verify ↗</span>
          </div>
        </Link>
      </div>

      {/* Breakdown Charts / Live Aggregations (Clickable Rows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facilities by category */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Facilities by Category</h3>
              <p className="text-[11px] text-slate-400">Click any category to view filtered facilities</p>
            </div>
            <Link to="/admin/facilities" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {Object.entries(facilitiesByType).map(([cat, count]: any) => {
              const pct = Math.round((count / (kpi.totalFacilities || 1)) * 100);
              return (
                <Link
                  key={cat}
                  to={`/admin/facilities?type=${encodeURIComponent(cat)}`}
                  className="block p-2 rounded-2xl hover:bg-slate-50 transition-all group"
                  title={`View ${cat.replace(/_/g, ' ')} facilities`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                      <span>{cat.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </span>
                    <span className="text-slate-500 font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-500 h-full rounded-full transition-all duration-500 group-hover:bg-brand-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Reports by status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Data Reports by Status</h3>
              <p className="text-[11px] text-slate-400">Click any status to view filtered reports (Total: {kpi.totalReports})</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-brand-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {Object.entries(reportsByStatus).map(([status, count]: any) => {
              const pct = Math.round((count / (kpi.totalReports || 1)) * 100);
              const colorClass =
                status === 'RESOLVED'
                  ? 'bg-emerald-500'
                  : status === 'OPEN'
                  ? 'bg-amber-500'
                  : status === 'UNDER_REVIEW'
                  ? 'bg-sky-500'
                  : 'bg-rose-500';

              return (
                <Link
                  key={status}
                  to={`/admin/reports?status=${encodeURIComponent(status)}`}
                  className="block p-2 rounded-2xl hover:bg-slate-50 transition-all group"
                  title={`View ${status.replace(/_/g, ' ')} reports`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span className="group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                      <span>{status.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-brand-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </span>
                    <span className="text-slate-500 font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${colorClass} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Portals to all Admin functions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/facilities"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <Building2 className="w-6 h-6 text-brand-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-700">
            Facility Management →
          </h4>
          <p className="text-xs text-slate-500">
            Add facilities, edit details, verify, reject, or archive organizations.
          </p>
        </Link>

        <Link
          to="/admin/verification"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <Clock className="w-6 h-6 text-amber-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700">
            Verification Queue →
          </h4>
          <p className="text-xs text-slate-500">
            Review pending facilities and inspect representative revision diffs.
          </p>
        </Link>

        <Link
          to="/admin/costs"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <IndianRupee className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">
            Cost Verification →
          </h4>
          <p className="text-xs text-slate-500">
            Approve or reject submitted procedure tariffs and price cards.
          </p>
        </Link>

        <Link
          to="/admin/reports"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-rose-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <FileText className="w-6 h-6 text-rose-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-700">
            Report Management →
          </h4>
          <p className="text-xs text-slate-500">
            Review user-flagged inaccuracies, investigate, and record resolution notes.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <Users className="w-6 h-6 text-sky-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-700">
            User & Rep Management →
          </h4>
          <p className="text-xs text-slate-500">
            Activate/suspend accounts and assign representatives to facilities.
          </p>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-card-hover transition-all space-y-2 group"
        >
          <History className="w-6 h-6 text-indigo-600" />
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700">
            Audit Trail & Logs →
          </h4>
          <p className="text-xs text-slate-500">
            Inspect immutable audit events recorded on administrative actions.
          </p>
        </Link>
      </div>
    </div>
  );
};
