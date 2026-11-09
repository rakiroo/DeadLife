import React, { useState } from 'react';
import { GameState } from '../types/game';
import { 
  FileText,
  Search,
  Cross, ShoppingBag, ShieldAlert, Wrench, Users, ArrowUpRight, 
  ArrowLeft, Compass, Eye, Shield, Hammer, Activity, Sparkles, 
  Radio, Target, ChevronRight, Check, AlertCircle, Flame
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onLaunchExpedition: (locationId: string, companionId?: string) => void;
  onRepairBarricade: () => void;
  onQuickActivity: (activityId: string) => void;
  onOpenAmbitions: () => void;
  onOpenInvestigation?: () => void;
  onLeaveStartingSpot?: () => void;
}

export const ActivitiesTab: React.FC<Props> = ({
  gameState,
  onLaunchExpedition,
  onRepairBarricade,
  onQuickActivity,
  onOpenAmbitions,
  onOpenInvestigation,
  onLeaveStartingSpot
}) => {
  const [view, setView] = useState<'main' | 'landmarks' | 'crafting'>('main');
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>('');

  const { inventory, shelter, player } = gameState;

  // Crafting ingredients checks
  const hasBat = inventory.some(i => i.id.includes('bat') && i.quantity > 0);
  const nailsItem = inventory.find(i => i.id.includes('nail') && i.quantity >= 10);
  const canCraftSpikedBat = hasBat && Boolean(nailsItem);

  const hasKnife = inventory.some(i => (i.id.includes('knife') || i.id.includes('scalpel') || i.id.includes('blade')) && i.quantity > 0);
  const plankItem = inventory.find(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity > 0);
  const tapeItem = inventory.find(i => (i.id.includes('tape') || i.id.includes('cord')) && i.quantity > 0);
  const canCraftSpear = hasKnife && Boolean(plankItem) && Boolean(tapeItem);

  const matchesItem = inventory.find(i => (i.id.includes('match') || i.id.includes('fire') || i.id.includes('lighter')) && i.quantity > 0);
  const fuelBottle = inventory.find(i => (i.id.includes('alcohol') || i.id.includes('whiskey') || i.id.includes('fuel')) && i.quantity > 0);
  const canCraftMolotov = Boolean(matchesItem) && Boolean(fuelBottle);

  const woodForRepair = inventory.some(i => (i.id.includes('wood') || i.id.includes('plank')) && i.quantity > 0);



  const LOCATIONS = [
    {
      id: 'pharmacy',
      title: 'Mercy Memorial Pharmacy',
      distance: '0.8 miles away',
      danger: 'Moderate Risk',
      dangerColor: 'text-amber-400',
      loot: 'Antibiotics, Trauma Kits, Painkillers',
      icon: <Cross className="w-5 h-5 text-rose-400" />
    },
    {
      id: 'supermarket',
      title: 'Costway Supermarket Depot',
      distance: '1.4 miles away',
      danger: 'High Danger',
      dangerColor: 'text-rose-400',
      loot: 'Canned Food, Bottled Water, Batteries',
      icon: <ShoppingBag className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'police_precinct',
      title: '3rd Precinct Police Station',
      distance: '2.1 miles away',
      danger: 'Extreme Danger',
      dangerColor: 'text-rose-500 font-bold',
      loot: 'Shotguns, 9mm Ammo, Body Armor',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'hardware_store',
      title: 'Pioneer Lumber & Hardware',
      distance: '0.5 miles away',
      danger: 'Low Danger',
      dangerColor: 'text-emerald-400',
      loot: 'Lumber Planks, Nails, Crowbars, Duct Tape',
      icon: <Wrench className="w-5 h-5 text-zinc-300" />
    },
    {
      id: 'survivor_outpost',
      title: 'St. Michael Church Sanctuary',
      distance: '1.6 miles away',
      danger: 'Other Survivors',
      dangerColor: 'text-cyan-400 font-bold',
      loot: 'Meet Companions, Barter Rations, Rare Supplies',
      icon: <Users className="w-5 h-5 text-cyan-400" />
    }
  ];

  const districtLandmarks = gameState.district?.landmarks && gameState.district.landmarks.length > 0
    ? gameState.district.landmarks.map(dl => ({
        id: dl.id,
        title: dl.title,
        distance: dl.distance,
        danger: dl.danger,
        dangerColor: dl.dangerColor,
        loot: dl.lootDescription,
        icon: dl.category === 'medical' ? <Cross className="w-5 h-5 text-rose-400" />
            : dl.category === 'food' ? <ShoppingBag className="w-5 h-5 text-amber-400" />
            : dl.category === 'weapons' ? <ShieldAlert className="w-5 h-5 text-rose-500" />
            : dl.category === 'materials' ? <Hammer className="w-5 h-5 text-amber-300" />
            : <Compass className="w-5 h-5 text-indigo-400" />
      }))
    : LOCATIONS;

  // SUBVIEW 1: LANDMARK EXPEDITIONS
  if (view === 'landmarks') {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans">
        <div className="flex items-center gap-2 pb-1 border-b border-white/5">
          <button
            type="button"
            onClick={() => setView('main')}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Scavenge Landmarks</h2>
            <p className="text-[10px] text-zinc-400">Depart on a targeted expedition outside the wire.</p>
          </div>
        </div>


        {/* DUO EXPEDITION COMPANION SELECTOR */}
        {(() => {
          const companions = [
            ...gameState.campMembers.filter(m => !m.isChild || (m.age !== undefined && m.age >= 16)).map(m => ({
              id: m.id,
              name: m.name,
              role: m.role,
              relation: m.id === gameState.player.spouseId ? 'Spouse' : m.relation || 'Companion',
              health: m.health,
              isOffspring: false,
              profession: m.profession
            })),
            ...(gameState.player.children || []).filter(c => c.age >= 16).map(c => ({
              id: c.id,
              name: c.name,
              role: 'scavenger' as const,
              relation: 'Adult Heir (Offspring)',
              health: 100,
              isOffspring: true,
              profession: 'Dynasty Heir'
            }))
          ];

          const partner = companions.find(c => c.id === selectedCompanionId);

          return (
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Expedition Partner (Duo Runs)
                </span>
                {selectedCompanionId && (
                  <button
                    type="button"
                    onClick={() => setSelectedCompanionId('')}
                    className="text-[10px] text-zinc-400 hover:text-white"
                  >
                    Go Solo
                  </button>
                )}
              </div>

              <select
                value={selectedCompanionId}
                onChange={(e) => setSelectedCompanionId(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="">👤 Solo (Go Alone)</option>
                {companions.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.relation} • {c.role.toUpperCase()} • HP {c.health}%)
                  </option>
                ))}
              </select>

              {partner ? (
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>Teaming with: {partner.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">HP {partner.health}%</span>
                  </div>
                  <p className="text-[10px] text-emerald-300/90 leading-snug">
                    {partner.isOffspring
                      ? '🎓 Mentorship Run: Real combat experience grants +2 Combat & Fitness to your child!'
                      : partner.role === 'medic'
                      ? '🩺 Medical Support: Halves hazard damage, prevents infections, and treats injuries!'
                      : partner.role === 'guard'
                      ? '🛡️ Covering Fire: +25% ambush defense and boosts expedition success rate!'
                      : partner.role === 'scavenger'
                      ? '🔍 Keen Eyes: Discovers hidden supply caches (+50% bonus food & ammo)!'
                      : partner.role === 'craftsman'
                      ? '🔨 Salvage Master: Retrieves bonus structural lumber and construction nails!'
                      : '❤️ Mutual Protection: Deepens trust and affection through shared survival.'}
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-zinc-400">
                  Select a companion to explore together and unlock specialized class synergies!
                </p>
              )}
            </div>
          );
        })()}

        <div className="space-y-2.5">
          {districtLandmarks.map((loc) => (
            <div
              key={loc.id}
              className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 shrink-0">
                    {loc.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{loc.title}</h3>
                    <p className="text-[11px] text-zinc-400">{loc.distance}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono uppercase font-semibold ${loc.dangerColor}`}>
                  {loc.danger}
                </span>
              </div>

              <div className="text-[11px] text-zinc-300 bg-black/30 p-2.5 rounded-xl border border-white/5 font-sans">
                <span className="text-zinc-500 block text-[9px] uppercase font-mono">Expected Haul:</span>
                <span>{loc.loot}</span>
              </div>

              <button
                type="button"
                onClick={() => onLaunchExpedition(loc.id, selectedCompanionId || undefined)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-100 text-zinc-950 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>Explore</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // SUBVIEW 2: MAKESHIFT CRAFTING
  if (view === 'crafting') {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans">
        <div className="flex items-center gap-2 pb-1 border-b border-white/5">
          <button
            type="button"
            onClick={() => setView('main')}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Craft Makeshift Weapons</h2>
            <p className="text-[10px] text-zinc-400">Assemble lethal defense gear from scavenged components.</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Recipe 1: Spiked Bat */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                🏏 Spiked Baseball Bat
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">+Heavy Blunt Damage</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Forged framing nails hammered through hardwood for devastating impact against skull bone.
            </p>
            <div className="text-[10px] font-mono bg-black/30 p-2 rounded-xl border border-white/5 text-zinc-300 space-y-0.5">
              <div className="flex items-center gap-1">
                {hasBat ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Baseball Bat (x1)</span>
              </div>
              <div className="flex items-center gap-1">
                {nailsItem ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Framing Nails (x10)</span>
              </div>
            </div>
            <button
              type="button"
              disabled={!canCraftSpikedBat}
              onClick={() => onQuickActivity('craft_spiked_bat')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                canCraftSpikedBat
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-[0.98]'
                  : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>{canCraftSpikedBat ? 'Craft Spiked Bat' : 'Missing Components'}</span>
            </button>
          </div>

          {/* Recipe 2: Scrap Spear */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                🗡️ Makeshift Hunting Spear
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold">+Stealth Range</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Hunting blade secured to a cured timber pole with industrial gorilla tape to keep infected at a safe distance.
            </p>
            <div className="text-[10px] font-mono bg-black/30 p-2 rounded-xl border border-white/5 text-zinc-300 space-y-0.5">
              <div className="flex items-center gap-1">
                {hasKnife ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Knife / Scalpel (x1)</span>
              </div>
              <div className="flex items-center gap-1">
                {plankItem ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Timber Plank (x1)</span>
              </div>
              <div className="flex items-center gap-1">
                {tapeItem ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Duct Tape (x1)</span>
              </div>
            </div>
            <button
              type="button"
              disabled={!canCraftSpear}
              onClick={() => onQuickActivity('craft_spear')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                canCraftSpear
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-[0.98]'
                  : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>{canCraftSpear ? 'Craft Hunting Spear' : 'Missing Components'}</span>
            </button>
          </div>

          {/* Recipe 3: Molotov */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Molotov Firebomb
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">+Horde Breaker</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Glass bottle filled with high-proof alcohol or fuel, fused with cloth to ignite and burn swarm clusters.
            </p>
            <div className="text-[10px] font-mono bg-black/30 p-2 rounded-xl border border-white/5 text-zinc-300 space-y-0.5">
              <div className="flex items-center gap-1">
                {fuelBottle ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Bottle of Alcohol / Fuel (x1)</span>
              </div>
              <div className="flex items-center gap-1">
                {matchesItem ? <Check className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-zinc-600" />}
                <span>Matches / Firestarter (x1)</span>
              </div>
            </div>
            <button
              type="button"
              disabled={!canCraftMolotov}
              onClick={() => onQuickActivity('craft_molotov')}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                canCraftMolotov
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm active:scale-[0.98]'
                  : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>{canCraftMolotov ? 'Craft Molotov' : 'Missing Components'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ACTIVITIES HUB (Grouped survival categories)
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans select-none">
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Survival Activities</h2>
        <p className="text-xs text-zinc-400">Proactive actions and routines you can choose to perform today.</p>
      </div>

      
      {/* Starting Shelter Hub & Operations */}
      {!gameState.startingLocation.hasLeftStartingSpot && onLeaveStartingSpot && (
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black/60 border border-amber-500/30 rounded-3xl space-y-3 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Starting Shelter
              </span>
              <h3 className="text-sm font-bold text-white leading-snug">
                Inside {gameState.startingLocation.name}
              </h3>
            </div>
          </div>

          <p className="text-[11px] text-zinc-300 leading-relaxed">
            You are sheltered inside {gameState.startingLocation.name}. Search the room, reinforce the doors, or venture outside into {gameState.district?.name || 'the city district'}.
          </p>

          {/* Quick Actions (Clean, single-line, no bulky subtitles) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onQuickActivity('search_starting_spot')}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickActivity('barricade_starting_spot')}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Hammer className="w-3.5 h-3.5 text-amber-400" />
              <span>Barricade</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickActivity('peek_blinds_starting_spot')}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Observe</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickActivity('calm_nerves_starting_spot')}
              className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rest</span>
            </button>
          </div>

          {/* Full-width Venture Outside Button */}
          <button
            type="button"
            onClick={onLeaveStartingSpot}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span>Venture Outside</span>
          </button>
        </div>
      )}

      {/* Group 1: Exploration & Scavenging */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
          Exploration & Looting
        </span>
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          {/* Investigation Board Lead Button */}
          {onOpenInvestigation && gameState.mystery && (
            <button
              type="button"
              onClick={onOpenInvestigation}
              className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Investigation Board</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                      {gameState.mystery.discoveredClueIds ? gameState.mystery.discoveredClueIds.length : 0}/4 Leads
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">{gameState.mystery.title}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setView('landmarks')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Scavenge City Landmarks</div>
                <div className="text-[11px] text-zinc-400">Pharmacy, Supermarket, Police Precinct, Outpost</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={() => onQuickActivity('search_vehicles')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Search Street Vehicles</div>
                <div className="text-[11px] text-zinc-400">Pry open abandoned sedans for batteries, wire & loose loot</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={() => onQuickActivity('rooftop_recon')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Rooftop Reconnaissance</div>
                <div className="text-[11px] text-zinc-400">Scan avenues with binoculars (+15 Sanity, maps horde movement)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 2: Crafting & Defense */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
          Crafting & Base Defense
        </span>
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          <button
            type="button"
            onClick={() => setView('crafting')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Hammer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Craft Makeshift Weapons</div>
                <div className="text-[11px] text-zinc-400">Spiked Bat, Hunting Spear, Molotov Firebomb</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={onRepairBarricade}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Reinforce Barricades</div>
                <div className="text-[11px] text-zinc-400">
                  {woodForRepair ? 'Spend 1 wood plank to strengthen doors (+25% integrity)' : 'Requires wood planks in supplies'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 3: Conditioning & Health */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
          Conditioning & Mental Health
        </span>
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          <button
            type="button"
            onClick={() => onQuickActivity('workout')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Physical Calisthenics & Drills</div>
                <div className="text-[11px] text-zinc-400">Pushups and sprint drills (+5 HP recovery, keeps body conditioned)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={() => onQuickActivity('meditate')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Quiet Meditation & Reading</div>
                <div className="text-[11px] text-zinc-400">Sit quietly by candlelight, slow your pulse (+20 Sanity)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Group 4: Signals & Ambitions */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
          Signals & Long-Term Goals
        </span>
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
          <button
            type="button"
            onClick={() => onQuickActivity('radio_tune')}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Scan Emergency Radio Bands</div>
                <div className="text-[11px] text-zinc-400">Search frequencies for military loops and weather forecasts</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button
            type="button"
            onClick={onOpenAmbitions}
            className="w-full p-3 text-left flex items-center justify-between hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">View Sandbox Ambitions</div>
                <div className="text-[11px] text-zinc-400">Optional long-term projects: Coastal Barge, Highway Rig, Citadel</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
