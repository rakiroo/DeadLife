import { EventDilemma, GameState, CampMember } from '../types/game';

// Check and trigger the next episodic chapter pop-up for the player's backstory
// Spanned across 5 meaningful chapters over 15-20+ days of survival!
export function getNextBackstoryDilemma(state: GameState, currentDay: number): EventDilemma | null {
  const bs = state.player.backstory;
  if (!bs || bs.status === 'resolved') return null;

  const chapter = bs.chapter || 1;
  const lastDay = bs.lastChapterDay || 0;

  // Never trigger two chapters on the exact same day
  if (currentDay <= lastDay) return null;

  // Chapter 1: Day 1+
  // Chapter 2: Day 3+
  // Chapter 3: Day 6+
  // Chapter 4: Day 10+
  // Chapter 5: Day 15+ (Climax)
  if (chapter === 1 && currentDay >= 1) {
    return generateChapterDilemma(state, bs, 1, currentDay);
  }
  if (chapter === 2 && currentDay >= 3) {
    return generateChapterDilemma(state, bs, 2, currentDay);
  }
  if (chapter === 3 && currentDay >= 6) {
    return generateChapterDilemma(state, bs, 3, currentDay);
  }
  if (chapter === 4 && currentDay >= 10) {
    return generateChapterDilemma(state, bs, 4, currentDay);
  }
  if (chapter === 5 && currentDay >= 15) {
    return generateChapterDilemma(state, bs, 5, currentDay);
  }

  return null;
}

