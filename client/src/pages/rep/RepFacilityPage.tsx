import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { Building2, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RepFacilityPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [facility, setFacility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Editable fields
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getRepDashboard();
        if (res.success && res.data) {
          const fac = res.data.facility;
          setFacility(fac);
          setPhone(fac.phone || '');
          setEmail(fac.email || '');
          setOperatingHours(fac.operating_hours || '');
          setAddress(fac.address || '');
        }
      } catch (err: any) {
        toast('Unable to load assigned facility details.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.proposeRepUpdate({
        phone,
        email,
        operating_hours: operatingHours,
        address,
      });

      if (res.success) {
        toast('Revision submitted successfully! An administrator will review your changes.', 'success');
        navigate('/rep/revisions');
      }
    } catch (err: any) {
      toast(err.message || 'Failed to submit update.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading facility details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/rep/dashboard" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">Propose Facility Update</span>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-8 h-8 text-brand-600" />
          <span>Propose Facility Update</span>
        </h1>
        <p className="text-sm text-slate-500">
          Organization: <span className="font-bold text-slate-800">{facility?.facility_name}</span>
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Revision Moderation Workflow:</span> In accordance with SRS Section 15 & 18, modifications to verified contact numbers, operating hours, and addresses do not silently replace live data. They generate a versioned revision entry for administrator review.
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Telephone / Emergency Hotline
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Operating Hours Description
            </label>
            <input
              type="text"
              required
              value={operatingHours}
              onChange={(e) => setOperatingHours(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Physical Street Address
            </label>
            <textarea
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
            />
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
              <span>{submitting ? 'Submitting Revision...' : 'Submit Proposed Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
