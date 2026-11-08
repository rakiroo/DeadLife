import React, { useState, useMemo } from 'react';
import { Career, Trait, Survivor } from '../types/game';
import { CAREERS } from '../data/careers';
import { NEGATIVE_TRAITS, POSITIVE_TRAITS } from '../data/traits';
import { 
  ArrowLeft, Dices, Shield, HeartPulse, Hammer, EyeOff, Activity, 
  AlertCircle, Check, Info, User, Briefcase, Sparkles, RotateCcw, 
  X, ChevronRight, ChevronLeft, Plus, Minus
} from 'lucide-react';

const MALE_NAMES = [
  'Marcus Vance', 'David Kowalski', 'Leon Sterling', 'Thomas O\'Connor',
  'Julian Walker', 'Robert Hayes', 'Arthur Pendelton', 'Siddharth Rao',
  'Liam Walker', 'Lucas Reed', 'Ethan Cole', 'Noah Ramirez'
];

const FEMALE_NAMES = [
  'Elena Chen', 'Sarah Miller', 'Maya Diaz', 'Hannah Reyes',
  'Grace Blackwood', 'Claire Patel', 'Zoe Washington', 'Chloe Bennett',
  'Elena Frost', 'Maya Lin', 'Aria Sterling', 'Mia Robinson'
];

type CreatorTab = 'identity' | 'skills' | 'traits';
type TraitCategory = 'all' | 'flaws' | 'perks' | 'selected';
type StatKey = 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness';

const STAT_CONFIG: Record<StatKey, { name: string; icon: React.ReactNode; desc: string; color: string; ringColor: string; barColor: string }> = {
  combat: {
    name: 'Combat (Fighting)',
    icon: <Shield className="w-4 h-4 text-rose-500" />,
    desc: 'Melee damage, weapon precision, and escaping zombie grabs.',
    color: 'text-rose-400',
    ringColor: 'border-rose-500/40',
    barColor: 'bg-rose-500'
  },
  medical: {
    name: 'First Aid (Healing)',
    icon: <HeartPulse className="w-4 h-4 text-cyan-400" />,
    desc: 'Wound recovery, sterile dressing speed, and infection prevention.',
    color: 'text-cyan-400',
    ringColor: 'border-cyan-500/40',
    barColor: 'bg-cyan-500'
  },
  crafting: {
    name: 'Crafting (Building)',
    icon: <Hammer className="w-4 h-4 text-amber-400" />,
    desc: 'Barricade durability, lock bypass, and repairing camp defenses.',
    color: 'text-amber-400',
    ringColor: 'border-amber-500/40',
    barColor: 'bg-amber-500'
  },
  stealth: {
    name: 'Stealth (Sneaking)',
    icon: <EyeOff className="w-4 h-4 text-indigo-400" />,
    desc: 'Scavenge safety, looting without alerting hordes, and noise reduction.',
    color: 'text-indigo-400',
    ringColor: 'border-indigo-500/40',
    barColor: 'bg-indigo-500'
  },
  fitness: {
    name: 'Fitness (Stamina)',
    icon: <Activity className="w-4 h-4 text-emerald-400" />,
    desc: 'Sprint stamina, carry weight, and physical trauma tolerance.',
    color: 'text-emerald-400',
    ringColor: 'border-emerald-500/40',
    barColor: 'bg-emerald-500'
  }
};

interface Props {
  onBack: () => void;
  onStartGame: (survivor: Survivor, career: Career) => void;
}

