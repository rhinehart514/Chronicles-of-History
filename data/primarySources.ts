// Primary Source Excerpts - Authentic historical documents for immersion
// Real quotes, letters, speeches, and documents from history

import { Era } from '../types';

export interface PrimarySource {
  id: string;
  type: 'QUOTE' | 'LETTER' | 'SPEECH' | 'TREATY' | 'DECREE' | 'NEWSPAPER' | 'MEMOIR' | 'DIARY';
  year: number;
  text: string;
  author: string;
  context: string;
  nation?: string;
  era: Era;
  category: 'WAR' | 'DIPLOMACY' | 'REFORM' | 'REVOLUTION' | 'ECONOMY' | 'PHILOSOPHY' | 'LEADERSHIP';
}

export const PRIMARY_SOURCES: PrimarySource[] = [
  // Enlightenment Era
  {
    id: 'voltaire_candide',
    type: 'QUOTE',
    year: 1759,
    text: "We must cultivate our garden.",
    author: "Voltaire, Candide",
    context: "The famous conclusion to Voltaire's satirical novel",
    era: 'ENLIGHTENMENT',
    category: 'PHILOSOPHY'
  },
  {
    id: 'rousseau_social',
    type: 'QUOTE',
    year: 1762,
    text: "Man is born free, and everywhere he is in chains.",
    author: "Jean-Jacques Rousseau, The Social Contract",
    context: "Opening of Rousseau's influential political treatise",
    era: 'ENLIGHTENMENT',
    category: 'PHILOSOPHY'
  },
  {
    id: 'frederick_antimachiavel',
    type: 'QUOTE',
    year: 1740,
    text: "A crown is merely a hat that lets the rain in.",
    author: "Frederick the Great",
    context: "On the burdens of monarchy",
    era: 'ENLIGHTENMENT',
    category: 'LEADERSHIP'
  },
  {
    id: 'catherine_enlightened',
    type: 'QUOTE',
    year: 1767,
    text: "I am one of the people who love the why of things.",
    author: "Catherine the Great",
    context: "From her correspondence with Voltaire",
    nation: 'russia',
    era: 'ENLIGHTENMENT',
    category: 'PHILOSOPHY'
  },
  {
    id: 'adam_smith_wealth',
    type: 'QUOTE',
    year: 1776,
    text: "It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.",
    author: "Adam Smith, The Wealth of Nations",
    context: "Foundation of modern economics",
    nation: 'britain',
    era: 'ENLIGHTENMENT',
    category: 'ECONOMY'
  },

  // Revolutionary Era
  {
    id: 'declaration_independence',
    type: 'DECREE',
    year: 1776,
    text: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.",
    author: "Thomas Jefferson, Declaration of Independence",
    context: "American Declaration of Independence",
    era: 'REVOLUTIONARY',
    category: 'REVOLUTION'
  },
  {
    id: 'burke_reflections',
    type: 'QUOTE',
    year: 1790,
    text: "The age of chivalry is gone. That of sophisters, economists, and calculators has succeeded; and the glory of Europe is extinguished forever.",
    author: "Edmund Burke, Reflections on the Revolution in France",
    context: "Conservative critique of the French Revolution",
    nation: 'britain',
    era: 'REVOLUTIONARY',
    category: 'REVOLUTION'
  },
  {
    id: 'robespierre_terror',
    type: 'SPEECH',
    year: 1794,
    text: "Terror is nothing other than justice, prompt, severe, inflexible; it is therefore an emanation of virtue.",
    author: "Maximilien Robespierre",
    context: "Speech to the National Convention",
    nation: 'france',
    era: 'REVOLUTIONARY',
    category: 'REVOLUTION'
  },
  {
    id: 'napoleon_alps',
    type: 'QUOTE',
    year: 1800,
    text: "From the heights of these pyramids, forty centuries look down on us.",
    author: "Napoleon Bonaparte",
    context: "Before the Battle of the Pyramids",
    nation: 'france',
    era: 'REVOLUTIONARY',
    category: 'WAR'
  },
  {
    id: 'pitt_england',
    type: 'SPEECH',
    year: 1805,
    text: "England has saved herself by her exertions, and will, as I trust, save Europe by her example.",
    author: "William Pitt the Younger",
    context: "Speech after the Battle of Trafalgar",
    nation: 'britain',
    era: 'REVOLUTIONARY',
    category: 'WAR'
  },

  // Industrial Era
  {
    id: 'marx_manifesto',
    type: 'QUOTE',
    year: 1848,
    text: "A spectre is haunting Europe — the spectre of communism.",
    author: "Karl Marx and Friedrich Engels, The Communist Manifesto",
    context: "Opening of the revolutionary tract",
    era: 'INDUSTRIAL',
    category: 'REVOLUTION'
  },
  {
    id: 'dickens_times',
    type: 'QUOTE',
    year: 1859,
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    author: "Charles Dickens, A Tale of Two Cities",
    context: "Opening of the novel about the French Revolution",
    nation: 'britain',
    era: 'INDUSTRIAL',
    category: 'PHILOSOPHY'
  },
  {
    id: 'bismarck_iron',
    type: 'SPEECH',
    year: 1862,
    text: "The great questions of the day will not be settled by speeches and majority decisions but by iron and blood.",
    author: "Otto von Bismarck",
    context: "Address to the Prussian House of Deputies",
    nation: 'prussia',
    era: 'INDUSTRIAL',
    category: 'LEADERSHIP'
  },
  {
    id: 'lincoln_gettysburg',
    type: 'SPEECH',
    year: 1863,
    text: "Government of the people, by the people, for the people, shall not perish from the earth.",
    author: "Abraham Lincoln, Gettysburg Address",
    context: "Dedication of the Soldiers' National Cemetery",
    era: 'INDUSTRIAL',
    category: 'LEADERSHIP'
  },
  {
    id: 'victoria_amused',
    type: 'QUOTE',
    year: 1870,
    text: "We are not amused.",
    author: "Queen Victoria",
    context: "Attributed response to a courtier",
    nation: 'britain',
    era: 'INDUSTRIAL',
    category: 'LEADERSHIP'
  },

  // Imperial Era
  {
    id: 'kipling_burden',
    type: 'QUOTE',
    year: 1899,
    text: "Take up the White Man's burden— Send forth the best ye breed— Go bind your sons to exile, To serve your captives' need.",
    author: "Rudyard Kipling, 'The White Man's Burden'",
    context: "Poem advocating imperialism",
    nation: 'britain',
    era: 'IMPERIAL',
    category: 'PHILOSOPHY'
  },
  {
    id: 'wilhelm_place',
    type: 'SPEECH',
    year: 1901,
    text: "Germany must have her place in the sun.",
    author: "Kaiser Wilhelm II",
    context: "Speech on German colonial ambitions",
    nation: 'prussia',
    era: 'IMPERIAL',
    category: 'DIPLOMACY'
  },
  {
    id: 'roosevelt_big_stick',
    type: 'QUOTE',
    year: 1900,
    text: "Speak softly and carry a big stick; you will go far.",
    author: "Theodore Roosevelt",
    context: "Describing American foreign policy",
    era: 'IMPERIAL',
    category: 'DIPLOMACY'
  },

  // Great War Era
  {
    id: 'grey_lamps',
    type: 'QUOTE',
    year: 1914,
    text: "The lamps are going out all over Europe, we shall not see them lit again in our lifetime.",
    author: "Sir Edward Grey, British Foreign Secretary",
    context: "On the eve of World War I",
    nation: 'britain',
    era: 'GREAT_WAR',
    category: 'WAR'
  },
  {
    id: 'wilson_democracy',
    type: 'SPEECH',
    year: 1917,
    text: "The world must be made safe for democracy.",
    author: "Woodrow Wilson",
    context: "Address to Congress requesting declaration of war",
    era: 'GREAT_WAR',
    category: 'WAR'
  },
  {
    id: 'owen_dulce',
    type: 'QUOTE',
    year: 1918,
    text: "The old Lie: Dulce et decorum est Pro patria mori.",
    author: "Wilfred Owen, 'Dulce et Decorum Est'",
    context: "War poem challenging glory of death in battle",
    nation: 'britain',
    era: 'GREAT_WAR',
    category: 'WAR'
  },
  {
    id: 'lenin_decades',
    type: 'QUOTE',
    year: 1917,
    text: "There are decades where nothing happens; and there are weeks where decades happen.",
    author: "Vladimir Lenin",
    context: "On revolutionary change",
    nation: 'russia',
    era: 'GREAT_WAR',
    category: 'REVOLUTION'
  },

  // Interwar Era
  {
    id: 'keynes_consequences',
    type: 'QUOTE',
    year: 1919,
    text: "The Treaty includes no provisions for the economic rehabilitation of Europe.",
    author: "John Maynard Keynes, The Economic Consequences of the Peace",
    context: "Critique of the Treaty of Versailles",
    nation: 'britain',
    era: 'INTERWAR',
    category: 'ECONOMY'
  },
  {
    id: 'hemingway_generation',
    type: 'QUOTE',
    year: 1926,
    text: "You are all a lost generation.",
    author: "Gertrude Stein (epigraph to Hemingway's The Sun Also Rises)",
    context: "Describing post-war disillusionment",
    era: 'INTERWAR',
    category: 'PHILOSOPHY'
  },
  {
    id: 'fdr_fear',
    type: 'SPEECH',
    year: 1933,
    text: "The only thing we have to fear is fear itself.",
    author: "Franklin D. Roosevelt, First Inaugural Address",
    context: "During the Great Depression",
    era: 'INTERWAR',
    category: 'LEADERSHIP'
  },

  // World War II Era
  {
    id: 'churchill_blood',
    type: 'SPEECH',
    year: 1940,
    text: "I have nothing to offer but blood, toil, tears and sweat.",
    author: "Winston Churchill",
    context: "First speech as Prime Minister",
    nation: 'britain',
    era: 'WORLD_WAR',
    category: 'LEADERSHIP'
  },
  {
    id: 'churchill_beaches',
    type: 'SPEECH',
    year: 1940,
    text: "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender.",
    author: "Winston Churchill",
    context: "Speech after Dunkirk evacuation",
    nation: 'britain',
    era: 'WORLD_WAR',
    category: 'WAR'
  },
  {
    id: 'oppenheimer_death',
    type: 'QUOTE',
    year: 1945,
    text: "Now I am become Death, the destroyer of worlds.",
    author: "J. Robert Oppenheimer",
    context: "After the first atomic bomb test",
    era: 'WORLD_WAR',
    category: 'PHILOSOPHY'
  },

  // Cold War Era
  {
    id: 'churchill_curtain',
    type: 'SPEECH',
    year: 1946,
    text: "From Stettin in the Baltic to Trieste in the Adriatic, an iron curtain has descended across the Continent.",
    author: "Winston Churchill, 'Sinews of Peace'",
    context: "Speech at Westminster College",
    nation: 'britain',
    era: 'COLD_WAR',
    category: 'DIPLOMACY'
  },
  {
    id: 'kennedy_ask_not',
    type: 'SPEECH',
    year: 1961,
    text: "Ask not what your country can do for you — ask what you can do for your country.",
    author: "John F. Kennedy, Inaugural Address",
    context: "Presidential inauguration",
    era: 'COLD_WAR',
    category: 'LEADERSHIP'
  },
  {
    id: 'mlk_dream',
    type: 'SPEECH',
    year: 1963,
    text: "I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.",
    author: "Martin Luther King Jr., 'I Have a Dream'",
    context: "March on Washington",
    era: 'COLD_WAR',
    category: 'REFORM'
  },
  {
    id: 'reagan_wall',
    type: 'SPEECH',
    year: 1987,
    text: "Mr. Gorbachev, tear down this wall!",
    author: "Ronald Reagan",
    context: "Speech at the Brandenburg Gate",
    era: 'COLD_WAR',
    category: 'DIPLOMACY'
  },

  // Modern Era
  {
    id: 'mandela_free',
    type: 'SPEECH',
    year: 1990,
    text: "To be free is not merely to cast off one's chains, but to live in a way that respects and enhances the freedom of others.",
    author: "Nelson Mandela",
    context: "After release from prison",
    era: 'MODERN',
    category: 'REFORM'
  }
];

