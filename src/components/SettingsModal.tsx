import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { 
  Settings, X, Volume2, VolumeX, Smartphone, Zap, 
  HelpCircle, ChevronDown, ChevronUp, Save, LogOut, 
  RotateCcw, Play, Check, ShieldAlert, Award
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onClose: () => void;
  onReturnToTitle: () => void;
  onForfeitRun?: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  gameState,
  onClose,
  onReturnToTitle,
  onForfeitRun
}) => {
  const { player, stats, day } = gameState;

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
    localStorage.setItem('deadlife_save', JSON.stringify(gameState));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const triggerHaptic = () => {
    if (hapticsEnabled && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col max-h-[85vh] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-zinc-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Settings & Options
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {savedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-center flex items-center justify-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Progress saved to local device!</span>
            </div>
          )}

          {/* 1. Current Run Statistics Card */}
          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs">{player.name}</span>
                <span className="text-[11px] text-zinc-400 block">{player.profession} • Age {player.age}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-zinc-300">
                Day {day}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 text-center text-[10px] font-mono">
              <div className="p-1 rounded bg-black/30">
                <span className="text-zinc-500 block">Zombies</span>
                <span className="font-bold text-rose-400 text-xs">{stats.zombiesEliminated}</span>
              </div>
              <div className="p-1 rounded bg-black/30">
                <span className="text-zinc-500 block">Saved</span>
                <span className="font-bold text-emerald-400 text-xs">{stats.peopleSaved}</span>
              </div>
              <div className="p-1 rounded bg-black/30">
                <span className="text-zinc-500 block">Scavenges</span>
                <span className="font-bold text-cyan-400 text-xs">{stats.scavengeRuns}</span>
              </div>
            </div>
          </div>

          {/* 2. Audio & Device Preferences */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold px-1">
              Preferences & Feedback
            </span>
            <div className="bg-white/[0.04] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
              {/* Sound Effects Toggle */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {sfxEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                  <div>
                    <div className="font-semibold text-white">Audio & Sound FX</div>
                    <div className="text-[10px] text-zinc-400">Play tactile ambient sounds</div>
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

              {/* Haptic Touch Toggle */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">Haptic Touch Feedback</div>
                    <div className="text-[10px] text-zinc-400">Vibrate on button taps (Mobile)</div>
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
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">Fast Event Feed</div>
                    <div className="text-[10px] text-zinc-400">Skip smooth log animations</div>
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

          {/* 3. Survival Field Manual (Collapsible Guide) */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between text-left hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">Survival Field Guide</span>
              </div>
              {showManual ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
            </button>

            {showManual && (
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-[11px] text-zinc-300 leading-relaxed font-sans animate-fadeIn">
                <div>
                  <strong className="text-white block font-medium">💧 Water & Hydration:</strong>
                  Clean water drops every day. Heatwaves accelerate thirst. 24h without water triggers severe dehydration damage.
                </div>
                <div>
                  <strong className="text-white block font-medium">🍞 Food & Starvation:</strong>
                  Hunger decays daily. Starvation inflicts cumulative HP loss beginning on Day 2 without meals.
                </div>
                <div>
                  <strong className="text-white block font-medium">👥 Camp Sustenance:</strong>
                  Each survivor in your camp consumes 1 food and 1 water ration every day.
                </div>
                <div>
                  <strong className="text-white block font-medium">🩸 Bleeding & Infection:</strong>
                  Open wounds ooze blood until bandaged. Bacterial sepsis will turn fatal without antibiotics.
                </div>
                <div>
                  <strong className="text-white block font-medium">🔨 Barricades:</strong>
                  Timber and nails fortify doors against nocturnal horde breaches.
                </div>
              </div>
            )}
          </div>

          {/* 4. Save & Data Management */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleManualSave}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98] transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-zinc-300" />
              <span>Save Game Progress</span>
            </button>

            <button
              type="button"
              onClick={onReturnToTitle}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98] transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-zinc-400" />
              <span>Save & Exit to Title Screen</span>
            </button>

            {/* Abandon / Restart Run Prompt */}
            {!showForfeitConfirm ? (
              <button
                type="button"
                onClick={() => setShowForfeitConfirm(true)}
                className="w-full py-2 px-3 text-[11px] text-zinc-500 hover:text-rose-400 font-mono underline"
              >
                Forfeit / Abandon Survivor
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-center space-y-2">
                <p className="text-[11px] text-rose-200 leading-tight">
                  Are you sure? This will end {player.name}\'s run and record their legacy to the Graveyard.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onForfeitRun) onForfeitRun();
                      else onReturnToTitle();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[10px]"
                  >
                    Confirm Forfeit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForfeitConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Primary Resume Action */}
        <div className="p-3.5 border-t border-white/5 bg-zinc-900/90 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Survival</span>
          </button>
        </div>
      </div>
    </div>
  );
};
