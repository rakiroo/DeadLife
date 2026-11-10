import React, { useState } from 'react';
import { Survivor, CampMember, InventoryItem, FamilyHeirloom } from '../types/game';
import { Crown, Sparkles, X, Dices } from 'lucide-react';

interface Props {
  player: Survivor;
  inventory: InventoryItem[];
  campMembers: CampMember[];
  currentDay: number;
  initialSelectedItemId?: string;
  onConfirmInscribe: (heirloom: FamilyHeirloom, consumedItemId?: string) => void;
  onClose: () => void;
}

const NAME_SUGGESTIONS = [
  "Founder's Resolve", "The Dawnblade", "Elena's Promise", "Vance's Retribution",
  "Haven Pioneer Cleaver", "The Bloodline Compass", "The Altar Ring", "Mercy's Edge"
];

const MOTTO_SUGGESTIONS = [
  "Never surrender the light.",
  "Bloodline unbroken, courage unmoved.",
  "Live for tomorrow.",
  "In the dark, we are the fire.",
  "What was built shall stand."
];

export const InscribeRelicModal: React.FC<Props> = ({
  player,
  inventory,
  campMembers: _campMembers,
  currentDay,
  initialSelectedItemId,
  onConfirmInscribe,
  onClose
}) => {
  // Items eligible to be consecrated as a family relic
  const sourceItems = inventory.filter(i => 
    i.category === 'weapon' || i.category === 'tool' || i.id.includes('ring') || i.id.includes('compass') || i.origin === 'partner_gift' || i.origin === 'builder_forged'
  );

  const initialItem = sourceItems.find(i => i.id === initialSelectedItemId);

  const [selectedSourceId, setSelectedSourceId] = useState<string>(initialSelectedItemId || '');
  const [relicName, setRelicName] = useState<string>(() => {
    if (initialItem) {
      if (initialItem.origin === 'partner_gift' || initialItem.giftedBy) {
        return initialItem.name;
      }
      return (player.name.split(' ').slice(-1)[0] || 'Sanctuary') + "'s " + initialItem.name;
    }
    return "Founder's " + (player.name.split(' ').slice(-1)[0] || 'Sanctuary') + " Relic";
  });
  const [relicType, setRelicType] = useState<FamilyHeirloom['type']>(() => {
    if (initialItem) {
      if (initialItem.category === 'weapon') return 'weapon';
      if (initialItem.id.includes('ring')) return 'ring';
      if (initialItem.id.includes('watch')) return 'watch';
      if (initialItem.id.includes('locket')) return 'locket';
      return 'tool';
    }
    return 'weapon';
  });
  const [motto, setMotto] = useState<string>(MOTTO_SUGGESTIONS[0]);
  const [bonusSkill, setBonusSkill] = useState<FamilyHeirloom['bonusSkill']>(() => {
    if (initialItem) {
      if (initialItem.category === 'weapon') return 'combat';
      if (initialItem.origin === 'builder_forged') return 'crafting';
      if (initialItem.id.includes('compass')) return 'stealth';
      return 'fitness';
    }
    return 'combat';
  });

  const selectedItem = sourceItems.find(i => i.id === selectedSourceId);

  // Automatically derive Origin Chronicle based on how the item was obtained!
  // No manual radio buttons - crafting with own hands is the default when forging as the character.
  const getDerivedOrigin = () => {
    if (!selectedItem) {
      return {
        label: 'Crafted with Own Hands',
        badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        maker: player.name,
        story: 'Hand-crafted by ' + player.name + ' at the sanctuary forge. Its balance and edge were shaped by their own hands to defend the family bloodline.'
      };
    }

    if (selectedItem.origin === 'partner_gift' || selectedItem.giftedBy) {
      const partnerName = selectedItem.giftedBy || player.spouseName || player.datingTargetName || 'a beloved companion';
      return {
        label: 'Gift from Beloved Partner',
        badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        maker: partnerName,
        story: 'Presented to ' + player.name + ' by ' + partnerName + ' as a sacred pledge of love and mutual survival amidst the ruins.'
      };
    }

    if (selectedItem.origin === 'builder_forged' || selectedItem.forgedBy) {
      const builderName = selectedItem.forgedBy || 'a colony craftsman';
      return {
        label: 'Forged by Colony Builder',
        badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        maker: builderName,
        story: 'Carefully shaped by colony builder ' + builderName + ' from structural steel and dedicated as a symbol of the haven\'s growing strength.'
      };
    }

    // Default for Day 0 or unmodified wasteland gear:
    // "For Day 0 heirloom i think it will be weapons character have without modification (not made by hands anymore) that player turned to heirloom."
    return {
      label: 'Day 0 Veteran Heirloom',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      maker: 'Pre-Outbreak Survivor Artifact',
      story: 'Carried through the initial panic of Day 0; survived multiple close horde encounters without modification and preserved as a talisman of resilience.'
    };
  };

  const derivedOrigin = getDerivedOrigin();

  const handleRandomName = () => {
    const random = NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)];
    setRelicName(random);
  };

  const handleRandomMotto = () => {
    const random = MOTTO_SUGGESTIONS[Math.floor(Math.random() * MOTTO_SUGGESTIONS.length)];
    setMotto(random);
  };

  const handleSourceChange = (itemId: string) => {
    setSelectedSourceId(itemId);
    const item = sourceItems.find(i => i.id === itemId);
    if (item) {
      if (item.category === 'weapon') {
        setRelicType('weapon');
        setRelicName(item.origin === 'partner_gift' ? item.name : (player.name.split(' ').slice(-1)[0] + "'s " + item.name));
        setBonusSkill('combat');
      } else if (item.id.includes('compass')) {
        setRelicType('tool');
        setBonusSkill('stealth');
        setRelicName("Pioneer's Weathered Compass");
      } else if (item.id.includes('ring')) {
        setRelicType('ring');
        setBonusSkill('fitness');
        setRelicName(item.name);
      } else if (item.origin === 'builder_forged') {
        setRelicType('tool');
        setBonusSkill('crafting');
        setRelicName(item.name);
      } else {
        setRelicType('tool');
      }
    } else {
      setRelicType('weapon');
      setBonusSkill('combat');
      setRelicName("Founder's " + (player.name.split(' ').slice(-1)[0] || 'Sanctuary') + " Relic");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = relicName.trim() || "Founder's Dedicated Relic";
    const gen = player.generation || 1;

    const newHeirloom: FamilyHeirloom = {
      id: 'heirloom_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: finalName,
      type: relicType,
      bonusSkill,
      bonusValue: 1,
      description: 'Generational heirloom dedicated by founder ' + player.name + '.',
      passedFrom: player.name,
      originalMaker: derivedOrigin.maker,
      originStory: derivedOrigin.story,
      engravedMotto: motto.trim(),
      generation: gen,
      durability: 100,
      condition: 'Pristine',
      forgedDay: currentDay,
      lineageHistory: ['Gen ' + gen + ': ' + player.name + ' (Inscribed on Day ' + currentDay + ')']
    };

    onConfirmInscribe(newHeirloom, selectedSourceId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                Sanctuary Inscription Forge
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">Inscribe Family Relic</h2>
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
          Consecrate a weapon, tool, or talisman into an eternal family heirloom. It will record your lineage history, origin lore, and pass down permanent skill bonuses to your descendants.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1 text-xs">
          {/* Source Item (Optional) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
              Consecrate from Gear (Optional)
            </label>
            <select
              value={selectedSourceId}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
            >
              <option value="">Forge New Relic (From Raw Materials)</option>
              {sourceItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} {item.origin === 'partner_gift' ? '������ (Partner Gift)' : item.origin === 'builder_forged' ? '������ (Colony Forged)' : '������️ (Day 0 Gear)'}
                </option>
              ))}
            </select>
          </div>

          {/* Relic Name */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold">
                Relic Name
              </label>
              <button
                type="button"
                onClick={handleRandomName}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
              >
                <Dices className="w-3 h-3" />
                <span>Suggest</span>
              </button>
            </div>
            <input
              type="text"
              value={relicName}
              onChange={(e) => setRelicName(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Relic Type & Bonus Skill Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block mb-1 pl-1">
                Artifact Type
              </label>
              <select
                value={relicType}
                onChange={(e) => setRelicType(e.target.value as any)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="weapon">Weapon</option>
                <option value="ring">Jewelry / Ring</option>
                <option value="locket">Locket</option>
                <option value="watch">Pocket Watch</option>
                <option value="tool">Specialized Tool</option>
                <option value="medallion">Medallion</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block mb-1 pl-1">
                Stat Blessing
              </label>
              <select
                value={bonusSkill}
                onChange={(e) => setBonusSkill(e.target.value as any)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="combat">+1 Combat</option>
                <option value="medical">+1 Medical</option>
                <option value="crafting">+1 Crafting</option>
                <option value="stealth">+1 Stealth</option>
                <option value="fitness">+1 Fitness</option>
              </select>
            </div>
          </div>

          {/* Origin Chronicle - Automatic Lore Card (NO CHOICE BUTTONS!) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold block pl-1">
              Origin Chronicle
            </label>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${derivedOrigin.badgeColor}`}>
                  {derivedOrigin.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono ml-auto">
                  {selectedItem ? 'From Selected Gear' : 'Forged by Character'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 italic leading-snug pt-0.5">
                "{derivedOrigin.story}"
              </p>
            </div>
          </div>

          {/* Engraved Motto */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold">
                Engraved Inscription Motto
              </label>
              <button
                type="button"
                onClick={handleRandomMotto}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
              >
                <Dices className="w-3 h-3" />
                <span>Suggest</span>
              </button>
            </div>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              maxLength={60}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white italic focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>Inscribe & Dedicate Relic (+1 {bonusSkill.toUpperCase()})</span>
          </button>
        </form>
      </div>
    </div>
  );
};
