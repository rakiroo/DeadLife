import { EventDilemma, GameState } from '../types/game';

export function getRandomMicroDilemma(state: GameState): EventDilemma | null {
  const dilemmas: EventDilemma[] = [
    // 1. Revolving Door Officer (Zombie + Loot)
    {
      id: 'micro_revolving_cop_' + Date.now(),
      title: 'The Trapped Officer',
      category: 'hazard',
      dangerLevel: 'medium',
      description: 'An infected in a torn police uniform is wedged tight inside a glass revolving door at a clinic. An unbuckled tactical holster sits on its hip with a 9mm service pistol in plain sight. It snarls violently, clawing the glass.',
      choices: [
        {
          id: 'snatch_pistol_jam',
          text: 'Jam a steel bar into the door to pin its arms, then snatch the pistol',
          consequenceSummary: 'Risk of bite scratch; chance to recover firearm and 9mm ammunition.',
          execute: (s: GameState) => {
            const hasGoodCombat = s.player.combatSkill >= 5 || s.player.stealthSkill >= 5;
            if (hasGoodCombat || Math.random() < 0.65) {
              const weapon = { id: 'police_pistol_found', name: 'Service Pistol (9mm)', category: 'weapon' as const, quantity: 1, description: 'Semi-automatic handgun.' };
              const ammo = { id: 'ammo_9mm_loot', name: '9mm Magazine (15 rounds)', category: 'resource' as const, quantity: 15, description: 'Pistol ammunition.' };
              let inv = [...s.inventory];
              inv.push(weapon, ammo);
              return {
                state: { ...s, inventory: inv, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
                log: 'I jammed the revolving door, disarmed the trapped officer, and secured a 9mm service pistol with 15 rounds.',
                outcomeTitle: 'Weapon Secured',
                outcomeText: 'The steel bar pinned the walker\'s torso against the frame. I yanked the pistol free cleanly.'
              };
            } else {
              return {
                state: { ...s, player: { ...s.player, health: Math.max(10, s.player.health - 12) } },
                log: 'The walker\'s claw scraped my forearm as I lunged for the holster (-12% HP). I had to pull back empty-handed.',
                outcomeTitle: 'Zombie Claw Wound',
                outcomeText: 'Its rotting nails raked across my arm. I scrambled backward, leaving the weapon behind.'
              };
            }
          }
        },
        {
          id: 'leave_cop_door',
          text: 'Leave the infected officer trapped and move past quietly',
          consequenceSummary: 'Avoids noise and risk (+5 Sanity).',
          execute: (s: GameState) => {
            return {
              state: { ...s, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 5) } },
              log: 'I let the trapped zombie thrash behind the glass and slipped past quietly (+5 Sanity).',
              outcomeTitle: 'Danger Avoided',
              outcomeText: 'A firearm is useless if you get bitten reaching for it. I kept moving in the shadows.'
            };
          }
        }
      ]
    },

    // 2. Crawler in the Aisle (Sudden Zombie Grapple)
    {
      id: 'micro_crawler_grab_' + Date.now(),
      title: 'A Snapping Jaw in the Aisles',
      category: 'hazard',
      dangerLevel: 'medium',
      description: 'While stepping over fallen shelving in an abandoned mini-mart, cold, rotting fingers seize my ankle with iron strength! A legless crawler is snapping its yellowed teeth inches from my boot.',
      choices: [
        {
          id: 'stomp_crawler_head',
          text: 'Stomp its skull with my heavy boot heel before it bites through',
          consequenceSummary: 'Uses physical fitness to crush the infected instantly.',
          execute: (s: GameState) => {
            const success = s.player.fitnessSkill >= 4 || s.player.combatSkill >= 4 || Math.random() < 0.75;
            if (success) {
              return {
                state: { ...s, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
                log: 'I drove my boot heel down onto the crawler\'s head with full force, neutralizing it on the spot.',
                outcomeTitle: 'Crawler Crushed',
                outcomeText: 'The skull caved in with a dull crunch. The fingers went limp around my ankle.'
              };
            } else {
              return {
                state: { ...s, player: { ...s.player, health: Math.max(10, s.player.health - 10) } },
                log: 'The crawler tore through my pant leg before I kicked it away, grazing my calf (-10% HP).',
                outcomeTitle: 'Flesh Graze',
                outcomeText: 'Its teeth scraped across my skin before I kicked free. I retreated into the aisle.'
              };
            }
          }
        },
        {
          id: 'slice_wrist_tendons',
          text: 'Drive my combat blade into its wrist joint to sever the grip',
          consequenceSummary: 'Quick blade action; quiet and precise.',
          execute: (s: GameState) => {
            return {
              state: { ...s, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
              log: 'I drove my blade cleanly through the crawler\'s wrist, breaking the grip, and finished it off quietly.',
              outcomeTitle: 'Tactical Takedown',
              outcomeText: 'The severed tendons released my boot. A quick second strike silenced it permanently.'
            };
          }
        }
      ]
    },

    // 3. Firefighter Axe Stuck in Skull
    {
      id: 'micro_fire_axe_' + Date.now(),
      title: 'An Axe Buried in a Skull',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'In an open courtyard, a dead infected is pinned to a concrete bench with a heavy red firefighter\'s axe lodged deep in its skull. Two wandering walkers twenty paces away hear my boots on the gravel.',
      choices: [
        {
          id: 'wrench_axe_free',
          text: 'Plant my boot on the skull and wrench the heavy axe free',
          consequenceSummary: 'Fitness/Strength check to gain a deadly demolition axe; risk of getting cornered.',
          execute: (s: GameState) => {
            const success = s.player.fitnessSkill >= 5 || s.player.craftingSkill >= 5 || Math.random() < 0.7;
            if (success) {
              const axe = { id: 'fireman_axe_loot', name: 'Forged Fireman Axe', category: 'weapon' as const, quantity: 1, description: 'Heavy demolition axe.' };
              let inv = [...s.inventory];
              inv.push(axe);
              return {
                state: { ...s, inventory: inv },
                log: 'I planted my boot on the corpse and yanked the firefighter axe free with a wet crack! Claimed a devastating weapon.',
                outcomeTitle: 'Axe Recovered',
                outcomeText: 'The steel blade broke free of bone. I swung it into cover just as the walkers reached the bench.'
              };
            } else {
              return {
                state: { ...s, player: { ...s.player, health: Math.max(10, s.player.health - 8) } },
                log: 'The axe was wedged too deep in the bone! The walkers closed in, forcing me to flee empty-handed (-8% HP).',
                outcomeTitle: 'Axe Stuck',
                outcomeText: 'The blade refused to budge. I had to sprint over the garden wall as jaws snapped at my heels.'
              };
            }
          }
        },
        {
          id: 'leave_axe_retreat',
          text: 'Leave the axe and slip through the gate before the walkers spot me',
          consequenceSummary: 'Avoids combat and noise.',
          execute: (s: GameState) => {
            return {
              state: { ...s },
              log: 'I slipped out through the iron garden gate, leaving the axe and walkers behind.',
              outcomeTitle: 'Quiet Exit',
              outcomeText: 'I chose stealth over greed. The walkers shuffled blindly toward the empty bench.'
            };
          }
        }
      ]
    },

    // 4. Bloated Walker on the Stairs
    {
      id: 'micro_bloated_stumble_' + Date.now(),
      title: 'A Bloated Corpse on the Stairs',
      category: 'hazard',
      dangerLevel: 'medium',
      description: 'A grotesquely swollen, bile-filled infected is wobbling at the top of a narrow stairwell landing. If it ruptures or bursts, toxic fluids and rot will coat the narrow corridor.',
      choices: [
        {
          id: 'shove_down_shaft',
          text: 'Use a long metal conduit pipe to shove it backward down the stairwell shaft',
          consequenceSummary: 'Clever distance push; safely neutralizes the hazard.',
          execute: (s: GameState) => {
            return {
              state: { ...s, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
              log: 'I used a long conduit pipe to push the bloated infected over the railing. It exploded with a wet pop three floors below.',
              outcomeTitle: 'Biohazard Cleared',
              outcomeText: 'The pipe kept me safe from the blast. The toxic splatter sprayed far down in the basement.'
            };
          }
        },
        {
          id: 'find_alternate_route',
          text: 'Back down the stairs carefully and find another way around',
          consequenceSummary: 'Avoids exposure to infection (+5 Sanity).',
          execute: (s: GameState) => {
            return {
              state: { ...s, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 5) } },
              log: 'I backed down the staircase in silence, taking a longer detour to avoid the swollen infected (+5 Sanity).',
              outcomeTitle: 'Smart Detour',
              outcomeText: 'Never gamble with a rupturing infected in tight quarters. I found a safe exterior fire escape.'
            };
          }
        }
      ]
    },

    // 5. Padlocked Storage Locker with Growls
    {
      id: 'micro_padlocked_locker_' + Date.now(),
      title: 'The Padlocked Storage Locker',
      category: 'hazard',
      dangerLevel: 'high',
      description: 'Inside an employee breakroom, violent thuds rattle against a padlocked steel storage locker. Someone scrawled on the door: "Locked turned coworker inside. Medical antibiotics in top drawer."',
      choices: [
        {
          id: 'breach_locker',
          text: 'Break the padlock with heavy tools, step back, and neutralize the infected',
          consequenceSummary: 'Visceral close-quarters combat; rewards medical antibiotics.',
          execute: (s: GameState) => {
            const hasCombat = s.player.combatSkill >= 5 || s.player.fitnessSkill >= 5;
            const meds = [
              { id: 'antibiotics_locker', name: 'Amoxicillin Antibiotics (4)', category: 'medical' as const, quantity: 4, description: 'Medical antibiotics.' },
              { id: 'sterile_gauze_locker', name: 'Compressed Sterile Gauze', category: 'medical' as const, quantity: 2, description: 'Pressure dressing.' }
            ];
            let inv = [...s.inventory];
            for (const item of meds) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) ex.quantity += item.quantity;
              else inv.push(item);
            }

            if (hasCombat || Math.random() < 0.6) {
              return {
                state: { ...s, inventory: inv, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
                log: 'I snapped the locker padlock, sidestepped the lunging infected, and dropped it with a skull strike. Secured 4 antibiotics and gauze!',
                outcomeTitle: 'Locker Cleared',
                outcomeText: 'The turned worker crashed out snarling. My counterstrike was swift and lethal. The medicine drawer was full!'
              };
            } else {
              return {
                state: { ...s, inventory: inv, player: { ...s.player, health: Math.max(10, s.player.health - 15) }, stats: { ...s.stats, zombiesEliminated: s.stats.zombiesEliminated + 1 } },
                log: 'The infected tackled me to the tile floor as the door burst open (-15% HP)! I fought it off and claimed the antibiotics.',
                outcomeTitle: 'Desperate Struggle',
                outcomeText: 'We wrestled on the bloody tiles. I slammed its head into the doorframe and took the life-saving antibiotics.'
              };
            }
          }
        },
        {
          id: 'leave_locker_sealed',
          text: 'Leave the locker locked; no medicine is worth a close-quarters tackle',
          consequenceSummary: 'Avoids combat injury.',
          execute: (s: GameState) => {
            return {
              state: { ...s },
              log: 'I left the padlocked locker undisturbed. The growls faded into muffled whimpers.',
              outcomeTitle: 'Locker Left Sealed',
              outcomeText: 'Some risks are too high when fighting alone. I kept my health intact.'
            };
          }
        }
      ]
    },

    // 6. Rusted Lockbox in Vent
    {
      id: 'micro_lockbox_' + Date.now(),
      title: 'A Rusted Lockbox in the Vent',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'While checking an overhead air duct, my flashlight caught a heavy steel lockbox wedged into the sheet metal. Faint scratching comes from inside, and a rusted padlock holds the latch shut.',
      choices: [
        {
          id: 'pry_lockbox',
          text: 'Pry the lock open with heavy leverage',
          consequenceSummary: 'Chance to recover preserved emergency supplies.',
          execute: (s: GameState) => {
            const loot = [
              { id: 'ammo_9mm_box', name: '9mm Rounds (12)', category: 'resource' as const, quantity: 12, description: 'Handgun ammunition.' },
              { id: 'antiseptic_tin', name: 'Antiseptic Salve', category: 'medical' as const, quantity: 1, description: 'Topical wound antiseptic.' }
            ];
            let inv = [...s.inventory];
            for (const item of loot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) ex.quantity += item.quantity;
              else inv.push(item);
            }
            return {
              state: { ...s, inventory: inv },
              log: 'I pried the steel lockbox open. Inside I recovered 12 rounds of 9mm ammunition and antiseptic salve.',
              outcomeTitle: 'Lockbox Cracked',
              outcomeText: 'The rusted latch snapped cleanly. Inside was a stash of pistol ammo and fresh antiseptic ointment.'
            };
          }
        },
        {
          id: 'ignore_lockbox',
          text: 'Leave it undisturbed and screw the vent cover back into place',
          consequenceSummary: 'Avoids noise and injury (+5 Sanity).',
          execute: (s: GameState) => {
            return {
              state: { ...s, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 5) } },
              log: 'I chose not to risk opening the suspicious vent box. Kept my surroundings calm and secure (+5 Sanity).',
              outcomeTitle: 'Caution Maintained',
              outcomeText: 'I secured the vent cover and kept my focus on basic survival. Caution keeps survivors alive.'
            };
          }
        }
      ]
    },

    // 7. Whispers at the Mail Slot
    {
      id: 'micro_mail_slot_' + Date.now(),
      title: 'Whispers at the Mail Slot',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'A muffled voice whispered through the door mail slot: "Hey... I am alone and desperate. I have four shotgun shells. I will trade them if you slide out half a bottle of drinking water."',
      choices: [
        {
          id: 'trade_through_slot',
          text: 'Slide a bottle of water through the mail slot',
          consequenceSummary: 'Trades 1 water bottle for 4 shotgun shells.',
          execute: (s: GameState) => {
            const water = s.inventory.find(i => i.category === 'water' && i.quantity > 0);
            if (water) {
              const updatedInv = s.inventory.map(i => i === water ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
              const shells = { id: 'shotgun_shells_trade', name: '12-Gauge Shells (4)', category: 'resource' as const, quantity: 4, description: 'Heavy shotgun ammunition.' };
              const ex = updatedInv.find(i => i.id === shells.id);
              if (ex) ex.quantity += 4;
              else updatedInv.push(shells);

              return {
                state: { ...s, inventory: updatedInv, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 8) } },
                log: 'I traded clean water through the mail slot for 4 shotgun shells. The stranger thanked me and hurried away.',
                outcomeTitle: 'Honest Trade Completed',
                outcomeText: 'Cold brass shells slid through the mail slot into my hand. A rare honest exchange in a ruined world (+8 Sanity).'
              };
            } else {
              return {
                state: { ...s },
                log: 'I had no water to spare. The stranger waited two minutes in silence, then shuffled away down the street.',
                outcomeTitle: 'No Supplies to Trade',
                outcomeText: 'I could hear the stranger sigh through the door before footsteps retreated into the drizzle.'
              };
            }
          }
        },
        {
          id: 'stay_silent_slot',
          text: 'Stay completely silent behind the door until the footsteps fade away',
          consequenceSummary: 'Never reveal your presence to strangers.',
          execute: (s: GameState) => {
            return {
              state: { ...s },
              log: 'I kept motionless in the dark until the stranger gave up and left my perimeter secure.',
              outcomeTitle: 'Silence Maintained',
              outcomeText: 'I gave no sign that anyone was alive inside. The street returned to silence.'
            };
          }
        }
      ]
    },

    // 8. Smoking Campfire in the Alley
    {
      id: 'micro_campfire_' + Date.now(),
      title: 'A Smoking Campfire in the Alley',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'Down the narrow alley, gray woodsmoke rose into the air. Someone recently left a small campfire burning with a half-roasted rabbit on a spit. The embers are still glowing orange.',
      choices: [
        {
          id: 'snatch_roast_meat',
          text: 'Dart out, snatch the roasted meat, and retreat immediately',
          consequenceSummary: 'Gains 2 hearty food rations; risk of ambushing scavengers.',
          execute: (s: GameState) => {
            const isAmbushed = Math.random() < 0.25;
            if (!isAmbushed) {
              const meat = { id: 'roasted_game', name: 'Charred Roast Meat', category: 'food' as const, quantity: 2, description: 'Freshly cooked protein ration.' };
              let inv = [...s.inventory];
              const ex = inv.find(i => i.id === meat.id);
              if (ex) ex.quantity += 2;
              else inv.push(meat);

              return {
                state: { ...s, inventory: inv, player: { ...s.player, health: Math.min(100, s.player.health + 20) } },
                log: 'I dashed into the alley, snatched the roasted game from the fire, and slipped away undetected (+30 Hunger).',
                outcomeTitle: 'Clean Theft',
                outcomeText: 'Hot cooked meat filled my pack. Whoever built the fire had not returned yet.'
              };
            } else {
              return {
                state: { ...s, player: { ...s.player, health: Math.max(10, s.player.health - 12), sanity: Math.max(10, s.player.sanity - 10) } },
                log: 'A stone struck my shoulder as an angry scavenger yelled from a fire escape! I scrambled back inside injured (-12% HP).',
                outcomeTitle: 'Spotted by Camp Owner',
                outcomeText: 'A scavenger shouted and hurled debris from above. I dodged into cover, bruising my ribs.'
              };
            }
          }
        },
        {
          id: 'watch_from_cover',
          text: 'Observe the alleyway from concealment without touching the food',
          consequenceSummary: 'Learn scavenger patrol habits safely (+10 Sanity).',
          execute: (s: GameState) => {
            return {
              state: { ...s, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 10) } },
              log: 'I monitored the alleyway from shadows until two armed scavengers returned to their meal. I noted their patrol route (+10 Sanity).',
              outcomeTitle: 'Valuable Reconnaissance',
              outcomeText: 'Patience paid off. I mapped their patrol timing without exposing myself to gunfire.'
            };
          }
        }
      ]
    }
  ];


  // 10. Partner Gift Event (Autonomous Keepsake from Beloved Companion)
  const partnerName = state.player.spouseName || state.player.datingTargetName;
  const partner = partnerName ? state.campMembers.find(m => m.name === partnerName || m.id === state.player.spouseId || m.id === state.player.datingTargetId) : undefined;
  if (partner) {
    dilemmas.push({
      id: 'dilemma_partner_gift_' + Date.now(),
      title: 'A Gift from ' + partner.name,
      category: 'camp_drama',
      dangerLevel: 'low',
      description: partner.name + ' meets you by the sanctuary watchtower at sunset holding a wrapped cloth parcel: "I found this while sorting through the old depot lockers today. It reminded me of you, and why we fight to survive every single day. I want you to have it."',
      choices: [
        {
          id: 'accept_partner_gift',
          text: 'Accept the keepsake with a tender embrace (+15 Sanity, +10 Morale)',
          consequenceSummary: 'Adds a cherished personal gift to your Equipment Locker that can be equipped or consecrated into a Family Heirloom.',
          execute: (s: GameState) => {
            const giftList = [
              { id: 'gift_blade_' + Date.now(), name: partner.name + "'s Custom Trench Knife", category: 'weapon' as const, quantity: 1, origin: 'partner_gift' as const, giftedBy: partner.name, description: 'Hand-sharpened trench blade presented by your beloved ' + partner.name + ' as a pledge of devotion.' },
              { id: 'gift_ring_' + Date.now(), name: partner.name + "'s Engraved Silver Band", category: 'tool' as const, quantity: 1, origin: 'partner_gift' as const, giftedBy: partner.name, description: 'Polished silver band inscribed with your initials, gifted by ' + partner.name + '.' },
              { id: 'gift_watch_' + Date.now(), name: partner.name + "'s Vintage Pocket Watch", category: 'tool' as const, quantity: 1, origin: 'partner_gift' as const, giftedBy: partner.name, description: 'Accurate mechanical watch with a protective brass casing, presented by ' + partner.name + '.' }
            ];
            const chosenGift = giftList[Math.floor(Math.random() * giftList.length)];
            return {
              state: {
                ...s,
                inventory: [...s.inventory, chosenGift],
                player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) },
                shelter: { ...s.shelter, morale: Math.min(100, (s.shelter.morale ?? 75) + 10) }
              },
              log: 'I received a cherished keepsake from ' + partner.name + ': ' + chosenGift.name + '. Placed in equipment supplies (+15 Sanity, +10 Morale).',
              outcomeTitle: 'Keepsake Received',
              outcomeText: partner.name + ' held your hands warmly. "' + chosenGift.name + ' is yours now. Keep it close, or consecrate it into our family heirloom when the time is right."'
            };
          }
        }
      ]
    });
  }

  // 11. Colony Builder Forged Event (Crafted by Colony Craftsman)
  const builder = state.campMembers.find(m => m.role === 'craftsman');
  if (builder && state.shelter.isEstablished) {
    dilemmas.push({
      id: 'dilemma_builder_forged_' + Date.now(),
      title: "Craftsman Forged: " + builder.name,
      category: 'camp_drama',
      dangerLevel: 'low',
      description: builder.name + ' wipes carbon soot from their brow and presents newly forged gear by the colony anvil: "Leader, I recycled high-carbon vehicle leaf springs and structural steel into a balanced piece of equipment for our sanctuary arsenal. Take it."',
      choices: [
        {
          id: 'accept_builder_gear',
          text: 'Accept the forged equipment for our colony arsenal (+Equipment)',
          consequenceSummary: 'Adds a custom builder-forged item to your Equipment Locker that can be equipped or consecrated into a Family Heirloom.',
          execute: (s: GameState) => {
            const builderItems = [
              { id: 'builder_machete_' + Date.now(), name: builder.name + "'s Tempered Rebar Machete", category: 'weapon' as const, quantity: 1, origin: 'builder_forged' as const, forgedBy: builder.name, description: 'Heavy, razor-sharp combat machete forged from recycled high-carbon steel by ' + builder.name + '.' },
              { id: 'builder_crowbar_' + Date.now(), name: builder.name + "'s Hardened Breaching Bar", category: 'tool' as const, quantity: 1, origin: 'builder_forged' as const, forgedBy: builder.name, description: 'Reinforced demolition pry bar balanced for breaching doors, crafted by ' + builder.name + '.' }
            ];
            const chosenItem = builderItems[Math.floor(Math.random() * builderItems.length)];
            return {
              state: {
                ...s,
                inventory: [...s.inventory, chosenItem]
              },
              log: 'Builder ' + builder.name + ' presented me with custom-forged colony equipment: ' + chosenItem.name + '.',
              outcomeTitle: 'Custom Gear Forged',
              outcomeText: builder.name + ' handed over the heavy steel piece. "Tempered it myself over hardwood coals. You can wield it in battle or dedicate it as a permanent colony relic."'
            };
          }
        }
      ]
    });
  }

  return dilemmas[Math.floor(Math.random() * dilemmas.length)];
}
