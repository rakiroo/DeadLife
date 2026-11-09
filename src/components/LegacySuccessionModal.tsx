import React from 'react';
import { GameState } from '../types/game';
import { Crown, Sparkles, UserCheck, Shield, HeartPulse, Hammer, Search, Activity } from 'lucide-react';

interface Props {
  prompt: NonNullable<GameState['legacySuccessionPrompt']>;
  onSelectSuccessor: (candidateId: string) => void;
  onDeclineSuccession: () => void;
}

export const LegacySuccessionModal: React.FC<Props> = ({
  prompt,
  onSelectSuccessor,
  onDeclineSuccession
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">The Torch Passes</h2>
          <p className="text-xs text-zinc-300 leading-relaxed">
            <span className="font-semibold text-amber-300">{prompt.deceasedName}</span> {prompt.cause === 'Old Age' ? 'has passed away peacefully of old age' : 'has fallen'}, surrounded by the colony they built. The settlement gathers by the memorial garden. Who will step forward to lead our haven?
          </p>
        </div>

        {/* Candidate List */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
            Successor Candidates ({prompt.candidates.length})
          </span>

          <div className="space-y-2">
            {prompt.candidates.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-2 hover:border-amber-400/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      {c.isOffspring && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                          Dynasty Heir
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{c.profession} â€¢ Age {c.age}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectSuccessor(c.id)}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center gap-1 shadow-md shadow-amber-950/40 active:scale-95 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Choose Heir</span>
                  </button>
                </div>

                {/* RPG Skills */}
                <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono pt-1 border-t border-white/5">
                  <div className="p-1 bg-black/30 rounded-lg">
                    <span className="text-rose-400 font-bold block">{c.skills.combat}</span>
                    <span className="text-zinc-500 text-[8px]">Cbt</span>
                  </div>
                  <div className="p-1 bg-black/30 rounded-lg">
                    <span className="text-cyan-400 font-bold block">{c.skills.medical}</span>
                    <span className="text-zinc-500 text-[8px]">Med</span>
                  </div>
                  <div className="p-1 bg-black/30 rounded-lg">
                    <span className="text-amber-400 font-bold block">{c.skills.crafting}</span>
                    <span className="text-zinc-500 text-[8px]">Crf</span>
                  </div>
                  <div className="p-1 bg-black/30 rounded-lg">
                    <span className="text-indigo-400 font-bold block">{c.skills.stealth}</span>
                    <span className="text-zinc-500 text-[8px]">Stl</span>
                  </div>
                  <div className="p-1 bg-black/30 rounded-lg">
                    <span className="text-emerald-400 font-bold block">{c.skills.fitness}</span>
                    <span className="text-zinc-500 text-[8px]">Fit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decline Button */}
        <div className="pt-2 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onDeclineSuccession}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-medium"
          >
            Decline & View Memorial
          </button>
        </div>
      </div>
    </div>
  );
};
