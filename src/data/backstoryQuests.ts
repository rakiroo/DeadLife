import { EventDilemma, GameState, CampMember, CampRole } from '../types/game';

// Check and trigger the next episodic chapter pop-up for the player's backstory
// Spanned across 5 meaningful chapters over 15-20+ days of survival with branching outcomes!

function getPlayerLastName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function generateCompanionFromBackstory(
  player: { name: string; age: number },
  bs: any,
  status: 'healthy' | 'amputee' = 'healthy'
): CampMember {
  const lastName = getPlayerLastName(player.name);
  const target = bs.targetName;
  const relation = bs.relation;
  const isFamily = bs.theme === 'family' || bs.theme === 'love';
  const isPet = bs.theme === 'pet';

  // 1. Inherit player's last name for family members like in BitLife!
  let fullName = target;
  if (isFamily && lastName && !target.includes(' ')) {
    fullName = target + ' ' + lastName;
  } else if (isPet) {
    fullName = target;
  }

  // 2. Realistic age calculation relative to player
  let age = player.age;
  if (relation.includes('Father') || relation.includes('Mother')) {
    age = Math.max(player.age + 20, 58);
  } else if (relation.includes('Son') || relation.includes('Daughter')) {
    age = Math.min(Math.max(7, player.age - 20), 22);
  } else if (relation.includes('Brother') || relation.includes('Sister')) {
    age = Math.max(12, player.age - 3);
  } else if (relation.includes('Twin')) {
    age = player.age;
  } else if (isPet) {
    age = 3;
  }

  // 3. Gender inference
  let gender: 'male' | 'female' = 'male';
  if (
    relation.includes('Mother') || 
    relation.includes('Sister') || 
    relation.includes('Daughter') || 
    (relation.includes('Spouse') && (target === 'Elena' || target === 'Hannah' || target === 'Rachel' || target === 'Martha'))
  ) {
    gender = 'female';
  }

  // 4. Individualized stats (1-10) like BitLife / RPGs
  let combatSkill = 4;
  let medicalSkill = 4;
  let craftingSkill = 4;
  let stealthSkill = 4;
  let fitnessSkill = 4;
  let role: CampRole = 'guard';
  let profession = 'Resilient Companion';

  if (isPet) {
    combatSkill = 7;
    medicalSkill = 1;
    craftingSkill = 1;
    stealthSkill = 8;
    fitnessSkill = 9;
    role = 'guard';
    profession = 'Camp Guardian & Early Warning';
  } else if (relation.includes('Father')) {
    combatSkill = 6;
    medicalSkill = 3;
    craftingSkill = 8;
    stealthSkill = 3;
    fitnessSkill = 4;
    role = 'craftsman';
    profession = 'Retired Tradesman & Builder';
  } else if (relation.includes('Mother') || bs.id.includes('mom')) {
    combatSkill = 3;
    medicalSkill = 9;
    craftingSkill = 5;
    stealthSkill = 4;
    fitnessSkill = 4;
    role = 'medic';
    profession = 'Field Caregiver & Nurse';
  } else if (relation.includes('Brother') || relation.includes('Sister') || age < 18) {
    combatSkill = 4;
    medicalSkill = 2;
    craftingSkill = 3;
    stealthSkill = 7;
    fitnessSkill = 8;
    role = 'scavenger';
    profession = 'Agile Student & Scout';
  } else if (relation.includes('Friend') || target === 'Lucas') {
    combatSkill = 6;
    medicalSkill = 2;
    craftingSkill = 4;
    stealthSkill = 6;
    fitnessSkill = 8;
    role = 'scavenger';
    profession = 'Athletic Scavenger';
  } else if (relation.includes('Spouse')) {
    combatSkill = 6;
    medicalSkill = 5;
    craftingSkill = 5;
    stealthSkill = 5;
    fitnessSkill = 6;
    role = 'guard';
    profession = 'Devoted Partner & Defender';
  }

  return {
    id: 'rescued_' + bs.id + '_' + Date.now(),
    name: fullName,
    gender,
    age,
    relation: isPet ? 'Pet Dog 🐕' : (relation + (status === 'amputee' ? ' 🩹' : '')),
    profession: status === 'amputee' ? (profession + ' (Amputee Survivor)') : profession,
    bio: isPet ? ('Faithful four-legged companion of ' + player.name + '.') : (relation + ' of ' + player.name + '. Rescued from the ruins.'),
    health: status === 'amputee' ? 70 : 95,
    trust: 100,
    daysTogether: 1,
    combatSkill,
    medicalSkill,
    craftingSkill,
    stealthSkill,
    fitnessSkill,
    role,
    statusEffects: []
  };
}


function isChapterPrerequisiteMet(bs: any, targetChapter: number): boolean {
  if (targetChapter <= 1) return true;
  const completed = bs.completedChapters || [];
  for (let c = 1; c < targetChapter; c++) {
    if (!completed.includes(c)) {
      return false;
    }
  }
  return true;
}

