import { LeaderboardEntry } from '../types/leaderboard.js';
import { getAuthHeaders, handleUnauthorized } from './auth.service.js';

const API_BASE = '/api/leaderboard';

export async function fetchLeaderboardApi(): Promise<LeaderboardEntry[]> {
  const headers = getAuthHeaders();
  const res = await fetch(API_BASE, {
    headers,
    credentials: 'include'
  });

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch leaderboard');
  }

  const data = await res.json();
  return Array.isArray(data.leaderboard) ? data.leaderboard : [];
}
