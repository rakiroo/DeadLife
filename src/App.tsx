import React, { useState, useEffect } from 'react';
import { GameState, EventChoice, EventDilemma, InventoryItem, CampRole, CampMember, LogEntry, Survivor, CemeteryRecord, Career, FamilyHeirloom, BabyNamingPrompt, WillAndTestament } from './types/game';
import { BabyNamingModal } from './components/BabyNamingModal';
import { generateProceduralDistrict } from './data/districts';
import { getRandomMutationStrain } from './data/mutationStrains';
import { generateProceduralMystery } from './data/mysteries';
import { calculateSurvivorRibbons } from './data/ribbons';
import { loadCodexData, saveCodexData, calculateRunLegacyMarks } from './data/codex';
import { CodexScreen } from './components/CodexScreen';
import { InvestigationBoardModal } from './components/InvestigationBoardModal';
import { CodexSaveData } from './types/game';
import { DAY_ONE_EVENT, getLootSpotSurvivorDilemma, getSurvivorOutpostDilemma } from './data/events';
import { advanceOneDay, advanceOneWeek, advanceOneMonth, advanceOneYear, getSeason } from './utils/simulation';
import { LegacySuccessionModal } from './components/LegacySuccessionModal';
import { TimeAdvanceWarningModal } from './components/TimeAdvanceWarningModal';
import { HeaderVitals } from './components/HeaderVitals';
import { JournalFeed } from './components/JournalFeed';
import { getRandomSpawnStory } from './data/spawnStories';
import { DilemmaModal } from './components/DilemmaModal';
import { DilemmaResultModal } from './components/DilemmaResultModal';
import { BottomActionBar, ActiveTab } from './components/BottomActionBar';
import { BaseTab } from './components/BaseTab';
import { InventoryTab } from './components/InventoryTab';
import { ActivitiesTab } from './components/ActivitiesTab';
import { DeathScreen } from './components/DeathScreen';
import { TitleScreen } from './components/TitleScreen';
import { CharacterCreator } from './components/CharacterCreator';
import { GraveyardScreen } from './components/GraveyardScreen';
import { AmbitionsModal } from './components/AmbitionsModal';
import { SettingsScreen } from './components/SettingsScreen';
import { SandboxAmbition } from './data/ambitions';
import { getContextualBackstory } from './data/backstories';
import { getNextBackstoryDilemma } from './data/backstoryQuests';

type ScreenState = 'title' | 'creator' | 'game' | 'graveyard' | 'settings' | 'codex';

const SAVE_KEY = 'deadlife_save';
const GRAVEYARD_KEY = 'deadlife_graveyard';

// Migration helper to ensure older saves have districts, strains, mysteries, and seasons

export function buildCemeteryRecord(state: GameState, ribbonOverride?: string, deathCauseOverride?: string): CemeteryRecord {
  const { player, shelter, stats, day, district, mutationStrain, mystery } = state;
  const deathCause = deathCauseOverride || player.deathCause || 'died fighting in the ruins';
  const { primary, achievements } = calculateSurvivorRibbons(state, deathCause);

  const ribbon = ribbonOverride || primary.title;
  const ribbonDesc = primary.desc;

  const districtStory = district 
    ? 'In the devastated sector of ' + district.name + ' (' + district.type.toUpperCase() + '), amid ' + district.description.toLowerCase() + ' '
    : 'In the shattered ruins of the city, ';

  const strainStory = mutationStrain
    ? 'The world was haunted by ' + mutationStrain.name + ' (' + mutationStrain.codeName + ')—' + mutationStrain.tagline.toLowerCase() + ' Every scavenge was a brush with death under their unique predatory instincts. '
    : '';

  const originStory = player.name + ' took their first steps into the nightmare on Day 0 as a ' + player.profession.toLowerCase() + '. Against overwhelming odds, they endured for ' + day + (day === 1 ? ' day. ' : ' days. ');

  const weaponStory = player.equippedWeapon?.name
    ? 'They defended the haven with their trusted ' + player.equippedWeapon.name + ' in hand, neutralizing ' + stats.zombiesEliminated + ' infected across ' + stats.scavengeRuns + ' harrowing expeditions. '
    : 'They neutralized ' + stats.zombiesEliminated + ' infected through ' + stats.scavengeRuns + ' harrowing expeditions. ';

  const shelterStory = shelter.isEstablished
    ? "They raised and fortified '" + shelter.name + "', providing a beacon of light and guiding " + stats.peopleSaved + " fellow survivors to safety. "
    : 'They traversed the wasteland without a permanent sanctuary, guiding ' + stats.peopleSaved + ' lost souls when they could. ';

  const loveStory = player.spouseName
    ? 'They found true love amidst the ash, marrying ' + player.spouseName + '. '
    : player.datingTargetName
    ? 'They shared tender moments of romance with ' + player.datingTargetName + '. '
    : '';

  const kidsCount = player.children ? player.children.length : 0;
  const familyStory = kidsCount > 0
    ? 'They raised ' + kidsCount + (kidsCount === 1 ? ' heir' : ' heirs') + ', mentoring the next generation to inherit their survival skills. '
    : '';

  const willStory = player.will?.creedTitle
    ? "Living by the dynasty creed of '" + player.will.creedTitle + "', their final testament recorded: \"" + (player.will.personalMessage || "Live for tomorrow.") + "\" "
    : '';

  const mysteryStory = mystery
    ? mystery.isSolved
      ? 'Their crowning achievement was exposing the truth behind ' + mystery.title + ' (' + mystery.codeName + '), successfully breaching ' + mystery.rewardBunkerName + ' to uncover the conspiracy behind the outbreak! '
      : mystery.discoveredClueIds && mystery.discoveredClueIds.length > 0
      ? 'They investigated the outbreak origins, uncovering ' + mystery.discoveredClueIds.length + ' classified leads regarding ' + mystery.title + '. '
      : ''
    : '';

  const finalStory = 'In the end, they ' + deathCause + '. Generation ' + (player.generation || 1) + ' rests here. Their memory is eternal in the Memorial Hall of the Fallen.';

  const fullBio = (
    districtStory +
    originStory +
    strainStory +
    weaponStory +
    shelterStory +
    loveStory +
    familyStory +
    willStory +
    mysteryStory +
    finalStory
  );

  return {
    id: 'grave_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    name: player.name,
    age: player.age,
    profession: player.profession,
    daysSurvived: day,
    deathCause,
    date: new Date().toLocaleDateString(),
    ribbon,
    ribbonDesc,
    secondaryRibbons: achievements,
    stats,
    biography: fullBio,
    spouseName: player.spouseName,
    childrenCount: kidsCount,
    generation: player.generation || 1,
    baseName: shelter.isEstablished ? shelter.name : undefined,
    districtName: district?.name,
    districtType: district?.type,
    mutationStrainName: mutationStrain?.name,
    mutationStrainCode: mutationStrain?.codeName,
    mysteryTitle: mystery?.title,
    mysterySolved: mystery?.isSolved,
    equippedWeaponName: player.equippedWeapon?.name,
    founderCreedTitle: player.will?.creedTitle
  };
}

function migrateLegacyGameState(parsed: GameState): GameState {
  if (!parsed.district) parsed.district = generateProceduralDistrict();
  if (!parsed.mutationStrain) parsed.mutationStrain = getRandomMutationStrain();
  if (!parsed.mystery) parsed.mystery = generateProceduralMystery();
  if (!parsed.season) parsed.season = getSeason(parsed.day || 0);
  if (!parsed.player.heirlooms) parsed.player.heirlooms = [];
  return parsed;
}


export function createNewGameWithSurvivor(survivor: Survivor, career: Career): GameState {
  const spawnStory = getRandomSpawnStory(career.id);
  const backstory = survivor.backstory || getContextualBackstory(survivor, career);
  survivor.backstory = backstory;

  // Gather all starting loot from workplace
  const startingLoot: InventoryItem[] = [];
  for (const spot of career.startingLocation.lootSpots) {
    for (const item of spot.loot) {
      const existing = startingLoot.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        startingLoot.push({ ...item });
      }
    }
  }

  // Starter items for medical conditions & habits
  const traitIds = survivor.traits ? survivor.traits.map(t => t.id) : [];
  if (traitIds.includes('diabetic')) {
    startingLoot.push({
      id: 'insulin_pen_starter',
      name: 'Refrigerated Insulin Pen',
      category: 'medical',
      quantity: 2,
      description: 'Injectable insulin to manage type 1 diabetes.'
    });
  }
  if (traitIds.includes('asthmatic')) {
    startingLoot.push({
      id: 'albuterol_inhaler_starter',
      name: 'Albuterol Rescue Inhaler',
      category: 'medical',
      quantity: 2,
      description: 'Rescue bronchodilator inhaler for acute asthma spasms.'
    });
  }
  if (traitIds.includes('smoker')) {
    startingLoot.push({
      id: 'cigarettes_starter',
      name: 'Pack of Cigarettes',
      category: 'food',
      quantity: 2,
      description: 'Filter cigarettes. Smoking staves off nicotine withdrawal.'
    });
  }

  const itemsSummary = startingLoot.map(i => i.name + ' (x' + i.quantity + ')').join(', ');

  // Interactive Day 0 Opening Dilemma
  const dayZeroDilemma: EventDilemma = {
    id: 'spawn_dilemma_' + Date.now(),
    title: spawnStory.title || 'Day 0: The Outbreak Begins',
    category: 'discovery',
    dangerLevel: 'low',
    description: spawnStory.fullStory,
    choices: [
      {
        id: 'loot_all_workplace',
        text: 'Scavenge ' + career.startingLocation.name + ' thoroughly for all supplies',
        consequenceSummary: 'Gathers all starting tools, weapons, food, and water into your inventory.',
        execute: (s: GameState) => {
          return {
            state: {
              ...s,
              inventory: startingLoot.map(i => ({ ...i }))
            },
            log: 'Day 0: I searched ' + career.startingLocation.name + ' and secured starting supplies: ' + itemsSummary + '.',
            outcomeTitle: 'Workplace Supplies Secured',
            outcomeText: 'You swept through ' + career.startingLocation.name + ' before locking down. All starting tools, weapons, and provisions have been packed into your supplies.'
          };
        }
      },
      {
        id: 'barricade_and_loot',
        text: 'Quickly grab essential tools and hammer heavy braces across the doors',
        consequenceSummary: 'Gathers starting gear and reinforces entryways (+40% Barricade).',
        execute: (s: GameState) => {
          return {
            state: {
              ...s,
              inventory: startingLoot.map(i => ({ ...i })),
              shelter: {
                ...s.shelter,
                barricadeIntegrity: 40
              }
            },
            log: 'Day 0: I reinforced the doors of ' + career.startingLocation.name + ' and collected gear (+40% Barricade).',
            outcomeTitle: 'Entryways Fortified',
            outcomeText: 'You nailed structural braces across the doors. The barricades hold firm against the street horde outside (+40% Integrity).'
          };
        }
      },
      {
        id: 'quiet_lockdown',
        text: 'Pack emergency rations, kill the lights, and stay low in the shadows',
        consequenceSummary: 'Secures provisions while keeping calm and composed (+15 Sanity).',
        execute: (s: GameState) => {
          return {
            state: {
              ...s,
              inventory: startingLoot.map(i => ({ ...i })),
              player: {
                ...s.player,
                sanity: Math.min(100, s.player.sanity + 15)
              }
            },
            log: 'Day 0: I locked down ' + career.startingLocation.name + ' quietly, securing provisions and steadying your nerves (+15 Sanity).',
            outcomeTitle: 'Quiet Composure Maintained',
            outcomeText: 'You avoided making any noise. The infected shuffled past outside, completely unaware of your presence (+15 Sanity).'
          };
        }
      }
    ]
  };

  const initialLog: LogEntry = {
    id: 'log_init_' + Date.now(),
    day: 0,
    text: spawnStory.intro,
    type: 'milestone',
    timestamp: 'Morning'
  };

  const backstoryLog: LogEntry = {
    id: 'log_backstory_' + Date.now(),
    day: 0,
    text: backstory.hookText,
    type: 'general',
    timestamp: 'Morning'
  };

  const district = generateProceduralDistrict();
  const mutationStrain = getRandomMutationStrain();
  const mystery = generateProceduralMystery();

  const districtLog: LogEntry = {
    id: 'log_district_' + Date.now(),
    day: 0,
    text: '📍 Starting District: ' + district.name + ' (' + district.type.toUpperCase() + '). ' + district.description + ' Environment: ' + district.environmentalFeature,
    type: 'general',
    timestamp: 'Morning'
  };

  const strainLog: LogEntry = {
    id: 'log_strain_' + Date.now(),
    day: 0,
    text: '☣️ Outbreak Strain: ' + mutationStrain.name + ' (' + mutationStrain.codeName + '). ' + mutationStrain.tagline + ' Active Rule: ' + mutationStrain.ruleSummary,
    type: 'milestone',
    timestamp: 'Morning'
  };

  return {
    day: 0,
    timeOfDay: 'Morning',
    season: 'spring',
    weather: 'clear',
    temperatureCelsius: 18,
    player: survivor,
    startingLocation: {
      name: career.startingLocation.name,
      type: career.startingLocation.type,
      description: career.startingLocation.description,
      storyTitle: spawnStory.title,
      storyText: spawnStory.fullStory,
      lootSpots: career.startingLocation.lootSpots.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        searched: true,
        loot: s.loot.map(item => ({ ...item }))
      })),
      hasLeftStartingSpot: false
    },
    campMembers: [],
    isCampEstablished: false,
    shelter: {
      isEstablished: false,
      name: 'No Shelter Established',
      type: 'Unsheltered',
      defenseRating: 0,
      stealthRating: 25,
      warmthRating: 30,
      waterCollectorLevel: 0,
      storedRainwater: 0,
      maxRainwater: 10,
      barricadeIntegrity: 0,
      generatorOperational: false,
      fuelGallons: 0
    },
    inventory: [],
    logs: [initialLog, backstoryLog, districtLog, strainLog],
    district,
    mutationStrain,
    mystery,
    activeDilemma: dayZeroDilemma,
    dilemmaResult: null,
    daysWithoutFood: 0,
    daysWithoutWater: 0,
    stats: {
      zombiesEliminated: 0,
      daysSurvived: 0,
      scavengeRuns: 0,
      peopleSaved: 0
    },
    ribbons: []
  };
}

