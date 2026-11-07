import React from 'react';
import { CemeteryRecord } from '../types/game';
import { ArrowLeft, Skull, Award, Calendar, Trash2 } from 'lucide-react';

interface Props {
  records: CemeteryRecord[];
  onBack: () => void;
  onClear: () => void;
}

export const GraveyardScreen: React.FC<Props> = ({ records, onBack, onClear }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between max-w-md mx-auto w-full select-none pb-6">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">The Graveyard</span>
        {records.length > 0 ? (
          <button
            onClick={onClear}
            title="Clear Cemetery"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      {/* Body List */}
      <div className="px-4 py-4 space-y-4 flex-1 overflow-y-auto">
        <div className="text-center py-2 space-y-1">
          <Skull className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-zinc-100">Memorial Hall of the Fallen</h2>
          <p className="text-xs text-zinc-500">Every life fought. Every grave tells a story.</p>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800/80 text-zinc-500 space-y-2 mt-8">
            <p className="text-sm">The cemetery is quiet.</p>
            <p className="text-xs text-zinc-600">No survivors have perished yet under your command.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{rec.name}</h3>
                    <p className="text-xs text-zinc-400">{rec.profession} • Age {rec.age}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      Day {rec.daysSurvived}
                    </span>
                    <span className="block text-[10px] text-zinc-500">{rec.date}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-xl text-xs text-rose-300 font-sans leading-relaxed">
                  {rec.name} {rec.deathCause}.
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800/80 text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{rec.ribbon}</span>
                  </span>
                  <span className="font-mono text-zinc-500">
                    {rec.stats.zombiesEliminated} Kills • {rec.stats.scavengeRuns} Runs
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Back Button */}
      <div className="px-4">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 active:scale-98 transition-all"
        >
          Return to Title
        </button>
      </div>
    </div>
  );
};
