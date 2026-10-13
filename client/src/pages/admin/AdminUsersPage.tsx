import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, ShieldCheck, Building2, UserX, UserCheck, Loader2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const AdminUsersPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'ALL');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const urlRole = searchParams.get('role');
    const urlSearch = searchParams.get('search');
    if (urlRole) setRoleFilter(urlRole);
    if (urlSearch !== null && urlSearch !== undefined) setSearch(urlSearch);
  }, [searchParams]);

  // Assign Rep Modal
  const [assignModalUser, setAssignModalUser] = useState<any | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [uRes, fRes] = await Promise.all([
        api.getAdminUsers({ role: roleFilter, search }),
        api.getAdminFacilities({ status: 'ALL' }),
      ]);
      if (uRes.success && uRes.data) setUsers(uRes.data);
      if (fRes.success && fRes.data) setFacilities(fRes.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const handleToggleStatus = async (user: any) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await api.updateUserStatus(user.user_id, nextStatus);
      if (res.success) {
        toast(`User account marked as ${nextStatus}.`, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      toast(err.message || 'Status change failed.', 'error');
    }
  };

  const handleAssignRepresentative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalUser) return;
    try {
      setSubmitting(true);
      const res = await api.assignRepresentative(
        assignModalUser.user_id,
        selectedFacilityId ? parseInt(selectedFacilityId, 10) : null
      );
      if (res.success) {
        toast(res.message, 'success');
        setAssignModalUser(null);
        fetchUsers();
      }
    } catch (err: any) {
      toast(err.message || 'Assignment failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-sky-600" />
            <span>User & Representative Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SRS Section 20: Control account activation, view roles, and assign facility representatives.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="USER">Registered Users</option>
            <option value="FACILITY_REPRESENTATIVE">Facility Representatives</option>
            <option value="ADMIN">Administrators</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User Name & Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Healthcare Facility</th>
                <th className="py-3.5 px-4">Activity Stats</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading users directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleColors: Record<string, string> = {
                    ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    FACILITY_REPRESENTATIVE: 'bg-sky-50 text-sky-700 border-sky-200',
                    USER: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <tr key={u.user_id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <p>{u.name}</p>
                        <p className="text-xs text-slate-400 font-normal">{u.email}</p>
                        {u.phone && <p className="text-[10px] text-slate-400">{u.phone}</p>}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border ${
                            roleColors[u.role] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                        {u.assigned_facility ? (
                          <span className="text-brand-700 font-bold">
                            {u.assigned_facility.facility_name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-500">
                        <p>{u.saved_count || 0} Bookmarks</p>
                        <p>{u.reports_count || 0} Reports</p>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right space-x-1.5">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => {
                              setAssignModalUser(u);
                              setSelectedFacilityId(
                                u.assigned_facility?.facility_id
                                  ? String(u.assigned_facility.facility_id)
                                  : ''
                              );
                            }}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs"
                          >
                            Assign Facility
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                            u.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility Representative Assignment Modal */}
      {assignModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setAssignModalUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Assign Facility Representative
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Designate <span className="font-bold text-slate-800">{assignModalUser.name}</span> as the representative for an organization.
            </p>

            <form onSubmit={handleAssignRepresentative} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Healthcare Facility
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="">None (Unassign / Revert to Normal User)</option>
                  {facilities.map((fac) => (
                    <option key={fac.facility_id} value={fac.facility_id}>
                      {fac.facility_name} ({fac.city})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Assigning a facility grants this user access to the Facility Representative Dashboard. They will only be authorized to update their assigned facility.
              </p>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAssignModalUser(null)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
