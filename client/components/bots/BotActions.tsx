'use client';

import React, { useState } from 'react';
import { RotateCw, Square, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { DeleteBotDialog } from '@/components/bots/DeleteBotDialog';

interface BotActionsProps {
  botId: string;
  botName: string;
  compact?: boolean;
  onActionComplete?: () => void;
  onDeleted?: () => void;
}

export function BotActions({
  botId,
  botName,
  compact = false,
  onActionComplete,
  onDeleted,
}: BotActionsProps) {
  const { showToast } = useToast();
  const [busyAction, setBusyAction] = useState<'restart' | 'stop' | 'delete' | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleRestart = async () => {
    setBusyAction('restart');
    try {
      await api.restartBot(botId);
      showToast(`Restart signal sent to ${botName}`, 'success');
      onActionComplete?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to restart bot',
        'error'
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleStop = async () => {
    setBusyAction('stop');
    try {
      await api.stopBot(botId);
      showToast(`Stop signal sent to ${botName}`, 'success');
      onActionComplete?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to stop bot',
        'error'
      );
    } finally {
      setBusyAction(null);
    }
  };

  const handleDelete = async () => {
    setBusyAction('delete');
    try {
      await api.deleteBot(botId);
      showToast(`${botName} deleted`, 'success');
      setDeleteOpen(false);
      onDeleted?.();
      onActionComplete?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete bot',
        'error'
      );
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size={compact ? 'sm' : 'md'}
          variant="secondary"
          loading={busyAction === 'restart'}
          disabled={busyAction !== null}
          onClick={handleRestart}
          icon={<RotateCw className="h-3.5 w-3.5" />}
          aria-label={`Restart ${botName}`}
        >
          {!compact && 'Restart'}
        </Button>

        <Button
          size={compact ? 'sm' : 'md'}
          variant="secondary"
          loading={busyAction === 'stop'}
          disabled={busyAction !== null}
          onClick={handleStop}
          icon={<Square className="h-3.5 w-3.5" />}
          aria-label={`Stop ${botName}`}
        >
          {!compact && 'Stop'}
        </Button>

        <Button
          size={compact ? 'sm' : 'md'}
          variant="danger"
          disabled={busyAction !== null}
          onClick={() => setDeleteOpen(true)}
          icon={<Trash2 className="h-3.5 w-3.5" />}
          aria-label={`Delete ${botName}`}
        >
          {!compact && 'Delete'}
        </Button>
      </div>

      <DeleteBotDialog
        open={deleteOpen}
        botName={botName}
        loading={busyAction === 'delete'}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

