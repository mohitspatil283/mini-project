import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Medi<span className="text-brand-400">Guide</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Integrated Healthcare Navigation and Cost Transparency Platform. Helping patients and families discover verified healthcare facilities, explore approximate service pricing, and navigate care with confidence.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-brand-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Academic Demonstration Release • B.Tech IT Project
            </div>
          </div>

          {/* Healthcare Facilities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Facilities
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search?category=HOSPITAL" className="hover:text-white transition-colors">
                  Multi-Speciality Hospitals
                </Link>
              </li>
              <li>
                <Link to="/search?category=CLINIC" className="hover:text-white transition-colors">
                  Polyclinics & Primary Care
                </Link>
              </li>
              <li>
                <Link to="/search?category=PHARMACY" className="hover:text-white transition-colors">
                  24x7 Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/search?category=DIAGNOSTIC_CENTRE" className="hover:text-white transition-colors">
                  Diagnostic Centres
                </Link>
              </li>
              <li>
                <Link to="/search?category=BLOOD_CENTRE" className="hover:text-white transition-colors">
                  Blood Centres
                </Link>
              </li>
              <li>
                <Link to="/search?category=LABORATORY" className="hover:text-white transition-colors">
                  Clinical Laboratories
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & Tools */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navigation & Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Healthcare Services
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  Cost Comparison Matrix
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Interactive Nearby Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About MediGuide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Policy */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Information & Trust
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/disclaimer" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about#verification-policy" className="hover:text-white transition-colors">
                  Verification Workflow
                </Link>
              </li>
              <li>
                <Link to="/contact#report" className="hover:text-white transition-colors">
                  Report Incorrect Data
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Future Scope Callout */}
        <div className="py-8 border-b border-slate-800">
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Extensible Roadmap (Future Scope Placeholders)</span>
              </div>
              <p className="text-xs text-slate-400">
                Architecture designed for upcoming extensions: Real-time doctor availability slots, Mobile Native Apps (iOS/Android), Regional language translation (Hindi, Marathi), and Insurance Network / TPA cashless mapping.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-900 px-3 py-1 rounded-md border border-slate-800 whitespace-nowrap">
              SRS Section 44 Aligned
            </span>
          </div>
        </div>

        {/* Disclaimer Callout Box */}
        <div className="py-6">
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300 mb-0.5">Mandatory Informational Disclaimer:</p>
              Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges directly with the healthcare facility. MediGuide does NOT provide clinical decision-making, medical diagnosis, prescriptions, emergency dispatch, or hospital billing.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediGuide. Academic Full-Stack Demonstration.</p>
          <div className="flex items-center gap-6">
            <span className="text-emerald-400 font-medium">● Demonstration Database Active</span>
            <Link to="/disclaimer" className="hover:text-slate-400">Disclaimer</Link>
            <Link to="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
