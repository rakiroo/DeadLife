import React from 'react';
import { FastForward, Clock, Shield, Users, Package, Compass, BookOpen, MapPin } from 'lucide-react';
import { GameState } from '../types/game';

export type ActiveTab = 'journal' | 'spawn' | 'shelter' | 'camp' | 'inventory' | 'scavenge';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAdvanceDay: () => void;
  onAdvanceWeek: () => void;
  disabled: boolean;
  gameState: GameState;
}

export const BottomActionBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onAdvanceDay,
  onAdvanceWeek,
  disabled,
  gameState
}) => {
  const isAtSpawn = !gameState.startingLocation.hasLeftStartingSpot;
  const hasShelter = gameState.shelter.isEstablished;
  const hasCamp = Boolean(gameState.isCampEstablished || gameState.campMembers.length > 0);
  const suppliesCount = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const unsearchedSpots = gameState.startingLocation.lootSpots.filter(s => !s.searched).length;

  return (
    <div className="shrink-0 sticky bottom-0 z-40 bg-zinc-950/98 backdrop-blur-md border-t border-zinc-800/90 px-3 pt-2 pb-3 max-w-md mx-auto w-full select-none shadow-2xl">
      {/* Dual Progression Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* +1 DAY BUTTON */}
        <button
          disabled={disabled}
          onClick={onAdvanceDay}
          className={`py-3.5 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
            disabled
              ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 hover:shadow-emerald-950/50 shadow-sm'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Survive +1 Day</span>
        </button>

        {/* +1 WEEK BUTTON */}
        <button
          disabled={disabled}
          onClick={onAdvanceWeek}
          className={`py-3.5 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 shadow-md active:scale-95 ${
            disabled
              ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-400/30 hover:shadow-amber-950/50 shadow-sm'
          }`}
        >
          <FastForward className="w-4 h-4" />
          <span>Survive +1 Week</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-between gap-1 pt-1.5 text-[11px] font-medium">
        <button
          onClick={() => onTabChange('journal')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'journal'
              ? 'bg-zinc-900 border border-zinc-800 text-zinc-100 font-bold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'journal' ? 'text-zinc-100' : 'text-zinc-500'}`} />
          <span>Journal</span>
        </button>

        {/* Spawn / Starting Place Tab - Available while survivor has not left starting spot */}
        {isAtSpawn && (
          <button
            onClick={() => onTabChange('spawn')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
              activeTab === 'spawn'
                ? 'bg-rose-950/40 border border-rose-800/80 text-rose-300 font-bold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <div className="relative">
              <MapPin className={`w-4 h-4 ${activeTab === 'spawn' ? 'text-rose-400' : 'text-zinc-500'}`} />
              {unsearchedSpots > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 text-[9px] font-mono font-bold rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse shadow-sm">
                  {unsearchedSpots}
                </span>
              )}
            </div>
            <span>Spawn</span>
          </button>
        )}

        {/* Shelter Tab - Only available once player decided to make/establish shelter */}
        {hasShelter && (
          <button
            onClick={() => onTabChange('shelter')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              activeTab === 'shelter'
                ? 'bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Shield className={`w-4 h-4 ${activeTab === 'shelter' ? 'text-emerald-400' : 'text-zinc-500'}`} />
            <span>Shelter</span>
          </button>
        )}

        {/* Camp Tab - Only available once camp is founded or survivors join */}
        {hasCamp && (
          <button
            onClick={() => onTabChange('camp')}
            className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              activeTab === 'camp'
                ? 'bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'camp' ? 'text-cyan-400' : 'text-zinc-500'}`} />
            <span>Camp</span>
          </button>
        )}

        {/* Supplies Tab - Always available with live updated item count */}
        <button
          onClick={() => onTabChange('inventory')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
            activeTab === 'inventory'
              ? 'bg-zinc-900 border border-zinc-800 text-amber-300 font-bold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
          }`}
        >
          <div className="relative">
            <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-amber-400' : 'text-zinc-500'}`} />
            {suppliesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono font-bold rounded-full bg-emerald-600 text-white min-w-4 text-center shadow-sm">
                {suppliesCount}
              </span>
            )}
          </div>
          <span>Supplies</span>
        </button>

        {/* Scavenge Tab - Always available */}
        <button
          onClick={() => onTabChange('scavenge')}
          className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'scavenge'
              ? 'bg-zinc-900 border border-zinc-800 text-indigo-300 font-bold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
          }`}
        >
          <Compass className={`w-4 h-4 ${activeTab === 'scavenge' ? 'text-indigo-400' : 'text-zinc-500'}`} />
          <span>Scavenge</span>
        </button>
      </nav>
    </div>
  );
};
