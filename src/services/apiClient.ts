/**
 * Orbit AI — API Client
 * Single source of truth for all backend communication.
 * Handles error mapping, response normalization, and typed returns.
 */

import type { WorkflowRun, ResultRecord } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadApiResponse {
  runs: WorkflowRun[];
  results: ResultRecord[];
  message?: string;
}

export async function uploadFilesToFastApi(
  files: File[]
): Promise<UploadApiResponse | null> {
  try {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Upload failed.' }));
      throw new Error(err.detail || `Server error ${response.status}`);
    }

    const data = await response.json();
    const runs: WorkflowRun[] = (data.runs || []).map(normalizeRun);
    const results: ResultRecord[] = (data.results || []).map(normalizeResult);
    return { runs, results, message: data.message };
  } catch (err: any) {
    console.warn('[apiClient] uploadFilesToFastApi error:', err.message || err);
    // Re-throw so the caller (Upload.tsx) can display the real error toast
    if (err.message) throw err;
    return null;
  }
}

// ─── Demo Mode ────────────────────────────────────────────────────────────────

export async function triggerDemoMode(
  sampleType: 'complaint' | 'contract' | 'meeting' | 'all' = 'all'
): Promise<UploadApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/demo/run?sample_type=${sampleType}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Demo run failed.' }));
      throw new Error(err.detail || `Server error ${response.status}`);
    }

    const data = await response.json();
    const runs: WorkflowRun[] = (data.runs || []).map(normalizeRun);
    const results: ResultRecord[] = (data.results || []).map(normalizeResult);
    return { runs, results, message: data.message };
  } catch (err: any) {
    console.warn('[apiClient] triggerDemoMode error:', err.message || err);
    if (err.message) throw err;
    return null;
  }
}

// ─── History ──────────────────────────────────────────────────────────────────

export async function fetchHistoryFromFastApi(
  query?: string,
  status?: string
): Promise<WorkflowRun[] | null> {
  try {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (status && status !== 'All') params.set('status', status);

    const url = `${API_BASE_URL}/history${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeRun) : [];
  } catch {
    return null;
  }
}

export async function deleteWorkflowFromFastApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function rerunWorkflowInFastApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/history/${id}/rerun`, { method: 'POST' });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Results ──────────────────────────────────────────────────────────────────

export async function fetchResultsFromFastApi(): Promise<ResultRecord[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/results`);
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeResult) : [];
  } catch {
    return null;
  }
}

export async function updateResultInFastApi(
  id: string,
  payload: Partial<ResultRecord>
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = {};
    if (payload.title !== undefined) body.title = payload.title;
    if (payload.incidentType !== undefined) body.incident_type = payload.incidentType;
    if (payload.businessImpact !== undefined) body.business_impact = payload.businessImpact;
    if (payload.summary !== undefined) body.summary = payload.summary;
    if (payload.generatedReply !== undefined) body.generated_reply = payload.generatedReply;
    if (payload.suggestedActions !== undefined) body.suggested_actions = payload.suggestedActions;

    const response = await fetch(`${API_BASE_URL}/results/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  failedTasks: number;
  avgConfidence: number;
  successRate: number;
  workflowDistribution: Array<{ name: string; value: number }>;
  recentActivity: Array<{ agent: string; action: string; target: string; time: string; status: string }>;
  tasksTrend: Array<{ name: string; tasks: number; completed: number }>;
  confidenceTrend: Array<{ name: string; confidence: number }>;
}

export async function fetchAnalyticsFromFastApi(): Promise<AnalyticsData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function fetchActivityFromFastApi(limit = 20): Promise<unknown[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/activity?limit=${limit}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function checkBackendHealth(): Promise<{ online: boolean; gemini: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return { online: false, gemini: 'offline' };
    const data = await response.json();
    return { online: true, gemini: data.gemini || 'unknown' };
  } catch {
    return { online: false, gemini: 'offline' };
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

export async function exportHistoryCsv(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/export/csv`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbit_ai_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn('[apiClient] CSV export error:', err);
  }
}

export async function exportResultsJson(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/export/json`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbit_ai_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.warn('[apiClient] JSON export error:', err);
  }
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export async function fetchApiKeysFromFastApi(): Promise<Array<{ id: string; name: string; key: string; created: string; lastUsed: string }> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/keys`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[apiClient] fetchApiKeys error:', err);
    return null;
  }
}

export async function createApiKeyInFastApi(name: string): Promise<{ id: string; name: string; key: string; created: string; lastUsed: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[apiClient] createApiKey error:', err);
    return null;
  }
}

export async function deleteApiKeyInFastApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/keys/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (err) {
    console.warn('[apiClient] deleteApiKey error:', err);
    return false;
  }
}

// ─── Normalization Helpers ─────────────────────────────────────────────────────

function normalizeRun(raw: Record<string, unknown>): WorkflowRun {
  return {
    id: String(raw.id || ''),
    task: String(raw.task || ''),
    source: String(raw.source || ''),
    workflow: String(raw.workflow || 'Unknown'),
    date: String(raw.date || ''),
    status: (raw.status as WorkflowRun['status']) || 'Completed',
    confidence: Number(raw.confidence || 0),
    priority: (raw.priority as WorkflowRun['priority']) || 'Medium',
  };
}

function normalizeResult(raw: Record<string, unknown>): ResultRecord {
  const actions = Array.isArray(raw.suggestedActions)
    ? (raw.suggestedActions as string[])
    : Array.isArray(raw.suggested_actions)
    ? (raw.suggested_actions as string[])
    : [];

  return {
    id: String(raw.id || ''),
    title: String(raw.title || ''),
    source: String(raw.source || ''),
    incidentType: String(raw.incidentType || raw.incident_type || ''),
    priority: (raw.priority as ResultRecord['priority']) || 'Medium',
    confidence: Number(raw.confidence || 0),
    riskLevel: (raw.riskLevel || raw.risk_level || 'Moderate') as ResultRecord['riskLevel'],
    businessImpact: String(raw.businessImpact || raw.business_impact || ''),
    summary: String(raw.summary || ''),
    suggestedActions: actions,
    generatedReply: String(raw.generatedReply || raw.generated_reply || ''),
    date: String(raw.date || ''),
    validationScore: Number(raw.validationScore || raw.validation_score || 0),
    validationStatus: String(raw.validationStatus || raw.validation_status || ''),
  };
}
