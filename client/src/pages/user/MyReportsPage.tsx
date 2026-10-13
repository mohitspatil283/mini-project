import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { FileText, ArrowLeft, Loader2, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await api.getMyReports();
        if (res.success && res.data) {
          setReports(res.data);
        }
      } catch (err) {
        console.error('Failed to load user reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Open (Pending Review)</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Under Active Review</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resolved</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return <span className="text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/user/dashboard" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">My Reports</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-sky-600" />
          <span>My Data Accuracy Reports</span>
        </h1>
        <p className="text-sm text-slate-500">
          Track the review status and administrative resolution notes of your submitted reports.
        </p>
      </div>

      <DisclaimerBanner compact={true} />

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
          <p className="text-sm">Loading submitted reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Reports Filed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't submitted any reports. If you notice incorrect phone numbers, addresses, or costs while searching, use the "Report Issue" button.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.report_id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    <Link
                      to={`/facility/${rep.facility.facility_id}`}
                      className="hover:text-brand-700"
                    >
                      {rep.facility.facility_name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Category: <span className="font-semibold text-slate-700">{rep.category.replace(/_/g, ' ')}</span> • Submitted on{' '}
                    {new Date(rep.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>{getStatusBadge(rep.status)}</div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Report Description
                </p>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {rep.description}
                </p>
              </div>

              {rep.admin_notes && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    Administrator Response & Resolution Notes:
                  </span>
                  <p>{rep.admin_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
