import React, { useState } from 'react';
import { InventoryItem, GameState } from '../types/game';
import { 
  Utensils, Droplets, HeartPulse, Wrench, Shield, 
  Package, Sparkles, AlertCircle
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onUseItem: (item: InventoryItem) => void;
  onEquipWeapon?: (item: InventoryItem) => void;
}

export const InventoryTab: React.FC<Props> = ({ 
  gameState, 
  onUseItem,
  onEquipWeapon
}) => {
  const [consumableFilter, setConsumableFilter] = useState<'all' | 'food' | 'water' | 'medical'>('all');
  const [stockpileFilter, setStockpileFilter] = useState<'all' | 'weapon' | 'tool' | 'resource'>('all');
  const [recentAction, setRecentAction] = useState<string | null>(null);

  const { inventory, campMembers, player } = gameState;
  const equippedWeapon = player.equippedWeapon || inventory.find(i => i.id === player.equippedWeaponId);
  const totalConsumers = Math.max(1, campMembers.length + 1);

  // Compute resource totals
  const totalFood = inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
  const totalWater = inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);
  const totalMeds = inventory.filter(i => i.category === 'medical').reduce((sum, i) => sum + i.quantity, 0);
  const totalMaterials = inventory.filter(i => i.category === 'resource' || i.category === 'tool').reduce((sum, i) => sum + i.quantity, 0);
  const totalWeapons = inventory.filter(i => i.category === 'weapon').reduce((sum, i) => sum + i.quantity, 0);

  const daysOfFood = Math.floor(totalFood / totalConsumers);
  const daysOfWater = Math.floor(totalWater / totalConsumers);

  const handleUseItemWithFeedback = (item: InventoryItem) => {
    onUseItem(item);
    let actionDesc = 'Used ' + item.name + '.';
    if (item.category === 'food') actionDesc = 'Consumed ' + item.name + ' (+Hunger).';
    if (item.category === 'water') actionDesc = 'Drank ' + item.name + ' (+Hydration).';
    if (item.category === 'medical') actionDesc = 'Applied ' + item.name + ' (+Medical).';
    setRecentAction(actionDesc);
    setTimeout(() => setRecentAction(null), 3000);
  };

  const getCategoryIcon = (cat: InventoryItem['category']) => {
    switch (cat) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-cyan-400" />;
      case 'medical':
        return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
      case 'weapon':
        return <Shield className="w-3.5 h-3.5 text-indigo-400" />;
      case 'tool':
        return <Wrench className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Package className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  // Consumables (Food, Water, Medical)
  const consumableItems = inventory.filter(i => i.category === 'food' || i.category === 'water' || i.category === 'medical');
  const filteredConsumables = consumableItems.filter(item => {
    if (consumableFilter === 'all') return true;
    return item.category === consumableFilter;
  });

  // Gear & Materials (Weapons, Tools, Resources)
  const nonConsumableItems = inventory.filter(i => i.category === 'weapon' || i.category === 'tool' || i.category === 'resource');
  const filteredStockpile = nonConsumableItems.filter(item => {
    if (stockpileFilter === 'all') return true;
    return item.category === stockpileFilter;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans select-none pb-24">
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Supplies & Stockpile</h2>
        <p className="text-xs text-zinc-400">Total survival provisions, gathered gear, and stored equipment.</p>
      </div>

      {recentAction && (
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white font-mono text-center animate-fade-in">
          {recentAction}
        </div>
      )}

      {/* 1. RESOURCE TOTALS DASHBOARD */}
      <div className="grid grid-cols-3 gap-2">
        {/* Food Total */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Utensils className="w-3.5 h-3.5 text-amber-400" /> Food</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {daysOfFood}d left
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-base font-bold text-amber-300">
              {totalFood} <span className="text-[10px] font-normal text-zinc-500">rations</span>
            </div>
            <span className="text-[10px] font-mono font-semibold text-zinc-400" title="Player Nourishment">
              Hunger {player.hunger}%
            </span>
          </div>
        </div>

        {/* Water Total */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {daysOfWater}d left
            </span>
          </div>
          <div className="font-mono text-base font-bold text-cyan-300">
            {totalWater} <span className="text-[10px] font-normal text-zinc-500">liters</span>
          </div>
        </div>

        {/* Medical Total */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><HeartPulse className="w-3.5 h-3.5 text-rose-400" /> Meds</span>
            <span className="font-mono text-[10px] text-zinc-500">
              stock
            </span>
          </div>
          <div className="font-mono text-base font-bold text-rose-300">
            {totalMeds} <span className="text-[10px] font-normal text-zinc-500">kits</span>
          </div>
        </div>

        {/* Materials Total */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Wrench className="w-3.5 h-3.5 text-zinc-300" /> Materials</span>
          </div>
          <div className="font-mono text-sm font-bold text-zinc-200">
            {totalMaterials} <span className="text-[10px] font-normal text-zinc-500">parts</span>
          </div>
        </div>

        {/* Weapons Total */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Shield className="w-3.5 h-3.5 text-indigo-400" /> Arms</span>
          </div>
          <div className="font-mono text-sm font-bold text-indigo-300">
            {totalWeapons} <span className="text-[10px] font-normal text-zinc-500">gear</span>
          </div>
        </div>

        {/* Daily Group Burn */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Burn</span>
          </div>
          <div className="font-mono text-xs font-bold text-zinc-300">
            -{totalConsumers} <span className="text-[9px] font-normal text-zinc-500">/day</span>
          </div>
        </div>
      </div>

      {/* 2. CONSUMABLE PROVISIONS (EAT / DRINK / HEAL) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-amber-400" /> Consumable Rations & Medicine
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {consumableItems.length} items ready
          </span>
        </div>

        {/* Consumable filter pills */}
        <div className="flex gap-1 overflow-x-auto py-1 no-scrollbar text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setConsumableFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              consumableFilter === 'all'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All Provisions ({consumableItems.length})
          </button>
          <button
            type="button"
            onClick={() => setConsumableFilter('food')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              consumableFilter === 'food'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-amber-300'
            }`}
          >
            Food ({totalFood})
          </button>
          <button
            type="button"
            onClick={() => setConsumableFilter('water')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              consumableFilter === 'water'
                ? 'bg-cyan-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-cyan-300'
            }`}
          >
            Water ({totalWater})
          </button>
          <button
            type="button"
            onClick={() => setConsumableFilter('medical')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              consumableFilter === 'medical'
                ? 'bg-rose-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-rose-300'
            }`}
          >
            Meds ({totalMeds})
          </button>
        </div>

        {filteredConsumables.length === 0 ? (
          <div className="p-5 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs flex flex-col items-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-zinc-600" />
            <span>No consumable food, water, or medicine in stockpile. Scavenge landmarks or search street vehicles in Activities!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConsumables.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-zinc-300 bg-white/10 px-1.5 py-0.2 rounded-full shrink-0">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUseItemWithFeedback(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 active:scale-95 transition-all shadow-sm ${
                    item.category === 'food'
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold'
                      : item.category === 'water'
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold'
                      : 'bg-rose-500 hover:bg-rose-400 text-white font-bold'
                  }`}
                >
                  {item.category === 'food' ? 'Eat' : item.category === 'water' ? 'Drink' : 'Use'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. STOCKPILE & ARSENAL (WEAPONS, TOOLS & CRAFTING MATERIALS) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-zinc-300" /> Equipment & Materials Locker
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            {nonConsumableItems.length} stored items
          </span>
        </div>

        {/* Stockpile filter pills */}
        <div className="flex gap-1 overflow-x-auto py-1 no-scrollbar text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setStockpileFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              stockpileFilter === 'all'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All Equipment ({nonConsumableItems.length})
          </button>
          <button
            type="button"
            onClick={() => setStockpileFilter('weapon')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              stockpileFilter === 'weapon'
                ? 'bg-indigo-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-indigo-300'
            }`}
          >
            Weapons & Ammo ({inventory.filter(i => i.category === 'weapon').length})
          </button>
          <button
            type="button"
            onClick={() => setStockpileFilter('tool')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              stockpileFilter === 'tool'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-amber-300'
            }`}
          >
            Tools ({inventory.filter(i => i.category === 'tool').length})
          </button>
          <button
            type="button"
            onClick={() => setStockpileFilter('resource')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              stockpileFilter === 'resource'
                ? 'bg-emerald-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-emerald-300'
            }`}
          >
            Materials & Ammo ({inventory.filter(i => i.category === 'resource').length})
          </button>
        </div>

        {filteredStockpile.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs">
            No equipment or materials match this category.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStockpile.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-zinc-300 bg-white/10 px-1.5 py-0.2 rounded-full shrink-0">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-lg shrink-0">
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

