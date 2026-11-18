import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/70',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  danger: 'bg-red-500/10 text-red-400 border-red-500/25',
  accent: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
};

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-400',
            variant === 'warning' && 'bg-amber-400',
            variant === 'danger' && 'bg-red-400',
            variant === 'accent' && 'bg-indigo-400',
            variant === 'neutral' && 'bg-zinc-400'
          )}
        />
      )}
      {children}
    </span>
  );
}

