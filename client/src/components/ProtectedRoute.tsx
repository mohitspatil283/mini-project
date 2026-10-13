import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'USER' | 'FACILITY_REPRESENTATIVE' | 'ADMIN'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        <p className="animate-pulse text-sm">Verifying security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role as any)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl bg-white border border-rose-200 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted (403 Forbidden)</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your current account role (<span className="font-bold uppercase text-slate-800">{role}</span>) does not have authorization to view this protected administrative portal.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to MediGuide Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
