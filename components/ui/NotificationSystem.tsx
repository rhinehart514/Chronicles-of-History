import React, { useState, useCallback, createContext, useContext } from 'react';
import { X, Info, AlertTriangle, CheckCircle, Skull, Sword, Crown, Lightbulb } from 'lucide-react';

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'danger' | 'death' | 'war' | 'succession' | 'research';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = permanent
}

// Context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Container that renders notifications
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Individual toast component
const NotificationToast: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const { type, title, message } = notification;

  // Type-specific styling
  const typeConfig: Record<NotificationType, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
    info: {
      icon: <Info size={18} />,
      bg: 'bg-blue-900/95',
      border: 'border-blue-500',
      text: 'text-blue-100'
    },
    success: {
      icon: <CheckCircle size={18} />,
      bg: 'bg-green-900/95',
      border: 'border-green-500',
      text: 'text-green-100'
    },
    warning: {
      icon: <AlertTriangle size={18} />,
      bg: 'bg-yellow-900/95',
      border: 'border-yellow-500',
      text: 'text-yellow-100'
    },
    danger: {
      icon: <AlertTriangle size={18} />,
      bg: 'bg-red-900/95',
      border: 'border-red-500',
      text: 'text-red-100'
    },
    death: {
      icon: <Skull size={18} />,
      bg: 'bg-stone-900/95',
      border: 'border-stone-500',
      text: 'text-stone-100'
    },
    war: {
      icon: <Sword size={18} />,
      bg: 'bg-red-950/95',
      border: 'border-red-600',
      text: 'text-red-100'
    },
    succession: {
      icon: <Crown size={18} />,
      bg: 'bg-purple-900/95',
      border: 'border-purple-500',
      text: 'text-purple-100'
    },
    research: {
      icon: <Lightbulb size={18} />,
      bg: 'bg-indigo-900/95',
      border: 'border-indigo-500',
      text: 'text-indigo-100'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        pointer-events-auto
        ${config.bg} ${config.text}
        border-l-4 ${config.border}
        backdrop-blur
        rounded-r-lg shadow-xl
        p-3 min-w-[280px] max-w-[360px]
        animate-in slide-in-from-right duration-300
        font-serif
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">{title}</div>
          {message && (
            <div className="text-xs opacity-80 mt-1">{message}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationProvider;
