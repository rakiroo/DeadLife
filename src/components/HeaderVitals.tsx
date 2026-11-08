import React, { useState } from 'react';
import { 
  Heart, Droplets, Utensils, ShieldAlert, CloudRain, Sun, CloudFog, Snowflake, 
  Settings, X, Shield, HeartPulse, Hammer, EyeOff, Activity, 
  LogOut, Play
} from 'lucide-react';
import { GameState, WeatherType } from '../types/game';

interface Props {
  state: GameState;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderVitals: React.FC<Props> = ({ state, onOpenMenu }) => {
  const { player, weather, temperatureCelsius } = state;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const getWeatherIcon = (w: WeatherType) => {
    switch (w) {
      case 'heavy_rain':
      case 'thunderstorm':
        return <CloudRain className="w-3.5 h-3.5 text-blue-400" />;
      case 'dense_fog':
        return <CloudFog className="w-3.5 h-3.5 text-zinc-400" />;
      case 'freezing_cold':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-300" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getHealthColor = (hp: number) => {
    if (hp > 70) return 'bg-emerald-500';
    if (hp > 35) return 'bg-amber-500';
    return 'bg-rose-500 animate-pulse';
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 px-4 py-2.5 shadow-lg select-none">
      <div className="max-w-md mx-auto space-y-2">
        {/* Top line: Game Title & Weather/Settings */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-widest uppercase font-mono text-rose-500">
              DEADLIFE
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300">
              {getWeatherIcon(weather)}
              <span className="text-[11px] capitalize">{weather.replace('_', ' ')}</span>
              <span className="text-zinc-500 text-[10px]">{temperatureCelsius}°C</span>
            </div>

            <button
              type="button"
              onClick={() => setShowPauseModal(true)}
              title="Pause & Game Options"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Character Identity: Name, Profession & Age */}
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={() => setShowProfileModal(true)}
            className="text-left group transition-all flex-1 min-w-0"
            title="Tap to view Skills & Perks"
          >
            <h1 className="text-base font-bold text-white tracking-tight group-hover:text-rose-400 transition-colors truncate">
              {player.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 font-sans">
              <span className="font-medium text-zinc-300 truncate">{player.profession}</span>
              <span className="text-zinc-600">•</span>
              <span className="shrink-0">Age {player.age}</span>
            </div>
          </button>

          {player.statusEffects.length > 0 && (
            <div className="flex gap-1 overflow-x-auto py-0.5 shrink-0 ml-2">
              {player.statusEffects.map((eff, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider animate-pulse"
                  title={eff.description}
                >
                  {eff.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Active Character Traits Badges in Navbar */}
        {player.traits.length > 0 && (
          <div className="flex gap-1 overflow-x-auto py-0.5 no-scrollbar">
            {player.traits.map(t => (
              <span
                key={t.id}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                  t.type === 'positive'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}
                title={t.description}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Vitals Grid (Health, Hydration, Food, Virus) */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* Health */}
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-rose-500" /> HP</span>
              <span className="font-mono font-bold text-zinc-200">{player.health}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getHealthColor(player.health)}`}
                style={{ width: `${Math.max(0, player.health)}%` }}
              />
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> H2O</span>
              <span className="font-mono font-bold text-zinc-200">{player.thirst}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{ width: `${Math.max(0, player.thirst)}%` }}
              />
            </div>
          </div>

          {/* Hunger */}
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span className="flex items-center gap-1"><Utensils className="w-3 h-3 text-amber-400" /> Food</span>
              <span className="font-mono font-bold text-zinc-200">{player.hunger}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.max(0, player.hunger)}%` }}
              />
            </div>
          </div>

          {/* Infection Risk */}
          <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-emerald-400" /> Virus</span>
              <span className={`font-mono font-bold ${player.infectionRisk > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {player.infectionRisk}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${player.infectionRisk > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(5, player.infectionRisk)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 1. Survivor Profile & Attributes Modal */}
        {showProfileModal && (
          <div 
            onClick={() => setShowProfileModal(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-xs shadow-2xl flex flex-col max-h-[80vh] overflow-hidden font-sans my-auto"
            >
              {/* Sticky Modal Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-zinc-900/90 shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">{player.name}</h2>
                  <p className="text-[11px] text-zinc-400">{player.profession} • Age {player.age}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 text-zinc-300 flex items-center justify-center transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {/* Attributes Grid */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 block px-0.5">
                    Attributes
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-zinc-300"><Shield className="w-3.5 h-3.5 text-rose-500" /> Combat</span>
                      <span className="font-mono font-bold text-white">{player.combatSkill}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-zinc-300"><HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> First Aid</span>
                      <span className="font-mono font-bold text-white">{player.medicalSkill}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-zinc-300"><Hammer className="w-3.5 h-3.5 text-amber-400" /> Crafting</span>
                      <span className="font-mono font-bold text-white">{player.craftingSkill}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-zinc-300"><EyeOff className="w-3.5 h-3.5 text-indigo-400" /> Stealth</span>
                      <span className="font-mono font-bold text-white">{player.stealthSkill}/10</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-white/5 col-span-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-zinc-300"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Fitness</span>
                      <span className="font-mono font-bold text-white">{player.fitnessSkill}/10</span>
                    </div>
                  </div>
                </div>

                {/* Traits & Perks */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 block px-0.5">
                    Traits & Habits
                  </span>
                  {player.traits.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic px-0.5">No special traits picked.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {player.traits.map(t => (
                        <span
                          key={t.id}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            t.type === 'positive'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/25'
                          }`}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Close Button */}
              <div className="p-3 border-t border-white/5 bg-zinc-900/90 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs active:scale-[0.98] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Pause & Settings Modal */}
        {showPauseModal && (
          <div 
            onClick={() => setShowPauseModal(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-xs p-4 space-y-3 shadow-2xl font-sans text-center my-auto"
            >
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mx-auto text-zinc-200">
                <Settings className="w-4 h-4 text-zinc-300" />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-white tracking-tight">Game Paused</h2>
                <p className="text-[11px] text-zinc-400">{player.name} • {player.profession}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 text-xs text-zinc-300 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Day:</span>
                  <span className="font-mono font-bold text-white">{state.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Vitals:</span>
                  <span className="font-mono text-zinc-300">HP {player.health}% • Food {player.hunger}% • H2O {player.thirst}%</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Survival</span>
                </button>

                {onOpenMenu && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPauseModal(false);
                      onOpenMenu();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/5 font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Save & Return to Main Menu</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
