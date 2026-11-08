import { EventDilemma, GameState, CampMember } from '../types/game';

// Check and generate the next episodic chapter pop-up for the player's backstory
export function getNextBackstoryDilemma(state: GameState, currentDay: number): EventDilemma | null {
  const bs = state.player.backstory;
  if (!bs || bs.status === 'resolved') return null;

  const chapter = bs.chapter || 1;
  const lastDay = bs.lastChapterDay || 0;

  // Don't trigger two chapters on the exact same day
  if (currentDay <= lastDay) return null;

  // CHAPTER 1 triggers on Day 1
  // CHAPTER 2 triggers on Day 2 or 3
  // CHAPTER 3 (Climax) triggers on Day 4 or later
  if (chapter === 1 && currentDay >= 1) {
    return generateChapter1(state, bs, currentDay);
  }
  if (chapter === 2 && currentDay >= 2) {
    return generateChapter2(state, bs, currentDay);
  }
  if (chapter === 3 && currentDay >= 3) {
    return generateChapter3(state, bs, currentDay);
  }

  return null;
}

// CHAPTER 1: The Initial Radio Signal or Clue
function generateChapter1(s: GameState, bs: any, currentDay: number): EventDilemma {
  const target = bs.targetName;
  const relation = bs.relation;

  return {
    id: 'bs_ch1_' + bs.id + '_' + currentDay,
    title: 'A Lead on ' + target + ' (Chapter 1)',
    category: 'discovery',
    dangerLevel: 'low',
    description: 'While sitting in the quiet morning light, faint radio static crackles across my emergency receiver. A trembling voice breaks through the frequency: "...is anyone alive? This is an urgent call for ' + s.player.name + '... ' + target + ' (' + relation + ') was spotted heading toward ' + (bs.targetLocationId === 'pharmacy' ? 'Mercy Memorial' : bs.targetLocationId === 'police_precinct' ? '3rd Precinct' : 'the avenue') + '..." The signal is fading rapidly.',
    choices: [
      {
        id: 'reply_broadcast',
        text: 'Press the transmitter and call out: "I hear you! I am on my way to ' + target + '!"',
        consequenceSummary: 'Broadcasting confirms your signal (+15 Sanity). Advance to Chapter 2.',
        execute: (state: GameState) => {
          const updatedBs = {
            ...bs,
            chapter: 2,
            lastChapterDay: currentDay,
            status: 'clue_found' as const
          };
          return {
            state: {
              ...state,
              player: {
                ...state.player,
                backstory: updatedBs,
                sanity: Math.min(100, state.player.sanity + 15)
              }
            },
            log: 'I broadcasted my reply on the radio: "I hear you! I am coming for ' + target + '!" A double-click sounded in reply before the frequency died. Chapter 1 resolved.',
            outcomeTitle: 'Signal Acknowledged',
            outcomeText: 'A faint double-click clicked through the speaker. Someone on the other end heard me. ' + target + ' is alive out there! (+15 Sanity)'
          };
        }
      },
      {
        id: 'record_frequencies',
        text: 'Keep radio silence, write down the signal coordinates, and save battery life',
        consequenceSummary: 'Traces the transmission direction safely. Advance to Chapter 2.',
        execute: (state: GameState) => {
          const updatedBs = {
            ...bs,
            chapter: 2,
            lastChapterDay: currentDay,
            status: 'clue_found' as const
          };
          return {
            state: {
              ...state,
              player: {
                ...state.player,
                backstory: updatedBs,
                sanity: Math.min(100, state.player.sanity + 10)
              }
            },
            log: 'I documented the radio frequency and mapped the transmission origin toward ' + target + '. Kept radio silence to stay safe. Chapter 1 resolved.',
            outcomeTitle: 'Coordinates Mapped',
            outcomeText: 'I traced the radio signal vector on my street map. I now have a direct heading to search next.'
          };
        }
      }
    ]
  };
}

