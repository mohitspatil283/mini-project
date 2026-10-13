import React from 'react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { HeartPulse, ShieldCheck, Scale, Compass, CheckCircle2, Users, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <HeartPulse className="w-4 h-4 text-brand-600" />
          <span>Integrated Healthcare Navigation & Cost Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Empowering Patients with Transparent Healthcare Discovery
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          MediGuide addresses the critical challenge of opaque out-of-pocket healthcare pricing and fragmented facility information in urban centres.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6 text-brand-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Precision Navigation</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Quickly locate hospitals, polyclinics, diagnostic imaging centres, blood centres, and 24/7 pharmacies within 1 km to 25 km using mathematical Haversine coordinates.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. Tariff Transparency</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Eliminate unexpected hospital bill shock by providing verified approximate cost ranges (e.g. ₹500 fixed consultation, ₹6,500–₹9,500 MRI) before booking appointments.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Verified Quality</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Data accuracy is upheld through administrator verification queues, authorized facility representative accounts, and audit logging on every update.
          </p>
        </div>
      </div>

      {/* Role Architecture */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            RBAC Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Four Dedicated Role Perspectives
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold uppercase text-[10px]">
              Guest
            </span>
            <p className="font-bold text-slate-900 text-sm">Public Searcher</p>
            <p className="text-slate-600 leading-relaxed">
              Search facilities, filter by distance, view public facility profiles, check cost ranges, and compare options without logging in.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2">
            <span className="px-2 py-0.5 rounded bg-brand-200 text-brand-900 font-bold uppercase text-[10px]">
              Registered User
            </span>
            <p className="font-bold text-slate-900 text-sm">Patient Seeker</p>
            <p className="text-slate-600 leading-relaxed">
              Bookmark favorite hospitals, submit inaccurate information reports, monitor report resolution statuses, and manage profile settings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
            <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold uppercase text-[10px]">
              Facility Rep
            </span>
            <p className="font-bold text-slate-900 text-sm">Hospital Liaison</p>
            <p className="text-slate-600 leading-relaxed">
              Strictly manage assigned facility, submit updated service offerings, enter verified tariffs, and track revision approvals.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 font-bold uppercase text-[10px]">
              Administrator
            </span>
            <p className="font-bold text-slate-900 text-sm">Platform Admin</p>
            <p className="text-slate-600 leading-relaxed">
              Review verification queue, approve facility revisions, verify cost records, resolve community reports, manage users, and inspect audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Policy Section */}
      <div id="verification-policy" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight">Administrative Verification Policy</h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          The "Verified Facility" badge signifies that platform administrators have validated the facility's physical address, operational phone contact, and licensing registration against official records. It does NOT represent a medical endorsement, clinical rating, or guarantee of health outcomes.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-300">
          <span>• 100% relational database persistence</span>
          <span>• Full immutable audit event logs</span>
          <span>• Community quality moderation</span>
        </div>
      </div>
    </div>
  );
};