export function App() {
  const [screen, setScreen] = useState<ScreenState>('title');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('journal');
  const [graveyard, setGraveyard] = useState<CemeteryRecord[]>([]);
  const [showAmbitionsModal, setShowAmbitionsModal] = useState<boolean>(false);
  const [codexData, setCodexData] = useState<CodexSaveData>(loadCodexData());
  const [showInvestigationBoard, setShowInvestigationBoard] = useState<boolean>(false);
  const [pendingTimeWarning, setPendingTimeWarning] = useState<{ type: 'month' | 'year'; foodNeeded: number; waterNeeded: number; currentFood: number; currentWater: number } | null>(null);

  // Load graveyard records on mount
  useEffect(() => {
    try {
      const savedGrave = localStorage.getItem(GRAVEYARD_KEY);
      if (savedGrave) {
        setGraveyard(JSON.parse(savedGrave));
      }
      const savedGame = localStorage.getItem(SAVE_KEY);
      if (savedGame) {
        const parsed: GameState = JSON.parse(savedGame);
        if (parsed.logs && parsed.logs.length > 1) {
          if (parsed.logs[0].day > parsed.logs[parsed.logs.length - 1].day) {
            parsed.logs = [...parsed.logs].reverse();
          }
        }
        setGameState(migrateLegacyGameState(parsed));
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }, []);

  // Keep active tab valid based on current unlocked features
  useEffect(() => {
    if (!gameState) return;
    // Tab validation simplified
  }, [activeTab, gameState?.shelter?.isEstablished, gameState?.isCampEstablished, gameState?.campMembers?.length]);

  // Save game state whenever it updates and player is alive
  useEffect(() => {
    if (gameState && !gameState.player.isDead) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  // When player dies, record to cemetery and clear active save
  useEffect(() => {
    if (gameState && gameState.player.isDead && !gameState.legacySuccessionPrompt) {
      const newRecord = buildCemeteryRecord(gameState);
      const updated = [newRecord, ...graveyard].slice(0, 50);
      setGraveyard(updated);
      localStorage.setItem(GRAVEYARD_KEY, JSON.stringify(updated));
      localStorage.removeItem(SAVE_KEY);
    }
  }, [gameState?.player.isDead]);

  // Handle Character Creator Completion
  const handleStartCustomGame = (survivor: Survivor, career: Career) => {
    const freshGame = createNewGameWithSurvivor(survivor, career);
    setGameState(freshGame);
    setActiveTab('journal');
    setScreen('game');
  };

  // Continue Saved Game
  const handleLoadSavedGame = () => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      setGameState(migrateLegacyGameState(JSON.parse(saved)));
      setScreen('game');
    }
  };

  // Clear Graveyard
  const handleClearGraveyard = () => {
    setGraveyard([]);
    localStorage.removeItem(GRAVEYARD_KEY);
  };

  // Time Progression: +1 Month
  const handleAdvanceMonth = () => {
    if (!gameState) return;
    const totalConsumers = Math.max(1, gameState.campMembers.length + 1);
    const rationPolicy = gameState.shelter.rationPolicy ?? 'standard';
    const foodNeeded = totalConsumers * (rationPolicy === 'half' ? 15 : rationPolicy === 'full' ? 45 : 30);
    const waterNeeded = totalConsumers * 30;
    const currentFood = gameState.inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
    const currentWater = gameState.inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);

    if (currentFood < foodNeeded || currentWater < waterNeeded) {
      setPendingTimeWarning({ type: 'month', foodNeeded, waterNeeded, currentFood, currentWater });
      return;
    }
    setActiveTab('journal');
    setGameState(prev => prev ? advanceOneMonth(prev) : null);
  };

  // Time Progression: +1 Year
  const handleAdvanceYear = () => {
    if (!gameState) return;
    const totalConsumers = Math.max(1, gameState.campMembers.length + 1);
    const rationPolicy = gameState.shelter.rationPolicy ?? 'standard';
    const foodNeeded = totalConsumers * (rationPolicy === 'half' ? 180 : rationPolicy === 'full' ? 540 : 365);
    const waterNeeded = totalConsumers * 365;
    const currentFood = gameState.inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
    const currentWater = gameState.inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);

    if (currentFood < foodNeeded || currentWater < waterNeeded) {
      setPendingTimeWarning({ type: 'year', foodNeeded, waterNeeded, currentFood, currentWater });
      return;
    }
    setActiveTab('journal');
    setGameState(prev => prev ? advanceOneYear(prev) : null);
  };

  const handleConfirmPendingTimeAdvance = () => {
    if (!pendingTimeWarning || !gameState) return;
    setActiveTab('journal');
    if (pendingTimeWarning.type === 'month') {
      setGameState(prev => prev ? advanceOneMonth(prev) : null);
    } else {
      setGameState(prev => prev ? advanceOneYear(prev) : null);
    }
    setPendingTimeWarning(null);
  };

  // Time Progression: +1 Day
  const handleAdvanceDay = () => {
    if (!gameState) return;
    setActiveTab('journal');
    setGameState(prev => prev ? advanceOneDay(prev) : null);
  };

  // Time Progression: +1 Week
  const handleAdvanceWeek = () => {
    if (!gameState) return;
    setActiveTab('journal');
    setGameState(prev => prev ? advanceOneWeek(prev) : null);
  };

  // Dilemma resolution
  const handleSelectChoice = (choice: EventChoice) => {
    if (!gameState) return;
    const outcome = choice.execute(gameState);
    const newLog: LogEntry = {
      id: `log_choice_${Date.now()}`,
      day: gameState.day,
      text: outcome.log,
      type: outcome.isFatal ? 'death' : 'combat',
      timestamp: 'Incident'
    };

    setGameState({
      ...outcome.state,
      logs: [...outcome.state.logs, newLog].slice(-150),
      activeDilemma: null,
      dilemmaResult: {
        title: outcome.outcomeTitle,
        text: outcome.outcomeText,
        isFatal: outcome.isFatal
      }
    });
  };

  // Use Item from backpack
  const handleUseItem = (item: InventoryItem) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let { health, hunger, thirst, statusEffects } = { ...prev.player };
      let updatedInv = prev.inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      let itemLogText = '';
      let itemLogType: LogEntry['type'] = 'general';

      if (item.category === 'food') {
        hunger = Math.min(100, hunger + 25);
        itemLogText = `I consumed ${item.name} (+25 hunger).`;
      } else if (item.category === 'water') {
        thirst = Math.min(100, thirst + 25);
        itemLogText = `I drank clean water from ${item.name} (+25 hydration).`;
      } else if (item.id.includes('bandage') || item.id.includes('first_aid') || item.id.includes('gauze')) {
        health = Math.min(100, health + 15);
        statusEffects = statusEffects.filter(e => e.id !== 'bleeding');
        itemLogText = `I applied a sterile pressure dressing. Bleeding stopped.`;
        itemLogType = 'medical';
      } else if (item.id.includes('insulin')) {
        health = Math.min(100, health + 10);
        itemLogText = 'I injected insulin. Blood glucose stabilized (+10 HP).';
        itemLogType = 'medical';
      } else if (item.id.includes('inhaler') || item.id.includes('albuterol')) {
        health = Math.min(100, health + 5);
        prev.player.sanity = Math.min(100, prev.player.sanity + 15);
        itemLogText = 'I used my rescue inhaler. Airways cleared (+15 Sanity).';
        itemLogType = 'medical';
      } else if (item.id.includes('cigarette') || item.id.includes('tobacco')) {
        prev.player.sanity = Math.min(100, prev.player.sanity + 20);
        itemLogText = 'I smoked a cigarette. Nerves calmed down (+20 Sanity).';
        itemLogType = 'general';
      } else if (item.id.includes('antibiotic') || item.id.includes('alcohol')) {
        health = Math.min(100, health + 10);
        statusEffects = statusEffects.filter(e => e.id !== 'bacterial_infection');
        itemLogText = `I treated the wound with antiseptic. Infection cleared.`;
        itemLogType = 'medical';
      } else {
        itemLogText = `I checked ${item.name} in my pack.`;
      }

      const newLog: LogEntry = {
        id: `log_use_${Date.now()}`,
        day: prev.day,
        text: itemLogText,
        type: itemLogType,
        timestamp: 'Action'
      };

      return {
        ...prev,
        inventory: updatedInv,
        player: { ...prev.player, health, hunger, thirst, statusEffects },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  // Equip or unequip weapon
  const handleEquipWeapon = (item: InventoryItem) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const isCurrentlyEquipped = prev.player.equippedWeaponId === item.id;
      const updatedPlayer = {
        ...prev.player,
        equippedWeapon: isCurrentlyEquipped ? undefined : item,
        equippedWeaponId: isCurrentlyEquipped ? undefined : item.id
      };

      const logText = isCurrentlyEquipped
        ? 'I unequipped ' + item.name + ' and stowed it back into the backpack.'
        : '⚔️ Weapon Equipped: Equipped ' + item.name + ' as primary weapon! Ready for perimeter defense and expeditions.';

      return {
        ...prev,
        player: updatedPlayer,
        logs: [...prev.logs, {
          id: 'equip_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'general' as const,
          timestamp: 'Gear'
        }].slice(-150)
      };
    });
  };

  // Repair Barricades
  const handleRepairBarricade = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const woodItem = prev.inventory.find(i => i.id.includes('wood') || i.id.includes('plank'));
      let updatedInv = prev.inventory;
      if (woodItem) {
        updatedInv = updatedInv.map(i => i === woodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      }

      return {
        ...prev,
        inventory: updatedInv,
        shelter: {
          ...prev.shelter,
          barricadeIntegrity: Math.min(100, prev.shelter.barricadeIntegrity + (18 + Math.floor(prev.player.craftingSkill * 1.5) + (prev.player.traits?.some(t => t.id === 'handy') ? 10 : 0)))
        },
        logs: [...prev.logs, {
          id: `log_repair_${Date.now()}`,
          day: prev.day,
          text: (prev.player.traits?.some(t => t.id === 'handy') ? 'Master craftsman fortification: Nailed structural cross-braces (+35% barricade integrity).' : 'Reinforced entry points and nailed structural cross-braces (+25% barricade integrity).'),
          type: 'milestone' as const,
          timestamp: 'Action'
        }].slice(-150)
      };
    });
  };

  // Change Camp Role
  const handleRoleChange = (memberId: string, newRole: CampRole) => {
    if (!gameState) return;
    setGameState(prev => prev ? ({
      ...prev,
      campMembers: prev.campMembers.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    }) : null);
  };

  // Camp relationship interactions:
  const handleTalkSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const newTrust = Math.min(100, member.trust + 8);
      const updated = prev.campMembers.map(m =>
        m.id === memberId ? { ...m, trust: newTrust } : m
      );

      const newLog: LogEntry = {
        id: `log_talk_${Date.now()}`,
        day: prev.day,
        text: `I checked in and talked with ${member.name}. Camp morale improved (+Trust).`,
        type: 'camp',
        timestamp: 'Camp Care'
      };

      return {
        ...prev,
        campMembers: updated,
        player: { ...prev.player, sanity: Math.min(100, prev.player.sanity + 6) },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  const handleGiftSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      const foodItem = prev.inventory.find(i => i.category === 'food' && i.quantity > 0);
      if (!member || !foodItem) return prev;

      const updatedInv = prev.inventory.map(i => i === foodItem ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? { ...m, trust: Math.min(100, m.trust + 15), health: Math.min(100, m.health + 15) } : m
      );

      const newLog: LogEntry = {
        id: `log_gift_${Date.now()}`,
        day: prev.day,
        text: `I shared food with ${member.name}. Camp loyalty deepened (+Trust & Health).`,
        type: 'camp',
        timestamp: 'Camp Care'
      };

      return {
        ...prev,
        inventory: updatedInv,
        campMembers: updatedMembers,
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  // Base Sanctuary Handlers:
  const handleEstablishBase = (name: string, type: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const initialRooms = [
        {
          id: 'room_cots_1',
          name: 'Makeshift Cots & Lean-To',
          type: 'cots' as const,
          capacity: 2,
          comfort: 20,
          assignedMemberIds: prev.campMembers.slice(0, 1).map(m => m.id)
        },
        {
          id: 'room_bunk_1',
          name: 'Main Fortified Bunkhouse',
          type: 'bunk' as const,
          capacity: 2,
          comfort: 45,
          assignedMemberIds: prev.campMembers.slice(1, 3).map(m => m.id)
        }
      ];

      const newLog: LogEntry = {
        id: 'base_est_' + Date.now(),
        day: prev.day,
        text: 'I claimed and fortified ' + (name || 'Sanctuary Haven') + ' as our official sanctuary base! We reinforced the doors and set up living quarters.',
        type: 'milestone',
        timestamp: 'Base Claim'
      };

      return {
        ...prev,
        isCampEstablished: true,
        shelter: {
          ...prev.shelter,
          isEstablished: true,
          name: name || 'Sanctuary Haven',
          type: type || 'Fortified Haven',
          defenseRating: Math.max(35, prev.shelter.defenseRating),
          barricadeIntegrity: Math.max(45, prev.shelter.barricadeIntegrity),
          maxSurvivors: 4,
          morale: 80,
          rationPolicy: 'standard',
          securityProtocol: 'open',
          rooms: initialRooms
        },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  const handleRenameBase = (name: string) => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: {
        ...prev.shelter,
        name
      }
    } : null);
  };

  const handleBuildRoom = (roomType: 'cots' | 'bunk' | 'cabin') => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let updatedInv = [...prev.inventory];
      const woodNeeded = roomType === 'cabin' ? 4 : roomType === 'bunk' ? 3 : 1;
      const nailsNeeded = roomType === 'cabin' ? 15 : roomType === 'bunk' ? 10 : 0;

      let woodToDeduct = woodNeeded;
      for (const item of updatedInv) {
        if ((item.id.includes('wood') || item.id.includes('plank')) && item.quantity > 0 && woodToDeduct > 0) {
          const deduct = Math.min(woodToDeduct, item.quantity);
          item.quantity -= deduct;
          woodToDeduct -= deduct;
        }
      }

      let nailsToDeduct = nailsNeeded;
      for (const item of updatedInv) {
        if (item.id.includes('nail') && item.quantity > 0 && nailsToDeduct > 0) {
          const deduct = Math.min(nailsToDeduct, item.quantity);
          item.quantity -= deduct;
          nailsToDeduct -= deduct;
        }
      }
      updatedInv = updatedInv.filter(i => i.quantity > 0);

      const capacityToAdd = roomType === 'cots' ? 1 : 2;
      const roomName = roomType === 'cabin' ? ('Private Cabin ' + Date.now().toString().slice(-3)) : roomType === 'bunk' ? ('Bunkhouse Wing ' + Date.now().toString().slice(-3)) : ('Lean-To ' + Date.now().toString().slice(-3));
      const newRoom = {
        id: 'room_' + roomType + '_' + Date.now(),
        name: roomName,
        type: roomType,
        capacity: capacityToAdd,
        comfort: roomType === 'cabin' ? 70 : roomType === 'bunk' ? 45 : 20,
        assignedMemberIds: []
      };

      const existingRooms = prev.shelter.rooms && prev.shelter.rooms.length > 0 ? prev.shelter.rooms : [
        { id: 'room_cots_1', name: 'Makeshift Cots & Lean-To', type: 'cots' as const, capacity: 2, comfort: 20, assignedMemberIds: [] },
        { id: 'room_bunk_1', name: 'Main Fortified Bunkhouse', type: 'bunk' as const, capacity: 2, comfort: 45, assignedMemberIds: [] }
      ];

      const currentCapacity = prev.shelter.maxSurvivors || 4;
      const newCapacity = currentCapacity + capacityToAdd;

      const newLog: LogEntry = {
        id: 'build_room_' + Date.now(),
        day: prev.day,
        text: 'Constructed ' + roomName + '! Expanded settlement capacity to ' + newCapacity + ' beds (+' + capacityToAdd + ' beds).',
        type: 'milestone',
        timestamp: 'Construction'
      };

      return {
        ...prev,
        inventory: updatedInv,
        shelter: {
          ...prev.shelter,
          maxSurvivors: newCapacity,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 5),
          rooms: [...existingRooms, newRoom]
        },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  const handleAssignRoom = (memberId: string, roomId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const rooms = prev.shelter.rooms ? [...prev.shelter.rooms] : [
        { id: 'room_cots_1', name: 'Makeshift Cots & Lean-To', type: 'cots' as const, capacity: 2, comfort: 20, assignedMemberIds: [] },
        { id: 'room_bunk_1', name: 'Main Fortified Bunkhouse', type: 'bunk' as const, capacity: 2, comfort: 45, assignedMemberIds: [] }
      ];

      const updatedRooms = rooms.map(r => {
        const filtered = (r.assignedMemberIds || []).filter(id => id !== memberId);
        if (r.id === roomId) {
          filtered.push(memberId);
        }
        return {
          ...r,
          assignedMemberIds: filtered
        };
      });

      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? { ...m, roomId, isSleepingRough: false } : m
      );

      const updatedPlayer = memberId === 'player'
        ? { ...prev.player, roomId }
        : prev.player;

      return {
        ...prev,
        player: updatedPlayer,
        campMembers: updatedMembers,
        shelter: {
          ...prev.shelter,
          rooms: updatedRooms
        }
      };
    });
  };

  const handleUpgradeFacility = (facilityId: 'water_collector' | 'greenhouse' | 'infirmary' | 'schoolhouse' | 'nursery' | 'memorial_garden' | 'chicken_coop' | 'sanctuary_well') => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let updatedInv = [...prev.inventory];
      let logText = '';
      let updatedShelter = { ...prev.shelter };

      if (facilityId === 'water_collector') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 2);
        if (woodItem) woodItem.quantity -= 2;
        updatedShelter.waterCollectorLevel = (updatedShelter.waterCollectorLevel || 1) + 1;
        updatedShelter.maxRainwater = (updatedShelter.maxRainwater || 10) + 5;
        logText = 'Expanded rooftop rainwater cistern to Level ' + updatedShelter.waterCollectorLevel + ' (+5L capacity).';
      } else if (facilityId === 'greenhouse') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 3);
        const waterItem = updatedInv.find(i => i.category === 'water' && i.quantity >= 2);
        if (woodItem) woodItem.quantity -= 3;
        if (waterItem) waterItem.quantity -= 2;
        updatedShelter.greenhouseLevel = (updatedShelter.greenhouseLevel || 0) + 1;
        logText = 'Built rooftop raised greenhouse garden beds (Tier ' + updatedShelter.greenhouseLevel + ')! Fresh vegetables will harvest every 3 days.';
      } else if (facilityId === 'infirmary') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 2);
        const medItem = updatedInv.find(i => i.category === 'medical' && i.quantity >= 2);
        if (woodItem) woodItem.quantity -= 2;
        if (medItem) medItem.quantity -= 2;
        updatedShelter.infirmaryLevel = (updatedShelter.infirmaryLevel || 0) + 1;
        logText = 'Established camp infirmary and triage beds (Tier ' + updatedShelter.infirmaryLevel + ') for sterile medical recovery.';
      } else if (facilityId === 'schoolhouse') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 4);
        const nailItem = updatedInv.find(i => i.id.includes('nail') && i.quantity >= 10);
        if (woodItem) woodItem.quantity -= 4;
        if (nailItem) nailItem.quantity -= 10;
        updatedShelter.hasSchoolhouse = true;
        logText = 'Constructed the Colony Schoolhouse! Children enrolled will gain +1 to all attributes annually.';
      } else if (facilityId === 'nursery') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 3);
        if (woodItem) woodItem.quantity -= 3;
        updatedShelter.hasNursery = true;
        updatedShelter.morale = Math.min(100, (updatedShelter.morale ?? 75) + 20);
        logText = 'Built the Sanctuary Nursery & Daycare! Provides safe cribs for infants (+20% Colony Hope).';
      } else if (facilityId === 'memorial_garden') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 2);
        if (woodItem) woodItem.quantity -= 2;
        updatedShelter.hasMemorialGarden = true;
        updatedShelter.morale = Math.min(100, (updatedShelter.morale ?? 75) + 10);
        logText = 'Dedicated the Memorial Garden & Cemetery to honor fallen founders and ancestors.';
      } else if (facilityId === 'chicken_coop') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 3);
        const nailItem = updatedInv.find(i => i.id.includes('nail') && i.quantity >= 8);
        if (woodItem) woodItem.quantity -= 3;
        if (nailItem) nailItem.quantity -= 8;
        updatedShelter.hasChickenCoop = true;
        updatedShelter.chickenCoopLevel = (updatedShelter.chickenCoopLevel || 0) + 1;
        updatedShelter.morale = Math.min(100, (updatedShelter.morale ?? 75) + 10);
        logText = 'Constructed the Sanctuary Chicken Coop! Laying hens will generate fresh eggs daily for the settlement.';
      } else if (facilityId === 'sanctuary_well') {
        const woodItem = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity >= 4);
        const nailItem = updatedInv.find(i => i.id.includes('nail') && i.quantity >= 12);
        if (woodItem) woodItem.quantity -= 4;
        if (nailItem) nailItem.quantity -= 12;
        updatedShelter.hasSanctuaryWell = true;
        logText = 'Dug and reinforced the Sanctuary Aquifer Well! Provides clean, drought-proof drinking water daily.';
      }

      updatedInv = updatedInv.filter(i => i.quantity > 0);

      return {
        ...prev,
        inventory: updatedInv,
        shelter: updatedShelter,
        logs: [...prev.logs, {
          id: 'facility_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'milestone' as const,
          timestamp: 'Project'
        }].slice(-150)
      };
    });
  };

  const handlePraiseSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const updated = prev.campMembers.map(m =>
        m.id === memberId ? { ...m, trust: Math.min(100, m.trust + 10) } : m
      );

      return {
        ...prev,
        campMembers: updated,
        shelter: {
          ...prev.shelter,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 3)
        },
        logs: [...prev.logs, {
          id: 'praise_' + Date.now(),
          day: prev.day,
          text: 'I commended ' + member.name + ' in front of the camp for their dedicated work (+Morale & Loyalty).',
          type: 'camp' as const,
          timestamp: 'Leadership'
        }].slice(-150)
      };
    });
  };

  const handleSetRationPolicy = (policy: 'full' | 'standard' | 'half') => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: {
        ...prev.shelter,
        rationPolicy: policy,
        morale: policy === 'full' ? Math.min(100, (prev.shelter.morale ?? 75) + 10) : policy === 'half' ? Math.max(10, (prev.shelter.morale ?? 75) - 10) : prev.shelter.morale
      }
    } : null);
  };

  const handleSetSecurityProtocol = (protocol: 'open' | 'quarantine' | 'lockdown') => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: {
        ...prev.shelter,
        securityProtocol: protocol
      }
    } : null);
  };

  // Romance & Courting
  const handleCourtSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const newTrust = Math.min(100, member.trust + 15);
      const isDating = newTrust >= 55;

      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? { 
          ...m, 
          trust: newTrust,
          datingStage: isDating ? ('dating' as const) : m.datingStage
        } : m
      );

      const logText = isDating
        ? '?? Confession of Feelings: I confessed my feelings to ' + member.name + ' under the evening watch. We held hands and agreed to face the apocalypse together as a couple!'
        : 'I spent an hour chatting and laughing with ' + member.name + ' by the candlelight (+Affection & Trust).';

      return {
        ...prev,
        campMembers: updatedMembers,
        player: {
          ...prev.player,
          datingTargetId: isDating ? member.id : prev.player.datingTargetId,
          datingTargetName: isDating ? member.name : prev.player.datingTargetName,
          romanceStage: isDating ? 'dating' : prev.player.romanceStage,
          sanity: Math.min(100, prev.player.sanity + 12)
        },
        logs: [...prev.logs, {
          id: 'court_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'camp' as const,
          timestamp: 'Romance'
        }].slice(-150)
      };
    });
  };

  // Marriage Proposal
  const handleProposeMarriage = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      // Update room to share quarters
      const rooms = prev.shelter.rooms ? [...prev.shelter.rooms] : [
        { id: 'room_cots_1', name: 'Makeshift Cots & Lean-To', type: 'cots' as const, capacity: 2, comfort: 20, assignedMemberIds: [] },
        { id: 'room_bunk_1', name: 'Main Fortified Bunkhouse', type: 'bunk' as const, capacity: 2, comfort: 45, assignedMemberIds: [] }
      ];

      // Assign to private room
      const privateRoom = rooms.find(r => r.type === 'cabin' || r.capacity >= 2) || rooms[0];
      if (privateRoom) {
        privateRoom.assignedMemberIds = Array.from(new Set([...(privateRoom.assignedMemberIds || []), member.id]));
      }

      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? {
          ...m,
          trust: 100,
          datingStage: 'married' as const,
          spouseId: 'player',
          spouseName: prev.player.name
        } : m
      );

      const logText = '?? WEDDING CEREMONY: ' + prev.player.name + ' and ' + member.name + ' were married in the courtyard! Lanterns glowed, wildflowers decorated the altar, and the entire sanctuary cheered. We have moved into shared quarters (+25 Morale).';

      return {
        ...prev,
        campMembers: updatedMembers,
        player: {
          ...prev.player,
          spouseId: member.id,
          spouseName: member.name,
          romanceStage: 'married',
          sanity: 100
        },
        shelter: {
          ...prev.shelter,
          marriagesCount: (prev.shelter.marriagesCount || 0) + 1,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 25),
          rooms
        },
        logs: [...prev.logs, {
          id: 'wedding_player_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'milestone' as const,
          timestamp: 'Wedding'
        }].slice(-150)
      };
    });
  };

  // Try for a baby (explicit family planning)
  const handleTryForBaby = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let updatedPlayer = { ...prev.player };
      let updatedCamp = [...prev.campMembers];
      let motherName = '';

      if (prev.player.gender === 'female') {
        updatedPlayer.isPregnant = true;
        updatedPlayer.pregnancyMonths = 1;
        updatedPlayer.pregnantWith = prev.player.spouseName || prev.player.datingTargetName || 'Partner';
        motherName = prev.player.name;
      } else {
        const targetId = prev.player.spouseId || prev.player.datingTargetId;
        const spouseObj = updatedCamp.find(m => m.id === targetId);
        if (spouseObj) {
          spouseObj.isPregnant = true;
          spouseObj.pregnancyMonths = 1;
          spouseObj.pregnantFatherId = 'player';
          motherName = spouseObj.name;
        } else {
          motherName = prev.player.spouseName || 'Spouse';
        }
      }

      return {
        ...prev,
        player: updatedPlayer,
        campMembers: updatedCamp,
        shelter: {
          ...prev.shelter,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 15)
        },
        logs: [...prev.logs, {
          id: 'try_baby_' + Date.now(),
          day: prev.day,
          text: `👶 Trying for a Baby: You and ${prev.player.spouseName || prev.player.datingTargetName || 'your partner'} dedicated an evening to family planning. ${motherName} is now expecting! The baby will arrive in 9 months (or after a year advance).`,
          type: 'milestone' as const,
          timestamp: 'Family'
        }].slice(-150)
      };
    });
  };

  // Make Love (passionate intimacy with chance of pregnancy)
  const handleMakeLove = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let updatedPlayer = { ...prev.player, sanity: Math.min(100, prev.player.sanity + 15) };
      let updatedCamp = [...prev.campMembers];
      const partnerName = prev.player.spouseName || prev.player.datingTargetName || 'Partner';
      const isAlreadyPregnant = prev.player.isPregnant || updatedCamp.some(m => (m.id === prev.player.spouseId || m.id === prev.player.datingTargetId) && m.isPregnant);
      
      const conceives = !isAlreadyPregnant && Math.random() < 0.35;
      let logMsg = `🔥 Intimate Evening: You and ${partnerName} spent a quiet, restorative evening in each other's arms (+15 Sanity, +10 Morale).`;

      if (conceives) {
        let motherName = '';
        if (prev.player.gender === 'female') {
          updatedPlayer.isPregnant = true;
          updatedPlayer.pregnancyMonths = 1;
          updatedPlayer.pregnantWith = partnerName;
          motherName = prev.player.name;
        } else {
          const targetId = prev.player.spouseId || prev.player.datingTargetId;
          const spouseObj = updatedCamp.find(m => m.id === targetId);
          if (spouseObj) {
            spouseObj.isPregnant = true;
            spouseObj.pregnancyMonths = 1;
            spouseObj.pregnantFatherId = 'player';
            motherName = spouseObj.name;
          } else {
            motherName = partnerName;
          }
        }
        logMsg = `🔥 Intimate Passion & Conception: You and ${partnerName} spent an unforgettable evening together (+15 Sanity). Joyful news followed: ${motherName} is expecting a baby! Due in 9 months.`;
      }

      return {
        ...prev,
        player: updatedPlayer,
        campMembers: updatedCamp,
        shelter: {
          ...prev.shelter,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 10)
        },
        logs: [...prev.logs, {
          id: 'makelove_' + Date.now(),
          day: prev.day,
          text: logMsg,
          type: conceives ? ('milestone' as const) : ('camp' as const),
          timestamp: 'Romance'
        }].slice(-150)
      };
    });
  };

  // Hook up (with or without protection)
  const handleHookupSurvivor = (memberId: string, useProtection: boolean) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      let updatedPlayer = { ...prev.player, sanity: Math.min(100, prev.player.sanity + 15) };
      let updatedCamp = [...prev.campMembers];
      let logMsg = '';
      let isConceived = false;

      const isAffair = (prev.player.romanceStage === 'married' && prev.player.spouseId !== member.id) || (member.datingStage === 'married' && member.spouseId !== 'player');

      if (useProtection) {
        logMsg = `🔥 Secret Encounter: You and ${member.name} shared an intimate, stolen hour together behind closed doors (Using protection: zero risk of pregnancy, +15 Sanity).`;
      } else {
        const conceives = Math.random() < 0.35;
        if (conceives) {
          isConceived = true;
          if (prev.player.gender === 'female') {
            updatedPlayer.isPregnant = true;
            updatedPlayer.pregnancyMonths = 1;
            updatedPlayer.pregnantWith = member.name;
          } else {
            const mObj = updatedCamp.find(m => m.id === memberId);
            if (mObj) {
              mObj.isPregnant = true;
              mObj.pregnancyMonths = 1;
              mObj.pregnantFatherId = 'player';
            }
          }
          logMsg = `🔥 Wild Passion (Unprotected): You and ${member.name} surrendered to raw desire without protection (+20 Sanity)! Later, signs indicate a pregnancy has begun! Expected in 9 months.`;
        } else {
          logMsg = `🔥 Passionate Risk: You and ${member.name} hooked up without protection (+20 Sanity). Fortunately, no pregnancy occurred this time.`;
        }
      }

      if (isAffair) {
        logMsg += ` (Guilt & Tension: A dangerous secret kept from the colony).`;
      }

      updatedCamp = updatedCamp.map(m => m.id === memberId ? { ...m, trust: Math.min(100, m.trust + 10) } : m);

      return {
        ...prev,
        player: updatedPlayer,
        campMembers: updatedCamp,
        logs: [...prev.logs, {
          id: 'hookup_' + Date.now(),
          day: prev.day,
          text: logMsg,
          type: isConceived ? ('milestone' as const) : ('camp' as const),
          timestamp: 'Encounter'
        }].slice(-150)
      };
    });
  };

  // Seduce survivor
  const handleSeduceSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const isAffair = (prev.player.romanceStage === 'married' && prev.player.spouseId !== member.id) || (member.datingStage === 'married' && member.spouseId !== 'player');

      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? { ...m, trust: Math.min(100, m.trust + 12) } : m
      );

      const logMsg = isAffair
        ? `🔥 Forbidden Seduction: You shared intimate touches and whispering glances with ${member.name} by the watchtower. A spark was lit despite your commitments (+Affection & Danger).`
        : `🔥 Seduction: You spent an electric evening teasing and flirting with ${member.name}. Mutual attraction flared (+Affection).`;

      return {
        ...prev,
        campMembers: updatedMembers,
        player: { ...prev.player, sanity: Math.min(100, prev.player.sanity + 10) },
        logs: [...prev.logs, {
          id: 'seduce_' + Date.now(),
          day: prev.day,
          text: logMsg,
          type: 'camp' as const,
          timestamp: 'Seduction'
        }].slice(-150)
      };
    });
  };

  // Spar & train combat
  const handleSparSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const updatedMembers = prev.campMembers.map(m =>
        m.id === memberId ? { 
          ...m, 
          combatSkill: Math.min(10, (m.combatSkill || 5) + 1),
          fitnessSkill: Math.min(10, (m.fitnessSkill || 5) + 1),
          trust: Math.min(100, m.trust + 8)
        } : m
      );

      return {
        ...prev,
        campMembers: updatedMembers,
        player: {
          ...prev.player,
          combatSkill: Math.min(10, prev.player.combatSkill + 1),
          fitnessSkill: Math.min(10, prev.player.fitnessSkill + 1),
          sanity: Math.min(100, prev.player.sanity + 10)
        },
        logs: [...prev.logs, {
          id: 'spar_' + Date.now(),
          day: prev.day,
          text: `⚔️ Sparring Session: You and ${member.name} spent hours drilling hand-to-hand disarms and melee evasion in the courtyard (+Combat & Fitness for both).`,
          type: 'general' as const,
          timestamp: 'Training'
        }].slice(-150)
      };
    });
  };

  // Matchmaking
  const handleMatchmake = (member1Id: string, member2Id: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const m1 = prev.campMembers.find(m => m.id === member1Id);
      const m2 = prev.campMembers.find(m => m.id === member2Id);
      if (!m1 || !m2) return prev;

      const updatedMembers = prev.campMembers.map(m => {
        if (m.id === member1Id) {
          return { ...m, datingStage: 'married' as const, spouseId: m2.id, spouseName: m2.name, trust: 100 };
        }
        if (m.id === member2Id) {
          return { ...m, datingStage: 'married' as const, spouseId: m1.id, spouseName: m1.name, trust: 100 };
        }
        return m;
      });

      const rooms = prev.shelter.rooms ? [...prev.shelter.rooms] : [];
      const sharedRoom = rooms.find(r => r.type === 'cabin' || r.capacity >= 2) || rooms[0];
      if (sharedRoom) {
        sharedRoom.assignedMemberIds = Array.from(new Set([...(sharedRoom.assignedMemberIds || []), m1.id, m2.id]));
      }

      return {
        ...prev,
        campMembers: updatedMembers,
        shelter: {
          ...prev.shelter,
          marriagesCount: (prev.shelter.marriagesCount || 0) + 1,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 15),
          rooms
        },
        logs: [...prev.logs, {
          id: 'matchmake_' + Date.now(),
          day: prev.day,
          text: `💍 Colony Marriage Arranged: As leader, you blessed the union between ${m1.name} and ${m2.name}! The colony cheered and celebrated their new life together (+15 Morale).`,
          type: 'milestone' as const,
          timestamp: 'Wedding'
        }].slice(-150)
      };
    });
  };

  // Move player quarters
  const handleAssignPlayerRoom = (roomId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const rooms = prev.shelter.rooms ? [...prev.shelter.rooms] : [];
      const targetRoom = rooms.find(r => r.id === roomId);
      const roomName = targetRoom ? targetRoom.name : 'Living Quarters';

      const updatedRooms = rooms.map(r => {
        const filtered = (r.assignedMemberIds || []).filter(id => id !== 'player');
        if (r.id === roomId) {
          filtered.push('player');
        }
        return { ...r, assignedMemberIds: filtered };
      });

      return {
        ...prev,
        player: { ...prev.player, roomId },
        shelter: { ...prev.shelter, rooms: updatedRooms },
        logs: [...prev.logs, {
          id: 'player_room_' + Date.now(),
          day: prev.day,
          text: `🏡 Relocated Quarters: You moved your personal living space into ${roomName}! (+Sanity & Comfort).`,
          type: 'camp' as const,
          timestamp: 'Housing'
        }].slice(-150)
      };
    });
  };

  // Tidy Room
  const handleTidyRoom = (roomId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const rooms = (prev.shelter.rooms || []).map(r =>
        r.id === roomId ? { ...r, comfort: Math.min(100, r.comfort + 5) } : r
      );
      return {
        ...prev,
        player: { ...prev.player, sanity: Math.min(100, prev.player.sanity + 6) },
        shelter: { ...prev.shelter, rooms }
      };
    });
  };

  // Reinforce Room
  const handleReinforceRoom = (roomId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const wood = prev.inventory.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity > 0);
      let updatedInv = prev.inventory;
      if (wood) {
        updatedInv = updatedInv.map(i => i === wood ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      }
      const rooms = (prev.shelter.rooms || []).map(r =>
        r.id === roomId ? { ...r, comfort: Math.min(100, r.comfort + 10) } : r
      );
      return {
        ...prev,
        inventory: updatedInv,
        shelter: {
          ...prev.shelter,
          rooms,
          barricadeIntegrity: Math.min(100, prev.shelter.barricadeIntegrity + 5)
        }
      };
    });
  };

  // Facilities Instant Interaction
  const handleInteractFacility = (facilityType: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let updatedInv = [...prev.inventory];
      let logText = '';
      let hpDelta = 0;
      let sanityDelta = 0;
      let moraleDelta = 0;

      if (facilityType === 'greenhouse') {
        const veg = { id: 'harvest_veg_' + Date.now(), name: 'Fresh Harvest Vegetables', category: 'food' as const, quantity: 2, description: 'Fresh vegetables.' };
        updatedInv.push(veg);
        logText = '🌱 Tended rooftop raised beds: Harvested +2 fresh vegetable rations (+10 Sanity).';
        sanityDelta = 10;
      } else if (facilityType === 'chicken_coop') {
        const eggs = { id: 'eggs_' + Date.now(), name: 'Fresh Farm Eggs', category: 'food' as const, quantity: 4, description: 'Fresh eggs.' };
        updatedInv.push(eggs);
        logText = '🥚 Tended chicken coop: Collected +4 farm eggs (+5 Morale).';
        moraleDelta = 5;
      } else if (facilityType === 'sanctuary_well') {
        const water = { id: 'well_water_' + Date.now(), name: 'Purified Aquifer Water', category: 'water' as const, quantity: 3, description: 'Clean drinking water.' };
        updatedInv.push(water);
        logText = '💧 Drew clean, drought-proof aquifer drinking water (+3 Water).';
      } else if (facilityType === 'infirmary') {
        hpDelta = 15;
        logText = '🩺 Rested in clean triage cot: Wounds sterilized and dressed (+15 HP).';
      } else if (facilityType === 'nursery') {
        moraleDelta = 10;
        sanityDelta = 10;
        logText = '🧸 Checked in on the nursery: Ensured swaddles and cribs were warm (+10 Morale & Sanity).';
      } else if (facilityType === 'schoolhouse') {
        sanityDelta = 10;
        logText = '🎓 Held an afternoon sanctuary class: Taught history and survival mathematics (+10 Sanity).';
      } else if (facilityType === 'memorial_garden') {
        sanityDelta = 15;
        logText = '🌸 Placed fresh wildflowers at the Memorial Garden: Paid respects to fallen pioneers (+15 Sanity).';
      }

      return {
        ...prev,
        inventory: updatedInv,
        player: {
          ...prev.player,
          health: Math.min(100, prev.player.health + hpDelta),
          sanity: Math.min(100, prev.player.sanity + sanityDelta)
        },
        shelter: {
          ...prev.shelter,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + moraleDelta)
        },
        logs: [...prev.logs, {
          id: 'fac_act_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'camp' as const,
          timestamp: 'Sanctuary'
        }].slice(-150)
      };
    });
  };

  // Toddler & Child Interactions
  const handleToddlerInteract = (childId: string, actionType: 'play' | 'words' | 'story' | 'feed') => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let childName = 'the child';
      let logText = '';
      let updatedInv = [...prev.inventory];

      let updatedPlayerKids = (prev.player.children || []).map(c => {
        if (c.id === childId) {
          childName = c.name;
          if (actionType === 'words') {
            const currentSkills = { ...(c.skills || { combat: 3, medical: 3, crafting: 3, stealth: 3, fitness: 3 }) };
            currentSkills.crafting = Math.min(10, currentSkills.crafting + 1);
            return { ...c, skills: currentSkills };
          }
        }
        return c;
      });

      let updatedCamp = prev.campMembers.map(m => {
        if (m.id === childId) {
          childName = m.name;
          if (actionType === 'words') {
            return { ...m, craftingSkill: Math.min(10, (m.craftingSkill || 1) + 1) };
          }
        }
        return m;
      });

      if (actionType === 'play') {
        logText = `🧸 Cuddled and played games with little ${childName} (+15 Sanity, +10 Colony Morale).`;
      } else if (actionType === 'words') {
        logText = `📖 Taught first words, numbers, and basic survival tools to ${childName} (+Skill).`;
      } else if (actionType === 'story') {
        logText = `🌙 Read a soothing bedtime story to ${childName} by the candle (+10 Sanity).`;
      } else if (actionType === 'feed') {
        const food = updatedInv.find(i => i.category === 'food' && i.quantity > 0);
        if (food) food.quantity -= 1;
        updatedInv = updatedInv.filter(i => i.quantity > 0);
        logText = `🥣 Fed warm vegetable broth to little ${childName}. They are well-nourished and happy (+Health).`;
      }

      return {
        ...prev,
        inventory: updatedInv,
        player: {
          ...prev.player,
          children: updatedPlayerKids,
          sanity: Math.min(100, prev.player.sanity + 12)
        },
        campMembers: updatedCamp,
        shelter: {
          ...prev.shelter,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 5)
        },
        logs: [...prev.logs, {
          id: 'toddler_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'camp' as const,
          timestamp: 'Family'
        }].slice(-150)
      };
    });
  };

  // Decrees
  const handleSetFarmingDecree = (decree: 'standard' | 'intensive' | 'water_saving') => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: { ...prev.shelter, farmingDecree: decree }
    } : null);
  };

  const handleSetScavengeQuotaDecree = (decree: 'conservative' | 'balanced' | 'aggressive') => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: { ...prev.shelter, scavengeQuotaDecree: decree }
    } : null);
  };

  const handleSetBirthDecree = (decree: 'encouraged' | 'normal' | 'austerity') => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      shelter: { ...prev.shelter, birthDecree: decree }
    } : null);
  };

  // Baby Naming confirmation
  const handleConfirmBabyNaming = (fullName: string) => {
    if (!gameState || !gameState.pendingBabyNaming) return;
    const prompt = gameState.pendingBabyNaming;

    setGameState(prev => {
      if (!prev) return null;
      let updatedPlayer = { ...prev.player };
      let updatedCamp = [...prev.campMembers];

      if (prompt.isPlayerChild) {
        const newChild = {
          id: 'child_player_' + Date.now(),
          name: fullName,
          age: 0,
          gender: prompt.gender,
          stage: 'infant' as const,
          skills: {
            combat: Math.floor(prev.player.combatSkill * 0.5) + 2,
            medical: Math.floor(prev.player.medicalSkill * 0.5) + 2,
            crafting: Math.floor(prev.player.craftingSkill * 0.5) + 2,
            stealth: Math.floor(prev.player.stealthSkill * 0.5) + 2,
            fitness: Math.floor(prev.player.fitnessSkill * 0.5) + 2
          }
        };
        updatedPlayer.children = [...(updatedPlayer.children || []), newChild];
      } else {
        const newBabyMember: CampMember = {
          id: 'baby_' + Date.now(),
          name: fullName,
          gender: prompt.gender,
          age: 0,
          relation: 'Colony Infant',
          profession: 'Colony Infant',
          health: 100,
          trust: 100,
          isChild: true,
          stage: 'infant',
          role: 'idle',
          statusEffects: [],
          combatSkill: 1,
          medicalSkill: 1,
          craftingSkill: 1,
          stealthSkill: 1,
          fitnessSkill: 1,
          parentNames: [prompt.motherName, prompt.fatherName]
        };
        updatedCamp.push(newBabyMember);
      }

      const logText = `👶 A Child Born in the Ruins: ${fullName} was officially named and recorded in the colony registry! Lanterns glowed as the entire sanctuary toasted to our future (+25 Morale).`;

      return {
        ...prev,
        player: updatedPlayer,
        campMembers: updatedCamp,
        pendingBabyNaming: null,
        stats: {
          ...prev.stats,
          childrenRaised: (prev.stats.childrenRaised || 0) + 1
        },
        shelter: {
          ...prev.shelter,
          childrenBornCount: (prev.shelter.childrenBornCount || 0) + 1,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 25)
        },
        logs: [...prev.logs, {
          id: 'birth_named_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'milestone' as const,
          timestamp: 'New Life'
        }].slice(-150)
      };
    });
  };
