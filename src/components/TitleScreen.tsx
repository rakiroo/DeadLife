import React from 'react';
import { Skull, Play, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

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
  graveyardCount,
  onOpenSettings
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="text-center pt-8">
        <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
          Realistic Apocalypse Life Sim • v1.0
        </span>
      </div>

      {/* Center Branding */}
      <div className="max-w-md mx-auto w-full text-center space-y-4 my-auto">
        <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800/90 flex items-center justify-center mx-auto shadow-2xl relative">
          <Skull className="w-10 h-10 text-rose-500 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        </div>

        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-100 uppercase">
            DEAD<span className="text-rose-500">LIFE</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono tracking-wide">
            Every choice carries a pulse. How many days will you last?
          </p>
        </div>

        {/* Action Menu Buttons */}
        <div className="space-y-3 pt-6 max-w-xs mx-auto">
          {/* Start Game */}
          <button
            onClick={onStartNew}
            className="w-full py-4 px-5 rounded-2xl font-bold text-sm tracking-wider uppercase bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2.5 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Game</span>
          </button>

          {/* Load Game */}
          <button
            disabled={!hasSaveGame}
            onClick={onLoadGame}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs tracking-wider uppercase border transition-all flex items-center justify-center gap-2 ${
              hasSaveGame
                ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700 active:scale-95 shadow-md'
                : 'bg-zinc-950/40 text-zinc-600 border-zinc-800/40 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{hasSaveGame ? 'Continue Survivor' : 'No Saved Game'}</span>
          </button>

          {/* Graveyard */}
          <button
            onClick={onOpenGraveyard}
            className="w-full py-3 px-5 rounded-2xl font-medium text-xs tracking-wider uppercase bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Graveyard ({graveyardCount})</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-4 text-[10px] font-mono text-zinc-600">
        DeadLife • Mobile-first turn-based zombie simulator
      </div>
    </div>
  );
};
