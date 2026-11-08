import React, { useState } from 'react';
import { 
  Heart, Droplets, Utensils, ShieldAlert, CloudRain, Sun, CloudFog, Snowflake, 
  Settings, X, Shield, HeartPulse, Hammer, EyeOff, Activity, MapPin, 
  LogOut, Play, Sparkles
} from 'lucide-react';
import { GameState, WeatherType } from '../types/game';

interface Props {
  state: GameState;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderVitals: React.FC<Props> = ({ state, onOpenMenu }) => {
  const { player, weather, temperatureCelsius, startingLocation } = state;
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
    return 'bg-rose-600 animate-pulse';
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 shadow-lg select-none">
      <div className="max-w-md mx-auto space-y-2">
        {/* Top line: Game Title & Weather/Settings */}
        <div className="flex items-center justify-between text-xs font-mono">
          {/* Game Brand Name */}
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-widest uppercase font-mono text-rose-500">
              DEADLIFE
            </span>
          </div>

          {/* Weather & Settings / Pause Controls */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-300">
              {getWeatherIcon(weather)}
              <span className="text-[11px] capitalize">{weather.replace('_', ' ')}</span>
              <span className="text-zinc-500 text-[10px]">{temperatureCelsius}°C</span>
            </div>

            {/* Settings / Pause Button */}
            <button
              type="button"
              onClick={() => setShowPauseModal(true)}
              title="Pause & Game Options"
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 active:scale-95 transition-all"
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
            title="View Allocated Attributes & Traits"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-100 tracking-tight group-hover:text-rose-400 transition-colors truncate">
                {player.name}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 font-sans">
              <span className="font-medium text-zinc-300 truncate">{player.profession}</span>
              <span className="text-zinc-600">•</span>
              <span className="shrink-0">Age {player.age}</span>
            </div>
          </button>

          {/* Status effects */}
          {player.statusEffects.length > 0 && (
            <div className="flex gap-1 overflow-x-auto py-0.5 shrink-0 ml-2">
              {player.statusEffects.map((eff, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60 uppercase tracking-wider animate-pulse"
                  title={eff.description}
                >
                  {eff.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Vitals Grid (Health, Hydration, Food, Virus) */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          {/* Health */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium"><Heart className="w-3 h-3 text-rose-500" /> HP</span>
              <span className="font-mono font-bold text-zinc-200">{player.health}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getHealthColor(player.health)}`}
                style={{ width: `${Math.max(0, player.health)}%` }}
              />
            </div>
          </div>

          {/* Hydration */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium"><Droplets className="w-3 h-3 text-cyan-400" /> H2O</span>
              <span className="font-mono font-bold text-zinc-200">{player.thirst}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{ width: `${Math.max(0, player.thirst)}%` }}
              />
            </div>
          </div>

          {/* Hunger */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium"><Utensils className="w-3 h-3 text-amber-400" /> Food</span>
              <span className="font-mono font-bold text-zinc-200">{player.hunger}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${Math.max(0, player.hunger)}%` }}
              />
            </div>
          </div>

          {/* Infection Risk */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium"><ShieldAlert className="w-3 h-3 text-emerald-400" /> Virus</span>
              <span className={`font-mono font-bold ${player.infectionRisk > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {player.infectionRisk}%
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${player.infectionRisk > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.max(5, player.infectionRisk)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 1. Survivor Profile & Attributes Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-start justify-between pb-2 border-b border-zinc-800">
                <div>
                  <h2 className="text-base font-bold text-zinc-100">{player.name}</h2>
                  <p className="text-xs text-zinc-400">{player.profession} • Age {player.age}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-zinc-400 bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80 space-y-1">
                <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> Spawn Location:
                </div>
                <div className="text-zinc-400 font-mono">{startingLocation.name} ({startingLocation.type})</div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
                  Skills
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-300"><Shield className="w-3.5 h-3.5 text-rose-500" /> Combat (Fighting)</span>
                    <span className="font-mono font-bold text-zinc-100">{player.combatSkill}/10</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-300"><HeartPulse className="w-3.5 h-3.5 text-cyan-400" /> First Aid</span>
                    <span className="font-mono font-bold text-zinc-100">{player.medicalSkill}/10</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-300"><Hammer className="w-3.5 h-3.5 text-amber-400" /> Crafting</span>
                    <span className="font-mono font-bold text-zinc-100">{player.craftingSkill}/10</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-300"><EyeOff className="w-3.5 h-3.5 text-indigo-400" /> Stealth (Sneaking)</span>
                    <span className="font-mono font-bold text-zinc-100">{player.stealthSkill}/10</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 col-span-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-zinc-300"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Fitness (Stamina)</span>
                    <span className="font-mono font-bold text-zinc-100">{player.fitnessSkill}/10</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
                  Perks & Flaws
                </span>
                {player.traits.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No special traits picked.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {player.traits.map(t => (
                      <span
                        key={t.id}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          t.type === 'positive'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        }`}
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Pause & Settings Modal (Prevents accidental return to title) */}
        {showPauseModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl animate-fade-in font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-bold text-zinc-100 uppercase font-mono tracking-wider">Game Paused</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Run Quick Info */}
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs space-y-1">
                <div className="font-bold text-zinc-200">{player.name}</div>
                <div className="text-zinc-400">{player.profession} • Age {player.age}</div>
                <div className="text-zinc-500 font-mono text-[11px]">HP: {player.health}% • Food: {player.hunger}% • H2O: {player.thirst}%</div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPauseModal(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Survival</span>
                </button>

                {onOpenMenu && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPauseModal(false);
                      onOpenMenu();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-rose-300 border border-zinc-700/60 font-semibold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
                  >
                    <LogOut className="w-4 h-4 text-zinc-400" />
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
