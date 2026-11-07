import { EventDilemma, GameState } from '../types/game';

export const DAY_ONE_EVENT: EventDilemma = {
  id: 'day1_looting_spree',
  title: 'Day 1: The Silence After the Sirens',
  category: 'discovery',
  dangerLevel: 'low',
  description: 'The national emergency sirens have abruptly died out. The neighborhood is deathly quiet. You have empty pockets and zero supplies on you. Your immediate safehouse is unsearched. Where do you scavenge first?',
  choices: [
    {
      id: 'search_kitchen',
      text: 'Rummage through the kitchen pantry & refrigerator',
      consequenceSummary: 'Secures vital initial water and canned rations.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'canned_beans', name: 'Canned Black Beans', category: 'food' as const, quantity: 2, description: 'Sealed canned beans with pull-tab lid.' },
          { id: 'bottled_water', name: 'Bottled Tap Water', category: 'water' as const, quantity: 2, description: 'Bottled drinking water filled from the tap before pressure dropped.' },
          { id: 'kitchen_knife', name: 'Chef\'s Kitchen Knife', category: 'weapon' as const, quantity: 1, description: '8-inch stainless steel utility knife.', durability: 80 }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems]
          },
          log: 'You looted the kitchen pantry: Found 2 cans of beans, 2 bottles of tap water, and a sharp chef\'s knife.',
          outcomeTitle: 'Initial Rations Secured',
          outcomeText: 'You quietly searched the cabinets and gathered your first emergency supplies. Your hunger and thirst won\'t kill you today.'
        };
      }
    },
    {
      id: 'search_bathroom',
      text: 'Search the bathroom medicine cabinet',
      consequenceSummary: 'Focus on first aid, trauma bandages, and antiseptics.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'gauze_bandage', name: 'Roll of Sterile Gauze', category: 'medical' as const, quantity: 2, description: 'Sterile cotton bandage to stop bleeding.' },
          { id: 'rubbing_alcohol', name: 'Bottle of Rubbing Alcohol (70%)', category: 'medical' as const, quantity: 1, description: 'Antiseptic for disinfecting dirty puncture wounds.' },
          { id: 'bottled_water', name: 'Filled Bathroom Tumbler', category: 'water' as const, quantity: 1, description: 'Fresh water.' }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems]
          },
          log: 'You searched the medicine cabinet: Recovered sterile gauze, rubbing alcohol, and clean water.',
          outcomeTitle: 'First Aid Stockpiled',
          outcomeText: 'You secured life-saving medical supplies. In a world full of broken glass and teeth, having bandages ready is the difference between life and death.'
        };
      }
    },
    {
      id: 'search_closet_garage',
      text: 'Search the hall closet & toolbox for tools and barricade lumber',
      consequenceSummary: 'Secures blunt weapons, framing nails, and structural planks.',
      execute: (state: GameState) => {
        const foundItems = [
          { id: 'claw_hammer', name: 'Steel Claw Hammer', category: 'weapon' as const, quantity: 1, description: 'Reliable blunt weapon and construction tool.', durability: 95 },
          { id: 'wood_planks', name: 'Pine 2x4 Lumber Planks', category: 'resource' as const, quantity: 3, description: 'Sturdy timber for boarding windows.' },
          { id: 'duct_tape', name: 'Heavy Duty Duct Tape', category: 'tool' as const, quantity: 1, description: 'Waterproof repair tape.' }
        ];
        return {
          state: {
            ...state,
            inventory: [...state.inventory, ...foundItems],
            shelter: { ...state.shelter, barricadeIntegrity: Math.min(100, state.shelter.barricadeIntegrity + 10) }
          },
          log: 'You scavenged the hall closet: Found a heavy claw hammer, 3 lumber planks, and duct tape.',
          outcomeTitle: 'Demolition & Barricade Gear Acquired',
          outcomeText: 'You now possess a solid weapon and structural materials to reinforce your doors and windows against intrusion.'
        };
      }
    }
  ]
};

