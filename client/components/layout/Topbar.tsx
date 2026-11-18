'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Home,
  Menu,
  RefreshCw,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BackendStatus = 'checking' | 'connected' | 'offline';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  backendStatus: BackendStatus;
  onRefreshHealth: () => void;
}

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Overview';
  if (pathname === '/dashboard/bots') return 'My Bots';
  if (pathname.startsWith('/dashboard/bots/')) return 'Bot Details';
  if (pathname === '/dashboard/deploy') return 'Deploy Bot';
  if (pathname === '/dashboard/account') return 'Account';
  return 'Control Center';
}

export function Topbar({
  onOpenMobileMenu,
  backendStatus,
  onRefreshHealth,
}: TopbarProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend connection indicator */}
        <button
          type="button"
          onClick={onRefreshHealth}
          title="Check backend connection"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
            backendStatus === 'connected' &&
              'border-emerald-500/25 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15',
            backendStatus === 'offline' &&
              'border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15',
            backendStatus === 'checking' &&
              'border-border bg-surface text-zinc-400'
          )}
        >
          {backendStatus === 'connected' ? (
            <Wifi className="h-3.5 w-3.5" />
          ) : backendStatus === 'offline' ? (
            <WifiOff className="h-3.5 w-3.5" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          )}
          <span className="hidden sm:inline">
            {backendStatus === 'connected'
              ? 'Backend Online'
              : backendStatus === 'offline'
                ? 'Backend Offline'
                : 'Checking...'}
          </span>
        </button>

        {/* Notifications UI placeholder */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-label="Notifications"
            className="rounded-lg border border-border bg-surface p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-surface p-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-zinc-200">
                  Notifications
                </span>
                <span className="text-[11px] text-zinc-500">Placeholder</span>
              </div>
              <p className="py-4 text-center text-xs text-zinc-400">
                No notifications yet. Event streaming will appear here once
                connected.
              </p>
            </div>
          )}
        </div>

        {/* Account menu UI */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-label="Account menu"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/70 transition-colors"
          >
            <User className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Account</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-xl">
              <Link
                href="/dashboard/account"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Account Overview
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                Landing Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

