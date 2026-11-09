import React, { useState } from 'react';
import { Survivor, CampMember, CampRoom, WillAndTestament, FamilyHeirloom } from '../types/game';
import { Scroll, Crown, Shield, Swords, Hammer, Compass, X, Check, Heart, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  player: Survivor;
  campMembers: CampMember[];
  rooms: CampRoom[];
  currentDay: number;
  onSaveWill: (will: WillAndTestament) => void;
  onClose: () => void;
}

export const WillAndTestamentModal: React.FC<Props> = ({
  player,
  campMembers,
  rooms,
  currentDay,
  onSaveWill,
  onClose
}) => {
  // Potential heirs list: children, spouse, and companions
  const childrenHeirs = (player.children || []).map(c => ({
    id: c.id,
    name: c.name,
    relation: c.age >= 16 ? 'Adult Heir' : c.age >= 10 ? 'Adolescent Heir' : 'Child Heir',
    age: c.age
  }));

  const spouseHeir = player.spouseId ? [{
    id: player.spouseId,
    name: player.spouseName || 'Spouse',
    relation: 'Spouse & Partner',
    age: player.age
  }] : [];

  const companionHeirs = campMembers.filter(m => !m.isChild && m.id !== player.spouseId).map(m => ({
    id: m.id,
    name: m.name,
    relation: m.profession + ' (Companion)',
    age: m.age
  }));

  const allPossibleHeirs = [...childrenHeirs, ...spouseHeir, ...companionHeirs];

  const existingWill = player.will;

  const [selectedHeirId, setSelectedHeirId] = useState<string>(
    existingWill?.designatedHeirId || allPossibleHeirs[0]?.id || ''
  );

  const [selectedCreed, setSelectedCreed] = useState<'endure' | 'protect' | 'build' | 'adapt'>(
    existingWill?.founderCreed || 'protect'
  );

  const [selectedHeirloomId, setSelectedHeirloomId] = useState<string>(
    existingWill?.bequeathedHeirloomId || (player.heirlooms && player.heirlooms[0]?.id) || ''
  );

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    existingWill?.inheritedRoomId || player.roomId || (rooms[0]?.id || '')
  );

  const [message, setMessage] = useState<string>(
    existingWill?.personalMessage || "Keep the lanterns burning and never let our haven fall. Our legacy will survive the ruins."
  );

  const CREEDS: { id: 'endure' | 'protect' | 'build' | 'adapt'; title: string; perk: string; icon: React.ReactNode }[] = [
    {
      id: 'protect',
      title: 'Shield the Bloodline',
      perk: '+20 Sanity & +15 Colony Trust for the heir upon succession',
      icon: <Shield className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'endure',
      title: 'Endure Through Might',
      perk: '+2 Combat & +2 Fitness permanent attribute bonus to the heir',
      icon: <Swords className="w-4 h-4 text-rose-400" />
    },
    {
      id: 'build',
      title: 'Build for Tomorrow',
      perk: '+2 Crafting & +25% Barricade fortification efficiency',
      icon: <Hammer className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'adapt',
      title: 'Shadows & Swiftness',
      perk: '+2 Stealth & +25% Scavenging resource hauls',
      icon: <Compass className="w-4 h-4 text-indigo-400" />
    }
  ];

  const chosenHeir = allPossibleHeirs.find(h => h.id === selectedHeirId);
  const chosenCreedObj = CREEDS.find(c => c.id === selectedCreed);
  const chosenHeirloom = (player.heirlooms || []).find(h => h.id === selectedHeirloomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const will: WillAndTestament = {
      designatedHeirId: selectedHeirId,
      designatedHeirName: chosenHeir ? chosenHeir.name : 'Unknown Heir',
      bequeathedHeirloomId: selectedHeirloomId || undefined,
      bequeathedHeirloomName: chosenHeirloom ? chosenHeirloom.name : undefined,
      inheritedRoomId: selectedRoomId || undefined,
      founderCreed: selectedCreed,
      creedTitle: chosenCreedObj?.title || 'Dynasty Creed',
      creedPerkDescription: chosenCreedObj?.perk || '',
      personalMessage: message.trim(),
      lastUpdatedDay: currentDay
    };
    onSaveWill(will);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Colony Founder's Will
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">Last Will & Testament</h2>
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

        <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded-2xl border border-white/5">
          In a world where any day may be your last, formalize your succession wishes. Designate your primary heir, pass down family relics, and bestow a dynasty creed that permanently empowers your successor.
        </p>

        {allPossibleHeirs.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs space-y-1">
            <Crown className="w-6 h-6 text-zinc-600 mx-auto" />
            <p className="font-semibold text-zinc-400">No Potential Heirs in Colony Yet</p>
            <p className="text-[10px] text-zinc-500">
              Marry, raise children, or welcome trusted companions into your haven to designate a successor.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
            {/* 1. Primary Successor Picker */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
                1. Designate Primary Successor
              </label>
              <select
                value={selectedHeirId}
                onChange={(e) => setSelectedHeirId(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                {allPossibleHeirs.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.relation}, Age {h.age})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Founder Creed Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
                2. Dynasty Creed & Heirloom Perk
              </label>
              <div className="space-y-1.5">
                {CREEDS.map(c => {
                  const isSelected = selectedCreed === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCreed(c.id)}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-black/40 shrink-0 mt-0.5">
                        {c.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{c.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                          {c.perk}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Bequeath Heirloom */}
            {player.heirlooms && player.heirlooms.length > 0 && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
                  3. Bequeath Family Relic to Heir
                </label>
                <select
                  value={selectedHeirloomId}
                  onChange={(e) => setSelectedHeirloomId(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="">None / Keep in Family Cache</option>
                  {player.heirlooms.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} (+{h.bonusValue} {h.bonusSkill.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Inherited Quarters */}
            {rooms.length > 0 && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
                  4. Inherited Quarters (Estate Cabin)
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Comfort {r.comfort}%)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 5. Personal Message / Words of Wisdom */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
                5. Founder's Words of Wisdom to Successor
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                maxLength={140}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Seal Founder's Will & Testament</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

