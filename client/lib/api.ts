import type { AccountInfo } from '@/types/account';
import type { Bot } from '@/types/bot';
import type {
  DeploymentResponse,
  GithubDeployPayload,
  ZipDeployPayload,
} from '@/types/deployment';
import {
  extractAccountInfo,
  extractBotsArray,
  extractLogsLines,
  extractSingleBot,
} from '@/lib/utils';

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

export class ApiClientError extends Error {
  status: number;
  isNetworkError: boolean;

  constructor(message: string, status = 0, isNetworkError = false) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

export interface HealthResponse {
  success: boolean;
  message: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);
  if (!isFormData && !headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store',
    });
  } catch {
    throw new ApiClientError(
      'Unable to reach the backend server. Make sure the Express server is running.',
      0,
      true
    );
  }

  let data: unknown = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text().catch(() => '');
    if (text) data = { message: text };
  }

  if (!response.ok) {
    const message =
      (data &&
        typeof data === 'object' &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string' &&
        (data as { message: string }).message) ||
      `Request failed with status ${response.status}`;
    throw new ApiClientError(message, response.status, false);
  }

  return data as T;
}

export const api = {
  checkHealth(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  async getAccount(): Promise<AccountInfo | null> {
    const data = await request<unknown>('/account');
    return extractAccountInfo(data);
  },

  async getBots(): Promise<Bot[]> {
    const data = await request<unknown>('/bots');
    return extractBotsArray(data);
  },

  async getBotById(id: string): Promise<Bot | null> {
    const data = await request<unknown>(`/bots/${encodeURIComponent(id)}`);
    return extractSingleBot(data);
  },

  async getBotLogs(id: string, lines = 100): Promise<string[]> {
    const data = await request<unknown>(
      `/bots/${encodeURIComponent(id)}/logs?lines=${encodeURIComponent(lines)}`
    );
    return extractLogsLines(data);
  },

  restartBot(id: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(
      `/bots/${encodeURIComponent(id)}/restart`,
      { method: 'POST' }
    );
  },

  stopBot(id: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(
      `/bots/${encodeURIComponent(id)}/stop`,
      { method: 'POST' }
    );
  },

  deleteBot(id: string): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>(`/bots/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  deployFromGithub(payload: GithubDeployPayload): Promise<DeploymentResponse> {
    return request<DeploymentResponse>('/deploy/github', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deployFromUpload(payload: ZipDeployPayload): Promise<DeploymentResponse> {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('botName', payload.botName);
    if (payload.description) {
      formData.append('description', payload.description);
    }
    if (payload.nodeVersion) {
      formData.append('nodeVersion', payload.nodeVersion);
    }
    if (payload.config && payload.config.length > 0) {
      formData.append('config', JSON.stringify(payload.config));
    }

    return request<DeploymentResponse>('/deploy/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getDeploymentStatus(deploymentId: string): Promise<DeploymentResponse> {
    return request<DeploymentResponse>(
      `/deploy/status/${encodeURIComponent(deploymentId)}`
    );
  },
};

