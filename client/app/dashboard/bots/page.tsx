'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bot as BotIcon,
  LayoutGrid,
  List,
  RefreshCw,
  Rocket,
  Search,
  WifiOff,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getBotId, getBotName, normalizeBotStatus } from '@/lib/utils';
import type { Bot } from '@/types/bot';
import { BotCard } from '@/components/dashboard/BotCard';
import { BotTable } from '@/components/dashboard/BotTable';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { BotActions } from '@/components/bots/BotActions';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'running', label: 'Running' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'pending', label: 'Deploying / Pending' },
  { value: 'error', label: 'Error' },
];

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const fetchBots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBots();
      setBots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bots');
      setBots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const filteredBots = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bots.filter((bot) => {
      const name = getBotName(bot).toLowerCase();
      const id = getBotId(bot).toLowerCase();
      const matchesQuery =
        !query ||
        name.includes(query) ||
        id.includes(query) ||
        (bot.description || '').toLowerCase().includes(query);

      if (!matchesQuery) return false;
      if (statusFilter === 'all') return true;
      return normalizeBotStatus(bot.status) === statusFilter;
    });
  }, [bots, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">My Bots</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Search, filter, and control your hosted bots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            loading={loading}
            onClick={fetchBots}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
          <Link
            href="/dashboard/deploy"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            <Rocket className="h-3.5 w-3.5" />
            Deploy Bot
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="search"
              placeholder="Search bots by name or ID..."
              aria-label="Search bots"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              aria-label="Filter by status"
              options={STATUS_FILTERS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'grid'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            className={`rounded-md p-1.5 transition-colors ${
              viewMode === 'table'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface p-4 space-y-3"
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          icon={<WifiOff className="h-5 w-5 text-red-400" />}
          title="Unable to Load Bots"
          description={error}
          action={
            <Button size="sm" variant="secondary" onClick={fetchBots}>
              Retry
            </Button>
          }
        />
      ) : bots.length === 0 ? (
        <EmptyState
          icon={<BotIcon className="h-5 w-5" />}
          title="No Bots Found"
          description="You don't have any bots deployed on CypherX yet. Deploy a bot from GitHub or upload a ZIP archive to get started."
          action={
            <Link
              href="/dashboard/deploy"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              <Rocket className="h-3.5 w-3.5" />
              Deploy First Bot
            </Link>
          }
        />
      ) : filteredBots.length === 0 ? (
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="No Matching Bots"
          description="Try adjusting your search query or status filter."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot) => {
            const id = getBotId(bot);
            return (
              <BotCard
                key={id}
                bot={bot}
                actions={
                  <BotActions
                    botId={id}
                    botName={getBotName(bot)}
                    compact
                    onActionComplete={fetchBots}
                  />
                }
              />
            );
          })}
        </div>
      ) : (
        <BotTable
          bots={filteredBots}
          renderActions={(bot) => (
            <BotActions
              botId={getBotId(bot)}
              botName={getBotName(bot)}
              compact
              onActionComplete={fetchBots}
            />
          )}
        />
      )}
    </div>
  );
}

