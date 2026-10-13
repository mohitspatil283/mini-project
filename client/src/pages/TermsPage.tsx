import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Use</h1>
        <p className="text-sm text-slate-500">
          Effective: March 2026 • MediGuide Academic Demonstration Platform
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>1. Informational & Navigation Purpose</span>
          </h2>
          <p>
            Information shown on MediGuide is for navigation and informational purposes only. Approximate healthcare tariffs, timings, and availability may change without prior notice. Users must independently verify all final costs, medical appointments, and diagnostic protocols directly with the respective healthcare establishment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>2. No Emergency Replacement</span>
          </h2>
          <p>
            MediGuide is not an emergency dispatch system. If you are experiencing acute chest pain, trauma, stroke symptoms, or another medical crisis, immediately dial national emergency dispatch numbers (112 / 102) or proceed to the nearest emergency trauma center.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Demonstration Data Acknowledgment</h2>
          <p>
            This application is constructed for academic demonstration (B.Tech IT Mini-Project). Seeded records are labeled as demonstration data and should not be used as guaranteed medical or financial contracts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Community Conduct</h2>
          <p>
            Users agree not to submit fraudulent, malicious, or defamatory reports regarding healthcare facilities. Abuse of reporting mechanisms may result in account suspension.
          </p>
        </section>
      </div>
    </div>
  );
};
