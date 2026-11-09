import React from 'react';
import { OutbreakMystery, MysteryClue, GameState } from '../types/game';
import { FileText, Lock, CheckCircle2, ShieldAlert, Sparkles, X, Key, MapPin, Eye } from 'lucide-react';

interface Props {
  mystery: OutbreakMystery;
  gameState: GameState;
  onSolveMystery: () => void;
  onClose: () => void;
}

export const InvestigationBoardModal: React.FC<Props> = ({
  mystery,
  gameState,
  onSolveMystery,
  onClose
}) => {
  const discoveredCount = mystery.discoveredClueIds ? mystery.discoveredClueIds.length : 0;
  const isComplete = discoveredCount >= 4;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Classified Investigation
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">{mystery.title}</h2>
              <span className="text-[10px] font-mono text-zinc-400">{mystery.codeName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Premise Card */}
        <div className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-1.5 text-xs text-zinc-300">
          <p className="leading-relaxed italic">"{mystery.premise}"</p>
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
            <span className="text-zinc-500">Target Fallout Site:</span>
            <span className="font-bold text-amber-300">{mystery.rewardBunkerName}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Evidence Collected</span>
            <span className="font-bold text-amber-400">{discoveredCount} of 4 Leads</span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: (discoveredCount / 4) * 100 + '%' }}
            />
          </div>
        </div>

        {/* Corkboard Clue Cards (Stages 1 - 4) */}
        <div className="space-y-2 pt-1">
          {mystery.allClues.map((clue, idx) => {
            const isDiscovered = mystery.discoveredClueIds.includes(clue.id);

            return (
              <div
                key={clue.id}
                className={'p-3 rounded-2xl border transition-all space-y-1.5 ' + (
                  isDiscovered
                    ? 'bg-amber-950/20 border-amber-500/40 text-white'
                    : 'bg-white/[0.02] border-white/5 text-zinc-600'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={'w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ' + (
                      isDiscovered ? 'bg-amber-500 text-zinc-950' : 'bg-white/5 text-zinc-600'
                    )}>
                      {idx + 1}
                    </span>
                    <h4 className={'text-xs font-bold truncate ' + (isDiscovered ? 'text-amber-200' : 'text-zinc-500')}>
                      {isDiscovered ? clue.title : 'Encrypted Intelligence Lead'}
                    </h4>
                  </div>
                  {isDiscovered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  )}
                </div>

                {isDiscovered ? (
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-[11px] space-y-1">
                    <p className="text-zinc-300 font-mono italic leading-relaxed">
                      {clue.snippet}
                    </p>
                    <div className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>Retrieved from: {clue.source}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500 italic pl-7">
                    Search city landmarks, gloveboxes, and police dispatch desks during expeditions to uncover this lead.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Breakthrough Action / Reward */}
        {mystery.isSolved ? (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-1 text-xs">
            <span className="font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conspiracy Breakthrough Unlocked</span>
            </span>
            <p className="text-[10px] text-emerald-200/80">
              The coordinates for {mystery.rewardBunkerName} have been breached. Supplies were added to haven stockpiles!
            </p>
          </div>
        ) : isComplete ? (
          <button
            type="button"
            onClick={onSolveMystery}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all animate-pulse"
          >
            <Key className="w-4 h-4" />
            <span>Breach {mystery.rewardBunkerName} (+Military Cache & Legacy Marks)</span>
          </button>
        ) : (
          <p className="text-[10px] text-zinc-400 text-center italic">
            Collect all 4 leads to decrypt the coordinates to {mystery.rewardBunkerName}.
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Close Board
        </button>
      </div>
    </div>
  );
};

