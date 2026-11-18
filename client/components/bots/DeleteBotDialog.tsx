'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteBotDialogProps {
  open: boolean;
  botName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBotDialog({
  open,
  botName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteBotDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Bot"
      description="This action permanently deletes the bot from CypherX and cannot be undone."
    >
      <div className="flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-200">
        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        <span>
          You are about to permanently delete{' '}
          <strong className="font-semibold text-white">{botName}</strong>.
        </span>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          Delete Bot
        </Button>
      </div>
    </Modal>
  );
}

