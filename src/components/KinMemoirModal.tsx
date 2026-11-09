import React from 'react';
import { SurvivorBackstory } from '../types/game';
import { Heart, Skull, Shield, HeartPulse, Hammer, EyeOff, Activity, X, Sparkles, Compass } from 'lucide-react';

interface Props {
  backstory: SurvivorBackstory;
  playerName: string;
  onClose: () => void;
}

export const KinMemoirModal: React.FC<Props> = ({ backstory, playerName, onClose }) => {
  const isDeceased = backstory.status === 'resolved' && (backstory.outcome === 'deceased' || backstory.outcome === 'mercy');
  const gender = backstory.targetGender || (
    backstory.relation.includes('Mother') || backstory.relation.includes('Sister') || backstory.relation.includes('Wife') || backstory.relation.includes('Daughter') ? 'female' : 'male'
  );
  const age = backstory.targetAge || 24;
  const skills = backstory.targetSkills || { combat: 5, medical: 5, crafting: 5, stealth: 5, fitness: 5 };
  const keepsake = backstory.targetKeepsake || 'Engraved Silver Pocket Compass';
  
  // Default dynamic memoir flashback if none set
  const memoir = backstory.targetMemoirFlashback || (
    backstory.relation.includes('Brother')
      ? `I still remember the summer we rebuilt the old engine together in the garage, grease on our hands and laughter filling the air. When the emergency sirens began wailing across the city on Day 0, ${backstory.targetName} shoved me toward the evacuation line and shouted that he would rendezvous with me at the sanctuary. He kept that promise until his final breath.`
      : backstory.relation.includes('Sister')
      ? `We used to stay up late sharing headphone cords, talking about the places we would see once the world opened up. When the city lockdown sirens began blaring, ${backstory.targetName} gave me her knitted scarf and made me swear I would survive. Her memory is the light that keeps me going.`
      : backstory.relation.includes('Father')
      ? `Dad always possessed quiet strength and steady, calloused hands. He taught me to stand firm against every hardship and never abandon our people. His final words to me before the radio static took over were to stay strong and lead with honor. I carry his discipline with me every single day.`
      : backstory.relation.includes('Mother')
      ? `Mom worked tireless shifts so our home would be warm and safe. Even when the sirens echoed down the hospital avenues, her voicemail pleaded with me to stay hidden until she reached me. I hear her gentle voice whenever the silence in the haven grows heavy.`
      : backstory.relation.includes('Spouse') || backstory.relation.includes('Wife') || backstory.relation.includes('Husband')
      ? `We exchanged vows on a quiet afternoon, swearing to weather whatever storm life brought us. When the bridges downtown collapsed, we agreed on an emergency rendezvous plan. Finding their ring and honoring their memory gave me peace, and their love remains my steadfast anchor.`
      : `We promised each other we would survive whatever came next. Remembering ${backstory.targetName}'s voice gives me the resolve to keep standing when the days grow dark.`
  );

  const causeOfDeath = backstory.targetCauseOfDeath || backstory.outcomeSummary || 'Overrun during an evacuation standoff; succumbed to infected bite wounds after protecting civilians.';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans select-none">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative my-auto text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl border ${
              isDeceased 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              {isDeceased ? <Skull className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {backstory.targetName}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  gender === 'female' 
                    ? 'bg-pink-500/15 text-pink-300 border-pink-500/30' 
                    : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                }`}>
                  {gender === 'female' ? '♀ Female' : '♂ Male'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {backstory.relation} • Age {age}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between text-xs bg-white/[0.03] p-2.5 rounded-2xl border border-white/5 font-mono">
          <span className="text-zinc-400">Fate Status:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            isDeceased 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
              : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
          }`}>
            {isDeceased ? '🪦 Deceased' : '🔍 Missing in Ruins'}
          </span>
        </div>

        {/* Cause of Death (if deceased) */}
        {isDeceased && (
          <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-xs">
            <span className="text-[10px] font-mono text-rose-300 uppercase tracking-wider font-bold flex items-center gap-1">
              <Skull className="w-3 h-3 text-rose-400" /> Circumstance of Death
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              {causeOfDeath}
            </p>
          </div>
        )}

        {/* Relationship Memoir & Flashback */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
          <span className="text-[10px] font-mono text-amber-300/90 uppercase tracking-wider font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Memory & Flashback
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed italic">
            "{memoir}"
          </p>
        </div>

        {/* Memento / Keepsake */}
        <div className="flex items-center justify-between text-xs bg-white/[0.03] p-2.5 rounded-2xl border border-white/5">
          <span className="text-zinc-400 flex items-center gap-1 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Keepsake:
          </span>
          <span className="font-medium text-white text-[11px] truncate max-w-[180px]">
            {keepsake}
          </span>
        </div>

        {/* Known Skills */}
        <div className="space-y-1.5 pt-0.5">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block px-1">
            Known Skills & Prowess
          </span>
          <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px]">
            <div className="bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[9px] flex items-center justify-center gap-0.5"><Shield className="w-2.5 h-2.5 text-rose-400" /> Cbt</span>
              <span className="font-bold text-rose-400">{skills.combat}</span>
            </div>
            <div className="bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[9px] flex items-center justify-center gap-0.5"><HeartPulse className="w-2.5 h-2.5 text-cyan-400" /> Med</span>
              <span className="font-bold text-cyan-400">{skills.medical}</span>
            </div>
            <div className="bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[9px] flex items-center justify-center gap-0.5"><Hammer className="w-2.5 h-2.5 text-amber-400" /> Crf</span>
              <span className="font-bold text-amber-400">{skills.crafting}</span>
            </div>
            <div className="bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[9px] flex items-center justify-center gap-0.5"><EyeOff className="w-2.5 h-2.5 text-indigo-400" /> Stl</span>
              <span className="font-bold text-indigo-400">{skills.stealth}</span>
            </div>
            <div className="bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[9px] flex items-center justify-center gap-0.5"><Activity className="w-2.5 h-2.5 text-emerald-400" /> Fit</span>
              <span className="font-bold text-emerald-400">{skills.fitness}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs active:scale-98 transition-all"
        >
          Close Memoir
        </button>
      </div>
    </div>
  );
};
