import React from 'react';
import { EventDilemma, EventChoice, GameState } from '../types/game';
import { AlertCircle, ChevronRight, Lock } from 'lucide-react';

interface Props {
  dilemma: EventDilemma;
  gameState: GameState;
  onSelectChoice: (choice: EventChoice) => void;
}

export const DilemmaModal: React.FC<Props> = ({ dilemma, gameState, onSelectChoice }) => {
  const getDangerBadge = (lvl: EventDilemma['dangerLevel']) => {
    switch (lvl) {
      case 'critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/20">
            High Danger
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/20">
            Caution
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/20">
            Discovery
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-zinc-100 font-sans">
        {/* Subtle pill handle */}
        <div className="pt-3 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header Bar */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between border-b border-white/5">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-zinc-400" /> Survival Event
          </span>
          {getDangerBadge(dilemma.dangerLevel)}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
            {dilemma.title}
          </h2>

          <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/5 text-sm text-zinc-300 leading-relaxed font-sans">
            {dilemma.description}
          </div>

          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-medium text-zinc-400 block px-0.5">
              Choose an action:
            </span>

            {dilemma.choices.map((choice) => {
              let isLocked = false;
              let lockReason = '';

              if (choice.requiresItem) {
                const hasItem = gameState.inventory.some(i => i.id === choice.requiresItem && i.quantity > 0);
                if (!hasItem) {
                  isLocked = true;
                  lockReason = `Requires ${choice.requiresItem.replace('_', ' ')}`;
                }
              }

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelectChoice(choice)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 group ${
                    isLocked
                      ? 'bg-white/[0.02] border-white/5 text-zinc-600 cursor-not-allowed'
                      : 'bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] border-white/10 hover:border-white/20 text-zinc-100 shadow-sm'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white leading-snug">
                        {choice.text}
                      </span>
                    </div>

                    {choice.consequenceSummary && (
                      <p className="text-xs text-zinc-400 leading-tight">
                        {choice.consequenceSummary}
                      </p>
                    )}

                    {choice.requiredSkill && (
                      <span className="inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10 capitalize mt-0.5">
                        {choice.requiredSkill.skill} Lv {choice.requiredSkill.minLevel}+
                      </span>
                    )}

                    {isLocked && (
                      <span className="text-[11px] text-rose-400 flex items-center gap-1 font-medium mt-0.5">
                        <Lock className="w-3 h-3" /> {lockReason}
                      </span>
                    )}
                  </div>

                  {!isLocked && (
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 shrink-0 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
