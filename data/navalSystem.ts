// Naval mechanics and fleet system

export interface Ship {
  id: string;
  name: string;
  type: ShipType;
  icon: string;
  hull: number;
  cannons: number;
  sailors: number;
  cost: number;
  buildTime: number;
  maintenance: number;
  speed: number;
  abilities: ShipAbility[];
}

export type ShipType = 'heavy' | 'light' | 'galley' | 'transport';

export interface ShipAbility {
  id: string;
  name: string;
  effect: ShipEffect;
}

export interface ShipEffect {
  type: string;
  value: number;
}

export interface Fleet {
  id: string;
  name: string;
  ships: FleetShip[];
  location: string;
  mission?: NavalMission;
  admiral?: Admiral;
}

export interface FleetShip {
  shipId: string;
  morale: number;
  strength: number;
}

export interface Admiral {
  id: string;
  name: string;
  fire: number;
  shock: number;
  maneuver: number;
  siege: number;
  traits: string[];
}

export interface NavalMission {
  type: MissionType;
  target?: string;
  duration?: number;
}

export type MissionType =
  | 'patrol'
  | 'privateer'
  | 'protect_trade'
  | 'hunt_pirates'
  | 'blockade'
  | 'explore'
  | 'transport';

export interface NavalBattle {
  id: string;
  location: string;
  date: string;
  attackerFleets: string[];
  defenderFleets: string[];
  attackerLosses: number;
  defenderLosses: number;
  winner: 'attacker' | 'defender';
}

// Ship types
export const SHIP_TYPES: Ship[] = [
  {
    id: 'carrack',
    name: 'Carrack',
    type: 'heavy',
    icon: '🚢',
    hull: 40,
    cannons: 30,
    sailors: 200,
    cost: 50,
    buildTime: 24,
    maintenance: 1.0,
    speed: 4,
    abilities: []
  },
  {
    id: 'galleon',
    name: 'Galleon',
    type: 'heavy',
    icon: '⛵',
    hull: 50,
    cannons: 40,
    sailors: 300,
    cost: 80,
    buildTime: 30,
    maintenance: 1.5,
    speed: 5,
    abilities: [
      { id: 'broadside', name: 'Broadside', effect: { type: 'naval_damage', value: 20 } }
    ]
  },
  {
    id: 'ship_of_line',
    name: 'Ship of the Line',
    type: 'heavy',
    icon: '🛳️',
    hull: 80,
    cannons: 80,
    sailors: 500,
    cost: 150,
    buildTime: 48,
    maintenance: 3.0,
    speed: 4,
    abilities: [
      { id: 'broadside', name: 'Heavy Broadside', effect: { type: 'naval_damage', value: 35 } },
      { id: 'flagship', name: 'Flagship', effect: { type: 'fleet_morale', value: 10 } }
    ]
  },
  {
    id: 'barque',
    name: 'Barque',
    type: 'light',
    icon: '⛵',
    hull: 15,
    cannons: 10,
    sailors: 50,
    cost: 20,
    buildTime: 12,
    maintenance: 0.3,
    speed: 8,
    abilities: [
      { id: 'scout', name: 'Scout', effect: { type: 'engagement_width', value: 15 } }
    ]
  },
  {
    id: 'frigate',
    name: 'Frigate',
    type: 'light',
    icon: '🚤',
    hull: 25,
    cannons: 20,
    sailors: 100,
    cost: 30,
    buildTime: 18,
    maintenance: 0.5,
    speed: 9,
    abilities: [
      { id: 'pursuit', name: 'Pursuit', effect: { type: 'pursuit_speed', value: 25 } }
    ]
  },
  {
    id: 'galley',
    name: 'Galley',
    type: 'galley',
    icon: '🛶',
    hull: 20,
    cannons: 5,
    sailors: 150,
    cost: 15,
    buildTime: 12,
    maintenance: 0.4,
    speed: 6,
    abilities: [
      { id: 'ram', name: 'Ram', effect: { type: 'galley_combat', value: 100 } }
    ]
  },
  {
    id: 'cog',
    name: 'Cog',
    type: 'transport',
    icon: '🚢',
    hull: 10,
    cannons: 0,
    sailors: 30,
    cost: 12,
    buildTime: 8,
    maintenance: 0.2,
    speed: 5,
    abilities: [
      { id: 'transport', name: 'Transport', effect: { type: 'transport_capacity', value: 1000 } }
    ]
  },
  {
    id: 'flute',
    name: 'Flute',
    type: 'transport',
    icon: '🚢',
    hull: 15,
    cannons: 5,
    sailors: 50,
    cost: 20,
    buildTime: 12,
    maintenance: 0.3,
    speed: 6,
    abilities: [
      { id: 'transport', name: 'Heavy Transport', effect: { type: 'transport_capacity', value: 2000 } }
    ]
  }
];

