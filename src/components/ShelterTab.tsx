import React from 'react';
import { BaseShelter, GameState } from '../types/game';
import { Home, Shield, EyeOff, Thermometer, Droplet, Zap, Hammer } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRepairBarricade: () => void;
}

export const ShelterTab: React.FC<Props> = ({ gameState, onRepairBarricade }) => {
  const { shelter, inventory } = gameState;

  // Check if player has wood or tools to repair
  const hasPlanks = inventory.some(i => i.id.includes('wood') || i.id.includes('plank'));
  const canRepair = shelter.barricadeIntegrity < 100;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
      <div>
        <h2 className="text-base font-bold text-zinc-100">{shelter.name}</h2>
        <p className="text-xs text-zinc-400 capitalize">{shelter.type} • Secured Sanctuary</p>
      </div>

      {/* Main Base Meters */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <span className="text-zinc-500 block text-[10px] uppercase font-mono">Defense</span>
          <span className="text-sm font-bold text-zinc-200">{shelter.defenseRating}%</span>
        </div>

        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <EyeOff className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
          <span className="text-zinc-500 block text-[10px] uppercase font-mono">Stealth</span>
          <span className="text-sm font-bold text-zinc-200">{shelter.stealthRating}%</span>
        </div>

        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Thermometer className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <span className="text-zinc-500 block text-[10px] uppercase font-mono">Warmth</span>
          <span className="text-sm font-bold text-zinc-200">{shelter.warmthRating}%</span>
        </div>
      </div>

      {/* Barricade Structural Integrity */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Hammer className="w-4 h-4 text-zinc-400" /> Perimeter Barricades
          </span>
          <span className="font-mono font-bold text-zinc-300">{shelter.barricadeIntegrity}%</span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              shelter.barricadeIntegrity > 60
                ? 'bg-emerald-500'
                : shelter.barricadeIntegrity > 25
                ? 'bg-amber-500'
                : 'bg-rose-500 animate-pulse'
            }`}
            style={{ width: `${shelter.barricadeIntegrity}%` }}
          />
        </div>

        <button
          disabled={!canRepair}
          onClick={onRepairBarricade}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            canRepair
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 active:scale-98'
              : 'bg-zinc-900/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
          }`}
        >
          {canRepair ? 'Reinforce Barricades (+25% Integrity)' : 'Barricades Fully Fortified'}
        </button>
      </div>

      {/* Water Cistern & Catchment */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-cyan-400" /> Rooftop Rain Catchment
          </span>
          <span className="font-mono font-bold text-cyan-400">
            {shelter.storedRainwater} / {shelter.maxRainwater} L
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Automatically fills during rainy weather. Clean, unfiltered drinking water directly to your shelter.
        </p>
      </div>

      {/* Generator & Power Grid */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Emergency Generator
          </span>
          <span className="font-mono text-zinc-400">
            {shelter.generatorOperational ? `${shelter.fuelGallons} Gal Fuel` : 'Offline'}
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Provides light and powers refrigeration. Note: Running engines produce loud acoustic signatures that attract roaming hordes.
        </p>
      </div>
    </div>
  );
};
