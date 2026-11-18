'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Terminal,
  Activity,
  Rocket,
} from 'lucide-react';

const FEATURES = [
  {
    icon: GitBranch,
    title: 'GitHub & ZIP Deployments',
    description:
      'Ship bots directly from a repository URL or upload a compressed archive up to 50 MB with custom Node.js versions and environment variables.',
  },
  {
    icon: Activity,
    title: 'Lifecycle & Runtime Logs',
    description:
      'Inspect bot status, stream recent runtime logs, and trigger restarts or stops from a single interface.',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated Backend Proxy',
    description:
      'All requests route through your standalone Express server so CypherX API credentials never touch the browser.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-zinc-100">
      {/* Header */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Terminal className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              CypherX Control Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/deploy"
              className="hidden sm:inline-flex text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Deploy Bot
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Open Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero + Preview */}
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-indigo-600/12 via-violet-600/5 to-transparent blur-3xl"
          />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">
                CypherX Platform Management
              </span>

              <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.12]">
                Control center for your hosted CypherX bots.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
                Deploy from GitHub or ZIP archives, monitor runtime logs, and
                manage bot lifecycles through a clean, local-first Express
                proxy architecture.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                >
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/deploy"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 transition-colors"
                >
                  <Rocket className="h-4 w-4 text-indigo-400" />
                  New Deployment
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="mt-12 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-border bg-[#0c0c0f] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="font-mono text-[11px] text-zinc-500">
                  /dashboard
                </span>
                <span className="text-[11px] text-zinc-500">Preview</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[190px_1fr]">
                <div className="hidden md:block border-r border-border p-3 space-y-1.5 bg-[#0d0d10]">
                  {['Overview', 'My Bots', 'Deploy Bot', 'Account'].map(
                    (item, idx) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                          idx === 0
                            ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/25'
                            : 'text-zinc-500'
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      'Total Bots',
                      'Running',
                      'Stopped',
                      'Account Credits',
                    ].map((label) => (
                      <div
                        key={label}
                        className="rounded-lg border border-border bg-[#0c0c0f] p-3"
                      >
                        <p className="text-[11px] text-zinc-500">{label}</p>
                        <div className="mt-2 h-5 w-12 rounded bg-zinc-800/80" />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border bg-[#0c0c0f] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-300">
                        Live API Architecture
                      </span>
                      <span className="font-mono text-[11px] text-indigo-400">
                        Next.js → Express → CypherX
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Connect your Express backend on port 5000 to view live
                      bot instances, stream logs, and trigger deployments.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/25 bg-indigo-500/10 text-indigo-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h2 className="mt-4 text-sm font-semibold text-zinc-100">
                    {feature.title}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 text-xs text-zinc-500">
          <span>CypherX Control Center</span>
          <span>Standalone Next.js Frontend · Connects via Express API</span>
        </div>
      </footer>
    </div>
  );
}

