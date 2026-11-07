import React, { useState, useEffect } from 'react';
import { GameState, EventChoice, InventoryItem, CampRole, LogEntry, Survivor, CemeteryRecord, Career } from './types/game';
import { DAY_ONE_EVENT } from './data/events';
import { advanceOneDay, advanceOneWeek } from './utils/simulation';
import { HeaderVitals } from './components/HeaderVitals';
import { JournalFeed } from './components/JournalFeed';
import { StartingLocationTab } from './components/StartingLocationTab';
import { getRandomSpawnStory } from './data/spawnStories';
import { DilemmaModal } from './components/DilemmaModal';
import { DilemmaResultModal } from './components/DilemmaResultModal';
import { BottomActionBar, ActiveTab } from './components/BottomActionBar';
import { InventoryTab } from './components/InventoryTab';
import { ShelterTab } from './components/ShelterTab';
import { CampTab } from './components/CampTab';
import { ScavengeTab } from './components/ScavengeTab';
import { DeathScreen } from './components/DeathScreen';
import { TitleScreen } from './components/TitleScreen';
import { CharacterCreator } from './components/CharacterCreator';
import { GraveyardScreen } from './components/GraveyardScreen';

type ScreenState = 'title' | 'creator' | 'game' | 'graveyard';

const SAVE_KEY = 'deadlife_save';
const GRAVEYARD_KEY = 'deadlife_graveyard';

