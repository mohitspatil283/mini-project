import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Layers, Search, ArrowRight, Building, CheckCircle2, Loader2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await api.getServices();
        if (res.success && res.data) {
          setServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-8 h-8 text-brand-600" />
            <span>Healthcare Services Catalog</span>
          </h1>
          <p className="text-sm text-slate-500">
            Browse standardized medical tests, diagnostic scans, and clinical consultations.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name or test..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-brand-500 text-slate-900"
          />
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
          <p className="text-sm">Loading service catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 p-6">
          <p className="font-semibold text-slate-700">No services match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((svc) => (
            <div
              key={svc.service_id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-300 transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                    {svc.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{svc.facility_count} Providers</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{svc.name}</h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {svc.description || 'Standardized healthcare procedure with transparent pricing available across certified centres.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700">
                  {svc.cost_records_count > 0
                    ? `${svc.cost_records_count} Pricing Tariffs`
                    : 'Cost upon inquiry'}
                </span>
                <Link
                  to={`/search?service=${encodeURIComponent(svc.name)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <span>Find Providers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
