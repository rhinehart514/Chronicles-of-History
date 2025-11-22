import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'achievement' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
  timestamp: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
}

// Helper functions for common notification types
export const notify = {
  success: (title: string, message?: string) => ({
    type: 'success' as const,
    title,
    message,
    icon: '✓'
  }),

  error: (title: string, message?: string) => ({
    type: 'error' as const,
    title,
    message,
    icon: '✕'
  }),

  info: (title: string, message?: string) => ({
    type: 'info' as const,
    title,
    message,
    icon: 'ℹ'
  }),

  warning: (title: string, message?: string) => ({
    type: 'warning' as const,
    title,
    message,
    icon: '⚠'
  }),

  achievement: (title: string, description: string, icon: string = '🏆') => ({
    type: 'achievement' as const,
    title: `Achievement Unlocked: ${title}`,
    message: description,
    icon,
    duration: 7000
  })
};

export default useNotifications;
