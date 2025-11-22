import React, { useState } from 'react';

interface TradeNode {
  id: string;
  name: string;
  totalValue: number;
  playerPower: number;
  playerShare: number;
  income: number;
  merchants: number;
  isCollecting: boolean;
  isSteering: boolean;
  steerTarget?: string;
  topTraders: { name: string; flag: string; power: number }[];
}

interface Merchant {
  id: string;
  nodeId?: string;
  action?: 'collect' | 'steer';
}

interface TradeNodeManagerProps {
  nodes: TradeNode[];
  merchants: Merchant[];
  totalTradeIncome: number;
  merchantsAvailable: number;
  onAssignMerchant?: (nodeId: string, action: 'collect' | 'steer') => void;
  onRecallMerchant?: (nodeId: string) => void;
  onClose: () => void;
}

export default function TradeNodeManager({
  nodes,
  merchants,
  totalTradeIncome,
  merchantsAvailable,
  onAssignMerchant,
  onRecallMerchant,
  onClose
}: TradeNodeManagerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  const getShareColor = (share: number) => {
    if (share >= 50) return 'text-green-400';
    if (share >= 25) return 'text-yellow-400';
    if (share >= 10) return 'text-orange-400';
    return 'text-stone-400';
  };

  const getTotalPowerPercent = (power: number, node: TradeNode) => {
    const total = node.topTraders.reduce((sum, t) => sum + t.power, 0) + node.playerPower;
    return ((power / total) * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-100">Trade Network</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <div className="px-4 py-3 bg-stone-900 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {totalTradeIncome.toFixed(2)}
            </div>
            <div className="text-xs text-stone-400">Trade Income</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">{nodes.length}</div>
            <div className="text-xs text-stone-400">Active Nodes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">
              {merchantsAvailable}/{merchants.length}
            </div>
            <div className="text-xs text-stone-400">Merchants</div>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {nodes.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              <div className="text-3xl mb-2">🚢</div>
              <div>No active trade nodes</div>
            </div>
          ) : (
            nodes
              .sort((a, b) => b.income - a.income)
              .map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedNode === node.id ? 'ring-2 ring-amber-500' : 'hover:bg-stone-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {node.name}
                        {node.merchants > 0 && (
                          <span className="text-xs bg-blue-600 px-1.5 rounded">
                            {node.isCollecting ? 'Collecting' : 'Steering'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400">
                        Total Value: {node.totalValue.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {node.income.toFixed(2)}
                      </div>
                      <div className="text-xs text-stone-400">Income</div>
                    </div>
                  </div>

                  {/* Power Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Trade Power</span>
                      <span className={getShareColor(node.playerShare)}>
                        {node.playerShare.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${Math.min(100, node.playerShare)}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Traders */}
                  <div className="flex gap-1">
                    {node.topTraders.slice(0, 3).map((trader, i) => (
                      <span
                        key={i}
                        className="text-xs bg-stone-600 px-1.5 py-0.5 rounded flex items-center gap-1"
                        title={`${trader.name}: ${getTotalPowerPercent(trader.power, node)}%`}
                      >
                        {trader.flag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Selected Node Actions */}
        {selectedNodeData && (
          <div className="p-3 border-t border-stone-700">
            <div className="text-sm font-medium text-stone-400 mb-2">
              Merchant Actions - {selectedNodeData.name}
            </div>
            {selectedNodeData.merchants > 0 ? (
              <button
                onClick={() => onRecallMerchant?.(selectedNodeData.id)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Recall Merchant
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onAssignMerchant?.(selectedNodeData.id, 'collect')}
                  disabled={merchantsAvailable === 0}
                  className={`py-2 rounded text-sm ${
                    merchantsAvailable > 0
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Collect
                </button>
                <button
                  onClick={() => onAssignMerchant?.(selectedNodeData.id, 'steer')}
                  disabled={merchantsAvailable === 0}
                  className={`py-2 rounded text-sm ${
                    merchantsAvailable > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Steer Trade
                </button>
              </div>
            )}

            {/* Node Details */}
            <div className="mt-3 pt-3 border-t border-stone-600">
              <div className="text-xs text-stone-400">
                <div className="flex justify-between">
                  <span>Your Trade Power:</span>
                  <span className="text-amber-400">{selectedNodeData.playerPower.toFixed(1)}</span>
                </div>
                {selectedNodeData.steerTarget && (
                  <div className="flex justify-between">
                    <span>Steering to:</span>
                    <span>{selectedNodeData.steerTarget}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
