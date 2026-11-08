import React from 'react';
import { GameState } from '../types/game';
import { Skull, RefreshCw, Award } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

export const DeathScreen: React.FC<Props> = ({ gameState, onRestart }) => {
  const { player, day, stats } = gameState;

  const getRibbon = () => {
    if (day >= 100) return { title: 'Century Survivor', desc: 'Lived over 100 days in the ruins of civilization.' };
    if (stats.zombiesEliminated >= 20) return { title: 'Slayer of the Dead', desc: 'Dispatched scores of infected with deadly efficiency.' };
    if (stats.peopleSaved >= 3) return { title: 'Sanctuary Founder', desc: 'Kept hope alive by taking in desperate wanderers.' };
    if (day <= 3) return { title: 'Patient Zero', desc: 'Barely lasted past the initial sirens.' };
    if (gameState.daysWithoutWater >= 3) return { title: 'The Parched', desc: 'The thirst claimed you before the monsters could.' };
    return { title: 'Unsung Survivor', desc: 'Fought silently for every breath in the new dark age.' };
  };

  const ribbon = getRibbon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-300 select-none font-sans">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-xs w-full p-4 text-center space-y-3 shadow-2xl relative overflow-hidden">
        {/* Skull Icon */}
        <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 shadow-sm">
          <Skull className="w-5 h-5" />
        </div>

        {/* Name and Epitaph */}
        <div className="space-y-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">In Memoriam</span>
          <h2 className="text-lg font-bold text-white tracking-tight">{player.name}</h2>
          <p className="text-xs text-zinc-400">
            {player.profession} • Survived {day} {day === 1 ? 'Day' : 'Days'}
          </p>
        </div>

        {/* Cause of Death */}
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-200 font-sans leading-relaxed">
          {player.name} {player.deathCause || 'succumbed to the brutal realities of the apocalypse'}.
        </div>

        {/* Ribbon Badge */}
        <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{ribbon.title}</span>
          </div>
          <p className="text-[11px] text-zinc-400">{ribbon.desc}</p>
        </div>

        {/* Lifetime Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-white/5 pt-3">
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium">Days</span>
            <span className="font-bold text-zinc-200 text-sm">{day}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium">Neutralized</span>
            <span className="font-bold text-zinc-200 text-sm">{stats.zombiesEliminated}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium">Saved</span>
            <span className="font-bold text-zinc-200 text-sm">{stats.peopleSaved}</span>
          </div>
        </div>

        {/* Restart Action */}
        <button
          type="button"
          onClick={onRestart}
          className="w-full py-2.5 px-3 rounded-xl font-semibold text-sm bg-white hover:bg-zinc-100 text-zinc-950 flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Begin New Life</span>
        </button>
      </div>
    </div>
  );
};
