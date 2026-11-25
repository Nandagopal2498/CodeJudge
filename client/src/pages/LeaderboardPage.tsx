import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { fetchLeaderboardApi } from '../services/leaderboard.service.js';
import { LeaderboardEntry } from '../types/leaderboard.js';
import { Trophy, Medal, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

export function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = () => {
    setLoading(true);
    fetchLeaderboardApi()
      .then((data) => {
        setLeaderboard(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load leaderboard');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const currentUserEntry = leaderboard.find((entry) => entry.username === user?.username);

  // Render distinct badge for top 3
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>#1 GOLD</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
          <Medal className="w-3.5 h-3.5 text-slate-500" />
          <span>#2 SILVER</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>#3 BRONZE</span>
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-semibold text-slate-500 pl-2">
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header section matching designs */}
      <div className="mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE STANDINGS</span>
            </span>
            <span>•</span>
            <span>RANKED BY FIRST ACCEPTED POINTS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Global Leaderboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time algorithmic standings ranked by total points. Ties broken by earliest solve time. Each problem awards points only on the first Accepted solution.
          </p>
        </div>
      </div>

      {/* Current User Standings Card (if authenticated) */}
      {user && currentUserEntry && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-5 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-mono font-bold text-lg text-white">
              #{currentUserEntry.rank}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold font-mono">{currentUserEntry.username}</span>
                <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  YOU
                </span>
              </div>
              <div className="text-xs text-blue-100 flex items-center space-x-3 mt-1">
                <span>{currentUserEntry.problemsSolved} Problems Solved</span>
                <span>•</span>
                <span>{currentUserEntry.totalPoints} Total Points</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Loading standings...</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-6">Rank</th>
                  <th className="py-3 px-6">Competitor</th>
                  <th className="py-3 px-6 text-center">Problems Solved</th>
                  <th className="py-3 px-6 text-right">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal">
                {leaderboard.map((entry) => {
                  const isCurrent = user?.username === entry.username;
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;

                  let rowStyle = 'hover:bg-slate-50/80 transition ';
                  if (isCurrent) {
                    rowStyle += 'bg-blue-50/60 font-medium ring-1 ring-inset ring-blue-500/20 ';
                  } else if (isTop1) {
                    rowStyle += 'bg-amber-50/20 ';
                  } else if (isTop2) {
                    rowStyle += 'bg-slate-50/40 ';
                  } else if (isTop3) {
                    rowStyle += 'bg-orange-50/15 ';
                  }

                  return (
                    <tr key={entry.userId} className={rowStyle}>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {renderRankBadge(entry.rank)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                              isTop1
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : isTop2
                                ? 'bg-slate-200 text-slate-700 border border-slate-300'
                                : isTop3
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-900 font-mono">
                                {entry.username}
                              </span>
                              {isCurrent && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-mono text-slate-700">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{entry.problemsSolved}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-sm text-slate-900">
                        <span className={`${isTop1 ? 'text-amber-600' : isCurrent ? 'text-blue-600' : 'text-slate-900'}`}>
                          {entry.totalPoints.toLocaleString()} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                      No competitors found on the leaderboard yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
