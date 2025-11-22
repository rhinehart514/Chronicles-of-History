// Event modifier system for dynamic event outcomes

import { Nation, NationStats } from '../types';
import { DifficultyModifiers } from '../data/difficultySettings';

export interface EventModifier {
  id: string;
  name: string;
  description: string;
  type: 'bonus' | 'penalty' | 'neutral';
  statModifiers: Partial<Record<keyof NationStats, number>>;
  probability?: number; // Modifier to event probability
  duration?: number; // Turns the modifier lasts
}

export interface ModifierContext {
  nation: Nation;
  difficulty: DifficultyModifiers;
  year: number;
  recentEvents?: string[];
  warCount?: number;
  allianceCount?: number;
}

// Calculate modifiers based on nation's current state
export function calculateEventModifiers(context: ModifierContext): EventModifier[] {
  const modifiers: EventModifier[] = [];
  const { nation, difficulty, warCount = 0, allianceCount = 0 } = context;

  // High stability bonus
  if (nation.stats.stability >= 4) {
    modifiers.push({
      id: 'stable_nation',
      name: 'Stable Nation',
      description: 'Your stable government handles crises better',
      type: 'bonus',
      statModifiers: { stability: 0.5 },
      probability: 0.9 // Reduces negative event chance
    });
  }

  // Low stability penalty
  if (nation.stats.stability <= 2) {
    modifiers.push({
      id: 'unstable_nation',
      name: 'Civil Unrest',
      description: 'Internal divisions worsen outcomes',
      type: 'penalty',
      statModifiers: { stability: -0.5 },
      probability: 1.2 // Increases negative event chance
    });
  }

  // Economic power bonus
  if (nation.stats.economy >= 4) {
    modifiers.push({
      id: 'wealthy_nation',
      name: 'Economic Power',
      description: 'Wealth provides more options',
      type: 'bonus',
      statModifiers: { economy: 0.3, prestige: 0.2 }
    });
  }

  // Economic crisis penalty
  if (nation.stats.economy <= 2) {
    modifiers.push({
      id: 'economic_crisis',
      name: 'Economic Crisis',
      description: 'Limited funds restrict choices',
      type: 'penalty',
      statModifiers: { economy: -0.3 }
    });
  }

  // Military strength modifier
  if (nation.stats.military >= 4) {
    modifiers.push({
      id: 'military_power',
      name: 'Military Might',
      description: 'Strong military deters aggression',
      type: 'bonus',
      statModifiers: { military: 0.3 },
      probability: 0.8 // Less likely to be attacked
    });
  }

  // Wartime modifiers
  if (warCount > 0) {
    modifiers.push({
      id: 'at_war',
      name: 'Wartime',
      description: 'Resources diverted to war effort',
      type: 'penalty',
      statModifiers: { economy: -0.2, stability: -0.1 }
    });

    if (warCount >= 2) {
      modifiers.push({
        id: 'multi_front_war',
        name: 'Multi-Front War',
        description: 'Fighting on multiple fronts strains resources',
        type: 'penalty',
        statModifiers: { military: -0.3, stability: -0.2 }
      });
    }
  }

  // Alliance bonus
  if (allianceCount >= 2) {
    modifiers.push({
      id: 'allied_strength',
      name: 'Allied Support',
      description: 'Strong alliances provide backing',
      type: 'bonus',
      statModifiers: { prestige: 0.2 },
      probability: 0.85
    });
  }

  // Innovation bonus
  if (nation.stats.innovation >= 4) {
    modifiers.push({
      id: 'innovative_nation',
      name: 'Technological Edge',
      description: 'Innovation provides advantages',
      type: 'bonus',
      statModifiers: { innovation: 0.3, military: 0.1 }
    });
  }

  // High prestige bonus
  if (nation.stats.prestige >= 4) {
    modifiers.push({
      id: 'prestigious_nation',
      name: 'International Renown',
      description: 'Your reputation precedes you',
      type: 'bonus',
      statModifiers: { prestige: 0.2 },
      probability: 0.9
    });
  }

  // Apply difficulty modifiers
  if (difficulty.aiAggression > 1) {
    modifiers.push({
      id: 'aggressive_ai',
      name: 'Hostile World',
      description: 'Other nations are more aggressive',
      type: 'penalty',
      statModifiers: {},
      probability: 1 + (difficulty.aiAggression - 1) * 0.5
    });
  }

  if (difficulty.eventImpact > 1) {
    modifiers.push({
      id: 'harsh_events',
      name: 'Harsh Times',
      description: 'Events have greater impact',
      type: 'penalty',
      statModifiers: {},
      probability: difficulty.eventImpact
    });
  }

  return modifiers;
}

