import React, { useState, useEffect } from 'react';
import { useCompare } from '../context/CompareContext';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VerificationBadge } from '../components/VerificationBadge';
import {
  Scale,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CostComparisonPage: React.FC = () => {
  const { selectedFacilities, removeFacility, clearFacilities, toggleFacility } = useCompare();

  const [availableFacilities, setAvailableFacilities] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [allServices, setAllServices] = useState<any[]>([]);

  // Load available facilities to populate the "Add facility to compare" dropdown
  useEffect(() => {
    async function loadData() {
      try {
        const [facRes, svcRes] = await Promise.all([
          api.searchFacilities({ radius: 50 }),
          api.getServices(),
        ]);
        if (facRes.success && facRes.data) {
          setAvailableFacilities(facRes.data);
        }
        if (svcRes.success && svcRes.data) {
          setAllServices(svcRes.data);
        }
      } catch (err) {
        console.error('Failed to load comparison presets:', err);
      }
    }
    loadData();
  }, []);

  // Fetch comparison matrix whenever selected facilities change or service filter changes
  useEffect(() => {
    async function fetchComparison() {
      if (selectedFacilities.length < 2) {
        setComparisonData(null);
        return;
      }

      try {
        setLoading(true);
        const ids = selectedFacilities.map((f) => f.facility_id);
        const res = await api.compareCosts(
          ids,
          selectedServiceId ? parseInt(selectedServiceId, 10) : undefined
        );
        if (res.success) {
          setComparisonData(res);
        }
      } catch (err) {
        console.error('Fetch compare error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchComparison();
  }, [selectedFacilities, selectedServiceId]);

  const handleAddFacility = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    if (!id) return;
    const fac = availableFacilities.find((f) => f.facility_id === id);
    if (fac) {
      toggleFacility({
        facility_id: fac.facility_id,
        facility_name: fac.facility_name,
        facility_type: fac.facility_type,
        city: fac.city,
      });
    }
    e.target.value = '';
  };

  const loadPresetComparison = () => {
    // Select top Pune benchmark facilities
    const ruby = availableFacilities.find((f) => f.facility_name.includes('Ruby Hall'));
    const jupiter = availableFacilities.find((f) => f.facility_name.includes('Jupiter'));
    const sancheti = availableFacilities.find((f) => f.facility_name.includes('Sancheti'));

    clearFacilities();
    if (ruby) toggleFacility(ruby);
    if (jupiter) toggleFacility(jupiter);
    if (sancheti) toggleFacility(sancheti);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-8 h-8 text-brand-600" />
            <span>Healthcare Cost Comparison Matrix</span>
          </h1>
          <p className="text-sm text-slate-500">
            Compare approximate tariffs side-by-side across verified healthcare facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedFacilities.length < 2 && (
            <button
              onClick={loadPresetComparison}
              className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold transition-colors"
            >
              Load Pune Example (Ruby Hall vs Jupiter vs Sancheti)
            </button>
          )}

          {selectedFacilities.length > 0 && (
            <button
              onClick={clearFacilities}
              className="px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Comparison</span>
            </button>
          )}
        </div>
      </div>

      <DisclaimerBanner compact={true} />

      {/* Facility Selection Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selected Facilities ({selectedFacilities.length}/4):
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Add Facility Dropdown */}
            {selectedFacilities.length < 4 && (
              <div className="relative">
                <select
                  onChange={handleAddFacility}
                  defaultValue=""
                  className="py-2 px-3 pr-8 rounded-xl border border-brand-300 text-brand-900 bg-brand-50/60 font-semibold text-xs cursor-pointer focus:ring-1 focus:ring-brand-500"
                >
                  <option value="" disabled>
                    + Add Facility to Compare...
                  </option>
                  {availableFacilities
                    .filter(
                      (f) => !selectedFacilities.some((s) => s.facility_id === f.facility_id)
                    )
                    .map((fac) => (
                      <option key={fac.facility_id} value={fac.facility_id}>
                        {fac.facility_name} ({fac.facility_type})
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Filter by Specific Service */}
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-slate-800 bg-white font-medium text-xs focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Standard Services</option>
              {allServices.map((svc) => (
                <option key={svc.service_id} value={svc.service_id}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected chips row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {selectedFacilities.map((fac) => (
            <div
              key={fac.facility_id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{fac.facility_name}</span>
              <button
                onClick={() => removeFacility(fac.facility_id)}
                className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                title="Remove from comparison"
              >
                ✕
              </button>
            </div>
          ))}
          {selectedFacilities.length === 0 && (
            <p className="text-xs text-slate-400 italic">
              No facilities selected. Select at least 2 facilities to view side-by-side cost comparisons.
            </p>
          )}
        </div>
      </div>

      {/* Comparison View */}
      {selectedFacilities.length < 2 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Scale className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Select At Least 2 Facilities</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Use the dropdown above or check "Compare" on any facility card in the directory to compare service rates.
            </p>
          </div>
          <button
            onClick={loadPresetComparison}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Load Example Comparison Matrix
          </button>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <p className="font-semibold text-slate-600">Calculating cost comparisons...</p>
        </div>
      ) : comparisonData ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200">
                  <th className="py-4 px-5 text-xs font-bold uppercase text-slate-500 w-1/4">
                    Healthcare Service
                  </th>
                  {comparisonData.facilities.map((fac: any) => (
                    <th key={fac.facility_id} className="py-4 px-5 min-w-[220px]">
                      <div className="space-y-1">
                        <Link
                          to={`/facility/${fac.facility_id}`}
                          className="font-extrabold text-slate-900 hover:text-brand-700 text-base leading-snug line-clamp-1"
                        >
                          {fac.facility_name}
                        </Link>
                        <p className="text-xs text-slate-500 font-medium">{fac.city}</p>
                        <VerificationBadge status={fac.status} size="sm" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData.matrix.map((row: any) => (
                  <tr key={row.service_id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-5 align-top">
                      <p className="font-bold text-slate-900">{row.service_name}</p>
                      <p className="text-xs text-slate-400 font-medium">{row.service_category}</p>
                    </td>

                    {comparisonData.facilities.map((fac: any) => {
                      const item = row.facilities[fac.facility_id];

                      if (!item || !item.offered) {
                        return (
                          <td key={fac.facility_id} className="py-4 px-5 align-top text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                              Service not offered
                            </span>
                          </td>
                        );
                      }

                      if (!item.cost_available) {
                        return (
                          <td key={fac.facility_id} className="py-4 px-5 align-top text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1 text-slate-400 italic">
                              Cost information unavailable
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={fac.facility_id} className="py-4 px-5 align-top space-y-1">
                          <p className="text-base font-extrabold text-emerald-700">
                            {item.formatted_cost}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            Unit: {item.unit_basis}
                          </p>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <VerificationBadge status={item.verification_status} size="sm" />
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]" title={item.source}>
                            Source: {item.source}
                          </p>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Disclaimer */}
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <p>
              Note: Rates shown reflect approximate tariff ranges collected through official publications and facility representatives.
            </p>
            <span className="font-semibold text-slate-600">INR (₹) Standardized</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
