import React from 'react';
import { EventDilemma, EventChoice, GameState } from '../types/game';
import { AlertCircle, Skull, ShieldAlert, Award } from 'lucide-react';

interface Props {
  dilemma: EventDilemma;
  gameState: GameState;
  onSelectChoice: (choice: EventChoice) => void;
}

export const DilemmaModal: React.FC<Props> = ({ dilemma, gameState, onSelectChoice }) => {
  const getDangerBadge = (lvl: EventDilemma['dangerLevel']) => {
    switch (lvl) {
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white animate-pulse">Critical Threat</span>;
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-700">High Danger</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-700">Moderate Risk</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-700">Exploration</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Survival Dilemma</span>
          </div>
          {getDangerBadge(dilemma.dangerLevel)}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight leading-snug">
            {dilemma.title}
          </h2>

          <p className="text-zinc-300 text-sm leading-relaxed font-sans bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
            {dilemma.description}
          </p>

          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-medium">
              What do you decide?
            </span>

            {dilemma.choices.map((choice) => {
              // Check requirement
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
                  disabled={isLocked}
                  onClick={() => onSelectChoice(choice)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex flex-col gap-1.5 ${
                    isLocked
                      ? 'bg-zinc-950/30 border-zinc-800/30 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-800/70 hover:bg-zinc-750 border-zinc-700 hover:border-zinc-500 text-zinc-100 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-zinc-100">
                      {choice.text}
                    </span>
                    {choice.requiredSkill && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-700/80 text-zinc-300 border border-zinc-600 shrink-0 capitalize">
                        {choice.requiredSkill.skill} {choice.requiredSkill.minLevel}+
                      </span>
                    )}
                  </div>

                  {choice.consequenceSummary && (
                    <span className="text-xs text-zinc-400 italic">
                      {choice.consequenceSummary}
                    </span>
                  )}

                  {isLocked && (
                    <span className="text-[11px] text-rose-400 font-medium">
                      🔒 {lockReason}
                    </span>
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
