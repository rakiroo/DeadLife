import React, { useState, useMemo } from 'react';
import { Career, Trait, Survivor } from '../types/game';
import { CAREERS } from '../data/careers';
import { NEGATIVE_TRAITS, POSITIVE_TRAITS } from '../data/traits';
import { 
  ArrowLeft, Dices, Shield, HeartPulse, Hammer, EyeOff, Activity, 
  AlertCircle, Check, User, Sparkles, RotateCcw, 
  X, ChevronRight, Plus, Minus, Lock, Play
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

const TOTAL_ATTRIBUTE_BUDGET = 25;

export const YOUTH_STUDENT_CAREER: Career = {
  id: 'student',
  title: 'High School Student',
  icon: '🎒',
  description: 'Under 18 with no pre-war trade. Agile and blank-slate; all 25 skill points available to allocate freely.',
  startingLocation: {
    name: 'Lincoln High Science Lab',
    type: 'High School',
    description: 'Lockers line the hallway. You locked yourself inside the third-floor science lab.',
    lootSpots: [
      {
        id: 'student_locker',
        name: 'Student Locker & Backpack',
        description: 'Packed lunch and sports bat.',
        loot: [
          { id: 'baseball_bat', name: 'Aluminum Baseball Bat', category: 'weapon', quantity: 1, description: 'Blunt defense bat.' },
          { id: 'bottled_water', name: 'Bottled Spring Water', category: 'water', quantity: 2, description: 'Clean water.' },
          { id: 'granola_bars', name: 'Box of Granola Bars', category: 'food', quantity: 3, description: 'High-energy bars.' }
        ]
      }
    ]
  },
  stats: {
    combat: 0,
    medical: 0,
    crafting: 0,
    stealth: 0,
    fitness: 0
  }
};

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
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Identity state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [name, setName] = useState(() => MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]);
  const [age, setAge] = useState<number>(28);
  const [selectedCareer, setSelectedCareer] = useState<Career>(CAREERS[0]);

  // Selected Traits
  const [selectedTraits, setSelectedTraits] = useState<Trait[]>([]);

  // Direct Stats Allocation (0 - 10)
  const [stats, setStats] = useState<Record<StatKey, number>>({
    combat: CAREERS[0].stats.combat,
    medical: CAREERS[0].stats.medical,
    crafting: CAREERS[0].stats.crafting,
    stealth: CAREERS[0].stats.stealth,
    fitness: CAREERS[0].stats.fitness
  });

  const isYouth = age < 18;

  // Handle Age change: If under 18, youth has no pre-war career
  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    if (newAge < 18 && selectedCareer.id !== 'student') {
      setSelectedCareer(YOUTH_STUDENT_CAREER);
      setStats({ combat: 0, medical: 0, crafting: 0, stealth: 0, fitness: 0 });
    } else if (newAge >= 18 && selectedCareer.id === 'student') {
      setSelectedCareer(CAREERS[0]);
      setStats({ ...CAREERS[0].stats });
    }
  };

  // Universal Balanced Point Math:
  // TOTAL_ATTRIBUTE_BUDGET (25) + traitPoints - currentStatSum
  const currentStatSum = useMemo(() => {
    return stats.combat + stats.medical + stats.crafting + stats.stealth + stats.fitness;
  }, [stats]);

  const traitPoints = selectedTraits.reduce((sum, t) => sum + t.cost, 0);

  // Total available points to spend (exactly 25 base points across ALL ages and jobs)
  const availablePoints = (TOTAL_ATTRIBUTE_BUDGET + traitPoints) - currentStatSum;

  // Reset stats to zero: puts all 25 points into pool
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

  const handleSelectCareer = (career: Career) => {
    if (isYouth && career.id !== 'student') return;

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

    const ageGroup = age <= 17 ? 'Youth' : age <= 34 ? 'Prime' : age <= 54 ? 'Middle-Aged' : 'Senior';

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
      {/* 1. STICKY TOP HEADER */}
      <header className="shrink-0 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95"
          title="Back to Title"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">Create Survivor</span>

        <div className="w-7" />
      </header>

      {/* 2. SEGMENTED TAB NAVIGATION */}
      <nav className="shrink-0 bg-white/[0.03] border-b border-white/5 px-2 py-1.5 grid grid-cols-3 gap-1 z-30">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border ${
            activeTab === 'identity'
              ? 'bg-white/10 border-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white border-transparent'
          }`}
        >
          <User className="w-3.5 h-3.5 text-rose-400" />
          <span>Background</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border ${
            activeTab === 'skills'
              ? 'bg-white/10 border-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white border-transparent'
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
          className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all border relative ${
            activeTab === 'traits'
              ? 'bg-white/10 border-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white border-transparent'
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
            <section className="space-y-3 bg-white/[0.04] p-4 rounded-2xl border border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold">
                  Identity & Age
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{gender === 'male' ? 'Male' : 'Female'}</span>
              </div>

              {/* Sex Toggle (Clean, no redundant words) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setGender('male');
                    setName(MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                    gender === 'male'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Male</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender('female');
                    setName(FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 border ${
                    gender === 'female'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Female</span>
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
              <div className="space-y-2 pt-1 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Age: <span className="font-mono text-base font-bold text-rose-400">{age}</span> years old
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {age < 18 ? 'Youth (Under 18)' : 'Adult (18+)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAgeChange(Math.max(16, age - 1))}
                    disabled={age <= 16}
                    className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-base active:scale-90 border border-zinc-700/60 transition-all shrink-0"
                  >-</button>

                  <input
                    type="range"
                    min="16"
                    max="75"
                    value={age}
                    onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
                    className="flex-1 accent-rose-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => handleAgeChange(Math.min(75, age + 1))}
                    disabled={age >= 75}
                    className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center font-bold text-base active:scale-90 border border-zinc-700/60 transition-all shrink-0"
                  >+</button>
                </div>
              </div>
            </section>

            {/* Job / Career Selection */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
                    Background & Career
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {isYouth 
                      ? 'Students have no pre-war trade. Allocate your full 25 points freely in Skills!' 
                      : 'Sets starting skill distribution. Click again to reset skills.'}
                  </span>
                </div>
              </div>

              {/* If Youth: Student Card Only */}
              {isYouth ? (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-rose-500/40 text-left space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">🎒</span>
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        High School Student
                        <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Youth (Under 18)
                        </span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                        Too young for a professional trade before the outbreak. You start with all 25 skill points available to spend freely!
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono pt-1">
                    🔒 Adult professions unlock at Age 18+.
                  </div>
                </div>
              ) : (
                /* Adult Careers List */
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {CAREERS.map((career) => {
                    const isSelected = selectedCareer.id === career.id;
                    return (
                      <button
                        key={career.id}
                        type="button"
                        onClick={() => handleSelectCareer(career)}
                        className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-rose-950/30 border-rose-500/80 text-zinc-100 ring-1 ring-rose-500/40 shadow-sm'
                            : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{career.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                              {career.title}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40">
                                Active Job
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{career.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Quick Navigation to Skills */}
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="w-full py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/5 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <span>Next: Allocate Skills</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SKILLS ALLOCATION                                       */}
        {/* ============================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {/* Header Controls for Stats */}
            <div className="bg-white/[0.04] p-3.5 rounded-2xl border border-white/5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-200 font-bold block">
                    Core Attributes (0 - 10)
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    Total budget: 25 points balanced across all survivors
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

                  {!isYouth && (
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
                  )}
                </div>
              </div>

              {/* Point Allocation Breakdown Bar */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Points to Allocate</span>
                  <span className={`font-mono text-base font-bold ${
                    availablePoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {availablePoints >= 0 ? `+${availablePoints} Available` : `${availablePoints} Overspent!`}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 text-right space-y-0.5">
                  <div>Base Budget: <span className="text-zinc-200">25</span> | Traits: <span className="text-zinc-200">{traitPoints >= 0 ? `+${traitPoints}` : traitPoints}</span></div>
                  <div>Allocated: <span className="text-zinc-200">-{currentStatSum}</span></div>
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
                    className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2 shadow-sm"
                  >
                    {/* Top Row: Name, Stepper */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-xl bg-black/30 border ${config.ringColor}`}>
                          {config.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-200">{config.name}</span>
                            {!isYouth && (
                              <span className="text-[10px] font-mono text-zinc-500">
                                (Preset: {careerDefault})
                              </span>
                            )}
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
                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-20 text-zinc-200 flex items-center justify-center active:scale-90 transition-all border border-white/5"
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
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400/40 shadow-sm'
                                : 'bg-white/5 text-zinc-600 border-white/5 disabled:opacity-20 cursor-not-allowed'
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
                                : 'bg-white/10 border border-white/5'
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
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-400 block">Flaws & Perks</span>
                <span className="text-xs text-zinc-300">
                  {selectedTraits.length > 0 
                    ? `${selectedTraits.length} traits picked (${traitPoints >= 0 ? '+' : ''}${traitPoints} pts)` 
                    : 'Pick flaws in Traits to earn bonus points'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('traits')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-white/5 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>Edit Traits</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TRAITS & PERKS                                          */}
        {/* ============================================================== */}
        {activeTab === 'traits' && (
          <div className="space-y-3.5">
            {/* Points balance in Traits tab */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-zinc-400 font-mono text-[11px]">Points Balance:</span>
              <span className={`font-mono font-bold text-xs ${
                availablePoints >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {availablePoints >= 0 ? `+${availablePoints} PTS Available` : `${availablePoints} PTS (Overspent!)`}
              </span>
            </div>

            {/* Active Traits Summary Banner / Pill Tray */}
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2 shadow-sm">
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
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                          isFlaw
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-200'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
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
            <div className="grid grid-cols-4 gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTraitCategory('all')}
                className={`py-1.5 rounded-xl transition-all ${
                  traitCategory === 'all'
                    ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({NEGATIVE_TRAITS.length + POSITIVE_TRAITS.length})
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('flaws')}
                className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  traitCategory === 'flaws'
                    ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-rose-400'
                }`}
              >
                <span>Flaws (+pts)</span>
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('perks')}
                className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 ${
                  traitCategory === 'perks'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                <span>Perks (-pts)</span>
              </button>

              <button
                type="button"
                onClick={() => setTraitCategory('selected')}
                className={`py-1.5 rounded-xl transition-all ${
                  traitCategory === 'selected'
                    ? 'bg-white/10 text-amber-300 font-semibold shadow-sm border border-white/10'
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
                          className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-sm ring-1 ring-rose-500/50'
                              : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06]'
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
                          className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-sm ring-1 ring-emerald-500/50'
                              : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06]'
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
      <footer className="shrink-0 sticky bottom-0 z-40 p-4 bg-zinc-950/80 border-t border-white/5 backdrop-blur-2xl shadow-2xl">
        {availablePoints < 0 ? (
          <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Overspent by {Math.abs(availablePoints)}! Lower a skill or take flaws to balance.</span>
          </div>
        ) : availablePoints > 0 ? (
          <div className="text-[11px] text-emerald-400/90 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>+{availablePoints} unspent skill points remaining.</span>
          </div>
        ) : (
          <div className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 mb-2 font-mono">
            <span>✓ All 25 points allocated (0 remaining). Ready to start!</span>
          </div>
        )}

        <button
          type="button"
          disabled={!canStart}
          onClick={() => setShowConfirmModal(true)}
          className={`w-full py-4 px-4 rounded-2xl font-semibold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${
            canStart
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
              : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
          }`}
        >
          <span>Start Game (Day 0)</span>
        </button>
      </footer>

      {/* 5. CONFIRMATION MODAL BEFORE LAUNCHING GAME */}
      {showConfirmModal && (
        <div 
          onClick={() => setShowConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-xs p-5 space-y-4 shadow-2xl font-sans text-center my-auto"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Survivor Review
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">Ready to Survive?</h2>
            </div>

            {/* Survivor Summary Box */}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-left space-y-1 font-sans">
              <div className="font-bold text-white text-sm">{name}</div>
              <div className="text-zinc-300">{gender === 'male' ? 'Male' : 'Female'} • Age {age}</div>
              <div className="text-rose-400 font-medium">{selectedCareer.title}</div>
            </div>

            {/* Checklist & Warnings */}
            <div className="space-y-1.5 text-left font-sans text-xs">
              {availablePoints > 0 && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-tight flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>You have <strong>+{availablePoints} unspent points</strong>. You can begin now or go back to allocate them.</span>
                </div>
              )}

              {isStatsAllZero && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] leading-tight flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>All your skills are at 0! You will face extreme difficulty surviving.</span>
                </div>
              )}

              {selectedTraits.length === 0 && (
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-zinc-400 text-[11px] leading-tight">
                  💡 No perks or flaws picked. You can take perks in Traits before starting.
                </div>
              )}

              {availablePoints === 0 && !isStatsAllZero && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] leading-tight flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Character build is balanced and ready for Day 0.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleBegin();
                }}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Begin Survival (Day 0)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/5 font-semibold text-xs active:scale-[0.98] transition-all"
              >
                Go Back & Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
