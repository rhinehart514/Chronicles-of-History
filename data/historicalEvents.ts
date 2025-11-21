// Historical Events System - Real events that trigger based on year
// These provide authentic historical context and immersion

import { Nation, NationStats } from '../types';

export interface HistoricalEvent {
  id: string;
  year: number;
  endYear?: number; // For multi-year events
  title: string;
  description: string;
  detailedNarrative: string;

  // Who is affected
  primaryNations: string[]; // Nation IDs directly involved
  affectedRegions?: string[]; // Geographic regions affected
  globalImpact: boolean; // Affects all nations

  // Historical authenticity
  historicalSource?: string; // Primary source quote
  sourceAttribution?: string; // Who said/wrote it

  // Effects
  effects: {
    nationId?: string;
    statChanges?: Partial<NationStats>;
    specialEffect?: string;
  }[];

  // Categorization
  category: 'WAR' | 'REVOLUTION' | 'DIPLOMACY' | 'DISASTER' | 'DISCOVERY' | 'CULTURAL' | 'ECONOMIC' | 'POLITICAL';
  importance: 'MINOR' | 'MAJOR' | 'CRITICAL'; // How significant historically

  // For player interaction
  playerChoices?: {
    text: string;
    effects: Partial<NationStats>;
    narrative: string;
  }[];
}

