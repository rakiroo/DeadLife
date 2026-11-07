import React from 'react';
import { GameState } from '../types/game';
import { Skull, RefreshCw, Award, Calendar, Crosshair, Users } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

export const DeathScreen: React.FC<Props> = ({ gameState, onRestart }) => {
  const { player, day, stats } = gameState;

  // Compute BitLife-style ribbons
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300 select-none">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tombstone Icon */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto shadow-inner">
          <Skull className="w-8 h-8 text-rose-500" />
        </div>

        {/* Name and Epitaph */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">In Memoriam</span>
          <h2 className="text-2xl font-bold text-zinc-100">{player.name}</h2>
          <p className="text-xs text-zinc-400 font-mono">
            {player.profession} • Survived {day} {day === 1 ? 'Day' : 'Days'}
          </p>
        </div>

        {/* Cause of Death */}
        <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-300 font-sans leading-relaxed">
          {player.name} {player.deathCause || 'succumbed to the brutal realities of the apocalypse'}.
        </div>

        {/* Ribbon Badge */}
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{ribbon.title}</span>
          </div>
          <p className="text-[11px] text-zinc-400">{ribbon.desc}</p>
        </div>

        {/* Lifetime Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-zinc-900 pt-3">
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">Days</span>
            <span className="font-bold text-zinc-200">{day}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">Neutralized</span>
            <span className="font-bold text-zinc-200">{stats.zombiesEliminated}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-mono">Saved</span>
            <span className="font-bold text-zinc-200">{stats.peopleSaved}</span>
          </div>
        </div>

        {/* Restart Action */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Begin New Life</span>
        </button>
      </div>
    </div>
  );
};
