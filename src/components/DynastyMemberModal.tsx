import React from 'react';
import { Survivor, CampMember, SurvivorChild } from '../types/game';
import { Crown, Heart, Shield, Swords, Hammer, Compass, HeartPulse, X, Check, Baby, User, Sparkles, Scroll, MapPin, AlertCircle } from 'lucide-react';

export interface DynastyMemberData {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  age: number;
  generation: number;
  isPlayerUsed: boolean;
  isLeader: boolean;
  relation: string;
  profession: string;
  bio?: string;
  health?: number;
  isMissing?: boolean;
  searchGoal?: string;
  isDeceased?: boolean;
  deathCause?: string;
  isLegitimate: boolean;
  originDetail?: 'marital' | 'affair' | 'out_of_wedlock' | 'adopted';
  legitimizedBy?: string;
  legitimizedDay?: number;
  motherName?: string;
  fatherName?: string;
  stage?: 'infant' | 'child' | 'teen' | 'adult';
  skills?: { combat: number; medical: number; crafting: number; stealth: number; fitness: number };
  traits?: { id: string; name: string; type: 'positive' | 'negative' }[];
  currentRoomName?: string;
  spouseName?: string;
  partnerName?: string;
  datingStage?: string;
  isDesignatedHeir?: boolean;
  bequeathedRelicName?: string;
}

interface Props {
  member: DynastyMemberData;
  player: Survivor;
  onDesignateHeir?: (memberId: string, name: string) => void;
  onLegitimizeChild?: (childId: string) => void;
  onClose: () => void;
}

