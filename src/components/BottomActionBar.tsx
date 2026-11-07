import React from 'react';
import { FastForward, Clock, Shield, Users, Package, Compass, BookOpen } from 'lucide-react';

export type ActiveTab = 'journal' | 'shelter' | 'camp' | 'inventory' | 'scavenge';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAdvanceDay: () => void;
  onAdvanceWeek: () => void;
  disabled: boolean;
}

export const BottomActionBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  onAdvanceDay,
  onAdvanceWeek,
  disabled
}) => {
  return (
    <div className="shrink-0 sticky bottom-0 z-40 bg-zinc-950/98 backdrop-blur-md border-t border-zinc-800/90 px-3 pt-2 pb-3 max-w-md mx-auto w-full select-none shadow-2xl">
      {/* Dual Progression Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* +1 DAY BUTTON */}
        <button
          disabled={disabled}
          onClick={onAdvanceDay}
          className={`py-3 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
            disabled
              ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30 hover:shadow-emerald-950/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Survive +1 Day</span>
        </button>

        {/* +1 WEEK BUTTON */}
        <button
          disabled={disabled}
          onClick={onAdvanceWeek}
          className={`py-3 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
            disabled
              ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border border-amber-400/30 hover:shadow-amber-950/50'
          }`}
        >
          <FastForward className="w-4 h-4" />
          <span>Survive +1 Week</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center justify-around pt-1 text-[11px] font-medium text-zinc-400">
        <button
          onClick={() => onTabChange('journal')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'journal' ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => onTabChange('shelter')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'shelter' ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Shelter</span>
        </button>

        <button
          onClick={() => onTabChange('camp')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'camp' ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Camp</span>
        </button>

        <button
          onClick={() => onTabChange('inventory')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'inventory' ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Supplies</span>
        </button>

        <button
          onClick={() => onTabChange('scavenge')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            activeTab === 'scavenge' ? 'text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Scavenge</span>
        </button>
      </nav>
    </div>
  );
};
