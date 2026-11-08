import { EventDilemma, GameState } from '../types/game';

export function getRandomMicroDilemma(state: GameState): EventDilemma | null {
  const dilemmas: EventDilemma[] = [
    {
      id: 'micro_lockbox_' + Date.now(),
      title: 'A Rusted Lockbox in the Vent',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'While inspecting an overhead air duct, my flashlight caught a heavy steel lockbox wedged into the sheet metal. Faint scratching comes from inside, and a rusted padlock holds the latch shut.',
      choices: [
        {
          id: 'pry_lockbox',
          text: 'Pry the lock open with heavy leverage',
          consequenceSummary: 'Risk of noise or traps; chance to recover preserved emergency supplies.',
          execute: (s: GameState) => {
            const hasGoodTools = s.inventory.some(i => i.id.includes('hammer') || i.id.includes('crowbar') || i.id.includes('shears'));
            if (hasGoodTools || Math.random() < 0.7) {
              const loot = [
                { id: 'ammo_9mm_box', name: '9mm Rounds (12)', category: 'resource' as const, quantity: 12, description: 'Handgun ammunition.' },
                { id: 'antiseptic_tin', name: 'Antiseptic Salve', category: 'medical' as const, quantity: 1, description: 'Topical wound antiseptic.' }
              ];
              let inv = [...s.inventory];
              for (const item of loot) {
                const ex = inv.find(i => i.id === item.id);
                if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
                else inv.push(item);
              }
              return {
                state: { ...s, inventory: inv },
                log: 'I pried the steel lockbox open. Inside I recovered 12 rounds of 9mm ammunition and antiseptic salve.',
                outcomeTitle: 'Lockbox Cracked',
                outcomeText: 'The rusted latch snapped cleanly. Inside was a stash of pistol ammo and fresh antiseptic ointment.'
              };
            } else {
              return {
                state: { ...s, player: { ...s.player, health: Math.max(10, s.player.health - 6) } },
                log: 'The rusted metal jagged edge sliced my hand as the latch gave way (-6% HP). The box was empty.',
                outcomeTitle: 'Sharp Metal Cut',
                outcomeText: 'The rusted edge sheared through my palm. I bandaged the cut, but found only dust inside.'
              };
            }
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
                state: { ...s, inventory: inv, player: { ...s.player, hunger: Math.min(100, s.player.hunger + 30) } },
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
    },
    {
      id: 'micro_ham_sos_' + Date.now(),
      title: 'Faint Radio Coordinates',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'An emergency battery receiver crackled with faint, recorded audio: "...repeating coordinates 45.2, -122.6... River barge trading haven active... armed security... bring spare diesel or antibiotics..."',
      choices: [
        {
          id: 'log_river_coordinates',
          text: 'Record the river coordinates and mark them on my survival map',
          consequenceSummary: 'Unlocks long-term coastal evacuation ambition intel (+15 Sanity).',
          execute: (s: GameState) => {
            return {
              state: { ...s, player: { ...s.player, sanity: Math.min(100, s.player.sanity + 15) } },
              log: 'I documented the river barge coordinates in my map notes. Knowing civilization is organizing gives me hope (+15 Sanity).',
              outcomeTitle: 'River Haven Documented',
              outcomeText: 'I recorded the radio frequency and map coordinates. If things get desperate, the river route is an option.'
            };
          }
        },
        {
          id: 'turn_off_receiver',
          text: 'Switch the receiver off immediately to conserve battery life',
          consequenceSummary: 'Preserves radio batteries for critical emergencies.',
          execute: (s: GameState) => {
            return {
              state: { ...s },
              log: 'I turned the receiver off to preserve battery life. Every watt of power counts.',
              outcomeTitle: 'Power Conserved',
              outcomeText: 'I killed the power switch. The batteries will last weeks longer.'
            };
          }
        }
      ]
    },
    {
      id: 'micro_flooded_basement_' + Date.now(),
      title: 'A Submerged Supply Duffel',
      category: 'discovery',
      dangerLevel: 'low',
      description: 'The basement is flooded knee-deep with murky, stagnant rainwater. Floating in the far corner is a bright yellow waterproof duffel bag hooked onto an overhead pipe.',
      choices: [
        {
          id: 'wade_and_retrieve',
          text: 'Wade into the cold stagnant water and retrieve the duffel',
          consequenceSummary: 'Recovers waterproof tools and rations; risk of hypothermia or puncture.',
          execute: (s: GameState) => {
            const loot = [
              { id: 'waterproof_matches', name: 'Stormproof Match Box', category: 'tool' as const, quantity: 1, description: 'Windproof matches.' },
              { id: 'canned_salmon', name: 'Canned Wild Salmon', category: 'food' as const, quantity: 2, description: 'Nutrient-rich fish rations.' }
            ];
            let inv = [...s.inventory];
            for (const item of loot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) inv = inv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
              else inv.push(item);
            }
            return {
              state: { ...s, inventory: inv },
              log: 'I waded through the flooded basement and hauled the yellow duffel out. Found canned salmon and stormproof matches.',
              outcomeTitle: 'Waterproof Gear Salvaged',
              outcomeText: 'My pants were soaked in freezing water, but the contents of the sealed duffel were bone-dry.'
            };
          }
        },
        {
          id: 'avoid_murky_water',
          text: 'Avoid the contaminated water and head back upstairs',
          consequenceSummary: 'Keeps clothes dry and prevents waterborne infection.',
          execute: (s: GameState) => {
            return {
              state: { ...s },
              log: 'I decided against wading through the murky basement water. Kept my boots dry.',
              outcomeTitle: 'Stagnant Water Avoided',
              outcomeText: 'No supplies are worth catching pneumonia in freezing knee-deep sewage.'
            };
          }
        }
      ]
    }
  ];

  return dilemmas[Math.floor(Math.random() * dilemmas.length)];
}
