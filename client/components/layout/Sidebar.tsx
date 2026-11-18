'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Rocket,
  Terminal,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/bots', label: 'My Bots', icon: Bot, exact: false },
  { href: '/dashboard/deploy', label: 'Deploy Bot', icon: Rocket, exact: false },
  { href: '/dashboard/account', label: 'Account', icon: User, exact: false },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navContent = (isMobile = false) => (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'flex h-14 items-center border-b border-border px-4',
          collapsed && !isMobile ? 'justify-center px-2' : 'justify-between'
        )}
      >
        <Link
          href="/"
          onClick={isMobile ? onCloseMobile : undefined}
          className="flex items-center gap-2.5 text-zinc-100 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Terminal className="h-4 w-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                CypherX
              </span>
              <span className="block text-[11px] text-zinc-500">
                Control Center
              </span>
            </div>
          )}
        </Link>

        {isMobile ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          !collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Dashboard navigation">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onCloseMobile : undefined}
              title={collapsed && !isMobile ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed && !isMobile && 'justify-center px-2',
                active
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 border border-transparent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!isMobile && collapsed && (
        <div className="border-t border-border p-3 flex justify-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {(!collapsed || isMobile) && (
        <div className="border-t border-border p-3">
          <div className="rounded-lg bg-[#0c0c0f] border border-border px-3 py-2.5">
            <p className="text-[11px] font-medium text-zinc-400">
              Platform Proxy
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 truncate">
              Express API Gateway
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {navContent(false)}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-10 w-64 border-r border-border bg-surface"
            >
              {navContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

