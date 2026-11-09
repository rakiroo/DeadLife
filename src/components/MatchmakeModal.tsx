import React, { useState } from 'react';
import { CampMember } from '../types/game';
import { Heart, Users, Sparkles, X, Check } from 'lucide-react';

interface Props {
  campMembers: CampMember[];
  onArrangeUnion: (member1Id: string, member2Id: string) => void;
  onClose: () => void;
}

export const MatchmakeModal: React.FC<Props> = ({
  campMembers,
  onArrangeUnion,
  onClose
}) => {
  const eligibleMembers = campMembers.filter(m => !m.isChild && m.datingStage !== 'married');

  const [member1Id, setMember1Id] = useState<string>(eligibleMembers[0]?.id || '');
  const [member2Id, setMember2Id] = useState<string>(eligibleMembers[1]?.id || '');

  const m1 = eligibleMembers.find(m => m.id === member1Id);
  const m2 = eligibleMembers.find(m => m.id === member2Id);

  const canMatch = member1Id && member2Id && member1Id !== member2Id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMatch) return;
    onArrangeUnion(member1Id, member2Id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-rose-500/30 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Colony Matchmaking</h3>
              <p className="text-xs text-zinc-400">Pair survivors together in holy union</p>
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

        <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
          As settlement leader, you can introduce two uncommitted adult survivors and bless their romantic union or marriage! They will move into shared quarters and build a life together.
        </p>

        {eligibleMembers.length < 2 ? (
          <div className="p-4 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs space-y-1">
            <Users className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="font-semibold text-zinc-400">Not enough eligible survivors</p>
            <p className="text-[11px] text-zinc-500">
              You need at least two uncommitted adult survivors in camp to arrange a match.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="space-y-2">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block mb-1">
                  First Survivor
                </label>
                <select
                  value={member1Id}
                  onChange={(e) => setMember1Id(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-rose-400"
                >
                  {eligibleMembers.map(m => (
                    <option key={m.id} value={m.id} disabled={m.id === member2Id}>
                      {m.name} ({m.profession}, Age {m.age})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block mb-1">
                  Second Survivor
                </label>
                <select
                  value={member2Id}
                  onChange={(e) => setMember2Id(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-rose-400"
                >
                  {eligibleMembers.map(m => (
                    <option key={m.id} value={m.id} disabled={m.id === member1Id}>
                      {m.name} ({m.profession}, Age {m.age})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {m1 && m2 && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 leading-snug flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Will unite <span className="font-bold text-white">{m1.name}</span> and{' '}
                  <span className="font-bold text-white">{m2.name}</span> as partners (+15 Morale)!
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canMatch}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-rose-500 hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Bless Their Union & Wed (+15 Morale)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
