import { EventDilemma, GameState, CampMember, CampRole } from '../types/game';

export function getCurrentLocationName(state: GameState): string {
  if (!state.startingLocation.hasLeftStartingSpot) {
    return state.startingLocation.name;
  }
  if (state.shelter.isEstablished) {
    return state.shelter.name;
  }
  return 'your temporary camp';
}

export const DAY_ONE_EVENT: EventDilemma = {
  id: 'day1_looting_spree',
  title: 'Day 1: The Silence After the Sirens',
  category: 'discovery',
  dangerLevel: 'low',
  description: 'The emergency sirens have abruptly died out. The area is deathly quiet. You have empty pockets and zero supplies on you. Where do you search first?',
  choices: [
    {
      id: 'search_kitchen',
      text: 'Search for food and clean drinking water',
      consequenceSummary: 'Secures vital initial water and canned food.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'canned_beans', name: 'Canned Beans', category: 'food' as const, quantity: 2, description: 'Sealed canned beans.' },
          { id: 'bottled_water', name: 'Bottled Water', category: 'water' as const, quantity: 2, description: 'Fresh drinking water.' },
          { id: 'kitchen_knife', name: 'Kitchen Knife', category: 'weapon' as const, quantity: 1, description: 'Steel knife.', durability: 80 }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems]
          },
          log: 'I searched the area and found 2 cans of beans, 2 bottles of water, and a kitchen knife.',
          outcomeTitle: 'Supplies Secured',
          outcomeText: 'You gathered emergency food and water to stay alive.'
        };
      }
    },
    {
      id: 'search_bathroom',
      text: 'Search for first aid and medicine',
      consequenceSummary: 'Focus on first aid bandages and antiseptic.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'gauze_bandage', name: 'Roll of Sterile Gauze', category: 'medical' as const, quantity: 2, description: 'Sterile cotton bandage to stop bleeding.' },
          { id: 'rubbing_alcohol', name: 'Bottle of Antiseptic Alcohol', category: 'medical' as const, quantity: 1, description: 'Disinfects wounds.' },
          { id: 'bottled_water', name: 'Bottled Water', category: 'water' as const, quantity: 1, description: 'Fresh water.' }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems]
          },
          log: 'I searched for first aid and found sterile gauze, antiseptic, and clean water.',
          outcomeTitle: 'First Aid Stockpiled',
          outcomeText: 'You secured medical supplies to treat cuts and stop bleeding.'
        };
      }
    },
    {
      id: 'search_closet_garage',
      text: 'Search for tools and barricade wood',
      consequenceSummary: 'Secures a hammer, nails, and wood planks.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'claw_hammer', name: 'Steel Claw Hammer', category: 'weapon' as const, quantity: 1, description: 'Sturdy tool and blunt weapon.', durability: 95 },
          { id: 'wood_planks', name: 'Wood Planks', category: 'resource' as const, quantity: 3, description: 'Sturdy timber for boarding windows.' },
          { id: 'duct_tape', name: 'Heavy Duty Tape', category: 'tool' as const, quantity: 1, description: 'Waterproof repair tape.' }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems]
          },
          log: 'I scavenged for tools and found a claw hammer, 3 wood planks, and duct tape.',
          outcomeTitle: 'Tools & Wood Acquired',
          outcomeText: 'You now have materials to board up windows and defend yourself.'
        };
      }
    }
  ]
};

