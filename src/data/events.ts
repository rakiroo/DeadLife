import { EventDilemma, GameState, CampMember } from '../types/game';

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
      id: 'feverish_survivor_gate',
      title: 'Knocking in the Rain at ' + loc,
      category: 'camp_drama',
      dangerLevel: 'medium',
      description: 'During cold rain, a shivering woman in a wet jacket knocks weakly on the door of ' + loc + ', begging for dry shelter and clean water.',
      choices: [
        {
          id: 'thorough_strip_check',
          text: 'Check her carefully for bite marks or scratches before letting her in',
          requiredSkill: { skill: 'medical', minLevel: 3 },
          consequenceSummary: 'Identify any bites before risking your safety.',
          execute: (s: GameState) => {
            const isInfected = Math.random() < 0.25;
            if (isInfected) {
              return {
                state: {
                  ...s,
                  player: { ...s.player, sanity: Math.max(10, s.player.sanity - 10) }
                },
                log: 'Under her wet jacket, I found fresh bite marks wrapped in cloth. I refused entry to keep ' + loc + ' safe.',
                outcomeTitle: 'Infection Detected',
                outcomeText: 'She admitted she was bitten hours ago. You turned her away to protect ' + loc + '.'
              };
            } else {
              const newMember = {
                id: 'member_' + Date.now(),
                name: 'Dr. Rebecca Young',
                age: 26,
                relation: 'Rescued Medic',
                profession: 'Physician',
                health: 65,
                trust: 75,
                role: 'medic' as const,
                statusEffects: []
              };
              return {
                state: {
                  ...s,
                  campMembers: [...s.campMembers, newMember],
                  isCampEstablished: true,
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: 'I found no bites on her. Dr. Rebecca Young has joined me at ' + loc + '! The Camp tab is now open.',
                outcomeTitle: 'Survivor Recruited',
                outcomeText: 'She passed the health check and joined your group. Her medical training will speed up recovery from wounds!'
              };
            }
          }
        },
        {
          id: 'turn_away_safely',
          text: 'Leave a can of food outside and tell her to keep moving',
          consequenceSummary: 'Zero risk to yourself, slight hit to player morale.',
          execute: (s: GameState) => {
            const foodItem = s.inventory.find(i => i.category === 'food' && i.quantity > 0);
            const updatedInv = s.inventory.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
            return {
              state: {
                ...s,
                inventory: updatedInv,
                player: { ...s.player, sanity: Math.max(10, s.player.sanity - 8) }
              },
              log: 'I slid a can of food outside the entrance of ' + loc + ' and told her to keep moving.',
              outcomeTitle: 'Safety First',
              outcomeText: 'She took the food, thanked you through tears, and vanished into the rain. A tough choice, but ' + loc + ' remains secure.'
            };
          }
        },
        {
          id: 'blind_trust',
          text: 'Pull her inside immediately into the warmth without checking',
          consequenceSummary: 'High compassion, but a dangerous gamble.',
          execute: (s: GameState) => {
            const catastrophe = Math.random() < 0.35;
            if (catastrophe) {
              return {
                state: {
                  ...s,
                  player: {
                    ...s.player,
                    health: Math.max(20, s.player.health - 35),
                    sanity: Math.max(10, s.player.sanity - 30)
                  },
                  shelter: { ...s.shelter, barricadeIntegrity: Math.max(10, s.shelter.barricadeIntegrity - 30) }
                },
                log: 'Disaster! She reanimated at 4 AM inside ' + loc + ' and attacked before I could react.',
                outcomeTitle: 'Nightmare Turn',
                outcomeText: 'She had hidden a lethal bite under her scarf. You put her down with a hammer, but took injuries during the struggle.'
              };
            } else {
              return {
                state: {
                  ...s,
                  player: { ...s.player, sanity: Math.min(100, s.player.sanity + 10) },
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: 'She was genuinely starved and exhausted. She cried tears of relief inside ' + loc + '.',
                outcomeTitle: 'Gamble Paid Off',
                outcomeText: 'A warm meal stabilized her. She swore eternal loyalty to you.'
              };
            }
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
  const hasSora = state.campMembers.some(m => m.id === 'survivor_sora');

  if (hasShelterOrCamp && !hasSora) {
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

  return events;
}

export function getRandomSurvivalEvent(state: GameState): EventDilemma | null {
  const events = getSurvivalEvents(state);
  const filtered = events.filter(e => e.id !== state.activeDilemma?.id);
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Looting Encounter: Meet a survivor while looting a spot
export function getLootSpotSurvivorDilemma(state: GameState, spotName: string): EventDilemma | null {
  if (state.campMembers.length >= 3) return null;
  const loc = getCurrentLocationName(state);

  const candidates = [
    {
      id: 'survivor_liam',
      name: 'Liam Walker',
      gender: 'male' as const,
      age: 26,
      profession: 'Ex-Army Mechanic',
      bio: 'Disciplined and tough. Experienced in barricade defense and weapon maintenance.',
      role: 'guard' as const,
      health: 90,
      trust: 60
    },
    {
      id: 'survivor_elena',
      name: 'Elena Frost',
      gender: 'female' as const,
      age: 27,
      profession: 'Field Paramedic',
      bio: 'Calm under fire. Skilled in trauma dressing, wound treatment, and sterilization.',
      role: 'medic' as const,
      health: 85,
      trust: 65
    },
    {
      id: 'survivor_lucas',
      name: 'Lucas Reed',
      gender: 'male' as const,
      age: 24,
      profession: 'Carpenter & Roofer',
      bio: 'Practical builder with high physical stamina and fortification knowledge.',
      role: 'craftsman' as const,
      health: 88,
      trust: 60
    },
    {
      id: 'survivor_maya',
      name: 'Maya Lin',
      gender: 'female' as const,
      age: 25,
      profession: 'Locksmith & Scout',
      bio: 'Quiet and observant scavenger capable of bypassing door deadbolts silently.',
      role: 'scavenger' as const,
      health: 92,
      trust: 65
    }
  ];

  const candidate = candidates.find(c => !state.campMembers.some(m => m.id === c.id));
  if (!candidate) return null;

  return {
    id: 'loot_encounter_' + candidate.id + '_' + Date.now(),
    title: 'A Survivor in the Shadows!',
    category: 'discovery',
    dangerLevel: 'low',
    description: 'While searching ' + spotName + ' inside ' + loc + ', your flashlight catches a lone survivor crouching in the dark holding a makeshift blade. They freeze, then slowly lower the weapon seeing you: "Hold on... I am not here to fight. Just searching for food and clean water." It is ' + candidate.name + ' (' + candidate.profession + ').',
    choices: [
      {
        id: 'recruit_' + candidate.id,
        text: 'Lower your weapon, share clean water, and invite them to join your camp',
        consequenceSummary: 'Calms them down. They agree to join as a reliable companion.',
        execute: (s: GameState) => {
          const newMember: CampMember = {
            id: candidate.id,
            name: candidate.name,
            gender: candidate.gender,
            age: candidate.age,
            profession: candidate.profession,
            relation: 'Companion',
            bio: candidate.bio,
            health: candidate.health,
            trust: candidate.trust,
            daysTogether: 1,
            role: candidate.role,
            statusEffects: []
          };
          return {
            state: {
              ...s,
              campMembers: [...s.campMembers, newMember],
              isCampEstablished: true,
              stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
            },
            log: 'While searching ' + spotName + ', I met ' + candidate.name + '. I shared supplies and they joined my camp as an ally!',
            outcomeTitle: candidate.name + ' Joined Your Camp',
            outcomeText: candidate.name + ' sheathed their weapon and shook your hand. "Appreciate you not pulling the trigger. I will pull my weight." The Camp tab is unlocked!'
          };
        }
      },
      {
        id: 'trade_' + candidate.id,
        text: 'Keep a safe distance, trade spare food rations for scavenged components',
        consequenceSummary: 'Trades surplus food for useful mechanical parts and tools.',
        execute: (s: GameState) => {
          const tradeItems = [
            { id: 'duct_tape_scav', name: 'Roll of Heavy Duct Tape', category: 'tool' as const, quantity: 1, description: 'Reinforced adhesive repair tape.' },
            { id: 'nails_scav', name: 'Box of Framing Nails', category: 'resource' as const, quantity: 15, description: 'Galvanized nails for fortifications.' }
          ];
          let inv = [...s.inventory];
          for (const item of tradeItems) {
            const ex = inv.find(i => i.id === item.id);
            if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            else inv.push(item);
          }
          return {
            state: {
              ...s,
              inventory: inv,
              player: { ...s.player, sanity: Math.min(100, s.player.sanity + 10) }
            },
            log: 'I traded calmly with ' + candidate.name + ' at ' + spotName + '. Exchanged surplus supplies peacefully (+10 Sanity).',
            outcomeTitle: 'Peaceful Trade Concluded',
            outcomeText: 'You exchanged items without hostility. ' + candidate.name + ' nodded respectfully and moved down the hall.'
          };
        }
      },
      {
        id: 'dismiss_' + candidate.id,
        text: 'Keep your weapon aimed: "Keep moving. This building is occupied."',
        consequenceSummary: 'Avoids all risk. They back away quietly into the ruins.',
        execute: (s: GameState) => {
          return {
            state: { ...s },
            log: 'I ordered ' + candidate.name + ' to leave ' + spotName + '. They backed away with their hands raised.',
            outcomeTitle: 'Survivor Backed Off',
            outcomeText: 'Taking no chances, you held your ground until they retreated into the alley. Your perimeter remains secure.'
          };
        }
      }
    ]
  };
}

// Survivor Outpost Meeting Dilemma (St. Michael Church Sanctuary)
export function getSurvivorOutpostDilemma(state: GameState): EventDilemma {
  const isFemale = state.player.gender === 'female';
  const candidateName = isFemale ? 'Liam Walker' : 'Chloe Evans';
  const candidateId = isFemale ? 'survivor_liam' : 'survivor_chloe';
  const hasCandidate = state.campMembers.some(m => m.id === candidateId);

  return {
    id: 'outpost_church_visit_' + Date.now(),
    title: 'St. Michael Church Sanctuary',
    category: 'encounter',
    dangerLevel: 'low',
    description: 'You step through the reinforced oak doors of St. Michael Church. Warm candlelight flickers across stained glass. A group of survivors have built barricades around the altar. ' + candidateName + ' waves you over to the fellowship fire.',
    choices: [
      {
        id: 'recruit_church_ally',
        text: 'Discuss your camp defense plans with ' + candidateName + ' and invite them to team up',
        consequenceSummary: 'Gain a dependable survivor ally with guard skills.',
        execute: (s: GameState) => {
          if (!hasCandidate) {
            const member: CampMember = {
              id: candidateId,
              name: candidateName,
              gender: isFemale ? 'male' : 'female',
              age: isFemale ? 26 : 23,
              profession: isFemale ? 'Ex-Army Hunter' : 'Athletic Student & Builder',
              relation: 'Camp Member',
              bio: isFemale ? 'Rugged veteran. Brave, protective, and disciplined.' : 'Former collegiate runner. Energetic, alert, and dependable.',
              health: 95,
              trust: 70,
              daysTogether: 1,
              role: 'guard',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, member],
                isCampEstablished: true,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 20) },
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: 'I met ' + candidateName + ' at the Church Outpost. They agreed to team up and joined my camp as a guard!',
              outcomeTitle: candidateName + ' Joined Your Camp',
              outcomeText: 'By the sanctuary fire, you and ' + candidateName + ' discussed defense tactics. Convinced your group has a real survival plan, ' + candidateName + ' agreed to join your camp. (+20 Sanity)'
            };
          } else {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 20) }
              },
              log: 'I spent an evening resting by the fire at the Church Outpost, lifting my morale (+20 Sanity).',
              outcomeTitle: 'Peaceful Evening by the Fire',
              outcomeText: 'Warm food and friendly conversation restored your spirit (+20 Sanity).'
            };
          }
        }
      },
      {
        id: 'barter_church_goods',
        text: 'Barter with the outpost quartermaster for vital food and medical supplies',
        consequenceSummary: 'Trades spare gear for canned rations and clean water.',
        execute: (s: GameState) => {
          const tradeLoot = [
            { id: 'canned_peaches_outpost', name: 'Canned Peaches', category: 'food' as const, quantity: 2, description: 'Sweet canned fruit rations.' },
            { id: 'water_gallon_outpost', name: 'Purified Water Jug', category: 'water' as const, quantity: 2, description: 'Clean fresh drinking water.' }
          ];
          let inv = [...s.inventory];
          for (const item of tradeLoot) {
            const ex = inv.find(i => i.id === item.id);
            if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            else inv.push(item);
          }
          return {
            state: {
              ...s,
              inventory: inv
            },
            log: 'I bartered at the Church Outpost: Traded surplus items for 2 cans of peaches and 2 purified water jugs.',
            outcomeTitle: 'Fair Barter Concluded',
            outcomeText: 'The outpost quartermaster shook your hand and traded clean water and canned fruit. The community welcomes you back anytime.'
          };
        }
      }
    ]
  };
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
