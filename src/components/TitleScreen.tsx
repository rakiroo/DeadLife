import React from 'react';
import { Skull, Play, BookOpen, RotateCcw, Award } from 'lucide-react';

interface Props {
  hasSaveGame: boolean;
  onStartNew: () => void;
  onLoadGame: () => void;
  onOpenGraveyard: () => void;
  graveyardCount: number;
  onOpenCodex?: () => void;
  legacyMarks?: number;
  onOpenSettings?: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  hasSaveGame,
  onStartNew,
  onLoadGame,
  onOpenGraveyard,
  graveyardCount,
  onOpenCodex,
  legacyMarks = 0
}) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col justify-between px-4 py-3 sm:p-6 select-none relative overflow-y-auto max-w-md mx-auto w-full font-sans pb-[max(1rem,env(safe-area-inset-bottom))]">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Pill */}
      <div className="text-center pt-2 sm:pt-4 shrink-0">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-zinc-400 uppercase px-3.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          Apocalypse Survival Sim
        </span>
      </div>

      {/* Center Branding */}
      <div className="max-w-xs mx-auto w-full text-center space-y-4 my-auto py-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative backdrop-blur-xl">
          <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            DEAD<span className="text-rose-500">LIFE</span>
          </h1>
          <p className="text-xs text-zinc-400 font-sans tracking-tight max-w-xs mx-auto">
            Every decision carries a pulse. How many days will you survive?
          </p>
        </div>

        {/* Action Menu Buttons */}
        <div className="space-y-2 pt-2 max-w-xs mx-auto w-full">
          {/* Start Game */}
          <button
            type="button"
            onClick={onStartNew}
            className="w-full py-3.5 sm:py-4 px-5 rounded-2xl font-semibold text-sm tracking-wide bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Game</span>
          </button>

          {/* Load Game */}
          <button
            type="button"
            disabled={!hasSaveGame}
            onClick={onLoadGame}
            className={`w-full py-3 px-5 rounded-2xl font-semibold text-xs tracking-wide border transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              hasSaveGame
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/10 shadow-sm'
                : 'bg-white/[0.02] text-zinc-600 border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{hasSaveGame ? 'Continue Survival' : 'No Saved Game'}</span>
          </button>

          {/* Survivor's Codex */}
          {onOpenCodex && (
            <button
              type="button"
              onClick={onOpenCodex}
              className="w-full py-2.5 sm:py-3 px-5 rounded-2xl font-medium text-xs tracking-wide bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Survivor's Codex ({legacyMarks} Marks)</span>
            </button>
          )}

          {/* Graveyard */}
          <button
            type="button"
            onClick={onOpenGraveyard}
            className="w-full py-2.5 sm:py-3 px-5 rounded-2xl font-medium text-xs tracking-wide bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Graveyard ({graveyardCount})</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-2 text-[10px] text-zinc-600 font-sans shrink-0">
        DeadLife â€¢ Realistic Survival Simulator
      </div>
    </div>
  );
};
