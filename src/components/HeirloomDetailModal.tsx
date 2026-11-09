import React from 'react';
import { FamilyHeirloom, Survivor } from '../types/game';
import { Crown, Sparkles, X, Swords, Heart, Hammer, Compass, Shield, Wrench, Calendar, BookOpen } from 'lucide-react';

interface Props {
  heirloom: FamilyHeirloom;
  player: Survivor;
  currentDay: number;
  onRepairRelic?: (heirloomId: string) => void;
  onClose: () => void;
}

export const HeirloomDetailModal: React.FC<Props> = ({
  heirloom,
  player,
  currentDay,
  onRepairRelic,
  onClose
}) => {
  const ageDays = Math.max(0, currentDay - (heirloom.forgedDay || 0));
  const ageYears = Math.floor(ageDays / 365);

  const getTypeIcon = (type: FamilyHeirloom['type']) => {
    switch (type) {
      case 'weapon': return <Swords className="w-5 h-5 text-rose-400" />;
      case 'ring':
      case 'locket':
      case 'medallion': return <Heart className="w-5 h-5 text-amber-400" />;
      case 'tool': return <Hammer className="w-5 h-5 text-amber-300" />;
      case 'watch': return <Calendar className="w-5 h-5 text-cyan-400" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getConditionColor = (cond: FamilyHeirloom['condition']) => {
    switch (cond) {
      case 'Pristine': return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'Battle-Worn': return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
      case 'Weathered': return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
      default: return 'text-purple-300 bg-purple-500/15 border-purple-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              {getTypeIcon(heirloom.type)}
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Dynasty Heirloom
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">{heirloom.name}</h2>
              <span className={'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border inline-block mt-0.5 ' + getConditionColor(heirloom.condition || 'Pristine')}>
                {heirloom.condition || 'Pristine'} • {heirloom.durability ?? 100}% Durability
              </span>
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

        {/* Generational Perk Banner */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">Permanent Blessing</span>
            <span className="font-bold text-white text-sm">+{heirloom.bonusValue} {heirloom.bonusSkill.toUpperCase()}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-zinc-950 font-mono">
            Active Heirloom
          </span>
        </div>

        {/* Origin Lore Story */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block px-1">
            Origin Story & Lore
          </span>
          <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs text-zinc-300 leading-relaxed font-sans italic space-y-1">
            <p>"{heirloom.originStory || heirloom.description}"</p>
            {heirloom.engravedMotto && (
              <p className="text-amber-300 font-medium not-italic pt-1 border-t border-white/5 text-[11px]">
                Engraved Motto: "{heirloom.engravedMotto}"
              </p>
            )}
          </div>
        </div>

        {/* Lineage & History */}
        <div className="space-y-1 text-xs">
          <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block px-1">
            Generational Lineage ({heirloom.generation ? 'Gen ' + heirloom.generation : 'Gen 1'})
          </span>
          <div className="p-3 bg-black/30 border border-white/5 rounded-2xl space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Original Craftsman:</span>
              <span className="text-white font-medium">{heirloom.originalMaker || heirloom.passedFrom}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Age in Family:</span>
              <span className="font-mono text-white">
                {ageYears > 0 ? ageYears + ' Years (' + ageDays + ' Days)' : ageDays + ' Days Old'}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Current Bearer:</span>
              <span className="text-amber-300 font-bold">{player.name} (Founder)</span>
            </div>
            {heirloom.lineageHistory && heirloom.lineageHistory.length > 0 && (
              <div className="pt-1 border-t border-white/5 space-y-0.5">
                <span className="text-[9px] uppercase font-mono text-zinc-500 block">Lineage Bearers:</span>
                {heirloom.lineageHistory.map((step, idx) => (
                  <div key={idx} className="text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex gap-2">
          {onRepairRelic && (heirloom.durability ?? 100) < 100 && (
            <button
              type="button"
              onClick={() => onRepairRelic(heirloom.id)}
              className="flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Polish & Repair Relic</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

