import React, { useState } from 'react';

interface ParliamentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  parliament: Parliament;
  availableGold: number;
  onBribeSeat: (seatId: string) => void;
  onProposeIssue: (issueId: string) => void;
  onPassIssue: () => void;
}

interface Parliament {
  id: string;
  name: string;
  type: string;
  seats: ParliamentSeat[];
  currentIssue?: ParliamentIssue;
  bribesUsed: number;
  maxBribes: number;
  debatesWon: number;
  debatesLost: number;
}

interface ParliamentSeat {
  id: string;
  provinceName: string;
  provinceId: string;
  loyalty: number;
  bribed: boolean;
  issues: string[];
}

interface ParliamentIssue {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  duration: number;
  effects: { type: string; value: number; description: string }[];
  supportNeeded: number;
  currentSupport: number;
  yearsActive?: number;
}

const AVAILABLE_ISSUES = [
  { id: 'war_taxes', name: 'War Taxes', icon: '⚔️', category: 'military', supportNeeded: 50 },
  { id: 'trade_expansion', name: 'Trade Expansion', icon: '🚢', category: 'economic', supportNeeded: 50 },
  { id: 'administrative_reform', name: 'Administrative Reform', icon: '📜', category: 'administrative', supportNeeded: 50 },
  { id: 'religious_unity', name: 'Religious Unity', icon: '⛪', category: 'religious', supportNeeded: 60 },
  { id: 'diplomatic_corps', name: 'Diplomatic Corps', icon: '🤝', category: 'diplomatic', supportNeeded: 50 },
  { id: 'colonial_ventures', name: 'Colonial Ventures', icon: '🌍', category: 'economic', supportNeeded: 50 },
  { id: 'fortification_act', name: 'Fortification Act', icon: '🏰', category: 'military', supportNeeded: 50 },
  { id: 'university_funding', name: 'University Funding', icon: '🎓', category: 'administrative', supportNeeded: 50 }
];

