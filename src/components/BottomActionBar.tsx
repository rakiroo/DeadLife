import React from 'react';
import { FastForward, Clock, Shield, Users, Package, Zap, BookOpen } from 'lucide-react';
import { GameState } from '../types/game';

export type ActiveTab = 'journal' | 'shelter' | 'camp' | 'inventory' | 'activities';

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
  const hasShelter = gameState.shelter.isEstablished;
  const hasCamp = Boolean(gameState.isCampEstablished || gameState.campMembers.length > 0);
  const suppliesCount = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="shrink-0 sticky bottom-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 px-3 pt-2 pb-5 max-w-md mx-auto w-full select-none shadow-2xl font-sans">
      {/* Dual Progression Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* +1 DAY BUTTON */}
        <button
          type="button"
          disabled={disabled}
          onClick={onAdvanceDay}
          className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
            disabled
              ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-950/40'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Survive +1 Day</span>
        </button>

        {/* +1 WEEK BUTTON */}
        <button
          type="button"
          disabled={disabled}
          onClick={onAdvanceWeek}
          className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
            disabled
              ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
              : 'bg-white/10 hover:bg-white/15 text-zinc-100 border border-white/10'
          }`}
        >
          <FastForward className="w-4 h-4" />
          <span>Survive +1 Week</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-between gap-1 pt-1 text-[11px] font-medium">
        {/* Journal Tab */}
        <button
          type="button"
          onClick={() => onTabChange('journal')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'journal'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'journal' ? 'text-white' : 'text-zinc-500'}`} />
          <span className="text-[10px]">Journal</span>
        </button>

        {/* Supplies Tab */}
        <button
          type="button"
          onClick={() => onTabChange('inventory')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
            activeTab === 'inventory'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="relative">
            <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-white' : 'text-zinc-500'}`} />
            {suppliesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-bold rounded-full bg-rose-500 text-white min-w-4 text-center shadow-sm">
                {suppliesCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Supplies</span>
        </button>

        {/* Activities Hub (Replaces singular Scavenge) */}
        <button
          type="button"
          onClick={() => onTabChange('activities')}
          className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'activities'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Zap className={`w-4 h-4 ${activeTab === 'activities' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span className="text-[10px]">Activities</span>
        </button>

        {/* Camp Tab */}
        {hasCamp && (
          <button
            type="button"
            onClick={() => onTabChange('camp')}
            className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              activeTab === 'camp'
                ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'camp' ? 'text-white' : 'text-zinc-500'}`} />
            <span className="text-[10px]">Camp</span>
          </button>
        )}

        {/* Shelter Tab */}
        {hasShelter && (
          <button
            type="button"
            onClick={() => onTabChange('shelter')}
            className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
              activeTab === 'shelter'
                ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Shield className={`w-4 h-4 ${activeTab === 'shelter' ? 'text-white' : 'text-zinc-500'}`} />
            <span className="text-[10px]">Shelter</span>
          </button>
        )}
      </nav>
    </div>
  );
};