function advanceBackstoryChapter(bs: any, chapterNum: number, currentDay: number, isFinal: boolean = false) {
  const completed = bs.completedChapters ? [...bs.completedChapters] : [];
  if (!completed.includes(chapterNum)) {
    completed.push(chapterNum);
  }
  return {
    ...bs,
    chapter: isFinal ? chapterNum + 1 : chapterNum + 1,
    completedChapters: completed,
    lastChapterDay: currentDay,
    status: isFinal ? ('resolved' as const) : ('clue_found' as const)
  };
}

export function getNextBackstoryDilemma(
  state: GameState,
  currentDay: number,
  source: 'day_advance' | 'radio' | 'vehicle' | 'recon' | 'scavenge' = 'day_advance',
  locationId?: string
): EventDilemma | null {
  const bs = state.player.backstory;
  if (!bs || bs.status === 'resolved') return null;

  // Proofing 1: If a dilemma is already pending/open, never overwrite or skip ahead!
  if (state.activeDilemma) return null;

  const chapter = bs.chapter || 1;
  const lastDay = bs.lastChapterDay || 0;

  // Proofing 2: Never trigger two chapters on the same day
  if (currentDay <= lastDay) return null;

  // Proofing 3: STRICT SEQUENCE GATE! Can never trigger chapter N unless all (1..N-1) are explicitly completed!
  if (!isChapterPrerequisiteMet(bs, chapter)) {
    return null;
  }

  // 1. Activity Lore Triggers: Player actions in the world directly trigger milestones with sensible cooldowns
  const daysSinceLast = currentDay - lastDay;
  if (source === 'radio' && chapter === 1 && currentDay >= 3) {
    return generateChapterDilemma(state, bs, 1, currentDay);
  }
  if (source === 'vehicle' && chapter === 2 && daysSinceLast >= 5) {
    return generateChapterDilemma(state, bs, 2, currentDay);
  }
  if (source === 'recon' && (chapter === 3 || chapter === 4) && daysSinceLast >= 6) {
    return generateChapterDilemma(state, bs, chapter, currentDay);
  }
  if (source === 'scavenge' && locationId === bs.targetLocationId && chapter === 5 && daysSinceLast >= 7) {
    return generateChapterDilemma(state, bs, 5, currentDay);
  }

  // 2. Day Progression: Organic, spaced out chance across longer survival days!
  if (source === 'day_advance') {
    if (currentDay <= lastDay) return null;

    // Spaced out over longer days of survival so the journey feels vast and natural:
    const shouldTrigger = (chapter === 1 && (currentDay >= 9 || (currentDay >= 5 && Math.random() < 0.22))) ||
                          (chapter === 2 && (daysSinceLast >= 14 || (daysSinceLast >= 7 && Math.random() < 0.18))) ||
                          (chapter === 3 && (daysSinceLast >= 16 || (daysSinceLast >= 8 && Math.random() < 0.16))) ||
                          (chapter === 4 && (daysSinceLast >= 18 || (daysSinceLast >= 9 && Math.random() < 0.15))) ||
                          (chapter === 5 && (daysSinceLast >= 20 || (daysSinceLast >= 10 && Math.random() < 0.15)));

    if (shouldTrigger && chapter <= 5) {
      return generateChapterDilemma(state, bs, chapter, currentDay);
    }
  }

  return null;
}