export function getSurvivalEvents(state: GameState): EventDilemma[] {
  const loc = getCurrentLocationName(state);

  const events: EventDilemma[] = [
    {
      id: 'armed_scavengers_standoff',
      title: 'Armed Scavengers Outside ' + loc,
      category: 'encounter',
      dangerLevel: 'high',
      description: 'Two armed men with pump-action shotguns are moving along the street, checking doors and heading straight toward ' + loc + '.',
      choices: [
        {
          id: 'kill_zone_ambush',
          text: 'Ambush them from cover inside ' + loc,
          requiredSkill: { skill: 'combat', minLevel: 5 },
          consequenceSummary: 'High chance to eliminate the raiders and take their weapons.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                inventory: [
                  ...s.inventory,
                  { id: 'remington_shotgun', name: '12-Gauge Shotgun', category: 'weapon', quantity: 1, description: 'Pump-action tactical shotgun with 6 shells.', durability: 90 },
                  { id: 'buckshot_ammo', name: 'Shotgun Shells', category: 'resource', quantity: 8, description: 'Close-range 12-gauge ammunition.' }
                ],
                stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 }
              },
              log: 'From cover inside ' + loc + ', I ambushed both raiders before they could enter and seized their weapons.',
              outcomeTitle: 'Ambush Successful — Weapons Captured',
              outcomeText: 'Your patience paid off. You took down both hostiles before they could shoot and stripped their bodies of a shotgun and shells.'
            };
          }
        },
        {
          id: 'blackout_stealth',
          text: 'Turn off all lights, stay low, and let them pass by',
          requiredSkill: { skill: 'stealth', minLevel: 4 },
          consequenceSummary: 'Avoids fighting completely and saves your ammo.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 5) }
              },
              log: 'I hid quietly behind cover inside ' + loc + ' until the armed men moved down the road.',
              outcomeTitle: 'Passed Undetected',
              outcomeText: 'One of them kicked the outer door of ' + loc + ', paused, muttered that it looked abandoned, and moved away.'
            };
          }
        },
        {
          id: 'verbal_parley',
          text: 'Call out from behind the door and offer to trade supplies',
          consequenceSummary: 'Risky attempt to talk with armed strangers.',
          execute: (s: GameState) => {
            const success = Math.random() < 0.55;
            if (success) {
              return {
                state: {
                  ...s,
                  inventory: [
                    ...s.inventory,
                    { id: 'canned_food_trade', name: 'Military Rations (MRE)', category: 'food', quantity: 4, description: 'Ready-to-eat field meal.' }
                  ]
                },
                log: 'I traded medical supplies through the door of ' + loc + ' for 4 military food rations.',
                outcomeTitle: 'Tense Barter Concluded',
                outcomeText: 'The raiders took the medicine, agreed not to cause trouble, and moved down the street.'
              };
            } else {
              return {
                state: {
                  ...s,
                  shelter: { ...s.shelter, barricadeIntegrity: Math.max(10, s.shelter.barricadeIntegrity - 25) },
                  player: { ...s.player, health: Math.max(20, s.player.health - 20) }
                },
                log: 'The raiders fired a shotgun blast through the door of ' + loc + ' the moment I called out.',
                outcomeTitle: 'Ambushed at the Door',
                outcomeText: 'Buckshot blew through the door frame. You returned fire and drove them away, but took superficial wounds (-20% HP).'
              };
            }
          }
        }
      ]
    },
    {
      id: 'scratched_window',
      title: 'Night Intrusion at ' + loc,
      category: 'crisis',
      dangerLevel: 'high',
      description: 'At 2:40 AM, breaking glass echoes through ' + loc + '. Two zombies smashed through a side window and are crawling inside!',
      choices: [
        {
          id: 'blunt_force',
          text: 'Fight them up close quietly with melee weapons',
          requiredSkill: { skill: 'combat', minLevel: 4 },
          consequenceSummary: 'Silent kill, but risk of getting scratched.',
          execute: (s: GameState) => {
            const success = Math.random() < 0.75 + (s.player.combatSkill * 0.03);
            if (success) {
              return {
                state: {
                  ...s,
                  shelter: { ...s.shelter, barricadeIntegrity: Math.max(10, s.shelter.barricadeIntegrity - 15) },
                  stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 2 }
                },
                log: 'I took down both zombies quietly before they could fully crawl into ' + loc + '.',
                outcomeTitle: 'Silent Defense Successful',
                outcomeText: 'You neutralized the intruders without making noise. The damaged window frame will need repairs.'
              };
            } else {
              return {
                state: {
                  ...s,
                  player: {
                    ...s.player,
                    health: Math.max(10, s.player.health - 25),
                    sanity: Math.max(10, s.player.sanity - 15),
                    statusEffects: [...s.player.statusEffects, { id: 'bleeding', name: 'Arm Scratch', severity: 'moderate', description: 'Scraped by broken glass and claws. Bandage needed.' }]
                  },
                  stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 2 }
                },
                log: 'I took down both zombies inside ' + loc + ', but sustained a bleeding scratch on my arm.',
                outcomeTitle: 'Cleared — With Injury',
                outcomeText: 'The zombies are down, but you are bleeding. Use a bandage to stop the blood loss.'
              };
            }
          }
        },
        {
          id: 'firearm_takedown',
          text: 'Fire your gun to drop them quickly',
          consequenceSummary: 'Guaranteed kill, but gunfire rings out across the block.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                shelter: {
                  ...s.shelter,
                  stealthRating: Math.max(10, s.shelter.stealthRating - 30),
                  barricadeIntegrity: Math.max(10, s.shelter.barricadeIntegrity - 10)
                },
                stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 2 }
              },
              log: 'I fired two shots inside ' + loc + ', dropping both zombies instantly.',
              outcomeTitle: 'Zombies Dropped — Noise Made',
              outcomeText: 'The threat was eliminated fast, but the gunfire echoed down the street and lowered your stealth.'
            };
          }
        },
        {
          id: 'retreat_barricade',
          text: 'Slam and lock the inner door to seal off the damaged room',
          consequenceSummary: 'Avoids combat and seals the broken section.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.max(15, s.player.sanity - 10) },
                shelter: { ...s.shelter, barricadeIntegrity: Math.max(20, s.shelter.barricadeIntegrity - 20) }
              },
              log: 'I slammed and bolted the inner door inside ' + loc + ', locking the zombies in the broken side room.',
              outcomeTitle: 'Room Sealed Off',
              outcomeText: 'You blocked off the infected room inside ' + loc + ' while keeping yourself safe.'
            };
          }
        }
      ]
    },
    {
      id: 'abandoned_van_street',
      title: 'Abandoned Delivery Van Outside ' + loc,
      category: 'discovery',
      dangerLevel: 'low',
      description: 'From the front window of ' + loc + ', you spot an abandoned delivery van parked across the street with its rear doors hanging open. Food crates are visible inside.',
      choices: [
        {
          id: 'sneak_to_van',
          text: 'Sneak across the street and search the van',
          requiredSkill: { skill: 'stealth', minLevel: 4 },
          consequenceSummary: 'High chance to haul back food and clean water.',
          execute: (s: GameState) => {
            const loot = [
              { id: 'canned_soup_van', name: 'Canned Beef Soup', category: 'food' as const, quantity: 3, description: 'Canned soup rations.' },
              { id: 'water_van', name: 'Bottled Spring Water', category: 'water' as const, quantity: 3, description: 'Sealed 1L bottled water.' }
            ];
            let inv = [...s.inventory];
            for (const item of loot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
              else inv.push(item);
            }
            return {
              state: {
                ...s,
                inventory: inv,
                stats: { ...s.stats, scavengeRuns: s.stats.scavengeRuns + 1 }
              },
              log: 'I sneaked across to the delivery van, grabbed 3 cans of soup and 3 bottles of water, and returned to ' + loc + ' safely.',
              outcomeTitle: 'Successful Haul',
              outcomeText: 'You moved like a shadow and brought back vital supplies without alerting any zombies.'
            };
          }
        },
        {
          id: 'stay_put_van',
          text: 'Play it safe and stay inside',
          consequenceSummary: 'Avoids all risk of exposure outside.',
          execute: (s: GameState) => {
            return {
              state: s,
              log: 'I watched the street from inside ' + loc + ' and decided not to take any risks.',
              outcomeTitle: 'Played It Safe',
              outcomeText: 'Surviving long-term means knowing when to stay put.'
            };
          }
        }
      ]
    },
    {
      id: 'stray_dog_door',
      title: 'Whining at the Door of ' + loc,
      category: 'discovery',
      dangerLevel: 'low',
      description: 'A dirty, hungry stray dog with a frayed collar is whining and scratching gently at the entrance of ' + loc + '.',
      choices: [
        {
          id: 'feed_dog',
          text: 'Feed the dog a ration of food and let it inside',
          consequenceSummary: 'Consumes 1 food, restores morale (+20 Sanity), gives an early warning alert.',
          execute: (s: GameState) => {
            const foodItem = s.inventory.find(i => i.category === 'food' && i.quantity > 0);
            let inv = s.inventory;
            if (foodItem) {
              inv = inv.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            }
            return {
              state: {
                ...s,
                inventory: inv,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 20) }
              },
              log: 'I fed the stray dog and let it curl up inside ' + loc + '. It is now a loyal companion that alerts me when danger approaches!',
              outcomeTitle: 'Loyal Companion Found',
              outcomeText: 'The dog wagged its tail and fell asleep near you. Having a loyal friend in the apocalypse lifts your spirits greatly (+20 Sanity).'
            };
          }
        },
        {
          id: 'shoo_dog',
          text: 'Quietly shoo the dog away so it doesn\'t make noise',
          consequenceSummary: 'Keeps total silence outside your door.',
          execute: (s: GameState) => {
            return {
              state: s,
              log: 'I tapped on the window of ' + loc + ' until the dog quietly trotted away.',
              outcomeTitle: 'Silence Maintained',
              outcomeText: 'The dog trotted away down the road. You avoided any barking that might draw zombies.'
            };
          }
        }
      ]
    }
  ];

  // Only add water tank contamination if shelter is established AND has rainwater stored
  if (state.shelter.isEstablished && state.shelter.storedRainwater > 0) {
    events.push({
      id: 'spoiled_water_supply',
      title: 'Tainted Rainwater Tank at ' + loc,
      category: 'hazard',
      dangerLevel: 'high',
      description: 'While checking the rainwater tank at ' + loc + ', you notice a bad smell and oily film. A dead bird fell into the collection downspout.',
      choices: [
        {
          id: 'boil_and_filter',
          text: 'Boil the water thoroughly over a stove',
          consequenceSummary: 'Purifies the water, consumes a small amount of fuel.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                shelter: { ...s.shelter, fuelGallons: Math.max(0, s.shelter.fuelGallons - 0.5) },
                player: { ...s.player, thirst: Math.min(100, s.player.thirst + 15) }
              },
              log: 'I boiled the rainwater inside ' + loc + ' until all bacteria were destroyed.',
              outcomeTitle: 'Water Sterilized',
              outcomeText: 'The boiling killed any bacteria. The water is safe to drink.'
            };
          }
        },
        {
          id: 'dump_cistern',
          text: 'Dump the tank to stay completely safe',
          consequenceSummary: 'Empties the tank to prevent any sickness.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                shelter: { ...s.shelter, storedRainwater: 0 }
              },
              log: 'I emptied the contaminated rainwater tank at ' + loc + '.',
              outcomeTitle: 'Tank Drained',
              outcomeText: 'Better thirsty than getting sick. You will wait for clean fresh rain.'
            };
          }
        }
      ]
    });
  }

  // If player has established shelter or camp: Knocking survivors arrive!
  const hasShelterOrCamp = state.shelter.isEstablished || state.isCampEstablished || state.campMembers.length > 0;
  const soraAlreadyPresent = state.campMembers.some(m => m.id === 'survivor_sora' || m.name.includes('Sora')) || state.logs.some(l => l.text.includes('Sora'));

  if (hasShelterOrCamp && !soraAlreadyPresent) {
    events.push({
      id: 'knocking_sora_botanist',
      title: 'Frantic Knocking at ' + loc,
      category: 'camp_drama',
      dangerLevel: 'medium',
      description: 'Loud, hurried knocks rattle the entrance of ' + loc + '. A gentle young botanist named Sora Takahashi calls through the door, clutching a pack of heirloom seeds: "Please, is anyone alive in there? A pack of infected is down the road!"',
      choices: [
        {
          id: 'let_sora_in',
          text: 'Unbolt the door quickly and pull Sora inside to safety',
          consequenceSummary: 'Rescues a gentle botanist who can cultivate food and boost camp warmth.',
          execute: (s: GameState) => {
            const sora: CampMember = {
              id: 'survivor_sora',
              name: 'Sora Takahashi',
              gender: 'male',
              age: 23,
              profession: 'Botanist & Gardner',
              relation: 'Friend 😊',
              bio: 'Soft-spoken greenhouse botanist. Knows how to cultivate vegetables and medicinal herbs.',
              health: 85,
              trust: 65,
              daysTogether: 1,
              role: 'craftsman',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, sora],
                isCampEstablished: true,
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: 'I let Sora Takahashi inside ' + loc + ' just before the street horde arrived. He joined my camp as a builder and gardener!',
              outcomeTitle: 'Sora Rescued & Joined Camp',
              outcomeText: 'Sora bowed with deep gratitude and shared fresh seeds from his satchel. Having him in camp unlocks green thumb cultivation!'
            };
          }
        },
        {
          id: 'turn_sora_away',
          text: 'Keep the door barred and yell for him to keep running',
          consequenceSummary: 'Protects the shelter, but leaves a peaceful survivor to his fate.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.max(10, s.player.sanity - 10) }
              },
              log: 'I refused entry to the traveler knocking on the door of ' + loc + '.',
              outcomeTitle: 'Door Remained Locked',
              outcomeText: 'You heard hurried footsteps running down the street, followed by distant infected groans. A grim choice.'
            };
          }
        }
      ]
    });
  }

  // Prevent unique survivor recruitment events from repeating once encountered or joined
  const hasRebecca = state.campMembers.some(m => m.name.includes('Rebecca')) || 
                     state.logs.some(l => l.text.includes('Rebecca') || l.text.includes('Dr. Rebecca Young') || l.text.includes('bite marks wrapped in cloth') || l.text.includes('Knocking in the Rain'));

    const hasStrayDog = state.campMembers.some(m => m.name.includes('Dog') || m.relation.includes('Dog')) || 
                      state.logs.some(l => l.text.includes('stray dog'));

  return events.filter(e => {
    if (e.id === 'feverish_survivor_gate' && hasRebecca) return false;
    if ((e.id === 'hurried_knocks_entrance' || e.id === 'knocking_sora_botanist') && soraAlreadyPresent) return false;
    if (e.id === 'stray_dog_window' && hasStrayDog) return false;
    return true;
  });
}

