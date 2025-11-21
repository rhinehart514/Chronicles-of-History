
import React, { useState } from 'react';
import MessageLog from './components/MessageLog';
import ActionPanel from './components/ActionPanel';
import WorldMap from './components/WorldMap';
import CountrySidebar from './components/CountrySidebar';
import { Nation, GamePhase, BriefingData, ResolutionData, LogEntry, Choice, CountryData, LoadingState, LegacyData, Faction, War, TerritoryTransfer } from './types';
import { generateBriefing, generateResolution, generateGlobalSimulation, generateIllustration, generateNationProfile, generateCountryData, generateLegacy } from './services/geminiService';

// Initial Nations Data (1750)
const INITIAL_NATIONS: Nation[] = [
  {
    id: 'britain',
    name: 'Kingdom of Great Britain',
    description: 'A rising maritime superpower with a constitutional monarchy.',
    rulerTitle: 'King George II',
    stats: { military: 4, economy: 5, stability: 4, innovation: 5, prestige: 4 },
    geoNames: ['England', 'United Kingdom', 'Ireland']
  },
  {
    id: 'france',
    name: 'Kingdom of France',
    description: 'The cultural heart of Europe, wealthy but burdened by debt.',
    rulerTitle: 'King Louis XV',
    stats: { military: 5, economy: 4, stability: 3, innovation: 5, prestige: 5 },
    geoNames: ['France']
  },
  {
    id: 'qing',
    name: 'Great Qing',
    description: 'The mighty empire at the center of the world, rich and vast.',
    rulerTitle: 'Qianlong Emperor',
    stats: { military: 5, economy: 5, stability: 5, innovation: 3, prestige: 5 },
    geoNames: ['China', 'Mongolia']
  },
  {
    id: 'prussia',
    name: 'Kingdom of Prussia',
    description: 'A small state with an army that rivals empires.',
    rulerTitle: 'Frederick the Great',
    stats: { military: 5, economy: 2, stability: 4, innovation: 4, prestige: 3 },
    geoNames: ['Germany'] 
  },
  {
    id: 'russia',
    name: 'Russian Empire',
    description: 'A sprawling, modernizing giant expanding in all directions.',
    rulerTitle: 'Empress Elizabeth',
    stats: { military: 4, economy: 2, stability: 3, innovation: 2, prestige: 3 },
    geoNames: ['Russia', 'Ukraine', 'Belarus']
  },
  {
    id: 'ottoman',
    name: 'Ottoman Empire',
    description: 'The Sublime Porte, straddling continents but facing stagnation.',
    rulerTitle: 'Sultan Mahmud I',
    stats: { military: 3, economy: 3, stability: 3, innovation: 2, prestige: 4 },
    geoNames: ['Turkey', 'Greece', 'Syria', 'Iraq', 'Egypt']
  },
  {
    id: 'spain',
    name: 'Kingdom of Spain',
    description: 'An immense empire seeking to regain its former glory.',
    rulerTitle: 'Ferdinand VI',
    stats: { military: 3, economy: 3, stability: 4, innovation: 2, prestige: 4 },
    geoNames: ['Spain', 'Mexico', 'Colombia', 'Argentina', 'Peru']
  }
];