// Major historical events from 1750-2000
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // Seven Years' War (1756-1763)
  {
    id: 'seven_years_war_start',
    year: 1756,
    title: "The Seven Years' War Begins",
    description: "A global conflict erupts between major European powers.",
    detailedNarrative: "What would later be called the first 'world war' has begun. Prussia, allied with Britain, faces a coalition of Austria, France, Russia, and others. Fighting will span from Europe to the Americas to India.",
    primaryNations: ['britain', 'france', 'prussia', 'russia', 'austria'],
    globalImpact: true,
    historicalSource: "I am the first servant of the state.",
    sourceAttribution: "Frederick the Great",
    effects: [
      { nationId: 'prussia', statChanges: { military: 1 } },
      { nationId: 'britain', statChanges: { economy: -1 } },
      { nationId: 'france', statChanges: { economy: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'seven_years_war_end',
    year: 1763,
    title: "Treaty of Paris Ends Seven Years' War",
    description: "Britain emerges as the dominant colonial power.",
    detailedNarrative: "The Treaty of Paris concludes the Seven Years' War. Britain gains Canada and Florida, becoming the supreme colonial power. France loses most of its North American territories. The war's debts will have lasting consequences.",
    primaryNations: ['britain', 'france', 'spain'],
    globalImpact: true,
    historicalSource: "Canada is a few acres of snow.",
    sourceAttribution: "Voltaire",
    effects: [
      { nationId: 'britain', statChanges: { prestige: 1, economy: -1 } },
      { nationId: 'france', statChanges: { prestige: -1 } }
    ],
    category: 'DIPLOMACY',
    importance: 'CRITICAL'
  },

  // American Revolution
  {
    id: 'american_revolution_start',
    year: 1775,
    title: "American Revolution Begins",
    description: "Colonists in British America take up arms for independence.",
    detailedNarrative: "At Lexington and Concord, shots are fired that will echo around the world. The American colonies have risen in open rebellion against the British Crown, demanding liberty and self-governance.",
    primaryNations: ['britain'],
    affectedRegions: ['North America'],
    globalImpact: true,
    historicalSource: "Give me liberty, or give me death!",
    sourceAttribution: "Patrick Henry",
    effects: [
      { nationId: 'britain', statChanges: { stability: -1, military: -1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },
  {
    id: 'american_independence',
    year: 1776,
    title: "Declaration of Independence",
    description: "The American colonies declare independence from Britain.",
    detailedNarrative: "In Philadelphia, the Continental Congress adopts the Declaration of Independence, proclaiming that all men are created equal and endowed with unalienable rights. A new nation is born in revolution.",
    primaryNations: ['britain'],
    globalImpact: true,
    historicalSource: "We hold these truths to be self-evident, that all men are created equal.",
    sourceAttribution: "Declaration of Independence",
    effects: [
      { nationId: 'britain', statChanges: { prestige: -1 } },
      { nationId: 'france', statChanges: { prestige: 1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },
  {
    id: 'american_revolution_end',
    year: 1783,
    title: "Treaty of Paris - American Independence",
    description: "Britain recognizes American independence.",
    detailedNarrative: "The Treaty of Paris formally ends the American Revolutionary War. Britain recognizes the independence of the United States of America. The revolutionary ideals of liberty will inspire movements worldwide.",
    primaryNations: ['britain', 'france'],
    globalImpact: true,
    effects: [
      { nationId: 'britain', statChanges: { prestige: -1, economy: -1 } },
      { nationId: 'france', statChanges: { economy: -1 } }
    ],
    category: 'DIPLOMACY',
    importance: 'CRITICAL'
  },

  // French Revolution
  {
    id: 'french_revolution_start',
    year: 1789,
    title: "French Revolution Begins",
    description: "The people of France rise against the monarchy.",
    detailedNarrative: "The Bastille has fallen! The people of Paris have stormed this symbol of royal tyranny. Across France, the old order crumbles as revolutionary fervor spreads. The cry of 'Liberté, Égalité, Fraternité' echoes through the streets.",
    primaryNations: ['france'],
    globalImpact: true,
    historicalSource: "Is it a revolt? No, sire, it is a revolution.",
    sourceAttribution: "Duc de La Rochefoucauld-Liancourt to Louis XVI",
    effects: [
      { nationId: 'france', statChanges: { stability: -2, innovation: 1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },
  {
    id: 'louis_xvi_execution',
    year: 1793,
    title: "Execution of Louis XVI",
    description: "The French King is executed by guillotine.",
    detailedNarrative: "Louis XVI, King of France, has been executed by guillotine in Paris. The revolutionary government has sent shockwaves through every throne room in Europe. The old world trembles.",
    primaryNations: ['france'],
    globalImpact: true,
    historicalSource: "I die innocent of all the crimes laid to my charge.",
    sourceAttribution: "Louis XVI's final words",
    effects: [
      { nationId: 'france', statChanges: { stability: -1, prestige: -1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },
  {
    id: 'reign_of_terror',
    year: 1793,
    title: "The Reign of Terror",
    description: "Revolutionary tribunals execute thousands.",
    detailedNarrative: "The Committee of Public Safety, led by Robespierre, has instituted a Reign of Terror. The guillotine claims thousands of lives as the revolution devours its own children.",
    primaryNations: ['france'],
    globalImpact: false,
    historicalSource: "Terror is nothing other than justice, prompt, severe, inflexible.",
    sourceAttribution: "Maximilien Robespierre",
    effects: [
      { nationId: 'france', statChanges: { stability: -2 } }
    ],
    category: 'POLITICAL',
    importance: 'MAJOR'
  },

  // Napoleonic Era
  {
    id: 'napoleon_coup',
    year: 1799,
    title: "Napoleon's Coup d'État",
    description: "Napoleon Bonaparte seizes power in France.",
    detailedNarrative: "General Napoleon Bonaparte has overthrown the Directory in a coup d'état. The Revolution's child now rules France as First Consul. A new era begins.",
    primaryNations: ['france'],
    globalImpact: true,
    historicalSource: "I am the Revolution.",
    sourceAttribution: "Napoleon Bonaparte",
    effects: [
      { nationId: 'france', statChanges: { stability: 1, military: 1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },
  {
    id: 'napoleon_emperor',
    year: 1804,
    title: "Napoleon Crowned Emperor",
    description: "Napoleon Bonaparte becomes Emperor of the French.",
    detailedNarrative: "In Notre-Dame Cathedral, Napoleon has crowned himself Emperor of the French, taking the crown from the Pope's hands. The revolutionary republic has become an empire.",
    primaryNations: ['france'],
    globalImpact: true,
    historicalSource: "I found the crown of France lying in the street, and I picked it up with a sword.",
    sourceAttribution: "Napoleon Bonaparte",
    effects: [
      { nationId: 'france', statChanges: { prestige: 2, military: 1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },
  {
    id: 'trafalgar',
    year: 1805,
    title: "Battle of Trafalgar",
    description: "Britain destroys the French-Spanish fleet.",
    detailedNarrative: "Admiral Nelson has won a crushing victory at Trafalgar, destroying the combined French and Spanish fleet. Britain rules the waves, though Nelson himself has fallen. Napoleon's invasion plans are ruined.",
    primaryNations: ['britain', 'france', 'spain'],
    globalImpact: true,
    historicalSource: "England expects that every man will do his duty.",
    sourceAttribution: "Admiral Horatio Nelson",
    effects: [
      { nationId: 'britain', statChanges: { military: 1, prestige: 1 } },
      { nationId: 'france', statChanges: { military: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'austerlitz',
    year: 1805,
    title: "Battle of Austerlitz",
    description: "Napoleon defeats Russia and Austria decisively.",
    detailedNarrative: "The 'Battle of the Three Emperors' at Austerlitz ends in Napoleon's greatest victory. The Russian and Austrian armies are shattered. Napoleon stands supreme in Europe.",
    primaryNations: ['france', 'russia'],
    globalImpact: true,
    effects: [
      { nationId: 'france', statChanges: { prestige: 1, military: 1 } },
      { nationId: 'russia', statChanges: { prestige: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'napoleon_russia',
    year: 1812,
    title: "Napoleon Invades Russia",
    description: "The Grande Armée marches into Russia.",
    detailedNarrative: "Napoleon's Grande Armée of 600,000 men has crossed into Russia. The largest invasion force in history marches toward Moscow, but the Russians retreat, burning everything behind them.",
    primaryNations: ['france', 'russia'],
    globalImpact: true,
    historicalSource: "From the sublime to the ridiculous is but a step.",
    sourceAttribution: "Napoleon Bonaparte (on the retreat)",
    effects: [
      { nationId: 'france', statChanges: { military: -2 } },
      { nationId: 'russia', statChanges: { economy: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'waterloo',
    year: 1815,
    title: "Battle of Waterloo",
    description: "Napoleon suffers final defeat.",
    detailedNarrative: "At Waterloo in Belgium, Napoleon has met his final defeat. The Duke of Wellington and Prussian forces have ended his Hundred Days. Napoleon will be exiled to St. Helena, and Europe redrawn at Vienna.",
    primaryNations: ['france', 'britain', 'prussia'],
    globalImpact: true,
    historicalSource: "The nearest run thing you ever saw in your life.",
    sourceAttribution: "Duke of Wellington",
    effects: [
      { nationId: 'france', statChanges: { prestige: -2, military: -1 } },
      { nationId: 'britain', statChanges: { prestige: 1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },

  // Industrial Revolution
  {
    id: 'steam_engine',
    year: 1769,
    title: "Watt's Steam Engine",
    description: "James Watt patents the improved steam engine.",
    detailedNarrative: "James Watt has patented his improved steam engine with a separate condenser. This innovation will power the Industrial Revolution, transforming manufacturing, transportation, and society itself.",
    primaryNations: ['britain'],
    globalImpact: true,
    effects: [
      { nationId: 'britain', statChanges: { innovation: 1, economy: 1 } }
    ],
    category: 'DISCOVERY',
    importance: 'CRITICAL'
  },
  {
    id: 'first_railway',
    year: 1825,
    title: "First Public Railway",
    description: "The Stockton and Darlington Railway opens.",
    detailedNarrative: "The world's first public railway using steam locomotives has opened in England. George Stephenson's 'Locomotion No. 1' has inaugurated a transportation revolution that will shrink the world.",
    primaryNations: ['britain'],
    globalImpact: true,
    effects: [
      { nationId: 'britain', statChanges: { economy: 1, innovation: 1 } }
    ],
    category: 'DISCOVERY',
    importance: 'MAJOR'
  },

  // Revolutions of 1848
  {
    id: 'revolutions_1848',
    year: 1848,
    title: "Revolutions of 1848",
    description: "Revolutionary wave sweeps across Europe.",
    detailedNarrative: "The 'Springtime of Nations' has begun. From Paris to Vienna, from Berlin to Budapest, peoples rise demanding constitutional government, national unity, and liberal reforms. Thrones tremble across Europe.",
    primaryNations: ['france', 'prussia', 'russia'],
    globalImpact: true,
    historicalSource: "When France sneezes, Europe catches cold.",
    sourceAttribution: "Attributed to Metternich",
    effects: [
      { nationId: 'france', statChanges: { stability: -1 } },
      { nationId: 'prussia', statChanges: { stability: -1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },

  // Crimean War
  {
    id: 'crimean_war',
    year: 1853,
    title: "Crimean War Begins",
    description: "Britain and France fight Russia in Crimea.",
    detailedNarrative: "Britain, France, and the Ottoman Empire have gone to war against Russia over control of holy sites and Russian expansion. The war will see modern innovations like the telegraph and nursing reforms.",
    primaryNations: ['britain', 'france', 'russia', 'ottoman'],
    globalImpact: true,
    historicalSource: "Someone had blundered.",
    sourceAttribution: "Alfred, Lord Tennyson (on the Charge of the Light Brigade)",
    effects: [
      { nationId: 'russia', statChanges: { military: -1, prestige: -1 } }
    ],
    category: 'WAR',
    importance: 'MAJOR'
  },

  // German Unification
  {
    id: 'german_unification',
    year: 1871,
    title: "German Empire Proclaimed",
    description: "Germany united under Prussian leadership.",
    detailedNarrative: "In the Hall of Mirrors at Versailles, King Wilhelm I of Prussia has been proclaimed German Emperor. Bismarck's policy of 'blood and iron' has unified Germany, fundamentally altering the European balance of power.",
    primaryNations: ['prussia', 'france'],
    globalImpact: true,
    historicalSource: "The great questions of the day will not be settled by speeches and majority decisions but by iron and blood.",
    sourceAttribution: "Otto von Bismarck",
    effects: [
      { nationId: 'prussia', statChanges: { prestige: 2, military: 1 } },
      { nationId: 'france', statChanges: { prestige: -1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },

  // Scramble for Africa
  {
    id: 'berlin_conference',
    year: 1884,
    title: "Berlin Conference",
    description: "European powers partition Africa.",
    detailedNarrative: "At the Berlin Conference, European powers have agreed to rules for the partition of Africa. The continent will be carved up with little regard for existing peoples or boundaries.",
    primaryNations: ['britain', 'france', 'prussia'],
    globalImpact: true,
    effects: [
      { nationId: 'britain', statChanges: { prestige: 1 } },
      { nationId: 'france', statChanges: { prestige: 1 } }
    ],
    category: 'DIPLOMACY',
    importance: 'MAJOR'
  },

  // World War I
  {
    id: 'ww1_start',
    year: 1914,
    title: "The Great War Begins",
    description: "World War I erupts in Europe.",
    detailedNarrative: "The assassination of Archduke Franz Ferdinand has set off a chain reaction. The great powers of Europe mobilize their millions. The lamps are going out all over Europe.",
    primaryNations: ['britain', 'france', 'prussia', 'russia', 'ottoman'],
    globalImpact: true,
    historicalSource: "The lamps are going out all over Europe, we shall not see them lit again in our lifetime.",
    sourceAttribution: "Sir Edward Grey",
    effects: [
      { nationId: 'britain', statChanges: { economy: -1 } },
      { nationId: 'france', statChanges: { economy: -1 } },
      { nationId: 'prussia', statChanges: { economy: -1 } },
      { nationId: 'russia', statChanges: { stability: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'russian_revolution',
    year: 1917,
    title: "Russian Revolution",
    description: "The Tsar is overthrown; Bolsheviks seize power.",
    detailedNarrative: "Revolution has swept Russia. The Tsar has abdicated, and the Bolsheviks under Lenin have seized power, promising 'Peace, Land, and Bread.' The world's first communist state is born.",
    primaryNations: ['russia'],
    globalImpact: true,
    historicalSource: "There are decades where nothing happens; and there are weeks where decades happen.",
    sourceAttribution: "Vladimir Lenin",
    effects: [
      { nationId: 'russia', statChanges: { stability: -2, innovation: 1 } }
    ],
    category: 'REVOLUTION',
    importance: 'CRITICAL'
  },
  {
    id: 'ww1_end',
    year: 1918,
    title: "Armistice Ends World War I",
    description: "The Great War ends after four years of carnage.",
    detailedNarrative: "At the eleventh hour of the eleventh day of the eleventh month, the guns fall silent. The Great War is over. Empires have fallen, millions are dead, and the world will never be the same.",
    primaryNations: ['britain', 'france', 'prussia', 'russia'],
    globalImpact: true,
    effects: [
      { nationId: 'prussia', statChanges: { prestige: -2, economy: -2 } },
      { nationId: 'france', statChanges: { economy: -1 } },
      { nationId: 'britain', statChanges: { economy: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },

  // Interwar Period
  {
    id: 'great_depression',
    year: 1929,
    title: "The Great Depression",
    description: "Global economic collapse begins.",
    detailedNarrative: "The Wall Street Crash has triggered a worldwide economic catastrophe. Banks fail, factories close, unemployment soars. The global economy enters its darkest hour.",
    primaryNations: ['britain', 'france', 'prussia'],
    globalImpact: true,
    effects: [
      { nationId: 'britain', statChanges: { economy: -2 } },
      { nationId: 'france', statChanges: { economy: -2 } },
      { nationId: 'prussia', statChanges: { economy: -2, stability: -1 } }
    ],
    category: 'ECONOMIC',
    importance: 'CRITICAL'
  },

  // World War II
  {
    id: 'ww2_start',
    year: 1939,
    title: "World War II Begins",
    description: "Germany invades Poland; global war erupts.",
    detailedNarrative: "German forces have invaded Poland. Britain and France have declared war. The Second World War has begun, and this time the devastation will be even greater.",
    primaryNations: ['britain', 'france', 'prussia', 'russia'],
    globalImpact: true,
    historicalSource: "I have nothing to offer but blood, toil, tears and sweat.",
    sourceAttribution: "Winston Churchill",
    effects: [
      { nationId: 'prussia', statChanges: { military: 1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'ww2_end',
    year: 1945,
    title: "World War II Ends",
    description: "Allied victory; atomic age begins.",
    detailedNarrative: "Germany and Japan have surrendered. The most destructive war in human history has ended, but at terrible cost. Atomic weapons have been used for the first time. A new world order emerges.",
    primaryNations: ['britain', 'france', 'prussia', 'russia'],
    globalImpact: true,
    historicalSource: "Now I am become Death, the destroyer of worlds.",
    sourceAttribution: "J. Robert Oppenheimer",
    effects: [
      { nationId: 'prussia', statChanges: { prestige: -3, economy: -2 } },
      { nationId: 'russia', statChanges: { prestige: 2 } },
      { nationId: 'britain', statChanges: { economy: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },

  // Cold War
  {
    id: 'cold_war_start',
    year: 1947,
    title: "Cold War Begins",
    description: "Soviet-Western tensions crystallize into confrontation.",
    detailedNarrative: "An 'Iron Curtain' has descended across Europe. The world divides into two hostile blocs led by the United States and Soviet Union. The Cold War has begun.",
    primaryNations: ['russia', 'britain'],
    globalImpact: true,
    historicalSource: "An iron curtain has descended across the Continent.",
    sourceAttribution: "Winston Churchill",
    effects: [
      { nationId: 'russia', statChanges: { military: 1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },
  {
    id: 'sputnik',
    year: 1957,
    title: "Sputnik Launched",
    description: "Soviet Union launches first artificial satellite.",
    detailedNarrative: "The Soviet Union has launched Sputnik 1, the first artificial satellite. The Space Age has begun. The beeping signal from orbit marks a new frontier in human achievement and superpower competition.",
    primaryNations: ['russia'],
    globalImpact: true,
    effects: [
      { nationId: 'russia', statChanges: { prestige: 1, innovation: 1 } }
    ],
    category: 'DISCOVERY',
    importance: 'MAJOR'
  },
  {
    id: 'berlin_wall_fall',
    year: 1989,
    title: "Fall of the Berlin Wall",
    description: "The Berlin Wall is opened; Cold War ends.",
    detailedNarrative: "The Berlin Wall has fallen! After 28 years, East Germans stream through the opened checkpoints. The Cold War is ending, and Europe will be reunited.",
    primaryNations: ['prussia', 'russia'],
    globalImpact: true,
    historicalSource: "Mr. Gorbachev, tear down this wall!",
    sourceAttribution: "Ronald Reagan (1987)",
    effects: [
      { nationId: 'prussia', statChanges: { prestige: 1, stability: 1 } },
      { nationId: 'russia', statChanges: { stability: -1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },
  {
    id: 'soviet_collapse',
    year: 1991,
    title: "Soviet Union Dissolves",
    description: "The USSR ceases to exist.",
    detailedNarrative: "The Soviet Union has officially dissolved. The hammer and sickle is lowered over the Kremlin for the last time. The Cold War is over. Russia and fourteen other republics go their separate ways.",
    primaryNations: ['russia'],
    globalImpact: true,
    effects: [
      { nationId: 'russia', statChanges: { prestige: -2, economy: -2, stability: -1 } }
    ],
    category: 'POLITICAL',
    importance: 'CRITICAL'
  },

  // Asian Events
  {
    id: 'opium_war',
    year: 1839,
    title: "First Opium War",
    description: "Britain and China clash over opium trade.",
    detailedNarrative: "Britain has gone to war with Qing China over the opium trade. Chinese efforts to halt the flow of opium have been met with force. This conflict will reshape China's relationship with the West.",
    primaryNations: ['britain', 'qing'],
    globalImpact: true,
    effects: [
      { nationId: 'qing', statChanges: { prestige: -1, military: -1 } },
      { nationId: 'britain', statChanges: { economy: 1 } }
    ],
    category: 'WAR',
    importance: 'MAJOR'
  },
  {
    id: 'taiping_rebellion',
    year: 1850,
    title: "Taiping Rebellion",
    description: "Massive civil war engulfs China.",
    detailedNarrative: "The Taiping Rebellion has erupted in southern China. Hong Xiuquan leads millions against the Qing dynasty. This may become the deadliest civil war in human history.",
    primaryNations: ['qing'],
    globalImpact: false,
    effects: [
      { nationId: 'qing', statChanges: { stability: -2, economy: -1 } }
    ],
    category: 'WAR',
    importance: 'CRITICAL'
  },
  {
    id: 'meiji_restoration',
    year: 1868,
    title: "Meiji Restoration",
    description: "Japan begins rapid modernization.",
    detailedNarrative: "The Tokugawa shogunate has fallen. Emperor Meiji has been restored to power, and Japan embarks on rapid modernization and industrialization. A new power rises in Asia.",
    primaryNations: [],
    affectedRegions: ['Japan', 'Asia'],
    globalImpact: true,
    effects: [],
    category: 'POLITICAL',
    importance: 'MAJOR'
  },

  // Ottoman/Middle East
  {
    id: 'ottoman_reform',
    year: 1839,
    title: "Tanzimat Reforms Begin",
    description: "Ottoman Empire attempts modernization.",
    detailedNarrative: "The Ottoman Empire has begun the Tanzimat ('Reorganization') reforms, attempting to modernize the state along European lines. The 'Sick Man of Europe' seeks renewal.",
    primaryNations: ['ottoman'],
    globalImpact: false,
    effects: [
      { nationId: 'ottoman', statChanges: { innovation: 1 } }
    ],
    category: 'POLITICAL',
    importance: 'MAJOR'
  },

  // Disasters
  {
    id: 'lisbon_earthquake',
    year: 1755,
    title: "Lisbon Earthquake",
    description: "Massive earthquake destroys Lisbon.",
    detailedNarrative: "A catastrophic earthquake has struck Lisbon, followed by tsunami and fire. The Portuguese capital lies in ruins. Tens of thousands are dead. Philosophers will question God's role in such disasters.",
    primaryNations: ['spain'], // Portugal was part of Iberian concerns
    globalImpact: true,
    effects: [],
    category: 'DISASTER',
    importance: 'MAJOR'
  },
  {
    id: 'irish_famine',
    year: 1845,
    title: "Irish Potato Famine",
    description: "Catastrophic famine strikes Ireland.",
    detailedNarrative: "Potato blight has devastated Ireland's crops. With the population dependent on potatoes, famine spreads rapidly. Millions will die or emigrate in the coming years.",
    primaryNations: ['britain'],
    globalImpact: false,
    effects: [
      { nationId: 'britain', statChanges: { stability: -1 } }
    ],
    category: 'DISASTER',
    importance: 'MAJOR'
  }
];

// Get events for a specific year
export function getEventsForYear(year: number): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event => {
    if (event.endYear) {
      return year >= event.year && year <= event.endYear;
    }
    return event.year === year;
  });
}

// Get events affecting a specific nation
export function getEventsForNation(nationId: string, year: number): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event => {
    if (event.year !== year) return false;
    return event.primaryNations.includes(nationId) || event.globalImpact;
  });
}

// Get upcoming events (for foreshadowing)
export function getUpcomingEvents(currentYear: number, yearsAhead: number = 5): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(event =>
    event.year > currentYear &&
    event.year <= currentYear + yearsAhead &&
    event.importance === 'CRITICAL'
  );
}

// Check if a historical event should trigger
export function shouldTriggerEvent(event: HistoricalEvent, playerNationId: string, year: number): boolean {
  if (event.year !== year) return false;

  // Always trigger critical global events
  if (event.importance === 'CRITICAL' && event.globalImpact) return true;

  // Trigger if player is directly involved
  if (event.primaryNations.includes(playerNationId)) return true;

  return false;
}

// Get historical context quote for year
export function getHistoricalQuote(year: number): { quote: string; attribution: string } | null {
  const event = HISTORICAL_EVENTS.find(e =>
    e.year === year && e.historicalSource && e.sourceAttribution
  );

  if (event) {
    return {
      quote: event.historicalSource!,
      attribution: event.sourceAttribution!
    };
  }

  return null;
}
