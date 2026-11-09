import React, { useState } from 'react';
import { 
  Heart, Droplets, Utensils, Biohazard, CloudRain, Sun, CloudFog, Snowflake, 
  Settings, Shield, HeartPulse, Hammer, EyeOff, Activity, Sparkles
} from 'lucide-react';
import { GameState, WeatherType } from '../types/game';

interface Props {
  state: GameState;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
  onOpenInfection?: () => void;
  compact?: boolean;
}


const getSeasonInfo = (day: number) => {
  const dayOfYear = day % 365;
  if (dayOfYear < 90) return { name: 'Spring', badge: '🌸 Spring', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' };
  if (dayOfYear < 180) return { name: 'Summer', badge: '☀️ Summer', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  if (dayOfYear < 270) return { name: 'Autumn', badge: '🍂 Autumn', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
  return { name: 'Winter', badge: '❄️ Winter', color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20' };
};

export const HeaderVitals: React.FC<Props> = ({ state, onOpenSettings, onOpenInfection, compact = false }) => {
  const { player, weather, temperatureCelsius, day, district, mutationStrain } = state;
  const seasonInfo = getSeasonInfo(day);
  const [showStrainIntel, setShowStrainIntel] = useState(false);

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

  const getSanityColor = (san: number) => {
    if (san > 65) return 'bg-purple-500';
    if (san > 25) return 'bg-amber-500';
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
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${seasonInfo.color} font-mono`}>
              {seasonInfo.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-zinc-300">
              {getWeatherIcon(weather)}
              <span className="text-[11px] capitalize">{weather.replace('_', ' ')}</span>
              <span className="text-zinc-500 text-[10px]">{temperatureCelsius}°C</span>
            </div>

            {/* Direct navigation to Settings Screen */}
            <button
              type="button"
              onClick={onOpenSettings}
              title="Settings & Options"
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-zinc-100 active:scale-95 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!compact && (
          <>
            {/* Character Identity & Status Badges */}
            <div className="space-y-1 pt-0.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                  <h1 className="text-base font-bold text-white tracking-tight truncate">
                    {player.name}
                  </h1>
                  <span className="text-xs text-zinc-400 truncate">
                    {player.profession} • Age {player.age}
                  </span>
                </div>

                {/* Status Effects & Infection Risk */}
                <div className="flex items-center gap-1 shrink-0">
                  {player.infectionRisk > 0 && (
                    <button
                      type="button"
                      onClick={onOpenInfection}
                      title="Open infection telemetry and triage"
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider animate-pulse hover:bg-rose-500/30 transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Biohazard className="w-2.5 h-2.5 text-rose-400" />
                      <span>Virus {player.infectionRisk}%</span>
                    </button>
                  )}

                  {player.statusEffects.map((eff, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider animate-pulse"
                      title={eff.description}
                    >
                      {eff.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* District, Strain & Traits - Compact Unified Row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {district && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-zinc-300 bg-white/5 border border-white/10 shrink-0">
                    📍 {district.name}
                  </span>
                )}
                {mutationStrain && (
                  <button
                    type="button"
                    onClick={() => setShowStrainIntel(!showStrainIntel)}
                    className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all flex items-center gap-1 active:scale-95 shrink-0"
                    title="View mutation strain rules"
                  >
                    <span>☣️ {mutationStrain.name}</span>
                  </button>
                )}
                {player.traits.map(t => (
                  <span
                    key={t.id}
                    className={'px-2 py-0.5 rounded-full text-[9px] font-semibold border shrink-0 ' + (
                      t.type === 'positive'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    )}
                    title={t.description}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Vitals Grid (Health, Sanity/Mind, Hydration, Food) */}
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

              {/* Sanity / Mind (Always visible and impactful!) */}
              <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> Mind</span>
                  <span className={`font-mono font-bold ${player.sanity <= 25 ? 'text-rose-400 animate-pulse' : 'text-purple-300'}`}>
                    {player.sanity}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getSanityColor(player.sanity)}`}
                    style={{ width: `${Math.max(0, player.sanity)}%` }}
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

              {/* Virus / Infection Progress */}
              <button
                type="button"
                onClick={onOpenInfection}
                title="View infection diagnosis, progression and triage"
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 rounded-2xl p-2 flex flex-col justify-between text-left transition-all active:scale-[0.98] group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Biohazard className={`w-3 h-3 transition-colors ${
                      player.infectionRisk === 0 ? 'text-emerald-400' :
                      player.infectionRisk < 30 ? 'text-amber-400 animate-pulse' :
                      player.infectionRisk < 70 ? 'text-orange-500 animate-pulse' :
                      'text-rose-500 animate-pulse'
                    }`} />
                    <span className="group-hover:text-zinc-200 transition-colors font-sans">Virus</span>
                  </span>
                  <span className={`font-mono font-bold ${
                    player.infectionRisk === 0 ? 'text-emerald-400' :
                    player.infectionRisk < 30 ? 'text-amber-400' :
                    player.infectionRisk < 70 ? 'text-orange-400' :
                    'text-rose-500 animate-pulse'
                  }`}>
                    {player.infectionRisk}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      player.infectionRisk === 0 ? 'bg-emerald-500/40' :
                      player.infectionRisk < 30 ? 'bg-amber-500' :
                      player.infectionRisk < 70 ? 'bg-orange-500' :
                      'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(player.infectionRisk === 0 ? 0 : 5, player.infectionRisk)}%` }}
                  />
                </div>
              </button>
            </div>

            {/* Tiny Responsive Attributes Row Directly Below Health Bars */}
            <div className="grid grid-cols-5 gap-1 pt-0.5 text-center text-[10px] font-mono">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-1 px-1 flex flex-col items-center justify-center" title="Combat: Damage and takedown power">
                <span className="text-zinc-500 text-[9px] uppercase tracking-tight flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-rose-500" /> Cbt
                </span>
                <span className="font-bold text-rose-400">{player.combatSkill}<span className="text-zinc-600 font-normal">/10</span></span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-1 px-1 flex flex-col items-center justify-center" title="First Aid: Heals +12 to +32 HP per bandage">
                <span className="text-zinc-500 text-[9px] uppercase tracking-tight flex items-center gap-0.5">
                  <HeartPulse className="w-2.5 h-2.5 text-cyan-400" /> Med
                </span>
                <span className="font-bold text-cyan-400">{player.medicalSkill}<span className="text-zinc-600 font-normal">/10</span></span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-1 px-1 flex flex-col items-center justify-center" title="Crafting: Fortifies barricades +15% to +35%">
                <span className="text-zinc-500 text-[9px] uppercase tracking-tight flex items-center gap-0.5">
                  <Hammer className="w-2.5 h-2.5 text-amber-400" /> Crf
                </span>
                <span className="font-bold text-amber-400">{player.craftingSkill}<span className="text-zinc-600 font-normal">/10</span></span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-1 px-1 flex flex-col items-center justify-center" title="Stealth: Scavenge success rate up to 95%">
                <span className="text-zinc-500 text-[9px] uppercase tracking-tight flex items-center gap-0.5">
                  <EyeOff className="w-2.5 h-2.5 text-indigo-400" /> Stl
                </span>
                <span className="font-bold text-indigo-400">{player.stealthSkill}<span className="text-zinc-600 font-normal">/10</span></span>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-1 px-1 flex flex-col items-center justify-center" title="Fitness: Escapes swarms and halves ambush damage">
                <span className="text-zinc-500 text-[9px] uppercase tracking-tight flex items-center gap-0.5">
                  <Activity className="w-2.5 h-2.5 text-emerald-400" /> Fit
                </span>
                <span className="font-bold text-emerald-400">{player.fitnessSkill}<span className="text-zinc-600 font-normal">/10</span></span>
              </div>
            </div>
          </>
        )}

        {/* Active Strain Tactical Intel Popup */}
        {showStrainIntel && mutationStrain && (
          <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1 animate-fade-in font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-300 flex items-center gap-1">
                <span>☣️ {mutationStrain.name} ({mutationStrain.codeName})</span>
              </span>
              <button
                type="button"
                onClick={() => setShowStrainIntel(false)}
                className="text-[10px] text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-zinc-300 leading-snug">
              <strong className="text-white">Active Rule:</strong> {mutationStrain.ruleSummary}
            </p>
            <p className="text-[10px] text-amber-300/90 leading-snug">
              <strong>Tactical Tip:</strong> {mutationStrain.tacticalTip}
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
