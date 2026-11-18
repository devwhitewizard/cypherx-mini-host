'use client';

import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  FileArchive,
  Rocket,
  UploadCloud,
  X,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn, formatBytes } from '@/lib/utils';
import type { DeploymentResponse, EnvVarEntry } from '@/types/deployment';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { EnvironmentVariablesEditor } from '@/components/deploy/EnvironmentVariablesEditor';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const NODE_VERSIONS = [
  { value: '24', label: 'Node.js 24 (Latest)' },
  { value: '22', label: 'Node.js 22 (LTS)' },
  { value: '20', label: 'Node.js 20 (LTS)' },
  { value: '18', label: 'Node.js 18' },
];

interface ZipDeployFormProps {
  onDeploymentStarted: (deployment: DeploymentResponse) => void;
}

export function ZipDeployForm({ onDeploymentStarted }: ZipDeployFormProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [nodeVersion, setNodeVersion] = useState('24');
  const [envVars, setEnvVars] = useState<EnvVarEntry[]>([]);
  const [errors, setErrors] = useState<{ file?: string; botName?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    const isZip =
      selected.name.toLowerCase().endsWith('.zip') ||
      selected.type === 'application/zip' ||
      selected.type === 'application/x-zip-compressed';

    if (!isZip) {
      setErrors((prev) => ({
        ...prev,
        file: 'Only .zip archive files are supported',
      }));
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        file: 'File exceeds the 50 MB maximum upload limit',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0] || null;
    handleFileSelect(dropped);
  };

  const validate = () => {
    const next: { file?: string; botName?: string } = {};
    if (!file) {
      next.file = 'Please select a .zip archive to upload';
    } else if (file.size > MAX_FILE_SIZE) {
      next.file = 'File exceeds the 50 MB maximum upload limit';
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

    if (!validate() || !file) return;

    const cleanConfig = envVars
      .filter((item) => item.key.trim() !== '')
      .map((item) => ({ key: item.key.trim(), value: item.value }));

    setSubmitting(true);
    try {
      const response = await api.deployFromUpload({
        file,
        botName: botName.trim(),
        description: description.trim() || undefined,
        nodeVersion,
        config: cleanConfig,
      });
      showToast('ZIP deployment uploaded', 'success');
      onDeploymentStarted(response);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to upload deployment';
      setSubmitError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">
          Bot Archive (.zip, max 50 MB) *
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            'cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors',
            dragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : errors.file
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-border bg-[#0c0c0f] hover:border-zinc-700'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileArchive className="h-7 w-7 text-indigo-400 shrink-0" />
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-zinc-400">
                  {formatBytes(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                aria-label="Remove selected file"
                className="ml-2 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-zinc-500" />
              <p className="mt-2 text-sm text-zinc-300">
                Drag and drop your <code className="text-indigo-400">.zip</code>{' '}
                archive here, or click to browse
              </p>
              <p className="mt-1 text-xs text-zinc-500">Maximum size: 50 MB</p>
            </div>
          )}
        </div>
        {errors.file && (
          <p className="mt-1.5 text-xs text-red-400">{errors.file}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="zipBotName"
          label="Bot Name *"
          placeholder="my-uploaded-bot"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          error={errors.botName}
        />

        <Select
          name="zipNodeVersion"
          label="Node.js Version"
          options={NODE_VERSIONS}
          value={nodeVersion}
          onChange={(e) => setNodeVersion(e.target.value)}
        />
      </div>

      <Input
        name="zipDescription"
        label="Description"
        placeholder="Optional short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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
          Upload & Deploy
        </Button>
      </div>
    </form>
  );
}