// ============================================================================
// PROCEDURAL WANDERING SURVIVOR GENERATOR (NEVER REPEATS)
// ============================================================================

const PROCEDURAL_FIRST_NAMES_MALE = [
  'Marcus', 'Julian', 'Liam', 'Noah', 'Caleb', 'Gabriel', 'Darius', 'Lucas', 
  'Tobias', 'Finn', 'Elias', 'Vance', 'Samuel', 'Nate', 'Owen', 'Ezra', 
  'Mateo', 'Hector', 'Silas', 'Dominic', 'Rowan', 'Felix', 'Gideon', 'Arthur'
];

const PROCEDURAL_FIRST_NAMES_FEMALE = [
  'Elena', 'Maya', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria', 
  'Naomi', 'Claire', 'Sophia', 'Isla', 'Zoe', 'Aurora', 'Miriam', 'Clara', 
  'Tessa', 'Rowena', 'Selah', 'Vivian', 'Valeria', 'Fiona', 'Gwen', 'Selena'
];

const PROCEDURAL_LAST_NAMES = [
  'Mercer', 'Cross', 'Vance', 'Sterling', 'Reed', 'Walker', 'Hayes', 'Thorne', 
  'Brooks', 'Stone', 'Silva', 'Chen', 'Miller', 'Diaz', 'Tanaka', 'Rossi', 
  'Jensen', 'Alvarez', 'Blackwood', 'Sinclair', 'Kowalski', "O'Connor", 'Holt', 'Winter'
];