export const ParliamentPanel: React.FC<ParliamentPanelProps> = ({
  isOpen,
  onClose,
  parliament,
  availableGold,
  onBribeSeat,
  onProposeIssue,
  onPassIssue
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showIssueSelect, setShowIssueSelect] = useState(false);

  if (!isOpen) return null;

  const loyalSeats = parliament.seats.filter(s => s.loyalty > 50 || s.bribed).length;
  const totalSeats = parliament.seats.length;
  const supportPercentage = totalSeats > 0 ? Math.round((loyalSeats / totalSeats) * 100) : 0;

  const selected = parliament.seats.find(s => s.id === selectedSeat);

  const getBribeCost = (seat: ParliamentSeat) => {
    const baseCost = 50;
    return Math.round(baseCost * (seat.loyalty > 0 ? 0.5 : 1.5));
  };

  const getLoyaltyColor = (loyalty: number) => {
    if (loyalty > 50) return 'text-green-600';
    if (loyalty > 0) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="p-4 border-b border-stone-300 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-stone-800">🏛️ {parliament.name}</h2>
            <div className="text-sm text-stone-500 capitalize">
              {parliament.type.replace('_', ' ')} • {totalSeats} seats
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-2xl">
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-stone-200 bg-stone-100 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-stone-500">Support</div>
            <div className={`font-bold ${supportPercentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
              {supportPercentage}%
            </div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Loyal Seats</div>
            <div className="font-bold text-stone-800">{loyalSeats}/{totalSeats}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Bribes Used</div>
            <div className="font-bold text-amber-600">{parliament.bribesUsed}/{parliament.maxBribes}</div>
          </div>
          <div>
            <div className="text-xs text-stone-500">Debates Won</div>
            <div className="font-bold text-blue-600">{parliament.debatesWon}</div>
          </div>
        </div>

        {/* Current Issue */}
        {parliament.currentIssue ? (
          <div className="p-4 border-b border-stone-200 bg-amber-50">
            <h3 className="font-semibold text-stone-800 mb-2">Current Issue</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{parliament.currentIssue.icon}</span>
                <div>
                  <div className="font-semibold">{parliament.currentIssue.name}</div>
                  <div className="text-xs text-stone-500">{parliament.currentIssue.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  parliament.currentIssue.currentSupport >= parliament.currentIssue.supportNeeded
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {parliament.currentIssue.currentSupport}% / {parliament.currentIssue.supportNeeded}%
                </div>
                <div className="text-xs text-stone-500">Support needed</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 bg-stone-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    parliament.currentIssue.currentSupport >= parliament.currentIssue.supportNeeded
                      ? 'bg-green-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, parliament.currentIssue.currentSupport)}%` }}
                />
              </div>
              <button
                onClick={onPassIssue}
                disabled={parliament.currentIssue.currentSupport < parliament.currentIssue.supportNeeded}
                className={`px-4 py-1 rounded text-sm font-medium ${
                  parliament.currentIssue.currentSupport >= parliament.currentIssue.supportNeeded
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                Pass Issue
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <div className="flex items-center justify-between">
              <div className="text-stone-600">No issue currently being debated</div>
              <button
                onClick={() => setShowIssueSelect(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
              >
                Propose Issue
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Seats list */}
          <div className="w-1/2 border-r border-stone-200 overflow-y-auto p-3">
            <h3 className="text-sm font-semibold text-stone-600 mb-2">Parliament Seats</h3>
            <div className="space-y-2">
              {parliament.seats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => setSelectedSeat(seat.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedSeat === seat.id
                      ? 'border-amber-500 bg-amber-50'
                      : seat.bribed
                      ? 'border-green-300 bg-green-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-stone-800">{seat.provinceName}</div>
                    {seat.bribed && <span className="text-green-500 text-sm">Bribed</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-sm ${getLoyaltyColor(seat.loyalty)}`}>
                      Loyalty: {seat.loyalty > 0 ? '+' : ''}{seat.loyalty}
                    </span>
                    <span className="text-xs text-stone-500">
                      {seat.issues.length} concerns
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seat details */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {selected ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="font-bold text-stone-800 text-lg">{selected.provinceName}</h3>
                  <p className={`text-sm ${getLoyaltyColor(selected.loyalty)}`}>
                    Loyalty: {selected.loyalty > 0 ? '+' : ''}{selected.loyalty}
                  </p>
                </div>

                {/* Loyalty bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>Hostile</span>
                    <span>Neutral</span>
                    <span>Loyal</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 relative">
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-stone-400"
                      style={{ left: '50%' }}
                    />
                    <div
                      className={`h-3 rounded-full ${
                        selected.loyalty > 50 ? 'bg-green-500' :
                        selected.loyalty > 0 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, selected.loyalty + 100) / 2)}%` }}
                    />
                  </div>
                </div>

                {/* Concerns */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-stone-600 mb-2">Seat Concerns</h4>
                  <div className="flex flex-wrap gap-1">
                    {selected.issues.map(issue => (
                      <span
                        key={issue}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {issue.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bribe option */}
                {!selected.bribed && parliament.bribesUsed < parliament.maxBribes && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold text-stone-800 mb-2">Bribe Seat</h4>
                    <p className="text-xs text-stone-600 mb-2">
                      Bribed seats will support any issue you propose
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Cost: <span className="font-bold text-amber-600">{getBribeCost(selected)} gold</span>
                      </span>
                      <button
                        onClick={() => onBribeSeat(selected.id)}
                        disabled={availableGold < getBribeCost(selected)}
                        className={`px-4 py-2 rounded font-medium ${
                          availableGold >= getBribeCost(selected)
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        Bribe
                      </button>
                    </div>
                  </div>
                )}

                {selected.bribed && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                    <span className="text-green-600 font-medium">This seat has been bribed</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-stone-500 py-8">
                Select a seat to view details
              </p>
            )}
          </div>
        </div>

        {/* Issue selection modal */}
        {showIssueSelect && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4">
              <h3 className="font-bold text-stone-800 mb-3">Propose Issue</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {AVAILABLE_ISSUES.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      onProposeIssue(issue.id);
                      setShowIssueSelect(false);
                    }}
                    className="w-full p-3 rounded border border-stone-200 text-left hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2">
                      <span>{issue.icon}</span>
                      <span className="font-medium">{issue.name}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      Category: {issue.category} • Support needed: {issue.supportNeeded}%
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowIssueSelect(false)}
                className="w-full mt-3 py-2 bg-stone-200 text-stone-700 rounded hover:bg-stone-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParliamentPanel;
