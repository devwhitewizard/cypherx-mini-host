'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Copy,
  Cpu,
  Clock,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, getBotId, getBotName } from '@/lib/utils';
import type { Bot } from '@/types/bot';
import { BotActions } from '@/components/bots/BotActions';
import { BotLogs } from '@/components/bots/BotLogs';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { getStatusBadgeVariant } from '@/components/dashboard/BotCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

export default function BotDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const botId = decodeURIComponent(params.id || '');

  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const fetchBot = useCallback(async () => {
    if (!botId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBotById(botId);
      setBot(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load bot details'
      );
      setBot(null);
    } finally {
      setLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchBot();
  }, [fetchBot]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(botId);
      setCopiedId(true);
      showToast('Bot ID copied', 'success');
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      showToast('Failed to copy Bot ID', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/bots"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Bots
        </Link>

        <EmptyState
          icon={<WifiOff className="h-5 w-5 text-red-400" />}
          title="Bot Unavailable"
          description={error || 'The requested bot could not be loaded.'}
          action={
            <Button size="sm" variant="secondary" onClick={fetchBot}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const name = getBotName(bot);
  const id = getBotId(bot) || botId;
  const nodeVersion = bot.nodeVersion || bot.runtime?.nodeVersion;
  const uptime = bot.uptime ?? bot.runtime?.uptime;
  const cpu = bot.cpu ?? bot.runtime?.cpu;
  const memory = bot.memory ?? bot.runtime?.memory;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/bots"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Bots
        </Link>

        <Button
          size="sm"
          variant="secondary"
          onClick={fetchBot}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Summary & Controls */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-semibold text-zinc-100">{name}</h2>
              <Badge variant={getStatusBadgeVariant(bot.status)} dot>
                {bot.status || 'unknown'}
              </Badge>
            </div>
            {bot.description && (
              <p className="text-sm text-zinc-400">{bot.description}</p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <span className="font-mono text-xs text-zinc-500">ID: {id}</span>
              <button
                type="button"
                onClick={handleCopyId}
                aria-label="Copy bot ID"
                className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                {copiedId ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <BotActions
            botId={id}
            botName={name}
            onActionComplete={fetchBot}
            onDeleted={() => router.push('/dashboard/bots')}
          />
        </div>

        {/* Runtime Metadata */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border pt-5">
          <div className="rounded-lg bg-[#0c0c0f] border border-border p-3">
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Cpu className="h-3.5 w-3.5" /> Node Version
            </span>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {nodeVersion || '—'}
            </p>
          </div>
          <div className="rounded-lg bg-[#0c0c0f] border border-border p-3">
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Clock className="h-3.5 w-3.5" /> Uptime
            </span>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {uptime !== undefined && uptime !== null ? String(uptime) : '—'}
            </p>
          </div>
          <div className="rounded-lg bg-[#0c0c0f] border border-border p-3">
            <span className="text-[11px] text-zinc-500">CPU / Memory</span>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {cpu || memory
                ? `${cpu ?? '—'} / ${memory ?? '—'}`
                : '—'}
            </p>
          </div>
          <div className="rounded-lg bg-[#0c0c0f] border border-border p-3">
            <span className="text-[11px] text-zinc-500">Last Updated</span>
            <p className="mt-1 text-sm font-medium text-zinc-200">
              {formatDate(bot.updatedAt || bot.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Logs Viewer */}
      <BotLogs botId={id} />
    </div>
  );
}

