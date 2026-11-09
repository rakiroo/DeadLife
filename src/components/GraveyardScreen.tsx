import React, { useState } from 'react';
import { CemeteryRecord } from '../types/game';
import { ArrowLeft, Skull, Award, Trash2, BookOpen, ChevronRight } from 'lucide-react';
import { BiographyModal } from './BiographyModal';

interface Props {
  records: CemeteryRecord[];
  onBack: () => void;
  onClear: () => void;
}

export const GraveyardScreen: React.FC<Props> = ({ records, onBack, onClear }) => {
  const [selectedRecord, setSelectedRecord] = useState<CemeteryRecord | null>(null);

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
          <p className="text-xs text-zinc-500">Every life fought. Tap any survivor to read their full life memoir.</p>
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
                onClick={() => setSelectedRecord(rec)}
                className="p-4 bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-2xl space-y-2.5 relative overflow-hidden cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                      <span>{rec.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                    </h3>
                    <p className="text-xs text-zinc-400">{rec.profession} â€¢ Age {rec.age}</p>
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
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 hover:text-zinc-300">
                    <BookOpen className="w-3 h-3 text-cyan-400" />
                    <span>View Biography</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Biography Modal */}
      {selectedRecord && (
        <BiographyModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

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
