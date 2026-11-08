import React from 'react';
import { Skull, Play, BookOpen, RotateCcw } from 'lucide-react';

interface Props {
  hasSaveGame: boolean;
  onStartNew: () => void;
  onLoadGame: () => void;
  onOpenGraveyard: () => void;
  graveyardCount: number;
  onOpenSettings?: () => void;
}

export const TitleScreen: React.FC<Props> = ({
  hasSaveGame,
  onStartNew,
  onLoadGame,
  onOpenGraveyard,
  graveyardCount
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 select-none relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Pill */}
      <div className="text-center pt-8">
        <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase px-3.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          Apocalypse Survival Sim
        </span>
      </div>

      {/* Center Branding */}
      <div className="max-w-md mx-auto w-full text-center space-y-5 my-auto">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative backdrop-blur-xl">
          <Skull className="w-10 h-10 text-rose-500" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            DEAD<span className="text-rose-500">LIFE</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans tracking-tight max-w-xs mx-auto">
            Every decision carries a pulse. How many days will you survive?
          </p>
        </div>

        {/* Action Menu Buttons */}
        <div className="space-y-2.5 pt-6 max-w-xs mx-auto">
          {/* Start Game */}
          <button
            type="button"
            onClick={onStartNew}
            className="w-full py-4 px-5 rounded-2xl font-semibold text-sm tracking-wide bg-rose-600 hover:bg-rose-500 text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Game</span>
          </button>

          {/* Load Game */}
          <button
            type="button"
            disabled={!hasSaveGame}
            onClick={onLoadGame}
            className={`w-full py-3.5 px-5 rounded-2xl font-semibold text-xs tracking-wide border transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              hasSaveGame
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/10 shadow-sm'
                : 'bg-white/[0.02] text-zinc-600 border-white/5 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{hasSaveGame ? 'Continue Survival' : 'No Saved Game'}</span>
          </button>

          {/* Graveyard */}
          <button
            type="button"
            onClick={onOpenGraveyard}
            className="w-full py-3 px-5 rounded-2xl font-medium text-xs tracking-wide bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Graveyard ({graveyardCount})</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4 text-[11px] text-zinc-600 font-sans">
        DeadLife • Realistic Survival Simulator
      </div>
    </div>
  );
};
