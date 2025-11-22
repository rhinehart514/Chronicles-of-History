import React, { useState } from 'react';

interface MessageInboxProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onMarkRead: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onRespond: (messageId: string, response: string) => void;
}

export interface Message {
  id: string;
  type: MessageType;
  sender: string;
  senderFlag?: string;
  subject: string;
  content: string;
  date: { year: number; month: number; day: number };
  read: boolean;
  urgent: boolean;
  actions?: MessageAction[];
  relatedTo?: {
    type: 'war' | 'treaty' | 'trade' | 'alliance' | 'event';
    id: string;
  };
}

export type MessageType =
  | 'diplomatic'
  | 'military'
  | 'economic'
  | 'event'
  | 'warning'
  | 'notification';

export interface MessageAction {
  id: string;
  label: string;
  type: 'accept' | 'decline' | 'negotiate' | 'ignore';
}

export const MessageInbox: React.FC<MessageInboxProps> = ({
  isOpen,
  onClose,
  messages,
  onMarkRead,
  onDelete,
  onRespond
}) => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<MessageType | 'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filters = [
    { id: 'all', name: 'All', icon: '📬' },
    { id: 'unread', name: 'Unread', icon: '📩' },
    { id: 'diplomatic', name: 'Diplomatic', icon: '🤝' },
    { id: 'military', name: 'Military', icon: '⚔️' },
    { id: 'economic', name: 'Economic', icon: '💰' },
    { id: 'event', name: 'Events', icon: '📜' }
  ];

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !m.read;
    return m.type === filter;
  }).sort((a, b) => {
    // Sort by date descending
    if (b.date.year !== a.date.year) return b.date.year - a.date.year;
    if (b.date.month !== a.date.month) return b.date.month - a.date.month;
    return (b.date.day || 1) - (a.date.day || 1);
  });

  const selected = messages.find(m => m.id === selectedMessage);
  const unreadCount = messages.filter(m => !m.read).length;

  const handleSelect = (messageId: string) => {
    setSelectedMessage(messageId);
    if (!messages.find(m => m.id === messageId)?.read) {
      onMarkRead(messageId);
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'diplomatic': return '🤝';
      case 'military': return '⚔️';
      case 'economic': return '💰';
      case 'event': return '📜';
      case 'warning': return '⚠️';
      case 'notification': return '📢';
      default: return '📧';
    }
  };

  const formatDate = (date: { year: number; month: number; day: number }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.month - 1]} ${date.day || 1}, ${date.year}`;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">📬 Messages</h2>
            <div className="text-sm text-stone-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'No unread messages'}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filter */}
        <div className="p-2 border-b border-stone-200 flex gap-1 flex-wrap">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f.id ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {f.icon} {f.name}
              {f.id === 'unread' && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Message list */}
          <div className="w-1/3 border-r border-stone-200 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-center text-stone-500 py-8">No messages</p>
            ) : (
              filteredMessages.map(message => (
                <button
                  key={message.id}
                  onClick={() => handleSelect(message.id)}
                  className={`w-full p-3 text-left border-b border-stone-200 hover:bg-stone-100 ${
                    selectedMessage === message.id ? 'bg-stone-100' : ''
                  } ${!message.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getTypeIcon(message.type)}</span>
                    {message.senderFlag && <span>{message.senderFlag}</span>}
                    <span className={`text-sm font-medium truncate ${
                      !message.read ? 'text-stone-800' : 'text-stone-600'
                    }`}>
                      {message.sender}
                    </span>
                    {message.urgent && <span className="text-red-500">!</span>}
                  </div>
                  <div className={`text-sm truncate ${
                    !message.read ? 'font-semibold text-stone-800' : 'text-stone-600'
                  }`}>
                    {message.subject}
                  </div>
                  <div className="text-xs text-stone-400">
                    {formatDate(message.date)}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Message content */}
          <div className="w-2/3 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(selected.type)}</span>
                    {selected.senderFlag && <span className="text-xl">{selected.senderFlag}</span>}
                    <div>
                      <h3 className="font-bold text-stone-800">{selected.sender}</h3>
                      <div className="text-xs text-stone-500">{formatDate(selected.date)}</div>
                    </div>
                    {selected.urgent && (
                      <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Urgent
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-stone-800 text-lg">{selected.subject}</h4>
                </div>

                <div className="prose prose-sm text-stone-700 mb-4">
                  <p className="whitespace-pre-wrap">{selected.content}</p>
                </div>

                {/* Actions */}
                {selected.actions && selected.actions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selected.actions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => onRespond(selected.id, action.id)}
                        className={`w-full py-2 rounded font-medium ${
                          action.type === 'accept'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : action.type === 'decline'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : action.type === 'negotiate'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => onDelete(selected.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete Message
                </button>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a message to read
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInbox;
