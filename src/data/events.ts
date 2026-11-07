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
          log: 'You searched the area: Found 2 cans of beans, 2 bottles of water, and a kitchen knife.',
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
          log: 'You searched for first aid: Found sterile gauze, antiseptic, and clean water.',
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
          log: 'You scavenged for tools: Found a claw hammer, 3 wood planks, and duct tape.',
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
              log: 'From cover inside ' + loc + ', you ambushed both raiders before they could enter and seized their weapons.',
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
              log: 'You hid quietly behind cover inside ' + loc + ' until the armed men moved down the road.',
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
                log: 'You traded medical supplies through the door of ' + loc + ' for 4 military food rations.',
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
                log: 'The raiders fired a shotgun blast through the door of ' + loc + ' the moment you called out.',
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
                log: 'You took down both zombies quietly before they could fully crawl into ' + loc + '.',
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
                log: 'You took down both zombies inside ' + loc + ', but sustained a bleeding scratch on your arm.',
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
              log: 'Two loud gunshots echoed out of ' + loc + ', dropping both zombies instantly.',
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
              log: 'You slammed and bolted the inner door inside ' + loc + ', locking the zombies in the broken side room.',
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
                log: 'Under her wet jacket, you found fresh bite marks wrapped in cloth. You refused entry to keep ' + loc + ' safe.',
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
                log: 'You found no bites on her. Dr. Rebecca Young has joined you at ' + loc + '! The Camp tab is now open.',
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
              log: 'You slid a can of food outside the entrance of ' + loc + ' and told her to keep moving.',
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
                log: 'Disaster! She reanimated at 4 AM inside ' + loc + ' and attacked before you could react.',
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
                log: 'She was genuinely just starved and exhausted. She cried tears of relief inside ' + loc + '.',
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
              log: 'You sneaked across to the delivery van, grabbed 3 cans of soup and 3 bottles of water, and returned to ' + loc + ' safely.',
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
              log: 'You watched the street from inside ' + loc + ' and decided not to take any risks.',
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
              log: 'You fed the stray dog and let it curl up inside ' + loc + '. It is now a loyal companion that alerts you when danger approaches!',
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
              log: 'You tapped on the window of ' + loc + ' until the dog quietly trotted away.',
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
              log: 'You boiled the rainwater inside ' + loc + ' until all bacteria were destroyed.',
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
              log: 'You emptied the contaminated rainwater tank at ' + loc + '.',
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
              relationshipStage: 'friend',
              bio: 'Soft-spoken greenhouse botanist. Knows how to cultivate vegetables and medicinal herbs.',
              health: 85,
              trust: 65,
              affection: 35,
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
              log: 'You let Sora Takahashi inside ' + loc + ' just before the street horde arrived. He joined your camp as a builder and gardener!',
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
              log: 'You refused entry to the traveler knocking on the door of ' + loc + '.',
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

