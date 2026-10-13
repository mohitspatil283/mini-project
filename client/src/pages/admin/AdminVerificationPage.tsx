import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { VerificationBadge } from '../../components/VerificationBadge';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  User,
  ArrowRight,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminVerificationPage: React.FC = () => {
  const { toast } = useToast();
  const [queue, setQueue] = useState<any>({ pending_facilities: [], pending_revisions: [] });
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await api.getVerificationQueue();
      if (res.success && res.data) {
        setQueue(res.data);
      }
    } catch (err) {
      console.error('Failed to load verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleFacilityAction = async (facilityId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await api.verifyFacility(facilityId, action);
      if (res.success) {
        toast(`Facility status updated to ${action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'}.`, 'success');
        fetchQueue();
      }
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error');
    }
  };

  const handleRevisionAction = async (
    revisionId: number,
    action: 'APPROVE' | 'REJECT' | 'CORRECTION_REQUESTED'
  ) => {
    try {
      const res = await api.reviewRevision(revisionId, action);
      if (res.success) {
        toast(res.message, 'success');
        fetchQueue();
      }
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Clock className="w-8 h-8 text-amber-500" />
          <span>Verification & Moderation Queue</span>
        </h1>
        <p className="text-sm text-slate-500">
          SRS Section 18 Workflow: Inspect proposed changes, compare diffs, and approve or reject submissions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
          <p className="text-sm">Loading moderation queue...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Pending Facility Registrations */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <span>Pending New Facilities ({queue.pending_facilities.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  New healthcare facilities submitted requiring license and physical location verification.
                </p>
              </div>
            </div>

            {queue.pending_facilities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No new facilities currently pending verification.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queue.pending_facilities.map((fac: any) => (
                  <div
                    key={fac.facility_id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {fac.facility_type.replace('_', ' ')}
                      </span>
                      <VerificationBadge status="PENDING" size="sm" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{fac.facility_name}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        📍 {fac.address}, {fac.city} — {fac.pincode}
                      </p>
                      <p className="text-xs text-slate-600">📞 {fac.phone}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-amber-200/60">
                      <button
                        onClick={() => handleFacilityAction(fac.facility_id, 'REJECT')}
                        className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 font-bold text-xs"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleFacilityAction(fac.facility_id, 'APPROVE')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Facility Representative Revisions */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-brand-600" />
                  <span>Pending Representative Revisions ({queue.pending_revisions.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Review side-by-side diff of proposed changes against live facility data.
                </p>
              </div>
            </div>

            {queue.pending_revisions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No representative revisions awaiting review.
              </div>
            ) : (
              <div className="space-y-6">
                {queue.pending_revisions.map((rev: any) => {
                  const proposed = JSON.parse(rev.proposed_data || '{}');
                  const existing = JSON.parse(rev.existing_data || '{}');

                  return (
                    <div
                      key={rev.revision_id}
                      className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">
                            Revision #{rev.revision_id} — {rev.facility?.facility_name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Submitted by: {rev.submitter?.name} ({rev.submitter?.email}) on{' '}
                            {new Date(rev.created_at).toLocaleString()}
                          </p>
                        </div>
                        <VerificationBadge status={rev.status} size="sm" />
                      </div>

                      {/* Side-by-side Diff Table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                            Existing Live Data
                          </span>
                          <pre className="font-mono text-slate-700 whitespace-pre-wrap text-[11px]">
                            {JSON.stringify(existing, null, 2)}
                          </pre>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 space-y-2">
                          <span className="font-bold text-brand-700 uppercase tracking-wider text-[10px]">
                            Proposed Updated Information
                          </span>
                          <pre className="font-mono text-brand-900 whitespace-pre-wrap text-[11px]">
                            {JSON.stringify(proposed, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                          onClick={() =>
                            handleRevisionAction(rev.revision_id, 'CORRECTION_REQUESTED')
                          }
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
                        >
                          Request Correction
                        </button>
                        <button
                          onClick={() => handleRevisionAction(rev.revision_id, 'REJECT')}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleRevisionAction(rev.revision_id, 'APPROVE')}
                          className="px-5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
                        >
                          Approve & Apply to Facility
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
