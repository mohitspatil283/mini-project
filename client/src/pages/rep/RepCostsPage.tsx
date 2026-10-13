import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { IndianRupee, ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RepCostsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [serviceId, setServiceId] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [unitBasis, setUnitBasis] = useState('per consultation');
  const [source, setSource] = useState('Official Facility Tariff Schedule');

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.getServices();
        if (res.success && res.data) {
          setServices(res.data);
          if (res.data.length > 0) {
            setServiceId(String(res.data[0].service_id));
          }
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const min = parseFloat(amountMin);
    const max = parseFloat(amountMax);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
      toast('Please enter valid non-negative cost amounts.', 'error');
      return;
    }

    // TC-COST-02 Frontend Check: min <= max
    if (min > max) {
      toast('Validation Error: Minimum cost cannot be greater than maximum cost.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitCost({
        facility_id: user?.assigned_facility?.facility_id,
        service_id: parseInt(serviceId, 10),
        amount_min: min,
        amount_max: max,
        currency: 'INR',
        unit_basis: unitBasis,
        source,
      });

      if (res.success) {
        toast('Cost record submitted successfully! Queued for verification.', 'success');
        navigate('/rep/dashboard');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to submit cost record.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/rep/dashboard" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">Submit Cost Information</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <IndianRupee className="w-8 h-8 text-brand-600" />
          <span>Submit Service Cost Record</span>
        </h1>
        <p className="text-sm text-slate-500">
          Organization: <span className="font-bold text-slate-800">{user?.assigned_facility?.facility_name}</span>
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Healthcare Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {services.map((s) => (
                <option key={s.service_id} value={s.service_id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Approximate Cost (₹ INR)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="e.g. 500"
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Approximate Cost (₹ INR)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="e.g. 800 (or 500 if fixed)"
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            * For fixed cost items, enter the same amount in both fields (e.g. Min: 500, Max: 500).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unit / Billing Basis
              </label>
              <select
                value={unitBasis}
                onChange={(e) => setUnitBasis(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="per consultation">per consultation</option>
                <option value="per test">per test</option>
                <option value="per scan">per scan / view</option>
                <option value="per profile">per comprehensive profile</option>
                <option value="per evaluation">per clinical evaluation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Data Source / Reference
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Link
              to="/rep/dashboard"
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Cost Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