// CHAPTER 2: The Physical Trail & Close Encounter
function generateChapter2(s: GameState, bs: any, currentDay: number): EventDilemma {
  const target = bs.targetName;

  return {
    id: 'bs_ch2_' + bs.id + '_' + currentDay,
    title: 'Following the Trail (Chapter 2)',
    category: 'discovery',
    dangerLevel: 'medium',
    description: 'While scouting the avenue, I discover an overturned vehicle. Nailed to the rear doorframe is a scrap of clothing and a handwritten note taped in place: "' + s.player.name + ', if you find this, ' + target + ' had to keep moving toward the courtyard sanctuary. Two walkers were tracking our footsteps."',
    choices: [
      {
        id: 'search_vehicle_cabin',
        text: 'Quickly search the vehicle cabin for supplies and more clues',
        consequenceSummary: 'Scavenge useful rations and follow the trail. Advance to Chapter 3.',
        execute: (state: GameState) => {
          const updatedBs = {
            ...bs,
            chapter: 3,
            lastChapterDay: currentDay
          };
          const loot = [
            { id: 'ration_clue', name: 'Preserved Emergency Meal', category: 'food' as const, quantity: 2, description: 'Canned food found on the trail.' },
            { id: 'water_clue', name: 'Purified Water Bottle', category: 'water' as const, quantity: 1, description: 'Drinking water.' }
          ];
          let inv = [...state.inventory];
          for (const item of loot) {
            const ex = inv.find(i => i.id === item.id);
            if (ex) ex.quantity += item.quantity;
            else inv.push(item);
          }
          return {
            state: {
              ...state,
              inventory: inv,
              player: {
                ...state.player,
                backstory: updatedBs,
                sanity: Math.min(100, state.player.sanity + 15)
              }
            },
            log: 'I searched the trail vehicle. Recovered emergency food and water, and found fresh footprints leading toward ' + target + '. Chapter 2 resolved.',
            outcomeTitle: 'Trail Confirmed',
            outcomeText: 'Inside the cabin I found canned food, clean water, and muddy sneaker tracks leading directly toward the sanctuary.'
          };
        }
      },
      {
        id: 'sprint_along_trail',
        text: 'Follow the footprints immediately without stopping to loot',
        consequenceSummary: 'Fast pursuit; closes the distance on ' + target + ' immediately.',
        execute: (state: GameState) => {
          const updatedBs = {
            ...bs,
            chapter: 3,
            lastChapterDay: currentDay
          };
          return {
            state: {
              ...state,
              player: {
                ...state.player,
                backstory: updatedBs,
                sanity: Math.min(100, state.player.sanity + 10)
              }
            },
            log: 'I sprinted along the fresh boot prints in the mud, closing the distance on ' + target + '. Chapter 2 resolved.',
            outcomeTitle: 'Closing the Gap',
            outcomeText: 'I moved at full sprint along the alleyways, following fresh footprints straight toward the sanctuary courtyard.'
          };
        }
      }
    ]
  };
}

