import React from 'react';
import { Survivor, CampMember, SurvivorChild } from '../types/game';
import { Crown, Heart, Users, X, Sparkles, Swords, Baby, Shield, ArrowDown, User } from 'lucide-react';

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

  // Backstory family kin
  const hasBackstoryKin = player.backstory && (
    player.backstory.theme === 'pet' ||
    player.backstory.relation.includes('Father') ||
    player.backstory.relation.includes('Mother') ||
    player.backstory.relation.includes('Brother') ||
    player.backstory.relation.includes('Sister')
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-rose-500/30 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <Crown className="w-5 h-5" />
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

        {/* Tree Visual Flow */}
        <div className="space-y-4 pt-1">
          {/* Generation 1: Founders & Parents */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block text-center">
              — Generation {genNumber} (Colony Founders) —
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Founder / Leader Card */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">{player.name}</span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {player.profession} • Age {player.age}
                </div>
                <div className="flex gap-1 text-[9px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                  <span className="text-rose-400">Cbt {player.combatSkill}</span>
                  <span>•</span>
                  <span className="text-cyan-400">Med {player.medicalSkill}</span>
                  <span>•</span>
                  <span className="text-amber-400">Crf {player.craftingSkill}</span>
                </div>
              </div>

              {/* Spouse / Partner Card */}
              {spouseName ? (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{spouseName}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {isSpouseMissing ? 'Separated (Missing)' : 'Co-habiting Spouse'}
                  </div>
                  <div className="text-[9px] font-mono text-rose-300 pt-1 border-t border-white/5">
                    {isSpouseMissing ? 'Trail in Ruins' : 'Haven Co-Founder'}
                  </div>
                </div>
              ) : partnerName ? (
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="text-xs font-bold text-white truncate">{partnerName}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {isPartnerMissing ? 'Partner (Missing)' : 'Dating Partner'}
                  </div>
                  <div className="text-[9px] font-mono text-pink-300 pt-1 border-t border-white/5">
                    {isPartnerMissing ? 'Separated on Day 0' : 'Courting in Haven'}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center text-zinc-500 space-y-1">
                  <User className="w-4 h-4 text-zinc-600" />
                  <span className="text-[10px] font-medium">No Spouse Yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Tree Connection Arrow */}
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
              <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>

          {/* Generation 2: Children & Offspring */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">
                — Generation {genNumber + 1} (Children & Heirs: {children.length}) —
              </span>
            </div>

            {children.length === 0 ? (
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-zinc-500">
                No offspring born yet. As your family expands, your children and dynasty heirs will branch down here.
              </div>
            ) : (
              <div className="space-y-2">
                {children.map(child => (
                  <div key={child.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-white">{child.name}</span>
                        <span className="text-[10px] text-zinc-400">({child.gender}, Age {child.age})</span>
                      </div>
                      <span className={'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ' + (
                        child.age >= 16
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-white/5 text-zinc-400 border-white/5'
                      )}>
                        {child.age >= 16 ? 'Adult Heir' : child.stage}
                      </span>
                    </div>

                    {child.skills && (
                      <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-mono pt-1 border-t border-white/5 text-zinc-300">
                        <span>Cbt {child.skills.combat}</span>
                        <span>Med {child.skills.medical}</span>
                        <span>Crf {child.skills.crafting}</span>
                        <span>Stl {child.skills.stealth}</span>
                        <span>Fit {child.skills.fitness}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backstory Family Kin / Pets in the Ruins */}
          {hasBackstoryKin && player.backstory && (
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
                Family Kin in the Ruins
              </span>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span>{player.backstory.theme === 'pet' ? '🐕' : '👥'}</span>
                  <span className="font-bold text-white">{player.backstory.targetName}</span>
                  <span className="text-zinc-500 text-[10px]">({player.backstory.relation})</span>
                </div>
                <span className="text-[9px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {player.backstory.status === 'resolved' ? 'Reunited' : 'Missing'}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all text-center"
        >
          Close Tree
        </button>
      </div>
    </div>
  );
};

