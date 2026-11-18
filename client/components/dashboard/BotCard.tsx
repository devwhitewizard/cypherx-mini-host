'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Clock } from 'lucide-react';
import type { Bot } from '@/types/bot';
import { Badge } from '@/components/ui/Badge';
import { getBotId, getBotName, normalizeBotStatus } from '@/lib/utils';

interface BotCardProps {
  bot: Bot;
  actions?: React.ReactNode;
}

export function getStatusBadgeVariant(status?: string) {
  const normalized = normalizeBotStatus(status);
  if (normalized === 'running') return 'success' as const;
  if (normalized === 'stopped') return 'neutral' as const;
  if (normalized === 'pending') return 'warning' as const;
  if (normalized === 'error') return 'danger' as const;
  return 'neutral' as const;
}

export function BotCard({ bot, actions }: BotCardProps) {
  const id = getBotId(bot);
  const name = getBotName(bot);
  const statusLabel = bot.status || 'unknown';
  const nodeVersion = bot.nodeVersion || bot.runtime?.nodeVersion;
  const uptime = bot.uptime ?? bot.runtime?.uptime;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-zinc-700/80">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/dashboard/bots/${encodeURIComponent(id)}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-100 hover:text-indigo-400 transition-colors"
            >
              <span className="truncate">{name}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
            {bot.description && (
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                {bot.description}
              </p>
            )}
          </div>
          <Badge variant={getStatusBadgeVariant(bot.status)} dot>
            {statusLabel}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
          {nodeVersion && (
            <span className="inline-flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" />
              Node {nodeVersion}
            </span>
          )}
          {uptime !== undefined && uptime !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {String(uptime)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <Link
          href={`/dashboard/bots/${encodeURIComponent(id)}`}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View details
        </Link>
        {actions}
      </div>
    </div>
  );
}

