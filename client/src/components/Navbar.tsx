import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Terminal, LogOut, User as UserIcon, Menu, X, ShieldAlert, BookOpen, Trophy, History } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login', { replace: true });
    }
  };

  const navLinkClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return `px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
      isActive
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center space-x-6">
          <Link to="/problems" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-700 transition">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">CodeJudge</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/problems" className={navLinkClass('/problems')}>
                Problems
              </Link>
              <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                Leaderboard
              </Link>
              <Link to="/submissions" className={navLinkClass('/submissions')}>
                My Submissions
              </Link>
              {user.role === 'Admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Right User Bar */}
        <div className="flex items-center space-x-3">
          {/* Judge Status Pill from Designs */}
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 text-[11px]">Judge Online</span>
          </div>

          {loading ? (
            <div className="w-16 h-8"></div>
          ) : user ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* User Profile Pill */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold font-mono">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-800 font-mono text-xs">
                  {user.username}
                </span>
                {user.role === 'Admin' && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1 py-0.2 rounded font-semibold uppercase">
                    Admin
                  </span>
                )}
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-red-600 p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 transition"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-3 space-y-1">
          <Link
            to="/problems"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Problems Archive</span>
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard</span>
          </Link>
          <Link
            to="/submissions"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>My Submissions</span>
          </Link>
          {user.role === 'Admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
