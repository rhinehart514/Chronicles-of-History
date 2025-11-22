import React, { useState } from 'react';

interface Alliance {
  id: string;
  nationName: string;
  nationFlag: string;
  relations: number;
  trust: number;
  favors: number;
  strength: number;
  hasRoyalMarriage: boolean;
  yearsAllied: number;
}

interface CallToArms {
  allyId: string;
  warName: string;
  isDefensive: boolean;
  acceptChance: number;
  reasons: { description: string; value: number }[];
}

interface AllianceManagerProps {
  alliances: Alliance[];
  pendingCalls: CallToArms[];
  diplomaticReputation: number;
  maxAlliances: number;
  onBreakAlliance?: (allyId: string) => void;
  onCallToArms?: (allyId: string) => void;
  onRespondCall?: (allyId: string, accept: boolean) => void;
  onImproveRelations?: (allyId: string) => void;
  onClose: () => void;
}

export default function AllianceManager({
  alliances,
  pendingCalls,
  diplomaticReputation,
  maxAlliances,
  onBreakAlliance,
  onCallToArms,
  onRespondCall,
  onImproveRelations,
  onClose
}: AllianceManagerProps) {
  const [selectedAlly, setSelectedAlly] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'alliances' | 'calls'>('alliances');

  const getRelationColor = (relations: number) => {
    if (relations >= 100) return 'text-green-400';
    if (relations >= 50) return 'text-yellow-400';
    if (relations >= 0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTrustColor = (trust: number) => {
    if (trust >= 60) return 'text-green-400';
    if (trust >= 30) return 'text-yellow-400';
    if (trust >= 0) return 'text-orange-400';
    return 'text-red-400';
  };

  const selectedAllianceData = alliances.find(a => a.id === selectedAlly);

  const renderAlliances = () => (
    <div className="space-y-3">
      {alliances.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">🤝</div>
          <div>No alliances formed</div>
          <div className="text-xs mt-1">Use diplomacy to form alliances</div>
        </div>
      ) : (
        alliances.map(alliance => (
          <div
            key={alliance.id}
            onClick={() => setSelectedAlly(alliance.id)}
            className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedAlly === alliance.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{alliance.nationFlag}</span>
                <div>
                  <div className="font-medium">{alliance.nationName}</div>
                  <div className="text-xs text-stone-400">
                    {alliance.yearsAllied} years allied
                    {alliance.hasRoyalMarriage && ' • 💍'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${getRelationColor(alliance.relations)}`}>
                  {alliance.relations}
                </div>
                <div className="text-xs text-stone-400">Relations</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-stone-400">Trust: </span>
                <span className={getTrustColor(alliance.trust)}>{alliance.trust}</span>
              </div>
              <div>
                <span className="text-stone-400">Favors: </span>
                <span className="text-amber-400">{alliance.favors}</span>
              </div>
              <div>
                <span className="text-stone-400">Strength: </span>
                <span>{alliance.strength}K</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderCalls = () => (
    <div className="space-y-3">
      {pendingCalls.length === 0 ? (
        <div className="text-center py-8 text-stone-400">
          <div className="text-3xl mb-2">📯</div>
          <div>No pending calls to arms</div>
        </div>
      ) : (
        pendingCalls.map(call => {
          const ally = alliances.find(a => a.id === call.allyId);
          return (
            <div key={call.allyId} className="bg-stone-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ally?.nationFlag || '🏳️'}</span>
                <div>
                  <div className="font-medium">{ally?.nationName}</div>
                  <div className="text-xs text-stone-400">{call.warName}</div>
                </div>
              </div>

              <div className={`text-xs mb-2 ${call.isDefensive ? 'text-green-400' : 'text-orange-400'}`}>
                {call.isDefensive ? 'Defensive War' : 'Offensive War'}
              </div>

              <div className="text-xs text-stone-400 mb-2">
                <div className="mb-1">Acceptance factors:</div>
                {call.reasons.map((reason, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{reason.description}</span>
                    <span className={reason.value >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {reason.value >= 0 ? '+' : ''}{reason.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Accept Chance:</span>
                <span className={`font-bold ${
                  call.acceptChance >= 70 ? 'text-green-400' :
                  call.acceptChance >= 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {call.acceptChance}%
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onRespondCall?.(call.allyId, true)}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => onRespondCall?.(call.allyId, false)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Refuse
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const tabs = [
    { id: 'alliances' as const, label: 'Alliances', count: alliances.length },
    { id: 'calls' as const, label: 'Calls', count: pendingCalls.length }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Alliances</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-4 py-2 bg-stone-900 flex justify-around text-center">
          <div>
            <div className="text-lg font-bold text-amber-400">
              {alliances.length}/{maxAlliances}
            </div>
            <div className="text-xs text-stone-400">Alliances</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">
              {diplomaticReputation}
            </div>
            <div className="text-xs text-stone-400">Diplo Rep</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">
              {pendingCalls.length}
            </div>
            <div className="text-xs text-stone-400">Calls</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-700">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1 text-xs bg-stone-600 px-1.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {activeTab === 'alliances' && renderAlliances()}
          {activeTab === 'calls' && renderCalls()}
        </div>

        {/* Actions for selected ally */}
        {selectedAllianceData && activeTab === 'alliances' && (
          <div className="p-3 border-t border-stone-700">
            <div className="text-sm font-medium text-stone-400 mb-2">
              Actions for {selectedAllianceData.nationName}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onImproveRelations?.(selectedAllianceData.id)}
                className="py-2 bg-stone-600 hover:bg-stone-500 rounded text-xs"
              >
                Improve
              </button>
              <button
                onClick={() => onCallToArms?.(selectedAllianceData.id)}
                className="py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs"
              >
                Call to Arms
              </button>
              <button
                onClick={() => onBreakAlliance?.(selectedAllianceData.id)}
                className="py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
              >
                Break
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
