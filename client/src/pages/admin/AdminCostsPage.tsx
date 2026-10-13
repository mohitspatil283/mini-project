import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { VerificationBadge } from '../../components/VerificationBadge';
import { useToast } from '../../context/ToastContext';
import { IndianRupee, Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const AdminCostsPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [costs, setCosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus) setStatusFilter(urlStatus);
  }, [searchParams]);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCosts({ status: statusFilter });
      if (res.success && res.data) {
        setCosts(res.data);
      }
    } catch (err) {
      console.error('Failed to load costs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, [statusFilter]);

  const handleVerify = async (costId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await api.verifyCostRecord(costId, action);
      if (res.success) {
        toast(`Cost record status updated to ${action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'}.`, 'success');
        fetchCosts();
      }
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <IndianRupee className="w-8 h-8 text-emerald-600" />
            <span>Healthcare Cost Tariff Verification</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and moderate healthcare pricing submissions to ensure cost transparency compliance.
          </p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer self-start sm:self-auto"
        >
          <option value="ALL">All Tariffs ({costs.length})</option>
          <option value="PENDING">Pending Moderation</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Facility</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Approximate Cost</th>
                <th className="py-3.5 px-4">Unit Basis</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading tariffs database...</span>
                  </td>
                </tr>
              ) : costs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No cost records found for this filter.
                  </td>
                </tr>
              ) : (
                costs.map((c) => (
                  <tr key={c.cost_id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <Link
                        to={`/facility/${c.facility.facility_id}`}
                        className="hover:text-brand-700"
                      >
                        {c.facility.facility_name}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-medium">{c.facility.city}</p>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-800">{c.service.name}</td>

                    <td className="py-4 px-4 font-extrabold text-emerald-700 text-sm">
                      {c.amount_min === c.amount_max
                        ? `₹${c.amount_min.toLocaleString('en-IN')}`
                        : `₹${c.amount_min.toLocaleString('en-IN')} – ₹${c.amount_max.toLocaleString('en-IN')}`}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">{c.unit_basis}</td>

                    <td className="py-4 px-4 text-xs text-slate-500 max-w-[180px] truncate" title={c.source}>
                      {c.source}
                    </td>

                    <td className="py-4 px-4">
                      <VerificationBadge status={c.verification_status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right space-x-1.5">
                      {c.verification_status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerify(c.cost_id, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                        >
                          Verify
                        </button>
                      )}
                      {c.verification_status !== 'REJECTED' && (
                        <button
                          onClick={() => handleVerify(c.cost_id, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
