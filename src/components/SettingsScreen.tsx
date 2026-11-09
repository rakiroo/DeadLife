import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { 
  ArrowLeft, Volume2, VolumeX, Smartphone, Zap, 
  HelpCircle, ChevronDown, ChevronUp, Save, LogOut, 
  Play, Check, Heart, Sparkles, Droplets, Biohazard
} from 'lucide-react';

interface Props {
  gameState: GameState | null;
  onBack: () => void;
  onReturnToTitle: () => void;
  onForfeitRun?: () => void;
}

export const SettingsScreen: React.FC<Props> = ({
  gameState,
  onBack,
  onReturnToTitle,
  onForfeitRun
}) => {
  // Preferences saved in localStorage
  const [sfxEnabled, setSfxEnabled] = useState(() => localStorage.getItem('dl_sfx') !== 'false');
  const [hapticsEnabled, setHapticsEnabled] = useState(() => localStorage.getItem('dl_haptics') !== 'false');
  const [fastFeed, setFastFeed] = useState(() => localStorage.getItem('dl_fast_feed') === 'true');
  const [showManual, setShowManual] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('dl_sfx', String(sfxEnabled));
  }, [sfxEnabled]);

  useEffect(() => {
    localStorage.setItem('dl_haptics', String(hapticsEnabled));
  }, [hapticsEnabled]);

  useEffect(() => {
    localStorage.setItem('dl_fast_feed', String(fastFeed));
  }, [fastFeed]);

  const handleManualSave = () => {
    if (gameState) {
      localStorage.setItem('deadlife_save', JSON.stringify(gameState));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  const triggerHaptic = () => {
    if (hapticsEnabled && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  };

  const player = gameState?.player;
  const stats = gameState?.stats;
  const day = gameState?.day ?? 0;

  return (
    <div className="h-screen max-h-screen flex flex-col bg-zinc-950 text-zinc-100 max-w-md mx-auto w-full select-none overflow-hidden font-sans">
      {/* Sticky Top Header */}
      <header className="shrink-0 sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 px-4 py-3 flex items-center justify-between shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-1.5 text-xs font-semibold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Resume</span>
        </button>

        <span className="font-bold text-xs uppercase tracking-wider text-zinc-200">
          Settings & Options
        </span>

        <div className="w-16" />
      </header>

      {/* Full-Screen Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
        {savedNotice && (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs text-center flex items-center justify-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Progress saved to local device!</span>
          </div>
        )}

        {/* 1. Current Survivor Overview (If in-game) */}
        {player && (
          <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/5 space-y-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">{player.name}</h2>
                <p className="text-xs text-zinc-400">{player.profession} • Age {player.age}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-zinc-200 border border-white/5">
                Day {day}
              </span>
            </div>

            {/* Quick Vitals Summary */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono pt-1 border-t border-white/5">
              <div className="p-1.5 rounded-xl bg-black/30">
                <span className="text-zinc-500 block flex items-center justify-center gap-0.5"><Heart className="w-2.5 h-2.5 text-rose-500" /> HP</span>
                <span className="font-bold text-white text-xs">{player.health}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-black/30">
                <span className="text-zinc-500 block flex items-center justify-center gap-0.5"><Sparkles className="w-2.5 h-2.5 text-purple-400" /> Mind</span>
                <span className="font-bold text-purple-300 text-xs">{player.sanity}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-black/30">
                <span className="text-zinc-500 block flex items-center justify-center gap-0.5"><Droplets className="w-2.5 h-2.5 text-cyan-400" /> H2O</span>
                <span className="font-bold text-cyan-300 text-xs">{player.thirst}%</span>
              </div>
              <div className="p-1.5 rounded-xl bg-black/30">
                <span className="text-zinc-500 block flex items-center justify-center gap-0.5"><Biohazard className="w-2.5 h-2.5 text-rose-400" /> Virus</span>
                <span className="font-bold text-rose-400 text-xs">{player.infectionRisk || 0}%</span>
              </div>
            </div>

            {player.backstory && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5 text-left font-sans">
                <div className="font-semibold text-amber-400 text-[11px] flex items-center justify-between">
                  <span>🎯 {player.backstory.title}</span>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase">{player.backstory.status === 'clue_found' ? 'Clue Found' : 'Searching'}</span>
                </div>
                <div className="text-[10px] text-zinc-300">{player.backstory.relation}: {player.backstory.targetName}</div>
                <div className="text-[10px] text-zinc-400 italic">{player.backstory.searchGoal}</div>
              </div>
            )}

            {stats && (
              <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-mono">
                <div className="p-1.5 rounded-xl bg-black/20">
                  <span className="text-zinc-500 block">Zombies</span>
                  <span className="font-bold text-rose-400 text-xs">{stats.zombiesEliminated}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-black/20">
                  <span className="text-zinc-500 block">Saved</span>
                  <span className="font-bold text-emerald-400 text-xs">{stats.peopleSaved}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-black/20">
                  <span className="text-zinc-500 block">Scavenges</span>
                  <span className="font-bold text-cyan-400 text-xs">{stats.scavengeRuns}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Audio & Device Preferences */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
            Audio & Device Preferences
          </span>
          <div className="bg-white/[0.04] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
            {/* Sound FX Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {sfxEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                <div>
                  <div className="font-semibold text-white text-xs">Audio & Sound FX</div>
                  <div className="text-[11px] text-zinc-400">Play tactile ambient sounds</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSfxEnabled(!sfxEnabled);
                  triggerHaptic();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  sfxEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  sfxEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Haptics Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold text-white text-xs">Haptic Touch Feedback</div>
                  <div className="text-[11px] text-zinc-400">Vibrate on button taps (Mobile)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHapticsEnabled(!hapticsEnabled);
                  triggerHaptic();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  hapticsEnabled ? 'bg-cyan-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Fast Feed Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold text-white text-xs">Fast Event Feed</div>
                  <div className="text-[11px] text-zinc-400">Skip smooth scroll animations for instant logs</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFastFeed(!fastFeed);
                  triggerHaptic();
                }}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  fastFeed ? 'bg-amber-500' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  fastFeed ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Survival Field Manual (Collapsible) */}
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            className="w-full p-3.5 rounded-3xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-left hover:bg-white/[0.06] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs">Survival Field Guide</span>
            </div>
            {showManual ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {showManual && (
            <div className="p-4 rounded-3xl bg-black/40 border border-white/5 space-y-2.5 text-xs text-zinc-300 leading-relaxed font-sans animate-fadeIn">
              <div>
                <strong className="text-white block font-medium">🧠 Mind & Sanity:</strong>
                Mental composure affects your accuracy and focus. Low sanity (&lt;25%) triggers night panic attacks, shaking hands, and combat penalties.
              </div>
              <div>
                <strong className="text-white block font-medium">💧 Water & Hydration:</strong>
                Clean water drops daily. Heatwaves accelerate thirst. 24h without water causes acute dehydration damage.
              </div>
              <div>
                <strong className="text-white block font-medium">🍞 Food & Starvation:</strong>
                Hunger decays daily. Starvation inflicts cumulative HP loss starting on Day 2 without meals.
              </div>
              <div>
                <strong className="text-white block font-medium">👥 Camp Sustenance:</strong>
                Each survivor in your camp consumes 1 food and 1 water ration every day.
              </div>
              <div>
                <strong className="text-white block font-medium">🩸 Bleeding & Infection:</strong>
                Open lacerations bleed until bandaged. Sepsis will turn fatal without antibiotics.
              </div>
              <div>
                <strong className="text-white block font-medium">⭐ Skill Adventure Growth:</strong>
                Skills increase naturally through real practice (sneaking past hordes, bandaging wounds, building defenses), capped at +1 point per day to keep survival grounded.
              </div>
            </div>
          )}
        </div>

        {/* 4. Save & Data Management */}
        <div className="space-y-2 pt-2">
          {gameState && (
            <button
              type="button"
              onClick={handleManualSave}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98] transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-zinc-300" />
              <span>Save Game Progress</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReturnToTitle}
            className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98] transition-all shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-400" />
            <span>Save & Exit to Title Screen</span>
          </button>

          {/* Forfeit Run Option */}
          {gameState && !gameState.player.isDead && (
            <div className="pt-1">
              {!showForfeitConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowForfeitConfirm(true)}
                  className="w-full py-2 text-[11px] text-zinc-500 hover:text-rose-400 font-mono underline"
                >
                  Forfeit / Abandon Survivor
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-center space-y-2">
                  <p className="text-xs text-rose-200 leading-tight">
                    Are you sure? This will end {player?.name}\'s run and save their legacy to the Graveyard.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onForfeitRun) onForfeitRun();
                        else onReturnToTitle();
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs active:scale-95"
                    >
                      Confirm Forfeit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForfeitConfirm(false)}
                      className="flex-1 py-2 rounded-xl bg-white/10 text-zinc-300 text-xs active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Resume Button */}
      <footer className="shrink-0 sticky bottom-0 z-40 p-4 bg-zinc-950/80 border-t border-white/5 backdrop-blur-2xl shadow-2xl">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Resume Survival</span>
        </button>
      </footer>
    </div>
  );
};
