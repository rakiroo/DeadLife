import React, { useState, useMemo } from 'react';
import { Career, Trait, Survivor } from '../types/game';
import { CAREERS } from '../data/careers';
import { NEGATIVE_TRAITS, POSITIVE_TRAITS } from '../data/traits';
import { ArrowLeft, Dices, Shield, HeartPulse, Hammer, EyeOff, Activity, AlertCircle, Check, Info } from 'lucide-react';

const RANDOM_NAMES = [
  'Marcus Vance', 'Elena Chen', 'David Kowalski', 'Sarah Miller', 
  'Leon Sterling', 'Maya Diaz', 'Thomas O\'Connor', 'Hannah Reyes',
  'Grace Blackwood', 'Claire Patel', 'Julian Walker', 'Robert Hayes',
  'Zoe Washington', 'Arthur Pendelton', 'Siddharth Rao', 'Chloe Bennett'
];

interface Props {
  onBack: () => void;
  onStartGame: (survivor: Survivor, career: Career) => void;
}

export const CharacterCreator: React.FC<Props> = ({ onBack, onStartGame }) => {
  // Identity state
  const [name, setName] = useState(RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]);
  const [age, setAge] = useState<number>(28);
  const [selectedCareer, setSelectedCareer] = useState<Career>(CAREERS[0]);

  // Selected Traits
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);

  // Manual Stat Offsets (positive or negative relative to career baseline)
  // Player can decrease stats to gain points or increase stats to spend points!
  const [statOffsets, setStatOffsets] = useState({
    combat: 0,
    medical: 0,
    crafting: 0,
    stealth: 0,
    fitness: 0
  });

  // Crusader Kings style Age modifiers:
  // Younger = More unallocated customizer points, higher natural fitness, but lower veteran skills
  // Older = Fewer customizer points, but inherent life experience / higher master stats and lower fitness
  const ageProfile = useMemo(() => {
    if (age <= 22) {
      return {
        label: 'Youth (Raw Potential)',
        bonusPoints: 10,
        statMods: { fitness: 2, crafting: -1, medical: -1, combat: 0, stealth: 1 },
        flavor: 'Peak agility & maximum customization points (+10 pts), but lacks trade experience.'
      };
    } else if (age <= 34) {
      return {
        label: 'Young Adult (Prime)',
        bonusPoints: 6,
        statMods: { fitness: 1, crafting: 0, medical: 0, combat: 0, stealth: 0 },
        flavor: 'Balanced stamina, quick reflexes, and strong point budget (+6 pts).'
      };
    } else if (age <= 48) {
      return {
        label: 'Experienced (Mid-Life)',
        bonusPoints: 3,
        statMods: { fitness: 0, crafting: 1, medical: 1, combat: 0, stealth: 0 },
        flavor: 'Established trade skills (+1 Craft/Med), steady mind (+3 pts).'
      };
    } else if (age <= 60) {
      return {
        label: 'Seasoned Veteran',
        bonusPoints: 0,
        statMods: { fitness: -1, crafting: 2, medical: 1, combat: 1, stealth: 0 },
        flavor: 'Decades of real-world expertise (+2 Craft, +1 Combat), but declining stamina (+0 pts).'
      };
    } else {
      return {
        label: 'Elder / Senior',
        bonusPoints: -4,
        statMods: { fitness: -2, crafting: 3, medical: 2, combat: 0, stealth: 1 },
        flavor: 'Master life wisdom (+3 Craft, +2 Med), low customization budget (-4 pts), frail body.'
      };
    }
  }, [age]);

  // Base career points (e.g. Office Worker +4)
  const careerBonus = selectedCareer.bonusPoints || 0;

  // Trait point balance (positive traits cost negative, negative flaws grant positive)
  const traitPoints = selectedTraits.reduce((sum, t) => sum + t.cost, 0);

  // Points spent on stat modifications:
  // If player raises stat by +1, cost is 1. If player lowers stat by -1, they refund 1 point!
  const statPointsSpent = Object.values(statOffsets).reduce((sum, offset) => sum + offset, 0);

  // Net Available Points
  const availablePoints = ageProfile.bonusPoints + careerBonus + traitPoints - statPointsSpent;

  // Compute final effective stats
  const effectiveStats = {
    combat: Math.max(1, Math.min(10, selectedCareer.stats.combat + ageProfile.statMods.combat + statOffsets.combat)),
    medical: Math.max(1, Math.min(10, selectedCareer.stats.medical + ageProfile.statMods.medical + statOffsets.medical)),
    crafting: Math.max(1, Math.min(10, selectedCareer.stats.crafting + ageProfile.statMods.crafting + statOffsets.crafting)),
    stealth: Math.max(1, Math.min(10, selectedCareer.stats.stealth + ageProfile.statMods.stealth + statOffsets.stealth)),
    fitness: Math.max(1, Math.min(10, selectedCareer.stats.fitness + ageProfile.statMods.fitness + statOffsets.fitness))
  };

  // Toggle trait
  const toggleTrait = (trait: Trait) => {
    if (selectedTraits.some(t => t.id === trait.id)) {
      setSelectedTraits(prev => prev.filter(t => t.id !== trait.id));
    } else {
      setSelectedTraits(prev => [...prev, trait]);
    }
  };

  // Modify stat offset (increment costs points, decrement refunds points)
  const modifyStat = (stat: keyof typeof statOffsets, delta: number) => {
    // If incrementing and no points left, block
    if (delta > 0 && availablePoints <= 0) return;
    
    // Check total stat bounds (1 to 10)
    const currentTotal = effectiveStats[stat];
    if (delta < 0 && currentTotal <= 1) return;
    if (delta > 0 && currentTotal >= 10) return;

    setStatOffsets(prev => ({
      ...prev,
      [stat]: prev[stat] + delta
    }));
  };

  // Change Career -> preserves custom offsets or resets
  const handleSelectCareer = (career: Career) => {
    setSelectedCareer(career);
  };

  const handleRandomizeName = () => {
    setName(RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]);
  };

  const canStart = availablePoints >= 0 && name.trim().length > 0;

  const handleBegin = () => {
    if (!canStart) return;

    const ageGroup = age <= 24 ? 'Youth' : age <= 39 ? 'Prime' : age <= 54 ? 'Middle-Aged' : 'Senior';

    const newSurvivor: Survivor = {
      name: name.trim(),
      age,
      ageGroup,
      profession: selectedCareer.title,
      bio: selectedCareer.description,
      health: 100,
      sanity: 85,
      hunger: 90,
      thirst: 90,
      infectionRisk: 0,
      combatSkill: effectiveStats.combat,
      medicalSkill: effectiveStats.medical,
      craftingSkill: effectiveStats.crafting,
      stealthSkill: effectiveStats.stealth,
      fitnessSkill: effectiveStats.fitness,
      traits: selectedTraits,
    statusEffects: [],
    isDead: false
  };

  onStartGame(newSurvivor, selectedCareer);
};

  return (
    <div className="h-screen max-h-screen flex flex-col bg-zinc-950 text-zinc-100 max-w-md mx-auto w-full select-none overflow-hidden">
      {/* 1. STICKY TOP HEADER */}
      <header className="shrink-0 sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95"
          title="Back to Title"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">Survivor Designer</span>
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 shadow-sm ${
          availablePoints >= 0 
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60' 
            : 'bg-rose-950/90 text-rose-300 border-rose-700/60 animate-pulse'
        }`}>
          <span>Points:</span>
          <span>{availablePoints >= 0 ? `+${availablePoints}` : availablePoints}</span>
        </div>
      </header>

      {/* 2. SCROLLABLE MIDDLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 overscroll-contain">
        {/* Points Allocation Status Overview Banner */}
        <section className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-bold block">
                Survivor Point Pool
              </span>
              <span className="text-xs text-zinc-200 font-semibold">
                Points to Allocate: <span className="font-mono text-sm font-bold text-emerald-400">{availablePoints >= 0 ? "+" + availablePoints : availablePoints}</span>
              </span>
            </div>
            <div className={"px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm " + (availablePoints > 0 ? "bg-emerald-950/90 text-emerald-300 border-emerald-600/70 shadow-emerald-950/40" : availablePoints === 0 ? "bg-zinc-800 text-zinc-300 border-zinc-700" : "bg-rose-950/90 text-rose-300 border-rose-600/80 animate-pulse")}>
              <span>Budget:</span>
              <span>{availablePoints >= 0 ? "+" + availablePoints : availablePoints} pts</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-800/80">
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">Age: {ageProfile.bonusPoints >= 0 ? "+" + ageProfile.bonusPoints : ageProfile.bonusPoints}</span>
            {careerBonus > 0 && <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">Career: +{careerBonus}</span>}
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">Flaws: +{selectedTraits.filter(t => t.type === "negative").reduce((s, t) => s + t.cost, 0)}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">Advantages: {selectedTraits.filter(t => t.type === "positive").reduce((s, t) => s + t.cost, 0)}</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">Stats Spent: {statPointsSpent > 0 ? "-" + statPointsSpent : statPointsSpent < 0 ? "+" + Math.abs(statPointsSpent) : "0"}</span>
          </div>
        </section>
        {/* Section 1: Name & Interactive Age Slider */}
        <section className="space-y-3.5 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
          <label className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-semibold block">
            1. Identity & Age (Crusader Kings Scale)
          </label>

          {/* Name Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter survivor name..."
              className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-zinc-100 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleRandomizeName}
              title="Randomize Name"
              className="px-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all flex items-center justify-center"
            >
              <Dices className="w-5 h-5" />
            </button>
          </div>

          {/* Age Slider & Stepper */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                Age: <span className="font-mono text-base font-bold text-rose-400">{age}</span> years old
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {ageProfile.label}
              </span>
            </div>

            <input
              type="range"
              min="16"
              max="75"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="w-full accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>16 (Youth: +10 pts)</span>
              <span>45 (Mid: +3 pts)</span>
              <span>75 (Elder: -4 pts)</span>
            </div>

            <p className="text-[11px] text-zinc-400 bg-zinc-950/70 p-2 rounded-lg border border-zinc-800/80 font-sans leading-relaxed">
              💡 <span className="font-medium text-zinc-300">{ageProfile.flavor}</span>
            </p>
          </div>
        </section>

        {/* Section 2: Expanded Careers (Auto-Sets Stats) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
              2. Pre-Apocalypse Trade ({CAREERS.length} Careers)
            </label>
            <span className="text-[10px] text-zinc-500">Sets baseline stats</span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
            {CAREERS.map((career) => {
              const isSelected = selectedCareer.id === career.id;
              return (
                <button
                  key={career.id}
                  onClick={() => handleSelectCareer(career)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-rose-950/25 border-rose-500 text-zinc-100 shadow-md ring-1 ring-rose-500/50'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  <span className="text-2xl shrink-0 mt-0.5">{career.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                        {career.title}
                      </span>
                      {career.bonusPoints && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          +{career.bonusPoints} Trait Pts
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 font-sans leading-tight">
                      {career.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Fully Modifiable Core Stats */}
        <section className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[11px] uppercase font-mono tracking-wider text-zinc-200 font-bold block flex items-center gap-2">
                <span>3. Core Attributes</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono font-bold">
                  Points to Allocate: {availablePoints >= 0 ? "+" + availablePoints : availablePoints}
                </span>
              </label>
              <p className="text-[10px] text-zinc-500">Lower stats to gain points, raise stats to spend points</p>
            </div>
            <button
              onClick={() => setStatOffsets({ combat: 0, medical: 0, crafting: 0, stealth: 0, fitness: 0 })}
              className="text-[10px] font-mono text-zinc-400 hover:text-zinc-200 underline"
            >
              Reset Offsets
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Combat */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
              <div>
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <Shield className="w-3.5 h-3.5 text-rose-500" /> Combat & Weapons
                </span>
                <span className="text-[10px] text-zinc-500">Base {selectedCareer.stats.combat} + Age {ageProfile.statMods.combat}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-zinc-100 w-5 text-center">{effectiveStats.combat}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => modifyStat('combat', -1)}
                    disabled={effectiveStats.combat <= 1}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Lower stat to refund 1 trait point"
                  >-</button>
                  <button
                    onClick={() => modifyStat('combat', 1)}
                    disabled={availablePoints <= 0 || effectiveStats.combat >= 10}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Raise stat by spending 1 trait point"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Medical */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
              <div>
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> Medical & Triage
                </span>
                <span className="text-[10px] text-zinc-500">Base {selectedCareer.stats.medical} + Age {ageProfile.statMods.medical}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-zinc-100 w-5 text-center">{effectiveStats.medical}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => modifyStat('medical', -1)}
                    disabled={effectiveStats.medical <= 1}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Lower stat to refund 1 trait point"
                  >-</button>
                  <button
                    onClick={() => modifyStat('medical', 1)}
                    disabled={availablePoints <= 0 || effectiveStats.medical >= 10}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Raise stat by spending 1 trait point"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Crafting */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
              <div>
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <Hammer className="w-3.5 h-3.5 text-amber-400" /> Crafting & Mechanics
                </span>
                <span className="text-[10px] text-zinc-500">Base {selectedCareer.stats.crafting} + Age {ageProfile.statMods.crafting}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-zinc-100 w-5 text-center">{effectiveStats.crafting}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => modifyStat('crafting', -1)}
                    disabled={effectiveStats.crafting <= 1}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Lower stat to refund 1 trait point"
                  >-</button>
                  <button
                    onClick={() => modifyStat('crafting', 1)}
                    disabled={availablePoints <= 0 || effectiveStats.crafting >= 10}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Raise stat by spending 1 trait point"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Stealth */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
              <div>
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <EyeOff className="w-3.5 h-3.5 text-indigo-400" /> Stealth & Awareness
                </span>
                <span className="text-[10px] text-zinc-500">Base {selectedCareer.stats.stealth} + Age {ageProfile.statMods.stealth}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-zinc-100 w-5 text-center">{effectiveStats.stealth}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => modifyStat('stealth', -1)}
                    disabled={effectiveStats.stealth <= 1}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Lower stat to refund 1 trait point"
                  >-</button>
                  <button
                    onClick={() => modifyStat('stealth', 1)}
                    disabled={availablePoints <= 0 || effectiveStats.stealth >= 10}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Raise stat by spending 1 trait point"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Fitness */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/70">
              <div>
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Fitness & Stamina
                </span>
                <span className="text-[10px] text-zinc-500">Base {selectedCareer.stats.fitness} + Age {ageProfile.statMods.fitness}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-zinc-100 w-5 text-center">{effectiveStats.fitness}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => modifyStat('fitness', -1)}
                    disabled={effectiveStats.fitness <= 1}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Lower stat to refund 1 trait point"
                  >-</button>
                  <button
                    onClick={() => modifyStat('fitness', 1)}
                    disabled={availablePoints <= 0 || effectiveStats.fitness >= 10}
                    className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-sm active:scale-95"
                    title="Raise stat by spending 1 trait point"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Negative Flaws & Medical Conditions (GIVES POINTS) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase font-mono tracking-wider text-rose-400 font-semibold flex items-center gap-1">
              🔴 Flaws & Conditions (Grants Points)
            </label>
            <span className="text-[10px] text-zinc-500">Equip to gain +points</span>
          </div>

          <div className="space-y-1.5">
            {NEGATIVE_TRAITS.map((trait) => {
              const isSelected = selectedTraits.some(t => t.id === trait.id);
              return (
                <button
                  key={trait.id}
                  onClick={() => toggleTrait(trait)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-600 text-rose-100 shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800/70 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-200">{trait.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                        +{trait.cost} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{trait.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-rose-600 border-rose-500 text-white' : 'border-zinc-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 5: Positive Traits (COSTS POINTS) */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              🟢 Advantage Traits (Costs Points)
            </label>
            <span className="text-[10px] text-zinc-500">Spend points to equip</span>
          </div>

          <div className="space-y-1.5">
            {POSITIVE_TRAITS.map((trait) => {
              const isSelected = selectedTraits.some(t => t.id === trait.id);
              return (
                <button
                  key={trait.id}
                  onClick={() => toggleTrait(trait)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-600 text-emerald-100 shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800/70 text-zinc-400 hover:bg-zinc-850'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-200">{trait.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        {trait.cost} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{trait.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-zinc-700'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. STICKY BOTTOM ACTION FOOTER */}
      <footer className="shrink-0 sticky bottom-0 z-40 p-4 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md shadow-2xl">
        {availablePoints < 0 ? (
          <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Point deficit ({availablePoints})! Take more flaws or lower stats to balance.</span>
          </div>
        ) : availablePoints > 0 ? (
          <div className="text-[11px] text-emerald-400/90 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>You have +{availablePoints} unspent points to allocate on stats or traits.</span>
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>✓ All points allocated (0 remaining). Ready for outbreak.</span>
          </div>
        )}

        <button
          disabled={!canStart}
          onClick={handleBegin}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
            canStart
              ? 'bg-rose-600 hover:bg-rose-500 text-white active:scale-98 shadow-rose-950/50'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
          }`}
        >
          <span>Enter the Apocalypse (Day 0 — {selectedCareer.startingLocation.name})</span>
        </button>
      </footer>
    </div>
  );
};
