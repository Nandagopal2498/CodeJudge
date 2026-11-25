import { ProblemListItem, ProblemDetail } from '../types/problem.js';
import { getAuthHeaders, handleUnauthorized } from './auth.service.js';

const API_BASE = '/api/problems';

export async function fetchProblemsApi(): Promise<ProblemListItem[]> {
  const headers = getAuthHeaders();
  const res = await fetch(API_BASE, {
    headers,
    credentials: 'include'
  });
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch problems');
  }
  const data = await res.json();
  return Array.isArray(data.problems) ? data.problems : [];
}

export async function fetchProblemBySlugApi(slug: string): Promise<ProblemDetail> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/${slug}`, {
    headers,
    credentials: 'include'
  });
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch problem');
  }
  const data = await res.json();
  return data.problem;
}
