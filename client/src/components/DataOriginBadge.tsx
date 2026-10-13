import React from 'react';
import { FlaskConical, ShieldCheck, HelpCircle } from 'lucide-react';

interface Props {
  origin?: string;
  size?: 'sm' | 'md';
}

export const DataOriginBadge: React.FC<Props> = ({ origin = 'DEMONSTRATION_SAMPLE', size = 'sm' }) => {
  if (origin === 'VERIFIED_PARTNER') {
    return (
      <span
        title="Verified real-world healthcare provider data authorized by institutional representative."
        className={`inline-flex items-center gap-1 rounded-full font-bold bg-teal-50 text-teal-800 border border-teal-200/90 shadow-2xs ${
          size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        <ShieldCheck className="w-3 h-3 text-teal-600" />
        <span>Verified Partner Data</span>
      </span>
    );
  }

  if (origin === 'UNVERIFIED_CROWDSOURCED') {
    return (
      <span
        title="Crowdsourced / unverified submission awaiting administrative audit."
        className={`inline-flex items-center gap-1 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs ${
          size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        <HelpCircle className="w-3 h-3 text-amber-600" />
        <span>Unverified Submission</span>
      </span>
    );
  }

  // Default: DEMONSTRATION_SAMPLE
  return (
    <span
      title="Academic demonstration sample data. For navigation and cost transparency preview only. Always verify directly with facility."
      className={`inline-flex items-center gap-1 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/90 shadow-2xs ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <FlaskConical className="w-3 h-3 text-indigo-500" />
      <span>Demo Sample Data</span>
    </span>
  );
};
