import React from 'react';
import { ShieldCheck, Lock, MapPin, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-500">
          Last Updated: March 2026 • MediGuide Integrated Healthcare Navigation
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-brand-600" />
            <span>1. Zero Personal Health Records (PHR) Collection</span>
          </h2>
          <p>
            MediGuide is strictly a facility discovery and cost navigation tool. We <strong>do NOT collect, store, or process</strong> your medical diagnosis records, prescription slips, diagnostic scans, health insurance policy numbers, or personal medical histories.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            <span>2. How Location Data Is Used</span>
          </h2>
          <p>
            When you grant browser geolocation permission, your latitude and longitude coordinates are used ephemerally in-memory solely to compute travel distances via the mathematical Haversine formula and to filter facilities within your requested radius (1 km – 25 km). <strong>Your geographical coordinates are never permanently logged or tracked to your user profile.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-600" />
            <span>3. Account Information & Password Security</span>
          </h2>
          <p>
            When registering, we collect only your name, email address, optional contact phone, and an encrypted password hash. Passwords are salted and hashed using bcrypt; plaintext passwords are never stored or logged.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span>4. Community Reporting & Audit Logs</span>
          </h2>
          <p>
            Reports submitted on incorrect facility information are associated with your user ID to prevent spam and allow moderation tracking. Administrative decisions generate immutable audit events for platform security.
          </p>
        </section>
      </div>
    </div>
  );
};