export const DynastyMemberModal: React.FC<Props> = ({
  member,
  player,
  onDesignateHeir,
  onLegitimizeChild,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ' + (
              member.isPlayerUsed
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : 'bg-white/5 border border-white/10 text-white'
            )}>
              {member.isPlayerUsed ? (
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
              ) : member.stage === 'infant' || member.stage === 'child' ? (
                <Baby className="w-6 h-6 text-amber-300" />
              ) : (
                <User className="w-6 h-6 text-zinc-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-tight">{member.name}</h2>
                {member.isPlayerUsed && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 fill-amber-400" /> Player Controlled
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Gen {member.generation} • {member.relation} • Age {member.age}
              </p>
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

        {/* Clean Lineage Status (Only 💍 Legitimate or ⚡ Illegitimate) */}
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
          <span className="text-[10px] text-zinc-400 font-mono">Lineage Status:</span>
          {member.isLegitimate ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              💍 Legitimate
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⚡ Illegitimate
            </span>
          )}
        </div>

        {/* Detailed Background Lore (Only shown here when clicked!) */}
        <div className="space-y-1.5">
          {member.legitimizedBy ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 leading-snug">
              📜 Officially Legitimized by founder {member.legitimizedBy} on Day {member.legitimizedDay || 0}. Eligible for all family inheritance.
            </div>
          ) : member.originDetail === 'affair' ? (
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300 leading-snug">
              🔥 Born of an affair with {member.motherName || 'a companion'}. Cannot inherit until officially legitimized.
            </div>
          ) : member.originDetail === 'adopted' ? (
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 leading-snug">
              🤝 Rescued and adopted as an orphan from the wasteland.
            </div>
          ) : member.originDetail === 'out_of_wedlock' ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 leading-snug">
              ⚡ Born out of wedlock from an uncommitted encounter.
            </div>
          ) : null}

          {/* Biological Parents */}
          {(member.motherName || member.fatherName) && (
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Biological Heritage:</span>
              <span className="text-zinc-200">
                {member.fatherName ? 'Father: ' + member.fatherName : ''}
                {member.fatherName && member.motherName ? ' • ' : ''}
                {member.motherName ? 'Mother: ' + member.motherName : ''}
              </span>
            </div>
          )}
        </div>

        {/* Vital Status Card */}
        {member.isMissing ? (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Separated • Missing in the Ruins
            </span>
            <p className="text-[11px] text-zinc-300 leading-snug">
              Search Target: {member.searchGoal || 'Follow clues during expeditions to reunite with them.'}
            </p>
          </div>
        ) : member.isDeceased ? (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-xs">
            <span className="font-bold text-rose-300">✝ Fallen in the Line of Duty</span>
            <p className="text-[11px] text-zinc-300 leading-snug">
              Cause: {member.deathCause || 'Perished in the ruins.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Physical Health</span>
              <span className="text-sm font-bold text-emerald-400">{member.health ?? 100}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Living Status</span>
              <span className="text-xs font-bold text-zinc-200 truncate">
                {member.currentRoomName || 'Active Haven'}
              </span>
            </div>
          </div>
        )}

        {/* Life Stage & Profession */}
        <div className="p-3 bg-black/30 border border-white/5 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">{member.profession}</span>
            <span className="text-[10px] font-mono text-zinc-400">
              {member.age >= 16 ? 'Adult Heir' : member.stage === 'teen' ? 'Apprentice (13-15)' : member.stage === 'child' ? 'Child (4-12)' : 'Infant (0-3)'}
            </span>
          </div>
          {member.bio && (
            <p className="text-[11px] text-zinc-300 italic pt-0.5">
              "{member.bio}"
            </p>
          )}
        </div>

        {/* Core Attributes */}
        {member.skills && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
              Survival Attributes
            </span>
            <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono">
              <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                <span className="text-rose-400 font-bold block">{member.skills.combat}</span>
                <span className="text-zinc-500 text-[8px]">Cbt</span>
              </div>
              <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                <span className="text-cyan-400 font-bold block">{member.skills.medical}</span>
                <span className="text-zinc-500 text-[8px]">Med</span>
              </div>
              <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                <span className="text-amber-400 font-bold block">{member.skills.crafting}</span>
                <span className="text-zinc-500 text-[8px]">Crf</span>
              </div>
              <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                <span className="text-indigo-400 font-bold block">{member.skills.stealth}</span>
                <span className="text-zinc-500 text-[8px]">Stl</span>
              </div>
              <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold block">{member.skills.fitness}</span>
                <span className="text-zinc-500 text-[8px]">Fit</span>
              </div>
            </div>
          </div>
        )}

        {/* Succession & Testament Rights (Enforces Legitimacy Rule!) */}
        <div className="p-3 bg-gradient-to-r from-amber-950/20 to-black/40 border border-amber-500/20 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold flex items-center gap-1">
              <Scroll className="w-3.5 h-3.5" /> Dynasty Succession
            </span>
            {member.isDesignatedHeir ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ★ Primary Heir in Will
              </span>
            ) : member.isLegitimate ? (
              <span className="text-[9px] font-mono text-emerald-400">Eligible Successor</span>
            ) : (
              <span className="text-[9px] font-mono text-zinc-500">Ineligible (Illegitimate)</span>
            )}
          </div>

          {/* Action 1: Legitimize Child button */}
          {!member.isLegitimate && !member.isLeader && !member.isDeceased && onLegitimizeChild && (
            <button
              type="button"
              onClick={() => {
                onLegitimizeChild(member.id);
                onClose();
              }}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span>Legitimize Child</span>
            </button>
          )}

          {/* Action 2: Designate as Heir if Legitimate */}
          {member.isLegitimate && !member.isLeader && !member.isDesignatedHeir && !member.isDeceased && onDesignateHeir && (
            <button
              type="button"
              onClick={() => {
                onDesignateHeir(member.id, member.name);
                onClose();
              }}
              className="w-full py-1.5 px-3 rounded-xl text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Designate as Primary Heir in Will</span>
            </button>
          )}

          {/* Notice if cannot inherit */}
          {!member.isLegitimate && !member.isLeader && !member.isDeceased && (
            <p className="text-[10px] text-zinc-400 italic text-center leading-snug">
              Only legitimate heirs can inherit the Founder's Will and assets. Legitimize this child first.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all text-center"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
};