interface ProceduralArchetype {
  profession: string;
  role: CampRole;
  baseStats: { combat: number; medical: number; crafting: number; stealth: number; fitness: number };
  gearPool: { id: string; name: string; category: any; quantity: number; description: string }[];
  bioHooks: string[];
}

const PROCEDURAL_ARCHETYPES: ProceduralArchetype[] = [
  {
    profession: 'Trauma Physician',
    role: 'medic',
    baseStats: { combat: 3, medical: 8, crafting: 4, stealth: 5, fitness: 5 },
    gearPool: [
      { id: 'scav_meds_anti', name: 'Sterile Antibiotics', category: 'medical', quantity: 3, description: 'Pharmaceutical antibiotics.' },
      { id: 'scav_meds_band', name: 'Field Trauma Dressing', category: 'medical', quantity: 2, description: 'Sterile roll bandage.' }
    ],
    bioHooks: [
      'escaped from an overrun downtown surgical triage hospital after the generators failed.',
      'survived three weeks treating wounded stragglers in an abandoned subway pharmacy.',
      'walked twelve miles carrying field surgical instruments after their convoy was ambushed.'
    ]
  },
  {
    profession: 'Framing Carpenter',
    role: 'craftsman',
    baseStats: { combat: 5, medical: 3, crafting: 8, stealth: 4, fitness: 7 },
    gearPool: [
      { id: 'scav_craft_wood', name: 'Cured Framing Lumber', category: 'resource', quantity: 3, description: 'Dense structural timber.' },
      { id: 'scav_craft_nails', name: 'Box of Framing Nails', category: 'resource', quantity: 20, description: 'Steel construction nails.' }
    ],
    bioHooks: [
      'fortified a timber yard against infected before supplies ran dry.',
      'built barricades for an apartment cooperative that eventually disbanded.',
      'fled a collapsed highway overpass carrying their master toolbelt and framing hammer.'
    ]
  },
  {
    profession: 'Former Highway Patrol',
    role: 'guard',
    baseStats: { combat: 8, medical: 4, crafting: 4, stealth: 6, fitness: 7 },
    gearPool: [
      { id: 'scav_guard_ammo', name: 'Box of 9mm Cartridges (12)', category: 'resource', quantity: 12, description: 'Police sidearm ammunition.' },
      { id: 'scav_guard_mre', name: 'Military Ration Meal', category: 'food', quantity: 2, description: 'Self-heating emergency MRE.' }
    ],
    bioHooks: [
      'held a highway roadblock during the initial outbreak panic before patrolling solitary avenues.',
      'evacuated stranded motorists into a transit station until nightfall forced them to retreat.',
      'survived solo perimeter patrols with keen tactical situational awareness.'
    ]
  },
  {
    profession: 'Wilderness Guide & Hunter',
    role: 'scavenger',
    baseStats: { combat: 6, medical: 4, crafting: 5, stealth: 8, fitness: 7 },
    gearPool: [
      { id: 'scav_hunt_meat', name: 'Smoked Jerky Rations', category: 'food', quantity: 3, description: 'Cured trail rations.' },
      { id: 'scav_hunt_water', name: 'Purified Canteen Water', category: 'water', quantity: 2, description: 'Spring water.' }
    ],
    bioHooks: [
      'lived off-grid in the state park foothills before venturing into the city ruins for medicine.',
      'tracked animal game and evaded zombie clusters through dense river ravines.',
      'guided a group of survivors across the mountain pass before parting ways.'
    ]
  },
  {
    profession: 'Commercial Electrician',
    role: 'craftsman',
    baseStats: { combat: 4, medical: 4, crafting: 8, stealth: 5, fitness: 6 },
    gearPool: [
      { id: 'scav_elec_batt', name: 'Lithium Battery Cells', category: 'resource', quantity: 4, description: 'High-capacity power cells.' },
      { id: 'scav_elec_tape', name: 'Heavy Gorilla Tape', category: 'tool', quantity: 1, description: 'Reinforced industrial tape.' }
    ],
    bioHooks: [
      'kept a communications relay tower powered until lightning destroyed the battery bank.',
      'scavenged sub-station parts and wiring harness components from abandoned utility vans.',
      'helped wire a community water pump before prowlers breached the outer perimeter.'
    ]
  },
  {
    profession: 'Field Botanist & Forager',
    role: 'scavenger',
    baseStats: { combat: 3, medical: 6, crafting: 6, stealth: 6, fitness: 5 },
    gearPool: [
      { id: 'scav_bot_seeds', name: 'Heirloom Crop Seed Pack', category: 'resource', quantity: 1, description: 'Heirloom seeds for agriculture.' },
      { id: 'scav_bot_water', name: 'Bottled Spring Water', category: 'water', quantity: 2, description: 'Fresh drinking water.' }
    ],
    bioHooks: [
      'salvaged viable vegetable seed genetics from an agricultural research conservatory.',
      'cultivated rooftop potato beds until water shortages forced an emergency evacuation.',
      'identifies wild edible medicinal herbs, roots, and uncontaminated berries.'
    ]
  },
  {
    profession: 'Locksmith & Mechanic',
    role: 'scavenger',
    baseStats: { combat: 4, medical: 3, crafting: 7, stealth: 8, fitness: 6 },
    gearPool: [
      { id: 'scav_lock_picks', name: 'Lockpick & Tension Wrench Set', category: 'tool', quantity: 1, description: 'Pry and bypass tools.' },
      { id: 'scav_lock_scrap', name: 'Assorted Fasteners & Screws', category: 'resource', quantity: 15, description: 'Hardware metal.' }
    ],
    bioHooks: [
      'bypassed deadbolts on abandoned pharmacies and hardware stores to keep allies supplied.',
      'repaired small engine carburetors and generators in a commercial garage.',
      'slips through locked gates and security doors without making sound.'
    ]
  },
  {
    profession: 'Line Cook & Camp Baker',
    role: 'idle',
    baseStats: { combat: 4, medical: 4, crafting: 6, stealth: 4, fitness: 6 },
    gearPool: [
      { id: 'scav_chef_spices', name: 'Sealed Pantry Staples', category: 'food', quantity: 3, description: 'Preserved ingredients.' },
      { id: 'scav_chef_matches', name: 'Box of Stormproof Matches', category: 'tool', quantity: 1, description: 'Fire starters.' }
    ],
    bioHooks: [
      'managed emergency soup kitchens in the church square before supply trucks stopped coming.',
      'knows how to stretch minimal dry grains into nutritious meals for an entire settlement.',
      'bartered hot meals for shelter in various transit stations across the metro area.'
    ]
  }
];