function generateChapterDilemma(s: GameState, bs: any, chapterNum: number, currentDay: number): EventDilemma {
  const target = bs.targetName;
  const relation = bs.relation;
  const isPet = bs.theme === 'pet';
  const isRival = bs.theme === 'rival';

  // ==========================================================================
  // CHAPTER 1: The Initial Lead (Day 1+)
  // ==========================================================================
  if (chapterNum === 1) {
    return {
      id: 'bs_ch1_' + bs.id + '_' + currentDay,
      title: target + ': The First Lead (Chapter 1/5)',
      category: 'discovery',
      dangerLevel: 'low',
      description: isPet
        ? 'While scanning the street at sunrise, a sharp, distant bark echoes over the rooftops from the direction of ' + (bs.targetLocationId === 'supermarket' ? 'Costway Supermarket' : 'the commercial avenue') + '. It sounded unmistakably like ' + target + '.'
        : 'While checking my gear this morning, my emergency receiver picked up a burst of crackling radio static. Through the interference, a voice called out regarding evacuees heading toward ' + (bs.targetLocationId === 'pharmacy' ? 'Mercy Memorial' : bs.targetLocationId === 'police_precinct' ? 'the 3rd Precinct' : 'the avenue') + ', mentioning ' + target + ' (' + relation + ').',
      choices: [
        {
          id: 'ch1_investigate',
          text: isPet ? 'Whistle our two-tone call and mark the direction on my map' : 'Record the radio frequency and map the signal vector toward ' + target,
          consequenceSummary: 'Documents the lead (+10 Sanity). Advances your search to Chapter 2.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 2, lastChapterDay: currentDay, status: 'clue_found' as const };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I documented the first signal vector toward ' + target + ' (' + relation + '). I have a direct heading to search. Chapter 1 resolved.',
              outcomeTitle: 'Signal Mapped',
              outcomeText: 'I recorded the coordinates on my map. ' + target + ' is out there, and I now have a solid lead to follow.'
            };
          }
        },
        {
          id: 'ch1_cautious',
          text: 'Keep low, listen carefully, and conserve equipment power',
          consequenceSummary: 'Maintains stealth and preserves battery life. Advances to Chapter 2.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 2, lastChapterDay: currentDay, status: 'clue_found' as const };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs } },
              log: 'I listened in silence, tracing the sound echoes toward ' + target + ' while keeping my position concealed. Chapter 1 resolved.',
              outcomeTitle: 'Silent Recon',
              outcomeText: 'I pinned the acoustic direction without giving away my hiding spot. The search continues.'
            };
          }
        }
      ]
    };
  }

  // ==========================================================================
  // CHAPTER 2: The Physical Trail & Vehicle (Day 3+)
  // ==========================================================================
  if (chapterNum === 2) {
    return {
      id: 'bs_ch2_' + bs.id + '_' + currentDay,
      title: target + ': The Abandoned Trail (Chapter 2/5)',
      category: 'discovery',
      dangerLevel: 'medium',
      description: isPet
        ? 'Following the street, I find a dropped water bowl and a chewed tennis ball near an overturned station wagon. Fresh paw prints in the mud lead past an alley barricade.'
        : isRival
        ? 'I discover fresh dual-wheel tire tracks matching ' + target + '\'s heavy truck near an abandoned fuel depot. Empty wooden crates were discarded into the ditch.'
        : 'Scouting the cross-street, I discover an abandoned civilian vehicle with doors left ajar. Taped to the dashboard is a note: "' + target + ' had to abandon the car. Walking east toward the shelter."',
      choices: [
        {
          id: 'ch2_search_vehicle',
          text: 'Search the abandoned vehicle cabin for supplies and route notes',
          consequenceSummary: 'Scavenges emergency food & clean water (+Supplies). Advances to Chapter 3.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 3, lastChapterDay: currentDay };
            const loot = [
              { id: 'ch2_food', name: 'Canned Beef Stew', category: 'food' as const, quantity: 2, description: 'Rations salvaged on the trail.' },
              { id: 'ch2_water', name: 'Spring Water Jug', category: 'water' as const, quantity: 1, description: 'Clean drinking water.' }
            ];
            let inv = [...state.inventory];
            for (const item of loot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) ex.quantity += item.quantity;
              else inv.push(item);
            }
            return {
              state: { ...state, inventory: inv, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I searched the trail vehicle, securing emergency food and water, and found fresh tracks left by ' + target + '. Chapter 2 resolved.',
              outcomeTitle: 'Supplies & Trail Secured',
              outcomeText: 'I recovered canned stew and water from the glovebox, and spotted fresh footprints leading toward the next district.'
            };
          }
        },
        {
          id: 'ch2_track_prints',
          text: 'Follow the mud tracks immediately without stopping to loot',
          consequenceSummary: 'Maintains rapid pursuit along the avenue. Advances to Chapter 3.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 3, lastChapterDay: currentDay };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I tracked the footprints through the alley without pausing, closing the distance on ' + target + '. Chapter 2 resolved.',
              outcomeTitle: 'Rapid Pursuit',
              outcomeText: 'I kept my eyes glued to the mud prints. ' + target + ' was moving fast, staying ahead of wandering infected.'
            };
          }
        }
      ]
    };
  }

  // ==========================================================================
  // CHAPTER 3: The Dangerous Encounter & Dropped Belongings (Day 6+)
  // ==========================================================================
  if (chapterNum === 3) {
    return {
      id: 'bs_ch3_' + bs.id + '_' + currentDay,
      title: target + ': The Narrow Escape (Chapter 3/5)',
      category: 'hazard',
      dangerLevel: 'medium',
      description: isPet
        ? 'Near an alley dumpster, a cluster of three walkers are sniffing at a pile of overturned trash bags. Caught on the chain-link fence directly behind them is ' + target + '\'s torn collar!'
        : 'Ahead in a pedestrian underpass, three wandering infected are clawing at a bloodstained backpack caught on a barricade beam. I recognize the stitched initials on the strap—it belongs to ' + target + '!',
      choices: [
        {
          id: 'ch3_ambush_walkers',
          text: 'Sneak behind the infected, eliminate them quietly, and retrieve the belongings',
          consequenceSummary: 'Uses combat & stealth to recover ' + target + '\'s gear safely. Advances to Chapter 4.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 4, lastChapterDay: currentDay };
            const success = state.player.combatSkill >= 4 || state.player.stealthSkill >= 4 || Math.random() < 0.75;
            if (success) {
              return {
                state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 15) }, stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2 } },
                log: 'I eliminated the walkers in the underpass and recovered ' + target + '\'s personal belongings. The trail is hot! Chapter 3 resolved.',
                outcomeTitle: 'Belongings Recovered',
                outcomeText: 'Two swift strikes put the walkers down. I inspected the belongings—' + target + ' escaped through the eastern tunnel.'
              };
            } else {
              return {
                state: { ...state, player: { ...state.player, backstory: updatedBs, health: Math.max(10, state.player.health - 10) }, stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 1 } },
                log: 'A walker lunged as I reached for the belongings, grazing my arm (-10% HP). I fought it off and secured the clue. Chapter 3 resolved.',
                outcomeTitle: 'Scraped by Walkers',
                outcomeText: 'I took down the walker, but caught a sharp scrape across my shoulder. I held onto ' + target + '\'s belongings.'
              };
            }
          }
        },
        {
          id: 'ch3_distract_decoy',
          text: 'Throw a heavy brick down the avenue to lure the walkers away from the gear',
          consequenceSummary: 'Clever distraction avoids all combat injury. Advances to Chapter 4.',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 4, lastChapterDay: currentDay };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I hurled a brick against a metal roll-up door, drawing the walkers away, and grabbed ' + target + '\'s belongings cleanly. Chapter 3 resolved.',
              outcomeTitle: 'Distraction Worked',
              outcomeText: 'The clatter echoed down the block. The infected shuffled away, giving me a clear window to retrieve the clue.'
            };
          }
        }
      ]
    };
  }

  // ==========================================================================
  // CHAPTER 4: The Eyewitness & Safehouse Markings (Day 10+)
  // ==========================================================================
  if (chapterNum === 4) {
    return {
      id: 'bs_ch4_' + bs.id + '_' + currentDay,
      title: target + ': The Safehouse Clue (Chapter 4/5)',
      category: 'discovery',
      dangerLevel: 'low',
      description: isPet
        ? 'Outside an abandoned deli, I meet a lone scavenger who notices me checking paw prints. He nods toward the eastern courtyard: "Looking for that dog? Saw him two days ago. He was barking at a church stone shed, guarding something."'
        : 'Carved into the brickwork of a transit tunnel is a fresh chalk message written in ' + target + '\'s unmistakable handwriting: "' + s.player.name + ' — If you are alive, I am holding out at the stone sanctuary courtyard. Doors are barred. Hurry."',
      choices: [
        {
          id: 'ch4_prepare_final_push',
          text: 'Sharpen weapons, pack emergency medicine, and prepare for the final rescue push',
          consequenceSummary: 'Final staging: Prepares mind and gear (+20 Sanity). Advances to Chapter 5 Climax!',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 5, lastChapterDay: currentDay };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 20) } },
              log: 'I found ' + target + '\'s fresh chalk message! They are alive and holding out at the sanctuary courtyard. Preparing my final rescue push. Chapter 4 resolved.',
              outcomeTitle: 'Location Pinpointed',
              outcomeText: 'The message was written recently. The ink and chalk are fresh. I know the exact courtyard where ' + target + ' is waiting (+20 Sanity).'
            };
          }
        },
        {
          id: 'ch4_scout_perimeter',
          text: 'Scout the sanctuary perimeter from distance to map infected numbers',
          consequenceSummary: 'Tactical scouting reveals the courtyard layout. Advances to Chapter 5 Climax!',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 5, lastChapterDay: currentDay };
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 15) } },
              log: 'I scouted the perimeter around ' + target + '\'s location with binoculars. Mapped the safe breaches. Chapter 4 resolved.',
              outcomeTitle: 'Breach Point Mapped',
              outcomeText: 'I spotted the stone courtyard through my lenses. A few infected are pacing the gates, but the rear fence is passable.'
            };
          }
        }
      ]
    };
  }

  // ==========================================================================
  // CHAPTER 5: The Grand Climax & Resolution (Day 15+)
  // ==========================================================================
  if (isPet) {
    return {
      id: 'bs_ch5_' + bs.id + '_' + currentDay,
      title: target + ': The Courtyard Rescue (Chapter 5/5 Climax)',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'I breach the sanctuary courtyard! Ahead in the fog, ' + target + ' is cornered atop an overturned vehicle, barking fearlessly to keep two lunging walkers at bay. ' + target + ' spots me through the fence and gives an ecstatic whine!',
      choices: [
        {
          id: 'ch5_rescue_pet_climax',
          text: 'Charge the courtyard, smash the two walkers, and bring ' + target + ' home to camp!',
          consequenceSummary: 'Eliminate the walkers and welcome ' + target + ' into camp as a loyal guardian (+100% Mind/Sanity)!',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 6, status: 'resolved' as const };
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
                player: { ...state.player, backstory: updatedBs, sanity: 100 },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I fought off the walkers and rescued ' + target + '! We are reunited at last, and ' + target + ' is now safe in my camp. Journey completed!',
              outcomeTitle: target + ' Rescued & Reunited!',
              outcomeText: target + ' leaped into my arms with joyful whines, licking the dust from my face. After weeks of searching through the ruins, we are together again! (Mind restored to 100%)'
            };
          }
        }
      ]
    };
  }

  if (isRival) {
    return {
      id: 'bs_ch5_' + bs.id + '_' + currentDay,
      title: target + ': The Showdown (Chapter 5/5 Climax)',
      category: 'hazard',
      dangerLevel: 'high',
      description: 'Behind the depot fence, I corner ' + target + ' loading our stolen emergency supplies into his truck. He turns around with his weapon raised and sneers: "You tracked me across half the state? You should have stayed dead in that cellar!"',
      choices: [
        {
          id: 'ch5_confront_rival_climax',
          text: 'Draw my weapon, overpower ' + target + ', and reclaim our entire emergency stockpile!',
          consequenceSummary: 'Reclaim military rations, water, and shotgun (+5 Food, +4 Water, +Shotgun, +30 Sanity)!',
          execute: (state: GameState) => {
            const updatedBs = { ...bs, chapter: 6, status: 'resolved' as const };
            const loot = [
              { id: 'stolen_cache_food', name: 'Military MRE Packs (5)', category: 'food' as const, quantity: 5, description: 'Reclaimed emergency rations.' },
              { id: 'stolen_cache_water', name: 'Fresh Spring Water (4)', category: 'water' as const, quantity: 4, description: 'Clean drinking water.' },
              { id: 'reclaimed_shotgun', name: 'Pump-Action Shotgun', category: 'weapon' as const, quantity: 1, description: 'Heavy 12-gauge shotgun.' }
            ];
            let inv = [...state.inventory];
            for (const item of loot) {
              const ex = inv.find(i => i.id === item.id);
              if (ex) ex.quantity += item.quantity;
              else inv.push(item);
            }
            return {
              state: { ...state, inventory: inv, player: { ...state.player, backstory: updatedBs, sanity: 100 } },
              log: 'I confronted ' + target + ', disarmed him, and reclaimed our entire emergency stockpile! The betrayal has been avenged. Journey completed!',
              outcomeTitle: 'Betrayal Avenged',
              outcomeText: 'I kicked his weapon away and took back all our stolen food and guns. He backed into the ruins empty-handed. Justice has been served in the wasteland! (Mind restored to 100%)'
            };
          }
        }
      ]
    };
  }

  // Family & Loved One Rescue Climax
  return {
    id: 'bs_ch5_' + bs.id + '_' + currentDay,
    title: target + ': The Sanctuary Reunion (Chapter 5/5 Climax)',
    category: 'discovery',
    dangerLevel: 'medium',
    description: 'I breach the sanctuary courtyard! Two walkers are clawing at a padlocked stone tool shed. From inside, ' + target + ' (' + relation + ')\'s voice calls out: "Back off, I will fight you!" ' + target + ' is alive and holding the door with an iron pipe!',
    choices: [
      {
        id: 'ch5_rescue_family_climax',
        text: 'Strike down the two walkers, smash the lock, and pull ' + target + ' into my arms!',
        consequenceSummary: 'Rescue ' + target + ' and welcome them into your camp as a loyal survivor ally (+100% Mind/Sanity)!',
        execute: (state: GameState) => {
          const updatedBs = { ...bs, chapter: 6, status: 'resolved' as const };
          const companion: CampMember = {
            id: 'rescued_' + bs.id,
            name: target + ' (' + relation + ')',
            age: relation.includes('Brother') || relation.includes('Sister') || relation.includes('Friend') ? 17 : relation.includes('Father') || relation.includes('Mother') ? 62 : 26,
            profession: relation.includes('Father') ? 'Retired Veteran' : relation.includes('Mother') ? 'Caregiver & Medic' : relation.includes('Brother') || relation.includes('Sister') ? 'Resilient Student' : 'Devoted Companion',
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
              player: { ...state.player, backstory: updatedBs, sanity: 100 },
              stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
            },
            log: 'I eliminated the walkers in the courtyard and broke ' + target + ' out of the stone shed! We embraced with tears of relief. ' + target + ' joined my camp! Journey completed!',
            outcomeTitle: target + ' Reunited at Last!',
            outcomeText: target + ' burst out of the shed into my arms, crying tears of relief. After weeks of fighting through the dead city, we found each other alive! ' + target + ' is now safe in our camp! (Mind restored to 100%)'
          };
        }
      }
    ]
  };
}
