import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Mandatory Healthcare Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          MediGuide Medical Information & Navigation Disclaimer
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Please review the following non-negotiable legal, clinical, and informational boundaries governing all content displayed on MediGuide.
        </p>
      </div>

      {/* Core Disclaimer Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-amber-700 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-extrabold">Primary Regulatory Statement</h2>
        </div>
        <p className="text-base sm:text-lg font-semibold leading-relaxed">
          "Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges with the healthcare facility."
        </p>
      </div>

      {/* What MediGuide DOES NOT DO */}
      <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">What MediGuide Explicitly Does NOT Do</h3>
            <p className="text-xs text-slate-500">Strict system boundaries mandated by the SRS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>Does NOT Diagnose Diseases:</strong> MediGuide contains no clinical diagnosis engines or symptom checkers.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>Does NOT Prescribe Medicines:</strong> No pharmaceutical prescriptions or medication regimens are dispensed.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>Does NOT Replace Doctors:</strong> Always consult licensed medical doctors for therapeutic care.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>Does NOT Replace Emergency Services:</strong> In life-threatening emergencies, dial national emergency numbers (e.g. 112 / 102 / 108).</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>No Clinical Decision-Making:</strong> We do not provide triage or algorithmic clinical advice.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span><strong>Does NOT Process Billing or Payments:</strong> We do not collect medical fees or handle billing transactions.</span>
          </div>
        </div>
      </div>

      {/* What MediGuide DOES DO */}
      <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">What MediGuide Provides</h3>
            <p className="text-xs text-slate-500">Core navigation and pricing transparency objective</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Search verified hospitals, clinics, labs, and pharmacies</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Geographical Haversine distance calculations (1–25 km)</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Explore approximate test and consultation cost ranges</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Side-by-side facility tariff comparisons</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Save frequently visited healthcare providers</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Community reporting of outdated timings or phone numbers</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 text-center">
        <Link
          to="/search"
          className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all inline-block"
        >
          I Understand — Proceed to Healthcare Directory
        </Link>
      </div>
    </div>
  );
};