// Get sources for a specific year
export function getSourcesForYear(year: number): PrimarySource[] {
  return PRIMARY_SOURCES.filter(source => source.year === year);
}

// Get sources for a nation
export function getSourcesForNation(nationId: string, year: number): PrimarySource[] {
  return PRIMARY_SOURCES.filter(source =>
    (source.nation === nationId || !source.nation) &&
    Math.abs(source.year - year) <= 10
  );
}

// Get random source for era
export function getRandomSourceForEra(era: Era): PrimarySource | null {
  const eraSources = PRIMARY_SOURCES.filter(source => source.era === era);
  if (eraSources.length === 0) return null;
  return eraSources[Math.floor(Math.random() * eraSources.length)];
}

// Get source by category
export function getSourceByCategory(category: PrimarySource['category'], year: number): PrimarySource | null {
  const matching = PRIMARY_SOURCES.filter(source =>
    source.category === category &&
    Math.abs(source.year - year) <= 20
  );
  if (matching.length === 0) return null;
  return matching[Math.floor(Math.random() * matching.length)];
}

// Format source for display
export function formatSource(source: PrimarySource): string {
  return `"${source.text}"\n— ${source.author} (${source.year})`;
}

// Get contextual quote for game situation
export function getContextualQuote(
  situation: 'WAR_START' | 'WAR_END' | 'REFORM' | 'CRISIS' | 'TRIUMPH' | 'DEFEAT',
  year: number
): PrimarySource | null {
  const categoryMap: Record<string, PrimarySource['category']> = {
    'WAR_START': 'WAR',
    'WAR_END': 'WAR',
    'REFORM': 'REFORM',
    'CRISIS': 'REVOLUTION',
    'TRIUMPH': 'LEADERSHIP',
    'DEFEAT': 'WAR'
  };

  return getSourceByCategory(categoryMap[situation], year);
}
