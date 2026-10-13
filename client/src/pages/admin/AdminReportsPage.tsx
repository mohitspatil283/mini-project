import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Loader2,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const AdminReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'ALL');

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const urlCategory = searchParams.get('category');
    if (urlStatus) setStatusFilter(urlStatus);
    if (urlCategory) setCategoryFilter(urlCategory);
  }, [searchParams]);

  // Resolution Modal State
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [modalStatus, setModalStatus] = useState('RESOLVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminReports({
        status: statusFilter,
        category: categoryFilter,
      });
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter, categoryFilter]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      setSubmitting(true);
      const res = await api.updateReportStatus(selectedReport.report_id, modalStatus, adminNotes);
      if (res.success) {
        toast(`Report status updated to ${modalStatus}.`, 'success');
        setSelectedReport(null);
        fetchReports();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to update report status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusPill = (status: string) => {
    const map: Record<string, string> = {
      OPEN: 'bg-amber-50 text-amber-800 border-amber-200',
      UNDER_REVIEW: 'bg-sky-50 text-sky-800 border-sky-200',
      RESOLVED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      REJECTED: 'bg-rose-50 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          map[status] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-rose-600" />
            <span>Community Report Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SRS Section 19: Review user-reported inaccuracies in operating hours, numbers, or prices.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Statuses ({reports.length})</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="INCORRECT_ADDRESS">Address</option>
            <option value="INCORRECT_PHONE">Phone</option>
            <option value="INCORRECT_HOURS">Operating Hours</option>
            <option value="INCORRECT_SERVICE">Service</option>
            <option value="INCORRECT_COST">Cost</option>
            <option value="DUPLICATE_FACILITY">Duplicate</option>
            <option value="NO_LONGER_OPERATING">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Facility Affected</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading reports queue...</span>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No community reports found.
                  </td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.report_id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <Link
                        to={`/facility/${rep.facility.facility_id}`}
                        className="hover:text-brand-700 flex items-center gap-1"
                      >
                        <span>{rep.facility.facility_name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <p className="text-[10px] text-slate-400">{rep.facility.city}</p>
                    </td>

                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                      {rep.category.replace(/_/g, ' ')}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-700 max-w-[280px]">
                      <p className="line-clamp-2 italic">"{rep.description}"</p>
                      {rep.admin_notes && (
                        <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                          Admin note: {rep.admin_notes}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      <p className="font-semibold text-slate-800">{rep.reporter?.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rep.created_at).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="py-4 px-4">{getStatusPill(rep.status)}</td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setModalStatus(rep.status === 'OPEN' ? 'RESOLVED' : rep.status);
                          setAdminNotes(rep.admin_notes || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                      >
                        Update / Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Resolve Report #{selectedReport.report_id}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Facility: {selectedReport.facility?.facility_name}
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  User Submitted Issue:
                </span>
                <p className="text-slate-700 italic">"{selectedReport.description}"</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Change Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="OPEN">Open (Pending)</option>
                  <option value="UNDER_REVIEW">Under Active Review</option>
                  <option value="RESOLVED">Resolved (Issue Fixed / Verified)</option>
                  <option value="REJECTED">Rejected (False Report / Inaccurate Claim)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Administrator Resolution Notes (Visible to Reporter)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified with facility liaison and updated emergency telephone number."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Updating...' : 'Save Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
