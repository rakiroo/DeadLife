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
  evacStory: string;
}

export const SANDBOX_AMBITIONS: SandboxAmbition[] = [
  {
    id: 'coastal_evac',
    title: 'The Coastal River Barge',
    icon: '⚓',
    tagline: 'River Escape to Offshore Haven',
    description: 'Scavenge enough fuel and nautical route intel to guide an abandoned motorized river barge downstream to an offshore island lighthouse commune.',
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
    evacStory: 'At midnight, I fired up the barge diesel engine and cut the mooring cables. As the dark river swept me away from the burning city skyline, the lights of the offshore lighthouse welcomed me home.'
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
    evacStory: 'With the truck accelerator floored, the heavy steel grill obliterated the chain-link gates and shipping containers of the quarantine barricade. The open northern highway stretched into green pine country.'
  },
  {
    id: 'citadel_century',
    title: 'The Self-Sustaining Citadel',
    icon: '🏰',
    tagline: 'Centennial Survival Mastery',
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
    evacStory: 'Day 50 arrived in triumphant silence. Behind our reinforced perimeter walls, clean rainwater fills the barrels and crops grow in rooftop planters. We have built a new world from the ashes of the old.'
  }
];