export const SURVIVAL_EVENTS: EventDilemma[] = [
  {
    id: 'scratched_window',
    title: 'The Basement Window Breached',
    category: 'crisis',
    dangerLevel: 'high',
    description: 'At 2:40 AM, the shatter of reinforced glass echoes through the floorboards. Two desiccated infected crawl halfway through the basement egress window, snapping their jaws against the wooden frame.',
    choices: [
      {
        id: 'blunt_force',
        text: 'Dispatch them quietly using melee weapons',
        requiredSkill: { skill: 'combat', minLevel: 5 },
        consequenceSummary: 'Silent kill, but risk of taking a scratch or bite.',
        execute: (state: GameState) => {
          const success = Math.random() < 0.75 + (state.player.combatSkill * 0.03);
          if (success) {
            return {
              state: {
                ...state,
                shelter: { ...state.shelter, barricadeIntegrity: Math.max(10, state.shelter.barricadeIntegrity - 15) },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2 }
              },
              log: 'You crushed the skulls of both intruders with measured strikes. No gunshots were fired.',
              outcomeTitle: 'Silent Defense Successful',
              outcomeText: 'You neutralized the threat without alerting the neighborhood horde. However, the basement window frame is splintered and needs repair.'
            };
          } else {
            // Player gets scratched
            const hasBandage = state.inventory.some(i => i.id.includes('bandage') && i.quantity > 0);
            return {
              state: {
                ...state,
                player: {
                  ...state.player,
                  health: Math.max(10, state.player.health - 25),
                  sanity: Math.max(10, state.player.sanity - 15),
                  statusEffects: [...state.player.statusEffects, { id: 'bleeding', name: 'Deep Forearm Laceration', severity: 'moderate', description: 'Gouged by broken glass and jagged teeth. Losing blood.' }]
                },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2 }
              },
              log: 'You took down the infected, but sustained a deep laceration on your forearm during the struggle.',
              outcomeTitle: 'Breach Cleared — With Injury',
              outcomeText: 'The corpses lie motionless, but your sleeve is soaked in dark blood. You need to dress and disinfect this wound immediately before bacterial sepsis or worse sets in.'
            };
          }
        }
      },
      {
        id: 'firearm_takedown',
        text: 'Discharge firearm for rapid defense',
        consequenceSummary: 'Guaranteed kill, but gunfire rings out for miles.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              shelter: {
                ...state.shelter,
                stealthRating: Math.max(10, state.shelter.stealthRating - 35),
                barricadeIntegrity: Math.max(10, state.shelter.barricadeIntegrity - 10)
              },
              stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2 }
            },
            log: 'Two loud 9mm gunshots cracked through the dead silence of the night.',
            outcomeTitle: 'Threat Neutralized — Position Compromised',
            outcomeText: 'The gunshots reverberated against the surrounding hills. In the quiet dead world, every scavenger and roaming cluster within a 2-mile radius heard that shot. Your shelter stealth has drastically dropped.'
          };
        }
      },
      {
        id: 'retreat_barricade',
        text: 'Slam and deadbolt the basement door, ceding the basement for now',
        consequenceSummary: 'Avoids combat, but basement supplies and water line are temporarily cut off.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              player: { ...state.player, sanity: Math.max(15, state.player.sanity - 10) },
              shelter: { ...state.shelter, barricadeIntegrity: Math.max(20, state.shelter.barricadeIntegrity - 20) }
            },
            log: 'You retreated upstairs and drove heavy iron sliding bolts into the reinforced door.',
            outcomeTitle: 'Basement Sealed Off',
            outcomeText: 'You hear persistent scratching and groaning from beneath the floorboards. You are safe for now, but your basement storage and water access remain inaccessible until you clear them out.'
          };
        }
      }
    ]
  },
  {
    id: 'feverish_survivor_gate',
    title: 'Knocking in the Rain',
    category: 'camp_drama',
    dangerLevel: 'medium',
    description: 'During a cold downpour, a shivering 22-year-old woman wrapped in a soaking wool coat collapses outside your perimeter gate. She begs for dry shelter and clean water, but she is pale and clutching her left ribs.',
    choices: [
      {
        id: 'thorough_strip_check',
        text: 'Perform an exhaustive physical triage check before admitting her',
        requiredSkill: { skill: 'medical', minLevel: 4 },
        consequenceSummary: 'Identify any bites or bullet wounds before risking the camp.',
        execute: (state: GameState) => {
          const isInfected = Math.random() < 0.25;
          if (isInfected) {
            return {
              state: {
                ...state,
                player: { ...state.player, sanity: Math.max(10, state.player.sanity - 10) }
              },
              log: 'Under her thick sweater, you discovered fresh puncture wounds wrapped in dirty duct tape. She was already infected.',
              outcomeTitle: 'Infection Detected at the Gate',
              outcomeText: 'When confronted with the teeth marks on her shoulder, she broke down weeping. You refused entry at gunpoint. By morning, she had wandered away into the treeline.'
            };
          } else {
            const newMember = {
              id: `member_${Date.now()}`,
              name: 'Dr. Rebecca Young',
              age: 26,
              relation: 'Rescued Field Medic',
              profession: 'Resident Physician',
              health: 65,
              trust: 75,
              role: 'medic' as const,
              statusEffects: [{ id: 'hypothermia' as const, name: 'Mild Hypothermia', severity: 'mild' as const, description: 'Shivering violently from rain exposure.' }]
            };
            return {
              state: {
                ...state,
                campMembers: [...state.campMembers, newMember],
                stats: { ...state.stats, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'You found blunt rib contusions from an assault, but zero bite marks or scratches. She is a medical resident.',
              outcomeTitle: 'Valuable Survivor Recruited',
              outcomeText: 'She passed the inspection. Dr. Rebecca Young has joined your camp. Her presence will drastically improve recovery from wounds and diseases!'
            };
          }
        }
      },
      {
        id: 'turn_away_safely',
        text: 'Refuse entry. Leave one ration of food outside and tell her to move on.',
        consequenceSummary: 'Zero infection risk to your base, slight hit to player sanity/morale.',
        execute: (state: GameState) => {
          // Consume 1 food if available
          const foodItem = state.inventory.find(i => i.category === 'food' && i.quantity > 0);
          const updatedInv = state.inventory.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
          return {
            state: {
              ...state,
              inventory: updatedInv,
              player: { ...state.player, sanity: Math.max(10, state.player.sanity - 8) }
            },
            log: 'You slid a can of food beneath the gate and ordered her to leave.',
            outcomeTitle: 'Protocol Maintained',
            outcomeText: 'You watched through the peephole as she took the can, bowed her head, and vanished into the pouring rain. A harsh decision, but nobody in your camp is put in jeopardy.'
          };
        }
      },
      {
        id: 'blind_trust',
        text: 'Rush outside and pull her into the warm living quarters without delay',
        consequenceSummary: 'High humanitarian compassion, but severe gamble with camp life.',
        execute: (state: GameState) => {
          const catastrophe = Math.random() < 0.40;
          if (catastrophe) {
            return {
              state: {
                ...state,
                player: {
                  ...state.player,
                  health: Math.max(20, state.player.health - 35),
                  sanity: Math.max(10, state.player.sanity - 30)
                },
                shelter: { ...state.shelter, barricadeIntegrity: Math.max(10, state.shelter.barricadeIntegrity - 30) }
              },
              log: 'Disaster! She reanimated at 4 AM and attacked the sleeping quarters before she could be stopped.',
              outcomeTitle: 'Catastrophic Nighttime Turn',
              outcomeText: 'She had concealed a lethal bite under a wool scarf. The entire camp woke up to screams. You put her down with a crowbar, but not before severe injuries were inflicted.'
            };
          } else {
            return {
              state: {
                ...state,
                player: { ...state.player, sanity: Math.min(100, state.player.sanity + 10) },
                stats: { ...state.stats, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'She was genuinely just starved and exhausted. She cried tears of relief by the stove.',
              outcomeTitle: 'Gamble Paid Off',
              outcomeText: 'A warm bowl of soup stabilized her. She swore eternal loyalty to your sanctuary.'
            };
          }
        }
      }
    ]
  },
  {
    id: 'spoiled_water_supply',
    title: 'Tainted Cistern',
    category: 'hazard',
    dangerLevel: 'high',
    description: 'While checking your rooftop rainwater cistern, you notice an oily residue and a foul metallic stench. A dead crow was trapped in the downspout filter, rotting for days. 15 liters of stored water may be carrying lethal bacterial pathogens.',
    choices: [
      {
        id: 'boil_and_filter',
        text: 'Spend 2 hours boiling the entire batch over a gas stove',
        consequenceSummary: 'Saves the water, consumes fuel or firewood.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              shelter: { ...state.shelter, fuelGallons: Math.max(0, state.shelter.fuelGallons - 0.5) },
              player: { ...state.player, thirst: Math.min(100, state.player.thirst + 15) }
            },
            log: 'You strained the sediment through cotton cloth and brought every gallon to a rolling 10-minute boil.',
            outcomeTitle: 'Water Sterilized',
            outcomeText: 'The boiling killed the waterborne bacteria. The water tastes flat, but it is microbiologically safe to drink.'
          };
        }
      },
      {
        id: 'use_chlorine_tabs',
        text: 'Drop water purification tablets into the holding tank',
        requiresItem: 'water_purification',
        consequenceSummary: 'Fast and reliable chemical disinfection.',
        execute: (state: GameState) => {
          const tabItem = state.inventory.find(i => i.id === 'water_purification');
          const updatedInv = state.inventory.map(i => i === tabItem ? { ...i, quantity: i.quantity - 2 } : i).filter(i => i.quantity > 0);
          return {
            state: {
              ...state,
              inventory: updatedInv,
              player: { ...state.player, sanity: Math.min(100, state.player.sanity + 5) }
            },
            log: 'You dissolved two chlorine tabs into the cistern. The water is completely disinfected.',
            outcomeTitle: 'Chemical Decontamination',
            outcomeText: 'The water smells slightly of chlorine, but tests clear of pathogens. No fuel was wasted.'
          };
        }
      },
      {
        id: 'dump_cistern',
        text: 'Dump the entire tank to avoid all disease risk',
        consequenceSummary: 'Guarantees no dysentery, but wipes out your stored water reserves.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              shelter: { ...state.shelter, storedRainwater: 0 }
            },
            log: 'You opened the drain valve and watched 15 gallons of tainted rainwater pour into the gutter.',
            outcomeTitle: 'Water Purged',
            outcomeText: 'Better thirsty than dying of bacterial dysentery alone in a dark room. You must find alternative clean water sources soon.'
          };
        }
      }
    ]
  },
  {
    id: 'armed_scavengers_standoff',
    title: 'Armed Scavengers on the Street',
    category: 'encounter',
    dangerLevel: 'high',
    description: 'Two armed men in tactical vests are methodically kicking down doors along your block. They are carrying pump-action shotguns and moving with military coordination. They are 30 yards away from your front porch.',
    choices: [
      {
        id: 'kill_zone_ambush',
        text: 'Hold fire and prepare an ambush from the second-story window',
        requiredSkill: { skill: 'combat', minLevel: 6 },
        consequenceSummary: 'High probability of eliminating raiders and taking their firearms.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              inventory: [
                ...state.inventory,
                { id: 'remington_shotgun', name: '12-Gauge Remington 870', category: 'weapon', quantity: 1, description: 'Pump-action tactical shotgun with 6 shells.', durability: 90 },
                { id: 'buckshot_ammo', name: '12-Gauge 00 Buckshot (8 shells)', category: 'resource', quantity: 8, description: 'Devastating close-range ammunition.' }
              ],
              stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 1 }
            },
            log: 'From the master bedroom window, you caught both raiders in an enfilade crossfire.',
            outcomeTitle: 'Ambush Successful — Weapons Captured',
            outcomeText: 'Your tactical patience paid off. You eliminated both hostiles without taking returning fire and stripped their bodies of a Remington shotgun and military rations.'
          };
        }
      },
      {
        id: 'blackout_stealth',
        text: 'Kill all lights, stay below window sills, and let them pass by',
        requiredSkill: { skill: 'stealth', minLevel: 5 },
        consequenceSummary: 'Avoids combat completely, preserving ammunition and safety.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              player: { ...state.player, sanity: Math.min(100, state.player.sanity + 5) }
            },
            log: 'You lay flat against the hardwood floor for 45 minutes, holding your breath.',
            outcomeTitle: 'Passed Undetected',
            outcomeText: 'One of them kicked your garden gate, paused, muttered that the place looked already looted, and moved down the street toward the highway.'
          };
        }
      },
      {
        id: 'verbal_parley',
        text: 'Call out from behind cover and offer to trade medical supplies for safe passage',
        consequenceSummary: 'Risky diplomacy with desperate survivors.',
        execute: (state: GameState) => {
          const success = Math.random() < 0.50;
          if (success) {
            return {
              state: {
                ...state,
                inventory: [
                  ...state.inventory,
                  { id: 'canned_food_trade', name: 'Military MRE Rations', category: 'food', quantity: 4, description: 'Ready-to-eat military field rations.' }
                ]
              },
              log: 'You traded a surplus bottle of antiseptic for 4 military MREs through the mail slot.',
              outcomeTitle: 'Tense Barter Concluded',
              outcomeText: 'The leader nodded respectfully. "We won\'t come back to your street. Good luck out here." They departed in peace.'
            };
          } else {
            return {
              state: {
                ...state,
                shelter: { ...state.shelter, barricadeIntegrity: Math.max(10, state.shelter.barricadeIntegrity - 30) },
                player: { ...state.player, health: Math.max(20, state.player.health - 20) }
              },
              log: 'The raiders opened fire through the front door the moment you spoke.',
              outcomeTitle: 'Ambushed at the Door',
              outcomeText: 'Buckshot shredded the door frame. You returned fire through the peephole and drove them off, but wood splinters peppered your shoulder.'
            };
          }
        }
      }
    ]
  },
  {
    id: 'pharmacy_scavenge_call',
    title: 'The St. Jude Medical Clinic',
    category: 'discovery',
    dangerLevel: 'medium',
    description: 'A local neighborhood clinic 4 blocks away has its security shutter cracked open two feet from the asphalt. Inside the dark triage lobby, medicine cabinets remain locked behind bulletproof glass.',
    choices: [
      {
        id: 'stealth_raid',
        text: 'Crawl through the gap with a flashlight and prybar',
        requiredSkill: { skill: 'crafting', minLevel: 4 },
        consequenceSummary: 'High reward medical supplies, moderate risk of trapped infected.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              inventory: [
                ...state.inventory,
                { id: 'morphine_vial', name: 'Injectable Morphine Sulfate', category: 'medical', quantity: 2, description: 'Potent narcotic analgesic for severe trauma surgery.' },
                { id: 'antibiotics_cipro', name: 'Ciprofloxacin Antibiotics', category: 'medical', quantity: 8, description: 'Powerful antibiotic effective against severe gastrointestinal and wound infections.' },
                { id: 'suture_kit', name: 'Sterile Ethicon Sutures & Needle Holder', category: 'medical', quantity: 3, description: 'Professional wound closure kit.' }
              ],
              stats: { ...state.stats, scavengeRuns: state.stats.scavengeRuns + 1 }
            },
            log: 'You pried open the pharmacy narcotics safe without making excessive noise.',
            outcomeTitle: 'Major Medical Haul',
            outcomeText: 'You recovered prescription antibiotics, sterile sutures, and clinical painkillers. This will save lives when trauma strikes.'
          };
        }
      },
      {
        id: 'perimeter_scout',
        text: 'Observe from the rooftop across the street first',
        consequenceSummary: 'Identifies potential hazards and infected patterns.',
        execute: (state: GameState) => {
          return {
            state: {
              ...state,
              player: { ...state.player, stealthSkill: Math.min(10, state.player.stealthSkill + 1) }
            },
            log: 'From the rooftop, you spotted three dormant infected lying behind the reception counter.',
            outcomeTitle: 'Intelligence Gathered',
            outcomeText: 'Your patience revealed a lethal blind-corner ambush. You can return later prepared with suppressed weapons or smoke.'
          };
        }
      }
    ]
  }
];
