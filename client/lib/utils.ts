import type { AccountInfo } from '@/types/account';
import type { Bot } from '@/types/bot';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function getBotId(bot: Bot): string {
  return String(bot.id || bot._id || '');
}

export function getBotName(bot: Bot): string {
  return bot.botName || bot.name || getBotId(bot) || 'Unnamed Bot';
}

export function normalizeBotStatus(status?: string): 'running' | 'stopped' | 'pending' | 'error' | 'unknown' {
  const s = (status || '').toLowerCase().trim();
  if (s === 'running' || s === 'online' || s === 'active') return 'running';
  if (s === 'stopped' || s === 'offline' || s === 'inactive') return 'stopped';
  if (s === 'deploying' || s === 'building' || s === 'restarting' || s === 'pending' || s === 'queued') {
    return 'pending';
  }
  if (s === 'error' || s === 'failed' || s === 'crashed') return 'error';
  return 'unknown';
}

export function extractBotsArray(payload: unknown): Bot[] {
  if (Array.isArray(payload)) return payload as Bot[];
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.bots)) return obj.bots as Bot[];
    if (Array.isArray(obj.data)) return obj.data as Bot[];
    if (obj.data && typeof obj.data === 'object') {
      const nested = obj.data as Record<string, unknown>;
      if (Array.isArray(nested.bots)) return nested.bots as Bot[];
    }
  }
  return [];
}

export function extractSingleBot(payload: unknown): Bot | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  if (obj.bot && typeof obj.bot === 'object') return obj.bot as Bot;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const nested = obj.data as Record<string, unknown>;
    if (nested.bot && typeof nested.bot === 'object') return nested.bot as Bot;
    return obj.data as Bot;
  }
  if (obj.id || obj._id || obj.name || obj.botName) {
    return obj as Bot;
  }
  return null;
}

export function extractAccountInfo(payload: unknown): AccountInfo | null {
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  if (obj.account && typeof obj.account === 'object') return obj.account as AccountInfo;
  if (obj.user && typeof obj.user === 'object') return obj.user as AccountInfo;
  if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
    const nested = obj.data as Record<string, unknown>;
    if (nested.account && typeof nested.account === 'object') return nested.account as AccountInfo;
    return obj.data as AccountInfo;
  }
  return obj as AccountInfo;
}

export function extractLogsLines(payload: unknown): string[] {
  if (!payload) return [];
  if (typeof payload === 'string') return payload.split(/\r?\n/);
  if (Array.isArray(payload)) return payload.map(String);
  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.lines)) return obj.lines.map(String);
    if (typeof obj.logs === 'string') return obj.logs.split(/\r?\n/);
    if (Array.isArray(obj.logs)) return obj.logs.map(String);
    if (obj.data) return extractLogsLines(obj.data);
  }
  return [];
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

