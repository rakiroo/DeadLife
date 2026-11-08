import React from 'react';
import { GameState } from '../types/game';
import { Cross, ShoppingBag, ShieldAlert, Wrench, Compass, ArrowUpRight, Users } from 'lucide-react';

interface Props {
  gameState: GameState;
  onLaunchExpedition: (locationId: string) => void;
}

export const ScavengeTab: React.FC<Props> = ({ gameState, onLaunchExpedition }) => {
  const LOCATIONS = [
    {
      id: 'pharmacy',
      title: 'Mercy Memorial Pharmacy',
      distance: '0.8 miles away',
      danger: 'Moderate Danger',
      dangerColor: 'text-amber-400',
      loot: 'Antibiotics, Trauma Kits, Painkillers',
      icon: <Cross className="w-5 h-5 text-rose-400" />
    },
    {
      id: 'supermarket',
      title: 'Costway Supermarket Depot',
      distance: '1.4 miles away',
      danger: 'High Danger',
      dangerColor: 'text-rose-400',
      loot: 'Canned Food, Bottled Water, Batteries',
      icon: <ShoppingBag className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'police_precinct',
      title: '3rd Precinct Police Station',
      distance: '2.1 miles away',
      danger: 'Extreme Danger',
      dangerColor: 'text-rose-500 font-bold',
      loot: 'Shotguns, 9mm Ammo, Body Armor',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-400" />
    },
    {
      id: 'hardware_store',
      title: 'Pioneer Lumber & Hardware',
      distance: '0.5 miles away',
      danger: 'Low Danger',
      dangerColor: 'text-emerald-400',
      loot: 'Lumber Planks, Nails, Crowbars, Duct Tape',
      icon: <Wrench className="w-5 h-5 text-zinc-300" />
    },
    {
      id: 'survivor_outpost',
      title: 'St. Michael Church Sanctuary (Survivor Camp)',
      distance: '1.6 miles away',
      danger: 'Other Survivors',
      dangerColor: 'text-cyan-400 font-bold',
      loot: 'Meet Companions, Barter Rations, Rare Supplies',
      icon: <Users className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
      <div>
        <h2 className="text-base font-bold text-zinc-100">Expeditions & Scavenging</h2>
        <p className="text-xs text-zinc-400">Leave the wire to gather life-saving supplies.</p>
      </div>

      <div className="space-y-3">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60 shrink-0">
                  {loc.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{loc.title}</h3>
                  <p className="text-xs text-zinc-500">{loc.distance}</p>
                </div>
              </div>
              <span className={`text-[11px] font-mono uppercase ${loc.dangerColor}`}>
                {loc.danger}
              </span>
            </div>

            <div className="text-xs text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60 font-mono">
              <span className="text-zinc-500 block text-[10px] uppercase">Expected Haul:</span>
              <span className="text-zinc-300">{loc.loot}</span>
            </div>

            <button
              onClick={() => onLaunchExpedition(loc.id)}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-md"
            >
              <span>Depart on Expedition</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
