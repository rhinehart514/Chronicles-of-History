import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJSONCollection, Nation, War } from '../types';
import { Territory, getGovernmentColor } from '../data/territorySystem';
import { Globe, Sword, Coins, Scale, Map } from 'lucide-react';
import Loader from './Loader';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletMapProps {
  nations: Nation[];
  onSelectNation: (nationName: string) => void;
  activeNationId: string | null;
  activeWars?: War[];
  territories?: Territory[];
  year?: number;
}

type MapMode = 'POLITICAL' | 'TERRITORIAL' | 'MILITARY' | 'ECONOMY' | 'STABILITY';

// Custom hook to handle map events
const MapEvents: React.FC<{ onMapReady: () => void }> = ({ onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    onMapReady();
  }, [map, onMapReady]);

  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  nations,
  onSelectNation,
  activeNationId,
  activeWars = [],
  territories = [],
  year = 1750
}) => {
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapMode, setMapMode] = useState<MapMode>('POLITICAL');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json();
        setGeoData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load GeoJSON:', error);
        setLoading(false);
      }
    };
    fetchGeoData();
  }, []);

  // Helper functions
  const getNation = (regionName: string) =>
    nations.find(n => n.geoNames?.includes(regionName) || n.name === regionName);

  const getTerritoryOwner = (regionName: string) => {
    const territory = territories.find(t => t.geoName === regionName);
    if (!territory) return null;
    return nations.find(n => n.id === territory.ownerId);
  };

  // Color scales
  const getStatColor = (value: number, mode: 'military' | 'economy' | 'stability') => {
    const scales = {
      military: ['#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#7f1d1d'],
      economy: ['#fef9c3', '#fef08a', '#fde047', '#facc15', '#713f12'],
      stability: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0c4a6e']
    };
    return scales[mode][Math.min(value - 1, 4)];
  };

  // Style function for GeoJSON features
  const getFeatureStyle = (feature: any) => {
    const regionName = feature.properties.name;
    const nation = getNation(regionName);
    const owner = getTerritoryOwner(regionName);
    const territory = territories.find(t => t.geoName === regionName);
    const n = nation || owner;

    let fillColor = '#e2d5c3'; // Default neutral
    let fillOpacity = 0.7;
    let weight = 1;
    let color = '#3a3a3a';

    if (n) {
      // Determine fill color based on map mode
      if (mapMode === 'POLITICAL') {
        fillColor = n.id === activeNationId ? '#b45309' : '#fdf6e3';
      } else if (mapMode === 'TERRITORIAL') {
        if (n.id === activeNationId) {
          fillColor = '#b45309';
        } else {
          const govType = n.government?.type || 'ABSOLUTE_MONARCHY';
          fillColor = getGovernmentColor(govType);
          if (territory?.isColony) {
            fillOpacity = 0.5;
          }
        }
      } else if (mapMode === 'MILITARY') {
        fillColor = getStatColor(n.stats.military, 'military');
      } else if (mapMode === 'ECONOMY') {
        fillColor = getStatColor(n.stats.economy, 'economy');
      } else if (mapMode === 'STABILITY') {
        fillColor = getStatColor(n.stats.stability, 'stability');
      }

      // Highlight player nation
      if (n.id === activeNationId) {
        color = '#fbbf24';
        weight = 2;
      }
    }

    // Highlight hovered region
    if (hoveredRegion === regionName) {
      weight = 3;
      color = '#2c241b';
    }

    return {
      fillColor,
      fillOpacity,
      weight,
      color,
      opacity: 0.8
    };
  };

  // Event handlers for each feature
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const regionName = feature.properties.name;
    const nation = getNation(regionName) || getTerritoryOwner(regionName);

    // Click handler
    layer.on('click', () => {
      onSelectNation(regionName);
    });

    // Hover handlers
    layer.on('mouseover', (e) => {
      setHoveredRegion(regionName);
      const target = e.target as L.Path;
      target.setStyle({
        weight: 3,
        color: '#2c241b'
      });
      target.bringToFront();
    });

    layer.on('mouseout', (e) => {
      setHoveredRegion(null);
      const target = e.target as L.Path;
      target.setStyle(getFeatureStyle(feature));
    });

    // Tooltip
    if (nation) {
      let tooltipContent = `<div class="font-serif">
        <strong class="text-lg">${nation.name}</strong><br/>
        <span class="text-sm italic">${nation.rulerTitle || ''}</span>
      </div>`;

      if (mapMode === 'MILITARY') {
        tooltipContent += `<div class="mt-1">Military: <strong>${nation.stats.military}/5</strong></div>`;
      } else if (mapMode === 'ECONOMY') {
        tooltipContent += `<div class="mt-1">Economy: <strong>${nation.stats.economy}/5</strong></div>`;
      } else if (mapMode === 'STABILITY') {
        tooltipContent += `<div class="mt-1">Stability: <strong>${nation.stats.stability}/5</strong></div>`;
      } else if (mapMode === 'TERRITORIAL' && nation.government) {
        tooltipContent += `<div class="mt-1">Government: <strong>${nation.government.type?.replace('_', ' ')}</strong></div>`;
      }

      layer.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'top',
        className: 'custom-tooltip'
      });
    } else {
      layer.bindTooltip(`<div class="font-serif">${regionName}</div>`, {
        sticky: true,
        direction: 'top',
        className: 'custom-tooltip'
      });
    }
  };

  // Get capitals for markers
  const capitals = useMemo(() => {
    return territories
      .filter(t => t.isCapital)
      .map(t => {
        const nation = nations.find(n => n.id === t.ownerId);
        return { territory: t, nation };
      })
      .filter(c => c.nation);
  }, [territories, nations]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#c0b6a2]">
        <Loader text="Unfurling the Map..." />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Map Container */}
      <MapContainer
        center={[30, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        style={{ width: '100%', height: '100%', background: '#c0b6a2' }}
        worldCopyJump={true}
        maxBoundsViscosity={1.0}
      >
        {/* Base tile layer - Stamen Toner Lite for historical feel */}
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          opacity={0.3}
        />

        {/* GeoJSON countries layer */}
        {geoData && (
          <GeoJSON
            key={`${mapMode}-${activeNationId}-${hoveredRegion}`}
            data={geoData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        <MapEvents onMapReady={() => {}} />
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
        <div className="bg-[#fdf6e3]/90 backdrop-blur border border-[#2c241b] rounded-lg shadow-lg p-2 flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-[#2c241b] text-center mb-1">Map Mode</span>

          <button
            onClick={() => setMapMode('POLITICAL')}
            className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'POLITICAL' ? 'bg-[#b45309] text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-[#eaddcf]'}`}
          >
            <Globe size={14} /> Political
          </button>
          <button
            onClick={() => setMapMode('TERRITORIAL')}
            className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'TERRITORIAL' ? 'bg-purple-800 text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-purple-100'}`}
          >
            <Map size={14} /> Territorial
          </button>
          <button
            onClick={() => setMapMode('MILITARY')}
            className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'MILITARY' ? 'bg-red-900 text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-red-100'}`}
          >
            <Sword size={14} /> Military
          </button>
          <button
            onClick={() => setMapMode('ECONOMY')}
            className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'ECONOMY' ? 'bg-yellow-700 text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-yellow-100'}`}
          >
            <Coins size={14} /> Economy
          </button>
          <button
            onClick={() => setMapMode('STABILITY')}
            className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'STABILITY' ? 'bg-sky-800 text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-sky-100'}`}
          >
            <Scale size={14} /> Stability
          </button>
        </div>
      </div>

      {/* Year display */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none">
        <div className="bg-[#2c241b]/80 backdrop-blur px-3 py-1 rounded">
          <h2 className="text-[#fdf6e3] font-serif italic text-sm">Mappa Mundi, {year}</h2>
        </div>
      </div>

      {/* Custom tooltip styles */}
      <style>{`
        .custom-tooltip {
          background: #2c241b !important;
          color: #fdf6e3 !important;
          border: 1px solid #b45309 !important;
          border-radius: 4px !important;
          padding: 8px 12px !important;
          font-family: serif !important;
        }
        .custom-tooltip::before {
          border-top-color: #2c241b !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default LeafletMap;
