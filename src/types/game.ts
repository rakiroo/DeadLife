export type StatusEffectType = 
  | 'bleeding' 
  | 'fracture' 
  | 'bacterial_infection' 
  | 'zombie_infection' 
  | 'hypothermia' 
  | 'dysentery' 
  | 'concussion' 
  | 'well_fed' 
  | 'dehydrated' 
  | 'starving';

export interface StatusEffect {
  id: StatusEffectType;
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  description: string;
  daysRemaining?: number;
}

export type TraitType = 'positive' | 'negative';

export interface Trait {
  id: string;
  name: string;
  type: TraitType;
  cost: number;
  description: string;
  iconName?: string;
}

export interface LootSpot {
  id: string;
  name: string;
  description: string;
  searched: boolean;
  loot: InventoryItem[];
}

export interface SpawnStory {
  id: string;
  title: string;
  intro: string;
  fullStory: string;
}

export interface StartingLocation {
  name: string;
  type: string;
  description: string;
  storyTitle?: string;
  storyText?: string;
  lootSpots: LootSpot[];
  hasLeftStartingSpot: boolean;
}

export interface Career {
  id: string;
  title: string;
  icon: string;
  description: string;
  bonusPoints?: number;
  startingLocation: {
    name: string;
    type: string;
    description: string;
    stories?: SpawnStory[];
    lootSpots: {
      id: string;
      name: string;
      description: string;
      loot: InventoryItem[];
    }[];
  };
  stats: {
    combat: number;
    medical: number;
    crafting: number;
    stealth: number;
    fitness: number;
  };
}

export interface SurvivorBackstory {
  id: string;
  theme: 'family' | 'pet' | 'rival' | 'love' | 'guilt';
  title: string;
  targetName: string;
  relation: string;
  hookText: string;
  searchGoal: string;
  targetLocationId: string;
  clueFound?: boolean;
  chapter?: number;
  completedChapters?: number[];
  lastChapterDay?: number;
  status: 'searching' | 'clue_found' | 'resolved';
  outcome?: 'reunited' | 'bitten_survived' | 'deceased' | 'mercy' | 'avenged';
  outcomeSummary?: string;
  journalThoughts: string[];
}

export interface Survivor {
  name: string;
  gender?: 'male' | 'female';
  age: number;
  ageGroup: 'Youth' | 'Prime' | 'Middle-Aged' | 'Senior';
  profession: string;
  bio: string;
  health: number; // 0 - 100
  sanity: number; // 0 - 100
  hunger: number; // 0 - 100
  thirst: number; // 0 - 100
  infectionRisk: number; // 0 - 100
  combatSkill: number; // 1 - 10
  medicalSkill: number; // 1 - 10
  stealthSkill: number; // 1 - 10
  craftingSkill: number; // 1 - 10
  fitnessSkill: number; // 1 - 10
  traits: Trait[];
  statusEffects: StatusEffect[];
  isDead: boolean;
  deathCause?: string;
  backstory?: SurvivorBackstory;
}

export type CampRole = 'guard' | 'scavenger' | 'medic' | 'craftsman' | 'idle' | 'sickbay';

export interface CampMember {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  age: number;
  relation: string;
  bio?: string;
  daysTogether?: number;
  profession: string;
  health: number;
  trust: number;
  combatSkill?: number;
  medicalSkill?: number;
  craftingSkill?: number;
  stealthSkill?: number;
  fitnessSkill?: number;
  role: CampRole;
  isBittenSuspect?: boolean;
  statusEffects: StatusEffect[];
}

export interface BaseShelter {
  isEstablished: boolean; // False until player claims or builds an actual shelter
  name: string;
  type: string;
  defenseRating: number;
  stealthRating: number;
  warmthRating: number;
  waterCollectorLevel: number;
  storedRainwater: number;
  maxRainwater: number;
  barricadeIntegrity: number;
  generatorOperational: boolean;
  fuelGallons: number;
}

export type ItemCategory = 'food' | 'water' | 'medical' | 'weapon' | 'tool' | 'resource';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  description: string;
  effectDescription?: string;
  durability?: number;
}

export interface LogEntry {
  id: string;
  day: number;
  text: string;
  type: 'general' | 'combat' | 'medical' | 'camp' | 'loot' | 'hazard' | 'death' | 'milestone';
  timestamp: string;
}

export interface EventChoice {
  id: string;
  text: string;
  requiresItem?: string;
  requiredSkill?: { skill: 'combat' | 'medical' | 'stealth' | 'crafting' | 'fitness'; minLevel: number };
  consequenceSummary?: string;
  execute: (state: GameState) => { state: GameState; log: string; outcomeTitle: string; outcomeText: string; isFatal?: boolean };
}

export interface EventDilemma {
  id: string;
  title: string;
  category: 'encounter' | 'camp_drama' | 'crisis' | 'discovery' | 'medical' | 'hazard';
  description: string;
  dangerLevel: 'low' | 'medium' | 'high' | 'critical';
  choices: EventChoice[];
}

export type WeatherType = 'clear' | 'heavy_rain' | 'thunderstorm' | 'dense_fog' | 'freezing_cold' | 'heatwave';

export interface CemeteryRecord {
  id: string;
  name: string;
  age: number;
  profession: string;
  daysSurvived: number;
  deathCause: string;
  date: string;
  ribbon: string;
  stats: {
    zombiesEliminated: number;
    scavengeRuns: number;
    peopleSaved: number;
  };
}

export interface GameState {
  day: number; // Starts at 0
  timeOfDay: 'Morning' | 'Noon' | 'Dusk' | 'Night';
  weather: WeatherType;
  temperatureCelsius: number;
  player: Survivor;
  startingLocation: StartingLocation;
  campMembers: CampMember[];
  isCampEstablished?: boolean;
  shelter: BaseShelter;
  inventory: InventoryItem[];
  logs: LogEntry[];
  activeDilemma: EventDilemma | null;
  dilemmaResult: { title: string; text: string; isFatal?: boolean } | null;
  daysWithoutFood: number;
  daysWithoutWater: number;
  stats: {
    zombiesEliminated: number;
    daysSurvived: number;
    scavengeRuns: number;
    peopleSaved: number;
  };
  ribbons: string[];
}
