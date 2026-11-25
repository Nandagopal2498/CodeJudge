import { SubmissionItem, RunTestsResponse, SubmitResponse } from '../types/submission.js';
import { getAuthHeaders, handleUnauthorized } from './auth.service.js';

const API_BASE = '/api/submissions';

export async function submitSolutionApi(problemId: number, code: string, language?: string): Promise<SubmitResponse> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ problemId, code, language })
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    throw new Error(data.message || 'Submission failed');
  }
  return data;
}

export async function runSampleTestsApi(problemId: number, code: string, language?: string): Promise<RunTestsResponse> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ problemId, code, language })
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    throw new Error(data.message || 'Running sample tests failed');
  }
  return data;
}

export async function fetchUserSubmissionsApi(): Promise<SubmissionItem[]> {
  const headers = getAuthHeaders();
  const res = await fetch(API_BASE, {
    headers,
    credentials: 'include'
  });

  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch submissions');
  }
  const data = await res.json();
  return Array.isArray(data.submissions) ? data.submissions : [];
}
