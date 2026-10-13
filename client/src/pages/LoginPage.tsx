import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HeartPulse, Lock, Mail, ArrowRight, ShieldCheck, Building2, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'FACILITY_REPRESENTATIVE') {
        navigate('/rep/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white mx-auto shadow-md">
            <HeartPulse className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to MediGuide
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your healthcare navigation account, saved facilities, or administrative dashboard.
          </p>
        </div>

        {/* Quick Demo Autofill Box */}
        <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-800 text-center">
            🚀 Quick Demonstration Accounts (Click to Autofill)
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@mediguide.org', 'AdminPassword123!')}
              className="p-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 hover:shadow-2xs text-left transition-all"
            >
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Dr. Ananya</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('rep.apollo@mediguide.org', 'RepPassword123!')}
              className="p-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 hover:shadow-2xs text-left transition-all"
            >
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Facility Rep</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Apollo Rep</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user.rahul@example.com', 'UserPassword123!')}
              className="p-2 rounded-xl bg-white border border-brand-200 hover:border-brand-500 hover:shadow-2xs text-left transition-all"
            >
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patient</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Rahul Verma</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="login-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="login-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-button"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
