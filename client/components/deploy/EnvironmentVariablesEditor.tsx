'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { EnvVarEntry } from '@/types/deployment';
import { Button } from '@/components/ui/Button';

interface EnvironmentVariablesEditorProps {
  entries: EnvVarEntry[];
  onChange: (entries: EnvVarEntry[]) => void;
}

export function EnvironmentVariablesEditor({
  entries,
  onChange,
}: EnvironmentVariablesEditorProps) {
  const handleAdd = () => {
    onChange([...entries, { key: '', value: '' }]);
  };

  const handleUpdate = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const next = entries.map((entry, idx) =>
      idx === index ? { ...entry, [field]: value } : entry
    );
    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(entries.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-medium text-zinc-300">
            Environment Variables
          </label>
          <p className="text-xs text-zinc-500">
            Optional key-value pairs passed to your bot runtime.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleAdd}
          icon={<Plus className="h-3.5 w-3.5" />}
        >
          Add Variable
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border bg-[#0c0c0f] p-3">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-center"
            >
              <input
                type="text"
                placeholder="KEY (e.g. BOT_TOKEN)"
                aria-label={`Environment variable key ${index + 1}`}
                value={entry.key}
                onChange={(e) => handleUpdate(index, 'key', e.target.value)}
                className="h-9 rounded-lg bg-surface border border-border px-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/70"
              />
              <input
                type="text"
                placeholder="Value"
                aria-label={`Environment variable value ${index + 1}`}
                value={entry.value}
                onChange={(e) => handleUpdate(index, 'value', e.target.value)}
                className="h-9 rounded-lg bg-surface border border-border px-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/70"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Remove variable ${index + 1}`}
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