// CHAPTER 3: The Climax / Reunion / Rescue
function generateChapter3(s: GameState, bs: any, currentDay: number): EventDilemma {
  const target = bs.targetName;
  const relation = bs.relation;
  const isPet = bs.theme === 'pet';
  const isRival = bs.theme === 'rival';

  if (isPet) {
    return {
      id: 'bs_ch3_' + bs.id + '_' + currentDay,
      title: 'The Courtyard Reunion (Chapter 3 Climax)',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'I hear sharp, desperate barking coming from a walled courtyard! Through the iron bars, I see ' + target + ' cornered on top of a car hood, snapping fearlessly at two circling walkers. ' + target + ' is alive, but the walkers are lunging for the tires!',
      choices: [
        {
          id: 'charge_rescue_pet',
          text: 'Charge the courtyard, strike down the walkers, and rescue ' + target + '!',
          consequenceSummary: 'Eliminate the walkers and bring ' + target + ' into camp (+35 Sanity)!',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 4, status: 'resolved' as const };
            const petCompanion: CampMember = {
              id: 'pet_' + bs.id,
              name: target + ' (' + relation + ')',
              age: 3,
              profession: 'Loyal Camp Guardian',
              relation: relation + ' 🐕',
              bio: 'Devoted four-legged companion. Barks to alert camp of approaching danger.',
              health: 100,
              trust: 100,
              daysTogether: 1,
              role: 'guard',
              statusEffects: []
            };

            return {
              state: {
                ...state,
                campMembers: [...state.campMembers, petCompanion],
                isCampEstablished: true,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  sanity: 100
                },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I fought off the two walkers in the courtyard and rescued ' + target + '! We are reunited at last, and ' + target + ' joined my camp!',
              outcomeTitle: target + ' Rescued!',
              outcomeText: target + ' leaped off the hood into my arms, whining and licking my face with pure joy. We survived Day 0, and now we will survive together! (Mind restored to 100%)'
            };
          }
        }
      ]
    };
  }

  if (isRival) {
    return {
      id: 'bs_ch3_' + bs.id + '_' + currentDay,
      title: 'The Reckoning (Chapter 3 Climax)',
      category: 'hazard',
      dangerLevel: 'high',
      description: 'Behind the depot gate, I spot ' + target + ' loading stolen supplies into an armored pickup truck. He notices my footsteps, drops a crate, and reaches for his weapon with a cold sneer: "You should have stayed locked in that basement!"',
      choices: [
        {
          id: 'confront_rival_reclaim',
          text: 'Draw my weapon, overpower ' + target + ', and reclaim our stolen survival cache',
          consequenceSummary: 'Recover massive supplies (+Food, +Water, +Weapon) and settle the score (+25 Sanity).',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 4, status: 'resolved' as const };
            const reclaimedLoot = [
              { id: 'stolen_cache_food', name: 'Military MRE Packs (5)', category: 'food' as const, quantity: 5, description: 'Reclaimed emergency rations.' },
              { id: 'stolen_cache_water', name: 'Fresh Spring Water (4)', category: 'water' as const, quantity: 4, description: 'Clean drinking water.' },
              { id: 'reclaimed_shotgun', name: 'Pump-Action Shotgun', category: 'weapon' as const, quantity: 1, description: 'Heavy 12-gauge shotgun.' }
            ];
            let inv = [...state.inventory];
            for (const item of reclaimedLoot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) ex.quantity += item.quantity;
              else inv.push(item);
            }

            return {
              state: {
                ...state,
                inventory: inv,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  sanity: Math.min(100, state.player.sanity + 25)
                }
              },
              log: 'I confronted ' + target + ', disarmed him, and reclaimed our entire emergency stockpile! The betrayal is settled. (+25 Sanity)',
              outcomeTitle: 'Score Settled',
              outcomeText: 'I kicked his weapon away and took back our stolen supplies. He backed into the ruins empty-handed. Justice has been served in the wasteland.'
            };
          }
        }
      ]
    };
  }

  // Family & Friends Rescue
  return {
    id: 'bs_ch3_' + bs.id + '_' + currentDay,
    title: 'Reunion at the Sanctuary (Chapter 3 Climax)',
    category: 'discovery',
    dangerLevel: 'medium',
    description: 'I breach the sanctuary courtyard. Ahead in the fog, two infected are pounding against a padlocked stone tool shed. A familiar, breathless voice calls out from inside: "Stay back, I will fight you!" It is ' + target + ' (' + relation + ')! They are alive, but trapped!',
    choices: [
      {
        id: 'charge_rescue_family',
        text: 'Strike down the two walkers, smash the padlock, and pull ' + target + ' to safety!',
        consequenceSummary: 'Rescue ' + target + ' and welcome them into your camp as a loyal ally (+35 Sanity)!',
        execute: (state: GameState) => {
          const updatedBs = { ...bs, chapter: 4, status: 'resolved' as const };
          const companion: CampMember = {
            id: 'rescued_' + bs.id,
            name: target + ' (' + relation + ')',
            age: relation.includes('Brother') || relation.includes('Sister') || relation.includes('Friend') ? 17 : relation.includes('Father') || relation.includes('Mother') ? 60 : 25,
            profession: relation.includes('Father') ? 'Retired Veteran' : relation.includes('Mother') ? 'Caregiver' : 'Resilient Survivor',
            relation: relation,
            bio: 'Rescued loved one. Bound by blood and shared survival.',
            health: 95,
            trust: 100,
            daysTogether: 1,
            role: 'guard',
            statusEffects: []
          };

          return {
            state: {
              ...state,
              campMembers: [...state.campMembers, companion],
              isCampEstablished: true,
              player: {
                ...state.player,
                backstory: updatedBs,
                sanity: 100
              },
              stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
            },
            log: 'I eliminated the walkers in the courtyard and broke ' + target + ' out of the stone shed! We embraced with tears of relief. ' + target + ' joined my camp!',
            outcomeTitle: 'Reunited at Last!',
            outcomeText: target + ' burst out of the shed into my arms. We survived the apocalypse and found each other! ' + target + ' is now safe in our camp! (Mind restored to 100%)'
          };
        }
      }
    ]
  };
}
