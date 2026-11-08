import React, { useState } from 'react';
import { FastForward, Clock, Package, Zap, BookOpen, Home, Calendar, CalendarDays, ChevronDown } from 'lucide-react';
import { GameState } from '../types/game';

export type ActiveTab = 'journal' | 'base' | 'inventory' | 'activities';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAdvanceDay: () => void;
  onAdvanceWeek: () => void;
  onAdvanceMonth: () => void;
  onAdvanceYear: () => void;
  disabled: boolean;
  gameState: GameState;
}

export const BottomActionBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onAdvanceDay,
  onAdvanceWeek,
  onAdvanceMonth,
  onAdvanceYear,
  disabled,
  gameState
}) => {
  const [timeMode, setTimeMode] = useState<'contextual' | 'micro' | 'macro'>('contextual');

  const suppliesCount = gameState.inventory.reduce((sum, item) => sum + item.quantity, 0);
  const residentCount = gameState.campMembers.length + (gameState.shelter.isEstablished ? 1 : 0);

  // Determine current generational phase from BASE.txt:
  // Phase 1: Early Survival (Days 0-30 or base unestablished)
  // Phase 2: Established Settlement (Base established + multiple survivors)
  // Phase 3: Generational Colony (Marriages occurred or children born or long-term haven)
  const isEstablished = gameState.shelter.isEstablished && (gameState.campMembers.length >= 2 || gameState.day >= 30);
  const hasMarriagesOrKids = (gameState.shelter.marriagesCount ?? 0) > 0 || 
    (gameState.shelter.childrenBornCount ?? 0) > 0 || 
    (gameState.player.children && gameState.player.children.length > 0) ||
    gameState.day >= 120;

  const currentPhase: 1 | 2 | 3 = hasMarriagesOrKids ? 3 : isEstablished ? 2 : 1;

  // Active buttons based on phase & timeMode:
  const showMicro = timeMode === 'micro' || (timeMode === 'contextual' && currentPhase === 1);
  const showPhase2 = timeMode === 'contextual' && currentPhase === 2;
  const showMacro = timeMode === 'macro' || (timeMode === 'contextual' && currentPhase === 3);

  return (
    <div className="shrink-0 sticky bottom-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 px-3 pt-2 pb-5 max-w-md mx-auto w-full select-none shadow-2xl font-sans">
      {/* Evolving Time Progression Action Buttons - ONLY RENDERED ON JOURNAL SCREEN */}
      {activeTab === 'journal' && (
        <div className="mb-2 space-y-1">
          {/* Phase Badge & Micro/Macro Mode Switcher */}
          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              {currentPhase === 1 && '🌱 Phase 1: Early Survival'}
              {currentPhase === 2 && '🏠 Phase 2: Established Haven'}
              {currentPhase === 3 && '👑 Phase 3: Generational Dynasty'}
            </span>
            <div className="flex gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setTimeMode('contextual')}
                className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${timeMode === 'contextual' ? 'bg-white/20 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Contextual phase progression"
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('micro')}
                className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${timeMode === 'micro' ? 'bg-white/20 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Day & Week micro steps"
              >
                Days
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('macro')}
                className={`px-1.5 py-0.5 rounded text-[9px] transition-all ${timeMode === 'macro' ? 'bg-white/20 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Month & Year macro steps"
              >
                Years
              </button>
            </div>
          </div>

          {/* DUAL ACTION BUTTONS GRID */}
          <div className="grid grid-cols-2 gap-2">
            {/* BUTTON 1 */}
            {showMicro && (
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
            )}

            {showPhase2 && (
              <button
                type="button"
                disabled={disabled}
                onClick={onAdvanceWeek}
                className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
                  disabled
                    ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-950/40'
                }`}
              >
                <FastForward className="w-4 h-4" />
                <span>Survive +1 Week</span>
              </button>
            )}

            {showMacro && (
              <button
                type="button"
                disabled={disabled}
                onClick={onAdvanceMonth}
                className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
                  disabled
                    ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/40'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Advance +1 Month</span>
              </button>
            )}

            {/* BUTTON 2 */}
            {showMicro && (
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
            )}

            {showPhase2 && (
              <button
                type="button"
                disabled={disabled}
                onClick={onAdvanceMonth}
                className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
                  disabled
                    ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/40'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Advance +1 Month</span>
              </button>
            )}

            {showMacro && (
              <button
                type="button"
                disabled={disabled}
                onClick={onAdvanceYear}
                className={`py-3 px-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.97] ${
                  disabled
                    ? 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed opacity-50'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-amber-950/40'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Advance +1 Year</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs (Clean 4-Tab Structure: Journal | Base | Supplies | Activities) */}
      <nav className="flex items-center justify-between gap-1 pt-0.5 text-[11px] font-medium">
        {/* Journal Tab */}
        <button
          type="button"
          onClick={() => onTabChange('journal')}
          className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'journal'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'journal' ? 'text-white' : 'text-zinc-500'}`} />
          <span className="text-[10px]">Journal</span>
        </button>

        {/* Base Tab (Camp Sanctuary, Housing, Family & Decrees) */}
        <button
          type="button"
          onClick={() => onTabChange('base')}
          className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
            activeTab === 'base'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="relative">
            <Home className={`w-4 h-4 ${activeTab === 'base' ? 'text-emerald-400' : 'text-zinc-500'}`} />
            {residentCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-600 text-white min-w-4 text-center shadow-sm">
                {residentCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Base</span>
        </button>

        {/* Supplies Tab (Clean Stockpile, Provisions & Gear) */}
        <button
          type="button"
          onClick={() => onTabChange('inventory')}
          className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all relative active:scale-95 ${
            activeTab === 'inventory'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="relative">
            <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-white' : 'text-zinc-500'}`} />
            {suppliesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-500 text-white min-w-4 text-center shadow-sm">
                {suppliesCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Supplies</span>
        </button>

        {/* Activities Hub */}
        <button
          type="button"
          onClick={() => onTabChange('activities')}
          className={`flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
            activeTab === 'activities'
              ? 'bg-white/10 border border-white/10 text-white font-semibold shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Zap className={`w-4 h-4 ${activeTab === 'activities' ? 'text-amber-400' : 'text-zinc-500'}`} />
          <span className="text-[10px]">Activities</span>
        </button>
      </nav>
    </div>
  );
};