export function generateProceduralSurvivorDilemma(
  state: GameState, 
  contextType: 'standard' | 'loot_spot' | 'outpost' = 'standard',
  spotName?: string
): EventDilemma {
  const loc = getCurrentLocationName(state);
  const gender: 'male' | 'female' = Math.random() < 0.5 ? 'male' : 'female';
  const firstPool = gender === 'male' ? PROCEDURAL_FIRST_NAMES_MALE : PROCEDURAL_FIRST_NAMES_FEMALE;
  const firstName = firstPool[Math.floor(Math.random() * firstPool.length)];
  const lastName = PROCEDURAL_LAST_NAMES[Math.floor(Math.random() * PROCEDURAL_LAST_NAMES.length)];
  const fullName = firstName + ' ' + lastName;
  const age = 20 + Math.floor(Math.random() * 36);

  const archetype = PROCEDURAL_ARCHETYPES[Math.floor(Math.random() * PROCEDURAL_ARCHETYPES.length)];
  const bioHook = archetype.bioHooks[Math.floor(Math.random() * archetype.bioHooks.length)];

  // Stats with +/- 1 variance
  const cbt = Math.min(10, Math.max(1, archetype.baseStats.combat + (Math.floor(Math.random() * 3) - 1)));
  const med = Math.min(10, Math.max(1, archetype.baseStats.medical + (Math.floor(Math.random() * 3) - 1)));
  const crf = Math.min(10, Math.max(1, archetype.baseStats.crafting + (Math.floor(Math.random() * 3) - 1)));
  const stl = Math.min(10, Math.max(1, archetype.baseStats.stealth + (Math.floor(Math.random() * 3) - 1)));
  const fit = Math.min(10, Math.max(1, archetype.baseStats.fitness + (Math.floor(Math.random() * 3) - 1)));

  const uniqueEventId = 'proc_survivor_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

  const defaultBedCapacity = state.shelter.rooms && state.shelter.rooms.length > 0 
    ? state.shelter.rooms.reduce((sum, r) => sum + r.capacity, 0)
    : (state.shelter.maxSurvivors || (state.shelter.isEstablished ? 4 : 2));
  const isAtCapacity = (state.campMembers.length + 1) >= defaultBedCapacity;

  const isInWorkplace = !state.startingLocation.hasLeftStartingSpot && !state.shelter.isEstablished;
  const isInBase = state.shelter.isEstablished;
  const hasBase = state.shelter.isEstablished;

  // 45% chance the survivor keeps their identity guarded/unknown until welcomed or checked
  const isMysterious = Math.random() < 0.45;
  const pronounReflexive = gender === 'male' ? 'himself' : 'herself';

  let eventTitle = '';
  let eventDesc = '';
  let welcomeText = '';

  if (isInBase) {
    welcomeText = 'Welcome Inside';
  } else if (isInWorkplace) {
    welcomeText = 'Invite Inside';
  } else if (hasBase) {
    welcomeText = 'Invite to Base';
  } else {
    welcomeText = 'Travel Together';
  }

  if (contextType === 'loot_spot') {
    eventTitle = 'Survivor in the Shadows';
    if (isMysterious) {
      eventDesc = 'While searching ' + (spotName || 'the ruins') + ' inside ' + loc + ', your flashlight catches a guarded survivor crouching in the dark with a makeshift blade. A cloth wrap conceals their face as their eyes dart nervously: "Hold on... don\'t shine that light. I am not infected, just scavenging to stay alive. Don\'t shoot."';
    } else {
      eventDesc = 'While searching ' + (spotName || 'the ruins') + ' inside ' + loc + ', your flashlight catches a lone survivor crouching in the dark. Lowering a makeshift blade, they introduce ' + pronounReflexive + ' as ' + fullName + ': "Hold on... I am not here to fight. My name is ' + firstName + ', just searching for food and clean water. Can we talk?"';
    }
  } else if (contextType === 'outpost') {
    eventTitle = 'Encounter at St. Michael Church';
    if (isMysterious) {
      eventDesc = 'You step through the reinforced oak doors of St. Michael Church. A group of survivors have built barricades around the altar. Sitting quietly in the shadows near the corner is an unidentified survivor in a worn travel coat, warming their hands over an ember can. They glance up cautiously: "Sit down if you\'re peaceful. Hard to know who to trust out there, but I\'m looking for people who can survive together."';
    } else {
      eventDesc = 'You step through the reinforced oak doors of St. Michael Church. A group of survivors have built barricades around the altar. Sitting by the fellowship fire, a lone survivor greets you and introduces ' + pronounReflexive + ' as ' + fullName + ': "Sit down, friend. My name is ' + firstName + '. If you are looking for capable survivors to watch each other\'s backs, we should team up."';
    }
  } else if (isInBase) {
    const baseStories = [
      {
        title: 'Fleeing a Horde',
        desc: isMysterious
          ? 'Fierce, desperate pounding rattles the iron perimeter gate of ' + loc + '! Peering through the observation slit, you see a panicked survivor bracing their back against the door, face covered by a dust scarf. Screams and guttural snarls echo two avenues down: "Open up! Please! A pack broke through the avenue checkpoint and they are right behind me!"'
          : 'Fierce, desperate pounding rattles the iron perimeter gate of ' + loc + '! Peering through the observation slit, you see a survivor frantically bracing their back against the door, introducing ' + pronounReflexive + ' as ' + fullName + ': "Open up! Please! It\'s ' + firstName + '! A pack broke through the avenue checkpoint and they are right behind me!"'
      },
      {
        title: 'Wounded Traveler',
        desc: isMysterious
          ? 'A hesitant, rhythmic tapping strikes the gate of ' + loc + '. Outside sits an injured traveler with a pulled-down beanie, holding a clean cloth to a shallow shrapnel scrape on their shoulder: "Peace to the living. I was ambushed two blocks back. Looking for safe shelter to wash my scrape—I can pay my way with ammunition and watch duty."'
          : 'A hesitant, rhythmic tapping strikes the gate of ' + loc + '. Outside sits an injured traveler holding a cloth to a shrapnel scrape on their shoulder. They introduce ' + pronounReflexive + ' as ' + fullName + ': "Peace to the living. My name is ' + firstName + '. I was ambushed two blocks back. Looking for safe shelter to wash my scrape—I can pay my way with ammunition and watch duty."'
      },
      {
        title: 'Stranded Mechanic',
        desc: isMysterious
          ? 'A heavy metal wrench raps firmly against the gate of ' + loc + '. Standing outside is a grease-stained traveler setting down a heavy canvas toolkit: "My salvage wagon threw an axle on the boulevard. I have heavy tools, structural hardware, and trade skills to fortify this base if you have a spare bunk."'
          : 'A heavy metal wrench raps firmly against the gate of ' + loc + '. Standing outside is a grease-stained traveler setting down a heavy canvas toolkit. They introduce ' + pronounReflexive + ' as ' + fullName + ': "Hello inside! My name is ' + firstName + '. My salvage wagon threw an axle on the boulevard. I have heavy tools and trade skills to fortify this base if you have a spare bunk."'
      },
      {
        title: 'Seed-Saver & Forager',
        desc: isMysterious
          ? 'Quiet, deliberate knocks sound at the heavy door of ' + loc + '. A measured, calm voice calls through the observation slit: "Hello inside. I carry heirloom tomato seeds, dried medicinal roots, and clean provisions. Looking for good people to trade with and join."'
          : 'Quiet, deliberate knocks sound at the heavy door of ' + loc + '. A survivor introduces ' + pronounReflexive + ' as ' + fullName + ' through the observation slit in a measured, calm voice: "Hello inside. My name is ' + firstName + '. I carry heirloom seeds and clean provisions. Looking for good people to trade with and join."'
      },
      {
        title: 'Former Resident',
        desc: isMysterious
          ? 'Urgent knocks echo at the entrance of ' + loc + '. A traveler stares up at the windows with recognition: "Is anyone alive in there? I used to live two avenues over before the military evacuated. I know every maintenance tunnel and basement cellar in this sector. Let me team up with you."'
          : 'Urgent knocks echo at the entrance of ' + loc + '. A survivor introduces ' + pronounReflexive + ' as ' + fullName + ', staring up at the windows with recognition: "Is anyone alive in there? My name is ' + firstName + '. I used to live two avenues over before the evacuation. Let me team up with you."'
      },
      {
        title: 'Radio Signal Tracker',
        desc: isMysterious
          ? 'Three short raps, three long, three short—a disciplined signal taps against the gate of ' + loc + '. Outside stands a traveler holding a crackling portable transceiver: "I tracked antenna static in this sector. Trekked four miles across the ruins hoping someone had established a sanctuary here."'
          : 'Three short raps, three long, three short—a disciplined signal taps against the gate of ' + loc + '. Outside stands a survivor holding a crackling portable transceiver who introduces ' + pronounReflexive + ' as ' + fullName + ': "I tracked antenna static in this sector. Trekked four miles across the ruins hoping someone had established a sanctuary here."'
      },
      {
        title: 'Storm Refugee',
        desc: isMysterious
          ? 'Weak, shivering knocks strike the reinforced entrance of ' + loc + '. Shivering violently in soaked clothes from the bitter wind, a traveler huddles under the doorway: "I need shelter before hypothermia takes me. I am clean, uninfected, and ready to work any shift you need."'
          : 'Weak, shivering knocks strike the reinforced entrance of ' + loc + '. Shivering violently in soaked clothes from the bitter wind, a traveler introduces ' + pronounReflexive + ' as ' + fullName + ': "I need shelter before hypothermia takes me. My name is ' + firstName + '. I am clean, uninfected, and ready to work any shift you need."'
      },
      {
        title: 'Cautious Wanderer',
        desc: isMysterious
          ? 'A steady, measured knock sounds at the gate of ' + loc + '. A traveler stands back with hands visible and empty: "Saw smoke from your chimney pipe. I have provisions in my pack and good eyes for scouting. Looking for honest survivors to build with."'
          : 'A steady, measured knock sounds at the gate of ' + loc + '. A traveler stands back with hands visible and introduces ' + pronounReflexive + ' as ' + fullName + ': "Saw smoke from your chimney pipe. My name is ' + firstName + '. I have provisions in my pack and good eyes for scouting. Looking for honest survivors to build with."'
      }
    ];

    const chosenStory = baseStories[Math.floor(Math.random() * baseStories.length)];
    eventTitle = chosenStory.title;
    eventDesc = chosenStory.desc;
  } else if (isInWorkplace) {
    eventTitle = 'Surprise Visitor at ' + state.startingLocation.name;
    if (isMysterious) {
      eventDesc = 'Hurried knocks rattle the security entrance of ' + state.startingLocation.name + '. Through the blinds, you spot a breathless survivor with collar turned up and face obscured by rain and dust. Sheltering from the chaotic streets outside, they plead: "Please! Is someone in there? I am uninfected, bite-free, and just trying to survive—can we team up?"';
    } else {
      eventDesc = 'Hurried knocks rattle the security entrance of ' + state.startingLocation.name + '. Through the blinds, you spot a lone survivor who introduces ' + pronounReflexive + ' as ' + fullName + '. Sheltering from the chaotic streets outside, they call out: "Please! Is someone in there? My name is ' + firstName + '. I am uninfected and have supplies—can we team up to survive?"';
    }
  } else {
    eventTitle = 'Encounter in the Ruins';
    if (isMysterious) {
      eventDesc = 'While moving through the fog along the avenue, you cross paths with another lone survivor keeping their distance with a cautious grip on their makeshift weapon. Their face is partially concealed beneath a worn hood, watching your movements warily. Lowering their weapon slightly, they call out: "Easy! I am not infected. Just looking for an honest survivor to travel with and watch each other\'s backs."';
    } else {
      eventDesc = 'While moving through the fog along the avenue, you cross paths with another lone survivor who introduces ' + pronounReflexive + ' as ' + fullName + '. Lowering their makeshift weapon with cautious eyes, they call out: "Easy! I am not infected. My name is ' + firstName + '. Just looking for an honest survivor to travel with and watch each other\'s backs."';
    }
  }

  return {
    id: uniqueEventId,
    title: eventTitle,
    category: 'camp_drama',
    dangerLevel: 'medium',
    description: eventDesc,
    choices: [
      {
        id: 'welcome_' + uniqueEventId,
        text: welcomeText,
        consequenceSummary: isMysterious
          ? (hasBase ? 'Invites the survivor to join your haven.' : 'Teams up with the survivor for the journey.') + (isAtCapacity && isInBase ? ' (Will sleep rough on floor until beds expand)' : '')
          : (hasBase ? 'Welcomes ' + fullName + ' to your group.' : 'Teams up with ' + fullName + ' for the journey.') + (isAtCapacity && isInBase ? ' (Will sleep rough on floor until beds expand)' : ''),
        execute: (s: GameState) => {
          const newMember: CampMember = {
            id: 'proc_member_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: fullName,
            gender,
            age,
            relation: 'Fellow Survivor',
            profession: archetype.profession,
            bio: fullName + ' ' + bioHook,
            health: 90,
            trust: 70,
            combatSkill: cbt,
            medicalSkill: med,
            craftingSkill: crf,
            stealthSkill: stl,
            fitnessSkill: fit,
            role: archetype.role,
            isSleepingRough: isAtCapacity && s.shelter.isEstablished,
            statusEffects: []
          };

          const logText = isMysterious
            ? (hasBase
                ? (isAtCapacity && s.shelter.isEstablished
                    ? 'I welcomed the stranger into our haven. They introduced themselves as ' + fullName + ' and accepted a sleeping roll on the floor.'
                    : 'I welcomed the stranger into our haven. They introduced themselves as ' + fullName + '.')
                : 'I agreed to travel together with the stranger. They introduced themselves as ' + fullName + '.')
            : (hasBase
                ? (isAtCapacity && s.shelter.isEstablished
                    ? 'I welcomed ' + fullName + ' into our haven. With all beds full, they accepted a sleeping roll on the floor.'
                    : 'I welcomed ' + fullName + ' into our haven.')
                : 'I teamed up with ' + fullName + ' to travel together.');

          const outcomeTitle = fullName + ' Joined Your Group';
          const outcomeText = isMysterious
            ? (hasBase
                ? 'With safe shelter secured, the stranger pulls down their hood and introduces themselves as ' + fullName + ': "Thank you for taking a chance on me. I will pull my weight every single day."'
                : 'The stranger breathes a sigh of relief, lowering their hood to introduce themselves as ' + fullName + ': "Thank you for trusting me. Traveling alone out here is suicide. Let\'s watch each other\'s backs."')
            : fullName + ' set down their pack with a long sigh of relief. "Thank you for trusting me. I will pull my weight every single day."';

          return {
            state: {
              ...s,
              campMembers: [...s.campMembers, newMember],
              inventory: [...s.inventory, ...archetype.gearPool.map(g => ({ ...g }))],
              shelter: {
                ...s.shelter,
                morale: Math.min(100, (s.shelter.morale ?? 75) + 15)
              },
              player: {
                ...s.player,
                sanity: Math.min(100, s.player.sanity + 10)
              },
              stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
            },
            log: logText,
            outcomeTitle,
            outcomeText
          };
        }
      },
      {
        id: 'quarantine_' + uniqueEventId,
        text: 'Check for Bites',
        consequenceSummary: isMysterious
          ? 'Safe protocol: verifies bite-free status. The survivor will reveal their identity once cleared.'
          : 'Safe protocol: verifies bite-free status before welcoming ' + fullName + '.',
        execute: (s: GameState) => {
          const newMember: CampMember = {
            id: 'proc_member_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            name: fullName,
            gender,
            age,
            relation: 'Fellow Survivor',
            profession: archetype.profession,
            bio: fullName + ' ' + bioHook,
            health: 95,
            trust: 85,
            combatSkill: cbt,
            medicalSkill: med,
            craftingSkill: crf,
            stealthSkill: stl,
            fitnessSkill: fit,
            role: archetype.role,
            isSleepingRough: isAtCapacity && s.shelter.isEstablished,
            statusEffects: []
          };

          const outcomeTitle = isMysterious ? fullName + ' Cleared & Introduced' : 'Health Check Passed';
          const outcomeText = isMysterious
            ? 'The stranger calmly submits to the bite check, pulling back sleeves and collar to show clean, uninfected skin. Relieved, they lower their hood and introduce themselves as ' + fullName + ': "A survivor who checks for bites is a survivor who stays alive. I respect the discipline. Let\'s watch each other\'s backs."'
            : fullName + ' nodded approvingly: "A survivor who checks for bites is a survivor who stays alive. I respect the discipline." They are now safe with your group.';

          const logText = isMysterious
            ? 'I checked the stranger carefully for bites. They passed cleanly and introduced themselves as ' + fullName + '.'
            : 'I checked ' + fullName + ' carefully for bites. They passed cleanly and appreciated the safety caution.';

          return {
            state: {
              ...s,
              campMembers: [...s.campMembers, newMember],
              inventory: [...s.inventory, ...archetype.gearPool.map(g => ({ ...g }))],
              shelter: {
                ...s.shelter,
                morale: Math.min(100, (s.shelter.morale ?? 75) + 10)
              },
              stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
            },
            log: logText,
            outcomeTitle,
            outcomeText
          };
        }
      },
      {
        id: 'rations_' + uniqueEventId,
        text: 'Share Rations & Turn Away',
        consequenceSummary: 'Merciful parting: Shares supplies without adding an extra mouth to feed (-1 Food, -1 Water, +5 Sanity).',
        execute: (s: GameState) => {
          let inv = [...s.inventory];
          const f = inv.find(i => i.category === 'food' && i.quantity > 0);
          if (f) f.quantity -= 1;
          const w = inv.find(i => i.category === 'water' && i.quantity > 0);
          if (w) w.quantity -= 1;
          inv = inv.filter(i => i.quantity > 0);

          return {
            state: {
              ...s,
              inventory: inv,
              player: { ...s.player, sanity: Math.min(100, s.player.sanity + 5) }
            },
            log: isMysterious
              ? 'I shared rations with the stranger and explained our group could not take on new members. They thanked me warmly and moved along safely.'
              : 'I shared rations with ' + fullName + ' and explained our group could not take on new members. They thanked me warmly and moved along safely.',
            outcomeTitle: 'Peaceful Parting',
            outcomeText: (isMysterious ? 'The stranger' : fullName) + ' took the provisions with gratitude: "May your luck hold, friend. Thank you for the meal." They vanished safely into the morning fog.'
          };
        }
      },
      {
        id: 'deny_' + uniqueEventId,
        text: 'Turn Away',
        consequenceSummary: 'Preserves total security with zero resource expenditure.',
        execute: (s: GameState) => {
          return {
            state: s,
            log: isMysterious
              ? 'I ordered the stranger to move along. They nodded in silence, turned on their heels, and departed into the ruins.'
              : 'I ordered ' + fullName + ' to move along. They nodded in silence, turned on their heels, and departed into the ruins.',
            outcomeTitle: 'Stranger Turned Away',
            outcomeText: 'The footsteps receded into the city. The area remains quiet.'
          };
        }
      }
    ]
  };
}


