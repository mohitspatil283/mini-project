import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { VerificationBadge } from '../../components/VerificationBadge';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Edit,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const AdminFacilitiesPage: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'ALL');

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const urlType = searchParams.get('type');
    if (urlStatus) setStatusFilter(urlStatus);
    if (urlType) setTypeFilter(urlType);
  }, [searchParams]);

  // Add Facility Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newFacility, setNewFacility] = useState({
    facility_name: '',
    facility_type: 'HOSPITAL',
    address: '',
    locality: 'Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    latitude: 18.5204,
    longitude: 73.8567,
    phone: '',
    email: '',
    operating_hours: '24 Hours Open',
    status: 'VERIFIED',
  });

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminFacilities({
        status: statusFilter,
        type: typeFilter,
        search,
      });
      if (res.success && res.data) {
        setFacilities(res.data);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [statusFilter, typeFilter, search]);

  // TC-ADMIN-01: Verify or Reject facility
  const handleVerify = async (facilityId: number, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await api.verifyFacility(facilityId, action);
      if (res.success) {
        toast(`Facility status updated to ${action === 'APPROVE' ? 'VERIFIED' : 'REJECTED'}.`, 'success');
        fetchFacilities();
      }
    } catch (err: any) {
      toast(err.message || 'Verification update failed.', 'error');
    }
  };

  const handleDelete = async (facilityId: number, archiveOnly = false) => {
    const confirmMsg = archiveOnly
      ? 'Archive this facility listing?'
      : 'Permanently delete this facility record from the database?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.deleteFacility(facilityId, archiveOnly);
      if (res.success) {
        toast(archiveOnly ? 'Facility archived.' : 'Facility deleted successfully.', 'info');
        fetchFacilities();
      }
    } catch (err: any) {
      toast(err.message || 'Action failed.', 'error');
    }
  };

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.createFacility(newFacility);
      if (res.success) {
        toast('Facility created successfully.', 'success');
        setAddModalOpen(false);
        fetchFacilities();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to create facility.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-8 h-8 text-brand-600" />
            <span>Facility Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain, verify, approve, and audit all healthcare providers registered on MediGuide.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facility name, address, or city..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending Moderation</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="HOSPITAL">Hospitals</option>
            <option value="CLINIC">Clinics</option>
            <option value="PHARMACY">Pharmacies</option>
            <option value="DIAGNOSTIC_CENTRE">Diagnostic</option>
            <option value="BLOOD_CENTRE">Blood Centres</option>
            <option value="LABORATORY">Laboratories</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-400">
          Showing {facilities.length} records
        </span>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Facility Name & Type</th>
                <th className="py-3.5 px-4">Address & City</th>
                <th className="py-3.5 px-4">Phone / Contact</th>
                <th className="py-3.5 px-4">Services / Costs</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading facilities database...</span>
                  </td>
                </tr>
              ) : facilities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No facilities found matching your filters.
                  </td>
                </tr>
              ) : (
                facilities.map((fac) => (
                  <tr key={fac.facility_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <Link
                        to={`/facility/${fac.facility_id}`}
                        className="hover:text-brand-700 flex items-center gap-1.5"
                      >
                        <span>{fac.facility_name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <span className="inline-block mt-0.5 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {fac.facility_type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 max-w-[200px]">
                      <p className="truncate">{fac.address}</p>
                      <p className="text-slate-400 font-medium">
                        {fac.city}, {fac.state}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-700 font-medium">
                      <p>{fac.phone}</p>
                      <p className="text-[10px] text-slate-400 truncate">{fac.operating_hours}</p>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      <p>{fac._count?.facility_services || 0} Services</p>
                      <p className="text-emerald-700 font-semibold">
                        {fac._count?.cost_records || 0} Tariffs
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <VerificationBadge status={fac.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-right space-x-1">
                      {fac.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerify(fac.facility_id, 'APPROVE')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                          title="Verify Facility"
                        >
                          Verify
                        </button>
                      )}

                      {fac.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleVerify(fac.facility_id, 'REJECT')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
                          title="Reject Listing"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(fac.facility_id, true)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(fac.facility_id, false)}
                        className="p-1 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Facility Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Healthcare Facility</h3>

            <form onSubmit={handleCreateFacility} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  required
                  value={newFacility.facility_name}
                  onChange={(e) =>
                    setNewFacility({ ...newFacility, facility_name: e.target.value })
                  }
                  placeholder="e.g. City LifeCare Hospital"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Facility Category
                  </label>
                  <select
                    value={newFacility.facility_type}
                    onChange={(e) =>
                      setNewFacility({ ...newFacility, facility_type: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="HOSPITAL">Hospital</option>
                    <option value="CLINIC">Clinic</option>
                    <option value="PHARMACY">Pharmacy</option>
                    <option value="DIAGNOSTIC_CENTRE">Diagnostic Centre</option>
                    <option value="BLOOD_CENTRE">Blood Centre</option>
                    <option value="LABORATORY">Laboratory</option>
                    <option value="OTHER">Other Healthcare Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newFacility.status}
                    onChange={(e) => setNewFacility({ ...newFacility, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="VERIFIED">Verified (Direct Publish)</option>
                    <option value="PENDING">Pending Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  required
                  value={newFacility.address}
                  onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                  placeholder="Plot/Shop, Street, Area"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newFacility.city}
                    onChange={(e) => setNewFacility({ ...newFacility, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={newFacility.state}
                    onChange={(e) => setNewFacility({ ...newFacility, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={newFacility.pincode}
                    onChange={(e) => setNewFacility({ ...newFacility, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newFacility.latitude}
                    onChange={(e) =>
                      setNewFacility({ ...newFacility, latitude: parseFloat(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newFacility.longitude}
                    onChange={(e) =>
                      setNewFacility({ ...newFacility, longitude: parseFloat(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={newFacility.phone}
                    onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={newFacility.operating_hours}
                    onChange={(e) =>
                      setNewFacility({ ...newFacility, operating_hours: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
