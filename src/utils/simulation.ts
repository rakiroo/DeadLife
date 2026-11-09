import { GameState, LogEntry, WeatherType, StatusEffect, CampMember, Survivor, Season } from '../types/game';

export function getSeason(day: number): Season {
  const dayOfYear = day % 365;
  if (dayOfYear < 90) return 'spring';
  if (dayOfYear < 180) return 'summer';
  if (dayOfYear < 270) return 'autumn';
  return 'winter';
}
import { getRandomSurvivalEvent } from '../data/events';
import { generateDailyHappenings } from '../data/dailyHappenings';
import { getRandomMicroDilemma } from '../data/microDilemmas';
import { getNextBackstoryDilemma } from '../data/backstoryQuests';

const WEATHERS: WeatherType[] = ['clear', 'heavy_rain', 'dense_fog', 'freezing_cold', 'thunderstorm'];


// Helper to check and generate legacy succession prompt if player has adult offspring or trusted companions
export function createSuccessionPromptIfEligible(
  player: Survivor,
  campMembers: CampMember[],
  cause: string
): GameState['legacySuccessionPrompt'] {
  const childrenCandidates = (player.children || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    relation: c.age >= 16 ? 'Adult Offspring' : c.age >= 10 ? 'Adolescent Heir' : 'Child Heir',
    profession: c.age >= 16 ? 'Dynasty Heir' : 'Young Colony Heir',
    age: c.age,
    isOffspring: true,
    skills: c.skills || { combat: 5, medical: 5, crafting: 5, stealth: 5, fitness: 5 }
  }));

  const companionCandidates = campMembers.filter(m => !m.isChild && m.trust >= 40).map(m => ({
    id: m.id,
    name: m.name,
    relation: m.relation || 'Trusted Ally',
    profession: m.profession,
    age: m.age,
    isOffspring: false,
    skills: {
      combat: m.combatSkill || 5,
      medical: m.medicalSkill || 5,
      crafting: m.craftingSkill || 5,
      stealth: m.stealthSkill || 5,
      fitness: m.fitnessSkill || 5
    }
  }));

  const candidates = [...childrenCandidates, ...companionCandidates];
  if (player.will?.designatedHeirId) {
    const willHeirId = player.will.designatedHeirId;
    const willCandidate = candidates.find(c => c.id === willHeirId);
    if (willCandidate) {
      willCandidate.relation = 'Designated Heir in Will (' + (player.will.creedTitle || 'Dynasty Creed') + ')';
      candidates.sort((a, b) => a.id === willHeirId ? -1 : b.id === willHeirId ? 1 : 0);
    }
  }
  if (candidates.length > 0) {
    return {
      cause,
      deceasedName: player.name,
      deceasedAge: player.age,
      candidates
    };
  }
  return null;
}

