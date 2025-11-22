import React from 'react';
import {
  Coalition,
  CoalitionMember,
  getAESeverity,
  getAEColor,
  simulateCoalitionOutcome
} from '../data/coalitionSystem';

interface CoalitionWarningProps {
  coalition: Coalition | null;
  playerStrength: number;
  aeByNation: Map<string, number>;
  onClose: () => void;
  onImproveRelations?: (nationId: string) => void;
}

export default function CoalitionWarning({
  coalition,
  playerStrength,
  aeByNation,
  onClose,
  onImproveRelations
}: CoalitionWarningProps) {
  const sortedAE = Array.from(aeByNation.entries())
    .sort((a, b) => b[1] - a[1])
    .filter(([_, ae]) => ae > 0);

  const outcome = coalition
    ? simulateCoalitionOutcome(playerStrength, coalition.totalStrength)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">
            ⚠️ Coalition Status
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {coalition ? (
            <>
              {/* Coalition info */}
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <h3 className="font-bold text-red-100">
                      Coalition Against You
                    </h3>
                    <div className="text-xs text-red-300">
                      Formed: {coalition.formationDate}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-red-900/50 rounded p-2 text-center">
                    <div className="text-xl font-bold text-red-400">
                      {coalition.members.length}
                    </div>
                    <div className="text-xs text-red-300">Members</div>
                  </div>
                  <div className="bg-red-900/50 rounded p-2 text-center">
                    <div className="text-xl font-bold text-red-400">
                      {coalition.totalStrength.toLocaleString()}
                    </div>
                    <div className="text-xs text-red-300">Total Strength</div>
                  </div>
                </div>

                {/* War outcome */}
                {outcome && (
                  <div className={`text-sm p-2 rounded ${
                    outcome.winChance >= 55 ? 'bg-green-900/30 text-green-400' :
                    outcome.winChance >= 35 ? 'bg-amber-900/30 text-amber-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    <div className="font-medium">Win Chance: {outcome.winChance}%</div>
                    <div className="text-xs opacity-80">{outcome.recommendation}</div>
                  </div>
                )}
              </div>

              {/* Coalition members */}
              <div>
                <h4 className="text-xs text-stone-400 mb-2">Coalition Members</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {coalition.members.map(member => (
                    <div
                      key={member.nationId}
                      className="bg-stone-700 rounded p-2 flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-medium text-amber-100">
                          {member.nationName}
                        </div>
                        <div className="text-xs text-stone-400">
                          AE: {member.aggressiveExpansion.toFixed(0)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-red-400">
                          {member.militaryStrength.toLocaleString()}
                        </div>
                        {onImproveRelations && (
                          <button
                            onClick={() => onImproveRelations(member.nationId)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Improve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-green-400">
              <div className="text-3xl mb-2">✅</div>
              <div className="font-medium">No Active Coalition</div>
            </div>
          )}

          {/* AE overview */}
          <div>
            <h4 className="text-xs text-stone-400 mb-2">
              Aggressive Expansion by Nation
            </h4>
            {sortedAE.length === 0 ? (
              <div className="text-sm text-stone-400 text-center py-2">
                No aggressive expansion
              </div>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {sortedAE.map(([nationId, ae]) => (
                  <div
                    key={nationId}
                    className="bg-stone-700 rounded p-2 flex justify-between items-center"
                  >
                    <span className="text-sm">{nationId}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getAEColor(ae)}`}>
                        {ae.toFixed(0)}
                      </span>
                      <span className={`text-xs ${getAEColor(ae)}`}>
                        {getAESeverity(ae)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-stone-700 rounded-lg p-3">
            <h4 className="text-xs text-stone-400 mb-1">Tips to Avoid Coalitions</h4>
            <ul className="text-xs text-stone-300 space-y-1">
              <li>• Improve relations with nations above 50 AE</li>
              <li>• Take truces with potential coalition members</li>
              <li>• Spread conquests across different regions</li>
              <li>• Wait for AE to decay before new wars</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
