import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ReportModalProps {
  facilityId: number;
  facilityName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'INCORRECT_ADDRESS', label: 'Incorrect Address / Relocated' },
  { value: 'INCORRECT_PHONE', label: 'Incorrect Phone / Emergency Contact' },
  { value: 'INCORRECT_HOURS', label: 'Incorrect Operating Hours' },
  { value: 'INCORRECT_SERVICE', label: 'Service Not Offered / Misleading Service' },
  { value: 'INCORRECT_COST', label: 'Incorrect Cost Information' },
  { value: 'DUPLICATE_FACILITY', label: 'Duplicate Facility Listing' },
  { value: 'NO_LONGER_OPERATING', label: 'Facility Permanently Closed / Shut' },
  { value: 'OTHER', label: 'Other Data Quality Concern' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  facilityId,
  facilityName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast('Please provide a brief description of the issue.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.submitReport({
        facility_id: facilityId,
        category,
        description: description.trim(),
      });
      setSubmitted(true);
      toast('Report submitted successfully.', 'success');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        onClose();
      }, 1800);
    } catch (err: any) {
      toast(err.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Report Submitted</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Thank you for contributing to MediGuide data quality. Our verification administrators will review this issue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report Incorrect Information</h3>
                <p className="text-xs text-slate-500 truncate max-w-xs">{facilityName}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description & Correct Information
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what information is inaccurate and provide correct contact, timing, or cost details if known..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              MediGuide maintains data integrity through community reports and verified audits. Reports enter our administrator moderation queue.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
