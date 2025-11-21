
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GeoJSONCollection, Nation, War } from '../types';
import Loader from './Loader';
import { Globe, Sword, Coins, Scale } from 'lucide-react';

interface WorldMapProps {
  nations: Nation[];
  onSelectNation: (nationName: string) => void;
  activeNationId: string | null;
  activeWars?: War[];
}

type MapMode = 'POLITICAL' | 'MILITARY' | 'ECONOMY' | 'STABILITY';

const WorldMap: React.FC<WorldMapProps> = ({ nations, onSelectNation, activeNationId, activeWars = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<GeoJSONCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string; nation?: Nation } | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('POLITICAL');

  // Load Map Data (Once)
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json();
        setGeoData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load map data", error);
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  // Initialize SVG & Zoom Behavior
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    
    // Define Arrow Marker
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    if (defs.select('#arrowhead').empty()) {
        defs.append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#b91c1c');
    }

    // Structure Layers: Root Group handles Zoom, internal layers handle content order
    let rootGroup = svg.select<SVGGElement>('#root-group');
    if (rootGroup.empty()) {
        rootGroup = svg.append('g').attr('id', 'root-group');
        rootGroup.append('g').attr('id', 'grid-layer'); // Graticules at bottom
        rootGroup.append('g').attr('id', 'map-layer');
        rootGroup.append('g').attr('id', 'war-layer');
    }

    const { width, height } = containerRef.current.getBoundingClientRect();

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        rootGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [loading]);

  // Main Render Loop (Map + Wars)
  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const rootGroup = svg.select('#root-group');
    const gridLayer = rootGroup.select('#grid-layer');
    const mapLayer = rootGroup.select('#map-layer');
    const warLayer = rootGroup.select('#war-layer');
    
    const { width, height } = containerRef.current.getBoundingClientRect();

    // Projection
    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.6]);

    const pathGenerator = d3.geoPath().projection(projection);

    // --- 0. Graticule (Grid Lines) ---
    const graticule = d3.geoGraticule();
    const gridData = graticule();

    const gridPaths = gridLayer.selectAll('path').data([gridData]);
    
    gridPaths.enter()
      .append('path')
      .merge(gridPaths as any)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#b45309')
      .attr('stroke-width', 0.3)
      .attr('stroke-opacity', 0.15)
      .attr('vector-effect', 'non-scaling-stroke'); // Keeps line thin during zoom


    // --- 1. Draw Countries ---
    const getNation = (regionName: string) => 
      nations.find(n => n.geoNames?.includes(regionName) || n.name === regionName);

    // Color Scales
    const militaryScale = d3.scaleLinear<string>().domain([1, 5]).range(['#fee2e2', '#7f1d1d']);
    const economyScale = d3.scaleLinear<string>().domain([1, 5]).range(['#fef9c3', '#713f12']);
    const stabilityScale = d3.scaleLinear<string>().domain([1, 5]).range(['#e0f2fe', '#0c4a6e']);

    const paths = mapLayer.selectAll('path.country-path')
      .data(geoData.features);

    paths.enter()
      .append('path')
      .attr('class', 'country-path')
      .merge(paths as any)
      .attr('d', (d: any) => pathGenerator(d))
      .attr('stroke', '#3a3a3a')
      .attr('vector-effect', 'non-scaling-stroke') // Crucial for "engraving" look during zoom
      .attr('stroke-width', (d: any) => hoveredRegion?.name === d.properties.name ? 1.5 : 0.5)
      .attr('stroke-opacity', 0.5)
      .style('cursor', 'pointer')
      .transition().duration(500) // Smooth color update
      .attr('fill', (d: any) => {
        const nation = getNation(d.properties.name);
        
        if (!nation) return '#e2d5c3'; // Neutral/Unknown

        if (mapMode === 'POLITICAL') {
          if (nation.id === activeNationId) return '#b45309'; // Active Player
          return '#fdf6e3';
        } else if (mapMode === 'MILITARY') {
          return militaryScale(nation.stats.military);
        } else if (mapMode === 'ECONOMY') {
          return economyScale(nation.stats.economy);
        } else if (mapMode === 'STABILITY') {
          return stabilityScale(nation.stats.stability);
        }
        return '#fdf6e3';
      });
      
      // Event listeners
      mapLayer.selectAll<SVGPathElement, any>('path.country-path')
        .on('click', (event, d) => {
            event.stopPropagation();
            onSelectNation(d.properties.name);
        })
        .on('mouseover', function(event, d) {
            const nation = getNation(d.properties.name);
            setHoveredRegion({ name: d.properties.name, nation });
            d3.select(this).attr('stroke-width', 2).attr('stroke', '#2c241b').attr('stroke-opacity', 1);
        })
        .on('mouseout', function() {
            setHoveredRegion(null);
            d3.select(this).attr('stroke-width', 0.5).attr('stroke', '#3a3a3a').attr('stroke-opacity', 0.5);
        });

    paths.exit().remove();


    // --- 2. Draw War Layer ---
    warLayer.selectAll('*').remove();
    
    // Helper: Get visual center of a nation
    const getNationCenter = (nationId: string): [number, number] | null => {
        const nation = nations.find(n => n.id === nationId);
        if (!nation || !nation.geoNames) return null;
        
        for (const name of nation.geoNames) {
            const feature = geoData.features.find((f: any) => f.properties.name === name);
            if (feature) {
                const centroid = d3.geoCentroid(feature); 
                return projection(centroid) || null; 
            }
        }
        return null;
    }

    if (activeWars.length > 0) {
        activeWars.forEach(war => {
             if (war.state !== 'ONGOING') return;

             const start = getNationCenter(war.attackerId);
             const end = getNationCenter(war.defenderId);

             if (start && end) {
                 const [x1, y1] = start;
                 const [x2, y2] = end;

                 // Curve calculations
                 const midX = (x1 + x2) / 2;
                 const midY = (y1 + y2) / 2;
                 const dx = x2 - x1;
                 const dy = y2 - y1;
                 const dist = Math.sqrt(dx * dx + dy * dy);
                 const offsetAmount = Math.min(dist * 0.2, 100); 
                 
                 const cx = midX - (dy / dist) * offsetAmount;
                 const cy = midY + (dx / dist) * offsetAmount;

                 const pathData = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;

                 // Draw Arc
                 warLayer.append('path')
                     .attr('d', pathData)
                     .attr('fill', 'none')
                     .attr('stroke', '#b91c1c') 
                     .attr('stroke-width', 2)
                     .attr('vector-effect', 'non-scaling-stroke') // Keeps war lines visible but crisp
                     .attr('stroke-dasharray', '6,4')
                     .attr('stroke-linecap', 'round')
                     .attr('marker-end', 'url(#arrowhead)')
                     .style('filter', 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))')
                     .append('animate')
                     .attr('attributeName', 'stroke-dashoffset')
                     .attr('from', '20')
                     .attr('to', '0')
                     .attr('dur', '1.5s')
                     .attr('repeatCount', 'indefinite');

                 // Draw Icon
                 warLayer.append('text')
                    .attr('x', cx)
                    .attr('y', cy - 5)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '18px') // Text size doesn't support vector-effect easily, might scale
                    .text('⚔️')
                    .style('pointer-events', 'none')
                    .style('filter', 'drop-shadow(0px 0px 4px rgba(255,255,255,0.8))');
             }
        });
    }

  }, [geoData, nations, activeNationId, mapMode, activeWars]);


  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#c0b6a2]">
        <Loader text="Unfurling the Map..." />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-[#c0b6a2] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]">
      {/* Vintage Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply z-10"></div>
      
      <svg 
        ref={svgRef} 
        className="w-full h-full relative z-0"
        style={{ filter: 'sepia(0.3) contrast(1.1)' }}
      />

      {/* Map Controls */}
      <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
         <div className="bg-[#fdf6e3]/90 backdrop-blur border border-[#2c241b] rounded-lg shadow-lg p-2 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[#2c241b] text-center mb-1">Map Mode</span>
            
            <button 
              onClick={() => setMapMode('POLITICAL')}
              className={`flex items-center gap-2 p-2 rounded text-xs font-bold font-serif transition-colors ${mapMode === 'POLITICAL' ? 'bg-[#b45309] text-[#fdf6e3]' : 'text-[#2c241b] hover:bg-[#eaddcf]'}`}
            >
              <Globe size={14} /> Political
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
      
      {/* Hover Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-6 right-6 z-20 bg-[#2c241b] text-[#fdf6e3] p-4 rounded border border-[#b45309] shadow-xl pointer-events-none min-w-[200px]">
          <div className="flex justify-between items-start">
             <h3 className="font-serif text-xl tracking-wide">{hoveredRegion.nation?.name || hoveredRegion.name}</h3>
             {hoveredRegion.nation && <span className="text-xs bg-[#b45309] px-1 rounded text-white ml-2">Known</span>}
          </div>
          
          {hoveredRegion.nation ? (
            <div className="mt-2 space-y-1">
               <p className="text-xs italic text-[#fdf6e3]/70">{hoveredRegion.nation.rulerTitle}</p>
               <div className="h-px bg-[#fdf6e3]/20 my-2"></div>
               {mapMode === 'POLITICAL' && (
                 <p className="text-xs">{hoveredRegion.nation.description}</p>
               )}
               {mapMode === 'MILITARY' && (
                 <div className="flex justify-between items-center text-sm">
                   <span>Military Strength</span>
                   <span className="font-bold text-red-400">{hoveredRegion.nation.stats.military}/5</span>
                 </div>
               )}
               {mapMode === 'ECONOMY' && (
                 <div className="flex justify-between items-center text-sm">
                   <span>Economic Power</span>
                   <span className="font-bold text-yellow-400">{hoveredRegion.nation.stats.economy}/5</span>
                 </div>
               )}
               {mapMode === 'STABILITY' && (
                 <div className="flex justify-between items-center text-sm">
                   <span>Stability</span>
                   <span className="font-bold text-sky-400">{hoveredRegion.nation.stats.stability}/5</span>
                 </div>
               )}
            </div>
          ) : (
             <p className="text-xs text-[#fdf6e3]/50 italic mt-1">Region Unexplored by Player</p>
          )}
        </div>
      )}
      
      {/* Legend / Deco */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none opacity-60">
        <h2 className="text-[#2c241b] font-serif italic text-sm">Mappa Mundi, 1750</h2>
      </div>
    </div>
  );
};

export default WorldMap;
