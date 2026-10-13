import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { VerificationBadge } from '../../components/VerificationBadge';
import { ArrowLeft, Clock, CheckCircle2, XCircle, FileText, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RepRevisionsPage: React.FC = () => {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRevisions() {
      try {
        const res = await api.getRepRevisions();
        if (res.success && res.data) {
          setRevisions(res.data);
        }
      } catch (err) {
        console.error('Failed to load revisions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRevisions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/rep/dashboard" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">Submitted Revisions</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-brand-600" />
          <span>Submitted Facility Revisions</span>
        </h1>
        <p className="text-sm text-slate-500">
          History of all profile modification submissions and administrative verification verdicts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
          <p className="text-sm">Loading revision history...</p>
        </div>
      ) : revisions.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-700">No revisions submitted yet</p>
          <Link
            to="/rep/facility"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs"
          >
            Propose Facility Update
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {revisions.map((rev) => {
            const proposed = JSON.parse(rev.proposed_data || '{}');
            const existing = JSON.parse(rev.existing_data || '{}');

            return (
              <div
                key={rev.revision_id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Revision Ticket #{rev.revision_id}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Submitted on {new Date(rev.created_at).toLocaleString()}
                    </p>
                  </div>
                  <VerificationBadge status={rev.status} size="md" />
                </div>

                {/* Diff Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Original Live Data
                    </span>
                    <pre className="text-slate-700 font-mono text-[11px] whitespace-pre-wrap">
                      {JSON.stringify(existing, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200 space-y-2">
                    <span className="font-bold text-brand-700 uppercase tracking-wider text-[10px]">
                      Proposed Changes Submitted
                    </span>
                    <pre className="text-brand-900 font-mono text-[11px] whitespace-pre-wrap">
                      {JSON.stringify(proposed, null, 2)}
                    </pre>
                  </div>
                </div>

                {rev.review_notes && (
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs space-y-1">
                    <span className="font-bold">Admin Review Notes:</span>
                    <p>{rev.review_notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
