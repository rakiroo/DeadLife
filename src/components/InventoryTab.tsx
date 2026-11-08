import React, { useState } from 'react';
import { InventoryItem, GameState, CampMember, CampRole } from '../types/game';
import { 
  Utensils, Droplets, HeartPulse, Wrench, Shield, Cross, 
  Search, Bed, MessageSquare, UserMinus, Package, Users
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onUseItem: (item: InventoryItem) => void;
  onRoleChange?: (memberId: string, newRole: CampRole) => void;
  onTalkSurvivor?: (memberId: string) => void;
  onGiftSurvivor?: (memberId: string) => void;
  onExileSurvivor?: (memberId: string) => void;
}

type ItemFilter = 'all' | 'food' | 'water' | 'medical' | 'materials' | 'weapons';

export const InventoryTab: React.FC<Props> = ({ 
  gameState, 
  onUseItem,
  onRoleChange,
  onTalkSurvivor,
  onGiftSurvivor,
  onExileSurvivor
}) => {
  const [filter, setFilter] = useState<ItemFilter>('all');
  const [recentAction, setRecentAction] = useState<string | null>(null);

  const { inventory, campMembers } = gameState;
  const totalConsumers = Math.max(1, campMembers.length + 1);

  // Compute resource totals
  const totalFood = inventory.filter(i => i.category === 'food').reduce((sum, i) => sum + i.quantity, 0);
  const totalWater = inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);
  const totalMeds = inventory.filter(i => i.category === 'medical').reduce((sum, i) => sum + i.quantity, 0);
  const totalMaterials = inventory.filter(i => i.category === 'resource' || i.category === 'tool').reduce((sum, i) => sum + i.quantity, 0);
  const totalWeapons = inventory.filter(i => i.category === 'weapon').reduce((sum, i) => sum + i.quantity, 0);

  const daysOfFood = Math.floor(totalFood / totalConsumers);
  const daysOfWater = Math.floor(totalWater / totalConsumers);

  const triggerCampAction = (text: string, callback?: () => void) => {
    if (callback) callback();
    setRecentAction(text);
    setTimeout(() => setRecentAction(null), 3000);
  };

  const ROLES: { id: CampRole; label: string; icon: React.ReactNode }[] = [
    { id: 'guard', label: 'Guard', icon: <Shield className="w-3 h-3" /> },
    { id: 'scavenger', label: 'Scout', icon: <Search className="w-3 h-3" /> },
    { id: 'medic', label: 'Medic', icon: <HeartPulse className="w-3 h-3" /> },
    { id: 'craftsman', label: 'Build', icon: <Wrench className="w-3 h-3" /> },
    { id: 'sickbay', label: 'Quarantine', icon: <Bed className="w-3 h-3" /> },
  ];

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
      default:
        return <Wrench className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const isUsable = (item: InventoryItem) => {
    return item.category === 'food' || item.category === 'water' || item.category === 'medical';
  };

  const filteredItems = inventory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'food') return item.category === 'food';
    if (filter === 'water') return item.category === 'water';
    if (filter === 'medical') return item.category === 'medical';
    if (filter === 'materials') return item.category === 'resource' || item.category === 'tool';
    if (filter === 'weapons') return item.category === 'weapon';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans select-none">
      {/* Title */}
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">Supplies & Stockpile</h2>
        <p className="text-xs text-zinc-400">Inventory levels and survivor camp sustenance.</p>
      </div>

      {recentAction && (
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-xs text-white font-mono text-center animate-fade-in">
          {recentAction}
        </div>
      )}

      {/* 1. RESOURCE TOTALS DASHBOARD (TINY & CLEAR AT THE TOP) */}
      <div className="grid grid-cols-3 gap-2">
        {/* Food */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Utensils className="w-3.5 h-3.5 text-amber-400" /> Food</span>
            <span className="font-mono text-[10px] text-zinc-500">
              {daysOfFood}d left
            </span>
          </div>
          <div className="font-mono text-base font-bold text-amber-300">
            {totalFood} <span className="text-[10px] font-normal text-zinc-500">rations</span>
          </div>
        </div>

        {/* Water */}
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

        {/* Medical */}
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

        {/* Materials */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Wrench className="w-3.5 h-3.5 text-zinc-300" /> Parts</span>
          </div>
          <div className="font-mono text-sm font-bold text-zinc-200">
            {totalMaterials} <span className="text-[10px] font-normal text-zinc-500">mats</span>
          </div>
        </div>

        {/* Weapons */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Shield className="w-3.5 h-3.5 text-indigo-400" /> Gear</span>
          </div>
          <div className="font-mono text-sm font-bold text-indigo-300">
            {totalWeapons} <span className="text-[10px] font-normal text-zinc-500">arms</span>
          </div>
        </div>

        {/* Camp Burn */}
        <div className="bg-white/[0.04] border border-white/5 rounded-2xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-emerald-400" /> Group</span>
          </div>
          <div className="font-mono text-xs font-bold text-zinc-300">
            -{totalConsumers} <span className="text-[9px] font-normal text-zinc-500">/day</span>
          </div>
        </div>
      </div>

      {/* 2. CAMP SURVIVORS SECTION (WHEN CAMP HAS MEMBERS) */}
      {campMembers.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Camp Members ({campMembers.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Consumes -{campMembers.length} food/water daily
            </span>
          </div>

          <div className="space-y-2.5">
            {campMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">{member.name}</h3>
                    <p className="text-[11px] text-zinc-400">{member.profession} • Age {member.age}</p>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">HP {member.health}%</span>
                    <span className="text-zinc-600 mx-1">•</span>
                    <span className="text-cyan-400 font-bold">Trust {member.trust}%</span>
                  </div>
                </div>

                {/* Role selection & actions */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                  <div className="flex gap-1 overflow-x-auto py-0.5">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => onRoleChange && onRoleChange(member.id, r.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                          member.role === r.id
                            ? 'bg-white text-zinc-950 font-bold shadow-sm'
                            : 'bg-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {r.icon}
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => triggerCampAction('Checked in with ' + member.name + ' (+Trust & Sanity).', () => onTalkSurvivor && onTalkSurvivor(member.id))}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300"
                      title="Talk & Check In"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={totalFood <= 0}
                      onClick={() => triggerCampAction('Shared food rations with ' + member.name + ' (+Trust & Health).', () => onGiftSurvivor && onGiftSurvivor(member.id))}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 disabled:opacity-30"
                      title="Share Food"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                    </button>

                    {member.trust < 40 && (
                      <button
                        type="button"
                        onClick={() => triggerCampAction('Exiled ' + member.name + ' from the camp.', () => onExileSurvivor && onExileSurvivor(member.id))}
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                        title="Exile from Camp"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ITEM INVENTORY (WITH QUICK CATEGORY FILTER) */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> Backpack Items ({inventory.reduce((a, b) => a + b.quantity, 0)})
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1 overflow-x-auto py-1 no-scrollbar text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('food')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'food'
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-amber-300'
            }`}
          >
            Food ({totalFood})
          </button>
          <button
            type="button"
            onClick={() => setFilter('water')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'water'
                ? 'bg-cyan-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-cyan-300'
            }`}
          >
            Water ({totalWater})
          </button>
          <button
            type="button"
            onClick={() => setFilter('medical')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'medical'
                ? 'bg-rose-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-rose-300'
            }`}
          >
            Meds ({totalMeds})
          </button>
          <button
            type="button"
            onClick={() => setFilter('materials')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'materials'
                ? 'bg-zinc-200 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Materials ({totalMaterials})
          </button>
          <button
            type="button"
            onClick={() => setFilter('weapons')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
              filter === 'weapons'
                ? 'bg-indigo-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-indigo-300'
            }`}
          >
            Weapons ({totalWeapons})
          </button>
        </div>

        {/* Item Cards List */}
        {filteredItems.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs">
            No items in this category.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
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

                {isUsable(item) && (
                  <button
                    type="button"
                    onClick={() => onUseItem(item)}
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
