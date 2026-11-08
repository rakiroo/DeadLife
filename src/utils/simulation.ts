import { GameState, LogEntry, WeatherType, StatusEffect } from '../types/game';
import { getRandomSurvivalEvent } from '../data/events';

const WEATHERS: WeatherType[] = ['clear', 'heavy_rain', 'dense_fog', 'freezing_cold', 'thunderstorm'];


function generateDailyHappenings(state: GameState, currentDay: number, weather: WeatherType): string[] {
  const happenings: string[] = [];

  // 1. Atmosphere / Weather happening
  const weatherHappenings: Record<WeatherType, string[]> = {
    heavy_rain: [
      'Cold rain drummed heavily against the cracked windowpanes all morning.',
      'A steady downpour flooded the gutters outside, washing soot into the street.',
      'I watched sheets of gray rain pour over the ruined rooftops.',
      'The storm drenched the streets, driving roaming infected under building awnings.'
    ],
    thunderstorm: [
      'A deafening roll of thunder shook the floorboards. Rain lashed the walls.',
      'Lightning flickered across the ruined skyline, casting long, jittery shadows.',
      'The storm rattled the loose roof metal violently throughout the dark hours.'
    ],
    dense_fog: [
      'Dense morning mist blanketed the street, hiding everything beyond thirty paces.',
      'Wet shuffling footsteps echoed out in the fog, but I kept quiet and stayed low.',
      'Thick, damp fog rolled through the alleyways, muffling distant sounds.'
    ],
    freezing_cold: [
      'Frost coated the inside of the glass. My breath plumed white in the cold air.',
      'A bitter northern wind whistled through the building seams all afternoon.',
      'I pulled my coat tight to conserve body heat as the temperature plummeted.'
    ],
    heatwave: [
      'The sweltering midday sun baked the asphalt outside, making the air thick and stifling.',
      'A scorching breeze blew dry dust and ashes down the deserted avenue.'
    ],
    clear: [
      'The morning sun cut through the dusty air, bringing a rare moment of quiet warmth.',
      'A clear blue sky stretched over the silent, abandoned city grid.',
      'The afternoon was calm. Not a single car engine has rumbled for weeks.',
      'Pale sunlight filtered through the cracked blinds, illuminating dust motes in the quiet room.'
    ]
  };

  const weatherPool = weatherHappenings[weather] || weatherHappenings.clear;
  happenings.push(weatherPool[Math.floor(Math.random() * weatherPool.length)]);

  // 2. Location & Survival happenings
  const locationPool: string[] = [];

  if (!state.startingLocation.hasLeftStartingSpot) {
    const locName = state.startingLocation.name;
    locationPool.push(
      'I checked the barricaded entrance of ' + locName + '. The deadbolts held firm through the night.',
      'I swept away broken glass and reinforced the window frames inside ' + locName + '.',
      'I peered through the blinds of ' + locName + ' and watched a stray dog pick through a tipped trash bin.',
      'The emergency backup light at ' + locName + ' clicked softly as its battery finally gave out.',
      'I found an old employee mug in ' + locName + ' and used it to drink boiled water.',
      'I checked every corner and storage closet of ' + locName + ' to ensure no infected had breached.'
    );
  } else if (state.shelter.isEstablished) {
    const baseName = state.shelter.name;
    locationPool.push(
      'I inspected the perimeter defenses around ' + baseName + ' and re-nailed a loose plank.',
      'I climbed up to the rooftop of ' + baseName + ' to scan the surrounding avenues with binoculars.',
      'I inspected our rainwater collection barrels behind ' + baseName + ' to make sure the mesh filter was clean.',
      'I spent an hour checking the door deadbolts and window bracing at ' + baseName + '.',
      'Distant smoke rose from a warehouse three miles away, but ' + baseName + ' remained quiet.'
    );
  } else {
    locationPool.push(
      'I searched the glove compartment of a rusted-out station wagon parked along the curb.',
      'I ducked into the shadows of an alleyway while a cluster of infected drifted past.',
      'I checked the padlocks on a row of commercial roll-up shutters down the boulevard.',
      'An abandoned billboard creaked loudly overhead as the wind picked up.',
      'I navigated around a chain-reaction car pileup blocking the central intersection.'
    );
  }

  // Companion interactions or solo survival routines
  if (state.campMembers.length > 0) {
    const companion = state.campMembers[Math.floor(Math.random() * state.campMembers.length)];
    locationPool.push(
      'I took turns standing guard with ' + companion.name + ' during the quiet hours before dawn.',
      companion.name + ' and I shared a hot meal and talked about the jobs we had before the outbreak.',
      companion.name + ' helped reinforce the window barricades, checking every fastener.',
      'I heard ' + companion.name + ' softly humming an old tune while tending to camp supplies.'
    );
  } else {
    locationPool.push(
      'I used an oiled whetstone to sharpen the edge of my melee weapon.',
      'I found an unread paperback novel behind a fallen shelf and read a few chapters by candlelight.',
      'I wrapped heavy electrical tape around the worn soles of my boots to keep them intact.',
      'A distant helicopter droned high above the cloud cover, heading northwest before fading into silence.',
      'I found an intact box of strike-anywhere wooden matches tucked into a jacket pocket.',
      'A flock of black crows gathered along the overhead powerlines, watching the quiet street below.',
      'I sat quietly for an hour, cleaning grit and moisture out of my pack.',
      'I heard a sudden shatter of glass from two blocks away, followed by tense silence.',
      'A stray calico cat slipped through a broken basement grate and vanished into the dark.',
      'I checked the battery life on my flashlight; still enough power left for emergencies.',
      'I watched the sunset paint the ruined skyline in deep copper and purple.',
      'A sudden burst of pigeons startled me as they flew out from a shattered window.',
      'I carved another notch into the doorframe to keep track of the days.',
      'I found a faded postcard of the city from before the world collapsed.',
      'I took a moment to wash the soot and sweat from my face with clean water.'
    );
  }

  happenings.push(locationPool[Math.floor(Math.random() * locationPool.length)]);
  return happenings;
}

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
