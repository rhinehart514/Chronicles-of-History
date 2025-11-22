import React, { useState } from 'react';

interface TradeDealProps {
  isOpen: boolean;
  onClose: () => void;
  targetNation: TradePartner;
  playerResources: TradeResource[];
  targetResources: TradeResource[];
  relations: number;
  onProposeDeal: (offer: TradeOffer[], request: TradeOffer[]) => void;
}

interface TradePartner {
  id: string;
  name: string;
  flag: string;
  attitude: string;
  trustworthy: boolean;
}

interface TradeResource {
  id: string;
  name: string;
  icon: string;
  type: 'good' | 'gold' | 'province' | 'diplomatic' | 'military';
  value: number;
  available: number;
}

interface TradeOffer {
  resourceId: string;
  amount: number;
}

export const TradeDeal: React.FC<TradeDealProps> = ({
  isOpen,
  onClose,
  targetNation,
  playerResources,
  targetResources,
  relations,
  onProposeDeal
}) => {
  const [playerOffer, setPlayerOffer] = useState<TradeOffer[]>([]);
  const [targetRequest, setTargetRequest] = useState<TradeOffer[]>([]);

  if (!isOpen) return null;

  const calculateValue = (offers: TradeOffer[], resources: TradeResource[]) => {
    return offers.reduce((sum, offer) => {
      const resource = resources.find(r => r.id === offer.resourceId);
      return sum + (resource?.value || 0) * offer.amount;
    }, 0);
  };

  const playerValue = calculateValue(playerOffer, playerResources);
  const targetValue = calculateValue(targetRequest, targetResources);
  const balance = playerValue - targetValue;

  // AI acceptance calculation
  const baseAcceptance = 50;
  const balanceModifier = Math.min(50, Math.max(-50, balance / 10));
  const relationModifier = relations / 10;
  const acceptanceChance = Math.min(100, Math.max(0,
    baseAcceptance + balanceModifier + relationModifier
  ));

  const addToOffer = (resourceId: string) => {
    const existing = playerOffer.find(o => o.resourceId === resourceId);
    const resource = playerResources.find(r => r.id === resourceId);
    if (!resource) return;

    if (existing && existing.amount < resource.available) {
      setPlayerOffer(playerOffer.map(o =>
        o.resourceId === resourceId ? { ...o, amount: o.amount + 1 } : o
      ));
    } else if (!existing) {
      setPlayerOffer([...playerOffer, { resourceId, amount: 1 }]);
    }
  };

  const removeFromOffer = (resourceId: string) => {
    const existing = playerOffer.find(o => o.resourceId === resourceId);
    if (existing && existing.amount > 1) {
      setPlayerOffer(playerOffer.map(o =>
        o.resourceId === resourceId ? { ...o, amount: o.amount - 1 } : o
      ));
    } else {
      setPlayerOffer(playerOffer.filter(o => o.resourceId !== resourceId));
    }
  };

  const addToRequest = (resourceId: string) => {
    const existing = targetRequest.find(o => o.resourceId === resourceId);
    const resource = targetResources.find(r => r.id === resourceId);
    if (!resource) return;

    if (existing && existing.amount < resource.available) {
      setTargetRequest(targetRequest.map(o =>
        o.resourceId === resourceId ? { ...o, amount: o.amount + 1 } : o
      ));
    } else if (!existing) {
      setTargetRequest([...targetRequest, { resourceId, amount: 1 }]);
    }
  };

  const removeFromRequest = (resourceId: string) => {
    const existing = targetRequest.find(o => o.resourceId === resourceId);
    if (existing && existing.amount > 1) {
      setTargetRequest(targetRequest.map(o =>
        o.resourceId === resourceId ? { ...o, amount: o.amount - 1 } : o
      ));
    } else {
      setTargetRequest(targetRequest.filter(o => o.resourceId !== resourceId));
    }
  };

  const handlePropose = () => {
    if (playerOffer.length > 0 || targetRequest.length > 0) {
      onProposeDeal(playerOffer, targetRequest);
    }
  };

  const clearDeal = () => {
    setPlayerOffer([]);
    setTargetRequest([]);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{targetNation.flag}</span>
            <div>
              <h2 className="text-xl font-bold text-stone-800">Trade Deal</h2>
              <div className="text-sm text-stone-500">
                Negotiating with {targetNation.name}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Partner info */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Attitude</div>
            <div className="font-medium text-stone-800">{targetNation.attitude}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Relations</div>
            <div className={`font-medium ${relations >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {relations > 0 ? '+' : ''}{relations}
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Trustworthy</div>
            <div className="font-medium">
              {targetNation.trustworthy ? '✓ Yes' : '✗ No'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Your offer */}
          <div className="w-1/2 border-r border-stone-200 flex flex-col">
            <div className="p-3 bg-green-50 border-b border-stone-200">
              <h3 className="font-semibold text-green-800">You Offer</h3>
              <div className="text-sm text-green-600">Value: {playerValue}</div>
            </div>

            {/* Selected offers */}
            <div className="p-3 border-b border-stone-200 min-h-[100px]">
              {playerOffer.length === 0 ? (
                <p className="text-sm text-stone-500 text-center">Select items to offer</p>
              ) : (
                <div className="space-y-2">
                  {playerOffer.map(offer => {
                    const resource = playerResources.find(r => r.id === offer.resourceId);
                    if (!resource) return null;
                    return (
                      <div key={offer.resourceId} className="flex items-center justify-between bg-white p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>{resource.icon}</span>
                          <span className="text-sm">{resource.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromOffer(offer.resourceId)}
                            className="w-6 h-6 bg-stone-200 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{offer.amount}</span>
                          <button
                            onClick={() => addToOffer(offer.resourceId)}
                            className="w-6 h-6 bg-stone-200 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available resources */}
            <div className="flex-1 overflow-y-auto p-3">
              <h4 className="text-xs font-semibold text-stone-500 mb-2">Available</h4>
              <div className="space-y-1">
                {playerResources.map(resource => (
                  <button
                    key={resource.id}
                    onClick={() => addToOffer(resource.id)}
                    className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-stone-50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{resource.icon}</span>
                      <span>{resource.name}</span>
                    </div>
                    <span className="text-stone-500">{resource.available}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Their offer */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 bg-blue-50 border-b border-stone-200">
              <h3 className="font-semibold text-blue-800">You Request</h3>
              <div className="text-sm text-blue-600">Value: {targetValue}</div>
            </div>

            {/* Selected requests */}
            <div className="p-3 border-b border-stone-200 min-h-[100px]">
              {targetRequest.length === 0 ? (
                <p className="text-sm text-stone-500 text-center">Select items to request</p>
              ) : (
                <div className="space-y-2">
                  {targetRequest.map(offer => {
                    const resource = targetResources.find(r => r.id === offer.resourceId);
                    if (!resource) return null;
                    return (
                      <div key={offer.resourceId} className="flex items-center justify-between bg-white p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span>{resource.icon}</span>
                          <span className="text-sm">{resource.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromRequest(offer.resourceId)}
                            className="w-6 h-6 bg-stone-200 rounded text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{offer.amount}</span>
                          <button
                            onClick={() => addToRequest(offer.resourceId)}
                            className="w-6 h-6 bg-stone-200 rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Available resources */}
            <div className="flex-1 overflow-y-auto p-3">
              <h4 className="text-xs font-semibold text-stone-500 mb-2">Available</h4>
              <div className="space-y-1">
                {targetResources.map(resource => (
                  <button
                    key={resource.id}
                    onClick={() => addToRequest(resource.id)}
                    className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-stone-50 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{resource.icon}</span>
                      <span>{resource.name}</span>
                    </div>
                    <span className="text-stone-500">{resource.available}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Balance and acceptance */}
        <div className="p-4 border-t border-stone-200 bg-stone-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-stone-600">Deal Balance</div>
              <div className={`text-lg font-bold ${
                balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-stone-800'
              }`}>
                {balance > 0 ? '+' : ''}{balance}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-stone-600">Acceptance Chance</div>
              <div className={`text-lg font-bold ${
                acceptanceChance >= 70 ? 'text-green-600' :
                acceptanceChance >= 40 ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {acceptanceChance.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={clearDeal}
              className="px-4 py-2 text-stone-600 hover:text-stone-800"
            >
              Clear
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePropose}
                disabled={playerOffer.length === 0 && targetRequest.length === 0}
                className={`px-6 py-2 rounded font-medium ${
                  playerOffer.length > 0 || targetRequest.length > 0
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                Propose Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDeal;
