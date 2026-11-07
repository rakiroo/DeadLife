import React, { useState, useEffect } from 'react';
import { GameState, EventChoice, InventoryItem, CampRole, LogEntry, Survivor, CemeteryRecord } from './types/game';
import { DAY_ONE_EVENT } from './data/events';
import { advanceOneDay, advanceOneWeek } from './utils/simulation';
import { HeaderVitals } from './components/HeaderVitals';
import { JournalFeed } from './components/JournalFeed';
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

export function createNewGameWithSurvivor(survivor: Survivor): GameState {
  const initialLog: LogEntry = {
    id: `log_init_${Date.now()}`,
    day: 1,
    text: `Day 1 begins. The emergency sirens have gone silent. You are standing in your room with completely empty pockets. You must scavenge your surroundings before night falls.`,
    type: 'milestone',
    timestamp: 'Morning'
  };

  return {
    day: 1,
    timeOfDay: 'Morning',
    weather: 'clear',
    temperatureCelsius: 18,
    player: survivor,
    campMembers: [],
    shelter: {
      name: 'Safehouse Apartment',
      type: 'Suburban Safehouse',
      defenseRating: 40,
      stealthRating: 65,
      warmthRating: 70,
      waterCollectorLevel: 1,
      storedRainwater: 2,
      maxRainwater: 20,
      barricadeIntegrity: 65,
      generatorOperational: false,
      fuelGallons: 1
    },
    inventory: [], // Starts completely empty!
    logs: [initialLog],
    activeDilemma: DAY_ONE_EVENT, // Forces day 1 initial room search
    dilemmaResult: null,
    daysWithoutFood: 0,
    daysWithoutWater: 0,
    stats: {
      zombiesEliminated: 0,
      daysSurvived: 1,
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
        setGameState(JSON.parse(savedGame));
      }
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }, []);

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
  const handleStartCustomGame = (survivor: Survivor) => {
    const freshGame = createNewGameWithSurvivor(survivor);
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
      logs: [newLog, ...outcome.state.logs].slice(0, 100),
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
      let newLogs = [...prev.logs];
      let updatedInv = prev.inventory.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);

      if (item.category === 'food') {
        hunger = Math.min(100, hunger + 25);
        newLogs.unshift({
          id: `log_${Date.now()}`,
          day: prev.day,
          text: `Consumed ${item.name}. Restored +25 hunger.`,
          type: 'general',
          timestamp: 'Action'
        });
      } else if (item.category === 'water') {
        thirst = Math.min(100, thirst + 25);
        newLogs.unshift({
          id: `log_${Date.now()}`,
          day: prev.day,
          text: `Drank clean water from ${item.name}. Restored +25 hydration.`,
          type: 'general',
          timestamp: 'Action'
        });
      } else if (item.id.includes('bandage') || item.id.includes('first_aid') || item.id.includes('gauze')) {
        health = Math.min(100, health + 15);
        statusEffects = statusEffects.filter(e => e.id !== 'bleeding');
        newLogs.unshift({
          id: `log_${Date.now()}`,
          day: prev.day,
          text: `Applied sterile pressure dressing. Bleeding arrested.`,
          type: 'medical',
          timestamp: 'Action'
        });
      } else if (item.id.includes('antibiotic') || item.id.includes('alcohol')) {
        health = Math.min(100, health + 10);
        statusEffects = statusEffects.filter(e => e.id !== 'bacterial_infection');
        newLogs.unshift({
          id: `log_${Date.now()}`,
          day: prev.day,
          text: `Applied antiseptic and treatment. Sepsis arrested.`,
          type: 'medical',
          timestamp: 'Action'
        });
      }

      return {
        ...prev,
        inventory: updatedInv,
        player: { ...prev.player, health, hunger, thirst, statusEffects },
        logs: newLogs
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
        logs: [{
          id: `log_repair_${Date.now()}`,
          day: prev.day,
          text: 'Reinforced entry points and nailed structural cross-braces (+25% barricade integrity).',
          type: 'milestone',
          timestamp: 'Action'
        }, ...prev.logs]
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
        logs: [{
          id: `log_exp_${Date.now()}`,
          day: prev.day,
          text: logText,
          type: isSuccess ? 'loot' : 'hazard',
          timestamp: 'Expedition'
        }, ...prev.logs]
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
