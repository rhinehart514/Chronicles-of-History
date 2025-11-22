import React, { useState, useMemo } from 'react';
import {
  getAllAchievements,
  loadStats,
  PlayerStats,
  Achievement
} from '../services/achievementService';

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'stats'>('achievements');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const achievements = useMemo(() => getAllAchievements(), []);
  const stats = useMemo(() => loadStats(), []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const filteredAchievements = useMemo(() => {
    if (filterCategory === 'all') return achievements;
    if (filterCategory === 'unlocked') return achievements.filter(a => a.unlocked);
    if (filterCategory === 'locked') return achievements.filter(a => !a.unlocked);
    return achievements.filter(a => a.category === filterCategory);
  }, [achievements, filterCategory]);

  if (!isOpen) return null;

  const rarityColors = {
    common: 'text-stone-500',
    uncommon: 'text-green-600',
    rare: 'text-blue-600',
    legendary: 'text-purple-600'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#f4efe4] rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border-4 border-stone-600">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-300">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Achievements & Stats</h2>
            <p className="text-sm text-stone-600">
              {unlockedCount}/{achievements.length} achievements unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-300">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-2 font-semibold ${
              activeTab === 'achievements'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 font-semibold ${
              activeTab === 'stats'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'achievements' && (
            <div>
              {/* Filters */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {['all', 'unlocked', 'locked', 'military', 'diplomacy', 'economy', 'culture', 'special'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2 py-1 text-xs rounded capitalize ${
                      filterCategory === cat
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Achievement grid */}
              <div className="grid gap-3">
                {filteredAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded border-2 ${
                      achievement.unlocked
                        ? 'bg-white border-amber-300'
                        : 'bg-stone-100 border-stone-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-800">
                          {achievement.name}
                        </div>
                        <div className="text-sm text-stone-600">
                          {achievement.description}
                        </div>
                        <div className={`text-xs mt-1 ${rarityColors[achievement.rarity]}`}>
                          {achievement.rarity.toUpperCase()}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <span className="text-green-600 text-xl">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* General */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">General</h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatItem label="Games Played" value={stats.totalGamesPlayed} />
                  <StatItem label="Years Played" value={stats.totalYearsPlayed} />
                  <StatItem label="Decisions Made" value={stats.totalDecisionsMade} />
                  <StatItem label="Longest Reign" value={`${stats.longestReign} years`} />
                </div>
              </div>

              {/* Military */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">Military</h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatItem label="Wars Won" value={stats.warsWon} />
                  <StatItem label="Wars Lost" value={stats.warsLost} />
                  <StatItem label="Territories Conquered" value={stats.territoriesConquered} />
                </div>
              </div>

              {/* Diplomacy */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">Diplomacy</h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatItem label="Alliances Formed" value={stats.alliancesFormed} />
                  <StatItem label="Treaties Signed" value={stats.treatiesSigned} />
                  <StatItem label="Royal Marriages" value={stats.royalMarriages} />
                </div>
              </div>

              {/* Other */}
              <div>
                <h3 className="font-semibold text-stone-800 mb-2">Other</h3>
                <div className="grid grid-cols-2 gap-2">
                  <StatItem label="Techs Researched" value={stats.techsResearched} />
                  <StatItem label="Nations Played" value={stats.nationsPlayed.length} />
                  <StatItem label="Revolutions Survived" value={stats.revolutionsSurvived} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white p-2 rounded border border-stone-200">
    <div className="text-xs text-stone-500">{label}</div>
    <div className="font-semibold text-stone-800">{value}</div>
  </div>
);

export default AchievementsPanel;