function generateChapterDilemma(s: GameState, bs: any, chapterNum: number, currentDay: number): EventDilemma {
  const isFather = Boolean(bs.relation && bs.relation.toLowerCase().includes('father')) || Boolean(bs.id && (bs.id.includes('dad') || bs.id.includes('father')));
  const isMother = Boolean(bs.relation && bs.relation.toLowerCase().includes('mother')) || Boolean(bs.id && (bs.id.includes('mom') || bs.id.includes('mother')));
  const target = isFather ? 'Dad' : (isMother ? 'Mom' : bs.targetName);
  const relation = bs.relation;
  const isPet = bs.theme === 'pet';
  const isRival = bs.theme === 'rival';

  // ==========================================================================
  // CHAPTER 1: The Initial Lead (Day 1+)
  // ==========================================================================
  if (chapterNum === 1) {
    return {
      id: 'bs_ch1_' + bs.id + '_' + currentDay,
      title: target + ': The First Lead',
      category: 'discovery',
      dangerLevel: 'low',
      description: isPet
        ? 'While scanning the street at sunrise, a sharp, distant bark echoes over the rooftops from the direction of ' + (bs.targetLocationId === 'supermarket' ? 'Costway Supermarket' : 'the commercial avenue') + '. It sounded unmistakably like ' + target + '.'
        : 'While checking my gear this morning, my emergency receiver picked up a burst of crackling radio static. Through the interference, a voice called out regarding evacuees heading toward ' + (bs.targetLocationId === 'pharmacy' ? 'Mercy Memorial' : bs.targetLocationId === 'police_precinct' ? 'the 3rd Precinct' : 'the avenue') + ', mentioning ' + target + '.',
      choices: [
        {
          id: 'ch1_investigate',
          text: isPet ? 'Whistle our two-tone call and mark the direction on my map' : 'Record the radio frequency and map the signal vector toward ' + target,
          consequenceSummary: 'Documents the lead (+10 Sanity). Secures a direct heading to search.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 1, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I documented the first signal vector toward ' + target + '. I have a direct heading to search.',
              outcomeTitle: 'Signal Mapped',
              outcomeText: 'I recorded the coordinates on my map. ' + target + ' is out there, and I now have a solid lead to follow.'
            };
          }
        },
        {
          id: 'ch1_cautious',
          text: 'Keep low, listen carefully, and conserve equipment power',
          consequenceSummary: 'Maintains stealth and preserves battery life while noting the signal.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 1, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs } },
              log: 'I listened in silence, tracing the sound echoes toward ' + target + ' while keeping my position concealed.',
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
      title: target + ': The Abandoned Trail',
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
          consequenceSummary: 'Scavenge emergency food & clean water (+Supplies). Continues following the trail.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 2, currentDay);
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
              log: 'I searched the trail vehicle, securing emergency food and water, and found fresh tracks left by ' + target + '.',
              outcomeTitle: 'Supplies & Trail Secured',
              outcomeText: 'I recovered canned stew and water from the glovebox, and spotted fresh footprints leading toward the next district.'
            };
          }
        },
        {
          id: 'ch2_track_prints',
          text: 'Follow the mud tracks immediately without stopping to loot',
          consequenceSummary: 'Maintains rapid pursuit along the avenue. Continues following the trail.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 2, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I tracked the footprints through the alley without pausing, closing the distance on ' + target + '.',
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
      title: target + ': The Narrow Escape',
      category: 'hazard',
      dangerLevel: 'medium',
      description: isPet
        ? 'Near an alley dumpster, a cluster of three walkers are sniffing at a pile of overturned trash bags. Caught on the chain-link fence directly behind them is ' + target + '\'s torn collar!'
        : 'Ahead in a pedestrian underpass, three wandering infected are clawing at a bloodstained backpack caught on a barricade beam. I recognize the stitched initials on the strap—it belongs to ' + target + '!',
      choices: [
        {
          id: 'ch3_ambush_walkers',
          text: 'Sneak behind the infected, eliminate them quietly, and retrieve the belongings',
          consequenceSummary: 'Uses combat & stealth to recover ' + target + '\'s gear safely. Keeps the trail hot.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 3, currentDay);
            const success = state.player.combatSkill >= 4 || state.player.stealthSkill >= 4 || Math.random() < 0.75;
            if (success) {
              return {
                state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 15) }, stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2 } },
                log: 'I eliminated the walkers in the underpass and recovered ' + target + '\'s personal belongings. The trail is hot!',
                outcomeTitle: 'Belongings Recovered',
                outcomeText: 'Two swift strikes put the walkers down. I inspected the belongings—' + target + ' escaped through the eastern tunnel.'
              };
            } else {
              return {
                state: { ...state, player: { ...state.player, backstory: updatedBs, health: Math.max(10, state.player.health - 10) }, stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 1 } },
                log: 'A walker lunged as I reached for the belongings, grazing my arm (-10% HP). I fought it off and secured the clue.',
                outcomeTitle: 'Scraped by Walkers',
                outcomeText: 'I took down the walker, but caught a sharp scrape across my shoulder. I held onto ' + target + '\'s belongings.'
              };
            }
          }
        },
        {
          id: 'ch3_distract_decoy',
          text: 'Throw a heavy brick down the avenue to lure the walkers away from the gear',
          consequenceSummary: 'Clever distraction avoids all combat injury. Keeps the trail hot.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 3, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) } },
              log: 'I hurled a brick against a metal roll-up door, drawing the walkers away, and grabbed ' + target + '\'s belongings cleanly.',
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
      title: target + ': The Safehouse Clue',
      category: 'discovery',
      dangerLevel: 'low',
      description: isPet
        ? 'Outside an abandoned deli, I meet a lone scavenger who notices me checking paw prints. He nods toward the eastern courtyard: "Looking for that dog? Saw him two days ago. He was barking near a stone shed, cornered by things."'
        : 'Carved into the brickwork of a transit tunnel is a fresh chalk message written in ' + target + '\'s unmistakable handwriting: "' + s.player.name + ' — If you are alive, I am holding out at the stone courtyard. Doors are barred. Hurry."',
      choices: [
        {
          id: 'ch4_prepare_final_push',
          text: 'Sharpen weapons, pack emergency medicine, and prepare for the final push',
          consequenceSummary: 'Final staging: Prepares mind and gear (+20 Sanity). Prepares for the final encounter.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 4, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 20) } },
              log: 'I found ' + target + '\'s fresh chalk message! They are holding out at the stone courtyard. Preparing my final rescue push.',
              outcomeTitle: 'Location Pinpointed',
              outcomeText: 'The message was written recently. The ink and chalk are fresh. I know the exact courtyard where ' + target + ' is waiting (+20 Sanity).'
            };
          }
        },
        {
          id: 'ch4_scout_perimeter',
          text: 'Scout the sanctuary perimeter from distance to map infected numbers',
          consequenceSummary: 'Tactical scouting reveals the courtyard layout. Prepares for the final encounter.',
          execute: (state: GameState) => {
            const updatedBs = advanceBackstoryChapter(bs, 4, currentDay);
            return {
              state: { ...state, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 15) } },
              log: 'I scouted the perimeter around ' + target + '\'s location with binoculars. Mapped the safe breaches.',
              outcomeTitle: 'Breach Point Mapped',
              outcomeText: 'I spotted the stone courtyard through my lenses. A few infected are pacing the gates, but the rear fence is passable.'
            };
          }
        }
      ]
    };
  }

  // ==========================================================================
  // CHAPTER 5: THE CLIMAX & MULTI-BRANCHING OUTCOMES (Day 15+)
  // Can be a Heroic Rescue, a Tragic Bitten Goodbye, Finding them Fallen, or Rival Justice!
  // ==========================================================================

  // A. PET CLIMAX (Healthy vs Wounded Dog)
  if (isPet) {
    return {
      id: 'bs_ch5_' + bs.id + '_' + currentDay,
      title: target + ': The Courtyard Stand',
      category: 'hazard',
      dangerLevel: 'high',
      description: 'I breach the courtyard gates! ' + target + ' is trapped on top of an overturned truck, snarling bravely with a bleeding paw as three walkers snap at the rear bumper. ' + target + ' spots me and lets out a desperate, joyful howl!',
      choices: [
        {
          id: 'rescue_pet_charge',
          text: 'Charge the walkers with my melee weapon and pull ' + target + ' down to safety',
          consequenceSummary: 'Slay the walkers and rescue ' + target + ' into camp (+100% Mind/Sanity)!',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Rescued alive and healthy' };
            const petCompanion = generateCompanionFromBackstory(state.player, bs, 'healthy');

            return {
              state: {
                ...state,
                campMembers: [...state.campMembers, petCompanion],
                isCampEstablished: true,
                player: { ...state.player, backstory: updatedBs, sanity: 100 },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 3, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I fought through the walkers in the courtyard and pulled ' + target + ' into my arms! We survived Day 0, and now we are reunited in camp!',
              outcomeTitle: target + ' Rescued & Reunited!',
              outcomeText: target + ' leaped into my arms with frantic whimpers, licking the soot from my face. We are reunited at last! (Mind restored to 100%)'
            };
          }
        },
        {
          id: 'treat_pet_firstaid',
          text: 'Dispatch the walkers from distance, then immediately bandage ' + target + '\'s bleeding paw',
          consequenceSummary: 'Treats ' + target + '\'s wound with sterile dressing (+Guardian at full 100% Health).',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Treated wounds and welcomed into camp' };
            const petCompanion: CampMember = {
              id: 'pet_' + bs.id,
              name: target + ' (' + relation + ')',
              age: 3,
              profession: 'Loyal Camp Guardian',
              relation: relation + ' 🐕',
              bio: 'Faithful four-legged guardian, nursing a bandaged paw.',
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
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 3, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I eliminated the infected, bandaged ' + target + '\'s injured paw with sterile dressing, and carried him home to camp.',
              outcomeTitle: 'Healed & Brought Home',
              outcomeText: 'I bound ' + target + '\'s paw carefully. He rested his chin on my shoulder as we walked back to safety. A true bond unbroken.'
            };
          }
        }
      ]
    };
  }

  // B. RIVAL CLIMAX (Justice / Revenge / Irony)
  if (isRival) {
    const isTurnedAlready = (currentDay % 2 === 0);

    if (isTurnedAlready) {
      // Ironic Justice: Found already turned!
      return {
        id: 'bs_ch5_' + bs.id + '_' + currentDay,
        title: target + ': The Ironic Justice',
        category: 'hazard',
        dangerLevel: 'medium',
        description: 'I breach the fenced supply depot. The stolen truck is crashed against a concrete pylon, doors hanging open. Dragging itself across the gravel is ' + target + '—already transformed into a snarling, decaying crawler with his jaw slackened and eyes milky white.',
        choices: [
          {
            id: 'ch5_rival_mercy_shot',
            text: 'Put a clean bullet through ' + target + '\'s skull and reclaim our stolen emergency cache',
            consequenceSummary: 'Poetic justice: Reclaims military MREs, clean water, and shotgun (+5 Food, +4 Water, +Shotgun, +100% Sanity)!',
            execute: (state: GameState) => {
              const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'avenged', outcomeSummary: 'Found turned into walker; put down and cache reclaimed' };
              const loot = [
                { id: 'reclaimed_food_5', name: 'Military Rations (5)', category: 'food' as const, quantity: 5, description: 'Reclaimed emergency food.' },
                { id: 'reclaimed_water_4', name: 'Clean Bottled Water (4)', category: 'water' as const, quantity: 4, description: 'Clean drinking water.' },
                { id: 'reclaimed_shotgun', name: 'Pump-Action Shotgun', category: 'weapon' as const, quantity: 1, description: 'Heavy 12-gauge shotgun.' }
              ];
              let inv = [...state.inventory];
              for (const item of loot) {
                const ex = inv.find(i => i.id === item.id);
                if (ex) ex.quantity += item.quantity;
                else inv.push(item);
              }
              return {
                state: { ...state, inventory: inv, player: { ...state.player, backstory: updatedBs, sanity: 100 }, stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 1 } },
                log: 'I found ' + target + ' already transformed into an infected crawler. I put a bullet through his skull and reclaimed our stolen stockpile. Justice has been served.',
                outcomeTitle: 'Poetic Justice',
                outcomeText: 'The man who left me to die in a locked basement became the very monster he feared. I reclaimed all our stolen supplies. (Mind restored to 100%)'
              };
            }
          }
        ]
      };
    } else {
      // Live Confrontation
      return {
        id: 'bs_ch5_' + bs.id + '_' + currentDay,
        title: target + ': The Final Confrontation',
        category: 'hazard',
        dangerLevel: 'high',
        description: 'Behind the depot fence, I corner ' + target + ' loading our stolen emergency supplies into his truck. He turns around with his weapon raised and sneers: "You tracked me across half the city? You should have stayed dead in that cellar!"',
        choices: [
          {
            id: 'ch5_confront_kill',
            text: 'Draw my weapon, fire first, and eliminate ' + target + ' on the spot',
            consequenceSummary: 'Vengeance delivered. Reclaim the full stolen cache (+5 Food, +4 Water, +Shotgun, +30 Sanity).',
            execute: (state: GameState) => {
              const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'avenged', outcomeSummary: 'Confronted and eliminated traitor; reclaimed cache' };
              const loot = [
                { id: 'reclaimed_food_5', name: 'Military Rations (5)', category: 'food' as const, quantity: 5, description: 'Reclaimed emergency food.' },
                { id: 'reclaimed_water_4', name: 'Clean Bottled Water (4)', category: 'water' as const, quantity: 4, description: 'Clean drinking water.' },
                { id: 'reclaimed_shotgun', name: 'Pump-Action Shotgun', category: 'weapon' as const, quantity: 1, description: 'Heavy 12-gauge shotgun.' }
              ];
              let inv = [...state.inventory];
              for (const item of loot) {
                const ex = inv.find(i => i.id === item.id);
                if (ex) ex.quantity += item.quantity;
                else inv.push(item);
              }
              return {
                state: { ...state, inventory: inv, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 30) } },
                log: 'I fired first and eliminated ' + target + ' in the depot. Reclaimed our entire stolen emergency stockpile.',
                outcomeTitle: 'Traitor Eliminated',
                outcomeText: 'He dropped his gun and fell into the gravel. I reclaimed all our stolen food, water, and weapons. The debt is paid.'
              };
            }
          },
          {
            id: 'ch5_confront_mercy',
            text: 'Disarm him at gunpoint, take all the supplies, and exile him into the wasteland',
            consequenceSummary: 'Merciful justice: Strip his gear and exile him unarmed (+20 Sanity).',
            execute: (state: GameState) => {
              const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'avenged', outcomeSummary: 'Disarmed and exiled into the ruins' };
              const loot = [
                { id: 'reclaimed_food_5', name: 'Military Rations (5)', category: 'food' as const, quantity: 5, description: 'Reclaimed emergency food.' },
                { id: 'reclaimed_water_4', name: 'Clean Bottled Water (4)', category: 'water' as const, quantity: 4, description: 'Clean drinking water.' }
              ];
              let inv = [...state.inventory];
              for (const item of loot) {
                const ex = inv.find(i => i.id === item.id);
                if (ex) ex.quantity += item.quantity;
                else inv.push(item);
              }
              return {
                state: { ...state, inventory: inv, player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 20) } },
                log: 'I disarmed ' + target + ' at gunpoint, seized the stolen supplies, and exiled him into the wasteland unarmed.',
                outcomeTitle: 'Merciful Exile',
                outcomeText: 'I took back our supplies and watched him retreat into the foggy ruins with his hands raised. I chose not to become a murderer.'
              };
            }
          }
        ]
      };
    }
  }

  // C. FAMILY & FRIENDS CLIMAX: 3 DIVERSE BRANCHING SCENARIOS!
  // Seed scenario using day and name length for true variety
  const outcomeScenario = (currentDay + target.length) % 3;

  // SCENARIO 1 (SAD ENDING / TRAGIC DISCOVERY): Found Fallen & Deceased
  if (outcomeScenario === 0) {
    return {
      id: 'bs_ch5_sad_' + bs.id + '_' + currentDay,
      title: target + ': The Final Stand',
      category: 'hazard',
      dangerLevel: 'low',
      description: 'I breach the sanctuary courtyard and kick the stone shed door open with tears of anticipation. But silence answers. On the bloodstained floorboards lie three neutralized walkers with crushed skulls. Slumped against the altar wall is ' + target + '\'s cold body, holding an empty revolver and a folded note addressed to me: "' + s.player.name + ' — I ran out of bullets. I am sorry I could not hold out longer. Take my supplies and live. Do not let our story die here."',
      choices: [
        {
          id: 'ch5_bury_with_dignity',
          text: 'Carry ' + target + ' to the sanctuary garden, dig a proper grave, and carve a stone memorial marker',
          consequenceSummary: 'Gives eternal peace and emotional closure (+Permanent Resolve, +25 Sanity, inherits heirloom weapon).',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'deceased', outcomeSummary: 'Found fallen after heroic stand; laid to rest with dignity', targetCauseOfDeath: 'Found fallen at St. Michael Church after a heroic stand holding off the swarm so civilians could evacuate.' };
            const heirloom = { id: 'heirloom_gun', name: target + "\'s Service Revolver", category: 'weapon' as const, quantity: 1, description: 'Heirloom revolver carried by ' + target + '.' };
            let inv = [...state.inventory, heirloom];

            return {
              state: {
                ...state,
                inventory: inv,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  sanity: Math.min(100, state.player.sanity + 25),
                  health: Math.min(100, state.player.health + 10)
                }
              },
              log: 'I laid ' + target + ' to rest beneath the courtyard willow tree and carved their name on a stone marker. They fought bravely to the end. Their memory will live in me forever.',
              outcomeTitle: 'Laid to Rest With Dignity',
              outcomeText: 'I dug the grave with my bare hands under the ancient willow. I took ' + target + '\'s heirloom revolver and whispered my final goodbye. Pain transformed into unbreakable resolve. (+25 Sanity)'
            };
          }
        },
        {
          id: 'ch5_swear_survival_vow',
          text: 'Collect ' + target + '\'s belongings, seal the shed, and swear an oath to survive until the end of the world',
          consequenceSummary: 'Hardened survivor mindset (+Permanent determination).',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'deceased', outcomeSummary: 'Swore survival oath over their memory', targetCauseOfDeath: 'Overrun while defending the sanctuary gate; laid to rest under the church memorial.' };
            return {
              state: {
                ...state,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  sanity: Math.min(100, state.player.sanity + 20)
                }
              },
              log: 'I collected ' + target + '\'s final letter and gear, sealed the stone shed, and swore an oath to survive the apocalypse for both of us.',
              outcomeTitle: 'The Survivor\'s Oath',
              outcomeText: 'I folded ' + target + '\'s letter into my chest pocket. I will not let their sacrifice be in vain. I will endure.'
            };
          }
        }
      ]
    };
  }

  // SCENARIO 2 (HEARTBREAKING BITTEN DYING): Found Bitten Hours Ago
  if (outcomeScenario === 1) {
    return {
      id: 'bs_ch5_bitten_' + bs.id + '_' + currentDay,
      title: target + ': The Feverish Goodbye',
      category: 'hazard',
      dangerLevel: 'high',
      description: 'I smash the padlock open and rush inside with a cry of joy, but my blood runs cold. Slumped against the altar, ' + target + ' is shivering violently with black veins spiderwebbing up their neck. Under their torn sleeve is a dark, inflamed bite mark. They look up with feverish, tear-filled eyes: "' + s.player.name + '... you came... I fought as long as I could... but I was bitten three hours ago... Please, do not let me become one of those monsters."',
      choices: [
        {
          id: 'ch5_amputate_attempt',
          text: 'Attempt emergency field amputation of the bitten limb with surgical tools!',
          consequenceSummary: 'Desperate triage: If medical skill is high, cuts the infection in time to save them as an amputee companion!',
          execute: (state: GameState) => {
            const hasMedSkill = state.player.medicalSkill >= 4 || state.inventory.some(i => i.id.includes('knife') || i.id.includes('scalpel') || i.id.includes('saw'));
            
            if (hasMedSkill) {
              const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'bitten_survived', outcomeSummary: 'Saved through emergency limb amputation' };
              const companion = generateCompanionFromBackstory(state.player, bs, 'amputee');

              return {
                state: {
                  ...state,
                  campMembers: [...state.campMembers, companion],
                  isCampEstablished: true,
                  player: { ...state.player, backstory: updatedBs, sanity: 100 }
                },
                log: 'I performed an agonizing emergency field amputation on ' + target + '\'s bitten forearm and cauterized the wound. It was brutal, but the fever broke! ' + (isFather || isMother ? target + ' (' + companion.name + ')' : companion.name) + ' survived and joined my camp!',
                outcomeTitle: (isFather || isMother ? target + ' (' + companion.name + ')' : companion.name) + ' Rescued!',
                outcomeText: 'I bound the tourniquet and severed the infected tissue before sepsis spread. The fever broke by dawn! ' + (isFather || isMother ? target + ' (' + companion.name + ')' : companion.name) + ' is alive and safe in our camp! (Mind restored to 100%)'
              };
            } else {
              const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'deceased', outcomeSummary: 'Succumbed to infected bite despite triage attempt', targetCauseOfDeath: 'Sustained an infected bite puncture while holding the hospital gate; passed away peacefully before turning.' };
              return {
                state: {
                  ...state,
                  player: { ...state.player, backstory: updatedBs, sanity: Math.max(10, state.player.sanity - 20) }
                },
                log: 'I tried desperately to halt the infection, but the virus had already reached ' + target + '\'s bloodstream. They whispered their final love and passed away in my arms.',
                outcomeTitle: 'Triage Failed',
                outcomeText: 'The infection was too deep. ' + target + ' squeezed my hand one last time, closed their eyes, and slipped away peacefully before turning. I buried them under the garden stone.'
              };
            }
          }
        },
        {
          id: 'ch5_hold_hand_dawn',
          text: 'Sit beside ' + target + ', hold their hand, and stay together through their final lucid hours',
          consequenceSummary: 'Stay by their side so they never die alone. Deep emotional closure.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'deceased', outcomeSummary: 'Held their hand through their final peaceful hours', targetCauseOfDeath: "Fought bravely across the ruins before succumbing to mortal wounds, resting peacefully in their loved one's arms." };
            return {
              state: {
                ...state,
                player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 15), health: Math.min(100, state.player.health + 10) }
              },
              log: 'I sat beside ' + target + ' until sunrise, talking about old times while holding their hand. They passed away peacefully with a smile. I gave them a dignified burial.',
              outcomeTitle: 'A Peaceful Goodbye',
              outcomeText: 'We laughed about childhood memories while candlelight flickered against the stone. ' + target + ' was not alone at the end. I laid them to rest with love.'
            };
          }
        },
        {
          id: 'ch5_grant_mercy',
          text: 'Fulfill their dying wish: grant a swift, painless mercy before the fever turns their mind',
          consequenceSummary: 'Honors their final request. Spares them the agony of turning.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'mercy', outcomeSummary: 'Granted peaceful mercy before turning' };
            return {
              state: {
                ...state,
                player: { ...state.player, backstory: updatedBs, sanity: Math.min(100, state.player.sanity + 10) }
              },
              log: 'With tears streaming down my face, I granted ' + target + ' a swift and painless mercy before the virus could steal their humanity. I laid them to rest.',
              outcomeTitle: 'Mercy Delivered',
              outcomeText: 'They looked at me with gratitude as they closed their eyes. I kept my promise: they never became a monster.'
            };
          }
        }
      ]
    };
  }

  // SCENARIO 3 (HEROIC HAPPY RESCUE): Reunited Alive & Healthy!
  const isLove = bs.theme === 'love' || relation.includes('Spouse') || relation.includes('Fiancé') || relation.includes('Girlfriend') || relation.includes('Boyfriend') || relation.includes('Partner');
  const hasBaseSpouse = s.player.romanceStage === 'married' && s.player.spouseName;
  const hasBaseDating = s.player.romanceStage === 'dating' && s.player.datingTargetName;

  if (isLove && hasBaseSpouse) {
    const baseSpouse = s.player.spouseName;
    return {
      id: 'bs_ch5_alive_spouse_drama_' + bs.id + '_' + currentDay,
      title: target + ': The Impossible Reunion & The Vows Left Behind',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'I breach the sanctuary courtyard! Two walkers are clawing at the stone shed door, but the wood holds. Inside, ' + target + ' shouts defiantly with a metal pipe in hand! My chest heaves with tears and sudden panic: in the brutal months apart, I believed ' + target + ' had died and married ' + baseSpouse + ' in the haven. Finding ' + target + ' alive brings joy, but also a devastating collision of worlds!',
      choices: [
        {
          id: 'ch5_recommit_backstory_spouse',
          text: 'Rescue ' + target + ' into my arms: Reaffirm devotion to my original love (Break the news to ' + baseSpouse + ')',
          consequenceSummary: 'Reunites with ' + target + ' as your true spouse. ' + baseSpouse + ' is heartbroken and steps down to single.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Rescued long-lost spouse and recommitted' };
            const companion = generateCompanionFromBackstory(state.player, bs, 'healthy');
            companion.datingStage = 'married';
            companion.spouseId = 'player';
            companion.spouseName = state.player.name;

            const updatedCamp = state.campMembers.map(m => {
              if (m.id === state.player.spouseId || m.name === baseSpouse) {
                return {
                  ...m,
                  datingStage: 'single' as const,
                  spouseId: undefined,
                  spouseName: undefined,
                  trust: Math.max(20, m.trust - 35)
                };
              }
              return m;
            });

            return {
              state: {
                ...state,
                campMembers: [...updatedCamp, companion],
                isCampEstablished: true,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  spouseId: companion.id,
                  spouseName: companion.name,
                  romanceStage: 'married',
                  sanity: 90
                },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I saved ' + target + ' and brought them home! With tears and heavy guilt, I confessed the truth to ' + baseSpouse + '. ' + baseSpouse + ' was deeply heartbroken, but stepped aside. ' + target + ' has returned as my spouse.',
              outcomeTitle: 'Devotion & Heartbreak',
              outcomeText: target + ' wept in my arms. When we returned to camp, ' + baseSpouse + ' confronted us. The truth was agonizing, but ' + target + ' is home at my side.'
            };
          }
        },
        {
          id: 'ch5_honour_base_spouse',
          text: 'Rescue ' + target + ' from the infected, but gently confess that you married ' + baseSpouse + ' during the apocalypse',
          consequenceSummary: 'Remain loyal to your haven marriage with ' + baseSpouse + '. ' + target + ' stays as a loyal ally and friend.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Rescued alive; agreed to remain loyal friends' };
            const companion = generateCompanionFromBackstory(state.player, bs, 'healthy');
            companion.datingStage = 'single';

            return {
              state: {
                ...state,
                campMembers: [...state.campMembers, companion],
                isCampEstablished: true,
                player: { ...state.player, backstory: updatedBs, sanity: 90 },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I neutralized the walkers and freed ' + target + '. I sat with them in the shed and honestly confessed that I married ' + baseSpouse + ' to survive. ' + target + ' cried in silence, but respected my truth and agreed to join our haven as a loyal ally.',
              outcomeTitle: 'Bittersweet Honesty',
              outcomeText: target + ' held my hands with tear-filled eyes: "I am just glad you survived... even if life moved on." ' + target + ' is now safe in our sanctuary.'
            };
          }
        }
      ]
    };
  }

  if (isLove && hasBaseDating) {
    const datingName = s.player.datingTargetName;
    return {
      id: 'bs_ch5_alive_dating_drama_' + bs.id + '_' + currentDay,
      title: target + ': Reunited Love & The Colony Dilemma',
      category: 'discovery',
      dangerLevel: 'medium',
      description: 'I breach the courtyard and find ' + target + ' holding off infected inside the tool shed! My heart leaps, but I remember that back at camp, I started courting ' + datingName + '.',
      choices: [
        {
          id: 'ch5_reunite_backstory_partner',
          text: 'Rescue ' + target + ' and embrace as true lovers (Breaks off courting with ' + datingName + ')',
          consequenceSummary: 'Reunites with ' + target + ' as your romantic partner. ' + datingName + ' steps back gracefully.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Reunited and resumed romance' };
            const companion = generateCompanionFromBackstory(state.player, bs, 'healthy');
            companion.datingStage = 'dating';
            companion.partnerId = 'player';
            companion.partnerName = state.player.name;

            const updatedCamp = state.campMembers.map(m => {
              if (m.name === datingName) {
                return { ...m, datingStage: 'single' as const, partnerId: undefined, partnerName: undefined };
              }
              return m;
            });

            return {
              state: {
                ...state,
                campMembers: [...updatedCamp, companion],
                isCampEstablished: true,
                player: {
                  ...state.player,
                  backstory: updatedBs,
                  datingTargetId: companion.id,
                  datingTargetName: companion.name,
                  romanceStage: 'dating',
                  sanity: 100
                },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I rescued ' + target + ' and we embraced in tears! I had an honest conversation with ' + datingName + ', who stepped back with grace. ' + target + ' and I are together again!',
              outcomeTitle: 'Reunited in Love',
              outcomeText: 'We held each other tightly as the morning sun rose over the ruins. Our love withstood the end of the world!'
            };
          }
        },
        {
          id: 'ch5_friend_backstory_partner',
          text: 'Rescue ' + target + ', but admit that you have fallen for ' + datingName + ' back at haven',
          consequenceSummary: target + ' joins camp as a dear companion and friend.',
          execute: (state: GameState) => {
            const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Rescued alive; joined as friend' };
            const companion = generateCompanionFromBackstory(state.player, bs, 'healthy');
            companion.datingStage = 'single';

            return {
              state: {
                ...state,
                campMembers: [...state.campMembers, companion],
                isCampEstablished: true,
                player: { ...state.player, backstory: updatedBs, sanity: 90 },
                stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
              },
              log: 'I rescued ' + target + ' and explained that I had begun a new romance with ' + datingName + '. ' + target + ' accepted it and joined our camp as a close companion.',
              outcomeTitle: 'A New Understanding',
              outcomeText: target + ' nodded with understanding: "You kept fighting and living. That is all that matters." They are now safe in camp.'
            };
          }
        }
      ]
    };
  }

  // Standard Heroic Reunion (Single or family/friend)
  return {
    id: 'bs_ch5_alive_' + bs.id + '_' + currentDay,
    title: target + ': Reunited at the Sanctuary',
    category: 'discovery',
    dangerLevel: 'medium',
    description: "I breach the sanctuary courtyard! Two walkers are clawing at the stone tool shed door, but the wood hasn't given way! From inside, " + target + "'s voice shouts with fierce defiance: \"Stay back, I have a pipe!\" " + target + " is completely unbitten and fighting for their life!",
    choices: [
      {
        id: 'ch5_heroic_rescue_alive',
        text: 'Strike down both walkers, smash the padlock, and pull ' + target + ' into my arms!',
        consequenceSummary: 'Rescue ' + target + ' alive and healthy. They join your camp as a loyal ally (+100% Mind/Sanity)!',
        execute: (state: GameState) => {
          const updatedBs = { ...advanceBackstoryChapter(bs, 5, currentDay, true), outcome: 'reunited', outcomeSummary: 'Rescued alive and healthy' };
          const companion = generateCompanionFromBackstory(state.player, bs, 'healthy');

          return {
            state: {
              ...state,
              campMembers: [...state.campMembers, companion],
              isCampEstablished: true,
              player: { ...state.player, backstory: updatedBs, sanity: 100 },
              stats: { ...state.stats, zombiesEliminated: state.stats.zombiesEliminated + 2, peopleSaved: state.stats.peopleSaved + 1 }
            },
            log: 'I eliminated the walkers in the courtyard and broke ' + target + ' out of the stone shed! We embraced with tears of joy. ' + (isFather || isMother ? target + ' (' + companion.name + ')' : companion.name) + ' joined my camp! Journey completed!',
            outcomeTitle: (isFather || isMother ? target + ' (' + companion.name + ')' : companion.name) + ' Reunited at Last!',
            outcomeText: target + ' burst out of the shed into my arms, crying tears of relief. After weeks of fighting through the dead city, we found each other alive and well! ' + companion.name + ' is now safe in our camp! (Mind restored to 100%)'
          };
        }
      }
    ]
  };
}
