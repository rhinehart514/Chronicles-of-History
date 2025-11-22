import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    default: {
      icon: '❓',
      confirmBg: 'bg-amber-600 hover:bg-amber-700',
      border: 'border-amber-600'
    },
    danger: {
      icon: '⚠️',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-600'
    },
    warning: {
      icon: '⚡',
      confirmBg: 'bg-orange-600 hover:bg-orange-700',
      border: 'border-orange-600'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className={`bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-md border-4 ${styles.border}`}>
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex items-center gap-3">
          <span className="text-2xl">{styles.icon}</span>
          <h3 className="text-lg font-bold text-stone-800">{title}</h3>
        </div>

        {/* Message */}
        <div className="p-4">
          <p className="text-stone-700">{message}</p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-stone-300 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded font-semibold transition-colors ${styles.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Preset dialogs for common actions
export const presetDialogs = {
  exitWithoutSaving: {
    title: 'Exit Without Saving?',
    message: 'You have unsaved progress. Are you sure you want to exit? All unsaved changes will be lost.',
    confirmText: 'Exit',
    cancelText: 'Stay',
    variant: 'danger' as const
  },
  overwriteSave: {
    title: 'Overwrite Save?',
    message: 'This will replace the existing save file. This action cannot be undone.',
    confirmText: 'Overwrite',
    cancelText: 'Cancel',
    variant: 'warning' as const
  },
  deleteSave: {
    title: 'Delete Save?',
    message: 'Are you sure you want to delete this save file? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Keep',
    variant: 'danger' as const
  },
  newGame: {
    title: 'Start New Game?',
    message: 'Starting a new game will end your current session. Make sure to save first if you want to continue later.',
    confirmText: 'New Game',
    cancelText: 'Cancel',
    variant: 'warning' as const
  },
  abdicate: {
    title: 'Abdicate Throne?',
    message: 'Abdicating will end your reign and pass power to a new ruler. Your current progress will be recorded.',
    confirmText: 'Abdicate',
    cancelText: 'Continue Ruling',
    variant: 'danger' as const
  },
  declareWar: {
    title: 'Declare War?',
    message: 'Declaring war is a serious action that will have lasting consequences for your nation and its people.',
    confirmText: 'Declare War',
    cancelText: 'Seek Peace',
    variant: 'danger' as const
  },
  breakAlliance: {
    title: 'Break Alliance?',
    message: 'Breaking this alliance will damage your reputation and may create a new enemy.',
    confirmText: 'Break Alliance',
    cancelText: 'Maintain Alliance',
    variant: 'warning' as const
  }
};

// Hook for managing confirm dialogs
export function useConfirmDialog() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>;
    onConfirm: () => void;
  }>({
    isOpen: false,
    config: { title: '', message: '' },
    onConfirm: () => {}
  });

  const confirm = React.useCallback((
    config: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>,
    onConfirm: () => void
  ) => {
    setDialog({ isOpen: true, config, onConfirm });
  }, []);

  const close = React.useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = React.useCallback(() => {
    dialog.onConfirm();
    close();
  }, [dialog.onConfirm, close]);

  return {
    dialogProps: {
      isOpen: dialog.isOpen,
      ...dialog.config,
      onConfirm: handleConfirm,
      onCancel: close
    },
    confirm,
    close
  };
}

export default ConfirmDialog;