export function getRandomSurvivalEvent(state: GameState): EventDilemma | null {
  const hasShelterOrCamp = state.shelter.isEstablished || state.startingLocation.hasLeftStartingSpot;
  
  // 35% chance to roll a freshly generated, never-repeating wandering survivor dilemma when in camp/base!
  if (hasShelterOrCamp && Math.random() < 0.35) {
    return generateProceduralSurvivorDilemma(state);
  }

  const events = getSurvivalEvents(state);
  const filtered = events.filter(e => e.id !== state.activeDilemma?.id);
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Looting Encounter: Meet a procedurally generated survivor while looting a spot
export function getLootSpotSurvivorDilemma(state: GameState, spotName: string): EventDilemma | null {
  if (state.campMembers.length >= 8) return null;
  return generateProceduralSurvivorDilemma(state, 'loot_spot', spotName);
}

// Outpost Encounter: Meet a procedurally generated survivor at church fellowship fire
export function getSurvivorOutpostDilemma(state: GameState): EventDilemma {
  return generateProceduralSurvivorDilemma(state, 'outpost');
}

// Fallback constant for legacy imports
export const SURVIVAL_EVENTS: EventDilemma[] = getSurvivalEvents({
  day: 1,
  timeOfDay: 'Morning',
  weather: 'clear',
  temperatureCelsius: 18,
  player: { gender: 'male' } as any,
  startingLocation: { name: 'your safe place', type: 'Building', description: '', lootSpots: [], hasLeftStartingSpot: false },
  campMembers: [],
  shelter: { isEstablished: false, name: 'Safehouse', type: 'Building', defenseRating: 0, stealthRating: 0, warmthRating: 0, waterCollectorLevel: 0, storedRainwater: 0, maxRainwater: 10, barricadeIntegrity: 0, generatorOperational: false, fuelGallons: 0 },
  inventory: [],
  logs: [],
  activeDilemma: null,
  dilemmaResult: null,
  daysWithoutFood: 0,
  daysWithoutWater: 0,
  stats: { zombiesEliminated: 0, daysSurvived: 0, scavengeRuns: 0, peopleSaved: 0 },
  ribbons: []
});
