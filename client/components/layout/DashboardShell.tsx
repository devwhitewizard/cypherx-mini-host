'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar, type BackendStatus } from '@/components/layout/Topbar';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');

  const checkBackend = useCallback(async () => {
    setBackendStatus('checking');
    try {
      const res = await api.checkHealth();
      setBackendStatus(res?.success ? 'connected' : 'offline');
    } catch {
      setBackendStatus('offline');
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  return (
    <div className="min-h-screen flex bg-background text-zinc-100">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          onOpenMobileMenu={() => setMobileOpen(true)}
          backendStatus={backendStatus}
          onRefreshHealth={checkBackend}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-6xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

