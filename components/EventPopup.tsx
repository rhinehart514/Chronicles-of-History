import React from 'react';

interface EventPopupProps {
  isOpen: boolean;
  event: GameEvent;
  onSelectOption: (optionId: string) => void;
}

interface GameEvent {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: string;
  options: EventOption[];
}

interface EventOption {
  id: string;
  name: string;
  description: string;
  effects: EventEffect[];
}

interface EventEffect {
  type: string;
  value: number | string;
  duration?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  political: 'border-purple-500 bg-purple-50',
  economic: 'border-amber-500 bg-amber-50',
  military: 'border-red-500 bg-red-50',
  religious: 'border-blue-500 bg-blue-50',
  cultural: 'border-pink-500 bg-pink-50',
  natural: 'border-green-500 bg-green-50',
  diplomatic: 'border-cyan-500 bg-cyan-50'
};

export const EventPopup: React.FC<EventPopupProps> = ({
  isOpen,
  event,
  onSelectOption
}) => {
  if (!isOpen) return null;

  const borderColor = CATEGORY_COLORS[event.category] || 'border-stone-500 bg-stone-50';

  const formatEffect = (effect: EventEffect) => {
    const value = typeof effect.value === 'number' ? effect.value : effect.value;
    const sign = typeof effect.value === 'number' && effect.value > 0 ? '+' : '';
    const duration = effect.duration ? ` (${effect.duration} months)` : '';
    const type = effect.type.replace(/_/g, ' ');
    return `${sign}${value} ${type}${duration}`;
  };

  const getEffectColor = (effect: EventEffect) => {
    if (typeof effect.value !== 'number') return 'text-stone-600';
    if (effect.type.includes('cost') || effect.type.includes('maintenance')) {
      return effect.value > 0 ? 'text-red-600' : 'text-green-600';
    }
    return effect.value > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={`bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-lg border-4 ${borderColor.split(' ')[0]}`}>
        {/* Header */}
        <div className={`p-4 rounded-t-lg ${borderColor.split(' ')[1]}`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{event.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-stone-800">{event.title}</h2>
              <div className="text-sm text-stone-500 capitalize">{event.category} Event</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-stone-200">
          <p className="text-stone-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          {event.options.map(option => (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className="w-full p-4 rounded-lg border-2 border-stone-200 bg-white text-left hover:border-amber-400 hover:bg-amber-50 transition-all"
            >
              <div className="font-semibold text-stone-800 mb-1">{option.name}</div>
              <div className="text-sm text-stone-600 mb-2">{option.description}</div>
              {option.effects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {option.effects.map((effect, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded bg-stone-100 ${getEffectColor(effect)}`}
                    >
                      {formatEffect(effect)}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
