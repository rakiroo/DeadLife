import React from 'react';
import { CemeteryRecord } from '../types/game';
import { Skull, Award, Heart, Baby, Home, Calendar, Shield, Swords, Crosshair, X, BookOpen, MapPin } from 'lucide-react';

interface Props {
  record: CemeteryRecord;
  onClose: () => void;
}

export const BiographyModal: React.FC<Props> = ({ record, onClose }) => {
  const bioText = record.biography || (
    record.name + ' began their journey in the early hours of the outbreak as a ' + record.profession.toLowerCase() + '. Against overwhelming odds, they fought for ' + record.daysSurvived + ' days in the ruins. ' +
    (record.districtName ? 'They struggled through the sector of ' + record.districtName + '. ' : '') +
    (record.mutationStrainName ? 'The world was terrorized by ' + record.mutationStrainName + '. ' : '') +
    (record.equippedWeaponName ? 'They defended themselves with a ' + record.equippedWeaponName + '. ' : '') +
    (record.baseName ? 'They founded and fortified "' + record.baseName + '", providing sanctuary in a broken world. ' : '') +
    (record.spouseName ? 'They married ' + record.spouseName + ' and built a family together. ' : '') +
    (record.childrenCount && record.childrenCount > 0 ? 'They raised ' + record.childrenCount + (record.childrenCount === 1 ? ' heir' : ' heirs') + ' to inherit their skills. ' : '') +
    (record.founderCreedTitle ? 'They followed the dynasty creed of "' + record.founderCreedTitle + '". ' : '') +
    'They neutralized ' + record.stats.zombiesEliminated + ' infected across ' + record.stats.scavengeRuns + ' expeditions, and guided ' + record.stats.peopleSaved + ' survivors to safety. In the end, they ' + record.deathCause + '. Generation ' + (record.generation || 1) + ' rests here. Their memory is eternal in the Memorial Hall of the Fallen.'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">
                Survivor Chronicle
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">{record.name}</h2>
              <p className="text-xs text-zinc-400">
                {record.profession} • Age {record.age} • Gen {record.generation || 1}
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

        {/* Ribbon & Cause of Death */}
        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Award className="w-4 h-4" />
              <span>{record.ribbon}</span>
            </span>
            <span className="font-mono text-zinc-500 text-[11px]">{record.date}</span>
          </div>

          <div className="p-2.5 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300 leading-relaxed font-sans">
            {record.name} {record.deathCause}.
          </div>
        </div>


        {/* Earned Lifetime Achievement Badges */}
        {record.secondaryRibbons && record.secondaryRibbons.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1 px-1">
              <Award className="w-3.5 h-3.5" /> Lifetime Achievement Ribbons ({record.secondaryRibbons.length})
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {record.secondaryRibbons.map((a, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px]">
                  <span className="font-bold text-amber-300 block">★ {a.title}</span>
                  <p className="text-zinc-400 text-[9px] leading-snug mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* World Context Badges */}
        {(record.districtName || record.mutationStrainName || record.mysteryTitle || record.equippedWeaponName || record.founderCreedTitle) && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {record.districtName && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-zinc-300 bg-white/5 border border-white/10">
                📍 {record.districtName}
              </span>
            )}
            {record.mutationStrainName && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-rose-300 bg-rose-500/10 border border-rose-500/20">
                ☣️ {record.mutationStrainName}
              </span>
            )}
            {record.mysteryTitle && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">
                📌 {record.mysteryTitle} {record.mysterySolved ? '✓ Solved' : ''}
              </span>
            )}
            {record.equippedWeaponName && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                ⚔️ {record.equippedWeaponName}
              </span>
            )}
            {record.founderCreedTitle && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                📜 {record.founderCreedTitle}
              </span>
            )}
          </div>
        )}

        {/* Life Memoir & Story Narrative */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold flex items-center gap-1 px-1">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Life Memoir & World Chronicle
          </span>
          <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs text-zinc-300 leading-relaxed italic font-sans space-y-2">
            <p>{bioText}</p>
          </div>
        </div>

        {/* Lifetime Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          <div className="p-2 bg-black/30 border border-white/5 rounded-xl">
            <span className="text-[9px] text-zinc-500 uppercase font-mono block">Days Lived</span>
            <span className="font-mono text-xs font-bold text-white">{record.daysSurvived}</span>
          </div>

          <div className="p-2 bg-black/30 border border-white/5 rounded-xl">
            <span className="text-[9px] text-zinc-500 uppercase font-mono block">Kills</span>
            <span className="font-mono text-xs font-bold text-rose-400">{record.stats.zombiesEliminated}</span>
          </div>

          <div className="p-2 bg-black/30 border border-white/5 rounded-xl">
            <span className="text-[9px] text-zinc-500 uppercase font-mono block">Saved</span>
            <span className="font-mono text-xs font-bold text-emerald-400">{record.stats.peopleSaved}</span>
          </div>
        </div>

        {/* Dynasty Family Details */}
        {(record.spouseName || (record.childrenCount && record.childrenCount > 0) || record.baseName) && (
          <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-around text-[10px] font-mono text-zinc-400 flex-wrap gap-1">
            {record.spouseName && (
              <span className="flex items-center gap-1 text-rose-300">
                <Heart className="w-3 h-3 text-rose-400" /> {record.spouseName}
              </span>
            )}
            {record.childrenCount && record.childrenCount > 0 && (
              <span className="flex items-center gap-1 text-amber-300">
                <Baby className="w-3 h-3 text-amber-400" /> {record.childrenCount} Heir{record.childrenCount > 1 ? 's' : ''}
              </span>
            )}
            {record.baseName && (
              <span className="flex items-center gap-1 text-emerald-300 truncate max-w-[120px]">
                <Home className="w-3 h-3 text-emerald-400" /> {record.baseName}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all text-center"
        >
          Close Memorial
        </button>
      </div>
    </div>
  );
};
