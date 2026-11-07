import { InventoryItem, Survivor } from '../types/game';

export interface StartingArchetype {
  profession: string;
  bio: string;
  combatSkill: number;
  medicalSkill: number;
  stealthSkill: number;
  craftingSkill: number;
  items: InventoryItem[];
}

export const ARCHETYPES: StartingArchetype[] = [
  {
    profession: 'Former Paramedic',
    bio: 'Spent 6 years responding to 911 calls. Knows how to dress compound fractures, stop arterial bleeds, and handle shock under extreme pressure.',
    combatSkill: 4,
    medicalSkill: 9,
    stealthSkill: 5,
    craftingSkill: 5,
    items: [
      { id: 'first_aid_kit', name: 'Trauma Kit', category: 'medical', quantity: 2, description: 'Sterile gauze, tourniquet, sutures, and povidone-iodine.' },
      { id: 'antibiotics', name: 'Broad-Spectrum Antibiotics (Amoxicillin)', category: 'medical', quantity: 6, description: 'Course of oral antibiotics to fight bacterial sepsis.' },
      { id: 'water_purification', name: 'Water Purification Tablets', category: 'medical', quantity: 12, description: 'Chlorine-based tablets that render contaminated water drinkable.' },
      { id: 'shears', name: 'Trauma Shears', category: 'tool', quantity: 1, description: 'Heavy-duty medical shears that cut through thick denim and seatbelts.' }
    ]
  },
  {
    profession: 'High School Shop Teacher',
    bio: 'Grew up on a rural homestead. Skilled in woodworking, engine maintenance, reinforcing entryways, and fabricating makeshift weapons.',
    combatSkill: 6,
    medicalSkill: 3,
    stealthSkill: 4,
    craftingSkill: 9,
    items: [
      { id: 'claw_hammer', name: 'Forged Steel Claw Hammer', category: 'weapon', quantity: 1, description: 'Reliable blunt weapon and demolition tool.', durability: 95 },
      { id: 'wood_planks', name: 'Reclaimed 2x4 Lumber', category: 'resource', quantity: 8, description: 'Sturdy timber for boarding windows and reinforcing doors.' },
      { id: 'nails_box', name: 'Box of Framing Nails', category: 'resource', quantity: 30, description: 'Essential fasteners for barricades.' },
      { id: 'duct_tape', name: 'Industrial Gorilla Tape', category: 'tool', quantity: 2, description: 'High-strength waterproof repair tape.' }
    ]
  },
  {
    profession: 'Park Ranger / Hunter',
    bio: 'Familiar with wilderness tracking, water sources, quiet movement through brush, and conservation of ammunition.',
    combatSkill: 8,
    medicalSkill: 4,
    stealthSkill: 8,
    craftingSkill: 6,
    items: [
      { id: 'hunting_knife', name: 'Kabar Fixed-Blade Knife', category: 'weapon', quantity: 1, description: 'Carbon steel utility and close-quarters defense knife.', durability: 100 },
      { id: 'canteen', name: 'Military Canteen (Full)', category: 'water', quantity: 3, description: 'Clean, boiled spring water in stainless steel.' },
      { id: 'beef_jerky', name: 'Smoked Deer Jerky', category: 'food', quantity: 5, description: 'Dense, salt-cured protein rations.' },
      { id: 'firestarter', name: 'Ferrocerium Magnesium Rod', category: 'tool', quantity: 1, description: 'Produces 3,000°C sparks regardless of rain or dampness.' }
    ]
  },
  {
    profession: 'Convenience Store Manager',
    bio: 'Was working the night shift when the emergency broadcast activated. Managed to lock the steel roll-up shutters before the mob arrived.',
    combatSkill: 4,
    medicalSkill: 3,
    stealthSkill: 6,
    craftingSkill: 4,
    items: [
      { id: 'canned_food', name: 'Canned Beef Stew & Peaches', category: 'food', quantity: 9, description: 'High-calorie canned food with 5-year shelf life.' },
      { id: 'bottled_water', name: 'Bottled Mineral Water', category: 'water', quantity: 6, description: 'Commercial 1-liter sealed water bottles.' },
      { id: 'baseball_bat', name: 'Aluminum Softball Bat', category: 'weapon', quantity: 1, description: 'Lightweight, quiet, non-lethal blunt force.', durability: 85 },
      { id: 'batteries', name: 'Pack of AA Batteries', category: 'resource', quantity: 8, description: 'Fresh alkaline batteries for flashlights or radios.' }
    ]
  }
];

const FIRST_NAMES = ['Marcus', 'Elena', 'David', 'Sarah', 'Thomas', 'Grace', 'Leon', 'Maya', 'Hannah', 'Julian', 'Claire', 'Robert'];
const LAST_NAMES = ['Vance', 'Chen', 'Miller', 'O\'Connor', 'Kowalski', 'Reyes', 'Blackwood', 'Patel', 'Sterling', 'Diaz'];

export function generateRandomSurvivor(archetypeIndex = 0): { player: Survivor; initialItems: InventoryItem[] } {
  const archetype = ARCHETYPES[archetypeIndex % ARCHETYPES.length];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const age = Math.floor(Math.random() * 26) + 24;

  const player: Survivor = {
    name: `${firstName} ${lastName}`,
    age,
    ageGroup: 'Prime',
    profession: archetype.profession,
    bio: archetype.bio,
    health: 100,
    sanity: 85,
    hunger: 90,
    thirst: 95,
    infectionRisk: 0,
    combatSkill: archetype.combatSkill,
    medicalSkill: archetype.medicalSkill,
    stealthSkill: archetype.stealthSkill,
    craftingSkill: archetype.craftingSkill,
    fitnessSkill: 6,
    traits: [],
    statusEffects: [],
    isDead: false
  };

  // Common baseline rations
  const baselineItems: InventoryItem[] = [
    { id: 'canned_food_std', name: 'Canned Beans', category: 'food', quantity: 3, description: 'Standard canned black beans.' },
    { id: 'water_bottle_std', name: 'Plastic Water Bottle', category: 'water', quantity: 3, description: 'Clean drinking water.' },
    { id: 'sterile_bandage', name: 'Compressed Gauze Bandage', category: 'medical', quantity: 2, description: 'Stops bleeding when applied tightly to open wounds.' },
    { id: 'flashlight', name: 'LED Angle-Head Flashlight', category: 'tool', quantity: 1, description: 'Battery-powered flashlight for nighttime scavenging.' }
  ];

  return {
    player,
    initialItems: [...baselineItems, ...archetype.items]
  };
}
