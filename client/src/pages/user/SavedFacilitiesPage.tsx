import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FacilityCard } from '../../components/FacilityCard';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { Bookmark, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedFacilitiesPage: React.FC = () => {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await api.getSavedFacilities();
      if (res.success && res.data) {
        setSaved(res.data);
      }
    } catch (err) {
      console.error('Failed to load saved facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/user/dashboard" className="hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>/</span>
        <span className="text-slate-900">Saved Bookmarks</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-8 h-8 text-brand-600" />
            <span>Saved Healthcare Facilities</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quickly access your bookmarked clinics, hospitals, and diagnostic centres.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          {saved.length} Facilities Saved
        </span>
      </div>

      <DisclaimerBanner compact={true} />

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 mb-2" />
          <p className="text-sm">Loading bookmarked facilities...</p>
        </div>
      ) : saved.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 p-8 space-y-3 max-w-md mx-auto">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Saved Facilities</h3>
          <p className="text-xs text-slate-500">
            You haven't bookmarked any healthcare facilities yet. Click the bookmark icon on any facility card in the directory.
          </p>
          <Link
            to="/search"
            className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs"
          >
            Explore Directory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => (
            <FacilityCard
              key={item.saved_id}
              facility={{ ...item.facility, is_saved: true }}
              onBookmarkChange={fetchSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
};
