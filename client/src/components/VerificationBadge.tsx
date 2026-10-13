import React from 'react';
import { CheckCircle2, Clock, XCircle, Archive } from 'lucide-react';

interface Props {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({
  status,
  size = 'md',
  showTooltip = false,
}) => {
  const norm = status?.toUpperCase() || 'UNVERIFIED';

  let config = {
    label: 'Unverified',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
    tooltip: 'Facility listing has not been verified by platform administrators.',
  };

  if (norm === 'VERIFIED') {
    config = {
      label: 'Verified Facility',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      tooltip: 'Listing details reviewed by MediGuide administrators. Not a medical guarantee.',
    };
  } else if (norm === 'PENDING') {
    config = {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      tooltip: 'Facility information submitted and in the administrator review queue.',
    };
  } else if (norm === 'REJECTED') {
    config = {
      label: 'Rejected Listing',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
      tooltip: 'Facility listing was rejected due to inaccurate or unverified documentation.',
    };
  } else if (norm === 'ARCHIVED') {
    config = {
      label: 'Archived',
      bg: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <Archive className="w-3.5 h-3.5 text-gray-500" />,
      tooltip: 'Facility is no longer active in MediGuide active navigation.',
    };
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5 gap-2'
      : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      title={showTooltip ? config.tooltip : undefined}
      className={`inline-flex items-center rounded-full border shadow-2xs select-none transition-colors ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
