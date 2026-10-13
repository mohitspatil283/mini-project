import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { History, Search, Shield, Filter, Loader2 } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAuditLogs({ action: actionFilter || undefined });
      if (res.success && res.data) {
        setLogs(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const getActionColor = (action: string) => {
    if (action.includes('VERIFY') || action.includes('APPROVE')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('REJECT') || action.includes('DELETE') || action.includes('SUSPEND')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('LOGIN') || action.includes('REGISTER')) {
      return 'bg-sky-50 text-sky-700 border-sky-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-8 h-8 text-indigo-600" />
            <span>Platform Compliance Audit Logs</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SRS Section 36: Immutable database log of all administrative moderation, verification, and role events.
          </p>
        </div>

        {/* Action Filter */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer self-start sm:self-auto"
        >
          <option value="">All Actions ({total})</option>
          <option value="USER_LOGIN">User Logins</option>
          <option value="USER_REGISTER">User Registrations</option>
          <option value="FACILITY_VERIFY">Facility Verifications</option>
          <option value="FACILITY_REJECT">Facility Rejections</option>
          <option value="FACILITY_CREATE">Facility Creations</option>
          <option value="REVISION_SUBMIT">Revision Submissions</option>
          <option value="REVISION_APPROVE">Revision Approvals</option>
          <option value="COST_SUBMIT">Cost Submissions</option>
          <option value="COST_VERIFY">Cost Verifications</option>
          <option value="REPORT_SUBMIT">Report Submissions</option>
          <option value="REPORT_RESOLVE">Report Resolutions</option>
          <option value="REP_ASSIGNED">Representative Assignments</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor / User</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Event Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                    No audit records found matching this filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs">
                      {log.user ? (
                        <div>
                          <p className="font-bold text-slate-900">{log.user.name}</p>
                          <p className="text-[10px] text-slate-400">{log.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System / Unauthenticated</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-sans text-xs">
                      <span className="font-semibold text-slate-800">{log.entity}</span>
                      <span className="text-slate-400 ml-1">#{log.entity_id}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-[320px] truncate" title={log.metadata}>
                      {log.metadata || '—'}
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
