import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Calendar, LogOut, CheckCircle, Terminal } from 'lucide-react';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner matching CodeJudge design */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-mono text-2xl font-bold shadow-sm">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-slate-900 font-mono">
                  {user.username}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Authenticated</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Account Email: <span className="font-mono text-slate-700">{user.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xs font-semibold text-red-600 hover:text-white border border-red-200 hover:bg-red-600 px-4 py-2 rounded-xl transition shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">User ID</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">#{user.id}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Role</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">{user.role}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold uppercase tracking-wider">Registered</span>
          </div>
          <div className="text-sm font-semibold text-slate-800 font-mono truncate">
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}
          </div>
        </div>
      </div>

      {/* Protected Session Status Box */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Terminal className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Protected Dashboard Session</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          You are currently viewing a protected route. Your session is authenticated via an <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-700 font-mono">httpOnly</code> cookie verified against the local SQLite database.
        </p>
      </div>
    </div>
  );
}