// Apply modifiers to stat changes
export function applyModifiersToStats(
  baseChanges: Partial<NationStats>,
  modifiers: EventModifier[]
): Partial<NationStats> {
  const result = { ...baseChanges };

  for (const modifier of modifiers) {
    for (const [stat, value] of Object.entries(modifier.statModifiers)) {
      const statKey = stat as keyof NationStats;
      if (result[statKey] !== undefined) {
        // Apply modifier as percentage or flat bonus based on sign
        if (value > 0) {
          result[statKey] = (result[statKey] as number) * (1 + value);
        } else {
          result[statKey] = (result[statKey] as number) * (1 + value);
        }
      }
    }
  }

  // Round results
  for (const key of Object.keys(result)) {
    const statKey = key as keyof NationStats;
    if (result[statKey] !== undefined) {
      result[statKey] = Math.round((result[statKey] as number) * 10) / 10;
    }
  }

  return result;
}

// Calculate probability modifier for event occurrence
export function calculateProbabilityModifier(modifiers: EventModifier[]): number {
  let totalModifier = 1;

  for (const modifier of modifiers) {
    if (modifier.probability) {
      totalModifier *= modifier.probability;
    }
  }

  return totalModifier;
}

// Get active modifiers formatted for display
export function getModifierSummary(modifiers: EventModifier[]): string[] {
  return modifiers.map(m => {
    const icon = m.type === 'bonus' ? '✓' : m.type === 'penalty' ? '✗' : '•';
    return `${icon} ${m.name}: ${m.description}`;
  });
}

// Calculate composite modifier strength
export function getModifierStrength(modifiers: EventModifier[]): number {
  let strength = 0;

  for (const modifier of modifiers) {
    const statSum = Object.values(modifier.statModifiers).reduce((a, b) => a + b, 0);
    strength += modifier.type === 'bonus' ? statSum : -Math.abs(statSum);
  }

  return Math.round(strength * 100) / 100;
}

// Era-based modifiers
export function getEraModifiers(year: number): EventModifier[] {
  const modifiers: EventModifier[] = [];

  // Age of Revolution (1789-1848)
  if (year >= 1789 && year <= 1848) {
    modifiers.push({
      id: 'age_of_revolution',
      name: 'Age of Revolution',
      description: 'Revolutionary fervor sweeps the continent',
      type: 'neutral',
      statModifiers: { stability: -0.2 },
      probability: 1.3
    });
  }

  // Industrial Revolution (1760-1840)
  if (year >= 1760 && year <= 1840) {
    modifiers.push({
      id: 'industrial_revolution',
      name: 'Industrial Revolution',
      description: 'Technological change transforms society',
      type: 'neutral',
      statModifiers: { innovation: 0.3, economy: 0.2 }
    });
  }

  // Napoleonic Era (1799-1815)
  if (year >= 1799 && year <= 1815) {
    modifiers.push({
      id: 'napoleonic_era',
      name: 'Napoleonic Wars',
      description: 'Europe engulfed in total war',
      type: 'penalty',
      statModifiers: { military: 0.2 },
      probability: 1.5
    });
  }

  // Victorian Era (1837-1901)
  if (year >= 1837 && year <= 1901) {
    modifiers.push({
      id: 'victorian_era',
      name: 'Victorian Age',
      description: 'An age of expansion and progress',
      type: 'bonus',
      statModifiers: { prestige: 0.2, economy: 0.1 }
    });
  }

  // Great War Era (1910-1918)
  if (year >= 1910 && year <= 1918) {
    modifiers.push({
      id: 'great_war_era',
      name: 'Great War',
      description: 'The war to end all wars',
      type: 'penalty',
      statModifiers: { stability: -0.3, military: 0.2 },
      probability: 2.0
    });
  }

  return modifiers;
}

export default {
  calculateEventModifiers,
  applyModifiersToStats,
  calculateProbabilityModifier,
  getModifierSummary,
  getModifierStrength,
  getEraModifiers
};
