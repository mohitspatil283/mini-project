import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import {
  Compass,
  HeartPulse,
  Scale,
  MapPin,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Bookmark,
  FileText,
  Layers,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { selectedFacilities } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                  Medi<span className="text-brand-600">Guide</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-brand-50 text-brand-700 border border-brand-200 rounded">
                  Nav
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Healthcare Navigation & Cost Transparency
              </p>
            </div>
          </Link>

          {/* Active City Focus Badge */}
          <Link
            to="/search?city=Pune"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-700 hover:text-brand-700 transition-colors shadow-2xs"
            title="Primary Focus: Pune (31+ Localities)"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>Pune, Maharashtra</span>
            <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded font-semibold">
              31+ Areas
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/search"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/search')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Find Healthcare
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/services')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Services
            </Link>
            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                isActive('/compare')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare Costs
              {selectedFacilities.length > 0 && (
                <span className="ml-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {selectedFacilities.length}
                </span>
              )}
            </Link>
            <Link
              to="/map"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Nearby Facilities
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/about')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase border border-brand-200">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-bold tracking-wider text-brand-600 uppercase">
                      {role.replace('_', ' ')}
                    </p>
                  </div>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>

                    {/* Role specific links */}
                    {role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    {role === 'FACILITY_REPRESENTATIVE' && (
                      <Link
                        to="/rep/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                      >
                        <Building2 className="w-4 h-4 text-brand-600" />
                        Representative Portal
                      </Link>
                    )}

                    {role === 'USER' && (
                      <>
                        <Link
                          to="/user/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <Compass className="w-4 h-4 text-brand-600" />
                          User Dashboard
                        </Link>
                        <Link
                          to="/user/saved"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <Bookmark className="w-4 h-4 text-brand-600" />
                          Saved Facilities
                        </Link>
                        <Link
                          to="/user/reports"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                        >
                          <FileText className="w-4 h-4 text-brand-600" />
                          My Reports
                        </Link>
                      </>
                    )}

                    <Link
                      to="/user/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm hover:shadow-brand-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {selectedFacilities.length > 0 && (
              <Link
                to="/compare"
                className="p-2 text-brand-600 bg-brand-50 rounded-lg relative"
              >
                <Scale className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {selectedFacilities.length}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <Compass className="w-4 h-4" />
              Find Healthcare
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <Layers className="w-4 h-4" />
              Services Catalog
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="flex items-center gap-2.5">
                <Scale className="w-4 h-4" />
                Compare Costs
              </span>
              {selectedFacilities.length > 0 && (
                <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {selectedFacilities.length}
                </span>
              )}
            </Link>
            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              <MapPin className="w-4 h-4" />
              Nearby Facilities
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
            >
              About MediGuide
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-brand-100 text-brand-800">
                    {role.replace('_', ' ')}
                  </span>
                </div>

                {role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    Admin Dashboard
                  </Link>
                )}

                {role === 'FACILITY_REPRESENTATIVE' && (
                  <Link
                    to="/rep/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Building2 className="w-4 h-4 text-brand-600" />
                    Representative Dashboard
                  </Link>
                )}

                {role === 'USER' && (
                  <>
                    <Link
                      to="/user/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Compass className="w-4 h-4 text-brand-600" />
                      User Dashboard
                    </Link>
                    <Link
                      to="/user/saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Bookmark className="w-4 h-4 text-brand-600" />
                      Saved Facilities
                    </Link>
                    <Link
                      to="/user/reports"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <FileText className="w-4 h-4 text-brand-600" />
                      My Reports
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
