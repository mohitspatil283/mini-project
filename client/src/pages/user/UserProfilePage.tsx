import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { User, Mail, Phone, Lock, Save, ShieldCheck } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.updateProfile({
        name,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      if (res.success) {
        toast('Profile updated successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        await refreshUser();
      }
    } catch (err: any) {
      toast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="w-8 h-8 text-brand-600" />
          <span>Account Settings</span>
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal details and account credentials.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-medium bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Change Password (Leave blank to keep unchanged)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 chars)"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
