import React, { useState } from 'react';
import { Nation } from '../types';

interface DiplomaticRelation {
  nationId: string;
  nationName: string;
  opinion: number; // -100 to 100
  status: 'allied' | 'friendly' | 'neutral' | 'hostile' | 'at_war';
  treaties: string[];
  recentActions: string[];
}

interface DiplomaticRelationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  playerNation: Nation;
  relations: DiplomaticRelation[];
  onDeclareWar: (nationId: string) => void;
  onProposeTreaty: (nationId: string, treaty: string) => void;
  onImproveRelations: (nationId: string) => void;
}

export const DiplomaticRelationsPanel: React.FC<DiplomaticRelationsPanelProps> = ({
  isOpen,
  onClose,
  playerNation,
  relations,
  onDeclareWar,
  onProposeTreaty,
  onImproveRelations
}) => {
  const [selectedNation, setSelectedNation] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'allied' | 'hostile'>('all');

  if (!isOpen) return null;

  const filteredRelations = relations.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'allied') return r.status === 'allied' || r.status === 'friendly';
    if (filter === 'hostile') return r.status === 'hostile' || r.status === 'at_war';
    return true;
  });

  const getStatusColor = (status: DiplomaticRelation['status']) => {
    switch (status) {
      case 'allied': return 'text-green-600 bg-green-100';
      case 'friendly': return 'text-blue-600 bg-blue-100';
      case 'neutral': return 'text-stone-600 bg-stone-100';
      case 'hostile': return 'text-orange-600 bg-orange-100';
      case 'at_war': return 'text-red-600 bg-red-100';
    }
  };

  const getOpinionBar = (opinion: number) => {
    const normalized = (opinion + 100) / 2; // Convert -100..100 to 0..100
    const color = opinion > 50 ? 'bg-green-500' :
                  opinion > 0 ? 'bg-blue-500' :
                  opinion > -50 ? 'bg-orange-500' : 'bg-red-500';
    return (
      <div className="w-full bg-stone-200 rounded h-2">
        <div className={`h-2 rounded ${color}`} style={{ width: `${normalized}%` }} />
      </div>
    );
  };

  const selected = relations.find(r => r.nationId === selectedNation);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">Diplomatic Relations</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Filter */}
        <div className="p-3 border-b border-stone-200 flex gap-2">
          {(['all', 'allied', 'hostile'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Nation list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-2">
            {filteredRelations.length === 0 ? (
              <p className="text-center text-stone-500 py-4">No nations match filter</p>
            ) : (
              <div className="space-y-2">
                {filteredRelations.map((relation) => (
                  <button
                    key={relation.nationId}
                    onClick={() => setSelectedNation(relation.nationId)}
                    className={`w-full p-3 rounded border text-left transition-all ${
                      selectedNation === relation.nationId
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-white border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-stone-800">{relation.nationName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(relation.status)}`}>
                        {relation.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Opinion</span>
                        <span>{relation.opinion > 0 ? '+' : ''}{relation.opinion}</span>
                      </div>
                      {getOpinionBar(relation.opinion)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details panel */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selected ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-800">{selected.nationName}</h3>
                  <p className={`text-sm ${getStatusColor(selected.status)} inline-block px-2 py-0.5 rounded mt-1`}>
                    {selected.status.replace('_', ' ')}
                  </p>
                </div>

                {/* Opinion breakdown */}
                <div className="bg-white p-3 rounded border border-stone-200">
                  <h4 className="font-semibold text-stone-800 mb-2">Opinion: {selected.opinion}</h4>
                  {getOpinionBar(selected.opinion)}
                </div>

                {/* Treaties */}
                {selected.treaties.length > 0 && (
                  <div className="bg-white p-3 rounded border border-stone-200">
                    <h4 className="font-semibold text-stone-800 mb-2">Active Treaties</h4>
                    <ul className="space-y-1">
                      {selected.treaties.map((treaty, i) => (
                        <li key={i} className="text-sm text-stone-600 flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {treaty}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent actions */}
                {selected.recentActions.length > 0 && (
                  <div className="bg-white p-3 rounded border border-stone-200">
                    <h4 className="font-semibold text-stone-800 mb-2">Recent Actions</h4>
                    <ul className="space-y-1 text-sm text-stone-600">
                      {selected.recentActions.slice(-5).map((action, i) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {selected.status !== 'at_war' && (
                    <>
                      <button
                        onClick={() => onImproveRelations(selected.nationId)}
                        className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                      >
                        Improve Relations
                      </button>
                      <button
                        onClick={() => onProposeTreaty(selected.nationId, 'trade')}
                        className="w-full py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                      >
                        Propose Trade Agreement
                      </button>
                      {selected.status !== 'allied' && (
                        <button
                          onClick={() => onDeclareWar(selected.nationId)}
                          className="w-full py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
                        >
                          Declare War
                        </button>
                      )}
                    </>
                  )}
                  {selected.status === 'at_war' && (
                    <button
                      onClick={() => onProposeTreaty(selected.nationId, 'peace')}
                      className="w-full py-2 bg-amber-600 text-white rounded font-semibold hover:bg-amber-700"
                    >
                      Sue for Peace
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500">
                Select a nation to view details
              </div>
            )}
          </div>
        </div>

        {/* Footer summary */}
        <div className="p-3 border-t border-stone-300 bg-stone-100 text-sm text-stone-600 flex justify-around">
          <span>Allies: {relations.filter(r => r.status === 'allied').length}</span>
          <span>Friendly: {relations.filter(r => r.status === 'friendly').length}</span>
          <span>Neutral: {relations.filter(r => r.status === 'neutral').length}</span>
          <span>Hostile: {relations.filter(r => r.status === 'hostile').length}</span>
          <span className="text-red-600">At War: {relations.filter(r => r.status === 'at_war').length}</span>
        </div>
      </div>
    </div>
  );
};

export default DiplomaticRelationsPanel;
