import React, { useState } from 'react';
import { TradeNode, NodeNation } from '../data/tradeNodeSystem';

interface TradeNodeMapProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: TradeNode[];
  playerNation: string;
  availableMerchants: number;
  onSendMerchant: (nodeId: string, action: 'collect' | 'steer') => void;
  onRecallMerchant: (nodeId: string) => void;
  onProtectTrade: (nodeId: string) => void;
}

export const TradeNodeMap: React.FC<TradeNodeMapProps> = ({
  isOpen,
  onClose,
  nodes,
  playerNation,
  availableMerchants,
  onSendMerchant,
  onRecallMerchant,
  onProtectTrade
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  if (!isOpen) return null;

  const selected = nodes.find(n => n.id === selectedNode);
  const playerInNode = selected?.nations.find(n => n.nationId === playerNation);

  const totalIncome = nodes.reduce((sum, node) => {
    const player = node.nations.find(n => n.nationId === playerNation);
    return sum + (player?.income || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🚢 Trade Network</h2>
            <div className="text-sm text-stone-500">
              Trade Income: {totalIncome.toFixed(1)}💰/month • {availableMerchants} merchants available
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Node list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto">
            <div className="p-2 space-y-2">
              {nodes.map(node => {
                const player = node.nations.find(n => n.nationId === playerNation);
                const hasPresence = player && player.tradePower > 0;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedNode === node.id
                        ? 'bg-amber-100 border-2 border-amber-500'
                        : hasPresence
                        ? 'bg-green-50 border border-green-200 hover:border-green-400'
                        : 'bg-stone-100 border border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-stone-800">{node.name}</div>
                        <div className="text-xs text-stone-500">{node.region}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">
                          {node.totalValue.toFixed(1)}
                        </div>
                        <div className="text-xs text-stone-500">value</div>
                      </div>
                    </div>

                    {player && (
                      <div className="mt-2 pt-2 border-t border-stone-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-500">Your share</span>
                          <span className="font-medium">{player.tradePowerShare.toFixed(1)}%</span>
                        </div>
                        {player.income > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-500">Income</span>
                            <span className="font-medium text-green-600">+{player.income.toFixed(1)}💰</span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected node details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-xl text-stone-800">{selected.name}</h3>
                  <div className="text-sm text-stone-500">{selected.region}</div>
                  <div className="text-2xl font-bold text-amber-600 mt-2">
                    {selected.totalValue.toFixed(1)} 💰
                  </div>
                </div>

                {/* Trade goods */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Trade Goods</h4>
                  <div className="flex flex-wrap gap-1">
                    {selected.tradeGoods.map(good => (
                      <span key={good} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                        {good.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trade flows */}
                {selected.incoming.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Incoming Trade</h4>
                    <div className="space-y-1">
                      {selected.incoming.map(flow => (
                        <div key={flow.targetNode} className="flex justify-between text-xs bg-stone-100 p-2 rounded">
                          <span className="text-stone-600">← {flow.targetNode.replace('_', ' ')}</span>
                          <span className="font-medium">{flow.value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.outgoing.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-stone-600 mb-2">Outgoing Trade</h4>
                    <div className="space-y-1">
                      {selected.outgoing.map(flow => (
                        <div key={flow.targetNode} className="flex justify-between text-xs bg-stone-100 p-2 rounded">
                          <span className="text-stone-600">→ {flow.targetNode.replace('_', ' ')}</span>
                          <span className="font-medium">{flow.value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nations in node */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">
                    Nations ({selected.nations.length})
                  </h4>
                  <div className="space-y-2">
                    {selected.nations
                      .sort((a, b) => b.tradePower - a.tradePower)
                      .slice(0, 5)
                      .map(nation => (
                        <div
                          key={nation.nationId}
                          className={`p-2 rounded text-sm ${
                            nation.nationId === playerNation
                              ? 'bg-green-100'
                              : 'bg-stone-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{nation.flag} {nation.name}</span>
                            <span className="font-medium">{nation.tradePowerShare.toFixed(1)}%</span>
                          </div>
                          {nation.merchants > 0 && (
                            <div className="text-xs text-stone-500 mt-1">
                              {nation.merchants} merchant{nation.merchants !== 1 ? 's' : ''} •
                              {nation.collecting ? ' Collecting' : ' Steering'}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {playerInNode?.merchants ? (
                    <button
                      onClick={() => onRecallMerchant(selected.id)}
                      className="w-full py-2 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                    >
                      Recall Merchant
                    </button>
                  ) : availableMerchants > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSendMerchant(selected.id, 'collect')}
                        className="py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Collect
                      </button>
                      {selected.outgoing.length > 0 && (
                        <button
                          onClick={() => onSendMerchant(selected.id, 'steer')}
                          className="py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Steer
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-stone-500 text-sm py-2">
                      No merchants available
                    </div>
                  )}

                  <button
                    onClick={() => onProtectTrade(selected.id)}
                    className="w-full py-2 bg-stone-600 text-white rounded text-sm hover:bg-stone-700"
                  >
                    ⚓ Protect Trade
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a trade node to view details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeNodeMap;
