import React from 'react';
import { Survivor, CampMember, SurvivorChild } from '../types/game';
import { Crown, Heart, X, Baby, User, GitBranch } from 'lucide-react';

interface Props {
  player: Survivor;
  campMembers: CampMember[];
  onClose: () => void;
}

export const DynastyTreeModal: React.FC<Props> = ({
  player,
  campMembers,
  onClose
}) => {
  const spouse = campMembers.find(m => m.id === player.spouseId);
  const dating = campMembers.find(m => m.id === player.datingTargetId);
  const spouseName = spouse?.name || player.spouseName;
  const partnerName = dating?.name || player.datingTargetName;

  const isSpouseMissing = player.isSpouseMissing || (player.spouseId && player.spouseId.startsWith('missing_'));
  const isPartnerMissing = player.isPartnerMissing || (player.datingTargetId && player.datingTargetId.startsWith('missing_'));

  const children = player.children || [];
  const genNumber = player.generation || 1;
  const playedList = player.playedCharacters || [player.name];

  const getOriginBadge = (origin?: SurvivorChild['origin']) => {
    switch (origin) {
      case 'affair':
        return (
          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            🔥 Affair
          </span>
        );
      case 'out_of_wedlock':
        return (
          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ⚡ Out of Wedlock
          </span>
        );
      case 'adopted':
        return (
          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            🤝 Adopted
          </span>
        );
      case 'marital':
      default:
        return (
          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            💍 In Wedlock
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-bold block">
                Colony Lineage
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">Family & Dynasty Tree</h2>
              <span className="text-[10px] font-mono text-zinc-400">Generation {genNumber} Dynasty</span>
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

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-zinc-400 border-y border-white/5 py-1.5">
          <span className="flex items-center gap-1 text-amber-300">
            <Crown className="w-3 h-3 text-amber-400 fill-amber-400" /> Player Used
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-rose-300">💍 In Wedlock</span>
          <span className="text-zinc-600">•</span>
          <span className="text-purple-300">🔥 Affair</span>
          <span className="text-zinc-600">•</span>
          <span className="text-cyan-300">🤝 Adopted</span>
        </div>

        {/* TREE VISUAL WITH CONNECTED LINES */}
        <div className="space-y-1 pt-2">
          {/* Generation Tag */}
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block text-center mb-2">
            — Generation {genNumber} (Parents) —
          </span>

          {/* PARENTS ROW WITH HORIZONTAL MARRIAGE CONNECTOR */}
          <div className="flex items-center justify-center relative max-w-sm mx-auto">
            {/* Parent 1: Player / Founder */}
            <div className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 shadow-md text-center relative z-10">
              <div className="flex items-center justify-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="text-xs font-bold text-white truncate">{player.name}</span>
              </div>
            </div>

            {/* Horizontal Connection Line & Heart Junction */}
            <div className="w-12 sm:w-16 flex items-center justify-center relative">
              <div className="h-0.5 w-full bg-rose-500/50 absolute" />
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-rose-500/60 flex items-center justify-center relative z-10 shadow-sm">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              </div>
            </div>

            {/* Parent 2: Spouse or Partner */}
            {spouseName ? (
              <div className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-center relative z-10">
                <div className="flex items-center justify-center gap-1">
                  {playedList.includes(spouseName) && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white truncate">{spouseName}</span>
                </div>
                {isSpouseMissing && (
                  <span className="text-[9px] text-amber-300 font-mono block mt-0.5">Missing</span>
                )}
              </div>
            ) : partnerName ? (
              <div className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-pink-500/10 border border-pink-500/40 text-center relative z-10">
                <div className="flex items-center justify-center gap-1">
                  {playedList.includes(partnerName) && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold text-white truncate">{partnerName}</span>
                </div>
                {isPartnerMissing && (
                  <span className="text-[9px] text-pink-300 font-mono block mt-0.5">Missing</span>
                )}
              </div>
            ) : (
              <div className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-zinc-500 text-xs relative z-10">
                Unpartnered
              </div>
            )}
          </div>

          {/* VERTICAL TRUNK LINE DESCENDING FROM UNION */}
          <div className="w-0.5 h-6 bg-rose-500/50 mx-auto" />

          {/* CHILDREN GENERATION SECTION */}
          {children.length === 0 ? (
            <div className="p-3.5 rounded-2xl bg-black/20 border border-white/5 text-center text-xs text-zinc-500 max-w-xs mx-auto">
              No offspring born yet. Descendants will branch down from this union.
            </div>
          ) : (
            <div className="space-y-0 relative">
              {/* Horizontal Branching Bar spanning across children */}
              {children.length > 1 && (
                <div className="w-4/5 mx-auto border-t-2 border-rose-500/50 h-3" />
              )}

              {/* Children Grid Nodes */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {children.map(child => {
                  const isPlayed = playedList.includes(child.name) || Boolean(child.isPlayedLeader);

                  return (
                    <div key={child.id} className="flex flex-col items-center">
                      {/* Drop connector line into node */}
                      <div className="w-0.5 h-3 bg-rose-500/50" />

                      {/* Child Node Card */}
                      <div className={'p-2.5 rounded-2xl border text-center space-y-1 min-w-[120px] max-w-[150px] shadow-sm ' + (
                        isPlayed
                          ? 'bg-amber-500/15 border-2 border-amber-500/60'
                          : 'bg-black/50 border-white/10'
                      )}>
                        <div className="flex items-center justify-center gap-1">
                          {isPlayed && (
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-white truncate">{child.name}</span>
                        </div>

                        {/* Origin Badge (Wedlock, Affair, Adopted) */}
                        <div className="flex justify-center">
                          {getOriginBadge(child.origin)}
                        </div>

                        {/* Other Parent note if affair or different mother */}
                        {child.motherName && child.motherName !== spouseName && (
                          <span className="text-[8px] font-mono text-zinc-500 block truncate">
                            Mother: {child.motherName}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all text-center mt-2"
        >
          Close Tree
        </button>
      </div>
    </div>
  );
};