export function createNewGameWithSurvivor(survivor: Survivor, career: Career): GameState {
  const spawnStory = getRandomSpawnStory(career.id);

  const initialLog: LogEntry = {
    id: `log_init_${Date.now()}`,
    day: 0,
    text: spawnStory.intro,
    type: 'milestone',
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
        searched: false,
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
    inventory: [], // Starts completely empty until looted!
    logs: [initialLog],
    activeDilemma: null,
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
    if (activeTab === 'spawn' && gameState.startingLocation?.hasLeftStartingSpot) {
      setActiveTab('journal');
    } else if (activeTab === 'shelter' && !gameState.shelter?.isEstablished) {
      setActiveTab('journal');
    } else if (activeTab === 'camp' && !gameState.isCampEstablished && (!gameState.campMembers || gameState.campMembers.length === 0)) {
      setActiveTab('journal');
    }
  }, [activeTab, gameState?.startingLocation?.hasLeftStartingSpot, gameState?.shelter?.isEstablished, gameState?.isCampEstablished, gameState?.campMembers?.length]);

  // Save game state whenever it updates and player is alive
  useEffect(() => {
    if (gameState && !gameState.player.isDead) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  // When player dies, record to cemetery and clear active save
  useEffect(() => {
    if (gameState && gameState.player.isDead) {
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
    setActiveTab('spawn');
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

  // Time Progression: +1 Day
  const handleAdvanceDay = () => {
    if (!gameState) return;
    setGameState(prev => prev ? advanceOneDay(prev) : null);
  };

  // Time Progression: +1 Week
  const handleAdvanceWeek = () => {
    if (!gameState) return;
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
        itemLogText = `Consumed ${item.name}. Restored +25 hunger.`;
      } else if (item.category === 'water') {
        thirst = Math.min(100, thirst + 25);
        itemLogText = `Drank clean water from ${item.name}. Restored +25 hydration.`;
      } else if (item.id.includes('bandage') || item.id.includes('first_aid') || item.id.includes('gauze')) {
        health = Math.min(100, health + 15);
        statusEffects = statusEffects.filter(e => e.id !== 'bleeding');
        itemLogText = `Applied sterile pressure dressing. Bleeding arrested.`;
        itemLogType = 'medical';
      } else if (item.id.includes('antibiotic') || item.id.includes('alcohol')) {
        health = Math.min(100, health + 10);
        statusEffects = statusEffects.filter(e => e.id !== 'bacterial_infection');
        itemLogText = `Applied antiseptic and treatment. Sepsis arrested.`;
        itemLogType = 'medical';
      } else {
        itemLogText = `Inspected ${item.name} from supplies.`;
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
          barricadeIntegrity: Math.min(100, prev.shelter.barricadeIntegrity + 25)
        },
        logs: [...prev.logs, {
          id: `log_repair_${Date.now()}`,
          day: prev.day,
          text: 'Reinforced entry points and nailed structural cross-braces (+25% barricade integrity).',
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

  // Launch Scavenge Expedition
  const handleLaunchExpedition = (locationId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const isSuccess = Math.random() < 0.70 + (prev.player.stealthSkill * 0.03);
      let newItems: InventoryItem[] = [];
      let logText = '';
      let hpDelta = 0;

      if (locationId === 'pharmacy') {
        if (isSuccess) {
          newItems = [
            { id: 'bandage_scavenged', name: 'Field Dressing Bandages', category: 'medical', quantity: 2, description: 'Sterile roll bandage.' },
            { id: 'antibiotics_scavenged', name: 'Amoxicillin Antibiotics', category: 'medical', quantity: 4, description: 'Capsules for bacterial infections.' }
          ];
          logText = 'Scavenged Mercy Memorial Pharmacy: Retrieved antibiotics and trauma bandages safely.';
        } else {
          hpDelta = -18;
          logText = 'Ambushed at the pharmacy backdoor! Escaped with superficial bites/scrapes (-18% HP).';
        }
      } else if (locationId === 'supermarket') {
        if (isSuccess) {
          newItems = [
            { id: 'canned_food_scav', name: 'Canned Peaches & Tuna', category: 'food', quantity: 4, description: 'Sealed canned rations.' },
            { id: 'water_scav', name: 'Bottled Spring Water', category: 'water', quantity: 3, description: '1-Liter bottled water.' }
          ];
          logText = 'Scavenged Costway Supermarket: Hauled back 4 canned meals and 3 bottles of water.';
        } else {
          hpDelta = -12;
          logText = 'Cornered in aisle 4 by a cluster of infected. Dropped half your haul while sprinting back (-12% HP).';
        }
      } else {
        if (isSuccess) {
          newItems = [
            { id: 'wood_scav', name: 'Lumber Studs (2x4)', category: 'resource', quantity: 3, description: 'Heavy structural timber.' }
          ];
          logText = 'Scavenged Pioneer Lumber: Retrieved structural wood planks for shelter defense.';
        } else {
          hpDelta = -8;
          logText = 'Twisted ankle climbing the yard fence (-8% HP). Retrieved minimal timber.';
        }
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

  // Day 0 / Starting Spot: Loot a specific spot
  const handleLootSpot = (spotId: string) => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const spot = prev.startingLocation.lootSpots.find(s => s.id === spotId);
      if (!spot || spot.searched) return prev;

      let updatedInv = [...prev.inventory];
      for (const item of spot.loot) {
        const existing = updatedInv.find(i => i.id === item.id);
        if (existing) {
          updatedInv = updatedInv.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        } else {
          updatedInv.push({ ...item });
        }
      }

      const updatedSpots = prev.startingLocation.lootSpots.map(s =>
        s.id === spotId ? { ...s, searched: true } : s
      );

      const itemsFoundText = spot.loot.map(i => `${i.name} (x${i.quantity})`).join(', ');
      const newLog: LogEntry = {
        id: `log_loot_${Date.now()}`,
        day: prev.day,
        text: `Looted ${spot.name} in ${prev.startingLocation.name}. Secured: ${itemsFoundText}. Supplies updated!`,
        type: 'loot',
        timestamp: 'Looting'
      };

      return {
        ...prev,
        inventory: updatedInv,
        startingLocation: {
          ...prev.startingLocation,
          lootSpots: updatedSpots
        },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
  };

  // Fortify current starting spot into official Base Shelter
  const handleFortifyShelter = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const newLog: LogEntry = {
        id: `log_fortify_${Date.now()}`,
        day: prev.day,
        text: `Decided to fortify ${prev.startingLocation.name} into your permanent survival shelter. Barricades hammered and shelter systems operational!`,
        type: 'milestone',
        timestamp: 'Action'
      };

      return {
        ...prev,
        shelter: {
          ...prev.shelter,
          isEstablished: true,
          name: `${prev.startingLocation.name} (Safehouse)`,
          type: prev.startingLocation.type,
          defenseRating: 45,
          stealthRating: 50,
          warmthRating: 65,
          barricadeIntegrity: 55,
          maxRainwater: 20,
          storedRainwater: 2
        },
        startingLocation: {
          ...prev.startingLocation,
          hasLeftStartingSpot: true
        },
        logs: [...prev.logs, newLog].slice(-150)
      };
    });
    setActiveTab('shelter');
  };

  // Leave starting spot to scout the city on foot
  const handleLeaveStartingSpot = () => {
    if (!gameState) return;
    setGameState(prev => {
      if (!prev) return null;
      const newLog: LogEntry = {
        id: `log_leave_${Date.now()}`,
        day: prev.day,
        text: `You abandoned your spawn location at ${prev.startingLocation.name} to scout the city for safehouses or survivor camps.`,
        type: 'milestone',
        timestamp: 'Action'
      };

      return {
        ...prev,
        startingLocation: {
          ...prev.startingLocation,
          hasLeftStartingSpot: true
        },
        logs: [...prev.logs, newLog].slice(-150)
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
        <HeaderVitals state={gameState} onOpenMenu={() => setScreen('title')} />

        {/* Dynamic Active Tab View - Only this area scrolls! */}
        <main className="flex-1 flex flex-col overflow-y-auto overscroll-contain min-h-0 pb-1">
          {activeTab === 'journal' && <JournalFeed logs={gameState.logs} />}
          {activeTab === 'spawn' && (
            <StartingLocationTab
              gameState={gameState}
              onLootSpot={handleLootSpot}
              onFortifyShelter={handleFortifyShelter}
              onLeaveStartingSpot={handleLeaveStartingSpot}
            />
          )}
          {activeTab === 'inventory' && <InventoryTab gameState={gameState} onUseItem={handleUseItem} />}
          {activeTab === 'shelter' && <ShelterTab gameState={gameState} onRepairBarricade={handleRepairBarricade} />}
          {activeTab === 'camp' && <CampTab gameState={gameState} onRoleChange={handleRoleChange} />}
          {activeTab === 'scavenge' && <ScavengeTab gameState={gameState} onLaunchExpedition={handleLaunchExpedition} />}
        </main>

        {/* Bottom Tactile Action Drawer - Fixed & pinned! */}
        <BottomActionBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAdvanceDay={handleAdvanceDay}
          onAdvanceWeek={handleAdvanceWeek}
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
        {gameState.dilemmaResult && (
          <DilemmaResultModal
            result={gameState.dilemmaResult}
            onClose={() => setGameState(prev => prev ? ({ ...prev, dilemmaResult: null }) : null)}
          />
        )}

        {/* BitLife-style Death Screen */}
        {gameState.player.isDead && (
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
