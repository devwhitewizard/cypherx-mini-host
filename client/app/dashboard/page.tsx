'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Bot as BotIcon,
  Coins,
  PlayCircle,
  RefreshCw,
  Rocket,
  StopCircle,
  User,
  WifiOff,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getBotId, getBotName, normalizeBotStatus } from '@/lib/utils';
import type { AccountInfo } from '@/types/account';
import type { Bot } from '@/types/bot';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getStatusBadgeVariant } from '@/components/dashboard/BotCard';

export default function DashboardOverviewPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [botsResult, accountResult] = await Promise.allSettled([
        api.getBots(),
        api.getAccount(),
      ]);

      if (botsResult.status === 'fulfilled') {
        setBots(botsResult.value);
      } else {
        setBots([]);
      }

      if (accountResult.status === 'fulfilled') {
        setAccount(accountResult.value);
      } else {
        setAccount(null);
      }

      if (
        botsResult.status === 'rejected' &&
        accountResult.status === 'rejected'
      ) {
        const reason = botsResult.reason;
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to connect to backend server'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const runningCount = bots.filter(
    (b) => normalizeBotStatus(b.status) === 'running'
  ).length;
  const stoppedCount = bots.filter(
    (b) => normalizeBotStatus(b.status) === 'stopped'
  ).length;
  const credits = account?.credits ?? account?.balance;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            System Overview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Live summary from your Express backend and CypherX account.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          loading={loading}
          onClick={loadOverview}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bots"
          value={error ? '—' : bots.length}
          loading={loading}
          icon={<BotIcon className="h-4 w-4" />}
          accent="indigo"
        />
        <StatCard
          label="Running Bots"
          value={error ? '—' : runningCount}
          loading={loading}
          icon={<PlayCircle className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Stopped Bots"
          value={error ? '—' : stoppedCount}
          loading={loading}
          icon={<StopCircle className="h-4 w-4" />}
        />
        <StatCard
          label="Account Credits"
          value={credits !== undefined && credits !== null ? credits : '—'}
          loading={loading}
          icon={<Coins className="h-4 w-4" />}
          sublabel={account ? 'Live balance' : 'Unavailable until connected'}
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="text-sm font-semibold text-zinc-100">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/dashboard/deploy"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Rocket className="h-4 w-4" />
            Deploy New Bot
          </Link>
          <Link
            href="/dashboard/bots"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-xs sm:text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <BotIcon className="h-4 w-4" />
            Manage Bots
          </Link>
          <Link
            href="/dashboard/account"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-xs sm:text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <User className="h-4 w-4" />
            Account Status
          </Link>
        </div>
      </div>

      {/* Backend state or Recent Activity */}
      {error ? (
        <EmptyState
          icon={<WifiOff className="h-5 w-5 text-red-400" />}
          title="Backend Not Connected"
          description={`${error} Ensure the Express server is running on port 5000 with a valid CYPHERX_API_KEY.`}
          action={
            <Button size="sm" variant="secondary" onClick={loadOverview}>
              Retry Connection
            </Button>
          }
        />
      ) : !loading && bots.length === 0 ? (
        <EmptyState
          icon={<Activity className="h-5 w-5" />}
          title="No Bot Activity Yet"
          description="No bots were returned from CypherX. Deploy your first bot from GitHub or a ZIP archive to see live status and activity here."
          action={
            <Link
              href="/dashboard/deploy"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Rocket className="h-3.5 w-3.5" />
              Deploy Bot
            </Link>
          }
        />
      ) : bots.length > 0 ? (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h3 className="text-sm font-semibold text-zinc-100">
              Recent Bots
            </h3>
            <Link
              href="/dashboard/bots"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {bots.slice(0, 5).map((bot) => {
              const id = getBotId(bot);
              return (
                <Link
                  key={id}
                  href={`/dashboard/bots/${encodeURIComponent(id)}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">
                      {getBotName(bot)}
                    </p>
                    {bot.description && (
                      <p className="text-xs text-zinc-500 truncate">
                        {bot.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={getStatusBadgeVariant(bot.status)} dot>
                    {bot.status || 'unknown'}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

