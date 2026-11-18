'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Bot } from '@/types/bot';
import { Badge } from '@/components/ui/Badge';
import { getStatusBadgeVariant } from '@/components/dashboard/BotCard';
import { formatDate, getBotId, getBotName } from '@/lib/utils';

interface BotTableProps {
  bots: Bot[];
  renderActions?: (bot: Bot) => React.ReactNode;
}

export function BotTable({ bots, renderActions }: BotTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-medium text-zinc-400">
            <th className="px-4 py-3">Bot</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 hidden md:table-cell">Runtime</th>
            <th className="px-4 py-3 hidden lg:table-cell">Updated</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {bots.map((bot) => {
            const id = getBotId(bot);
            const name = getBotName(bot);
            const nodeVersion = bot.nodeVersion || bot.runtime?.nodeVersion;
            const uptime = bot.uptime ?? bot.runtime?.uptime;

            return (
              <tr
                key={id}
                className="hover:bg-zinc-900/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/bots/${encodeURIComponent(id)}`}
                    className="group inline-flex items-center gap-1.5 font-medium text-zinc-100 hover:text-indigo-400"
                  >
                    <span>{name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  {bot.description && (
                    <p className="mt-0.5 text-xs text-zinc-500 truncate max-w-xs">
                      {bot.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusBadgeVariant(bot.status)} dot>
                    {bot.status || 'unknown'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400 hidden md:table-cell">
                  {nodeVersion ? `Node ${nodeVersion}` : '—'}
                  {uptime !== undefined && uptime !== null
                    ? ` · ${String(uptime)}`
                    : ''}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500 hidden lg:table-cell">
                  {formatDate(bot.updatedAt || bot.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {renderActions?.(bot)}
                    <Link
                      href={`/dashboard/bots/${encodeURIComponent(id)}`}
                      className="rounded-lg border border-border bg-surface-elevated px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

