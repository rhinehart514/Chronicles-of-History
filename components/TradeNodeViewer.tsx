import React, { useState } from 'react';
import {
  TradeNode,
  TRADE_NODES,
  calculateTradePowerModifiers,
  calculateDownstreamValue,
  getRouteControl
} from '../data/tradeRoutes';

interface TradeNodeViewerProps {
  nodes: TradeNode[];
  playerNation: string;
  merchantCount: number;
  usedMerchants: number;
  tradePower: Map<string, number>;
  onClose: () => void;
  onAssignMerchant?: (nodeId: string, action: 'collect' | 'transfer') => void;
  onRemoveMerchant?: (nodeId: string) => void;
}

interface NodePresence {
  nodeId: string;
  tradePower: number;
  share: number;
  income: number;
  hasMerchant: boolean;
  merchantAction?: 'collect' | 'transfer';
}

export default function TradeNodeViewer({
  nodes,
  playerNation,
  merchantCount,
  usedMerchants,
  tradePower,
  onClose,
  onAssignMerchant,
  onRemoveMerchant
}: TradeNodeViewerProps) {
  const [selectedNode, setSelectedNode] = useState<TradeNode | null>(
    nodes.length > 0 ? nodes[0] : null
  );
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  const freeMerchants = merchantCount - usedMerchants;

  const calculateNodeStats = (node: TradeNode): NodePresence => {
    const power = tradePower.get(node.id) || 0;
    const totalPower = node.totalTradePower || 100;
    const share = totalPower > 0 ? (power / totalPower) * 100 : 0;
    const income = (node.totalValue || 0) * (share / 100);

    return {
      nodeId: node.id,
      tradePower: power,
      share,
      income,
      hasMerchant: false, // Would come from game state
      merchantAction: undefined
    };
  };

  const sortedNodes = [...nodes].sort((a, b) => {
    const statsA = calculateNodeStats(a);
    const statsB = calculateNodeStats(b);
    return statsB.tradePower - statsA.tradePower;
  });

  const renderNodeList = () => (
    <div className="space-y-2">
      {sortedNodes.map(node => {
        const stats = calculateNodeStats(node);

        return (
          <div
            key={node.id}
            onClick={() => setSelectedNode(node)}
            className={`bg-stone-700 rounded-lg p-3 cursor-pointer transition-colors ${
              selectedNode?.id === node.id
                ? 'ring-2 ring-amber-500'
                : 'hover:bg-stone-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div>
                  <div className="font-medium text-amber-100">{node.name}</div>
                  <div className="text-xs text-stone-400">{node.region}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-amber-400">
                  {stats.income.toFixed(1)} 💰
                </div>
                <div className="text-xs text-stone-400">
                  {stats.share.toFixed(1)}% share
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400">Power: </span>
                <span className="text-green-400">{stats.tradePower.toFixed(0)}</span>
              </div>
              <div>
                <span className="text-stone-400">Total: </span>
                <span>{(node.totalValue || 0).toFixed(1)}</span>
              </div>
            </div>

            {stats.hasMerchant && (
              <div className="mt-2 text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                🧑‍💼 Merchant ({stats.merchantAction})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    const stats = calculateNodeStats(selectedNode);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📦</span>
          <div>
            <h3 className="font-bold text-amber-100">{selectedNode.name}</h3>
            <div className="text-sm text-stone-400">{selectedNode.region}</div>
          </div>
        </div>

        {/* Node stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400">Your Trade Power</div>
            <div className="text-xl font-bold text-green-400">
              {stats.tradePower.toFixed(1)}
            </div>
          </div>
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400">Your Share</div>
            <div className="text-xl font-bold text-amber-400">
              {stats.share.toFixed(1)}%
            </div>
          </div>
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400">Node Value</div>
            <div className="text-xl font-bold text-amber-400">
              {(selectedNode.totalValue || 0).toFixed(1)}
            </div>
          </div>
          <div className="bg-stone-700 rounded-lg p-3">
            <div className="text-xs text-stone-400">Your Income</div>
            <div className="text-xl font-bold text-green-400">
              {stats.income.toFixed(2)} 💰
            </div>
          </div>
        </div>

        {/* Outgoing routes */}
        {selectedNode.outgoing && selectedNode.outgoing.length > 0 && (
          <div>
            <h4 className="text-xs text-stone-400 mb-2">Outgoing Routes</h4>
            <div className="space-y-1">
              {selectedNode.outgoing.map(routeId => {
                const targetNode = nodes.find(n => n.id === routeId);
                return (
                  <div key={routeId} className="text-sm bg-stone-700 px-2 py-1 rounded flex items-center gap-2">
                    <span>→</span>
                    <span>{targetNode?.name || routeId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incoming routes */}
        {selectedNode.incoming && selectedNode.incoming.length > 0 && (
          <div>
            <h4 className="text-xs text-stone-400 mb-2">Incoming Routes</h4>
            <div className="space-y-1">
              {selectedNode.incoming.map(routeId => {
                const sourceNode = nodes.find(n => n.id === routeId);
                return (
                  <div key={routeId} className="text-sm bg-stone-700 px-2 py-1 rounded flex items-center gap-2">
                    <span>←</span>
                    <span>{sourceNode?.name || routeId}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Merchant actions */}
        {(onAssignMerchant || onRemoveMerchant) && (
          <div>
            <h4 className="text-xs text-stone-400 mb-2">Merchant Actions</h4>
            <div className="flex gap-2">
              {onAssignMerchant && freeMerchants > 0 && !stats.hasMerchant && (
                <>
                  <button
                    onClick={() => onAssignMerchant(selectedNode.id, 'collect')}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm"
                  >
                    💰 Collect
                  </button>
                  <button
                    onClick={() => onAssignMerchant(selectedNode.id, 'transfer')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    ↗️ Transfer
                  </button>
                </>
              )}
              {onRemoveMerchant && stats.hasMerchant && (
                <button
                  onClick={() => onRemoveMerchant(selectedNode.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Remove Merchant
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-stone-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-amber-100">📦 Trade Nodes</h2>
            <div className="text-xs text-stone-400">
              Merchants: {usedMerchants}/{merchantCount}
              {freeMerchants > 0 && (
                <span className="text-green-400 ml-1">({freeMerchants} free)</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Node list */}
          <div className="w-1/2 p-4 border-r border-stone-700 overflow-y-auto">
            {renderNodeList()}
          </div>

          {/* Node details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selectedNode ? renderNodeDetails() : (
              <div className="text-center py-8 text-stone-400">
                <div className="text-3xl mb-2">📦</div>
                <div>Select a trade node</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