// Looting Encounter: Meet a survivor while looting a spot if you have no camp
export function getLootSpotSurvivorDilemma(state: GameState, spotName: string): EventDilemma | null {
  if (state.campMembers.length >= 2) return null;
  const loc = getCurrentLocationName(state);
  const isFemale = state.player.gender === 'female';

  // FEMALE PLAYER: Meets handsome male romance candidates (Liam Walker or Lucas Reed)
  if (isFemale) {
    const hasLiam = state.campMembers.some(m => m.id === 'survivor_liam');
    const hasLucas = state.campMembers.some(m => m.id === 'survivor_lucas');

    if (!hasLiam) {
      return {
        id: 'loot_liam_' + Date.now(),
        title: 'A Survivor in the Shadows!',
        category: 'discovery',
        dangerLevel: 'low',
        description: 'While searching ' + spotName + ' inside ' + loc + ', your flashlight catches a rugged young man in a worn canvas coat holding a hunting knife. He lowers the blade, breathing heavily: "Easy there. I am not looking for trouble... just searching for food and water."',
        choices: [
          {
            id: 'friendly_liam',
            text: 'Lower your weapon, offer clean water, and tell him you are friendly',
            consequenceSummary: 'Calms him down immediately. He joins as a strong guardian.',
            execute: (s: GameState) => {
              const liam: CampMember = {
                id: 'survivor_liam',
                name: 'Liam Walker',
                gender: 'male',
                age: 26,
                profession: 'Ex-Army Mechanic',
                relation: 'Friend 😊',
                relationshipStage: 'friend',
                bio: 'Rugged, protective, and skilled with firearms and melee combat.',
                health: 90,
                trust: 60,
                affection: 35,
                daysTogether: 1,
                role: 'guard',
                statusEffects: []
              };
              return {
                state: {
                  ...s,
                  campMembers: [...s.campMembers, liam],
                  isCampEstablished: true,
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: 'While searching ' + spotName + ', you found Liam Walker in the shadows. You shared water and he joined your camp as a guardian and friend!',
                outcomeTitle: 'Liam Joined Your Camp',
                outcomeText: 'Liam sheathed his knife and shook your hand with a firm, protective grip. "Glad to meet someone alive out here. I will watch your back." The Camp tab is unlocked!'
              };
            }
          },
          {
            id: 'romantic_liam',
            text: 'Smile warmly: "I was looking for supplies, but finding a handsome survivor is way better. You are safe with me."',
            consequenceSummary: 'Charming romantic flirt! Sparks immediate chemistry (Romance track ❤️).',
            execute: (s: GameState) => {
              const liam: CampMember = {
                id: 'survivor_liam',
                name: 'Liam Walker',
                gender: 'male',
                age: 26,
                profession: 'Ex-Army Mechanic',
                relation: 'Companion (Spark ❤️)',
                relationshipStage: 'friend',
                bio: 'Rugged veteran. Charmed by your confidence and humor.',
                health: 90,
                trust: 65,
                affection: 55,
                daysTogether: 1,
                role: 'guard',
                statusEffects: []
              };
              return {
                state: {
                  ...s,
                  campMembers: [...s.campMembers, liam],
                  isCampEstablished: true,
                  player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) },
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: '❤️ You found Liam Walker hiding near ' + spotName + '. Your flirty charm made him smile, sparking an instant romantic bond! He joined your camp.',
                outcomeTitle: 'A Spark in the Ruins ❤️',
                outcomeText: 'Liam paused, gave a low chuckle, and scratched his jaw with a crooked grin. "Did not expect that in a zombie apocalypse. Guess I got lucky today." An undeniable romantic bond has formed!'
              };
            }
          },
          {
            id: 'rob_liam',
            text: 'Demand he drop his knife and leave at gunpoint',
            consequenceSummary: 'Drives him away, turning him into a dangerous enemy.',
            execute: (s: GameState) => {
              return {
                state: {
                  ...s,
                  player: { ...s.player, sanity: Math.max(10, s.player.sanity - 10) }
                },
                log: 'You drove Liam Walker away from ' + spotName + ' at gunpoint. He backed out with cold, vengeful eyes.',
                outcomeTitle: 'Survivor Driven Away — Enemy Made',
                outcomeText: 'Liam cursed you under his breath and vanished into the fog. You made a formidable enemy out in the city.'
              };
            }
          }
        ]
      };
    }

    if (!hasLucas) {
      return {
        id: 'loot_lucas_' + Date.now(),
        title: 'An Electrician with a Toolbag!',
        category: 'discovery',
        dangerLevel: 'low',
        description: 'While inspecting ' + spotName + ', a witty young man in work boots with an electrician bag turns around with a grin: "Looking for batteries too? Let us not kill each other over copper wire."',
        choices: [
          {
            id: 'team_up_lucas',
            text: 'Laugh and offer to team up: "Two heads are better than one."',
            consequenceSummary: 'Recruits a smart builder and electrician companion.',
            execute: (s: GameState) => {
              const lucas: CampMember = {
                id: 'survivor_lucas',
                name: 'Lucas Reed',
                gender: 'male',
                age: 25,
                profession: 'Electrician & Builder',
                relation: 'Friend 😊',
                relationshipStage: 'friend',
                bio: 'Clever, resourceful, and great with power grids and tools.',
                health: 85,
                trust: 60,
                affection: 30,
                daysTogether: 1,
                role: 'craftsman',
                statusEffects: []
              };
              return {
                state: {
                  ...s,
                  campMembers: [...s.campMembers, lucas],
                  isCampEstablished: true,
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: 'You teamed up with Lucas Reed at ' + spotName + '. He joined your camp as a builder and friend!',
                outcomeTitle: 'Lucas Joined Your Camp',
                outcomeText: 'Lucas smiled and packed his wire cutters. "Sounds like a plan. Let us get back to your base." The Camp tab is unlocked!'
              };
            }
          },
          {
            id: 'flirt_lucas',
            text: 'Grin: "Cute smile and you know how to wire things? You are definitely coming with me."',
            consequenceSummary: 'Sparks immediate playful romantic chemistry (Romance track ❤️).',
            execute: (s: GameState) => {
              const lucas: CampMember = {
                id: 'survivor_lucas',
                name: 'Lucas Reed',
                gender: 'male',
                age: 25,
                profession: 'Electrician & Builder',
                relation: 'Companion (Flirty ❤️)',
                relationshipStage: 'friend',
                bio: 'Smart builder. Smitten with your wit and charm.',
                health: 85,
                trust: 65,
                affection: 55,
                daysTogether: 1,
                role: 'craftsman',
                statusEffects: []
              };
              return {
                state: {
                  ...s,
                  campMembers: [...s.campMembers, lucas],
                  isCampEstablished: true,
                  player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) },
                  stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
                },
                log: '❤️ You flirted with Lucas Reed while searching ' + spotName + '. He winked and joined your camp! (Romance track started)',
                outcomeTitle: 'Sparks Over Copper Wire ❤️',
                outcomeText: 'Lucas chuckled, winked, and bowed theatrically. "Lead the way, boss. I am all yours." An instant romantic connection has formed!'
              };
            }
          }
        ]
      };
    }

    return null;
  }

  // MALE PLAYER: Meets beautiful female romance candidates (Elena Frost or Maya Lin)
  const hasElena = state.campMembers.some(m => m.id === 'survivor_elena');
  const hasMaya = state.campMembers.some(m => m.id === 'survivor_maya');

  if (!hasElena) {
    return {
      id: 'loot_elena_' + Date.now(),
      title: 'Someone is Hiding Here!',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'While searching ' + spotName + ' inside ' + loc + ', your flashlight illuminates a figure curled behind a cabinet. A young woman in a denim jacket gasps: "Please do not hurt me! I thought this place was empty!"',
      choices: [
        {
          id: 'friendly_elena',
          text: 'Lower your weapon, offer a friendly hand, and tell her she is safe',
          consequenceSummary: 'Calms her down immediately. She joins as a loyal companion.',
          execute: (s: GameState) => {
            const elena: CampMember = {
              id: 'survivor_elena',
              name: 'Elena Frost',
              gender: 'female',
              age: 25,
              profession: 'Clinic Nurse',
              relation: 'Friend 😊',
              relationshipStage: 'friend',
              bio: 'Former nurse. Gentle, observant, and skilled with medical bandages.',
              health: 80,
              trust: 60,
              affection: 35,
              daysTogether: 1,
              role: 'medic',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, elena],
                isCampEstablished: true,
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: 'While searching ' + spotName + ', you found Elena Frost hiding in the dark. You calmed her down and she joined your camp as a friend and medic!',
              outcomeTitle: 'New Companion: Elena Joined',
              outcomeText: 'Elena lowered her hands and let out a trembling breath of relief. She joined your camp as a medic. The Camp tab is now unlocked!'
            };
          }
        },
        {
          id: 'romantic_elena',
          text: 'Smile warmly: "I was looking for supplies, but finding you is way better. You are safe now."',
          consequenceSummary: 'Breaks the tension with charm. Unlocks an immediate romantic spark!',
          execute: (s: GameState) => {
            const elena: CampMember = {
              id: 'survivor_elena',
              name: 'Elena Frost',
              gender: 'female',
              age: 25,
              profession: 'Clinic Nurse',
              relation: 'Companion (Spark ❤️)',
              relationshipStage: 'friend',
              bio: 'Former nurse. Felt an instant spark of comfort and chemistry with you.',
              health: 85,
              trust: 65,
              affection: 55,
              daysTogether: 1,
              role: 'medic',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, elena],
                isCampEstablished: true,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) },
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: '❤️ You found Elena Frost hiding behind ' + spotName + '. Your warm charm made her blush, sparking an immediate bond! She joined your camp.',
              outcomeTitle: 'A Spark in the Ruins ❤️',
              outcomeText: 'Elena blushed softly through the dust on her cheeks and took your hand. An instant romantic spark formed between you two!'
            };
          }
        },
        {
          id: 'rob_elena',
          text: 'Order her to drop her supplies and leave: "Leave your things and walk out."',
          consequenceSummary: 'Takes her medical supplies, but turns her into an enemy.',
          execute: (s: GameState) => {
            const stolen = [
              { id: 'gauze_stolen', name: 'Roll of Sterile Gauze', category: 'medical' as const, quantity: 2, description: 'Medical bandage.' },
              { id: 'water_stolen', name: 'Fresh Bottled Water', category: 'water' as const, quantity: 1, description: 'Clean water.' }
            ];
            let inv = [...s.inventory];
            for (const item of stolen) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
              else inv.push(item);
            }
            return {
              state: {
                ...s,
                inventory: inv,
                player: { ...s.player, sanity: Math.max(10, s.player.sanity - 10) }
              },
              log: 'You threatened the survivor hiding in ' + spotName + ' and took her supplies. She fled into the streets with eyes full of hatred.',
              outcomeTitle: 'Supplies Stolen — Enemy Made',
              outcomeText: 'She dropped her medical gauze and water on the floor, cursed you, and vanished into the ruins. You made a bitter enemy in the city.'
            };
          }
        }
      ]
    };
  }

  if (!hasMaya) {
    return {
      id: 'loot_maya_' + Date.now(),
      title: 'Lockpicker Caught in the Act!',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'While searching ' + spotName + ', you stumble on a feisty young woman with a prybar trying to pop the lock on a supply chest. She jumps back: "Back off! I found this chest first!"',
      choices: [
        {
          id: 'split_maya',
          text: 'Laugh and offer to split whatever is inside: "Let us crack it together and split the haul."',
          consequenceSummary: 'Respects her claim and turns her into a loyal scavenger companion.',
          execute: (s: GameState) => {
            const maya: CampMember = {
              id: 'survivor_maya',
              name: 'Maya Lin',
              gender: 'female',
              age: 24,
              profession: 'Locksmith & Scavenger',
              relation: 'Friend 😊',
              relationshipStage: 'friend',
              bio: 'Quick with a pickset, clever, and sharp-tongued. Excellent scavenger.',
              health: 90,
              trust: 60,
              affection: 30,
              daysTogether: 1,
              role: 'scavenger',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, maya],
                isCampEstablished: true,
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: 'You teamed up with Maya Lin at ' + spotName + ' and split the supplies. She joined your camp as a scavenger!',
              outcomeTitle: 'Maya Joined Your Camp',
              outcomeText: 'Maya grinned, popped the lock with a satisfying click, and tossed you your share. She joined your camp! The Camp tab is unlocked.'
            };
          }
        },
        {
          id: 'flirt_maya',
          text: 'Grin playfully: "You are pretty good with that prybar. Want to team up with someone who appreciates talent?"',
          consequenceSummary: 'Playful banter that sparks mutual chemistry (Romance track ❤️).',
          execute: (s: GameState) => {
            const maya: CampMember = {
              id: 'survivor_maya',
              name: 'Maya Lin',
              gender: 'female',
              age: 24,
              profession: 'Locksmith & Scavenger',
              relation: 'Companion (Flirty ❤️)',
              relationshipStage: 'friend',
              bio: 'Spunky scavenger. Loves your banter and quick wit.',
              health: 90,
              trust: 60,
              affection: 50,
              daysTogether: 1,
              role: 'scavenger',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, maya],
                isCampEstablished: true,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) },
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: '❤️ You flirted with Maya Lin while searching ' + spotName + '. She smirked and teamed up with you! (Romance track started)',
              outcomeTitle: 'Sparks Over a Prybar ❤️',
              outcomeText: 'Maya lowered the prybar, winked, and twirled a lockpick between her fingers. "Alright, let us see how good you are at keeping me alive." The Camp tab is unlocked!'
            };
          }
        },
        {
          id: 'threaten_maya',
          text: 'Raise your weapon: "Step away from that chest right now."',
          consequenceSummary: 'Drives her away, turning her into a bitter rival.',
          execute: (s: GameState) => {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.max(10, s.player.sanity - 5) }
              },
              log: 'You chased Maya Lin away from ' + spotName + ' at gunpoint. She bolted out the back door, cursing your name.',
              outcomeTitle: 'Scavenger Driven Away',
              outcomeText: 'She cursed you out and vanished down the fire escape. You claimed the spot, but earned her wrath.'
            };
          }
        }
      ]
    };
  }

  return null;
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
    description: 'You step through the reinforced oak doors of St. Michael Church. Warm candlelight flickers across stained glass. A group of seven survivors have built barricades around the altar. A friendly survivor named ' + candidateName + ' waves you over to the fellowship fire.',
    choices: [
      {
        id: 'bond_by_church_fire',
        text: 'Sit by the fire with ' + candidateName + ', share a meal, and talk about life before the dead walked',
        consequenceSummary: 'Deep emotional connection. They offer to join your personal shelter!',
        execute: (s: GameState) => {
          if (!hasCandidate) {
            const member: CampMember = {
              id: candidateId,
              name: candidateName,
              gender: isFemale ? 'male' : 'female',
              age: isFemale ? 26 : 23,
              profession: isFemale ? 'Ex-Army Hunter' : 'Athletic Student & Builder',
              relation: 'Companion (Spark ❤️)',
              relationshipStage: 'friend',
              bio: isFemale ? 'Rugged veteran. Brave, protective, and deeply loyal.' : 'Former collegiate runner. Energetic, brave, and deeply loyal.',
              health: 95,
              trust: 70,
              affection: 55,
              daysTogether: 1,
              role: 'guard',
              statusEffects: []
            };
            return {
              state: {
                ...s,
                campMembers: [...s.campMembers, member],
                isCampEstablished: true,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 25) },
                stats: { ...s.stats, peopleSaved: s.stats.peopleSaved + 1 }
              },
              log: '❤️ You visited the Church Outpost and bonded by the fire with ' + candidateName + '. They packed their backpack and decided to join your camp!',
              outcomeTitle: candidateName + ' Joined Your Journey ❤️',
              outcomeText: 'Sitting by the fire, you and ' + candidateName + ' laughed and shared your memories. Feeling an undeniable spark, ' + candidateName + ' decided to leave the crowded church and join your camp as a guardian and companion! (+25 Sanity)'
            };
          } else {
            return {
              state: {
                ...s,
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 20) }
              },
              log: 'You spent an evening resting by the fire at the Church Outpost, lifting your morale (+20 Sanity).',
              outcomeTitle: 'Peaceful Evening by the Fire',
              outcomeText: 'Warm food, gentle acoustic guitar chords, and friendly conversation restored your spirit.'
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
            log: 'You bartered at the Church Outpost: Traded surplus items for 2 cans of peaches and 2 purified water jugs.',
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
