import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Layers, Plus, Edit, Trash2, Loader2, X } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Consultations');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.getServices();
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setName('');
    setCategory('Consultations');
    setDescription('');
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: any) => {
    setEditingServiceId(svc.service_id);
    setName(svc.name);
    setCategory(svc.category);
    setDescription(svc.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingServiceId) {
        await api.updateService(editingServiceId, { name, category, description });
        toast('Service updated successfully.', 'success');
      } else {
        await api.createService({ name, category, description });
        toast('Service added to catalog.', 'success');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast(err.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this service from the catalog?')) return;
    try {
      await api.deleteService(id);
      toast('Service deleted.', 'info');
      fetchServices();
    } catch (err: any) {
      toast(err.message || 'Delete failed.', 'error');
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices =
    selectedCategory === 'ALL'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-8 h-8 text-brand-600" />
            <span>Healthcare Services Catalog Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            SRS Section 10: Configure standardized procedures, imaging scans, and consultations ({services.length} active).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Dynamic Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          Filter Category:
        </span>
        {categories.map((cat) => {
          const count =
            cat === 'ALL'
              ? services.length
              : services.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Services' : cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Offering Facilities</th>
                <th className="py-3.5 px-4">Cost Records</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading services catalog...</span>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No services found for selected category.
                  </td>
                </tr>
              ) : (
                filteredServices.map((svc) => (
                  <tr key={svc.service_id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-4 font-bold text-slate-900">{svc.name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                        {svc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-600 max-w-[300px]">
                      <p className="line-clamp-2">{svc.description || '—'}</p>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                      {svc.facility_count || 0} Facilities
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-emerald-700">
                      {svc.cost_records_count || 0} Tariffs
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(svc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(svc.service_id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete"
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

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingServiceId ? 'Edit Healthcare Service' : 'Add Healthcare Service'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. General Consultation, MRI Brain, CBC"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="Consultations">Consultations</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Advanced Imaging">Advanced Imaging (MRI/CT)</option>
                  <option value="Dental">Dental</option>
                  <option value="Therapy">Therapy & Rehabilitation</option>
                  <option value="Other">Other Healthcare Service</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Clinical Purpose
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the clinical procedure and expected outcomes..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
