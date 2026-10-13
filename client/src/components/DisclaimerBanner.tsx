import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="truncate">
            <span className="font-semibold">Informational Notice:</span> Information shown on MediGuide is for navigation & informational purposes. Approximate costs may change. Always confirm with the facility.
          </p>
          <Link to="/disclaimer" className="underline font-medium hover:text-amber-950 flex-shrink-0 ml-1">
            Read policy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/90 rounded-2xl p-4 md:p-5 shadow-sm my-6">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="p-2.5 bg-amber-100/80 text-amber-800 rounded-xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
            Healthcare Information & Navigation Disclaimer
          </h4>
          <p className="text-sm text-amber-900 leading-relaxed">
            Information shown on MediGuide is for navigation and informational purposes. Approximate costs may change. Always confirm details, availability and final charges directly with the healthcare facility.
          </p>
          <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-amber-800">
            <span>• MediGuide does NOT provide medical advice or diagnosis</span>
            <span>• Not for emergency dispatch</span>
            <Link to="/disclaimer" className="underline hover:text-amber-950">
              Full Disclaimer & Scope →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
