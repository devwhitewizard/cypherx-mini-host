import axios from 'axios';
import { env, isCypherxConfigured } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const DEFAULT_TIMEOUT_MS = 15000;
const UPLOAD_TIMEOUT_MS = 60000;

const cypherxClient = axios.create({
  baseURL: env.cypherxBaseUrl,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
  },
});

cypherxClient.interceptors.request.use((config) => {
  if (!isCypherxConfigured()) {
    throw new ApiError(
      500,
      'CypherX API key is not configured on the server'
    );
  }

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${env.cypherxApiKey}`;
  return config;
});

const STATUS_FALLBACK_MESSAGES = {
  400: 'Invalid request sent to CypherX API',
  401: 'Invalid or expired CypherX API credentials',
  402: 'Insufficient CypherX credits to complete this action',
  403: 'Action forbidden or restricted by CypherX',
  404: 'Requested resource was not found on CypherX',
  413: 'Payload exceeds CypherX size limit',
  429: 'CypherX API rate limit exceeded. Please try again later',
};

function extractSafeErrorMessage(data) {
  if (!data) return null;
  if (typeof data === 'string') {
    return data.slice(0, 300);
  }
  if (typeof data === 'object') {
    const raw = data.message || data.error || data.detail;
    if (typeof raw === 'string' && raw.trim()) {
      return raw.trim();
    }
  }
  return null;
}

function normalizeCypherxError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError(504, 'CypherX API request timed out');
  }

  if (!error.response) {
    return new ApiError(502, 'Unable to reach CypherX API');
  }

  const { status, data } = error.response;

  if (status === 401) {
    return new ApiError(401, STATUS_FALLBACK_MESSAGES[401]);
  }

  const safeMessage =
    extractSafeErrorMessage(data) ||
    STATUS_FALLBACK_MESSAGES[status] ||
    (status >= 500
      ? 'CypherX server error. Please try again later'
      : 'CypherX API request failed');

  const safeStatus = status >= 400 && status < 600 ? status : 502;
  return new ApiError(safeStatus, safeMessage);
}

async function request(config) {
  try {
    const response = await cypherxClient.request(config);
    return response.data;
  } catch (error) {
    throw normalizeCypherxError(error);
  }
}

export const cypherxService = {
  getAccount() {
    return request({
      method: 'GET',
      url: '/account',
    });
  },

  getBots() {
    return request({
      method: 'GET',
      url: '/bots',
    });
  },

  getBotById(id) {
    return request({
      method: 'GET',
      url: `/bots/${encodeURIComponent(id)}`,
    });
  },

  getBotLogs(id, lines = 100) {
    return request({
      method: 'GET',
      url: `/bots/${encodeURIComponent(id)}/logs`,
      params: { lines },
    });
  },

  restartBot(id) {
    return request({
      method: 'POST',
      url: `/bots/${encodeURIComponent(id)}/restart`,
    });
  },

  stopBot(id) {
    return request({
      method: 'POST',
      url: `/bots/${encodeURIComponent(id)}/stop`,
    });
  },

  deleteBot(id) {
    return request({
      method: 'DELETE',
      url: `/bots/${encodeURIComponent(id)}`,
    });
  },

  deployFromGithub(payload) {
    return request({
      method: 'POST',
      url: '/deploy/github',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  deployFromUpload({ file, botName, description, nodeVersion, config }) {
    const formData = new FormData();
    const fileBlob = new Blob([file.buffer], {
      type: file.mimetype || 'application/zip',
    });

    formData.append('file', fileBlob, file.originalname || 'bot.zip');
    formData.append('botName', botName);

    if (description !== undefined && description !== '') {
      formData.append('description', String(description));
    }

    if (nodeVersion !== undefined && nodeVersion !== '') {
      formData.append('nodeVersion', String(nodeVersion));
    }

    if (config !== undefined && config !== '') {
      const serializedConfig =
        typeof config === 'string' ? config : JSON.stringify(config);
      formData.append('config', serializedConfig);
    }

    return request({
      method: 'POST',
      url: '/deploy/upload',
      data: formData,
      timeout: UPLOAD_TIMEOUT_MS,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
  },

  getDeploymentStatus(deploymentId) {
    return request({
      method: 'GET',
      url: `/deploy/status/${encodeURIComponent(deploymentId)}`,
    });
  },
};

