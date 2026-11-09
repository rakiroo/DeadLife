import { CodexSaveData, CodexUnlockItem, GameState } from '../types/game';

const CODEX_STORAGE_KEY = 'deadlife_codex_data';

export const ALL_CODEX_UNLOCKS: CodexUnlockItem[] = [
  // Careers
  {
    id: 'career_combat_medic',
    type: 'career',
    name: 'Combat Trauma Surgeon',
    description: 'Elite military physician. Starts with field surgical rigs and antibiotics. High Medical & Fitness.',
    cost: 150,
    icon: 'HeartPulse'
  },
  {
    id: 'career_master_blacksmith',
    type: 'career',
    name: 'Master Foundry Blacksmith',
    description: 'Expert metal fabricator. Starts with framing nails and forged steel tools. High Crafting & Combat.',
    cost: 200,
    icon: 'Hammer'
  },
  {
    id: 'career_bounty_hunter',
    type: 'career',
    name: 'Wasteland Bounty Hunter',
    description: 'Deadly lone tracker. Starts with silenced tactical sidearm and duty armor. High Stealth & Combat.',
    cost: 250,
    icon: 'Crosshair'
  },
  {
    id: 'career_hazmat_chemist',
    type: 'career',
    name: 'Hazmat Decontamination Chemist',
    description: 'Specialist in hazardous materials. Starts with respirators, firebombs, and antiseptics.',
    cost: 200,
    icon: 'ShieldAlert'
  },
  {
    id: 'career_wilderness_tracker',
    type: 'career',
    name: 'Deep Forest Guide',
    description: 'Off-grid wilderness survivalist. Starts with hunting spear, dried jerky, and canteen water.',
    cost: 150,
    icon: 'Compass'
  },

  // Genetic Traits
  {
    id: 'trait_natural_immunity',
    type: 'trait',
    name: 'Natural Pathogen Immunity',
    description: 'Rare genetic antibody mutation. Immune to minor zombie infection scratches and bacterial sepsis.',
    cost: 300,
    icon: 'ShieldCheck'
  },
  {
    id: 'trait_iron_metabolism',
    type: 'trait',
    name: 'Iron Metabolism',
    description: 'Ultra-efficient caloric burn. Consumes 50% less food daily without hunger penalties.',
    cost: 250,
    icon: 'Utensils'
  },
  {
    id: 'trait_predator_vision',
    type: 'trait',
    name: 'Predator Night Vision',
    description: 'Hyper-sensitive tapetum lucidum. Eliminates all night scavenging penalties and darkness accuracy debuffs.',
    cost: 200,
    icon: 'Eye'
  },
  {
    id: 'trait_dynasty_bloodline',
    type: 'trait',
    name: 'Noble Dynasty Bloodline',
    description: 'Dominant generational genes. All children born in the colony inherit +2 to all survival attributes.',
    cost: 350,
    icon: 'Crown'
  },

  // Challenge Modifiers
  {
    id: 'mod_nuclear_winter',
    type: 'modifier',
    name: 'Perpetual Nuclear Winter',
    description: 'Sub-zero freezing blizzard permanently blankets the ruins. Stoking woodstoves is non-negotiable.',
    cost: 100,
    icon: 'Snowflake'
  },
  {
    id: 'mod_sole_guardian',
    type: 'modifier',
    name: 'Sole Guardian (Twin Toddlers)',
    description: 'Start with twin 2-year-old toddlers in your care. Protect your children while carving out a haven.',
    cost: 150,
    icon: 'Baby'
  },
  {
    id: 'mod_feral_hordes',
    type: 'modifier',
    name: 'Feral Horde Migrations',
    description: 'Migratory undead swarms assault perimeter walls every 7 days. Barricade defense is critical.',
    cost: 100,
    icon: 'Flame'
  }
];

export function loadCodexData(): CodexSaveData {
  try {
    const raw = localStorage.getItem(CODEX_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load codex data', e);
  }

  // Default initial meta-progression
  return {
    legacyMarks: 50, // Starting gift marks
    totalRunsPlayed: 0,
    totalDaysSurvived: 0,
    totalZombiesKilled: 0,
    unlockedIds: [],
    completedMysteryIds: []
  };
}

export function saveCodexData(data: CodexSaveData): void {
  try {
    localStorage.setItem(CODEX_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save codex data', e);
  }
}

export function calculateRunLegacyMarks(state: GameState): number {
  let marks = 0;
  // 1 mark per 2 days survived
  marks += Math.floor(state.day / 2);
  // 1 mark per 2 zombies eliminated
  marks += Math.floor(state.stats.zombiesEliminated / 2);
  // 10 marks per person saved
  marks += state.stats.peopleSaved * 10;
  // 15 marks per child raised
  marks += (state.stats.childrenRaised || 0) * 15;
  // 10 marks per generation reached
  marks += ((state.player.generation || 1) - 1) * 20;
  // 50 marks if mystery was solved!
  if (state.mystery?.isSolved) {
    marks += 50;
  }
  return Math.max(10, marks);
}

