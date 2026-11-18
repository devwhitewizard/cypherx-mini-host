import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number | null | undefined;
  icon: React.ReactNode;
  sublabel?: string;
  loading?: boolean;
  accent?: 'default' | 'success' | 'danger' | 'indigo';
}

export function StatCard({
  label,
  value,
  icon,
  sublabel,
  loading = false,
  accent = 'default',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-zinc-700/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border',
            accent === 'success' &&
              'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
            accent === 'danger' &&
              'border-red-500/20 bg-red-500/10 text-red-400',
            accent === 'indigo' &&
              'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
            accent === 'default' &&
              'border-border bg-surface-elevated text-zinc-300'
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight text-zinc-100">
            {value ?? '—'}
          </p>
        )}
        {sublabel && (
          <p className="mt-1 text-xs text-zinc-500">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

