import React, { useState } from 'react';
import {
  Church, Users, MapPin, Ship, Cloud, Crown, Wheat, Shield,
  Factory, Gem, ChevronDown, ChevronRight, Landmark, Scale
} from 'lucide-react';
import {
  CulturalSystem, Demographics, Province, TradeNetwork,
  SeasonalEffects, Religion, Tradition, SocialClass, Resource
} from '../types';

interface WorldInfoPanelProps {
  culture?: CulturalSystem;
  demographics?: Demographics;
  provinces?: Province[];
  trade?: TradeNetwork;
  seasonalEffects?: SeasonalEffects;
  nationName: string;
}

type TabType = 'culture' | 'demographics' | 'provinces' | 'trade' | 'season';

const WorldInfoPanel: React.FC<WorldInfoPanelProps> = ({
  culture,
  demographics,
  provinces,
  trade,
  seasonalEffects,
  nationName
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('culture');
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'culture', label: 'Culture', icon: <Church size={16} /> },
    { id: 'demographics', label: 'People', icon: <Users size={16} /> },
    { id: 'provinces', label: 'Provinces', icon: <MapPin size={16} /> },
    { id: 'trade', label: 'Trade', icon: <Ship size={16} /> },
    { id: 'season', label: 'Season', icon: <Cloud size={16} /> },
  ];

  const getReligionTypeColor = (type: Religion['type']) => {
    switch (type) {
      case 'STATE': return 'text-amber-600';
      case 'MAJORITY': return 'text-green-600';
      case 'MINORITY': return 'text-blue-600';
      case 'TOLERATED': return 'text-gray-600';
      case 'PERSECUTED': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTraditionIcon = (category: Tradition['category']) => {
    switch (category) {
      case 'MILITARY': return <Shield size={14} className="text-red-600" />;
      case 'GOVERNANCE': return <Crown size={14} className="text-purple-600" />;
      case 'SOCIAL': return <Users size={14} className="text-blue-600" />;
      case 'ECONOMIC': return <Factory size={14} className="text-green-600" />;
      case 'RELIGIOUS': return <Church size={14} className="text-amber-600" />;
      default: return <Landmark size={14} />;
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'RAW_MATERIAL': return <Factory size={12} className="text-gray-600" />;
      case 'FOOD': return <Wheat size={12} className="text-green-600" />;
      case 'LUXURY': return <Gem size={12} className="text-purple-600" />;
      case 'STRATEGIC': return <Shield size={12} className="text-red-600" />;
      default: return <Gem size={12} />;
    }
  };

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 70) return 'bg-green-500';
    if (satisfaction >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderCultureTab = () => {
    if (!culture) return <p className="text-stone-500 italic">Cultural data not yet gathered...</p>;

    return (
      <div className="space-y-4">
        {/* National Character */}
        <div className="bg-amber-50 p-3 rounded border border-amber-200">
          <h4 className="font-semibold text-amber-800 flex items-center gap-2 mb-2">
            <Crown size={16} /> National Character
          </h4>
          <p className="text-sm italic mb-2">"{culture.nationalCharacter.motto}"</p>
          <p className="text-sm text-stone-600 mb-2">{culture.nationalCharacter.culturalIdentity}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {culture.nationalCharacter.traits.map((trait, i) => (
              <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
                {trait}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {culture.nationalCharacter.values.map((value, i) => (
              <span key={i} className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded">
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* Religions */}
        <div>
          <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
            <Church size={16} /> Religions
          </h4>
          <div className="space-y-2">
            {culture.religions.map((religion, i) => (
              <div key={i} className="bg-stone-50 p-2 rounded border">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{religion.name}</span>
                  <span className={`text-xs font-medium ${getReligionTypeColor(religion.type)}`}>
                    {religion.type}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>Influence</span>
                    <span>{religion.influence}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${religion.influence}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-stone-500 mt-1">{religion.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traditions */}
        <div>
          <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
            <Scale size={16} /> Traditions
          </h4>
          <div className="space-y-2">
            {culture.traditions.map((tradition, i) => (
              <div key={i} className="bg-stone-50 p-2 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  {getTraditionIcon(tradition.category)}
                  <span className="font-medium text-sm">{tradition.name}</span>
                </div>
                <p className="text-xs text-stone-600 mb-1">{tradition.description}</p>
                <p className="text-xs text-green-700 italic">Effect: {tradition.effect}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Tensions */}
        {culture.culturalTensions && culture.culturalTensions.length > 0 && (
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Cultural Tensions</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {culture.culturalTensions.map((tension, i) => (
                <li key={i}>• {tension}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderDemographicsTab = () => {
    if (!demographics) return <p className="text-stone-500 italic">Demographic data not yet gathered...</p>;

    return (
      <div className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-3 rounded border border-blue-200 text-center">
            <p className="text-2xl font-bold text-blue-800">
              {(demographics.totalPopulation / 1000).toFixed(1)}M
            </p>
            <p className="text-xs text-blue-600">Population</p>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
            <p className="text-2xl font-bold text-green-800">
              {demographics.growthRate > 0 ? '+' : ''}{demographics.growthRate.toFixed(1)}%
            </p>
            <p className="text-xs text-green-600">Growth Rate</p>
          </div>
          <div className="bg-purple-50 p-3 rounded border border-purple-200 text-center">
            <p className="text-2xl font-bold text-purple-800">{demographics.urbanization}%</p>
            <p className="text-xs text-purple-600">Urbanization</p>
          </div>
          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-center">
            <p className="text-2xl font-bold text-amber-800">{demographics.literacy}%</p>
            <p className="text-xs text-amber-600">Literacy</p>
          </div>
        </div>

        {/* Social Classes */}
        <div>
          <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
            <Users size={16} /> Social Classes
          </h4>
          <div className="space-y-2">
            {demographics.socialClasses.map((socialClass, i) => (
              <div key={i} className="bg-stone-50 p-2 rounded border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{socialClass.name}</span>
                  <span className="text-xs text-stone-500">{socialClass.percentage}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-stone-500">Wealth: </span>
                    <span className="font-medium">{socialClass.wealth}/5</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Power: </span>
                    <span className="font-medium">{socialClass.influence}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-500">Mood: </span>
                    <div className={`w-2 h-2 rounded-full ${getSatisfactionColor(socialClass.satisfaction)}`} />
                  </div>
                </div>
                <p className="text-xs text-stone-500">{socialClass.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Major Cities */}
        <div>
          <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
            <Landmark size={16} /> Major Cities
          </h4>
          <div className="space-y-1">
            {demographics.populationCenters
              .sort((a, b) => b.population - a.population)
              .map((city, i) => (
                <div key={i} className="flex justify-between items-center bg-stone-50 px-2 py-1 rounded">
                  <span className="text-sm">{i === 0 ? '👑 ' : ''}{city.name}</span>
                  <span className="text-xs text-stone-500">{city.population.toLocaleString()}k</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProvincesTab = () => {
    if (!provinces || provinces.length === 0) {
      return <p className="text-stone-500 italic">Province data not yet gathered...</p>;
    }

    return (
      <div className="space-y-2">
        {provinces.map((province) => (
          <div key={province.id} className="bg-stone-50 rounded border">
            <button
              className="w-full p-2 flex justify-between items-center text-left"
              onClick={() => setExpandedProvince(
                expandedProvince === province.id ? null : province.id
              )}
            >
              <div className="flex items-center gap-2">
                {expandedProvince === province.id ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="font-medium text-sm">
                  {province.type === 'CAPITAL' ? '⭐ ' : ''}{province.name}
                </span>
              </div>
              <span className="text-xs text-stone-500">{province.type}</span>
            </button>

            {expandedProvince === province.id && (
              <div className="px-3 pb-3 border-t">
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-stone-500">Population: </span>
                    <span>{province.population.toLocaleString()}k</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Development: </span>
                    <span>{province.development}/10</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Terrain: </span>
                    <span>{province.terrain}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Climate: </span>
                    <span>{province.climate}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Fortification: </span>
                    <span>{province.fortification}/5</span>
                  </div>
                  <div>
                    <span className="text-stone-500">Unrest: </span>
                    <span className={province.unrest > 50 ? 'text-red-600' : ''}>{province.unrest}%</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-2 mb-2">{province.description}</p>

                {/* Resources */}
                <div>
                  <p className="text-xs font-medium text-stone-700 mb-1">Resources:</p>
                  <div className="flex flex-wrap gap-1">
                    {province.resources.map((resource, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border rounded text-xs"
                      >
                        {getResourceIcon(resource.type)}
                        {resource.name}
                        {resource.exported && <Ship size={10} className="text-blue-500" />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTradeTab = () => {
    if (!trade) return <p className="text-stone-500 italic">Trade data not yet gathered...</p>;

    return (
      <div className="space-y-4">
        {/* Trade Balance */}
        <div className={`p-3 rounded border ${trade.tradeBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">Trade Balance</span>
            <span className={`text-lg font-bold ${trade.tradeBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {trade.tradeBalance >= 0 ? '+' : ''}{trade.tradeBalance.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">Merchant Fleet: {trade.merchantFleet} ships</p>
        </div>

        {/* Exports & Imports */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h4 className="font-semibold text-green-700 text-sm mb-2">📤 Exports</h4>
            <div className="space-y-1">
              {trade.exports.map((good, i) => (
                <div key={i} className="text-xs bg-green-50 px-2 py-1 rounded">
                  {good.name}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 text-sm mb-2">📥 Imports</h4>
            <div className="space-y-1">
              {trade.imports.map((good, i) => (
                <div key={i} className="text-xs bg-blue-50 px-2 py-1 rounded">
                  {good.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Routes */}
        <div>
          <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
            <Ship size={16} /> Trade Routes
          </h4>
          <div className="space-y-2">
            {trade.tradeRoutes.map((route, i) => (
              <div key={i} className="bg-stone-50 p-2 rounded border">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{route.name}</span>
                  <span className="text-xs text-green-600">+{route.value}</span>
                </div>
                <p className="text-xs text-stone-600 mb-1">{route.description}</p>
                <div className="flex justify-between text-xs text-stone-500">
                  <span>Security: {route.security}%</span>
                  <span>{route.goods.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Posts */}
        {trade.majorTradingPosts && trade.majorTradingPosts.length > 0 && (
          <div>
            <h4 className="font-semibold text-stone-700 text-sm mb-2">🏛️ Trading Posts</h4>
            <div className="flex flex-wrap gap-1">
              {trade.majorTradingPosts.map((post, i) => (
                <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
                  {post}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSeasonTab = () => {
    if (!seasonalEffects) return <p className="text-stone-500 italic">Seasonal data not yet gathered...</p>;

    const seasonEmoji = {
      SPRING: '🌸',
      SUMMER: '☀️',
      AUTUMN: '🍂',
      WINTER: '❄️'
    };

    return (
      <div className="space-y-4">
        {/* Current Season */}
        <div className="bg-gradient-to-r from-blue-50 to-amber-50 p-4 rounded border text-center">
          <p className="text-4xl mb-2">{seasonEmoji[seasonalEffects.currentSeason]}</p>
          <p className="text-lg font-semibold">{seasonalEffects.currentSeason}</p>
          <p className="text-sm text-stone-600 mt-2">{seasonalEffects.description}</p>
        </div>

        {/* Key Indicators */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-3 rounded border text-center ${seasonalEffects.campaignSeason ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-2xl">⚔️</p>
            <p className="text-xs font-medium mt-1">
              {seasonalEffects.campaignSeason ? 'Campaign Season' : 'Poor Campaign Weather'}
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded border border-amber-200 text-center">
            <p className="text-2xl">🌾</p>
            <p className="text-xs font-medium mt-1">
              Harvest: {seasonalEffects.harvestQuality}/5
            </p>
          </div>
        </div>

        {/* Weather Conditions */}
        {seasonalEffects.weatherConditions.length > 0 && (
          <div>
            <h4 className="font-semibold text-stone-700 flex items-center gap-2 mb-2">
              <Cloud size={16} /> Weather Conditions
            </h4>
            <div className="space-y-2">
              {seasonalEffects.weatherConditions.map((condition, i) => (
                <div key={i} className={`p-2 rounded border ${condition.severity > 3 ? 'bg-red-50 border-red-200' : 'bg-stone-50'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{condition.type.replace('_', ' ')}</span>
                    <span className="text-xs">Severity: {condition.severity}/5</span>
                  </div>
                  <p className="text-xs text-stone-600 mb-2">{condition.description}</p>
                  {condition.effects && (
                    <div className="flex gap-3 text-xs">
                      {condition.effects.military && (
                        <span className={condition.effects.military < 0 ? 'text-red-600' : 'text-green-600'}>
                          ⚔️ {condition.effects.military > 0 ? '+' : ''}{condition.effects.military}
                        </span>
                      )}
                      {condition.effects.economy && (
                        <span className={condition.effects.economy < 0 ? 'text-red-600' : 'text-green-600'}>
                          💰 {condition.effects.economy > 0 ? '+' : ''}{condition.effects.economy}
                        </span>
                      )}
                      {condition.effects.stability && (
                        <span className={condition.effects.stability < 0 ? 'text-red-600' : 'text-green-600'}>
                          ⚖️ {condition.effects.stability > 0 ? '+' : ''}{condition.effects.stability}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#f4efe4] border-2 border-stone-400 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-stone-700 text-amber-100 px-4 py-2">
        <h3 className="font-bold text-lg">{nationName} - World Overview</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-300 bg-stone-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-amber-100 text-amber-800 border-b-2 border-amber-600'
                : 'text-stone-600 hover:bg-stone-200'
              }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'culture' && renderCultureTab()}
        {activeTab === 'demographics' && renderDemographicsTab()}
        {activeTab === 'provinces' && renderProvincesTab()}
        {activeTab === 'trade' && renderTradeTab()}
        {activeTab === 'season' && renderSeasonTab()}
      </div>
    </div>
  );
};

export default WorldInfoPanel;
