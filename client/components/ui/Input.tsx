'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-9 rounded-lg bg-[#0c0c0f] border px-3 text-sm text-zinc-100 placeholder:text-zinc-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
            error
              ? 'border-red-500/70 focus:border-red-500'
              : 'border-border focus:border-indigo-500/70',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : hint ? (
          <p className="text-xs text-zinc-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

