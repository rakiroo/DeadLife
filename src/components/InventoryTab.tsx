import React from 'react';
import { InventoryItem, Survivor, GameState } from '../types/game';
import { Utensils, Droplets, HeartPulse, Wrench, Shield, Cross } from 'lucide-react';

interface Props {
  gameState: GameState;
  onUseItem: (item: InventoryItem) => void;
}

export const InventoryTab: React.FC<Props> = ({ gameState, onUseItem }) => {
  const { inventory, player } = gameState;

  const getCategoryIcon = (cat: InventoryItem['category']) => {
    switch (cat) {
      case 'food':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'medical':
        return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'weapon':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      default:
        return <Wrench className="w-4 h-4 text-zinc-400" />;
    }
  };

  const isUsable = (item: InventoryItem) => {
    if (item.category === 'food' || item.category === 'water' || item.category === 'medical') {
      return true;
    }
    return false;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Backpack & Storage</h2>
          <p className="text-xs text-zinc-400">Total items: {inventory.reduce((acc, i) => acc + i.quantity, 0)}</p>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-sm">Your inventory is completely bare.</p>
          <p className="text-xs mt-1">Go on a scavenge run before starvation hits.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60 border border-zinc-700/50 shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-200">{item.name}</span>
                    <span className="text-xs font-mono font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded">
                      x{item.quantity}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 font-sans leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>

              {isUsable(item) && (
                <button
                  onClick={() => onUseItem(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shrink-0 active:scale-95 transition-all"
                >
                  {item.category === 'food' ? 'Eat' : item.category === 'water' ? 'Drink' : 'Use'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
