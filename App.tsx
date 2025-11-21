
import React, { useState } from 'react';
import MessageLog from './components/MessageLog';
import ActionPanel from './components/ActionPanel';
import LeafletMap from './components/LeafletMap';
import CountrySidebar from './components/CountrySidebar';
import WorldInfoPanel from './components/WorldInfoPanel';
import CourtPanel from './components/CourtPanel';
import EraStatusBar from './components/EraStatusBar';
import DiplomacyPanel from './components/DiplomacyPanel';
import TechPanel from './components/TechPanel';
import { Nation, GamePhase, BriefingData, ResolutionData, LogEntry, Choice, CountryData, LoadingState, LegacyData, Faction, War, TerritoryTransfer, WorldState, Season } from './types';
import { generateBriefing, generateResolution, generateGlobalSimulation, generateIllustration, generateNationProfile, generateCountryData, generateLegacy, generateNationWorldBuilding, generateSeasonalEffects, generateWorldState } from './services/geminiService';
import { getHistoricalCourt, leaderDiesInYear, getDeathsInYear } from './data/historicalLeaders';
import { getInitialGovernment, getEraForYear } from './data/governmentTemplates';
import { processYearEvents, YearEvents } from './services/gameEvents';
import { getInitialDiplomacy } from './data/historicalDiplomacy';
import { selectRandomEvent, DynamicEvent, EventChoice } from './data/dynamicEvents';
import { getInitialResearchState, getTechById, calculateResearchPoints } from './data/technologySystem';
import { getAvailableActions, executeAction, MajorAction } from './data/playerActions';
import { INITIAL_TERRITORIES, Territory, MapState, getTerritoriesForNation } from './data/territorySystem';

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

  // World Building State
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  const [showWorldInfo, setShowWorldInfo] = useState(false);
  const [showCourt, setShowCourt] = useState(false);
  const [showDiplomacy, setShowDiplomacy] = useState(false);
  const [showTech, setShowTech] = useState(false);

  // Dynamic Events State
  const [currentEvent, setCurrentEvent] = useState<DynamicEvent | null>(null);
  const [firedEvents, setFiredEvents] = useState<Map<string, number>>(new Map());

  // Territory State
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES);
  const [availableActions, setAvailableActions] = useState<MajorAction[]>([]);

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
      // Generate briefing, illustration, and world building in parallel
      const [briefingData, image, worldBuildingData, worldStateData] = await Promise.all([
        generateBriefing(selectedNation, year, historyContext, wars),
        generateIllustration(selectedNation.description),
        generateNationWorldBuilding(selectedNation, year),
        generateWorldState(year, nations)
      ]);

      setBriefing(briefingData);
      setImageUrl(image);
      setWorldState(worldStateData);

      // Generate seasonal effects based on world state
      const seasons: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
      const currentSeason = seasons[year % 4];
      const seasonalEffects = await generateSeasonalEffects(selectedNation, year, currentSeason);

      // Get historical court data
      const historicalCourt = getHistoricalCourt(selectedNation.id);

      // Get government and era data
      const government = getInitialGovernment(selectedNation.id);
      const currentEra = getEraForYear(year);

      // Get initial diplomacy
      const diplomacy = getInitialDiplomacy(selectedNation.id);

      // Get initial research state
      const research = getInitialResearchState(selectedNation.id);

      // Update nations with initial factions, world building, court, government, diplomacy, and research data
      setNations(prev => prev.map(n => {
        if (n.id === selectedNation.id) {
          return {
            ...n,
            factions: briefingData.factions,
            culture: worldBuildingData.culture,
            demographics: worldBuildingData.demographics,
            provinces: worldBuildingData.provinces,
            trade: worldBuildingData.trade,
            seasonalEffects: seasonalEffects,
            court: historicalCourt,
            government: government,
            currentEra: currentEra,
            diplomacy: diplomacy,
            research: research
          };
        }
        return n;
      }));

      // Log leader info
      if (historicalCourt) {
        const leader = historicalCourt.leader;
        addLog('EVENT', `${leader.title} ${leader.name}${leader.epithet ? ` "${leader.epithet}"` : ''} rules the realm.`, selectedNation.name);
      }

      // Log world building highlights
      if (worldBuildingData.culture.nationalCharacter.motto) {
        addLog('EVENT', `National motto: "${worldBuildingData.culture.nationalCharacter.motto}"`, selectedNation.name);
      }
      if (worldBuildingData.demographics.totalPopulation) {
        const popMillions = (worldBuildingData.demographics.totalPopulation / 1000).toFixed(1);
        addLog('EVENT', `Population: ${popMillions} million souls`, selectedNation.name);
      }

      // Calculate available major actions
      const updatedNation = nations.find(n => n.id === selectedNation.id);
      if (updatedNation) {
        setAvailableActions(getAvailableActions(updatedNation));
      }

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
      // Calculate new season
      const seasons: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
      const newYear = year + 1;
      const currentSeason = seasons[newYear % 4];

      // Process year events (era transitions, deaths, succession)
      const yearEvents = processYearEvents(nation, year, newYear);

      // Log era transition
      if (yearEvents.eraTransition) {
        addLog('EVENT', yearEvents.eraTransition.narrative, 'World Event');
      }

      // Handle nation transformation (revolution, unification, etc.)
      if (yearEvents.transformation) {
        const t = yearEvents.transformation;
        addLog('EVENT', t.narrative, nation.name);

        // Update nation with transformation
        setNations(prev => prev.map(n => {
          if (n.id === nation.id) {
            return {
              ...n,
              id: t.toNationId,
              name: t.newName,
              government: t.newGovernment,
              currentEra: yearEvents.eraTransition?.newEra || n.currentEra,
              // Clear court - new leadership will be generated
              court: undefined,
              // Stability impact from transformation
              stats: {
                ...n.stats,
                stability: t.type === 'REVOLUTION' ? Math.max(1, n.stats.stability - 2) : n.stats.stability,
                prestige: t.type === 'UNIFICATION' ? Math.min(5, n.stats.prestige + 1) : n.stats.prestige
              }
            };
          }
          return n;
        }));

        // Log leader fate
        const fateMessages: Record<string, string> = {
          'EXECUTED': `The previous ruler has been executed.`,
          'EXILED': `The previous ruler has fled into exile.`,
          'RETAINED': `The previous ruler remains in power under the new system.`,
          'RESIGNED': `The previous ruler has resigned their position.`
        };
        if (fateMessages[t.leaderFate]) {
          addLog('EVENT', fateMessages[t.leaderFate], t.newName);
        }
      }

      // Log deaths and handle succession (only if no transformation)
      for (const death of yearEvents.deaths) {
        addLog('EVENT', death.narrative, nation.name);
      }

      if (yearEvents.succession) {
        addLog('EVENT', yearEvents.succession.narrative, nation.name);
      }

      // Log court replacements
      for (const replacement of yearEvents.replacements) {
        addLog('EVENT', `${replacement.new.name} has been appointed as ${replacement.old.role} to replace the late ${replacement.old.name}.`, nation.name);
      }

      // Advance research progress
      if (nation.research?.currentTech) {
        const pointsPerTurn = calculateResearchPoints(nation.stats.innovation, nation.stats.economy);
        const tech = getTechById(nation.research.currentTech);

        if (tech) {
          const progressIncrease = Math.floor((pointsPerTurn / tech.researchCost) * 100);
          const newProgress = Math.min(100, nation.research.progress + progressIncrease);

          setNations(prev => prev.map(n => {
            if (n.id === nation.id && n.research) {
              if (newProgress >= 100) {
                // Research complete
                addLog('EVENT', `Research complete: ${tech.name}! ${tech.historicalNote || ''}`, nation.name);

                // Apply tech effects
                const newStats = { ...n.stats };
                if (tech.effects.military) newStats.military = Math.min(5, newStats.military + tech.effects.military);
                if (tech.effects.economy) newStats.economy = Math.min(5, newStats.economy + tech.effects.economy);
                if (tech.effects.stability) newStats.stability = Math.min(5, newStats.stability + tech.effects.stability);
                if (tech.effects.innovation) newStats.innovation = Math.min(5, newStats.innovation + tech.effects.innovation);
                if (tech.effects.prestige) newStats.prestige = Math.min(5, newStats.prestige + tech.effects.prestige);

                return {
                  ...n,
                  stats: newStats,
                  research: {
                    ...n.research,
                    currentTech: undefined,
                    progress: 0,
                    completedTechs: [...n.research.completedTechs, tech.id],
                    researchPoints: n.research.researchPoints + pointsPerTurn
                  }
                };
              } else {
                return {
                  ...n,
                  research: {
                    ...n.research,
                    progress: newProgress,
                    researchPoints: n.research.researchPoints + pointsPerTurn
                  }
                };
              }
            }
            return n;
          }));
        }
      }

      // Update nation with new court if changes occurred
      let updatedNation = nation;

      // If transformation occurred, get the updated nation
      if (yearEvents.transformation) {
        // Need to get fresh reference after transformation
        const transformed = nations.find(n => n.id === yearEvents.transformation!.toNationId);
        if (transformed) {
          updatedNation = { ...transformed, name: yearEvents.transformation.newName, government: yearEvents.transformation.newGovernment };
        }
      } else if (yearEvents.succession || yearEvents.replacements.length > 0 || yearEvents.eraTransition) {
        setNations(prev => prev.map(n => {
          if (n.id === nation.id) {
            let updated = { ...n };

            // Update era
            if (yearEvents.eraTransition) {
              updated.currentEra = yearEvents.eraTransition.newEra;
            }

            // Update court after succession
            if (yearEvents.succession && n.court) {
              updated.court = {
                leader: yearEvents.succession.newLeader,
                members: n.court.members.filter(m => m.role !== 'HEIR'),
                succession: {
                  ...n.court.succession,
                  heir: undefined,
                  crisisRisk: Math.min(100, n.court.succession.crisisRisk + 20)
                }
              };
              // Apply stability impact
              updated.stats = {
                ...n.stats,
                stability: Math.max(1, Math.min(5, n.stats.stability + Math.floor(yearEvents.succession.stabilityImpact / 10)))
              };
            }

            // Replace dead court members
            if (yearEvents.replacements.length > 0 && updated.court) {
              const replacedIds = yearEvents.replacements.map(r => r.old.id);
              const newMembers = yearEvents.replacements.map(r => r.new);
              updated.court = {
                ...updated.court,
                members: [
                  ...updated.court.members.filter(m => !replacedIds.includes(m.id)),
                  ...newMembers
                ]
              };
            }

            updatedNation = updated;
            return updated;
          }
          return n;
        }));
      }

      // Generate briefing and seasonal effects in parallel
      const [briefingData, seasonalEffects] = await Promise.all([
        generateBriefing(updatedNation, newYear, historyContext, wars),
        generateSeasonalEffects(updatedNation, newYear, currentSeason)
      ]);

      // Generate illustration after we have the briefing prompt
      const image = await generateIllustration(briefingData.imagePrompt);

      setBriefing(briefingData);
      setImageUrl(image);

      // Update factions and seasonal effects
      const nationId = yearEvents.transformation ? yearEvents.transformation.toNationId : nation.id;
      if (briefingData.factions || seasonalEffects) {
        setNations(prev => prev.map(n =>
          n.id === nationId ? {
            ...n,
            factions: briefingData.factions || n.factions,
            seasonalEffects: seasonalEffects
          } : n
        ));
      }

      // Log season change
      if (seasonalEffects) {
        addLog('EVENT', `${currentSeason}: ${seasonalEffects.description}`, nation.name);
      }

      // Log health warnings
      for (const warning of yearEvents.healthWarnings) {
        addLog('EVENT', warning, nation.name);
      }

      // Update available actions based on current state
      setAvailableActions(getAvailableActions(updatedNation));

      // Check for random event
      const event = selectRandomEvent(updatedNation, newYear, firedEvents);
      if (event) {
        setCurrentEvent(event);
        setFiredEvents(prev => new Map(prev).set(event.id, newYear));
        setPhase('EVENT');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessage(null);
    }
  };

  // Handle event choice
  const handleEventChoice = (choice: EventChoice) => {
    if (!currentEvent || !currentNation) return;

    // Apply effects
    const effects = choice.effects;

    setNations(prev => prev.map(n => {
      if (n.id === currentNation.id) {
        return {
          ...n,
          stats: {
            military: Math.max(1, Math.min(5, n.stats.military + (effects.military || 0))),
            economy: Math.max(1, Math.min(5, n.stats.economy + (effects.economy || 0))),
            stability: Math.max(1, Math.min(5, n.stats.stability + (effects.stability || 0))),
            innovation: Math.max(1, Math.min(5, n.stats.innovation + (effects.innovation || 0))),
            prestige: Math.max(1, Math.min(5, n.stats.prestige + (effects.prestige || 0)))
          }
        };
      }
      return n;
    }));

    // Log the choice
    addLog('DECISION', `${currentEvent.title}: ${choice.text}`, currentNation.name);
    if (effects.customEffect) {
      addLog('EVENT', effects.customEffect, currentNation.name);
    }

    // Clear event and continue to decision phase
    setCurrentEvent(null);
    setPhase('DECISION');
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
    setShowWorldInfo(false);
    setShowCourt(false);
    setShowDiplomacy(false);
    setShowTech(false);
    setCurrentEvent(null);
    setPhase('SELECT_NATION');
  };

  const toggleWorldInfo = () => {
    setShowWorldInfo(prev => !prev);
    if (!showWorldInfo) {
      setShowCourt(false);
      setShowDiplomacy(false);
      setShowTech(false);
    }
  };

  const toggleCourt = () => {
    setShowCourt(prev => !prev);
    if (!showCourt) {
      setShowWorldInfo(false);
      setShowDiplomacy(false);
      setShowTech(false);
    }
  };

  const toggleDiplomacy = () => {
    setShowDiplomacy(prev => !prev);
    if (!showDiplomacy) {
      setShowWorldInfo(false);
      setShowCourt(false);
      setShowTech(false);
    }
  };

  const toggleTech = () => {
    setShowTech(prev => !prev);
    if (!showTech) {
      setShowWorldInfo(false);
      setShowCourt(false);
      setShowDiplomacy(false);
    }
  };

  // Handle tech selection
  const handleSelectTech = (techId: string) => {
    if (!currentNation?.research) return;

    setNations(prev => prev.map(n => {
      if (n.id === currentNation.id && n.research) {
        return {
          ...n,
          research: {
            ...n.research,
            currentTech: techId,
            progress: 0
          }
        };
      }
      return n;
    }));

    const tech = getTechById(techId);
    if (tech) {
      addLog('EVENT', `Research begun on ${tech.name}`, currentNation.name);
    }
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
           <LeafletMap
             nations={nations}
             onSelectNation={handleMapClick}
             activeNationId={currentNationId}
             activeWars={wars}
             territories={territories}
             year={year}
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

        {/* Era Status Bar */}
        {currentNation && phase !== 'SELECT_NATION' && (
          <div className="absolute top-0 left-0 right-0 z-30">
            <EraStatusBar nation={currentNation} year={year} />
          </div>
        )}

        {/* Info Toggle Buttons */}
        {currentNation && phase !== 'SELECT_NATION' && (
          <div className="absolute top-12 left-4 z-30 flex gap-2">
            <button
              onClick={toggleWorldInfo}
              className={`px-3 py-2 rounded-lg shadow-lg transition-all
                ${showWorldInfo
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#f4efe4] text-stone-700 hover:bg-amber-100'
                } border-2 border-stone-400`}
            >
              {showWorldInfo ? '✕' : '🌍'} World
            </button>
            <button
              onClick={toggleCourt}
              className={`px-3 py-2 rounded-lg shadow-lg transition-all
                ${showCourt
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#f4efe4] text-stone-700 hover:bg-purple-100'
                } border-2 border-stone-400`}
            >
              {showCourt ? '✕' : '👑'} Court
            </button>
            <button
              onClick={toggleDiplomacy}
              className={`px-3 py-2 rounded-lg shadow-lg transition-all
                ${showDiplomacy
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#f4efe4] text-stone-700 hover:bg-blue-100'
                } border-2 border-stone-400`}
            >
              {showDiplomacy ? '✕' : '🤝'} Diplomacy
            </button>
            <button
              onClick={toggleTech}
              className={`px-3 py-2 rounded-lg shadow-lg transition-all
                ${showTech
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#f4efe4] text-stone-700 hover:bg-indigo-100'
                } border-2 border-stone-400`}
            >
              {showTech ? '✕' : '💡'} Research
            </button>
          </div>
        )}

        {/* World Info Panel */}
        {showWorldInfo && currentNation && (
          <div className="absolute top-24 left-4 z-20 w-80 max-h-[calc(100vh-7rem)] overflow-hidden">
            <WorldInfoPanel
              culture={currentNation.culture}
              demographics={currentNation.demographics}
              provinces={currentNation.provinces}
              trade={currentNation.trade}
              seasonalEffects={currentNation.seasonalEffects}
              nationName={currentNation.name}
            />
          </div>
        )}

        {/* Court Panel */}
        {showCourt && currentNation && (
          <div className="absolute top-24 left-4 z-20 w-80 max-h-[calc(100vh-7rem)] overflow-hidden">
            <CourtPanel
              court={currentNation.court}
              government={currentNation.government}
              nationName={currentNation.name}
              currentYear={year}
            />
          </div>
        )}

        {/* Diplomacy Panel */}
        {showDiplomacy && currentNation && (
          <div className="absolute top-24 left-4 z-20 w-80 max-h-[calc(100vh-7rem)] overflow-hidden">
            <DiplomacyPanel
              diplomacy={currentNation.diplomacy}
              nations={nations}
              nationName={currentNation.name}
            />
          </div>
        )}

        {/* Tech Panel */}
        {showTech && currentNation && (
          <div className="absolute top-24 left-4 z-20 w-80 max-h-[calc(100vh-7rem)] overflow-hidden">
            <TechPanel
              nation={currentNation}
              onSelectTech={handleSelectTech}
            />
          </div>
        )}

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
            currentEvent={currentEvent}
            onEventChoice={handleEventChoice}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
