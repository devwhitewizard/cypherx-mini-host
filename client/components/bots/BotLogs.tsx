'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Copy, RefreshCw, Terminal } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';

interface BotLogsProps {
  botId: string;
}

const LINE_OPTIONS = [
  { value: '50', label: '50 lines' },
  { value: '100', label: '100 lines' },
  { value: '250', label: '250 lines' },
  { value: '500', label: '500 lines' },
];

export function BotLogs({ botId }: BotLogsProps) {
  const { showToast } = useToast();
  const [linesCount, setLinesCount] = useState('100');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getBotLogs(botId, Number(linesCount));
      setLogs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bot logs');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [botId, linesCount]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleCopy = async () => {
    if (logs.length === 0) return;
    try {
      await navigator.clipboard.writeText(logs.join('\n'));
      setCopied(true);
      showToast('Logs copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy logs', 'error');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-zinc-100">Runtime Logs</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-28">
            <Select
              aria-label="Log line count"
              options={LINE_OPTIONS}
              value={linesCount}
              onChange={(e) => setLinesCount(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            disabled={logs.length === 0}
            icon={
              copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
          >
            Copy
          </Button>
          <Button
            size="sm"
            variant="secondary"
            loading={loading}
            onClick={fetchLogs}
            icon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-[#09090b] p-4 font-mono text-xs leading-relaxed min-h-[260px] max-h-[460px] overflow-auto">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-zinc-500">
            No log output available for this bot yet.
          </p>
        ) : (
          <pre className="whitespace-pre-wrap break-words text-zinc-300">
            {logs.join('\n')}
          </pre>
        )}
      </div>
    </div>
  );
}