// Naval mission bonuses
export const MISSION_EFFECTS: Record<MissionType, ShipEffect[]> = {
  patrol: [{ type: 'detection', value: 50 }],
  privateer: [{ type: 'trade_power_steal', value: 25 }],
  protect_trade: [{ type: 'trade_power', value: 20 }],
  hunt_pirates: [{ type: 'pirate_hunting', value: 100 }],
  blockade: [{ type: 'blockade_efficiency', value: 100 }],
  explore: [{ type: 'exploration_speed', value: 50 }],
  transport: [{ type: 'transport_speed', value: 25 }]
};

// Get ship by id
export function getShip(id: string): Ship | undefined {
  return SHIP_TYPES.find(s => s.id === id);
}

// Get ships by type
export function getShipsByType(type: ShipType): Ship[] {
  return SHIP_TYPES.filter(s => s.type === type);
}

// Calculate fleet strength
export function calculateFleetStrength(ships: FleetShip[]): number {
  let strength = 0;

  for (const fleetShip of ships) {
    const ship = getShip(fleetShip.shipId);
    if (ship) {
      strength += (ship.hull + ship.cannons) * (fleetShip.strength / 100);
    }
  }

  return Math.round(strength);
}

// Calculate fleet maintenance
export function calculateFleetMaintenance(ships: FleetShip[]): number {
  let maintenance = 0;

  for (const fleetShip of ships) {
    const ship = getShip(fleetShip.shipId);
    if (ship) {
      maintenance += ship.maintenance;
    }
  }

  return maintenance;
}

// Calculate required sailors
export function calculateRequiredSailors(ships: FleetShip[]): number {
  let sailors = 0;

  for (const fleetShip of ships) {
    const ship = getShip(fleetShip.shipId);
    if (ship) {
      sailors += ship.sailors;
    }
  }

  return sailors;
}

// Get fleet composition
export function getFleetComposition(ships: FleetShip[]): Record<ShipType, number> {
  const composition: Record<ShipType, number> = {
    heavy: 0,
    light: 0,
    galley: 0,
    transport: 0
  };

  for (const fleetShip of ships) {
    const ship = getShip(fleetShip.shipId);
    if (ship) {
      composition[ship.type]++;
    }
  }

  return composition;
}

// Check if fleet can perform mission
export function canPerformMission(
  ships: FleetShip[],
  mission: MissionType
): boolean {
  const composition = getFleetComposition(ships);

  switch (mission) {
    case 'privateer':
      return composition.light >= 3;
    case 'blockade':
      return composition.heavy >= 5;
    case 'transport':
      return composition.transport >= 1;
    case 'explore':
      return composition.light >= 1;
    default:
      return true;
  }
}

// Generate admiral
export function generateAdmiral(): Admiral {
  const names = ['Drake', 'Nelson', 'Barbarossa', 'Yi Sun-sin', 'de Ruyter'];
  return {
    id: `adm_${Date.now()}`,
    name: names[Math.floor(Math.random() * names.length)],
    fire: Math.floor(Math.random() * 6),
    shock: Math.floor(Math.random() * 6),
    maneuver: Math.floor(Math.random() * 6),
    siege: 0,
    traits: []
  };
}

// Calculate naval combat power
export function calculateNavalPower(
  ships: FleetShip[],
  admiral?: Admiral
): number {
  let power = calculateFleetStrength(ships);

  if (admiral) {
    power += admiral.fire * 50;
    power += admiral.shock * 50;
    power += admiral.maneuver * 25;
  }

  return power;
}

export default {
  SHIP_TYPES,
  MISSION_EFFECTS,
  getShip,
  getShipsByType,
  calculateFleetStrength,
  calculateFleetMaintenance,
  calculateRequiredSailors,
  getFleetComposition,
  canPerformMission,
  generateAdmiral,
  calculateNavalPower
};