// Child Mentorship & Stat Passing
  const handleMentorChild = (childId: string, skill: 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness') => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let childName = '';
      const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);

      const updatedChildren = (prev.player.children || []).map(c => {
        if (c.id === childId) {
          childName = c.name;
          const currentSkills = { ...(c.skills || { combat: 5, medical: 5, crafting: 5, stealth: 5, fitness: 5 }) };
          currentSkills[skill] = Math.min(10, currentSkills[skill] + 1);
          return {
            ...c,
            skills: currentSkills,
            lastMentoredDay: prev.day
          };
        }
        return c;
      });

      const logText = '�<ߓ Mentorship Passed Down: I spent the day training ' + childName + ' in ' + skillName + ' (+1 ' + skillName + '). Our survival knowledge will outlive the apocalypse!';

      return {
        ...prev,
        player: {
          ...prev.player,
          children: updatedChildren,
          sanity: Math.min(100, prev.player.sanity + 10)
        },
        logs: [...prev.logs, {
          id: 'mentor_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'milestone' as const,
          timestamp: 'Mentorship'
        }].slice(-150)
      };
    });
  };

  // Bestow or Inscribe Family Heirloom
  const handleBestowHeirloom = (name: string, type: 'weapon' | 'ring' | 'journal' | 'tool' | 'locket', bonusSkill: 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness') => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const newHeirloom: FamilyHeirloom = {
        id: 'heirloom_' + Date.now(),
        name,
        type,
        bonusSkill,
        bonusValue: 1,
        description: 'Generational heirloom inscribed by founder ' + prev.player.name + '.',
        passedFrom: prev.player.name,
        generation: prev.player.generation || 1
      };

      const existing = prev.player.heirlooms ? [...prev.player.heirlooms] : [];

      return {
        ...prev,
        player: {
          ...prev.player,
          heirlooms: [...existing, newHeirloom]
        },
        logs: [...prev.logs, {
          id: 'heirloom_' + Date.now(),
          day: prev.day,
          text: '✨ Generational Heirloom Inscribed: Dedicated "' + name + '" as a family relic (+1 ' + bonusSkill + '). It will be passed down to our descendants.',
          type: 'milestone' as const,
          timestamp: 'Dynasty'
        }].slice(-150)
      };
    });
  };

  // Succession / Passing the Torch
  const handleSelectSuccessor = (candidateId: string) => {
    if (!gameState || !gameState.legacySuccessionPrompt) return;
    const prompt = gameState.legacySuccessionPrompt;
    const candidate = prompt.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    setGameState(prev => {
      if (!prev) return null;
      const isOffspring = candidate.isOffspring;
      const newGeneration = (prev.player.generation || 1) + 1;

      // Filter successor out of camp members
      const survivingSiblings: CampMember[] = (prev.player.children || [])
        .filter(c => c.id !== candidate.id)
        .map(c => ({
          id: c.id,
          name: c.name,
          gender: c.gender,
          age: c.age,
          relation: c.age >= 16 ? 'Sibling' : 'Younger Sibling',
          profession: c.age >= 16 ? 'Haven Pioneer' : 'Colony Child',
          health: 100,
          trust: 95,
          isChild: c.age < 16,
          stage: c.stage,
          combatSkill: c.skills?.combat || 5,
          medicalSkill: c.skills?.medical || 5,
          craftingSkill: c.skills?.crafting || 5,
          stealthSkill: c.skills?.stealth || 5,
          fitnessSkill: c.skills?.fitness || 5,
          role: (c.age >= 16 ? 'guard' : 'idle') as CampRole,
          statusEffects: [],
          parentNames: [prev.player.name, prev.player.spouseName || 'Parent']
        }));

      const updatedMembers = [...prev.campMembers.filter(m => m.id !== candidate.id), ...survivingSiblings];

      if (prev.player.will?.founderCreed) {
        const creed = prev.player.will.founderCreed;
        if (creed === 'endure') {
          candidate.skills.combat = Math.min(10, candidate.skills.combat + 2);
          candidate.skills.fitness = Math.min(10, candidate.skills.fitness + 2);
        } else if (creed === 'build') {
          candidate.skills.crafting = Math.min(10, candidate.skills.crafting + 2);
        } else if (creed === 'adapt') {
          candidate.skills.stealth = Math.min(10, candidate.skills.stealth + 2);
        }
      }

      const successorSurvivor: Survivor = {
        name: candidate.name,
        age: candidate.age,
        ageGroup: candidate.age < 30 ? 'Prime' : candidate.age < 50 ? 'Middle-Aged' : 'Senior',
        profession: candidate.profession,
        bio: isOffspring 
          ? "Second-generation survivor born in the sanctuary, carrying forward their parent's dream."
          : 'Trusted colony companion chosen by consensus to lead the sanctuary.',
        health: 100,
        sanity: 85,
        hunger: 80,
        thirst: 85,
        infectionRisk: 0,
        combatSkill: candidate.skills.combat,
        medicalSkill: candidate.skills.medical,
        craftingSkill: candidate.skills.crafting,
        stealthSkill: candidate.skills.stealth,
        fitnessSkill: candidate.skills.fitness,
        traits: prev.player.traits ? prev.player.traits.slice(0, 2) : [],
        statusEffects: [],
        isDead: false,
        romanceStage: 'single',
        generation: newGeneration,
        children: []
      };

      const newLog: LogEntry = {
        id: 'succession_' + Date.now(),
        day: prev.day,
        text: '?? GENERATION ' + newGeneration + ' COMMENCES: ' + candidate.name + ' has stepped forward and claimed leadership of ' + prev.shelter.name + '. The colony perseveres!',
        type: 'milestone',
        timestamp: 'Succession'
      };

      // Record fallen leader into cemetery
      const newRecord = buildCemeteryRecord(prev, undefined, prompt.cause === 'Old Age' ? 'peacefully passed away of old age at ' + prev.player.age : 'fallen in the line of duty');
      const updatedGrave = [newRecord, ...graveyard].slice(0, 50);
      setGraveyard(updatedGrave);
      localStorage.setItem(GRAVEYARD_KEY, JSON.stringify(updatedGrave));

      return {
        ...prev,
        player: successorSurvivor,
        campMembers: updatedMembers,
        legacySuccessionPrompt: null,
        activeDilemma: null,
        dilemmaResult: null,
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  const handleDeclineSuccession = () => {
    if (!gameState) return;
    setGameState(prev => prev ? {
      ...prev,
      legacySuccessionPrompt: null
    } : null);
  };

  const handleForfeitRun = () => {
    if (!gameState) return;
    const newRecord = buildCemeteryRecord(gameState, 'Fallen Survivor', 'forfeited the will to survive in the ruins');
    const updated = [newRecord, ...graveyard].slice(0, 50);
    setGraveyard(updated);
    localStorage.setItem(GRAVEYARD_KEY, JSON.stringify(updated));
    localStorage.removeItem(SAVE_KEY);
    setGameState(null);
    setScreen('title');
  };

  const handleTriggerEvac = (ambition: SandboxAmbition) => {
    if (!gameState) return;
    setShowAmbitionsModal(false);

    const newLog: LogEntry = {
      id: 'evac_' + Date.now(),
      day: gameState.day,
      text: ambition.evacStory,
      type: 'milestone',
      timestamp: 'Evac'
    };

    const victoryRecord = buildCemeteryRecord(gameState, ambition.rewardRibbon, 'Escaped the quarantine: ' + ambition.title);
    const updatedGrave = [victoryRecord, ...graveyard].slice(0, 50);
    setGraveyard(updatedGrave);
    localStorage.setItem(GRAVEYARD_KEY, JSON.stringify(updatedGrave));

    setGameState({
      ...gameState,
      logs: [...gameState.logs, newLog].slice(-150),
      dilemmaResult: {
        title: ambition.title + ' — Evacuation Success',
        text: ambition.evacStory,
        isFatal: false
      }
    });
  };

  const handleExileSurvivor = (memberId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const member = prev.campMembers.find(m => m.id === memberId);
      if (!member) return prev;

      const updated = prev.campMembers.filter(m => m.id !== memberId);
      const newLog: LogEntry = {
        id: `log_exile_${Date.now()}`,
        day: prev.day,
        text: `I banished ${member.name} from the camp. They walked out into the ruins.`,
        type: 'camp',
        timestamp: 'Exile'
      };

      return {
        ...prev,
        campMembers: updated,
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  // Outbreak Origin Mystery Solving & Vault Breach
  const handleSolveMystery = () => {
    if (!gameState || !gameState.mystery) return;
    const mystery = gameState.mystery;

    setGameState(prev => {
      if (!prev || !prev.mystery) return null;
      let updatedInv = [...prev.inventory];
      for (const item of mystery.rewardItems) {
        const ex = updatedInv.find(i => i.id === item.id);
        if (ex) ex.quantity += item.quantity;
        else updatedInv.push({ ...item });
      }

      const updatedMystery = {
        ...prev.mystery,
        isSolved: true
      };

      const updatedCodex: CodexSaveData = {
        ...codexData,
        legacyMarks: codexData.legacyMarks + 60,
        completedMysteryIds: Array.from(new Set([...(codexData.completedMysteryIds || []), mystery.id]))
      };
      saveCodexData(updatedCodex);
      setCodexData(updatedCodex);

      return {
        ...prev,
        inventory: updatedInv,
        mystery: updatedMystery,
        player: { ...prev.player, sanity: Math.min(100, prev.player.sanity + 30) },
        logs: [...prev.logs, {
          id: 'mystery_solved_' + Date.now(),
          day: prev.day,
          text: '🏛️ VAULT BREACHED: Classified coordinates decrypted! We breached ' + mystery.rewardBunkerName + ' and secured military armaments, surgical rigs, and emergency rations (+60 Legacy Marks, +30 Sanity)!',
          type: 'milestone' as const,
          timestamp: 'Breakthrough'
        }].slice(-150)
      };
    });
    setShowInvestigationBoard(false);
  };

  // Quick Voluntary Activities
  const handleQuickActivity = (activityId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      let { health, sanity } = { ...prev.player };
      let updatedInv = [...prev.inventory];
      let logText = '';
      let logType: LogEntry['type'] = 'general';

      // Check if searching vehicles triggers the vehicle trail chapter!
      const vehicleDilemma = getNextBackstoryDilemma(prev, prev.day, 'vehicle');
      if (vehicleDilemma && activityId === 'search_vehicles') {
        return { ...prev, activeDilemma: vehicleDilemma };
      }

      if (activityId === 'search_vehicles') {
        const isHazard = Math.random() < 0.25;
        if (isHazard) {
          health = Math.max(10, health - 6);
          logText = 'While prying open an abandoned car door, jagged metal sliced my arm (-6% HP). Found nothing inside.';
          logType = 'hazard';
        } else {
          const lootPool = [
            { id: 'loose_soda', name: 'Can of Lemon Soda', category: 'water' as const, quantity: 1, description: 'Canned soda.' },
            { id: 'batteries_aa', name: 'Pack of AA Batteries', category: 'resource' as const, quantity: 2, description: 'Power cells.' },
            { id: 'duct_tape_car', name: 'Roll of Duct Tape', category: 'tool' as const, quantity: 1, description: 'Heavy tape.' }
          ];
          const found = lootPool[Math.floor(Math.random() * lootPool.length)];
          const ex = updatedInv.find(i => i.id === found.id);
          if (ex) ex.quantity += found.quantity;
          else updatedInv.push({ ...found });
          logText = `I searched the glovebox of an abandoned sedan on the curb and found ${found.name}.`;
          logType = 'loot';
        }
      } else if (activityId === 'rooftop_recon') {
        const reconDilemma = getNextBackstoryDilemma(prev, prev.day, 'recon');
        if (reconDilemma) {
          return { ...prev, activeDilemma: reconDilemma };
        }
        sanity = Math.min(100, sanity + 15);
        logText = 'I spent an hour on the rooftop scanning the avenues with binoculars. Mapped the street layout (+15 Sanity).';
      } else if (activityId === 'workout') {
        health = Math.min(100, health + 5);
        prev.player.fitnessSkill = Math.min(10, prev.player.fitnessSkill + 1);
        logText = 'I did sprint drills and calisthenics in the corridor. Reflexes and endurance sharpened (+5 HP, Fitness conditioned).';
      } else if (activityId === 'meditate') {
        sanity = Math.min(100, sanity + 20);
        logText = 'I sat quietly by candlelight and let my pulse slow down. Found peace in the quiet dark (+20 Sanity).';
      } else if (activityId === 'radio_tune') {
        const radioDilemma = getNextBackstoryDilemma(prev, prev.day, 'radio');
        if (radioDilemma) {
          return { ...prev, activeDilemma: radioDilemma };
        }
        sanity = Math.min(100, sanity + 10);
        logText = 'I spun the emergency radio dial through static, listening for human voices or weather alerts (+10 Sanity).';
      } else if (activityId === 'craft_spiked_bat') {
        const bat = updatedInv.find(i => i.id.includes('bat'));
        const nails = updatedInv.find(i => i.id.includes('nail'));
        if (bat && nails && nails.quantity >= 10) {
          bat.quantity -= 1;
          nails.quantity -= 10;
          updatedInv = updatedInv.filter(i => i.quantity > 0);
          updatedInv.push({ id: 'spiked_bat_' + Date.now(), name: 'Spiked Baseball Bat', category: 'weapon', quantity: 1, description: 'Forged nails driven through hardwood for lethal blunt trauma.' });
          logText = 'I hammered ten 3-inch framing nails through the baseball bat, creating a lethal spiked bludgeon.';
          logType = 'milestone';
        }
      } else if (activityId === 'craft_spear') {
        const knife = updatedInv.find(i => (i.id.includes('knife') || i.id.includes('blade') || i.id.includes('scalpel')));
        const plank = updatedInv.find(i => (i.id.includes('wood') || i.id.includes('plank')));
        const tape = updatedInv.find(i => (i.id.includes('tape') || i.id.includes('cord')));
        if (knife && plank && tape) {
          knife.quantity -= 1;
          plank.quantity -= 1;
          tape.quantity -= 1;
          updatedInv = updatedInv.filter(i => i.quantity > 0);
          updatedInv.push({ id: 'makeshift_spear_' + Date.now(), name: 'Makeshift Hunting Spear', category: 'weapon', quantity: 1, description: 'Long-range melee spear taped to cured timber.' });
          logText = 'I bound the hunting blade tightly to a timber shaft with heavy gorilla tape. Created a long-reach spear.';
          logType = 'milestone';
        }
      } else if (activityId === 'craft_molotov') {
        const fuel = updatedInv.find(i => (i.id.includes('alcohol') || i.id.includes('whiskey') || i.id.includes('fuel')));
        const matches = updatedInv.find(i => (i.id.includes('match') || i.id.includes('fire')));
        if (fuel && matches) {
          fuel.quantity -= 1;
          matches.quantity -= 1;
          updatedInv = updatedInv.filter(i => i.quantity > 0);
          updatedInv.push({ id: 'molotov_' + Date.now(), name: 'Molotov Firebomb', category: 'weapon', quantity: 1, description: 'Glass bottle fuel bomb to incinerate swarms.' });
          logText = 'I stuffed a cloth rag into a whiskey bottle to create a makeshift Molotov firebomb.';
          logType = 'milestone';
        }
      }

      const newLog: LogEntry = {
        id: 'act_' + Date.now(),
        day: prev.day,
        text: logText,
        type: logType,
        timestamp: 'Activity'
      };

      return {
        ...prev,
        inventory: updatedInv,
        player: { ...prev.player, health, sanity },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });

    setActiveTab('journal');
  };

  // Stoke woodstove for heating
  const handleStokeWoodstove = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const wood = prev.inventory.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity > 0);
      let updatedInv = prev.inventory;
      if (wood) {
        updatedInv = updatedInv.map(i => i === wood ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      }
      return {
        ...prev,
        inventory: updatedInv,
        shelter: {
          ...prev.shelter,
          heatingDaysRemaining: (prev.shelter.heatingDaysRemaining || 0) + 7,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 5)
        },
        logs: [...prev.logs, {
          id: 'stove_' + Date.now(),
          day: prev.day,
          text: '🔥 Stoked Woodstove: Loaded cured timber into the central stove (+7 Days Haven Heat, +Warmth & Morale).',
          type: 'camp' as const,
          timestamp: 'Sanctuary'
        }].slice(-150)
      };
    });
  };

  // Formalize Founder's Will & Testament
  const handleSaveWill = (will: WillAndTestament) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        player: { ...prev.player, will },
        logs: [...prev.logs, {
          id: 'will_' + Date.now(),
          day: prev.day,
          text: '📜 Dynasty Will & Testament Sealed: Overseer ' + prev.player.name + ' named ' + will.designatedHeirName + ' as designated successor under the creed of "' + will.creedTitle + '".',
          type: 'milestone' as const,
          timestamp: 'Dynasty'
        }].slice(-150)
      };
    });
  };

  // Launch Scavenge Expedition
  const handleLaunchExpedition = (locationId: string, companionId?: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;

      // Special expedition to visit other survivors at their outpost
      if (locationId === 'survivor_outpost') {
        const outpostDilemma = getSurvivorOutpostDilemma(prev);
        return {
          ...prev,
          activeDilemma: outpostDilemma,
          stats: {
            ...prev.stats,
            scavengeRuns: prev.stats.scavengeRuns + 1
          }
        };
      }

      // Check if this scavenge landmark triggers the backstory chapter/climax!
      const landmarkDilemma = getNextBackstoryDilemma(prev, prev.day, 'scavenge', locationId);
      if (landmarkDilemma) {
        return {
          ...prev,
          activeDilemma: landmarkDilemma,
          stats: { ...prev.stats, scavengeRuns: prev.stats.scavengeRuns + 1 }
        };
      }

      const profession = prev.player.profession.toLowerCase();
      const traits = prev.player.traits ? prev.player.traits.map(t => t.id) : [];
      const hasTrait = (id: string) => traits.includes(id);

      const companion = companionId 
        ? (prev.campMembers.find(m => m.id === companionId) || (prev.player.children || []).find(c => c.id === companionId))
        : null;

      const compRole = companion ? ((companion as any).role || 'scavenger') : null;
      const isOffspring = companion ? (prev.player.children || []).some(c => c.id === companionId) : false;
      const isSpouse = companion ? companion.id === prev.player.spouseId : false;

      let successRate = 0.60 + (prev.player.stealthSkill * 0.04);
      if (companion) successRate += 0.12;
      if (prev.player.equippedWeaponId) successRate += 0.10; // Equipped weapon combat bonus // Base teamwork bonus
      if (compRole === 'guard') successRate += 0.15; // Guard covering fire
      if (compRole === 'scavenger') successRate += 0.10; // Scout route reconnaissance
      const isSuccess = Math.random() < Math.max(0.15, Math.min(0.95, successRate));
      let newItems: InventoryItem[] = [];
      let logText = '';
      let hpDelta = 0;

      const baseDamage = locationId === 'police_precinct' ? 24 : locationId === 'pharmacy' ? 18 : 12;
      let damageReduction = Math.min(18, Math.floor(prev.player.combatSkill * 1.4) + Math.floor(prev.player.fitnessSkill * 1.0));

      // Trait combat & escape modifiers
      if (hasTrait('martial_artist')) damageReduction += 8; // Counters grapples
      if (hasTrait('sprinter')) damageReduction += 6;       // Outruns swarms
      if (hasTrait('feeble')) damageReduction = Math.max(0, damageReduction - 6);
      if (hasTrait('knee_injury')) damageReduction = Math.max(0, damageReduction - 5);

      if (prev.player.equippedWeaponId) damageReduction += 4; // Weapon parry & strike
      let mitigatedDamage = Math.max(2, baseDamage - damageReduction);
      if (hasTrait('thick_skinned')) {
        mitigatedDamage = Math.max(2, Math.floor(mitigatedDamage * 0.75));
      }
      if (compRole === 'medic') {
        mitigatedDamage = Math.max(1, Math.floor(mitigatedDamage * 0.5)); // Medic field dressing reduces damage
      }
      if (compRole === 'guard') {
        mitigatedDamage = Math.max(1, mitigatedDamage - 6); // Guard absorbs impact
      }

      if (locationId === 'pharmacy') {
        const medBonus = (profession.includes('paramedic') || profession.includes('doctor') || profession.includes('surgeon') || profession.includes('veterinarian')) ? 3 : 0;
        if (isSuccess) {
          newItems = [
            { id: 'bandage_scavenged', name: 'Field Dressing Bandages', category: 'medical', quantity: 2 + (prev.player.medicalSkill >= 6 ? 1 : 0), description: 'Sterile roll bandage.' },
            { id: 'antibiotics_scavenged', name: 'Amoxicillin Antibiotics', category: 'medical', quantity: 4 + medBonus, description: 'Capsules for bacterial infections.' }
          ];
          logText = `Scavenged Mercy Memorial Pharmacy: Retrieved antibiotics and trauma bandages safely.${medBonus > 0 ? ' (Medical career bonus: found extra antibiotics!)' : ''}`;
          if (hasTrait('diabetic')) {
            newItems.push({ id: 'insulin_scav_' + Date.now(), name: 'Insulin Vial', category: 'medical', quantity: 1, description: 'Medical insulin.' });
          }
          if (hasTrait('asthmatic')) {
            newItems.push({ id: 'inhaler_scav_' + Date.now(), name: 'Albuterol Inhaler', category: 'medical', quantity: 1, description: 'Rescue inhaler.' });
          }
          if (hasTrait('scavenger_eye')) {
            newItems.push({ id: 'trauma_kit_scav', name: 'Trauma Kit Dressing', category: 'medical', quantity: 1, description: 'Bonus medical kit found with Scavenger Eye.' });
          }
        } else {
          hpDelta = -mitigatedDamage;
          logText = `Ambushed at the pharmacy backdoor! My fitness & combat skills reduced the damage (-${mitigatedDamage}% HP).`;
        }
      } else if (locationId === 'supermarket') {
        const chefBonus = (profession.includes('cook') || profession.includes('chef')) ? 2 : 0;
        if (isSuccess) {
          newItems = [
            { id: 'canned_food_scav', name: 'Canned Food Rations', category: 'food', quantity: 4 + chefBonus, description: 'Sealed canned rations.' },
            { id: 'water_scav', name: 'Bottled Spring Water', category: 'water', quantity: 3, description: '1-Liter bottled water.' }
          ];
          logText = `Scavenged Costway Supermarket: Hauled back canned meals and clean water.${chefBonus > 0 ? ' (Culinary career bonus: found extra sealed rations!)' : ''}`;
        } else {
          hpDelta = -mitigatedDamage;
          logText = `Cornered in aisle 4 by infected! I fought my way free taking (-${mitigatedDamage}% HP).`;
        }
      } else if (locationId === 'police_precinct') {
        const copBonus = (profession.includes('police') || profession.includes('security') || profession.includes('firefighter')) ? 1 : 0;
        if (isSuccess) {
          newItems = [
            { id: 'shotgun_shells_scav', name: '12-Gauge Buckshot (8 shells)', category: 'resource', quantity: 8, description: 'Shotgun ammunition.' },
            { id: 'tactical_vest', name: 'Kevlar Duty Vest', category: 'tool', quantity: 1, description: 'Protects torso from bites.' }
          ];
          logText = `Scavenged 3rd Precinct Station: Cleared the armory locker and recovered shotgun ammunition and a tactical vest!`;
        } else {
          hpDelta = -mitigatedDamage;
          logText = `Swarmed by infected in the station sally port! I escaped with injuries (-${mitigatedDamage}% HP).`;
        }
      } else {
        const craftBonus = (profession.includes('carpenter') || profession.includes('mechanic') || profession.includes('electrician')) ? 2 : 0;
        if (isSuccess) {
          newItems = [
            { id: 'wood_scav', name: 'Lumber Studs (2x4)', category: 'resource', quantity: 3 + craftBonus, description: 'Heavy structural timber.' },
            { id: 'nails_scav', name: 'Box of Framing Nails', category: 'resource', quantity: 20, description: 'Construction nails.' }
          ];
          logText = `Scavenged Pioneer Lumber: Retrieved structural wood planks and nails for defense.${craftBonus > 0 ? ' (Crafting career bonus: gathered extra lumber!)' : ''}`;
        } else {
          hpDelta = -mitigatedDamage;
          logText = `I fell from the lumber yard fence while evading infected (-${mitigatedDamage}% HP).`;
        }
      }

      // Personal Backstory Clue Discovery
      if (prev.player.backstory && prev.player.backstory.targetLocationId === locationId && prev.player.backstory.status === 'searching') {
        prev.player.backstory.status = 'clue_found';
        prev.player.sanity = Math.min(100, prev.player.sanity + 15);
        logText += ` Tucked behind a shelf, I found a handwritten message left by ${prev.player.backstory.targetName}: they survived the initial panic and evacuated toward safety (+15 Sanity).`;
      }

      // Merge new items into inventory
      let mergedInv = [...prev.inventory];
      for (const item of newItems) {
        const existing = mergedInv.find(i => i.id === item.id);
        if (existing) {
          mergedInv = mergedInv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        } else {
          mergedInv.push(item);
        }
      }

      return {
        ...prev,
        inventory: mergedInv,
        player: {
          ...prev.player,
          health: Math.max(0, prev.player.health + hpDelta),
          isDead: prev.player.health + hpDelta <= 0,
          deathCause: prev.player.health + hpDelta <= 0 ? 'mauled while scavenging outside the perimeter' : undefined
        },
        stats: {
          ...prev.stats,
          scavengeRuns: prev.stats.scavengeRuns + 1
        },
        logs: [...prev.logs, {
          id: `log_exp_${Date.now()}`,
          day: prev.day,
          text: logText,
          type: (isSuccess ? 'loot' : 'hazard') as LogEntry['type'],
          timestamp: 'Expedition'
        }].slice(-150)
      };
    });

    setActiveTab('journal');
  };

  // SCREEN ROUTING
  if (screen === 'title') {
    return (
      <TitleScreen
        hasSaveGame={!!localStorage.getItem(SAVE_KEY)}
        onStartNew={() => setScreen('creator')}
        onLoadGame={handleLoadSavedGame}
        onOpenGraveyard={() => setScreen('graveyard')}
        graveyardCount={graveyard.length}
      />
    );
  }

  if (screen === 'codex') {
    return (
      <CodexScreen
        codexData={codexData}
        onUpdateCodex={setCodexData}
        onBack={() => setScreen('title')}
      />
    );
  }

  if (screen === 'creator') {
    return (
      <CharacterCreator
        onBack={() => setScreen('title')}
        onStartGame={handleStartCustomGame}
      />
    );
  }

  if (screen === 'graveyard') {
    return (
      <GraveyardScreen
        records={graveyard}
        onBack={() => setScreen('title')}
        onClear={handleClearGraveyard}
      />
    );
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        gameState={gameState}
        onBack={() => setScreen(gameState ? 'game' : 'title')}
        onReturnToTitle={() => setScreen('title')}
        onForfeitRun={handleForfeitRun}
      />
    );
  }

  // ACTIVE SURVIVAL GAME SCREEN
  if (!gameState) {
    return (
      <TitleScreen
        hasSaveGame={false}
        onStartNew={() => setScreen('creator')}
        onLoadGame={handleLoadSavedGame}
        onOpenGraveyard={() => setScreen('graveyard')}
        graveyardCount={graveyard.length}
      />
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans select-none">
      <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-[100dvh] bg-zinc-950 border-x border-zinc-900 shadow-2xl relative overflow-hidden">
        {/* Top Sticky Vitals */}
        <HeaderVitals state={gameState} onOpenSettings={() => setScreen('settings')} compact={activeTab !== 'journal'} />

        {/* Dynamic Active Tab View - Only this area scrolls! */}
        <main className="flex-1 flex flex-col overflow-y-auto overscroll-contain min-h-0 pb-1">
          {activeTab === 'journal' && <JournalFeed logs={gameState.logs} onOpenAmbitions={() => setShowAmbitionsModal(true)} />}
          {activeTab === 'base' && (
            <BaseTab
              gameState={gameState}
              onEstablishBase={handleEstablishBase}
              onRenameBase={handleRenameBase}
              onRoleChange={handleRoleChange}
              onTalkSurvivor={handleTalkSurvivor}
              onPraiseSurvivor={handlePraiseSurvivor}
              onGiftSurvivor={handleGiftSurvivor}
              onSparSurvivor={handleSparSurvivor}
              onSeduceSurvivor={handleSeduceSurvivor}
              onHookupSurvivor={handleHookupSurvivor}
              onMatchmake={handleMatchmake}
              onExileSurvivor={handleExileSurvivor}
              onRepairBarricade={handleRepairBarricade}
              onBuildRoom={handleBuildRoom}
              onAssignRoom={handleAssignRoom}
              onAssignPlayerRoom={handleAssignPlayerRoom}
              onTidyRoom={handleTidyRoom}
              onReinforceRoom={handleReinforceRoom}
              onUpgradeFacility={handleUpgradeFacility}
              onInteractFacility={handleInteractFacility}
              onSetRationPolicy={handleSetRationPolicy}
              onSetSecurityProtocol={handleSetSecurityProtocol}
              onSetFarmingDecree={handleSetFarmingDecree}
              onSetScavengeQuotaDecree={handleSetScavengeQuotaDecree}
              onSetBirthDecree={handleSetBirthDecree}
              onCourtSurvivor={handleCourtSurvivor}
              onProposeMarriage={handleProposeMarriage}
              onTryForBaby={handleTryForBaby}
              onMakeLove={handleMakeLove}
              onMentorChild={handleMentorChild}
              onToddlerInteract={handleToddlerInteract}
              onBestowHeirloom={handleBestowHeirloom}
              onStokeWoodstove={handleStokeWoodstove}
              onSaveWill={handleSaveWill}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryTab
              gameState={gameState}
              onUseItem={handleUseItem}
              onEquipWeapon={handleEquipWeapon}
            />
          )}
          {activeTab === 'activities' && (
            <ActivitiesTab
              gameState={gameState}
              onLaunchExpedition={handleLaunchExpedition}
              onRepairBarricade={handleRepairBarricade}
              onQuickActivity={handleQuickActivity}
              onOpenAmbitions={() => setShowAmbitionsModal(true)}
              onOpenInvestigation={() => setShowInvestigationBoard(true)}
            />
          )}
        </main>

        {/* Bottom Tactile Action Drawer - Fixed & pinned! */}
        <BottomActionBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAdvanceDay={handleAdvanceDay}
          onAdvanceWeek={handleAdvanceWeek}
          onAdvanceMonth={handleAdvanceMonth}
          onAdvanceYear={handleAdvanceYear}
          disabled={gameState.player.isDead || !!gameState.activeDilemma || !!gameState.dilemmaResult}
          gameState={gameState}
        />

        
        {/* Outbreak Origin Investigation Board Modal */}
        {showInvestigationBoard && gameState.mystery && (
          <InvestigationBoardModal
            mystery={gameState.mystery}
            gameState={gameState}
            onSolveMystery={handleSolveMystery}
            onClose={() => setShowInvestigationBoard(false)}
          />
        )}

        {/* Active Dilemma Modal */}
        {gameState.activeDilemma && (
          <DilemmaModal
            dilemma={gameState.activeDilemma}
            gameState={gameState}
            onSelectChoice={handleSelectChoice}
          />
        )}

        {/* Dilemma Outcome Result Modal */}
        {showAmbitionsModal && (
          <AmbitionsModal
            gameState={gameState}
            onClose={() => setShowAmbitionsModal(false)}
            onTriggerEvac={handleTriggerEvac}
          />
        )}

        {gameState.dilemmaResult && (
          <DilemmaResultModal
            result={gameState.dilemmaResult}
            onClose={() => setGameState(prev => prev ? ({ ...prev, dilemmaResult: null }) : null)}
          />
        )}

        
        {/* Resource Deficit Warning Modal for Month/Year Advances */}
        {pendingTimeWarning && (
          <TimeAdvanceWarningModal
            type={pendingTimeWarning.type}
            foodNeeded={pendingTimeWarning.foodNeeded}
            waterNeeded={pendingTimeWarning.waterNeeded}
            currentFood={pendingTimeWarning.currentFood}
            currentWater={pendingTimeWarning.currentWater}
            onConfirm={handleConfirmPendingTimeAdvance}
            onCancel={() => setPendingTimeWarning(null)}
          />
        )}

        {/* Baby Naming Modal */}
        {gameState.pendingBabyNaming && (
          <BabyNamingModal
            prompt={gameState.pendingBabyNaming}
            onConfirm={handleConfirmBabyNaming}
          />
        )}

        {/* Generational Succession & Legacy Modal */}
        {gameState.legacySuccessionPrompt && (
          <LegacySuccessionModal
            prompt={gameState.legacySuccessionPrompt}
            onSelectSuccessor={handleSelectSuccessor}
            onDeclineSuccession={handleDeclineSuccession}
          />
        )}

        {/* BitLife-style Death Screen */}
        {gameState.player.isDead && !gameState.legacySuccessionPrompt && (
          <DeathScreen
            gameState={gameState}
            onRestart={() => setScreen('creator')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
