import { GameState, LogEntry, WeatherType, StatusEffect } from '../types/game';
import { getRandomSurvivalEvent } from '../data/events';
import { generateDailyHappenings } from '../data/dailyHappenings';
import { getRandomMicroDilemma } from '../data/microDilemmas';
import { getNextBackstoryDilemma } from '../data/backstoryQuests';

const WEATHERS: WeatherType[] = ['clear', 'heavy_rain', 'dense_fog', 'freezing_cold', 'thunderstorm'];


export function advanceOneDay(state: GameState): GameState {
  if (state.player.isDead) return state;

  const currentDay = state.day + 1;
  const newLogs: LogEntry[] = [];
  let { health, sanity, hunger, thirst, infectionRisk, statusEffects } = { ...state.player };
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

  // 3. Food consumption
  const foodItem = inventory.find(i => i.category === 'food' && i.quantity > 0);
  if (foodItem) {
    inventory = inventory.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
    hunger = Math.min(100, hunger + 20);
    daysWithoutFood = 0;
  } else {
    daysWithoutFood += 1;
    hunger = Math.max(0, hunger - 25);
    if (daysWithoutFood >= 2) {
      const starvationDamage = (daysWithoutFood - 1) * 8;
      health -= starvationDamage;
      sanity -= 8;
      newLogs.push({
        id: `log_hunger_${Date.now()}_${Math.random()}`,
        day: currentDay,
        text: `⚠️ STARVATION (Day ${daysWithoutFood}): Stomach cramps and weakness setting in (-${starvationDamage}% HP).`,
        type: 'hazard',
        timestamp: 'Morning'
      });
      if (health <= 0 && !isDead) {
        isDead = true;
        deathCause = 'starved to death in shelter';
      }
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

  // Camp survivor duty & daily trust progression
  const updatedMembers = state.campMembers.map(member => {
    let trust = member.trust;
    let daysTogether = (member.daysTogether ?? 0) + 1;

    // Depleted food/water strains trust
    if (daysWithoutFood > 0 || daysWithoutWater > 0) {
      trust = Math.max(0, trust - (daysWithoutFood * 4 + daysWithoutWater * 4));
    } else {
      trust = Math.min(100, trust + 1);
    }

    return {
      ...member,
      trust,
      daysTogether
    };
  });

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
      hunger: Math.max(0, Math.min(100, hunger)),
      thirst: Math.max(0, Math.min(100, thirst)),
      infectionRisk,
      statusEffects: updatedEffects,
      isDead,
      deathCause
    },
    logs: [...state.logs, ...newLogs].slice(-150),
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
