import React, { useState } from 'react';
import { Survivor, CampMember, SurvivorChild } from '../types/game';
import { Crown, Heart, X, Baby, User } from 'lucide-react';
import { DynastyMemberModal, DynastyMemberData } from './DynastyMemberModal';

interface Props {
  player: Survivor;
  campMembers: CampMember[];
  onLegitimizeChild?: (childId: string) => void;
  onClose: () => void;
}

export const DynastyTreeModal: React.FC<Props> = ({
  player,
  campMembers,
  onLegitimizeChild,
  onClose
}) => {
  const [inspectMember, setInspectMember] = useState<DynastyMemberData | null>(null);

  const spouse = campMembers.find(m => m.id === player.spouseId);
  const dating = campMembers.find(m => m.id === player.datingTargetId);
  const spouseName = spouse?.name || player.spouseName;
  const partnerName = dating?.name || player.datingTargetName;

  const isSpouseMissing = Boolean(player.isSpouseMissing || (player.spouseId && player.spouseId.startsWith('missing_')));
  const isPartnerMissing = Boolean(player.isPartnerMissing || (player.datingTargetId && player.datingTargetId.startsWith('missing_')));

  const children = player.children || [];
  const genNumber = player.generation || 1;
  const playedList = player.playedCharacters || [player.name];

  const getOriginBadge = (isLegitimate?: boolean) => {
    if (isLegitimate !== false) {
      return (
        <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          💍 Legitimate
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        ⚡ Illegitimate
      </span>
    );
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
              <span className="text-[10px] font-mono text-zinc-400">Generation {genNumber} Dynasty • Tap Any Name to Inspect</span>
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
        <div className="flex items-center justify-center gap-3 text-[9px] font-mono text-zinc-400 border-y border-white/5 py-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-amber-300">
            <Crown className="w-3 h-3 text-amber-400 fill-amber-400" /> Player Used
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-rose-300">💍 Legitimate</span>
          <span className="text-zinc-600">•</span>
          <span className="text-amber-300">⚡ Illegitimate</span>
        </div>

        {/* TREE VISUAL WITH CONNECTED LINES */}
        <div className="space-y-1 pt-1">
          {/* Generation Tag */}
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block text-center mb-2">
            — Generation {genNumber} (Parents) —
          </span>

          {/* PARENTS ROW WITH HORIZONTAL MARRIAGE CONNECTOR */}
          <div className="flex items-center justify-center relative max-w-sm mx-auto">
            {/* Parent 1: Player / Founder */}
            <div
              onClick={() => setInspectMember({
                id: 'player',
                name: player.name,
                gender: player.gender,
                age: player.age,
                generation: genNumber,
                isPlayerUsed: true,
                isLeader: true,
                relation: 'Colony Founder & Leader',
                profession: player.profession,
                bio: player.bio,
                health: player.health,
                isLegitimate: true,
                skills: {
                  combat: player.combatSkill,
                  medical: player.medicalSkill,
                  crafting: player.craftingSkill,
                  stealth: player.stealthSkill,
                  fitness: player.fitnessSkill
                },
                currentRoomName: player.roomId,
                isDesignatedHeir: true
              })}
              className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border-2 border-amber-500/60 shadow-md text-center relative z-10 cursor-pointer active:scale-95 transition-all"
            >
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
              <div
                onClick={() => setInspectMember({
                  id: player.spouseId || 'spouse',
                  name: spouseName,
                  age: spouse?.age || player.age,
                  generation: genNumber,
                  isPlayerUsed: playedList.includes(spouseName),
                  isLeader: false,
                  relation: isSpouseMissing ? 'Separated Spouse (Missing)' : 'Co-habiting Spouse',
                  profession: spouse?.profession || 'Haven Pioneer',
                  health: spouse?.health ?? 90,
                  isMissing: isSpouseMissing,
                  searchGoal: player.backstory?.searchGoal,
                  isLegitimate: true,
                  skills: spouse ? {
                    combat: spouse.combatSkill || 5,
                    medical: spouse.medicalSkill || 5,
                    crafting: spouse.craftingSkill || 5,
                    stealth: spouse.stealthSkill || 5,
                    fitness: spouse.fitnessSkill || 5
                  } : undefined
                })}
                className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-center relative z-10 cursor-pointer active:scale-95 transition-all"
              >
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
              <div
                onClick={() => setInspectMember({
                  id: player.datingTargetId || 'partner',
                  name: partnerName,
                  age: dating?.age || player.age,
                  generation: genNumber,
                  isPlayerUsed: playedList.includes(partnerName),
                  isLeader: false,
                  relation: isPartnerMissing ? 'Partner (Missing)' : 'Dating Partner',
                  profession: dating?.profession || 'Haven Companion',
                  health: dating?.health ?? 90,
                  isMissing: isPartnerMissing,
                  searchGoal: player.backstory?.searchGoal,
                  isLegitimate: true
                })}
                className="flex-1 max-w-[140px] p-2.5 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/40 text-center relative z-10 cursor-pointer active:scale-95 transition-all"
              >
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
                      <div
                        onClick={() => setInspectMember({
                          id: child.id,
                          name: child.name,
                          gender: child.gender,
                          age: child.age,
                          generation: genNumber + 1,
                          isPlayerUsed: isPlayed,
                          isLeader: false,
                          relation: child.age >= 16 ? 'Adult Heir' : child.stage,
                          profession: child.age >= 16 ? 'Dynasty Heir' : 'Colony Child',
                          health: 100,
                          isLegitimate: child.isLegitimate !== false,
                          originDetail: child.originDetail || (child.isLegitimate !== false ? 'marital' : 'out_of_wedlock'),
                          legitimizedBy: child.legitimizedBy,
                          legitimizedDay: child.legitimizedDay,
                          motherName: child.motherName,
                          fatherName: child.fatherName,
                          stage: child.stage,
                          skills: child.skills,
                          isDesignatedHeir: player.will?.designatedHeirId === child.id,
                          bequeathedRelicName: player.will?.designatedHeirId === child.id ? player.will.bequeathedHeirloomName : undefined
                        })}
                        className={'p-2.5 rounded-2xl border text-center space-y-1 min-w-[120px] max-w-[150px] shadow-sm cursor-pointer hover:border-amber-400/50 active:scale-95 transition-all ' + (
                          isPlayed
                            ? 'bg-amber-500/15 border-2 border-amber-500/60'
                            : 'bg-black/50 border-white/10'
                        )}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isPlayed && (
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-white truncate">{child.name}</span>
                        </div>

                        {/* Origin Badge */}
                        <div className="flex justify-center">
                          {getOriginBadge(child.isLegitimate !== false)}
                        </div>


                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* DYNASTY MEMBER DOSSIER MODAL */}
        {inspectMember && (
          <DynastyMemberModal
            member={inspectMember}
            player={player}
            onClose={() => setInspectMember(null)}
          />
        )}

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

