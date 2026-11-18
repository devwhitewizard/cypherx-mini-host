'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  FileArchive,
  GitBranch,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { DeploymentResponse } from '@/types/deployment';
import { GitHubDeployForm } from '@/components/deploy/GitHubDeployForm';
import { ZipDeployForm } from '@/components/deploy/ZipDeployForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type DeployMethod = 'github' | 'zip';

const TERMINAL_STATUSES = new Set([
  'running',
  'online',
  'completed',
  'success',
  'succeeded',
  'failed',
  'error',
]);

export default function DeployPage() {
  const [method, setMethod] = useState<DeployMethod>('github');
  const [deployment, setDeployment] = useState<DeploymentResponse | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const deploymentId = deployment?.deploymentId || deployment?.id;
  const normalizedStatus = (deployment?.status || '').toLowerCase().trim();
  const isTerminal = TERMINAL_STATUSES.has(normalizedStatus);
  const isFailed = normalizedStatus === 'failed' || normalizedStatus === 'error';

  const refreshDeploymentStatus = useCallback(async () => {
    if (!deploymentId) return;
    setCheckingStatus(true);
    setStatusError(null);
    try {
      const updated = await api.getDeploymentStatus(String(deploymentId));
      setDeployment((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : 'Unable to fetch deployment status'
      );
    } finally {
      setCheckingStatus(false);
    }
  }, [deploymentId]);

  useEffect(() => {
    if (!deploymentId || isTerminal) return;
    const interval = setInterval(() => {
      refreshDeploymentStatus();
    }, 4000);
    return () => clearInterval(interval);
  }, [deploymentId, isTerminal, refreshDeploymentStatus]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Deploy Bot</h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Deploy a new bot instance from a GitHub repository or a local ZIP
          archive.
        </p>
      </div>

      {/* Method Selector */}
      <div className="inline-flex rounded-xl border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setMethod('github')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors',
            method === 'github'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
          )}
        >
          <GitBranch className="h-4 w-4" />
          GitHub Repository
        </button>
        <button
          type="button"
          onClick={() => setMethod('zip')}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium transition-colors',
            method === 'zip'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
          )}
        >
          <FileArchive className="h-4 w-4" />
          ZIP Upload
        </button>
      </div>

      {/* Form Container */}
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        {method === 'github' ? (
          <GitHubDeployForm onDeploymentStarted={setDeployment} />
        ) : (
          <ZipDeployForm onDeploymentStarted={setDeployment} />
        )}
      </div>

      {/* Deployment Progress / Status Structure */}
      {deployment && (
        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {isFailed ? (
                <XCircle className="h-4 w-4 text-red-400" />
              ) : isTerminal ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
              )}
              <h3 className="text-sm font-semibold text-zinc-100">
                Deployment Status
              </h3>
              {deployment.status && (
                <Badge
                  variant={
                    isFailed ? 'danger' : isTerminal ? 'success' : 'accent'
                  }
                >
                  {deployment.status}
                </Badge>
              )}
            </div>

            {deploymentId && (
              <Button
                size="sm"
                variant="secondary"
                loading={checkingStatus}
                onClick={refreshDeploymentStatus}
                icon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Check Status
              </Button>
            )}
          </div>

          <div className="rounded-lg border border-border bg-[#0c0c0f] p-3 text-xs font-mono text-zinc-300 space-y-1">
            {deploymentId && <p>Deployment ID: {String(deploymentId)}</p>}
            {deployment.message && <p>Message: {deployment.message}</p>}
            {deployment.botId && (
              <p>
                Bot:{' '}
                <Link
                  href={`/dashboard/bots/${encodeURIComponent(String(deployment.botId))}`}
                  className="text-indigo-400 underline"
                >
                  View Bot Details
                </Link>
              </p>
            )}
          </div>

          {statusError && (
            <p className="text-xs text-red-400">{statusError}</p>
          )}
        </div>
      )}
    </div>
  );
}

