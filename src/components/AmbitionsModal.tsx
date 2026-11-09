import React from 'react';
import { GameState } from '../types/game';
import { SANDBOX_AMBITIONS, SandboxAmbition } from '../data/ambitions';
import { Target, X, Check, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
  onClaimMilestone: (ambition: SandboxAmbition) => void;
}

export const AmbitionsModal: React.FC<Props> = ({ gameState, onClose, onClaimMilestone }) => {
  const completedIds = gameState.completedAmbitionIds || [];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl flex flex-col max-h-[85vh] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/5 bg-zinc-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Survival Ambitions</h2>
              <p className="text-[10px] text-zinc-400">Grand Campaign Milestones ({completedIds.length}/{SANDBOX_AMBITIONS.length} Claimed)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Ambitions List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {SANDBOX_AMBITIONS.map((ambition) => {
            const isClaimed = completedIds.includes(ambition.id);
            const isReady = ambition.isComplete(gameState) && !isClaimed;

            return (
              <div
                key={ambition.id}
                className={'p-3.5 rounded-2xl border transition-all space-y-2 ' + (
                  isClaimed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : isReady
                    ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-sm'
                    : 'bg-white/[0.03] border-white/5 text-zinc-300'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ambition.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-xs">{ambition.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-medium">{ambition.tagline}</p>
                    </div>
                  </div>
                  {isClaimed ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                      <Check className="w-3 h-3 text-emerald-400" /> Achieved
                    </span>
                  ) : isReady ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-400 text-zinc-950 animate-pulse">
                      Completed!
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {ambition.description}
                </p>

                {/* Requirements Checklist */}
                <div className="space-y-1 bg-black/30 p-2.5 rounded-xl border border-white/5 text-[10px]">
                  <span className="font-semibold text-zinc-400 block mb-0.5">Requirements:</span>
                  {ambition.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-zinc-300">
                      <span className={'w-1.5 h-1.5 rounded-full shrink-0 ' + (isClaimed ? 'bg-emerald-400' : 'bg-zinc-600')} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                {/* Claim Milestone Button */}
                {isReady && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => onClaimMilestone(ambition)}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Claim Milestone (+Morale & Legacy)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 bg-zinc-900/90 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs active:scale-[0.98] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

