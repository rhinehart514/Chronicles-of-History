import React, { useState } from 'react';

interface DebugPanelProps {
  gameState: Record<string, any>;
  onClose: () => void;
  onModifyValue?: (path: string, value: any) => void;
  onTriggerEvent?: (eventId: string) => void;
  onAddResource?: (resource: string, amount: number) => void;
  onTeleportArmy?: (armyId: string, provinceId: string) => void;
}

export default function DebugPanel({
  gameState,
  onClose,
  onModifyValue,
  onTriggerEvent,
  onAddResource,
  onTeleportArmy
}: DebugPanelProps) {
  const [activeTab, setActiveTab] = useState<'resources' | 'events' | 'state'>('resources');
  const [customCommand, setCustomCommand] = useState('');

  const resources = [
    { id: 'gold', label: 'Gold', amounts: [100, 1000, 10000] },
    { id: 'manpower', label: 'Manpower', amounts: [10000, 50000, 100000] },
    { id: 'admin', label: 'Admin Points', amounts: [100, 500, 999] },
    { id: 'diplo', label: 'Diplo Points', amounts: [100, 500, 999] },
    { id: 'mil', label: 'Military Points', amounts: [100, 500, 999] },
    { id: 'prestige', label: 'Prestige', amounts: [10, 50, 100] },
    { id: 'stability', label: 'Stability', amounts: [1, 2, 3] }
  ];

  const commonEvents = [
    'random_good_event',
    'random_bad_event',
    'heir_born',
    'ruler_dies',
    'civil_war',
    'religious_turmoil',
    'golden_age'
  ];

  const renderResources = () => (
    <div className="space-y-3">
      {resources.map(resource => (
        <div key={resource.id} className="bg-stone-700 rounded p-3">
          <div className="text-sm font-medium text-amber-100 mb-2">{resource.label}</div>
          <div className="flex gap-2">
            {resource.amounts.map(amount => (
              <button
                key={amount}
                onClick={() => onAddResource?.(resource.id, amount)}
                className="flex-1 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
              >
                +{amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-stone-600 pt-3 mt-3">
        <div className="text-sm font-medium text-stone-400 mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onModifyValue?.('player.warExhaustion', 0)}
            className="py-2 bg-stone-600 hover:bg-stone-500 text-xs rounded"
          >
            Remove War Exhaustion
          </button>
          <button
            onClick={() => onModifyValue?.('player.inflation', 0)}
            className="py-2 bg-stone-600 hover:bg-stone-500 text-xs rounded"
          >
            Remove Inflation
          </button>
          <button
            onClick={() => onModifyValue?.('player.corruption', 0)}
            className="py-2 bg-stone-600 hover:bg-stone-500 text-xs rounded"
          >
            Remove Corruption
          </button>
          <button
            onClick={() => onModifyValue?.('player.legitimacy', 100)}
            className="py-2 bg-stone-600 hover:bg-stone-500 text-xs rounded"
          >
            Max Legitimacy
          </button>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-3">
      <div className="text-sm font-medium text-stone-400 mb-2">Trigger Event</div>
      <div className="space-y-2">
        {commonEvents.map(event => (
          <button
            key={event}
            onClick={() => onTriggerEvent?.(event)}
            className="w-full py-2 bg-stone-600 hover:bg-stone-500 text-left px-3 rounded text-sm"
          >
            {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="border-t border-stone-600 pt-3 mt-3">
        <div className="text-sm font-medium text-stone-400 mb-2">Custom Event</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Event ID..."
            className="flex-1 bg-stone-700 px-3 py-2 rounded text-sm"
            value={customCommand}
            onChange={e => setCustomCommand(e.target.value)}
          />
          <button
            onClick={() => {
              if (customCommand) {
                onTriggerEvent?.(customCommand);
                setCustomCommand('');
              }
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
          >
            Fire
          </button>
        </div>
      </div>
    </div>
  );

  const renderState = () => (
    <div className="space-y-3">
      <div className="text-sm font-medium text-stone-400 mb-2">Game State</div>
      <div className="bg-stone-900 rounded p-3 max-h-96 overflow-y-auto">
        <pre className="text-xs text-stone-300 whitespace-pre-wrap">
          {JSON.stringify(gameState, null, 2)}
        </pre>
      </div>
    </div>
  );

  const tabs = [
    { id: 'resources' as const, label: 'Resources' },
    { id: 'events' as const, label: 'Events' },
    { id: 'state' as const, label: 'State' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center bg-red-900/30">
          <h2 className="text-xl font-bold text-red-100">🔧 Debug Panel</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-red-400 px-4 py-2 bg-red-900/20">
          ⚠️ Debug mode - changes cannot be undone
        </div>

        <div className="border-b border-stone-700">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-red-400 border-b-2 border-red-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'resources' && renderResources()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'state' && renderState()}
        </div>
      </div>
    </div>
  );
}