export function advanceOneDay(state: GameState): GameState {
  if (state.player.isDead) return state;

  const currentDay = state.day + 1;
  const newLogs: LogEntry[] = [];
  let { health, sanity, hunger, thirst, infectionRisk, statusEffects } = { ...state.player };
  let infectionDays = state.player.infectionDays || 0;
  let isBitten = state.player.isBitten || infectionRisk > 0;
  let biteTreated = state.player.biteTreated || false;
  let { daysWithoutFood, daysWithoutWater } = state;
  let { storedRainwater, barricadeIntegrity } = state.shelter;
  let inventory = [...state.inventory];
  let isDead = false;
  let deathCause: string | undefined;

  // 1. Weather update
  const newWeather = Math.random() < 0.35 
    ? WEATHERS[Math.floor(Math.random() * WEATHERS.length)] 
    : state.weather;
  
  let temp = state.temperatureCelsius;
  if (newWeather === 'freezing_cold') temp = Math.max(-10, temp - 8);
  else if (newWeather === 'heavy_rain') temp = Math.max(8, temp - 3);
  else temp = 18;

  // 2. Water consumption
  const waterItem = inventory.find(i => i.category === 'water' && i.quantity > 0);
  if (waterItem) {
    inventory = inventory.map(i => i === waterItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
    thirst = Math.min(100, thirst + 20);
    daysWithoutWater = 0;
  } else if (storedRainwater >= 1) {
    storedRainwater -= 1;
    thirst = Math.min(100, thirst + 15);
    daysWithoutWater = 0;
  } else {
    daysWithoutWater += 1;
    thirst = Math.max(0, thirst - 35);
    const dehydrationDamage = daysWithoutWater * 18;
    health -= dehydrationDamage;
    sanity -= 15;
    newLogs.push({
      id: `log_thirst_${Date.now()}_${Math.random()}`,
      day: currentDay,
      text: `⚠️ DEHYDRATION (Day ${daysWithoutWater}): My mouth is dry as ash. Severe headache and muscle cramps (-${dehydrationDamage}% HP).`,
      type: 'hazard',
      timestamp: 'Dawn'
    });
    if (health <= 0) {
      isDead = true;
      deathCause = 'succumbed to severe dehydration';
    }
  }

  // 3. Food consumption (directly impacts HP)
  const foodItem = inventory.find(i => i.category === 'food' && i.quantity > 0);
  if (foodItem) {
    inventory = inventory.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
    daysWithoutFood = 0;
    // Eating daily food stabilizes and restores HP directly
    health = Math.min(100, health + 6);
  } else {
    daysWithoutFood += 1;
    const starvationDamage = daysWithoutFood * 14;
    health -= starvationDamage;
    sanity -= 8;
    newLogs.push({
      id: `log_hunger_${Date.now()}_${Math.random()}`,
      day: currentDay,
      text: `⚠️ STARVATION (Day ${daysWithoutFood}): No food rations available. Starvation damages my body directly (-${starvationDamage}% HP).`,
      type: 'hazard',
      timestamp: 'Morning'
    });
    if (health <= 0 && !isDead) {
      isDead = true;
      deathCause = 'starved to death from lack of food';
    }
  }

  // 4. Rain collection
  if (state.shelter.isEstablished && (newWeather === 'heavy_rain' || newWeather === 'thunderstorm')) {
    const collected = Math.min(state.shelter.maxRainwater - storedRainwater, state.shelter.waterCollectorLevel * 3 + 2);
    if (collected > 0) {
      storedRainwater += collected;
      newLogs.push({
        id: `log_rain_${Date.now()}_${Math.random()}`,
        day: currentDay,
        text: `🌧️ Rainwater catchment system captured +${collected} Liters of clean rainwater.`,
        type: 'general',
        timestamp: 'Afternoon'
      });
    }
  }

  // 5. Status effect tick
  const updatedEffects: StatusEffect[] = [];
  for (const eff of statusEffects) {
    if (eff.id === 'bleeding') {
      health -= 20;
      newLogs.push({
        id: `eff_${Date.now()}_${Math.random()}`,
        day: currentDay,
        text: '🩸 Open laceration is still oozing blood. Bandage required to halt blood loss (-20% HP).',
        type: 'medical',
        timestamp: 'Noon'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'bled out from untreated open wounds';
      }
      updatedEffects.push(eff);
    } else if (eff.id === 'bacterial_infection') {
      health -= 15;
      newLogs.push({
        id: `eff_${Date.now()}_${Math.random()}`,
        day: currentDay,
        text: '☣️ Wound margins are inflamed with pus. Bacterial sepsis progressing (-15% HP).',
        type: 'medical',
        timestamp: 'Evening'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'succumbed to septic shock from an infected puncture';
      }
      updatedEffects.push(eff);
    } else {
      updatedEffects.push(eff);
    }
  }

  // 5b. Viral Infection Progression (Mutation Strain & Day-by-Day Progression)
  if (infectionRisk > 0 && !isDead) {
    infectionDays += 1;
    let dailyGrowth = 4;
    const strain = state.mutationStrain;

    // Mutation Strain specific viral transmission & acceleration
    if (strain) {
      if (strain.id === 'crimson_rabies') dailyGrowth += 5; // Rabies-Ultra aggressive sprint
      else if (strain.id === 'toxic_spore_bloom' && (newWeather === 'dense_fog' || newWeather === 'heavy_rain')) dailyGrowth += 3; // Spore miasma
      else if (strain.id === 'glacial_stasis' && newWeather === 'freezing_cold') dailyGrowth += 3; // Cryo-adapted thrive in freeze
      else if (strain.id === 'solar_frenzy' && newWeather === 'clear') dailyGrowth += 2; // Photoreactive adrenaline
      else if (strain.id === 'necrotic_carapace') dailyGrowth -= 1; // Slow calcifying strain
    }

    // Resistance, Triage & Medical modifiers
    if (biteTreated) dailyGrowth = Math.max(1, dailyGrowth - 2);
    const traitIdsForInf = state.player.traits ? state.player.traits.map(t => t.id) : [];
    if (traitIdsForInf.includes('thick_skinned') || traitIdsForInf.includes('stoic') || traitIdsForInf.includes('antibody_carrier')) {
      dailyGrowth = Math.max(1, dailyGrowth - 1);
    }
    if (state.player.medicalSkill >= 7) dailyGrowth = Math.max(1, dailyGrowth - 1);
    if (state.campMembers && state.campMembers.some(m => m.role === 'medic')) dailyGrowth = Math.max(1, dailyGrowth - 1);

    infectionRisk = Math.min(100, infectionRisk + dailyGrowth);

    // Symptoms, damage and authentic survivor journal logs
    if (infectionRisk >= 100) {
      isDead = true;
      deathCause = 'succumbed to the ' + (strain?.name || 'viral') + ' infection and turned';
      newLogs.push({
        id: 'inf_term_' + Date.now(),
        day: currentDay,
        text: '💀 TERMINAL COLLAPSE: The viral load reached 100%. My vision drowned in pitch black as the pathogen seized complete control of my brainstem. My consciousness faded as my body stood back up, lost to the horde.',
        type: 'death',
        timestamp: 'Twilight'
      });
    } else if (infectionRisk >= 75) {
      health -= 12;
      sanity -= 12;
      newLogs.push({
        id: 'inf_delirium_' + Date.now(),
        day: currentDay,
        text: '☣️ VIRAL DELIRIUM (' + infectionRisk + '%): Violent muscle tremors and fever raging at 41°C. Whispers in the darkness and black veins spiderwebbing across my neck (-12% HP, -12 Sanity).',
        type: 'medical',
        timestamp: 'Evening'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'collapsed from terminal viral fever and delirium';
      }
    } else if (infectionRisk >= 50) {
      health -= 6;
      sanity -= 8;
      newLogs.push({
        id: 'inf_sepsis_' + Date.now(),
        day: currentDay,
        text: '☣️ VASCULAR SEPSIS (' + infectionRisk + '%): Dark purple veins radiating from the bite. Severe nausea, bone chills, and splitting headaches wracking my body (-6% HP, -8 Sanity).',
        type: 'medical',
        timestamp: 'Noon'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'succumbed to septic shock from infected bite wound';
      }
    } else if (infectionRisk >= 25) {
      sanity -= 4;
      if (currentDay % 2 === 0) {
        newLogs.push({
          id: 'inf_inc_' + Date.now(),
          day: currentDay,
          text: '☣️ VIRAL SPREAD (' + infectionRisk + '%): The wound margins are burning with sharp, inflamed pain. Chills keep shivering down my spine.',
          type: 'medical',
          timestamp: 'Morning'
        });
      }
    } else {
      if (infectionDays === 1) {
        newLogs.push({
          id: 'inf_day1_' + Date.now(),
          day: currentDay,
          text: '☣️ WOUND INFLAMMATION (' + infectionRisk + '%): The bite puncture is hot and throbbing. Low-grade fever starting to build in my chest.',
          type: 'medical',
          timestamp: 'Dawn'
        });
      }
    }
  }

  // 6. Trait Gameplay Mechanics (Illnesses, Flaws, and Perks in action)
  const traitIds = state.player.traits ? state.player.traits.map(t => t.id) : [];
  const hasTrait = (id: string) => traitIds.includes(id);

  // Diabetic: Needs insulin every 2 days
  if (hasTrait('diabetic')) {
    const insulinItem = inventory.find(i => i.id.includes('insulin') && i.quantity > 0);
    if (insulinItem) {
      if (currentDay % 2 === 0) {
        insulinItem.quantity -= 1;
        inventory = inventory.filter(i => i.quantity > 0);
        newLogs.push({
          id: 'log_med_' + currentDay + '_' + Math.random(),
          day: currentDay,
          text: '💉 Administered daily insulin dose to regulate blood glucose. Condition stable.',
          type: 'medical',
          timestamp: 'Morning'
        });
      }
    } else {
      health -= 12;
      sanity -= 8;
      newLogs.push({
        id: 'log_keto_' + currentDay + '_' + Math.random(),
        day: currentDay,
        text: '⚠️ KETOACIDOSIS: Missing insulin causes severe nausea, fatigue, and blood toxicity (-12% HP).',
        type: 'medical',
        timestamp: 'Morning'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'succumbed to diabetic ketoacidosis without insulin';
      }
    }
  }

  // Asthmatic: Cold or stormy weather triggers attacks unless inhaler is available
  if (hasTrait('asthmatic') && (newWeather === 'freezing_cold' || newWeather === 'heavy_rain')) {
    const inhaler = inventory.find(i => (i.id.includes('inhaler') || i.id.includes('albuterol')) && i.quantity > 0);
    if (inhaler) {
      newLogs.push({
        id: 'log_asthma_' + currentDay + '_' + Math.random(),
        day: currentDay,
        text: '💨 Cold damp air constricted lungs; took a puff of rescue albuterol to breathe clearly.',
        type: 'medical',
        timestamp: 'Morning'
      });
    } else {
      sanity -= 8;
      health -= 5;
      newLogs.push({
        id: 'log_asthma_attack_' + currentDay + '_' + Math.random(),
        day: currentDay,
        text: '⚠️ ASTHMA ATTACK: Cold damp air triggered wheezing and chest tightness (-5% HP, -8 Sanity).',
        type: 'hazard',
        timestamp: 'Morning'
      });
    }
  }

  // Smoker: Nicotine cravings decay sanity unless smoking
  if (hasTrait('smoker')) {
    const cigs = inventory.find(i => (i.id.includes('cigarette') || i.id.includes('tobacco')) && i.quantity > 0);
    if (cigs) {
      cigs.quantity -= 1;
      inventory = inventory.filter(i => i.quantity > 0);
      sanity = Math.min(100, sanity + 12);
      newLogs.push({
        id: 'log_smoke_' + currentDay + '_' + Math.random(),
        day: currentDay,
        text: '🚬 Smoked a cigarette to steady shaking hands and ease the dread (+12 Sanity).',
        type: 'general',
        timestamp: 'Evening'
      });
    } else {
      sanity = Math.max(0, sanity - 6);
      newLogs.push({
        id: 'log_nicotine_' + currentDay + '_' + Math.random(),
        day: currentDay,
        text: '⚠️ NICOTINE WITHDRAWAL: Heavy tobacco cravings cause irritability and brain fog (-6 Sanity).',
        type: 'hazard',
        timestamp: 'Evening'
      });
    }
  }

  // Old Knee Injury: Flares up in freezing cold
  if (hasTrait('knee_injury') && newWeather === 'freezing_cold') {
    health -= 4;
    newLogs.push({
      id: 'log_knee_' + currentDay + '_' + Math.random(),
      day: currentDay,
      text: '❄️ Old knee injury flared up painfully in the freezing cold snap (-4% HP).',
      type: 'hazard',
      timestamp: 'Dawn'
    });
  }

  // Agoraphobic: Panic in the open without shelter
  if (hasTrait('agoraphobic') && !state.shelter.isEstablished && state.startingLocation.hasLeftStartingSpot) {
    sanity = Math.max(0, sanity - 8);
    newLogs.push({
      id: 'log_agora_' + currentDay + '_' + Math.random(),
      day: currentDay,
      text: '⚠️ AGORAPHOBIA: Exposed ruins and wide streets induce severe panic (-8 Sanity).',
      type: 'hazard',
      timestamp: 'Afternoon'
    });
  }

  // Weak Stomach: Extra thirst decay
  if (hasTrait('weak_stomach')) {
    thirst = Math.max(0, thirst - 5);
  }

  // Stoic Perk: Halves all daily sanity loss
  if (hasTrait('stoic')) {
    const sanityLoss = state.player.sanity - sanity;
    if (sanityLoss > 0) {
      sanity = Math.min(100, Math.floor(sanity + sanityLoss * 0.5));
    }
  }

  // Random daily survival happenings (BitLife style)
  const dailyHappenings = generateDailyHappenings(state, currentDay, newWeather);
  dailyHappenings.forEach((text, idx) => {
    newLogs.push({
      id: 'happening_' + currentDay + '_' + idx + '_' + Date.now() + '_' + Math.random(),
      day: currentDay,
      text,
      type: 'general',
      timestamp: idx === 0 ? 'Morning' : 'Afternoon'
    });
  });

  // Daily pregnancy progress (every 30 days)
  let dayPendingBabyNaming = state.pendingBabyNaming || null;
  if (state.player.isPregnant && currentDay % 30 === 0) {
    const pMonths = (state.player.pregnancyMonths || 0) + 1;
    if (pMonths >= 9) {
      state.player.isPregnant = false;
      state.player.pregnancyMonths = 0;
      const babyGender = Math.random() < 0.5 ? 'male' : 'female';
      const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Lucas', 'Julian', 'Elias', 'Finn'];
      const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria'];
      const chosenName = babyGender === 'male' ? boyNames[Math.floor(Math.random() * boyNames.length)] : girlNames[Math.floor(Math.random() * girlNames.length)];
      const surname = state.player.name.split(' ').slice(-1)[0] || 'Vance';
      dayPendingBabyNaming = {
        motherName: state.player.gender === 'female' ? state.player.name : (state.player.spouseName || 'Spouse'),
        fatherName: state.player.gender === 'female' ? (state.player.pregnantWith || 'Unknown Father') : state.player.name,
        gender: babyGender as 'male' | 'female',
        suggestedFirstName: chosenName,
        suggestedLastName: surname,
        isPlayerChild: true
      };
      newLogs.push({
        id: 'birth_player_day_' + Date.now(),
        day: currentDay,
        text: '👶 Delivery Day! 9 months of pregnancy have arrived! A healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' was born in our sanctuary (+25 Morale).',
        type: 'milestone',
        timestamp: 'New Life'
      });
    } else {
      state.player.pregnancyMonths = pMonths;
    }
  }

    // 7. Base Sanctuary & Camp Survivor Simulation
  let campMorale = state.shelter.morale ?? 75;
  const rationPolicy = state.shelter.rationPolicy ?? 'standard';
  
  // Greenhouse food generation
  if (state.shelter.greenhouseLevel && currentDay % 3 === 0) {
    const yieldAmount = state.shelter.greenhouseLevel + 1;
    const foodItem = inventory.find(i => i.id === 'greenhouse_veg' || (i.category === 'food' && i.id.includes('canned')));
    if (foodItem) {
      foodItem.quantity += yieldAmount;
    } else {
      inventory.push({
        id: 'greenhouse_veg',
        name: 'Fresh Harvest Vegetables',
        category: 'food',
        quantity: yieldAmount,
        description: 'Crisp carrots, greens, and beans grown in the rooftop greenhouse.'
      });
    }
    newLogs.push({
      id: 'gh_' + Date.now() + '_' + Math.random(),
      day: currentDay,
      text: '🌱 Rooftop Greenhouse: Harvested +' + yieldAmount + ' fresh vegetable rations for the pantry.',
      type: 'loot',
      timestamp: 'Morning'
    });
  }

  // Camp survivor duties, consumption & sleeping rough checks
  const totalBedsNow = state.shelter.rooms && state.shelter.rooms.length > 0 
    ? state.shelter.rooms.reduce((sum, r) => sum + r.capacity, 0)
    : (state.shelter.maxSurvivors || 4);
  const totalOccupantsNow = state.campMembers.length + 1;
  const hasBedAvailable = totalOccupantsNow <= totalBedsNow;

  const updatedMembers: typeof state.campMembers = [];
  for (const member of state.campMembers) {
    let memberHealth = member.health;
    let trust = member.trust;
    let daysTogether = (member.daysTogether ?? 0) + 1;

    // Food consumption based on ration policy
    const memberFood = inventory.find(i => i.category === 'food' && i.quantity > 0);
    if (rationPolicy === 'full') {
      if (memberFood && memberFood.quantity >= 2) {
        memberFood.quantity -= 2;
        trust = Math.min(100, trust + 2);
        memberHealth = Math.min(100, memberHealth + 5);
      } else if (memberFood) {
        memberFood.quantity -= 1;
      }
    } else if (rationPolicy === 'half') {
      if (currentDay % 2 === 0 && memberFood) {
        memberFood.quantity -= 1;
      }
      trust = Math.max(10, trust - 1);
    } else {
      if (memberFood) {
        memberFood.quantity -= 1;
      } else {
        trust = Math.max(0, trust - 4);
      }
    }
    inventory = inventory.filter(i => i.quantity > 0);

    // Duty logic:
    if (member.role === 'scavenger') {
      const stealth = member.stealthSkill ?? 5;
      const successChance = 0.65 + (stealth * 0.03);
      if (Math.random() < successChance) {
        const lootPool = [
          { id: 'canned_scout_' + Date.now(), name: 'Canned Meat & Beans', category: 'food' as const, quantity: 2, description: 'Sealed provisions retrieved by scout.' },
          { id: 'water_scout_' + Date.now(), name: 'Bottled Spring Water', category: 'water' as const, quantity: 2, description: 'Fresh drinking water scavenged by scout.' },
          { id: 'wood_scout_' + Date.now(), name: 'Lumber Planks (2x4)', category: 'resource' as const, quantity: 1, description: 'Timber retrieved for barricade defense.' },
          { id: 'meds_scout_' + Date.now(), name: 'Sterile Field Dressing', category: 'medical' as const, quantity: 1, description: 'Trauma bandages found in a cabinet.' },
        ];
        const haul = lootPool[Math.floor(Math.random() * lootPool.length)];
        const existing = inventory.find(i => i.name === haul.name || (haul.category === 'food' && i.id.includes('canned')));
        if (existing) {
          existing.quantity += haul.quantity;
        } else {
          inventory.push(haul);
        }
        newLogs.push({
          id: 'scout_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '🎒 Scout ' + member.name + ' returned safely before sunset with ' + haul.name + ' (x' + haul.quantity + ')!',
          type: 'loot',
          timestamp: 'Afternoon'
        });
      } else {
        memberHealth = Math.max(20, memberHealth - 8);
        newLogs.push({
          id: 'scout_ambush_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '⚠️ Scout ' + member.name + ' encountered lurkers while scouting avenues and retreated back with cuts (-8% HP).',
          type: 'hazard',
          timestamp: 'Dusk'
        });
      }
    } else if (member.role === 'medic') {
      const wounded = updatedMembers.find(m => m.health < 80);
      if (wounded) {
        wounded.health = Math.min(100, wounded.health + 15);
        newLogs.push({
          id: 'medic_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '🩺 Medic ' + member.name + ' treated ' + wounded.name + "'s injuries with sterile dressings (+15% HP).",
          type: 'medical',
          timestamp: 'Morning'
        });
      } else if (health < 85) {
        health = Math.min(100, health + 15);
        newLogs.push({
          id: 'medic_player_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '🩺 Medic ' + member.name + ' dressed your wounds (+15% HP).',
          type: 'medical',
          timestamp: 'Morning'
        });
      }
    } else if (member.role === 'craftsman') {
      if (barricadeIntegrity < 100) {
        barricadeIntegrity = Math.min(100, barricadeIntegrity + 6);
        newLogs.push({
          id: 'craft_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '🔨 Builder ' + member.name + ' reinforced weak points along the perimeter barricades (+6% integrity).',
          type: 'general',
          timestamp: 'Afternoon'
        });
      }
    } else if (member.role === 'guard') {
      if (Math.random() < 0.25) {
        newLogs.push({
          id: 'guard_' + Date.now() + '_' + Math.random(),
          day: currentDay,
          text: '🛡️ Guard ' + member.name + ' spotted and quietly neutralized a lone prowler near the outer fence.',
          type: 'combat',
          timestamp: 'Night'
        });
      }
    }

    let isSleepingRough = member.isSleepingRough;
    if (isSleepingRough) {
      if (hasBedAvailable) {
        isSleepingRough = false;
        trust = Math.min(100, trust + 15);
        newLogs.push({
          id: 'bed_found_' + member.id + '_' + Date.now(),
          day: currentDay,
          text: '������️ Bed Assigned: Space opened up in camp! ' + member.name + ' was moved off the floor into a proper bed (+Trust).',
          type: 'camp',
          timestamp: 'Morning'
        });
      } else {
        trust = Math.max(10, trust - 1);
        if (Math.random() < 0.15) {
          newLogs.push({
            id: 'rough_' + member.id + '_' + Date.now(),
            day: currentDay,
            text: '⚠️ Discontent: ' + member.name + ' complained about sleeping on the freezing concrete floor without a mattress (-Trust).',
            type: 'camp',
            timestamp: 'Night'
          });
        }
      }
    }

    updatedMembers.push({
      ...member,
      health: memberHealth,
      trust,
      daysTogether,
      isSleepingRough
    });
  }

  // Roommate bonding check
  if (state.shelter.rooms && state.shelter.rooms.length > 0 && Math.random() < 0.25) {
    for (const r of state.shelter.rooms) {
      if (r.assignedMemberIds && r.assignedMemberIds.length >= 2) {
        const m1 = updatedMembers.find(m => m.id === r.assignedMemberIds[0]);
        const m2 = updatedMembers.find(m => m.id === r.assignedMemberIds[1]);
        if (m1 && m2) {
          newLogs.push({
            id: 'bond_' + Date.now() + '_' + Math.random(),
            day: currentDay,
            text: '💬 Roommates ' + m1.name + ' and ' + m2.name + ' spent the evening sharing candlelight stories in ' + r.name + ' (+Camp Morale).',
            type: 'camp',
            timestamp: 'Evening'
          });
          campMorale = Math.min(100, campMorale + 3);
          break;
        }
      }
    }
  }

  // Pick a dilemma if alive and none active
  let nextDilemma = state.activeDilemma;

  // 1. Backstory Episodic Chapter Pop-Up (PRIORITY: advances player's personal story!)
  if (!nextDilemma && !isDead && state.player.backstory && state.player.backstory.status !== 'resolved') {
    const backstoryDilemma = getNextBackstoryDilemma(state, currentDay);
    if (backstoryDilemma) {
      nextDilemma = backstoryDilemma;
    }
  }

  // 2. Random micro-dilemma or survival event
  if (!nextDilemma && !isDead && Math.random() < 0.65) {
    if (Math.random() < 0.45) {
      nextDilemma = getRandomMicroDilemma(state) || getRandomSurvivalEvent(state);
    } else {
      nextDilemma = getRandomSurvivalEvent(state) || getRandomMicroDilemma(state);
    }
  }

  return {
    ...state,
    day: currentDay,
    weather: newWeather,
    temperatureCelsius: temp,
    daysWithoutFood,
    daysWithoutWater,
    inventory,
    campMembers: updatedMembers,
    shelter: {
      ...state.shelter,
      storedRainwater,
      barricadeIntegrity
    },
    player: {
      ...state.player,
      health: Math.max(0, health),
      sanity: Math.max(0, Math.min(100, sanity)),
      hunger: Math.max(0, Math.min(100, hunger || 100)),
      thirst: Math.max(0, Math.min(100, thirst)),
      infectionRisk,
      statusEffects: updatedEffects,
      isDead,
      deathCause
    },
    logs: [...state.logs, ...newLogs].slice(-150),
    pendingBabyNaming: dayPendingBabyNaming,
    activeDilemma: nextDilemma,
    stats: {
      ...state.stats,
      daysSurvived: isDead ? state.stats.daysSurvived : currentDay
    }
  };
}

export function advanceOneWeek(state: GameState): GameState {
  if (state.player.isDead) return state;

  let currentState = { ...state };
  const weekStartDay = currentState.day + 1;
  const weekEndDay = currentState.day + 7;

  const weeklyNarrative: string[] = [];

  // Run day by day simulation for 7 days
  for (let d = 0; d < 7; d++) {
    currentState = advanceOneDay({
      ...currentState,
      activeDilemma: null // Don't block daily loop until after week summary
    });

    if (currentState.player.isDead) {
      break;
    }
  }

  // Add high level weekly recap
  if (!currentState.player.isDead) {
    weeklyNarrative.push("Seven days slipped by in fortified isolation. Hands calloused from routine chores and barricade checks, I watched the empty horizon.");

    // Pick 1 major event for the conclusion of the week
    currentState.activeDilemma = getRandomSurvivalEvent(currentState);
  }

  const recapLog: LogEntry = {
    id: `log_week_${Date.now()}`,
    day: currentState.day,
    text: weeklyNarrative[0] || `Week ended with tragic loss on Day ${currentState.day}.`,
    type: 'milestone',
    timestamp: 'Week End'
  };

  return {
    ...currentState,
    logs: [...currentState.logs, recapLog].slice(-150)
  };
}


export function advanceOneMonth(state: GameState): GameState {
  if (state.player.isDead) return state;

  let currentState = { ...state };
  const currentDay = currentState.day + 30;
  const newLogs: LogEntry[] = [];
  let inventory = currentState.inventory.map(i => ({ ...i }));
  let campMembers = currentState.campMembers.map(m => ({ ...m }));
  let shelter = { ...currentState.shelter };
  let player = { ...currentState.player };

  // 1. Resource Balance: 30 days of consumption vs production
  const totalConsumers = Math.max(1, campMembers.length + 1);
  const rationPolicy = shelter.rationPolicy ?? 'standard';
  const foodPerPerson = rationPolicy === 'half' ? 15 : rationPolicy === 'full' ? 45 : 30;
  const waterPerPerson = 30;

  const totalFoodNeeded = totalConsumers * foodPerPerson;
  const totalWaterNeeded = totalConsumers * waterPerPerson;

  const greenhouseLevel = shelter.greenhouseLevel || 0;
  const gardenFoodYield = greenhouseLevel * 12;
  const coopFoodYield = shelter.hasChickenCoop ? 40 : 0;
  const waterCollectorLevel = shelter.waterCollectorLevel || 1;
  const rainwaterYield = waterCollectorLevel * 18;
  const wellWaterYield = shelter.hasSanctuaryWell ? 65 : 0;
  const scoutsCount = campMembers.filter(m => m.role === 'scavenger').length;
  const scoutFoodYield = scoutsCount * 14;
  const scoutWaterYield = scoutsCount * 10;
  const scoutMatsYield = scoutsCount * 4;

  const totalFoodGenerated = gardenFoodYield + scoutFoodYield + coopFoodYield;
  const totalWaterGenerated = rainwaterYield + scoutWaterYield + wellWaterYield;

  const existingFood = inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
  const existingWater = inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);

  let toDeduct = Math.min(existingFood, totalFoodNeeded);
  for (const item of inventory) {
    if (item.category === 'food' && toDeduct > 0) {
      const take = Math.min(item.quantity, toDeduct);
      item.quantity -= take;
      toDeduct -= take;
    }
  }

  if (gardenFoodYield > 0) {
    inventory.push({
      id: 'harvest_veg_' + Date.now(),
      name: 'Greenhouse Harvest Rations',
      category: 'food',
      quantity: gardenFoodYield,
      description: 'Monthly yield of fresh potatoes, carrots, and beans.'
    });
  }

  let toDeductWater = Math.min(existingWater, totalWaterNeeded);
  for (const item of inventory) {
    if (item.category === 'water' && toDeductWater > 0) {
      const take = Math.min(item.quantity, toDeductWater);
      item.quantity -= take;
      toDeductWater -= take;
    }
  }

  if (scoutMatsYield > 0) {
    inventory.push({
      id: 'scout_wood_' + Date.now(),
      name: 'Lumber Planks (2x4)',
      category: 'resource',
      quantity: scoutMatsYield,
      description: 'Lumber salvaged by scout teams over the past month.'
    });
  }
  if (coopFoodYield > 0) {
    inventory.push({
      id: 'coop_eggs_' + Date.now(),
      name: 'Fresh Farm Eggs (Crate)',
      category: 'food',
      quantity: coopFoodYield,
      description: 'Dozens of fresh eggs gathered from the sanctuary chicken coop over the past month.'
    });
  }
  if (wellWaterYield > 0) {
    inventory.push({
      id: 'well_water_' + Date.now(),
      name: 'Purified Aquifer Water (Barrels)',
      category: 'water',
      quantity: wellWaterYield,
      description: 'Fresh drinking water pumped from the sanctuary aquifer well over the month.'
    });
  }

  inventory = inventory.filter(i => i.quantity > 0);

  const starvationOccurred = existingFood + totalFoodGenerated < totalFoodNeeded;
  const thirstOccurred = existingWater + totalWaterGenerated < totalWaterNeeded;

  if (starvationOccurred || thirstOccurred) {
    player.health = Math.max(15, player.health - 25);
    player.sanity = Math.max(10, player.sanity - 20);
    shelter.morale = Math.max(10, (shelter.morale ?? 75) - 25);
    newLogs.push({
      id: 'famine_' + Date.now(),
      day: currentDay,
      text: '⚠️ MONTHLY FAMINE: Stockpiles ran low during the month. Half-rations and rationing kept survivors alive, but hunger and fatigue took a heavy toll (-25% HP, -25 Morale).',
      type: 'hazard',
      timestamp: 'Month End'
    });
  } else {
    shelter.morale = Math.min(100, (shelter.morale ?? 75) + 5);
    player.sanity = Math.min(100, player.sanity + 10);
  }

  // 2. Autonomous Romances, Marriages & Co-habitation
  // Roommates have a natural affinity bonus, but any single adults across the whole colony can fall in love!
  let s1: CampMember | undefined;
  let s2: CampMember | undefined;
  let sharedRoomName: string | undefined;

  if (shelter.rooms && shelter.rooms.length > 0 && Math.random() < 0.50) {
    for (const room of shelter.rooms) {
      if (room.assignedMemberIds && room.assignedMemberIds.length >= 2) {
        const roomSingles = campMembers.filter(m => 
          room.assignedMemberIds.includes(m.id) && 
          !m.isChild && 
          (!m.datingStage || m.datingStage === 'single' || m.datingStage === 'crush' || m.datingStage === 'dating')
        );
        if (roomSingles.length >= 2) {
          s1 = roomSingles[0];
          s2 = roomSingles[1];
          sharedRoomName = room.name;
          break;
        }
      }
    }
  }

  const singleAdults = campMembers.filter(m => !m.isChild && (!m.datingStage || m.datingStage === 'single' || m.datingStage === 'crush'));
  if (!s1 || !s2) {
    if (singleAdults.length >= 2) {
      const shuffled = [...singleAdults].sort(() => Math.random() - 0.5);
      s1 = shuffled[0];
      s2 = shuffled[1];
    }
  }

  if (s1 && s2 && Math.random() < 0.55) {
    if (!s1.datingStage || s1.datingStage === 'single') {
      s1.datingStage = 'dating';
      s2.datingStage = 'dating';
      s1.partnerId = s2.id;
      s1.partnerName = s2.name;
      s2.partnerId = s1.id;
      s2.partnerName = s1.name;
      newLogs.push({
        id: 'dating_' + Date.now(),
        day: currentDay,
        text: sharedRoomName ? ('❤️ Romance in ' + sharedRoomName + ': Sharing quarters for months brought ' + s1.name + ' and ' + s2.name + ' closer together. They have officially started dating!') : ('❤️ Romance Blooms: Spending long evenings together around the camp, ' + s1.name + ' and ' + s2.name + ' have fallen in love and started dating!'),
        type: 'camp',
        timestamp: 'Romance'
      });
    } else if (s1.datingStage === 'dating') {
      s1.datingStage = 'married';
      s2.datingStage = 'married';
      s1.spouseId = s2.id;
      s1.spouseName = s2.name;
      s2.spouseId = s1.id;
      s2.spouseName = s1.name;
      shelter.marriagesCount = (shelter.marriagesCount || 0) + 1;
      shelter.morale = Math.min(100, (shelter.morale ?? 75) + 15);

      if (shelter.rooms && shelter.rooms.length > 0) {
        const sharedRoom = shelter.rooms.find(r => r.type === 'cabin' || r.capacity >= 2) || shelter.rooms[0];
        if (sharedRoom) {
          sharedRoom.assignedMemberIds = Array.from(new Set([...(sharedRoom.assignedMemberIds || []), s1.id, s2.id]));
        }
      }

      newLogs.push({
        id: 'wedding_' + Date.now(),
        day: currentDay,
        text: '💍 Wedding at the Haven: ' + s1.name + ' and ' + s2.name + ' exchanged vows in the courtyard at sunset! The entire colony toasted, and they moved into shared quarters together (+15 Morale).',
        type: 'milestone',
        timestamp: 'Wedding'
      });
    }
  }

  // Floor sleeping desertion check: unhoused survivors with low trust may volunteer to leave
  for (let i = campMembers.length - 1; i >= 0; i--) {
    const m = campMembers[i];
    if (m.isSleepingRough && m.trust < 30 && Math.random() < 0.40) {
      newLogs.push({
        id: 'desert_' + m.id + '_' + Date.now(),
        day: currentDay,
        text: '�=ު Colony Departure: Exhausted after sleeping on the freezing concrete floor for months without a bed, ' + m.name + ' packed their rucksack at dawn and volunteered to leave the sanctuary in search of better shelter (-5 Morale).',
        type: 'camp',
        timestamp: 'Departure'
      });
      campMembers.splice(i, 1);
      shelter.morale = Math.max(10, (shelter.morale ?? 75) - 5);
      break;
    }
  }

  // 3. Pregnancy Progress & Delivery
  let pendingBabyNaming = currentState.pendingBabyNaming || null;

  // Progress player pregnancy if active
  if (player.isPregnant) {
    player.pregnancyMonths = (player.pregnancyMonths || 0) + 1;
    if (player.pregnancyMonths >= 9) {
      player.isPregnant = false;
      player.pregnancyMonths = 0;
      const babyGender = Math.random() < 0.5 ? 'male' : 'female';
      const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Lucas', 'Julian', 'Elias', 'Finn'];
      const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria'];
      const chosenName = babyGender === 'male' ? boyNames[Math.floor(Math.random() * boyNames.length)] : girlNames[Math.floor(Math.random() * girlNames.length)];
      const surname = player.name.split(' ').slice(-1)[0] || 'Vance';

      pendingBabyNaming = {
        motherName: player.gender === 'female' ? player.name : (player.spouseName || 'Spouse'),
        fatherName: player.gender === 'female' ? (player.pregnantWith || 'Unknown Father') : player.name,
        gender: babyGender as 'male' | 'female',
        suggestedFirstName: chosenName,
        suggestedLastName: surname,
        isPlayerChild: true
      };

      newLogs.push({
        id: 'birth_player_' + Date.now(),
        day: currentDay,
        text: '👶 Delivery Day: After 9 months of pregnancy, the labor was successful! A healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' has arrived! Choose their name to welcome them (+25 Morale).',
        type: 'milestone',
        timestamp: 'New Life'
      });
      shelter.morale = Math.min(100, (shelter.morale ?? 75) + 25);
    } else {
      newLogs.push({
        id: 'preg_track_' + Date.now(),
        day: currentDay,
        text: '🤰 Pregnancy Month ' + player.pregnancyMonths + '/9: The pregnancy is progressing smoothly under shelter care. Expected in ' + (9 - player.pregnancyMonths) + ' months.',
        type: 'camp',
        timestamp: 'Pregnancy'
      });
    }
  }

  // Progress camp members pregnancies
  campMembers = campMembers.map(m => {
    if (m.isPregnant) {
      const months = (m.pregnancyMonths || 0) + 1;
      if (months >= 9) {
        const babyGender = Math.random() < 0.5 ? 'male' : 'female';
        const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Lucas', 'Julian', 'Elias', 'Finn'];
        const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria'];
        const chosenName = babyGender === 'male' ? boyNames[Math.floor(Math.random() * boyNames.length)] : girlNames[Math.floor(Math.random() * girlNames.length)];
        const surname = m.name.split(' ').slice(-1)[0] || 'Haven';

        if (!pendingBabyNaming) {
          pendingBabyNaming = {
            motherName: m.name,
            fatherName: m.partnerName || m.spouseName || (m.pregnantFatherId === 'player' ? player.name : 'Unknown Father'),
            gender: babyGender as 'male' | 'female',
            suggestedFirstName: chosenName,
            suggestedLastName: surname,
            isPlayerChild: m.pregnantFatherId === 'player',
            parentMemberId: m.id
          };
        }

        newLogs.push({
          id: 'birth_m_' + m.id + '_' + Date.now(),
          day: currentDay,
          text: '👶 New Life in Haven: ' + m.name + ' has delivered a healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' after 9 months of pregnancy! (+20 Morale).',
          type: 'milestone',
          timestamp: 'New Life'
        });
        shelter.morale = Math.min(100, (shelter.morale ?? 75) + 20);

        return { ...m, isPregnant: false, pregnancyMonths: 0 };
      } else {
        return { ...m, pregnancyMonths: months };
      }
    }
    return m;
  });

  // Autonomous New Conceptions (checks birth decree & starvation)
  const birthDecree = shelter.birthDecree ?? 'normal';
  if (birthDecree !== 'austerity' && !starvationOccurred) {
    const marriedCouples = campMembers.filter(m => m.datingStage === 'married' && m.spouseId);
    const playerMarried = player.romanceStage === 'married';
    const hasNursery = shelter.hasNursery;
    let baseConceptionChance = hasNursery ? 0.35 : 0.20;
    if (birthDecree === 'encouraged') baseConceptionChance += 0.25;

    if (playerMarried && !player.isPregnant && Math.random() < baseConceptionChance) {
      if (player.gender === 'female') {
        player.isPregnant = true;
        player.pregnancyMonths = 1;
        player.pregnantWith = player.spouseName;
      } else {
        const spouseObj = campMembers.find(m => m.id === player.spouseId);
        if (spouseObj && !spouseObj.isPregnant) {
          spouseObj.isPregnant = true;
          spouseObj.pregnancyMonths = 1;
          spouseObj.pregnantFatherId = 'player';
        }
      }
      newLogs.push({
        id: 'conception_player_' + Date.now(),
        day: currentDay,
        text: '🌸 Wonder & Hope: You and ' + player.spouseName + ' found out you are expecting a baby! The child will be born in 9 months (+15 Morale).',
        type: 'camp',
        timestamp: 'Family'
      });
      shelter.morale = Math.min(100, (shelter.morale ?? 75) + 15);
    } else if (marriedCouples.length > 0 && Math.random() < baseConceptionChance) {
      const parent = marriedCouples[Math.floor(Math.random() * marriedCouples.length)];
      if (!parent.isPregnant) {
        parent.isPregnant = true;
        parent.pregnancyMonths = 1;
        newLogs.push({
          id: 'conception_camp_' + Date.now(),
          day: currentDay,
          text: '🌸 Colony Miracle: ' + parent.name + ' and ' + (parent.spouseName || 'their spouse') + ' are expecting a baby in 9 months! (+10 Morale).',
          type: 'camp',
          timestamp: 'Family'
        });
        shelter.morale = Math.min(100, (shelter.morale ?? 75) + 10);
      }
    }
  }

  // Monthly Viral Infection Progress (30 Days of Incubation / Sepsis)
  if (player.infectionRisk && player.infectionRisk > 0 && !player.isDead) {
    player.infectionDays = (player.infectionDays || 0) + 30;
    const antibioticItems = inventory.filter(i => i.id.includes('antibiotic') || i.name.toLowerCase().includes('antibiotic'));
    const totalAntibiotics = antibioticItems.reduce((s, i) => s + i.quantity, 0);

    if (totalAntibiotics >= 2) {
      let needed = 2;
      for (const item of inventory) {
        if ((item.id.includes('antibiotic') || item.name.toLowerCase().includes('antibiotic')) && needed > 0) {
          const take = Math.min(item.quantity, needed);
          item.quantity -= take;
          needed -= take;
        }
      }
      player.infectionRisk = Math.max(5, player.infectionRisk - 20);
      newLogs.push({
        id: 'inf_month_med_' + Date.now(),
        day: currentDay,
        text: '💊 Monthly Triage Regimen: Consumed 2 courses of Amoxicillin over the past 30 days. Antibiotics aggressively suppressed secondary sepsis and stabilized the viral pathogen (-20% Viral Load, currently ' + player.infectionRisk + '%).',
        type: 'medical',
        timestamp: 'Month End'
      });
    } else {
      const surge = 35;
      player.infectionRisk = Math.min(100, player.infectionRisk + surge);
      if (player.infectionRisk >= 100) {
        player.isDead = true;
        player.deathCause = 'succumbed to untreated ' + (state.mutationStrain?.name || 'viral') + ' infection during the month';
        newLogs.push({
          id: 'inf_month_death_' + Date.now(),
          day: currentDay,
          text: '💀 TERMINAL TRANSFORMATION: Without antibiotics to hold the virus at bay over the 30 days, the pathogen consumed your central nervous system. The colony found you turned in your quarters.',
          type: 'death',
          timestamp: 'Month End'
        });
      } else {
        player.health = Math.max(10, player.health - 25);
        player.sanity = Math.max(5, player.sanity - 25);
        newLogs.push({
          id: 'inf_month_surge_' + Date.now(),
          day: currentDay,
          text: '⚠️ MONTHLY VIRAL SURGE (' + player.infectionRisk + '%): Lacking antibiotics over the 30 days, the pathogen spread through your bloodstream. Severe fevers and dark necrotic veins spread across your limbs (-25% HP, -25 Sanity).',
          type: 'hazard',
          timestamp: 'Month End'
        });
      }
    }
  }

  const monthlyRecap: LogEntry = {
    id: 'month_recap_' + Date.now(),
    day: currentDay,
    text: '📅 30 Days Advanced (Day ' + currentDay + '): Another month concluded. Food harvest: +' + totalFoodGenerated + ' rations, Water: +' + totalWaterGenerated + 'L. Settlement population: ' + (campMembers.length + 1) + ' survivors.',
    type: 'milestone',
    timestamp: 'Month End'
  };

  return {
    ...currentState,
    day: currentDay,
    inventory,
    campMembers,
    shelter,
    player,
    pendingBabyNaming,
    logs: [...currentState.logs, ...newLogs, monthlyRecap].slice(-150)
  };
}

export function advanceOneYear(state: GameState): GameState {
  if (state.player.isDead) return state;

  let currentState = { ...state };
  const currentDay = currentState.day + 365;
  const newLogs: LogEntry[] = [];
  let player = { ...currentState.player };
  let shelter = { ...currentState.shelter };
  let campMembers = currentState.campMembers.map(m => ({ ...m }));
  let inventory = currentState.inventory.map(i => ({ ...i }));

  // 1. Everyone ages by 1 year!
  player.age += 1;
  const hasSchool = shelter.hasSchoolhouse;
  let yearPendingBabyNaming: GameState['pendingBabyNaming'] = currentState.pendingBabyNaming || null;

  if (player.isPregnant) {
    player.isPregnant = false;
    player.pregnancyMonths = 0;
    const babyGender = Math.random() < 0.5 ? 'male' : 'female';
    const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Lucas', 'Julian', 'Elias', 'Finn'];
    const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria'];
    const chosenName = babyGender === 'male' ? boyNames[Math.floor(Math.random() * boyNames.length)] : girlNames[Math.floor(Math.random() * girlNames.length)];
    const surname = player.name.split(' ').slice(-1)[0] || 'Vance';

    yearPendingBabyNaming = {
      motherName: player.gender === 'female' ? player.name : (player.spouseName || 'Spouse'),
      fatherName: player.gender === 'female' ? (player.pregnantWith || 'Unknown Father') : player.name,
      gender: babyGender as 'male' | 'female',
      suggestedFirstName: chosenName,
      suggestedLastName: surname,
      isPlayerChild: true
    };

    newLogs.push({
      id: 'birth_player_year_' + Date.now(),
      day: currentDay,
      text: '👶 Delivery Day! Over the course of the year, your pregnancy was successfully delivered! A healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' was born into our sanctuary (+25 Morale).',
      type: 'milestone',
      timestamp: 'New Life'
    });
    shelter.morale = Math.min(100, (shelter.morale ?? 75) + 25);
  }

  campMembers = campMembers.map(member => {
    const newAge = member.age + 1;
    let stage = member.stage;
    let isChild = member.isChild;
    let profession = member.profession;
    let combatSkill = member.combatSkill || 3;
    let medicalSkill = member.medicalSkill || 3;
    let craftingSkill = member.craftingSkill || 3;
    let stealthSkill = member.stealthSkill || 3;
    let fitnessSkill = member.fitnessSkill || 3;

    if (isChild && hasSchool) {
      combatSkill += 1;
      medicalSkill += 1;
      craftingSkill += 1;
      stealthSkill += 1;
      fitnessSkill += 1;
    }

    if (newAge >= 16) {
      if (isChild) {
        newLogs.push({
          id: 'grad_' + member.id + '_' + Date.now(),
          day: currentDay,
          text: '🎓 Coming of Age (Age 16): ' + member.name + ' has turned 16! They have grown into a full adult survivor, ready to defend the perimeter, take on camp duties, and require their own living quarters.',
          type: 'milestone',
          timestamp: 'Coming of Age'
        });
      }
      isChild = false;
      stage = 'adult';
      if (profession === 'Colony Child' || profession === 'Colony Infant') {
        profession = 'Haven Pioneer';
      }
    } else if (newAge >= 13) {
      stage = 'teen';
      if (profession === 'Colony Infant') profession = 'Colony Apprentice';
    } else if (newAge >= 4) {
      stage = 'child';
      if (profession === 'Colony Infant') profession = 'Colony Child';
    } else {
      stage = 'infant';
    }

    return {
      ...member,
      age: newAge,
      stage,
      isChild,
      profession,
      combatSkill: Math.min(10, combatSkill),
      medicalSkill: Math.min(10, medicalSkill),
      craftingSkill: Math.min(10, craftingSkill),
      stealthSkill: Math.min(10, stealthSkill),
      fitnessSkill: Math.min(10, fitnessSkill)
    };
  });

  if (player.children && player.children.length > 0) {
    player.children = player.children.map(c => {
      const newChildAge = c.age + 1;
      let newStage: 'infant' | 'child' | 'teen' | 'adult' = 'infant';
      if (newChildAge >= 16) newStage = 'adult';
      else if (newChildAge >= 13) newStage = 'teen';
      else if (newChildAge >= 4) newStage = 'child';

      const skills = { ...(c.skills || { combat: 5, medical: 5, crafting: 5, stealth: 5, fitness: 5 }) };
      if (hasSchool && newStage !== 'adult') {
        skills.combat = Math.min(10, skills.combat + 1);
        skills.medical = Math.min(10, skills.medical + 1);
        skills.crafting = Math.min(10, skills.crafting + 1);
        skills.stealth = Math.min(10, skills.stealth + 1);
        skills.fitness = Math.min(10, skills.fitness + 1);
      }

      if (newChildAge === 18 && c.stage !== 'adult') {
        newLogs.push({
          id: 'grad_player_' + c.id + '_' + Date.now(),
          day: currentDay,
          text: '�<ߓ Dynasty Coming of Age: Your child ' + c.name + ' has turned 18! Born in the sanctuary, they have grown into a capable adult survivor, ready to defend our haven or succeed your legacy.',
          type: 'milestone',
          timestamp: 'Graduation'
        });
      }

      return {
        ...c,
        age: newChildAge,
        stage: newStage,
        skills
      };
    });
  }

  // Deliver any active camp member pregnancies over the year
  campMembers = campMembers.map(m => {
    if (m.isPregnant) {
      const babyGender = Math.random() < 0.5 ? 'male' : 'female';
      const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Lucas', 'Julian', 'Elias', 'Finn'];
      const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria'];
      const chosenName = babyGender === 'male' ? boyNames[Math.floor(Math.random() * boyNames.length)] : girlNames[Math.floor(Math.random() * girlNames.length)];
      const surname = m.name.split(' ').slice(-1)[0] || 'Haven';

      if (!yearPendingBabyNaming) {
        yearPendingBabyNaming = {
          motherName: m.name,
          fatherName: m.partnerName || m.spouseName || (m.pregnantFatherId === 'player' ? player.name : 'Unknown Father'),
          gender: babyGender as 'male' | 'female',
          suggestedFirstName: chosenName,
          suggestedLastName: surname,
          isPlayerChild: m.pregnantFatherId === 'player',
          parentMemberId: m.id
        };
      }

      newLogs.push({
        id: 'birth_m_year_' + m.id + '_' + Date.now(),
        day: currentDay,
        text: '👶 Annual Birth: ' + m.name + ' delivered a healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' during the year (+20 Morale).',
        type: 'milestone',
        timestamp: 'New Life'
      });

      return { ...m, isPregnant: false, pregnancyMonths: 0 };
    }
    return m;
  });
  
  // 2. Annual Resource Balance
  const totalConsumers = Math.max(1, campMembers.length + 1);
  const rationPolicy = shelter.rationPolicy ?? 'standard';
  const annualFoodDemand = totalConsumers * (rationPolicy === 'half' ? 180 : rationPolicy === 'full' ? 540 : 365);

  const annualGardenYield = (shelter.greenhouseLevel || 0) * 140;
  const annualCoopYield = shelter.hasChickenCoop ? 450 : 0;
  const annualWellYield = shelter.hasSanctuaryWell ? 800 : 0;
  const scoutsCount = campMembers.filter(m => m.role === 'scavenger').length;
  const annualScoutFood = scoutsCount * 160 + annualCoopYield;
  const annualScoutMats = scoutsCount * 45;

  const existingFood = inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);

  let toDeductFood = Math.min(existingFood, annualFoodDemand);
  for (const item of inventory) {
    if (item.category === 'food' && toDeductFood > 0) {
      const take = Math.min(item.quantity, toDeductFood);
      item.quantity -= take;
      toDeductFood -= take;
    }
  }

  if (annualGardenYield > 0) {
    inventory.push({
      id: 'annual_harvest_' + Date.now(),
      name: 'Annual Greenhouse Surplus',
      category: 'food',
      quantity: Math.min(100, annualGardenYield),
      description: 'Preserved root vegetables and jarred beans from the past year.'
    });
  }

  if (annualScoutMats > 0) {
    inventory.push({
      id: 'annual_timber_' + Date.now(),
      name: 'Structural Timber Studs',
      category: 'resource',
      quantity: Math.min(50, annualScoutMats),
      description: 'Lumber stockpiled by scavengers over 365 days of expeditions.'
    });
  }

  inventory = inventory.filter(i => i.quantity > 0);

  // 3. Old Age & Mortality Check
  let promptSuccession: GameState['legacySuccessionPrompt'] = null;

  if (player.age >= 72 && Math.random() < 0.35) {
    player.isDead = true;
    player.deathCause = 'passed away peacefully of old age at ' + player.age + ', surrounded by family in the sanctuary';

    const adultChildren = (player.children || []).filter(c => c.age >= 18).map(c => ({
      id: c.id,
      name: c.name,
      relation: 'Adult Child',
      profession: 'Dynasty Heir',
      age: c.age,
      isOffspring: true,
      skills: c.skills || { combat: 6, medical: 6, crafting: 6, stealth: 6, fitness: 6 }
    }));

    const companionCandidates = campMembers.filter(m => !m.isChild && m.trust >= 60).map(m => ({
      id: m.id,
      name: m.name,
      relation: m.relation || 'Trusted Ally',
      profession: m.profession,
      age: m.age,
      isOffspring: false,
      skills: {
        combat: m.combatSkill || 5,
        medical: m.medicalSkill || 5,
        crafting: m.craftingSkill || 5,
        stealth: m.stealthSkill || 5,
        fitness: m.fitnessSkill || 5
      }
    }));

    const candidates = [...adultChildren, ...companionCandidates];
    if (candidates.length > 0) {
      promptSuccession = {
        cause: 'Old Age',
        deceasedName: player.name,
        deceasedAge: player.age,
        candidates
      };
    }

    newLogs.push({
      id: 'death_oldage_' + Date.now(),
      day: currentDay,
      text: '🕊️ A Pioneer Passes: ' + player.name + ' passed away peacefully of old age at ' + player.age + '. The entire haven gathered to honor the founder of our sanctuary.',
      type: 'milestone',
      timestamp: 'In Memoriam'
    });
  }

  // Annual Viral Infection Progress (365 Days of Chronicity / Dormancy)
  if (player.infectionRisk && player.infectionRisk > 0 && !player.isDead) {
    player.infectionDays = (player.infectionDays || 0) + 365;
    const hasMedic = campMembers.some(m => m.role === 'medic');
    const hasAntibioticStock = inventory.some(i => (i.id.includes('antibiotic') || i.name.toLowerCase().includes('antibiotic')) && i.quantity >= 3);
    const hasAntibodyTrait = player.traits && player.traits.some(t => t.id === 'antibody_carrier' || t.id === 'thick_skinned');

    if (hasMedic || hasAntibioticStock || hasAntibodyTrait) {
      player.infectionRisk = Math.min(25, player.infectionRisk);
      newLogs.push({
        id: 'inf_year_dormant_' + Date.now(),
        day: currentDay,
        text: '💉 Annual Viral Resilience: Supported by colony medical care, your immune system developed neutralizing antibodies against the ' + (state.mutationStrain?.name || 'pathogen') + ', keeping the virus suppressed in chronic dormancy (' + player.infectionRisk + '%).',
        type: 'medical',
        timestamp: 'Annual Chronicle'
      });
    } else {
      player.isDead = true;
      player.deathCause = 'succumbed to the viral infection over the course of the year';
      newLogs.push({
        id: 'inf_year_death_' + Date.now(),
        day: currentDay,
        text: '💀 TERMINAL COLLAPSE: 365 days without advanced medical triage proved insurmountable. The viral pathogen gradually broke down cellular immunity, and you turned during the winter.',
        type: 'death',
        timestamp: 'Annual Chronicle'
      });
    }
  }

  const yearRecap: LogEntry = {
    id: 'year_recap_' + Date.now(),
    day: currentDay,
    text: '📆 1 YEAR ADVANCED (Day ' + currentDay + '): 365 days have passed. You are now age ' + player.age + '. The colony endures with ' + (campMembers.length + 1) + ' residents.',
    type: 'milestone',
    timestamp: 'Annual Chronicle'
  };

  return {
    ...currentState,
    day: currentDay,
    player,
    shelter,
    campMembers,
    inventory,
    legacySuccessionPrompt: promptSuccession,
    pendingBabyNaming: yearPendingBabyNaming,
    logs: [...currentState.logs, ...newLogs, yearRecap].slice(-150)
  };
}
