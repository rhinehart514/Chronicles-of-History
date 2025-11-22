// Weather and seasonal effects system

import { NationStats } from '../types';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Weather = 'clear' | 'rain' | 'storm' | 'drought' | 'snow' | 'fog';

export interface SeasonEffect {
  name: string;
  icon: string;
  statModifiers: Partial<NationStats>;
  militaryModifiers: {
    attrition: number;
    speed: number;
    morale: number;
  };
  economyModifiers: {
    food: number;
    trade: number;
    construction: number;
  };
}

export interface WeatherEvent {
  weather: Weather;
  severity: 'mild' | 'moderate' | 'severe';
  duration: number;
  effects: Partial<NationStats>;
  special: string[];
}

// Season definitions
export const SEASONS: Record<Season, SeasonEffect> = {
  spring: {
    name: 'Spring',
    icon: '🌸',
    statModifiers: { stability: 0.1 },
    militaryModifiers: { attrition: 0, speed: 1, morale: 5 },
    economyModifiers: { food: 10, trade: 5, construction: 10 }
  },
  summer: {
    name: 'Summer',
    icon: '☀️',
    statModifiers: { economy: 0.1 },
    militaryModifiers: { attrition: 5, speed: 1, morale: 0 },
    economyModifiers: { food: 20, trade: 10, construction: 15 }
  },
  autumn: {
    name: 'Autumn',
    icon: '🍂',
    statModifiers: {},
    militaryModifiers: { attrition: 0, speed: 0.9, morale: 0 },
    economyModifiers: { food: 15, trade: 5, construction: 5 }
  },
  winter: {
    name: 'Winter',
    icon: '❄️',
    statModifiers: { stability: -0.1 },
    militaryModifiers: { attrition: 15, speed: 0.7, morale: -10 },
    economyModifiers: { food: -10, trade: -10, construction: -20 }
  }
};

// Weather effects
export const WEATHER_EFFECTS: Record<Weather, {
  name: string;
  icon: string;
  description: string;
}> = {
  clear: {
    name: 'Clear Skies',
    icon: '☀️',
    description: 'Perfect conditions'
  },
  rain: {
    name: 'Rain',
    icon: '🌧️',
    description: 'Movement slowed, rivers flooding'
  },
  storm: {
    name: 'Storm',
    icon: '⛈️',
    description: 'Severe conditions, dangers abound'
  },
  drought: {
    name: 'Drought',
    icon: '🏜️',
    description: 'Crops failing, water scarce'
  },
  snow: {
    name: 'Snow',
    icon: '🌨️',
    description: 'Heavy snowfall, roads blocked'
  },
  fog: {
    name: 'Fog',
    icon: '🌫️',
    description: 'Visibility reduced'
  }
};

// Get current season from turn number
export function getCurrentSeason(turn: number): Season {
  const seasonIndex = turn % 4;
  const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
  return seasons[seasonIndex];
}

// Generate random weather event
export function generateWeatherEvent(season: Season): WeatherEvent | null {
  // Base chance of weather event
  const eventChance = 0.3;
  if (Math.random() > eventChance) return null;

  // Weather probabilities by season
  const weatherProbs: Record<Season, Partial<Record<Weather, number>>> = {
    spring: { rain: 0.4, storm: 0.1, fog: 0.2 },
    summer: { drought: 0.3, storm: 0.2 },
    autumn: { rain: 0.3, storm: 0.2, fog: 0.3 },
    winter: { snow: 0.5, storm: 0.2 }
  };

  const probs = weatherProbs[season];
  let roll = Math.random();

  for (const [weather, prob] of Object.entries(probs)) {
    if (roll < prob) {
      return createWeatherEvent(weather as Weather, season);
    }
    roll -= prob;
  }

  return null;
}

