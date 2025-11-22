// Game notification and alert system

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  icon: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  actions?: NotificationAction[];
  data?: Record<string, any>;
}

export type NotificationType =
  | 'event'
  | 'war'
  | 'diplomacy'
  | 'economy'
  | 'military'
  | 'religion'
  | 'disaster'
  | 'achievement'
  | 'system';

export type NotificationCategory = 'alert' | 'info' | 'warning' | 'success' | 'error';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
}

export interface NotificationSettings {
  pauseOnCritical: boolean;
  soundEnabled: boolean;
  groupSimilar: boolean;
  autoRead: number; // seconds to auto-mark as read
  maxHistory: number;
}

// Default settings
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pauseOnCritical: true,
  soundEnabled: true,
  groupSimilar: true,
  autoRead: 30,
  maxHistory: 100
};

// Notification type icons
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  event: '📜',
  war: '⚔️',
  diplomacy: '🤝',
  economy: '💰',
  military: '🎖️',
  religion: '✝️',
  disaster: '🔥',
  achievement: '🏆',
  system: '⚙️'
};

// Category colors
export const CATEGORY_COLORS: Record<NotificationCategory, string> = {
  alert: 'amber',
  info: 'blue',
  warning: 'orange',
  success: 'green',
  error: 'red'
};

// Priority order
export const PRIORITY_ORDER: Record<NotificationPriority, number> = {
  low: 1,
  normal: 2,
  high: 3,
  critical: 4
};

// Create notification
export function createNotification(
  type: NotificationType,
  category: NotificationCategory,
  title: string,
  message: string,
  priority: NotificationPriority = 'normal',
  actions?: NotificationAction[],
  data?: Record<string, any>
): Notification {
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    category,
    title,
    message,
    icon: NOTIFICATION_ICONS[type],
    priority,
    timestamp: new Date().toISOString(),
    read: false,
    actionable: !!actions?.length,
    actions,
    data
  };
}

// Filter notifications
export function filterNotifications(
  notifications: Notification[],
  filters: {
    type?: NotificationType;
    category?: NotificationCategory;
    unreadOnly?: boolean;
    minPriority?: NotificationPriority;
  }
): Notification[] {
  return notifications.filter(n => {
    if (filters.type && n.type !== filters.type) return false;
    if (filters.category && n.category !== filters.category) return false;
    if (filters.unreadOnly && n.read) return false;
    if (filters.minPriority &&
        PRIORITY_ORDER[n.priority] < PRIORITY_ORDER[filters.minPriority]) {
      return false;
    }
    return true;
  });
}

// Sort notifications
export function sortNotifications(
  notifications: Notification[],
  by: 'priority' | 'time' = 'time'
): Notification[] {
  return [...notifications].sort((a, b) => {
    if (by === 'priority') {
      const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

// Get unread count
export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter(n => !n.read).length;
}

// Get critical count
export function getCriticalCount(notifications: Notification[]): number {
  return notifications.filter(n => n.priority === 'critical' && !n.read).length;
}

// Mark as read
export function markAsRead(
  notifications: Notification[],
  ids: string[]
): Notification[] {
  return notifications.map(n =>
    ids.includes(n.id) ? { ...n, read: true } : n
  );
}

// Mark all as read
export function markAllAsRead(notifications: Notification[]): Notification[] {
  return notifications.map(n => ({ ...n, read: true }));
}

// Delete notification
export function deleteNotification(
  notifications: Notification[],
  id: string
): Notification[] {
  return notifications.filter(n => n.id !== id);
}

// Group similar notifications
export function groupNotifications(
  notifications: Notification[]
): Map<string, Notification[]> {
  const groups = new Map<string, Notification[]>();

  for (const notif of notifications) {
    const key = `${notif.type}_${notif.category}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(notif);
  }

  return groups;
}

// Prune old notifications
export function pruneNotifications(
  notifications: Notification[],
  maxHistory: number = DEFAULT_NOTIFICATION_SETTINGS.maxHistory
): Notification[] {
  const sorted = sortNotifications(notifications, 'time');
  return sorted.slice(0, maxHistory);
}

// Check if should pause
export function shouldPauseGame(
  notification: Notification,
  settings: NotificationSettings
): boolean {
  return settings.pauseOnCritical && notification.priority === 'critical';
}

// Format timestamp
export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}

export default {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_ICONS,
  CATEGORY_COLORS,
  PRIORITY_ORDER,
  createNotification,
  filterNotifications,
  sortNotifications,
  getUnreadCount,
  getCriticalCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  groupNotifications,
  pruneNotifications,
  shouldPauseGame,
  formatNotificationTime
};
