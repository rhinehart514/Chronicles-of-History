import React, { useState } from 'react';

export interface GameNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'event';
  title: string;
  message: string;
  timestamp: number;
  year: number;
  read: boolean;
  actionable?: {
    label: string;
    action: string;
  };
  category: 'military' | 'economy' | 'diplomacy' | 'internal' | 'system';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: GameNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
  onAction: (action: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClear,
  onClearAll,
  onAction
}) => {
  const [filter, setFilter] = useState<'all' | GameNotification['category']>('all');

  if (!isOpen) return null;

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '🚨',
    event: '📜'
  };

  const typeColors = {
    info: 'border-blue-500 bg-blue-50',
    success: 'border-green-500 bg-green-50',
    warning: 'border-amber-500 bg-amber-50',
    danger: 'border-red-500 bg-red-50',
    event: 'border-purple-500 bg-purple-50'
  };

  const categoryIcons = {
    military: '⚔️',
    economy: '💰',
    diplomacy: '🤝',
    internal: '🏛️',
    system: '⚙️'
  };

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' || n.category === filter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (timestamp: number, year: number): string => {
    const date = new Date(timestamp);
    return `${year} - ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-800">🔔 Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filter & actions */}
        <div className="p-3 border-b border-stone-200 flex justify-between items-center">
          <div className="flex gap-1">
            {(['all', 'military', 'economy', 'diplomacy', 'internal'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-1 rounded text-xs ${
                  filter === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {cat === 'all' ? 'All' : categoryIcons[cat]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-stone-500 hover:text-stone-700"
            >
              Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              <p className="text-4xl mb-2">📭</p>
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 ${!notification.read ? 'bg-amber-50' : ''}`}
                  onClick={() => onMarkRead(notification.id)}
                >
                  <div className={`border-l-4 p-3 rounded-r ${typeColors[notification.type]}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span>{typeIcons[notification.type]}</span>
                        <span className="font-semibold text-stone-800">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClear(notification.id);
                        }}
                        className="text-stone-400 hover:text-stone-600 text-sm"
                      >
                        ×
                      </button>
                    </div>

                    <p className="text-sm text-stone-600 mb-2">{notification.message}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-400">
                        {formatTime(notification.timestamp, notification.year)}
                      </span>

                      {notification.actionable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAction(notification.actionable!.action);
                          }}
                          className="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                        >
                          {notification.actionable.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-center text-xs text-stone-500">
          {notifications.length} total • {unreadCount} unread
        </div>
      </div>
    </div>
  );
};

// Notification badge for header
export const NotificationBadge: React.FC<{
  count: number;
  onClick: () => void;
}> = ({ count, onClick }) => (
  <button
    onClick={onClick}
    className="relative p-2 hover:bg-stone-700 rounded"
    title="Notifications"
  >
    <span className="text-xl">🔔</span>
    {count > 0 && (
      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] text-center">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);

export default NotificationCenter;
