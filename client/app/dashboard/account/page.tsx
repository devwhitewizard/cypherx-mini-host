'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Coins,
  RefreshCw,
  ShieldCheck,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { api, API_URL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { AccountInfo } from '@/types/account';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/dashboard/EmptyState';

export default function AccountPage() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAccount();
      setAccount(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve account information'
      );
      setAccount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const isVerified =
    account?.verified ??
    account?.isVerified ??
    (account?.verificationStatus?.toLowerCase() === 'verified');
  const credits = account?.credits ?? account?.balance;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Account</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            CypherX profile details, credits balance, and API proxy status.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          loading={loading}
          onClick={loadAccount}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Refresh
        </Button>
      </div>

      {/* API Connection Card */}
      <div className="rounded-xl border border-border bg-surface p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated">
            {error ? (
              <WifiOff className="h-4 w-4 text-red-400" />
            ) : (
              <Wifi className="h-4 w-4 text-emerald-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">
              Backend API Gateway
            </p>
            <p className="font-mono text-xs text-zinc-500">{API_URL}</p>
          </div>
        </div>

        <Badge variant={error ? 'danger' : loading ? 'neutral' : 'success'} dot>
          {loading ? 'Checking' : error ? 'Disconnected' : 'Connected'}
        </Badge>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ) : error || !account ? (
        <EmptyState
          icon={<User className="h-5 w-5" />}
          title="Account Data Unavailable"
          description={
            error ||
            'Connect your Express backend with a valid CYPHERX_API_KEY to view account details and credits.'
          }
          action={
            <Button size="sm" variant="secondary" onClick={loadAccount}>
              Retry
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Profile Information
                </h3>
              </div>
              {isVerified !== undefined && (
                <Badge variant={isVerified ? 'success' : 'warning'} dot>
                  {isVerified ? 'Verified' : 'Unverified'}
                </Badge>
              )}
            </div>

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Name</dt>
                <dd className="text-zinc-200 font-medium">
                  {account.name || account.username || '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Email</dt>
                <dd className="text-zinc-200">{account.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Plan / Tier</dt>
                <dd className="text-zinc-200">
                  {account.plan || account.tier || '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500">Member Since</dt>
                <dd className="text-zinc-200">
                  {formatDate(account.createdAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Credits & Quotas */}
          <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-100">
                Credits & Limits
              </h3>
            </div>

            <div className="rounded-lg border border-border bg-[#0c0c0f] p-4">
              <p className="text-xs text-zinc-500">Available Credits</p>
              <p className="mt-1 text-3xl font-semibold text-zinc-100">
                {credits !== undefined && credits !== null ? credits : '—'}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                API Key stored server-side
              </span>
              {account.maxBots !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  Max bots: {account.maxBots}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

