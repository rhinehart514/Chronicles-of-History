import React from 'react';

export interface QueuedEvent {
  id: string;
  type: 'event' | 'decision' | 'notification' | 'war' | 'diplomacy';
  priority: number; // Higher = more urgent
  title: string;
  preview: string;
  icon: string;
  year: number;
}

interface EventQueueProps {
  events: QueuedEvent[];
  onSelectEvent: (id: string) => void;
  onDismiss: (id: string) => void;
  maxVisible?: number;
}

export const EventQueue: React.FC<EventQueueProps> = ({
  events,
  onSelectEvent,
  onDismiss,
  maxVisible = 5
}) => {
  if (events.length === 0) return null;

  // Sort by priority
  const sortedEvents = [...events].sort((a, b) => b.priority - a.priority);
  const visibleEvents = sortedEvents.slice(0, maxVisible);
  const hiddenCount = events.length - maxVisible;

  const typeColors: Record<QueuedEvent['type'], string> = {
    event: 'bg-purple-500',
    decision: 'bg-amber-500',
    notification: 'bg-blue-500',
    war: 'bg-red-500',
    diplomacy: 'bg-green-500'
  };

  return (
    <div className="fixed right-4 top-20 w-72 space-y-2 z-40">
      {visibleEvents.map((event, index) => (
        <div
          key={event.id}
          className={`bg-[#f4efe4] rounded-lg shadow-lg border-l-4 ${
            typeColors[event.type].replace('bg-', 'border-')
          } transform transition-all duration-300`}
          style={{
            opacity: 1 - index * 0.1,
            transform: `translateX(${index * 4}px)`
          }}
        >
          <button
            onClick={() => onSelectEvent(event.id)}
            className="w-full p-3 text-left hover:bg-stone-100 rounded-r-lg"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${typeColors[event.type]}`} />
                <span className="font-semibold text-stone-800 text-sm">
                  {event.title}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(event.id);
                }}
                className="text-stone-400 hover:text-stone-600 text-xs"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
              {event.preview}
            </p>
          </button>
        </div>
      ))}

      {hiddenCount > 0 && (
        <div className="text-center text-xs text-stone-500">
          +{hiddenCount} more events
        </div>
      )}
    </div>
  );
};

// Compact indicator for header
export const EventIndicator: React.FC<{
  count: number;
  hasUrgent: boolean;
  onClick: () => void;
}> = ({ count, hasUrgent, onClick }) => {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`relative px-2 py-1 rounded flex items-center gap-1 ${
        hasUrgent
          ? 'bg-red-100 text-red-700 animate-pulse'
          : 'bg-amber-100 text-amber-700'
      }`}
    >
      <span>📋</span>
      <span className="text-sm font-bold">{count}</span>
    </button>
  );
};

export default EventQueue;
