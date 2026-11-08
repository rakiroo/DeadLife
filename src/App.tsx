import React, { useState, useEffect } from 'react';
import { GameState, EventChoice, EventDilemma, InventoryItem, CampRole, LogEntry, Survivor, CemeteryRecord, Career } from './types/game';
import { DAY_ONE_EVENT, getLootSpotSurvivorDilemma, getSurvivorOutpostDilemma } from './data/events';
import { advanceOneDay, advanceOneWeek, advanceOneMonth, advanceOneYear } from './utils/simulation';
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

type ScreenState = 'title' | 'creator' | 'game' | 'graveyard' | 'settings';

const SAVE_KEY = 'deadlife_save';
const GRAVEYARD_KEY = 'deadlife_graveyard';

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

  return {
    day: 0,
    timeOfDay: 'Morning',
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
    logs: [initialLog, backstoryLog],
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
        setGameState(parsed);
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
      const ribbon = gameState.day >= 100 
        ? 'Century Survivor' 
        : gameState.stats.zombiesEliminated >= 15 
        ? 'Slayer of the Dead' 
        : gameState.day <= 2 
        ? 'Patient Zero' 
        : 'Fallen Survivor';

      const newRecord: CemeteryRecord = {
        id: `grave_${Date.now()}`,
        name: gameState.player.name,
        age: gameState.player.age,
        profession: gameState.player.profession,
        daysSurvived: gameState.day,
        deathCause: gameState.player.deathCause || 'died fighting in the ruins',
        date: new Date().toLocaleDateString(),
        ribbon,
        stats: gameState.stats
      };

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
      setGameState(JSON.parse(saved));
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

      return {
        ...prev,
        shelter: {
          ...prev.shelter,
          rooms: updatedRooms
        }
      };
    });
  };

  const handleUpgradeFacility = (facilityId: 'water_collector' | 'greenhouse' | 'infirmary' | 'schoolhouse' | 'nursery' | 'memorial_garden') => {
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

  // Try for a baby / Start a family
  const handleHaveBaby = () => {
    if (!gameState || !gameState.player.spouseName) return;
    setGameState(prev => {
      if (!prev) return null;
      const babyGender = Math.random() < 0.5 ? 'male' : 'female';
      const boyNames = ['Noah', 'Liam', 'Arthur', 'Leo', 'Julian', 'Elias', 'Finn'];
      const girlNames = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy'];
      const chosenName = babyGender === 'male' 
        ? boyNames[Math.floor(Math.random() * boyNames.length)]
        : girlNames[Math.floor(Math.random() * girlNames.length)];
      const surname = prev.player.name.split(' ').slice(-1)[0] || 'Vance';
      const fullName = chosenName + ' ' + surname;

      const newChild = {
        id: 'child_player_' + Date.now(),
        name: fullName,
        age: 0,
        gender: babyGender as 'male' | 'female',
        stage: 'infant' as const,
        skills: {
          combat: Math.floor(prev.player.combatSkill * 0.5) + 2,
          medical: Math.floor(prev.player.medicalSkill * 0.5) + 2,
          crafting: Math.floor(prev.player.craftingSkill * 0.5) + 2,
          stealth: Math.floor(prev.player.stealthSkill * 0.5) + 2,
          fitness: Math.floor(prev.player.fitnessSkill * 0.5) + 2
        }
      };

      const existingChildren = prev.player.children ? [...prev.player.children] : [];

      const logText = '?? A Child Born in the Ruins: ' + prev.player.spouseName + ' gave birth to a healthy baby ' + (babyGender === 'male' ? 'boy' : 'girl') + ' named ' + fullName + '! The entire haven gathered to welcome our child. Hope and joy reign in our colony (+25 Morale).';

      return {
        ...prev,
        player: {
          ...prev.player,
          children: [...existingChildren, newChild],
          sanity: 100
        },
        shelter: {
          ...prev.shelter,
          childrenBornCount: (prev.shelter.childrenBornCount || 0) + 1,
          morale: Math.min(100, (prev.shelter.morale ?? 75) + 25)
        },
        logs: [...prev.logs, {
          id: 'birth_' + Date.now(),
          day: prev.day,
          text: logText,
          type: 'milestone' as const,
          timestamp: 'New Life'
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
      const updatedMembers = prev.campMembers.filter(m => m.id !== candidate.id);

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
      const ribbon = prev.day >= 100 
        ? 'Century Survivor' 
        : prev.stats.zombiesEliminated >= 15 
        ? 'Slayer of the Dead' 
        : 'Haven Founder';

      const newRecord: CemeteryRecord = {
        id: 'grave_' + Date.now(),
        name: prev.player.name,
        age: prev.player.age,
        profession: prev.player.profession,
        daysSurvived: prev.day,
        deathCause: prev.player.deathCause || (prompt.cause === 'Old Age' ? 'peacefully passed away of old age at ' + prev.player.age : 'fallen in the line of duty'),
        date: new Date().toLocaleDateString(),
        ribbon,
        stats: prev.stats
      };

      const updatedGrave = [newRecord, ...graveyard].slice(0, 50);
      setGraveyard(updatedGrave);
      localStorage.setItem(GRAVEYARD_KEY, JSON.stringify(updatedGrave));

      return {
        ...prev,
        player: successorSurvivor,
        campMembers: updatedMembers,
        legacySuccessionPrompt: null,
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
    const newRecord: CemeteryRecord = {
      id: 'grave_forfeit_' + Date.now(),
      name: gameState.player.name,
      age: gameState.player.age,
      profession: gameState.player.profession,
      daysSurvived: gameState.day,
      deathCause: 'forfeited the will to survive in the ruins',
      date: new Date().toLocaleDateString(),
      ribbon: 'Fallen Survivor',
      stats: gameState.stats
    };
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

    const victoryRecord: CemeteryRecord = {
      id: 'grave_victory_' + Date.now(),
      name: gameState.player.name,
      age: gameState.player.age,
      profession: gameState.player.profession,
      daysSurvived: gameState.day,
      deathCause: 'Escaped the quarantine: ' + ambition.title,
      date: new Date().toLocaleDateString(),
      ribbon: ambition.rewardRibbon,
      stats: gameState.stats
    };

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

  // Launch Scavenge Expedition
  const handleLaunchExpedition = (locationId: string) => {
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

      let successRate = 0.60 + (prev.player.stealthSkill * 0.04);
      if (profession.includes('ranger') || profession.includes('locksmith') || profession.includes('security')) {
        successRate += 0.12;
      }

      // Trait stealth & detection modifiers
      if (hasTrait('light_footed')) successRate += 0.12; // 50% less footstep noise
      if (hasTrait('eagle_eyed')) successRate += 0.08;   // Spots lurkers far away
      if (hasTrait('tinnitus')) successRate -= 0.10;     // Ear ringing penalty
      if (hasTrait('nearsighted')) successRate -= 0.08;  // Poor distance eyesight
      if (hasTrait('feeble')) successRate -= 0.05;       // Slower movement

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

      let mitigatedDamage = Math.max(3, baseDamage - damageReduction);
      if (hasTrait('thick_skinned')) {
        mitigatedDamage = Math.max(2, Math.floor(mitigatedDamage * 0.75));
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
    <div className="h-screen max-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden font-sans select-none">
      <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-screen bg-zinc-950 border-x border-zinc-900 shadow-2xl relative overflow-hidden">
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
              onExileSurvivor={handleExileSurvivor}
              onRepairBarricade={handleRepairBarricade}
              onBuildRoom={handleBuildRoom}
              onAssignRoom={handleAssignRoom}
              onUpgradeFacility={handleUpgradeFacility}
              onSetRationPolicy={handleSetRationPolicy}
              onSetSecurityProtocol={handleSetSecurityProtocol}
              onCourtSurvivor={handleCourtSurvivor}
              onProposeMarriage={handleProposeMarriage}
              onHaveBaby={handleHaveBaby}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryTab
              gameState={gameState}
              onUseItem={handleUseItem}
            />
          )}
          {activeTab === 'activities' && (
            <ActivitiesTab
              gameState={gameState}
              onLaunchExpedition={handleLaunchExpedition}
              onRepairBarricade={handleRepairBarricade}
              onQuickActivity={handleQuickActivity}
              onOpenAmbitions={() => setShowAmbitionsModal(true)}
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