export const CharacterCreator: React.FC<Props> = ({ onBack, onStartGame }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<CreatorTab>('identity');
  const [traitCategory, setTraitCategory] = useState<TraitCategory>('all');

  // Identity state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [name, setName] = useState(MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]);
  const [age, setAge] = useState<number>(28);
  const [selectedCareer, setSelectedCareer] = useState<Career>(CAREERS[0]);

  // Selected Traits
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);

  // Direct Stats Allocation (0 - 10)
  // Initialized to selected career's default stats
  const [stats, setStats] = useState<Record<StatKey, number>>({
    combat: CAREERS[0].stats.combat,
    medical: CAREERS[0].stats.medical,
    crafting: CAREERS[0].stats.crafting,
    stealth: CAREERS[0].stats.stealth,
    fitness: CAREERS[0].stats.fitness
  });

  // Age Profiles: Grants bonus points directly to the pool
  const ageProfile = useMemo(() => {
    if (age <= 22) {
      return {
        label: 'Youth (16-22)',
        bonusPoints: 10,
        flavor: 'Young, fast, and agile (+10 points to spend), but lower job experience.'
      };
    } else if (age <= 34) {
      return {
        label: 'Young Adult (23-34)',
        bonusPoints: 6,
        flavor: 'Prime physical reflexes and balanced stamina (+6 points to spend).'
      };
    } else if (age <= 48) {
      return {
        label: 'Middle-Aged (35-48)',
        bonusPoints: 3,
        flavor: 'Solid work skills and steady decision-making (+3 points to spend).'
      };
    } else if (age <= 60) {
      return {
        label: 'Older Adult (49-60)',
        bonusPoints: 0,
        flavor: 'Decades of practical experience (+0 points), with steady veteran skills.'
      };
    } else {
      return {
        label: 'Senior (61-75)',
        bonusPoints: -4,
        flavor: 'Vast life wisdom, but physically frailer (-4 points).'
      };
    }
  }, [age]);

  // Point Budget Math:
  // Base skill points inherent to career + Career bonus points + Age bonus + Trait balance - Total allocated stats
  const careerBaseSkillSum = useMemo(() => {
    return selectedCareer.stats.combat +
      selectedCareer.stats.medical +
      selectedCareer.stats.crafting +
      selectedCareer.stats.stealth +
      selectedCareer.stats.fitness;
  }, [selectedCareer]);

  const currentStatSum = useMemo(() => {
    return stats.combat + stats.medical + stats.crafting + stats.stealth + stats.fitness;
  }, [stats]);

  const careerBonus = selectedCareer.bonusPoints || 0;
  const traitPoints = selectedTraits.reduce((sum, t) => sum + t.cost, 0);

  // Total available points to spend (can be positive, zero, or negative if overspent)
  const availablePoints = (careerBaseSkillSum + careerBonus + ageProfile.bonusPoints + traitPoints) - currentStatSum;

  // Reset stats to zero: puts all points into availablePoints pool so user can allocate from scratch
  const handleResetStatsToZero = () => {
    setStats({
      combat: 0,
      medical: 0,
      crafting: 0,
      stealth: 0,
      fitness: 0
    });
  };

  // Restore stats to career preset
  const handleApplyCareerPreset = (career: Career = selectedCareer) => {
    setStats({
      combat: career.stats.combat,
      medical: career.stats.medical,
      crafting: career.stats.crafting,
      stealth: career.stats.stealth,
      fitness: career.stats.fitness
    });
  };

  // When a career is clicked:
  // - If it's already selected, re-clicking it restores its preset stats (per user request!)
  // - If it's a new career, updates career AND applies its preset stats
  const handleSelectCareer = (career: Career) => {
    if (selectedCareer.id === career.id) {
      handleApplyCareerPreset(career);
    } else {
      setSelectedCareer(career);
      setStats({
        combat: career.stats.combat,
        medical: career.stats.medical,
        crafting: career.stats.crafting,
        stealth: career.stats.stealth,
        fitness: career.stats.fitness
      });
    }
  };

  // Modify individual stat (+ or -)
  const modifyStat = (stat: StatKey, delta: number) => {
    if (delta > 0) {
      if (stats[stat] >= 10 || availablePoints <= 0) return;
    } else if (delta < 0) {
      if (stats[stat] <= 0) return;
    }

    setStats(prev => ({
      ...prev,
      [stat]: Math.max(0, Math.min(10, prev[stat] + delta))
    }));
  };

  // Toggle trait selection
  const toggleTrait = (trait: Trait) => {
    if (selectedTraits.some(t => t.id === trait.id)) {
      setSelectedTraits(prev => prev.filter(t => t.id !== trait.id));
    } else {
      setSelectedTraits(prev => [...prev, trait]);
    }
  };

  const handleRandomizeName = () => {
    const pool = gender === 'female' ? FEMALE_NAMES : MALE_NAMES;
    setName(pool[Math.floor(Math.random() * pool.length)]);
  };

  // Check if current stats match the career's defaults
  const isStatsMatchingCareer = 
    stats.combat === selectedCareer.stats.combat &&
    stats.medical === selectedCareer.stats.medical &&
    stats.crafting === selectedCareer.stats.crafting &&
    stats.stealth === selectedCareer.stats.stealth &&
    stats.fitness === selectedCareer.stats.fitness;

  const isStatsAllZero = 
    stats.combat === 0 &&
    stats.medical === 0 &&
    stats.crafting === 0 &&
    stats.stealth === 0 &&
    stats.fitness === 0;

  const canStart = availablePoints >= 0 && name.trim().length > 0;

  const handleBegin = () => {
    if (!canStart) return;

    const ageGroup = age <= 24 ? 'Youth' : age <= 39 ? 'Prime' : age <= 54 ? 'Middle-Aged' : 'Senior';

    const newSurvivor: Survivor = {
      name: name.trim(),
      gender,
      age,
      ageGroup,
      profession: selectedCareer.title,
      bio: selectedCareer.description,
      health: 100,
      sanity: 85,
      hunger: 90,
      thirst: 90,
      infectionRisk: 0,
      combatSkill: stats.combat,
      medicalSkill: stats.medical,
      craftingSkill: stats.crafting,
      stealthSkill: stats.stealth,
      fitnessSkill: stats.fitness,
      traits: selectedTraits,
      statusEffects: [],
      isDead: false
    };

    onStartGame(newSurvivor, selectedCareer);
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-zinc-950 text-zinc-100 max-w-md mx-auto w-full select-none overflow-hidden font-sans">
      {/* 1. STICKY TOP HEADER WITH LIVE POINTS COUNTER */}
      <header className="shrink-0 sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95"
          title="Back to Title"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">Create Survivor</span>

        <div className="w-7" />
      </header>

      {/* 2. SEGMENTED TAB NAVIGATION (NO MORE ENDLESS SCROLLING) */}
      <nav className="shrink-0 bg-zinc-900/90 border-b border-zinc-800 px-2 py-1.5 grid grid-cols-3 gap-1 z-30">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border ${
            activeTab === 'identity'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
          }`}
        >
          <User className="w-3.5 h-3.5 text-rose-400" />
          <span>Background</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border ${
            activeTab === 'skills'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Skills</span>
          {isStatsAllZero && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Skills are at 0" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('traits')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all border relative ${
            activeTab === 'traits'
              ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Traits</span>
          {selectedTraits.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-[10px] font-mono text-white font-bold">
              {selectedTraits.length}
            </span>
          )}
        </button>
      </nav>

      {/* 3. TAB CONTENT VIEWS */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 overscroll-contain">
        {/* ============================================================== */}
        {/* TAB 1: IDENTITY & CAREER BACKGROUND                            */}
        {/* ============================================================== */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            {/* Identity Card */}
            <section className="space-y-3 bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold">
                  Identity & Age
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{gender === 'male' ? 'Male' : 'Female'}</span>
              </div>

              {/* Gender Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    setName(MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    gender === 'male'
                      ? 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Boy (Male)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    setName(FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    gender === 'female'
                      ? 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Girl (Female)</span>
                </button>
              </div>

              {/* Name Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter survivor name..."
                  className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-100 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleRandomizeName}
                  title="Randomize Name"
                  className="px-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>

              {/* Age Slider & Stepper */}
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Age: <span className="font-mono text-base font-bold text-rose-400">{age}</span> years old
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {ageProfile.label} ({ageProfile.bonusPoints >= 0 ? `+${ageProfile.bonusPoints}` : ageProfile.bonusPoints} pts)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAge(prev => Math.max(16, prev - 1))}
                    disabled={age <= 16}
                    className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-base active:scale-90 border border-zinc-700/60 transition-all shrink-0"
                  >-</button>

                  <input
                    type="range"
                    min="16"
                    max="75"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="flex-1 accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => setAge(prev => Math.min(75, prev + 1))}
                    disabled={age >= 75}
                    className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-base active:scale-90 border border-zinc-700/60 transition-all shrink-0"
                  >+</button>
                </div>

                <p className="text-[11px] text-zinc-400 bg-zinc-950/70 p-2 rounded-lg border border-zinc-800/80 font-sans leading-relaxed">
                  💡 <span className="text-zinc-300">{ageProfile.flavor}</span>
                </p>
              </div>
            </section>

            {/* Job / Career Selection */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
                    Job Before the Outbreak
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Sets starting skills & background. Click again to reset skills.
                  </span>
                </div>
              </div>

              {/* Careers List (Single clean list, no duplicates) */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {CAREERS.map((career) => {
                  const isSelected = selectedCareer.id === career.id;
                  return (
                    <button
                      key={career.id}
                      type="button"
                      onClick={() => handleSelectCareer(career)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-rose-950/30 border-rose-500/80 text-zinc-100 ring-1 ring-rose-500/40 shadow-sm'
                          : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{career.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                            {career.title}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {career.bonusPoints ? (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                                +{career.bonusPoints} pts
                              </span>
                            ) : null}
                            {isSelected && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-900/60 text-rose-200 border border-rose-700/60">
                                Active Job
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{career.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Quick Navigation to Skills */}
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <span>Next: Allocate Skills</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SKILLS ALLOCATION (WITH RESET TO ZERO & JOB PRESET)    */}
        {/* ============================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {/* Header Controls for Stats */}
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-200 font-bold block">
                    Core Attributes (0 - 10)
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Lower to 0 for a blank slate, or re-click job to restore defaults
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleResetStatsToZero}
                    className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-300 border border-rose-900/60 text-[10px] font-mono font-bold flex items-center gap-1 active:scale-95 transition-all"
                    title="Put all skills to zero so you can allocate freely from the start"
                  >
                    <RotateCcw className="w-3 h-3 text-rose-400" />
                    <span>Reset to 0</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyCareerPreset(selectedCareer)}
                    disabled={isStatsMatchingCareer}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                      isStatsMatchingCareer
                        ? 'bg-zinc-950 text-zinc-600 border border-zinc-800 cursor-default'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-800/60 active:scale-95'
                    }`}
                    title="Restore the stats preset from your chosen job"
                  >
                    <span>Use Job Preset</span>
                  </button>
                </div>
              </div>

              {/* Point Allocation Breakdown Bar */}
              <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Points to Allocate</span>
                  <span className={`font-mono text-base font-bold ${
                    availablePoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {availablePoints >= 0 ? `+${availablePoints} Available` : `${availablePoints} Overspent!`}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 text-right space-y-0.5">
                  <div>Job Base: <span className="text-zinc-200">+{careerBaseSkillSum}</span> | Age: <span className="text-zinc-200">+{ageProfile.bonusPoints}</span></div>
                  <div>Traits: <span className="text-zinc-200">{traitPoints >= 0 ? `+${traitPoints}` : traitPoints}</span> | Spent: <span className="text-zinc-200">-{currentStatSum}</span></div>
                </div>
              </div>
            </div>

            {/* 5 Skill Rows with 10-pip gauges */}
            <div className="space-y-2.5">
              {(['combat', 'medical', 'crafting', 'stealth', 'fitness'] as StatKey[]).map((statKey) => {
                const config = STAT_CONFIG[statKey];
                const value = stats[statKey];
                const careerDefault = selectedCareer.stats[statKey];

                return (
                  <div
                    key={statKey}
                    className="p-3 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-2 shadow-sm"
                  >
                    {/* Top Row: Name, Job Baseline, Stepper */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-xl bg-zinc-950 border ${config.ringColor}`}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-200">{config.name}</span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              (Job: {careerDefault})
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-tight">{config.desc}</p>
                        </div>
                      </div>

                      {/* Number & +/- Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-base font-bold text-zinc-100 w-6 text-center">
                          {value}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => modifyStat(statKey, -1)}
                            disabled={value <= 0}
                            className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-200 flex items-center justify-center active:scale-90 transition-all border border-zinc-700/60"
                            title="Decrease skill to refund 1 point"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => modifyStat(statKey, 1)}
                            disabled={value >= 10 || availablePoints <= 0}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all border ${
                              availablePoints > 0 && value < 10
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-sm shadow-emerald-950/50'
                                : 'bg-zinc-800/80 text-zinc-500 border-zinc-700/50 disabled:opacity-20 cursor-not-allowed'
                            }`}
                            title="Increase skill by 1 point"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 10-Pip Segment Gauge */}
                    <div className="grid grid-cols-10 gap-1 pt-1">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const isFilled = i < value;
                        return (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              isFilled
                                ? config.barColor
                                : 'bg-zinc-800/80 border border-zinc-700/30'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Traits preview & navigation */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Need more points?</span>
                <span className="text-xs text-zinc-300">
                  {selectedTraits.length > 0 
                    ? `${selectedTraits.length} traits picked (${traitPoints >= 0 ? '+' : ''}${traitPoints} pts)` 
                    : 'Pick flaws in Traits to earn bonus points'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('traits')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-800/60 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>Edit Traits</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRAITS & PERKS (NO SCROLLING PAST CAREERS/STATS!)       */}
        {/* ============================================================== */}
        {activeTab === 'traits' && (
          <div className="space-y-3.5">
            {/* Active Traits Summary Banner / Pill Tray */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-zinc-400 font-mono text-[11px]">Points Balance:</span>
              <span className={`font-mono font-bold text-xs ${
                availablePoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {availablePoints >= 0 ? `+${availablePoints} PTS Available` : `${availablePoints} PTS (Overspent!)`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold">
                  Active Survivor Traits ({selectedTraits.length})
                </span>
                {selectedTraits.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTraits([])}
                    className="text-[10px] font-mono text-zinc-400 hover:text-rose-400 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedTraits.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-1">
                  No traits selected. Flaws grant extra points (+pts); Perks cost points (-pts).
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedTraits.map(trait => {
                    const isFlaw = trait.cost > 0;
                    return (
                      <span
                        key={trait.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border shadow-sm ${
                          isFlaw
                            ? 'bg-rose-950/70 border-rose-700/60 text-rose-200'
                            : 'bg-emerald-950/70 border-emerald-700/60 text-emerald-200'
                        }`}
                      >
                        <span>{trait.name}</span>
                        <span className="font-mono text-[10px] opacity-80">
                          {isFlaw ? `+${trait.cost}` : trait.cost}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleTrait(trait)}
                          className="hover:text-white p-0.5 rounded-full ml-0.5"
                          title="Remove trait"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sub-Category Filter Buttons */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTraitCategory('all')}
                className={`py-1.5 rounded-lg transition-all ${
                  traitCategory === 'all'
                    ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({NEGATIVE_TRAITS.length + POSITIVE_TRAITS.length})
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('flaws')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  traitCategory === 'flaws'
                    ? 'bg-rose-950/70 text-rose-300 font-bold border border-rose-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                <span>Flaws (+pts)</span>
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('perks')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  traitCategory === 'perks'
                    ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <span>Perks (-pts)</span>
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('selected')}
                className={`py-1.5 rounded-lg transition-all ${
                  traitCategory === 'selected'
                    ? 'bg-zinc-800 text-amber-300 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-amber-300'
                }`}
              >
                Picked ({selectedTraits.length})
              </button>
            </div>

            {/* List of Traits based on Category */}
            <div className="space-y-2">
              {/* Flaws Section */}
              {(traitCategory === 'all' || traitCategory === 'flaws' || traitCategory === 'selected') && (
                <div className="space-y-1.5">
                  {(traitCategory === 'all' || traitCategory === 'flaws') && (
                    <div className="flex items-center justify-between px-1 pt-1">
                      <span className="text-[11px] uppercase font-mono tracking-wider text-rose-400 font-bold">
                        Flaws & Weaknesses (Grants Extra Points)
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">+{traitPoints} total</span>
                    </div>
                  )}

                  {NEGATIVE_TRAITS
                    .filter(t => traitCategory !== 'selected' || selectedTraits.some(st => st.id === t.id))
                    .map((trait) => {
                      const isSelected = selectedTraits.some(t => t.id === trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => toggleTrait(trait)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-sm ring-1 ring-rose-500/50'
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
              )}

              {/* Perks Section */}
              {(traitCategory === 'all' || traitCategory === 'perks' || traitCategory === 'selected') && (
                <div className="space-y-1.5 pt-2">
                  {(traitCategory === 'all' || traitCategory === 'perks') && (
                    <div className="flex items-center justify-between px-1 pt-1">
                      <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                        Perks & Advantages (Costs Points)
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Select to unlock</span>
                    </div>
                  )}

                  {POSITIVE_TRAITS
                    .filter(t => traitCategory !== 'selected' || selectedTraits.some(st => st.id === t.id))
                    .map((trait) => {
                      const isSelected = selectedTraits.some(t => t.id === trait.id);
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => toggleTrait(trait)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-sm ring-1 ring-emerald-500/50'
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. STICKY BOTTOM ACTION FOOTER */}
      <footer className="shrink-0 sticky bottom-0 z-40 p-3.5 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md shadow-2xl">
        {availablePoints < 0 ? (
          <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Overspent by {Math.abs(availablePoints)}! Lower a skill or take flaws to balance.</span>
          </div>
        ) : availablePoints > 0 ? (
          <div className="text-[11px] text-emerald-400/90 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>+{availablePoints} unspent points available to allocate.</span>
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>✓ All points allocated (0 remaining). Ready to start!</span>
          </div>
        )}

        <button
          type="button"
          disabled={!canStart}
          onClick={handleBegin}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
            canStart
              ? 'bg-rose-600 hover:bg-rose-500 text-white active:scale-98 shadow-rose-950/50'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
          }`}
        >
          <span>Start Game (Day 0)</span>
        </button>
      </footer>
    </div>
  );
};
