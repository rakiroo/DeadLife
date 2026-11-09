import { GameState } from '../types/game';

export interface SandboxAmbition {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  requirements: string[];
  isComplete: (state: GameState) => boolean;
  rewardRibbon: string;
  biographySnippet: string;
  milestoneBonus: { morale: number; sanity: number; marks: number };
}

export const SANDBOX_AMBITIONS: SandboxAmbition[] = [
  {
    id: 'coastal_evac',
    title: 'The Coastal River Barge',
    icon: '⚓',
    tagline: 'River Escape to Offshore Haven',
    description: 'Scavenge enough fuel, food, and nautical route intel to guide an abandoned motorized river barge downstream to an offshore island lighthouse commune.',
    requirements: [
      'Scavenge 3+ Cans of Food in supplies',
      'Scavenge 3+ Bottles of Water in supplies',
      'Survive at least 15 Days'
    ],
    isComplete: (s: GameState) => {
      const foodCount = s.inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
      const waterCount = s.inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);
      return s.day >= 15 && foodCount >= 3 && waterCount >= 3;
    },
    rewardRibbon: 'River Navigator',
    biographySnippet: 'They successfully restored an abandoned diesel river barge on the waterfront, opening a viable escape route to offshore sanctuaries.',
    milestoneBonus: { morale: 20, sanity: 20, marks: 30 }
  },
  {
    id: 'highway_breakout',
    title: 'The Highway Rig Breakthrough',
    icon: '🚚',
    tagline: 'Break Through Quarantine Roadblock',
    description: 'Reinforce a heavy diesel truck and amass enough weaponry and supplies to blast through the military quarantine concrete roadblock on the northern bypass.',
    requirements: [
      'Have at least 1 Melee/Firearm weapon in inventory',
      'Have at least 20+ total supply items collected',
      'Survive at least 25 Days'
    ],
    isComplete: (s: GameState) => {
      const hasWeapon = s.inventory.some(i => i.category === 'weapon');
      const totalItems = s.inventory.reduce((sum, i) => sum + i.quantity, 0);
      return s.day >= 25 && hasWeapon && totalItems >= 20;
    },
    rewardRibbon: 'Roadblock Smasher',
    biographySnippet: 'They armored a heavy transport rig and blasted through the concrete military roadblock along the northern interstate, breaking the city quarantine.',
    milestoneBonus: { morale: 25, sanity: 20, marks: 35 }
  },
  {
    id: 'citadel_century',
    title: 'The Self-Sustaining Citadel',
    icon: '🏰',
    tagline: 'Fortified Settlement Mastery',
    description: 'Refuse all escapes. Establish a permanent sanctuary with 100% barricades and companions, surviving through Day 50 to prove humanity will never die.',
    requirements: [
      'Have an established Base Shelter',
      'Barricades fortified to 80%+',
      'Have at least 1 companion ally in camp',
      'Survive at least 50 Days'
    ],
    isComplete: (s: GameState) => {
      return s.shelter.isEstablished && s.shelter.barricadeIntegrity >= 80 && s.campMembers.length >= 1 && s.day >= 50;
    },
    rewardRibbon: 'Citadel Sovereign',
    biographySnippet: 'They constructed an unyielding, self-sustaining fortress that stood defiant against the wasteland through fifty days of relentless siege.',
    milestoneBonus: { morale: 30, sanity: 25, marks: 40 }
  },
  {
    id: 'great_harvest',
    title: 'The Great Breadbasket',
    icon: '🌾',
    tagline: 'Complete Agricultural Security',
    description: 'Conquer famine forever by establishing automated food and water infrastructure within your haven.',
    requirements: [
      'Have an established Base Shelter',
      'Build a Rooftop Greenhouse or Chicken Coop',
      'Stockpile at least 15+ Food Rations',
      'Stockpile at least 12+ Clean Water'
    ],
    isComplete: (s: GameState) => {
      const foodCount = s.inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
      const waterCount = s.inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);
      const hasFarming = (s.shelter.greenhouseLevel || 0) > 0 || Boolean(s.shelter.hasChickenCoop);
      return s.shelter.isEstablished && hasFarming && foodCount >= 15 && waterCount >= 12;
    },
    rewardRibbon: 'Master Harvester',
    biographySnippet: 'Through tireless cultivation and pure aquifer wells, they eliminated famine from their haven, amassing vast storehouses of harvest crops.',
    milestoneBonus: { morale: 25, sanity: 20, marks: 30 }
  },
  {
    id: 'radio_rescue',
    title: 'The Radio SOS Relay',
    icon: '📻',
    tagline: 'Broadcast to Regional Enclaves',
    description: 'Establish high-frequency long-range radio contact across the wasteland, linking your haven with other survivor networks.',
    requirements: [
      'Have at least 3+ companion survivors in camp',
      'Perform rooftop or radio activities',
      'Survive at least 30 Days'
    ],
    isComplete: (s: GameState) => {
      return s.campMembers.length >= 3 && s.day >= 30;
    },
    rewardRibbon: 'Beacon of Hope',
    biographySnippet: 'They restored long-range communications over the ruins, broadcasting emergency coordinates that linked isolated survivor enclaves across the state.',
    milestoneBonus: { morale: 25, sanity: 25, marks: 35 }
  },
  {
    id: 'dynasty_dawn',
    title: 'Dynasty of the Dawn',
    icon: '👑',
    tagline: 'Multi-Generational Legacy',
    description: 'Raise the next generation within the sanctuary and formalize your succession wishes to ensure your bloodline outlives the apocalypse.',
    requirements: [
      'Be married or have a partner',
      'Have at least 1 child or heir',
      'Draft a Founder\'s Will & Testament'
    ],
    isComplete: (s: GameState) => {
      const hasPartner = s.player.romanceStage === 'married' || s.player.romanceStage === 'dating';
      const hasKids = (s.player.children && s.player.children.length > 0) || (s.player.generation || 1) >= 2;
      const hasWill = Boolean(s.player.will);
      return hasPartner && hasKids && hasWill;
    },
    rewardRibbon: 'Dynasty Founder',
    biographySnippet: 'They carried the human torch across generations, establishing a thriving family bloodline and leaving a sealed testament to guide their heirs.',
    milestoneBonus: { morale: 30, sanity: 30, marks: 45 }
  }
];

