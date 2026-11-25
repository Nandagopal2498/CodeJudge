import { ProblemInputData, AdminTestCase } from '../types/admin.js';
import { getAuthHeaders } from './auth.service.js';

const API_BASE = '/api/admin';

export async function createProblemApi(data: ProblemInputData): Promise<{ message: string; problemId: number }> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(`${API_BASE}/problems`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data)
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to create problem');
  return resData;
}

export async function updateProblemApi(id: number, data: Partial<ProblemInputData>): Promise<{ message: string }> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(`${API_BASE}/problems/${id}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(data)
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to update problem');
  return resData;
}

export async function deleteProblemApi(id: number): Promise<{ message: string }> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/problems/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include'
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to delete problem');
  return resData;
}

export async function fetchTestCasesApi(problemId: number): Promise<AdminTestCase[]> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/problems/${problemId}/test-cases`, {
    headers,
    credentials: 'include'
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to fetch test cases');
  return resData.testCases || [];
}

export async function addTestCaseApi(
  problemId: number,
  input: string,
  expected_output: string,
  is_sample: number
): Promise<{ message: string; testCaseId: number }> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(`${API_BASE}/problems/${problemId}/test-cases`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ input, expected_output, is_sample })
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to add test case');
  return resData;
}

export async function updateTestCaseApi(
  id: number,
  data: { input?: string; expected_output?: string; is_sample?: number }
): Promise<{ message: string }> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const res = await fetch(`${API_BASE}/test-cases/${id}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(data)
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to update test case');
  return resData;
}

export async function deleteTestCaseApi(id: number): Promise<{ message: string }> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/test-cases/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include'
  });
  const resData = await res.json();
  if (!res.ok) throw new Error(resData.message || 'Failed to delete test case');
  return resData;
}
