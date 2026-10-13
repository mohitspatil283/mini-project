import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const CompareFloatingBar: React.FC = () => {
  const { selectedFacilities, removeFacility, clearFacilities } = useCompare();

  if (selectedFacilities.length === 0) return null;

  return (
    <aside
      aria-label="Cost Comparison Floating Bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl bg-slate-900/95 text-white backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Cost Comparison
              </span>
              <span className="text-[11px] text-slate-400">
                ({selectedFacilities.length}/4 selected)
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar py-0.5">
              {selectedFacilities.map((f) => (
                <span
                  key={f.facility_id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700 whitespace-nowrap"
                >
                  <span className="truncate max-w-[100px] sm:max-w-[140px]">{f.facility_name}</span>
                  <button
                    onClick={() => removeFacility(f.facility_id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clearFacilities}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
