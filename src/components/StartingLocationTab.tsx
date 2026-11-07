import React, { useState } from 'react';
import { GameState } from '../types/game';
import { MapPin, Search, CheckCircle2, Shield, Compass, Package, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  gameState: GameState;
  onLootSpot: (spotId: string) => void;
  onFortifyShelter: () => void;
  onLeaveStartingSpot: () => void;
}

export const StartingLocationTab: React.FC<Props> = ({
  gameState,
  onLootSpot,
  onFortifyShelter,
  onLeaveStartingSpot
}) => {
  const { startingLocation, day, player } = gameState;
  const [justLooted, setJustLooted] = useState<string | null>(null);

  const totalSpots = startingLocation.lootSpots.length;
  const searchedCount = startingLocation.lootSpots.filter(s => s.searched).length;

  const handleLoot = (spotId: string, spotName: string) => {
    onLootSpot(spotId);
    setJustLooted(spotName);
    setTimeout(() => setJustLooted(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
      {/* Location Spawn Banner */}
      <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Day {day} Starting Place
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            {searchedCount} of {totalSpots} Searched
          </span>
        </div>

        <h2 className="text-base font-bold text-zinc-100">{startingLocation.name}</h2>
        <div className="text-xs text-zinc-400 font-medium">
          {startingLocation.type} • Job: {player.profession}
        </div>

        {/* Progress Bar */}
        <div className="pt-1">
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: totalSpots > 0 ? `${(searchedCount / totalSpots) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Day 0 Story Card */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Day 0 Story: {startingLocation.storyTitle || 'The Outbreak Begins'}</span>
        </div>
        <div className="text-xs text-zinc-300 leading-relaxed space-y-2 font-sans">
          {(startingLocation.storyText || startingLocation.description).split('\n\n').map((para, i) => (
            <p key={i} className="bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Recent Loot Feedback Toast */}
      {justLooted && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2 shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Looted <strong>{justLooted}</strong>! Items added to your Supplies inventory.</span>
        </div>
      )}

      {/* Available Loot Spots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
            Search for Supplies
          </span>
          <span className="text-[10px] text-zinc-500">Search areas before you leave</span>
        </div>

        {startingLocation.lootSpots.map((spot) => (
          <div key={spot.id} className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-xl space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-zinc-400" /> {spot.name}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{spot.description}</p>
              </div>
              {spot.searched && (
                <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Looted
                </span>
              )}
            </div>

            {spot.searched ? (
              <div className="text-[11px] text-zinc-400 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                <span className="text-zinc-500 font-medium">Found: </span>
                <span className="text-zinc-300">
                  {spot.loot.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                </span>
              </div>
            ) : (
              <button
                onClick={() => handleLoot(spot.id, spot.name)}
                className="w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 active:scale-98 shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Area</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Decision / Next Move Section */}
      <section className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-200 font-bold block">
            What Do You Want to Do Next?
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            You can stay here to search and survive, turn this place into your safehouse, or leave for the city.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={onFortifyShelter}
            className="w-full p-3.5 rounded-2xl border border-emerald-600/50 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-100 text-left transition-all flex items-center justify-between gap-3 active:scale-98 shadow-md group"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/60 shrink-0 mt-0.5">
                <Shield className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-emerald-200 group-hover:text-emerald-100 transition-colors">
                  Turn this Place into Your Shelter
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Board up doors and windows to make this your permanent safehouse. Unlocks the Shelter tab.
                </div>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-emerald-600 text-white group-hover:bg-emerald-500 transition-colors shadow-sm">
              Fortify
            </span>
          </button>

          <button
            onClick={onLeaveStartingSpot}
            className="w-full p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-850 text-zinc-300 text-left transition-all flex items-center justify-between gap-3 active:scale-98 shadow-md group"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700/80 shrink-0 mt-0.5">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                  Pack Up and Leave for the City
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Take everything you gathered and head out to look for a safehouse or other survivors.
                </div>
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 group-hover:bg-zinc-700 border border-zinc-700 transition-colors shadow-sm">
              Leave
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};
