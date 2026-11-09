import { Trait } from '../types/game';

export const NEGATIVE_TRAITS: Trait[] = [
  {
    id: 'diabetic',
    name: 'Type 1 Diabetic',
    type: 'negative',
    cost: 6, // Grants +6 points
    description: 'Requires refrigerated insulin. Missing doses causes ketoacidosis and fatal decline.'
  },
  {
    id: 'asthmatic',
    name: 'Asthmatic',
    type: 'negative',
    cost: 4, // Grants +4 points
    description: 'Sprinting or cold damp air triggers wheezing attacks; requires scavenged albuterol.'
  },
  {
    id: 'knee_injury',
    name: 'Old Knee Injury',
    type: 'negative',
    cost: 4, // Grants +4 points
    description: 'Noticeable limp. Reduced sprint speed, pain flares up during cold snaps.'
  },
  {
    id: 'feeble',
    name: 'Feeble / Frail',
    type: 'negative',
    cost: 4, // Grants +4 points
    description: '-30% melee damage, lower maximum carrying capacity.'
  },
  {
    id: 'heavy_sleeper',
    name: 'Heavy Sleeper',
    type: 'negative',
    cost: 3, // Grants +3 points
    description: 'May sleep right through perimeter fence breaches or nocturnal thief intrusions.'
  },
  {
    id: 'weak_stomach',
    name: 'Weak Stomach',
    type: 'negative',
    cost: 3, // Grants +3 points
    description: 'Cannot consume stale food or questionable water without vomiting and dehydration.'
  },
  {
    id: 'agoraphobic',
    name: 'Agoraphobic',
    type: 'negative',
    cost: 3, // Grants +3 points
    description: 'Sanity drops rapidly when standing out in open fields or exposed boulevards.'
  },
  {
    id: 'nearsighted',
    name: 'Nearsighted',
    type: 'negative',
    cost: 2, // Grants +2 points
    description: 'Requires glasses. If knocked off in combat, perception and accuracy plummet.'
  },
  {
    id: 'smoker',
    name: 'Smoker',
    type: 'negative',
    cost: 2, // Grants +2 points
    description: 'Daily sanity decay without tobacco; smoking a cigarette instantly calms stress.'
  },
  {
    id: 'tinnitus',
    name: 'Tinnitus',
    type: 'negative',
    cost: 2, // Grants +2 points
    description: 'Ear ringing reduces audio detection range for stealthy creeping infected.'
  }
];

export const POSITIVE_TRAITS: Trait[] = [
  {
    id: 'natural_immunity',
    name: 'Natural Pathogen Immunity',
    type: 'positive',
    cost: -5,
    description: 'Rare genetic antibody mutation. Immune to minor infection scratches and bacterial sepsis.'
  },
  {
    id: 'iron_metabolism',
    name: 'Iron Metabolism',
    type: 'positive',
    cost: -4,
    description: 'Ultra-efficient caloric burn. Consumes 50% less food daily without starvation penalties.'
  },
  {
    id: 'predator_vision',
    name: 'Predator Night Vision',
    type: 'positive',
    cost: -4,
    description: 'Hyper-sensitive tapetum lucidum. Eliminates all night scavenging penalties and darkness accuracy debuffs.'
  },
  {
    id: 'dynasty_bloodline',
    name: 'Noble Dynasty Bloodline',
    type: 'positive',
    cost: -5,
    description: 'Dominant generational genes. All children born in the haven inherit +2 to all survival attributes.'
  },
  {
    id: 'thick_skinned',
    name: 'Thick Skinned',
    type: 'positive',
    cost: -5, // Costs 5 points
    description: 'Significantly lower probability of scratches or bites puncturing through skin.'
  },
  {
    id: 'sprinter',
    name: 'Sprinter',
    type: 'positive',
    cost: -4, // Costs 4 points
    description: 'Recovers breath twice as fast when fleeing swarms or emergency ambushes.'
  },
  {
    id: 'martial_artist',
    name: 'Martial Artist',
    type: 'positive',
    cost: -4, // Costs 4 points
    description: 'Can counter and shove infected away when grappled, avoiding immediate bite contact.'
  },
  {
    id: 'light_footed',
    name: 'Light Footed',
    type: 'positive',
    cost: -3, // Costs 3 points
    description: 'Generates 50% less footstep noise while looting inside buildings.'
  },
  {
    id: 'eagle_eyed',
    name: 'Eagle Eyed',
    type: 'positive',
    cost: -3, // Costs 3 points
    description: 'Spots lurking infected and hidden floor caches from much farther away.'
  },
  {
    id: 'scavenger_eye',
    name: 'Scavenger\'s Eye',
    type: 'positive',
    cost: -3, // Costs 3 points
    description: 'Higher odds of recovering rare medical tools and intact rations from looted rooms.'
  },
  {
    id: 'handy',
    name: 'Handy / Craftsman',
    type: 'positive',
    cost: -3, // Costs 3 points
    description: 'Barricades and constructed furniture begin with +25% structural durability.'
  },
  {
    id: 'stoic',
    name: 'Stoic Mindset',
    type: 'positive',
    cost: -3, // Costs 3 points
    description: 'High psychological resistance against panic, despair, and witnessing death.'
  }
];
