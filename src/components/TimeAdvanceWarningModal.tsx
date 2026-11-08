import React from 'react';
import { AlertTriangle, Utensils, Droplets, Calendar, FastForward } from 'lucide-react';

interface Props {
  type: 'month' | 'year';
  foodNeeded: number;
  waterNeeded: number;
  currentFood: number;
  currentWater: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TimeAdvanceWarningModal: React.FC<Props> = ({
  type,
  foodNeeded,
  waterNeeded,
  currentFood,
  currentWater,
  onConfirm,
  onCancel
}) => {
  const isMonth = type === 'month';
  const timeSpanText = isMonth ? '1 Month (30 Days)' : '1 Year (365 Days)';
  const foodDeficit = Math.max(0, foodNeeded - currentFood);
  const waterDeficit = Math.max(0, waterNeeded - currentWater);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">Colony Resource Deficit</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Advancing <span className="font-bold text-white">{timeSpanText}</span> requires substantial sustenance. Your current stockpiles will not cover the full duration:
          </p>
        </div>

        {/* Deficit details */}
        <div className="space-y-2 text-xs">
          {foodDeficit > 0 && (
            <div className="p-3 bg-black/40 border border-rose-500/30 rounded-2xl flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                Food Stockpile Deficit
              </span>
              <span className="font-mono font-bold text-rose-400">
                -{foodDeficit} rations short
              </span>
            </div>
          )}

          {waterDeficit > 0 && (
            <div className="p-3 bg-black/40 border border-rose-500/30 rounded-2xl flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Water Cistern Deficit
              </span>
              <span className="font-mono font-bold text-rose-400">
                -{waterDeficit} liters short
              </span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-zinc-400 italic text-center">
          Proceeding will strain morale and cause severe hunger damage to survivors unless rations are stretched or greenhouse crops harvest.
        </p>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <FastForward className="w-4 h-4" />
            <span>Proceed & Advance Time Anyway</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 active:scale-[0.98] transition-all"
          >
            Cancel & Return to Base
          </button>
        </div>
      </div>
    </div>
  );
};