const App: React.FC = () => {
  // Game State
  const [year, setYear] = useState(1750);
  const [phase, setPhase] = useState<GamePhase>('SELECT_NATION'); // Start at selection
  const [nations, setNations] = useState<Nation[]>(INITIAL_NATIONS);
  const [wars, setWars] = useState<War[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [historyContext, setHistoryContext] = useState<string[]>([]); 
  
  // Current Reign State
  const [currentNationId, setCurrentNationId] = useState<string | null>(null);
  const [reignStartYear, setReignStartYear] = useState<number>(1750);
  const [reignLogs, setReignLogs] = useState<string[]>([]); // Specific logs for the current session/reign

  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [resolution, setResolution] = useState<ResolutionData | null>(null);
  const [legacy, setLegacy] = useState<LegacyData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  // Sidebar State
  const [sidebarOpenName, setSidebarOpenName] = useState<string | null>(null);
  const [sidebarData, setSidebarData] = useState<CountryData | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState<LoadingState>(LoadingState.IDLE);

  const currentNation = nations.find(n => n.id === currentNationId) || null;

  const addLog = (type: LogEntry['type'], content: string, nationName?: string) => {
    const newLogEntry = { year, type, content, nationName };
    setLogs(prev => [...prev, newLogEntry]);
    
    // Update history buffer (keep last 5 meaningful events for global context)
    setHistoryContext(prev => {
      const newEntry = `${year} (${nationName || 'World'}): ${content}`;
      const newHistory = [newEntry, ...prev];
      return newHistory.slice(0, 5);
    });

    // Update Reign logs (for Legacy generation)
    if (currentNationId && (nationName === currentNation?.name || type === 'DECISION' || type === 'EVENT' || type === 'CONQUEST' || type === 'WAR')) {
      setReignLogs(prev => [...prev, `${year}: ${content}`]);
    }
  };

  // Helper to handle territory transfers logic
  const processTerritoryTransfer = (transfer: TerritoryTransfer, nationList: Nation[]): Nation[] => {
      const { regionName, loserId, winnerId, narrative } = transfer;
      let updated = [...nationList];
      
      // Find loser and winner (handle loose ID matching)
      let loserIndex = updated.findIndex(n => n.id === loserId || n.geoNames?.includes(regionName));
      let winnerIndex = updated.findIndex(n => n.id === winnerId);

      // If we can't find exact loser by ID, try to find who owns the region
      if (loserIndex === -1) {
        loserIndex = updated.findIndex(n => n.geoNames?.includes(regionName));
      }

      if (loserIndex !== -1 && winnerIndex !== -1) {
        // Remove from loser
        const loser = updated[loserIndex];
        const newLoserGeo = loser.geoNames?.filter(g => g !== regionName) || [];
        updated[loserIndex] = { ...loser, geoNames: newLoserGeo };

        // Add to winner
        const winner = updated[winnerIndex];
        const newWinnerGeo = [...(winner.geoNames || []), regionName];
        updated[winnerIndex] = { ...winner, geoNames: newWinnerGeo };
        
        // Determine log type based on player involvement
        const isPlayerInvolved = (loser.id === currentNationId || winner.id === currentNationId);
        addLog('CONQUEST', narrative, isPlayerInvolved ? currentNation?.name : 'World Event');
      }
      
      return updated;
  };

  // Phase 1: Handle Map Click (Preview)
  const handleMapClick = async (idOrGeoName: string) => {
    if (phase !== 'SELECT_NATION' || loadingMessage) return;

    setSidebarOpenName(idOrGeoName);
    setSidebarLoading(LoadingState.LOADING_AI);
    setSidebarData(null);

    try {
      let selectedNation = nations.find(n => n.id === idOrGeoName || n.geoNames?.includes(idOrGeoName));
      
      const promises: Promise<any>[] = [
        generateCountryData(selectedNation?.name || idOrGeoName, year)
      ];

      if (!selectedNation) {
         promises.push(generateNationProfile(idOrGeoName, year));
      }

      const results = await Promise.all(promises);
      const countryData = results[0];
      
      setSidebarData(countryData);
      
      if (!selectedNation && results[1]) {
        const newNation = results[1] as Nation;
        newNation.geoNames = [idOrGeoName];
        setNations(prev => [...prev, newNation]);
      } else if (selectedNation) {
        setCurrentNationId(selectedNation.id);
      }

      if (!selectedNation) {
         const created = results[1] as Nation;
         setCurrentNationId(created.id);
      }
      
      setSidebarLoading(LoadingState.SUCCESS);

    } catch (error) {
      console.error(error);
      setSidebarLoading(LoadingState.ERROR);
    }
  };

  // Sidebar Action: Inhabit / Start Game
  const handleStartGame = async () => {
    if (!currentNationId) return;
    
    const selectedNation = nations.find(n => n.id === currentNationId);
    if (!selectedNation) return;

    setSidebarOpenName(null); // Close sidebar
    setReignStartYear(year);
    setReignLogs([]); // Reset logs for this specific reign
    setPhase('BRIEFING');
    setLoadingMessage("Consulting the Archives...");
    addLog('EVENT', `The World Spirit inhabits ${selectedNation.name}.`, selectedNation.name);

    try {
      const briefingData = await generateBriefing(selectedNation, year, historyContext, wars);
      const image = await generateIllustration(briefingData.imagePrompt);

      setBriefing(briefingData);
      setImageUrl(image);
      
      // Update nations with initial factions from briefing if not present
      setNations(prev => prev.map(n => {
        if (n.id === selectedNation.id) {
          return { ...n, factions: briefingData.factions };
        }
        return n;
      }));

    } catch (error) {
      console.error(error);
      addLog('EVENT', "The mists of time obscure the vision... (Error loading briefing)");
      setPhase('SELECT_NATION');
    } finally {
      setLoadingMessage(null);
    }
  };

  // Phase 2 -> 3: Make Decision
  const handleMakeDecision = async (choice: Choice) => {
    if (!currentNation || !briefing) return;

    setPhase('RESOLUTION');
    setLoadingMessage("Weaving Fate...");
    addLog('DECISION', choice.text, currentNation.name);

    try {
      const resData = await generateResolution(currentNation, year, choice.text, choice.type, historyContext, wars);
      setResolution(resData);
      
      let updatedNations = nations.map(n => {
        if (n.id === currentNation.id) {
          // Update Stats
          const newStats = {
            military: Math.max(1, Math.min(5, n.stats.military + (resData.statChanges.military || 0))),
            economy: Math.max(1, Math.min(5, n.stats.economy + (resData.statChanges.economy || 0))),
            stability: Math.max(1, Math.min(5, n.stats.stability + (resData.statChanges.stability || 0))),
            innovation: Math.max(1, Math.min(5, n.stats.innovation + (resData.statChanges.innovation || 0))),
            prestige: Math.max(1, Math.min(5, n.stats.prestige + (resData.statChanges.prestige || 0))),
          };

          // Update Factions
          let newFactions = n.factions ? [...n.factions] : [];
          if (resData.factionChanges) {
            resData.factionChanges.forEach(change => {
              const factIndex = newFactions.findIndex(f => f.name.includes(change.name) || change.name.includes(f.name));
              if (factIndex !== -1) {
                newFactions[factIndex] = {
                  ...newFactions[factIndex],
                  approval: Math.max(0, Math.min(100, newFactions[factIndex].approval + change.change))
                };
              }
            });
          }
          
          return { ...n, stats: newStats, factions: newFactions };
        }
        return n;
      });

      // Handle War Updates
      if (resData.warUpdate) {
        const update = resData.warUpdate;
        if (update.state === 'ONGOING') {
          // Start or continue war
          setWars(prev => {
            // if already exists, update it, else add
            const exists = prev.findIndex(w => w.attackerId === update.attackerId && w.defenderId === update.defenderId);
            if (exists >= 0) return prev;
            return [...prev, update];
          });
          addLog('WAR', update.narrative, currentNation.name);
        } else {
          // End war
          setWars(prev => prev.filter(w => w.attackerId !== update.attackerId && w.defenderId !== update.defenderId));
          addLog('WAR', update.narrative, currentNation.name);
        }
      }

      // Handle Territory Transfer
      if (resData.territoryTransfer) {
         updatedNations = processTerritoryTransfer(resData.territoryTransfer, updatedNations);
      }

      setNations(updatedNations);
      
    } catch (error) {
      console.error(error);
      setPhase('BRIEFING'); 
    } finally {
      setLoadingMessage(null);
    }
  };

  // Phase 3 -> 4: End Turn & Global Simulation
  const handleEndTurn = async () => {
    if (!currentNation) return;
    
    setPhase('SIMULATION');
    setLoadingMessage(`Simulating World Events for ${year}...`);
    
    if (resolution) {
      addLog('EVENT', resolution.narrative, currentNation.name);
    }

    try {
      // Pass history context so global events don't contradict player actions
      const simData = await generateGlobalSimulation(year, currentNation.id, nations, historyContext, wars);
      
      let updatedNations = nations.map(n => {
        const update = simData.nationUpdates.find(u => u.nationId === n.id);
        if (update && update.changes) {
           return {
             ...n,
             stats: {
              military: Math.max(1, Math.min(5, n.stats.military + (update.changes.military || 0))),
              economy: Math.max(1, Math.min(5, n.stats.economy + (update.changes.economy || 0))),
              stability: Math.max(1, Math.min(5, n.stats.stability + (update.changes.stability || 0))),
              innovation: Math.max(1, Math.min(5, n.stats.innovation + (update.changes.innovation || 0))),
              prestige: Math.max(1, Math.min(5, n.stats.prestige + (update.changes.prestige || 0))),
             }
           };
        }
        return n;
      });

      // Handle AI vs AI Wars
      if (simData.newWars) {
        setWars(prev => {
          const newUnique = simData.newWars!.filter(nw => !prev.find(ow => ow.attackerId === nw.attackerId && ow.defenderId === nw.defenderId));
          return [...prev, ...newUnique];
        });
        simData.newWars.forEach(w => addLog('WAR', w.narrative));
      }

      if (simData.endedWars) {
        const endedIds = simData.endedWars.map(w => `${w.attackerId}-${w.defenderId}`);
        setWars(prev => prev.filter(w => !endedIds.includes(`${w.attackerId}-${w.defenderId}`)));
        simData.endedWars.forEach(w => addLog('WAR', w.narrative));
      }

      // Handle AI Territory Transfers
      if (simData.territoryTransfers) {
        simData.territoryTransfers.forEach(transfer => {
          updatedNations = processTerritoryTransfer(transfer, updatedNations);
        });
      }

      setNations(updatedNations);
      addLog('WORLD_UPDATE', simData.summary);
      
      setTimeout(() => {
        setYear(y => y + 1);
        setBriefing(null);
        setResolution(null);
        setImageUrl(null);
        
        // Auto-start next briefing loop for the SAME nation
        handleNextYearBriefing(updatedNations.find(n => n.id === currentNationId)!);
      }, 3000); 

    } catch (error) {
      console.error(error);
      setYear(y => y + 1);
      setPhase('BRIEFING');
    } finally {
      setLoadingMessage(null);
    }
  };

  // Helper: Generate next briefing without user selection (Continuity)
  const handleNextYearBriefing = async (nation: Nation) => {
    setPhase('BRIEFING');
    setLoadingMessage(`Consulting Archives for ${year + 1}...`); // Visual update
    try {
      const briefingData = await generateBriefing(nation, year + 1, historyContext, wars);
      const image = await generateIllustration(briefingData.imagePrompt);
      setBriefing(briefingData);
      setImageUrl(image);

      // Update factions if they changed/appeared in new briefing
      if (briefingData.factions) {
        setNations(prev => prev.map(n => 
          n.id === nation.id ? { ...n, factions: briefingData.factions } : n
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessage(null);
    }
  };

  // ASCENSION: Leave the nation
  const handleAscend = async () => {
    if (!currentNation) return;
    
    setPhase('LEGACY_VIEW');
    setLoadingMessage("Etching your name into history...");
    
    try {
      const legacyData = await generateLegacy(currentNation, reignStartYear, year, reignLogs);
      setLegacy(legacyData);
      addLog('LEGACY', `The Spirit departs ${currentNation.name}. The ${legacyData.eraName} has ended.`);
    } catch (error) {
      console.error(error);
      // Fallback if legacy fails
      handleReturnToMap();
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleReturnToMap = () => {
    setLegacy(null);
    setBriefing(null);
    setResolution(null);
    setImageUrl(null);
    setCurrentNationId(null);
    setSidebarOpenName(null);
    setPhase('SELECT_NATION');
  };

  const handleCloseSidebar = () => {
    setSidebarOpenName(null);
    setCurrentNationId(null); 
  };

  return (
    <div className="flex w-screen h-screen bg-[#2c241b] overflow-hidden">
      {/* Left Panel: Message Log (30%) */}
      <div className="hidden md:block w-1/3 h-full border-r-4 border-[#2c241b] z-10 shadow-2xl relative">
        <MessageLog logs={logs} />
      </div>

      {/* Right Panel: Map & Action Area (70%) */}
      <div className="w-full md:w-2/3 h-full relative">
        
        {/* Background Layer: Interactive Map */}
        <div className="absolute inset-0 z-0">
           <WorldMap 
             nations={nations}
             onSelectNation={handleMapClick}
             activeNationId={currentNationId}
             activeWars={wars}
           />
        </div>

        {/* Sidebar Overlay */}
        <CountrySidebar 
          countryData={sidebarData}
          selectedCountryName={sidebarOpenName}
          loadingState={sidebarLoading}
          onClose={handleCloseSidebar}
          onPlay={handleStartGame}
        />

        {/* Foreground Layer: UI Panel (Game Loop) */}
        <div className={`absolute inset-0 z-10 transition-all duration-500 ${phase === 'SELECT_NATION' ? 'pointer-events-none' : 'pointer-events-auto'}`}>
          <ActionPanel 
            phase={phase}
            year={year}
            nations={nations}
            currentNation={currentNation}
            briefing={briefing}
            resolution={resolution}
            legacy={legacy}
            imageUrl={imageUrl}
            onSelectNation={handleMapClick}
            onMakeDecision={handleMakeDecision}
            onEndTurn={handleEndTurn}
            onAscend={handleAscend}
            onReturnToMap={handleReturnToMap}
            loadingMessage={loadingMessage}
            activeWars={wars}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
