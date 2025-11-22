import React, { useState } from 'react';
import {
  Faction,
  FactionInteraction,
  DEFAULT_FACTIONS,
  FACTION_INTERACTIONS,
  getFactionMood,
  getFactionMoodColor,
  isDemandMet
} from '../data/factionSystem';

interface FactionPanelProps {
  factions: Faction[];
  gameState: Record<string, any>;
  onClose: () => void;
  onInteract?: (factionId: string, interactionId: string) => void;
}

export default function FactionPanel({
  factions,
  gameState,
  onClose,
  onInteract
}: FactionPanelProps) {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(
    factions.length > 0 ? factions[0] : null
  );

  const totalInfluence = factions.reduce((sum, f) => sum + f.influence, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">🏛️ Factions</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Faction list */}
          <div className="w-1/2 p-4 border-r border-stone-700 overflow-y-auto space-y-3">
            {factions.map(faction => (
              <div
                key={faction.id}
                onClick={() => setSelectedFaction(faction)}
                className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedFaction?.id === faction.id
                    ? 'ring-2 ring-amber-500'
                    : 'hover:bg-stone-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{faction.icon}</span>
                    <span className="font-medium text-amber-100">{faction.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${getFactionMoodColor(faction.loyalty)}`}>
                    {getFactionMood(faction.loyalty)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400">Influence:</span>
                    <span className="ml-1 text-amber-400">{faction.influence}%</span>
                  </div>
                  <div>
                    <span className="text-stone-400">Loyalty:</span>
                    <span className={`ml-1 ${getFactionMoodColor(faction.loyalty)}`}>
                      {faction.loyalty}%
                    </span>
                  </div>
                </div>

                {/* Influence bar */}
                <div className="mt-2 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(faction.influence / totalInfluence) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Faction details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedFaction ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedFaction.icon}</span>
                  <div>
                    <h3 className="font-bold text-amber-100">{selectedFaction.name}</h3>
                    <span className="text-xs text-stone-400 capitalize">
                      {selectedFaction.ideology}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-300">{selectedFaction.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-700 rounded p-3">
                    <div className="text-xs text-stone-400">Influence</div>
                    <div className="text-xl font-bold text-amber-400">
                      {selectedFaction.influence}%
                    </div>
                  </div>
                  <div className="bg-stone-700 rounded p-3">
                    <div className="text-xs text-stone-400">Loyalty</div>
                    <div className={`text-xl font-bold ${getFactionMoodColor(selectedFaction.loyalty)}`}>
                      {selectedFaction.loyalty}%
                    </div>
                  </div>
                </div>

                {/* Demands */}
                <div>
                  <h4 className="text-xs text-stone-400 mb-2">Demands</h4>
                  <div className="space-y-1">
                    {selectedFaction.demands.map((demand, i) => {
                      const met = isDemandMet(demand, gameState);
                      return (
                        <div
                          key={i}
                          className={`text-xs px-2 py-1.5 rounded flex justify-between ${
                            met
                              ? 'bg-green-900/30 text-green-400'
                              : demand.urgency === 'critical'
                                ? 'bg-red-900/30 text-red-400'
                                : demand.urgency === 'high'
                                  ? 'bg-orange-900/30 text-orange-400'
                                  : 'bg-amber-900/30 text-amber-400'
                          }`}
                        >
                          <span>{demand.type.replace(/_/g, ' ')}</span>
                          <span>{met ? '✓' : demand.urgency.toUpperCase()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bonuses */}
                <div>
                  <h4 className="text-xs text-stone-400 mb-2">Bonuses (scaled by loyalty)</h4>
                  <div className="space-y-1">
                    {selectedFaction.modifiers.map((mod, i) => (
                      <div
                        key={i}
                        className="text-xs bg-stone-700 px-2 py-1 rounded"
                      >
                        {mod.value > 0 ? '+' : ''}{mod.value}{mod.isPercent ? '%' : ''} {mod.type.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactions */}
                {onInteract && (
                  <div>
                    <h4 className="text-xs text-stone-400 mb-2">Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {FACTION_INTERACTIONS.map(interaction => (
                        <button
                          key={interaction.id}
                          onClick={() => onInteract(selectedFaction.id, interaction.id)}
                          className="text-xs bg-stone-700 hover:bg-stone-600 px-2 py-1.5 rounded text-left"
                        >
                          <div className="font-medium text-amber-100">{interaction.name}</div>
                          <div className="text-stone-400">
                            {Object.entries(interaction.cost).map(([key, val]) =>
                              `${val} ${key.replace(/_/g, ' ')}`
                            ).join(', ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-400">
                <div className="text-3xl mb-2">🏛️</div>
                <div>Select a faction to view details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
