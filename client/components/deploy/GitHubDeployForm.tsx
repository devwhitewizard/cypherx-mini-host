'use client';

import React, { useState } from 'react';
import { AlertCircle, GitBranch, Rocket } from 'lucide-react';
import { api } from '@/lib/api';
import type { DeploymentResponse, EnvVarEntry } from '@/types/deployment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { EnvironmentVariablesEditor } from '@/components/deploy/EnvironmentVariablesEditor';

const NODE_VERSIONS = [
  { value: '24', label: 'Node.js 24 (Latest)' },
  { value: '22', label: 'Node.js 22 (LTS)' },
  { value: '20', label: 'Node.js 20 (LTS)' },
  { value: '18', label: 'Node.js 18' },
];

interface GitHubDeployFormProps {
  onDeploymentStarted: (deployment: DeploymentResponse) => void;
}

export function GitHubDeployForm({
  onDeploymentStarted,
}: GitHubDeployFormProps) {
  const { showToast } = useToast();
  const [repoUrl, setRepoUrl] = useState('');
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [nodeVersion, setNodeVersion] = useState('24');
  const [envVars, setEnvVars] = useState<EnvVarEntry[]>([]);
  const [errors, setErrors] = useState<{ repoUrl?: string; botName?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: { repoUrl?: string; botName?: string } = {};
    if (!repoUrl.trim()) {
      next.repoUrl = 'GitHub repository URL is required';
    } else {
      try {
        const url = new URL(repoUrl.trim());
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          next.repoUrl = 'URL must start with http:// or https://';
        }
      } catch {
        next.repoUrl = 'Enter a valid repository URL';
      }
    }

    if (!botName.trim()) {
      next.botName = 'Bot name is required';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    const cleanConfig = envVars
      .filter((item) => item.key.trim() !== '')
      .map((item) => ({ key: item.key.trim(), value: item.value }));

    setSubmitting(true);
    try {
      const response = await api.deployFromGithub({
        repoUrl: repoUrl.trim(),
        botName: botName.trim(),
        description: description.trim() || undefined,
        nodeVersion,
        config: cleanConfig,
      });
      showToast('GitHub deployment submitted', 'success');
      onDeploymentStarted(response);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to start deployment';
      setSubmitError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <GitBranch className="h-4 w-4 text-indigo-400" />
        <span>Deploy directly from a public or connected GitHub repository.</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="repoUrl"
          label="GitHub Repository URL *"
          placeholder="https://github.com/owner/repository"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          error={errors.repoUrl}
        />

        <Input
          name="botName"
          label="Bot Name *"
          placeholder="my-discord-bot"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          error={errors.botName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="description"
          label="Description"
          placeholder="Optional short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          name="nodeVersion"
          label="Node.js Version"
          options={NODE_VERSIONS}
          value={nodeVersion}
          onChange={(e) => setNodeVersion(e.target.value)}
        />
      </div>

      <EnvironmentVariablesEditor entries={envVars} onChange={setEnvVars} />

      {submitError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          loading={submitting}
          icon={<Rocket className="h-4 w-4" />}
        >
          Deploy from GitHub
        </Button>
      </div>
    </form>
  );
}

