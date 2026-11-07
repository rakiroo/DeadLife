import { GameState, LogEntry, WeatherType, StatusEffect } from '../types/game';
import { getRandomSurvivalEvent } from '../data/events';

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
      text: `⚠️ DEHYDRATION (Day ${daysWithoutWater}): Your mouth is dry as ash. Severe headache and muscle cramps (-${dehydrationDamage}% HP).`,
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

  // Daily summary journal log
  newLogs.push({
    id: `log_day_${currentDay}_${Date.now()}`,
    day: currentDay,
    text: `Day ${currentDay} survived. Weather: ${newWeather.replace('_', ' ')}. Vitals: HP ${Math.max(0, health)}% | Water: ${daysWithoutWater === 0 ? 'Adequate' : 'CRITICAL'} | Food: ${daysWithoutFood === 0 ? 'Adequate' : 'Depleted'}.`,
    type: 'milestone',
    timestamp: 'Nightfall'
  });

  // Camp survivor relationship & duty progression
  const updatedMembers = state.campMembers.map(member => {
    let trust = member.trust;
    let affection = member.affection ?? 20;
    let daysTogether = (member.daysTogether ?? 0) + 1;
    let stage = member.relationshipStage ?? 'stranger';

    // Depleted food/water strains relationships
    if (daysWithoutFood > 0 || daysWithoutWater > 0) {
      trust = Math.max(0, trust - (daysWithoutFood * 4 + daysWithoutWater * 4));
      affection = Math.max(0, affection - 3);
    } else {
      trust = Math.min(100, trust + 1);
    }

    // Romance partner grants nightly sanity comfort
    if (stage === 'romance') {
      sanity = Math.min(100, sanity + 5);
    } else if (trust <= 20) {
      stage = 'enemy';
    } else if (trust <= 40) {
      stage = 'tense';
    } else if (trust >= 75 && affection >= 65) {
      stage = 'close_friend';
    } else if (trust >= 50) {
      stage = 'friend';
    }

    return {
      ...member,
      trust,
      affection,
      daysTogether,
      relationshipStage: stage
    };
  });

  // Pick a random dilemma if alive and none active
  let nextDilemma = state.activeDilemma;
  if (!nextDilemma && !isDead && Math.random() < 0.65) {
    nextDilemma = getRandomSurvivalEvent(state);
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
    weeklyNarrative.push(
      `🗓️ WEEKLY SURVIVAL LOG (Days ${weekStartDay} - ${weekEndDay}): Seven days have slipped by in fortified isolation. ` +
      `Your hands are blistered from routine chores and barricade checks. Society shows no signs of recovering.`
    );

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