// Create weather event with effects
function createWeatherEvent(weather: Weather, season: Season): WeatherEvent {
  const severityRoll = Math.random();
  const severity: 'mild' | 'moderate' | 'severe' =
    severityRoll < 0.5 ? 'mild' : severityRoll < 0.85 ? 'moderate' : 'severe';

  const severityMultiplier = { mild: 0.5, moderate: 1, severe: 1.5 };
  const mult = severityMultiplier[severity];

  let effects: Partial<NationStats> = {};
  let special: string[] = [];
  let duration = 1;

  switch (weather) {
    case 'rain':
      effects = { economy: -0.1 * mult };
      special = ['-Movement speed', '-10% Construction'];
      duration = Math.ceil(2 * mult);
      break;

    case 'storm':
      effects = { stability: -0.2 * mult, economy: -0.2 * mult };
      special = ['-30% Movement', 'Ship damage', 'Building damage'];
      duration = Math.ceil(1 * mult);
      break;

    case 'drought':
      effects = { stability: -0.3 * mult };
      special = ['-50% Food production', '+Famine risk', '+Fire risk'];
      duration = Math.ceil(3 * mult);
      break;

    case 'snow':
      effects = { economy: -0.2 * mult };
      special = ['-40% Movement', '+Attrition', 'Roads blocked'];
      duration = Math.ceil(2 * mult);
      break;

    case 'fog':
      effects = {};
      special = ['-Naval combat', '-Reconnaissance', '+Surprise attacks'];
      duration = Math.ceil(1 * mult);
      break;
  }

  return { weather, severity, duration, effects, special };
}

// Calculate total seasonal effects
export function getSeasonalEffects(season: Season): {
  stats: Partial<NationStats>;
  military: { attrition: number; speed: number; morale: number };
  economy: { food: number; trade: number; construction: number };
} {
  const effect = SEASONS[season];
  return {
    stats: effect.statModifiers,
    military: effect.militaryModifiers,
    economy: effect.economyModifiers
  };
}

// Apply weather effects to stats
export function applyWeatherEffects(
  baseStats: NationStats,
  weather: WeatherEvent | null
): NationStats {
  if (!weather) return baseStats;

  const modified = { ...baseStats };
  for (const [stat, value] of Object.entries(weather.effects)) {
    const key = stat as keyof NationStats;
    modified[key] = Math.max(0, modified[key] + value);
  }

  return modified;
}

// Get appropriate ambient sounds for season/weather
export function getAmbientSounds(
  season: Season,
  weather?: Weather
): string[] {
  const sounds: string[] = [];

  // Season ambients
  switch (season) {
    case 'spring':
      sounds.push('birds', 'stream');
      break;
    case 'summer':
      sounds.push('insects', 'wind');
      break;
    case 'autumn':
      sounds.push('wind', 'leaves');
      break;
    case 'winter':
      sounds.push('wind', 'silence');
      break;
  }

  // Weather ambients
  if (weather) {
    switch (weather) {
      case 'rain':
        sounds.push('rain');
        break;
      case 'storm':
        sounds.push('thunder', 'heavy_rain');
        break;
      case 'snow':
        sounds.push('snow_wind');
        break;
    }
  }

  return sounds;
}

// Historical weather patterns
export function getHistoricalEvent(year: number): WeatherEvent | null {
  // Famous historical weather events
  const events: Record<number, Partial<WeatherEvent>> = {
    1788: { weather: 'drought', severity: 'severe' }, // Pre-revolution France
    1816: { weather: 'snow', severity: 'severe' }, // Year without summer
    1845: { weather: 'rain', severity: 'severe' }, // Irish potato blight
  };

  if (events[year]) {
    return createWeatherEvent(events[year].weather!, getCurrentSeason(0));
  }

  return null;
}

export default {
  SEASONS,
  WEATHER_EFFECTS,
  getCurrentSeason,
  generateWeatherEvent,
  getSeasonalEffects,
  applyWeatherEffects,
  getAmbientSounds,
  getHistoricalEvent
};
