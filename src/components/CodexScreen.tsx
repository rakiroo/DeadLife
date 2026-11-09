import React, { useState } from 'react';
import { CodexSaveData, CodexUnlockItem } from '../types/game';
import { ALL_CODEX_UNLOCKS, saveCodexData } from '../data/codex';
import { ArrowLeft, Award, Sparkles, Lock, Check, HeartPulse, Hammer, Crosshair, ShieldAlert, Compass, ShieldCheck, Utensils, Eye, Crown, Snowflake, Baby, Flame, BookOpen } from 'lucide-react';

interface Props {
  codexData: CodexSaveData;
  onUpdateCodex: (data: CodexSaveData) => void;
  onBack: () => void;
}

export const CodexScreen: React.FC<Props> = ({ codexData, onUpdateCodex, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<'career' | 'trait' | 'modifier'>('career');

  const filteredItems = ALL_CODEX_UNLOCKS.filter(item => item.type === activeCategory);

  const handleUnlock = (item: CodexUnlockItem) => {
    if (codexData.legacyMarks < item.cost) return;
    if (codexData.unlockedIds.includes(item.id)) return;

    const updated: CodexSaveData = {
      ...codexData,
      legacyMarks: codexData.legacyMarks - item.cost,
      unlockedIds: [...codexData.unlockedIds, item.id]
    };
    saveCodexData(updated);
    onUpdateCodex(updated);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'Crosshair': return <Crosshair className="w-5 h-5 text-rose-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-orange-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-300" />;
      case 'Eye': return <Eye className="w-5 h-5 text-cyan-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-cyan-300" />;
      case 'Baby': return <Baby className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-zinc-950 text-zinc-100 flex flex-col justify-between max-w-md mx-auto w-full select-none font-sans overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 bg-zinc-950/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">
          The Survivor's Codex
        </span>

        {/* Legacy Marks Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 font-mono text-xs font-bold text-amber-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{codexData.legacyMarks} Marks</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 pb-20">
        {/* Hero Card */}
        <div className="p-4 bg-gradient-to-br from-amber-950/30 via-zinc-900 to-black/60 border border-amber-500/20 rounded-3xl space-y-2 text-center shadow-lg">
          <Award className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-base font-bold text-white tracking-tight">Meta-Progression & Archives</h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Every day survived, zombie slain, and life saved across all your runs awards Legacy Marks. Spend marks to permanently unlock elite careers, genetic perks, and challenge modifiers.
          </p>

          {/* Lifetime Career Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-zinc-500 text-[9px] block">Runs</span>
              <span className="font-bold text-white">{codexData.totalRunsPlayed}</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-zinc-500 text-[9px] block">Days Lived</span>
              <span className="font-bold text-emerald-400">{codexData.totalDaysSurvived}</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
              <span className="text-zinc-500 text-[9px] block">Mysteries</span>
              <span className="font-bold text-cyan-400">{codexData.completedMysteryIds ? codexData.completedMysteryIds.length : 0}</span>
            </div>
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveCategory('career')}
            className={'flex-1 py-1.5 rounded-xl text-center transition-all ' + (activeCategory === 'career' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white')}
          >
            Careers
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('trait')}
            className={'flex-1 py-1.5 rounded-xl text-center transition-all ' + (activeCategory === 'trait' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white')}
          >
            Genetics
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('modifier')}
            className={'flex-1 py-1.5 rounded-xl text-center transition-all ' + (activeCategory === 'modifier' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white')}
          >
            Modifiers
          </button>
        </div>

        {/* Unlocks List */}
        <div className="space-y-2.5">
          {filteredItems.map(item => {
            const isUnlocked = codexData.unlockedIds.includes(item.id);
            const canAfford = codexData.legacyMarks >= item.cost;

            return (
              <div
                key={item.id}
                className={'p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ' + (
                  isUnlocked
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/[0.04] border-white/5 hover:border-white/10'
                )}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 mt-0.5">
                    {getIcon(item.icon)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      {isUnlocked && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded-full">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleUnlock(item)}
                      className={'py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ' + (
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                          : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.cost}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-zinc-950/95 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white active:scale-95 transition-all"
        >
          Return to Title
        </button>
      </div>
    </div>
  );
};

