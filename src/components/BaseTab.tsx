import React, { useState } from 'react';
import { GameState, CampMember, CampRole } from '../types/game';
import { 
  Home, Users, Shield, HeartPulse, Hammer, Search, Bed, MessageSquare, 
  Utensils, UserMinus, Sparkles, Droplets, Edit3, Award, DoorOpen, Scroll, Check
} from 'lucide-react';

interface Props {
  gameState: GameState;
  onEstablishBase: (name: string, type: string) => void;
  onRenameBase: (name: string) => void;
  onRoleChange: (memberId: string, newRole: CampRole) => void;
  onTalkSurvivor: (memberId: string) => void;
  onPraiseSurvivor?: (memberId: string) => void;
  onGiftSurvivor: (memberId: string) => void;
  onExileSurvivor: (memberId: string) => void;
  onRepairBarricade: () => void;
  onBuildRoom: (roomType: 'cots' | 'bunk' | 'cabin') => void;
  onAssignRoom: (memberId: string, roomId: string) => void;
  onUpgradeFacility: (facilityId: 'water_collector' | 'greenhouse' | 'infirmary' | 'defense') => void;
  onSetRationPolicy: (policy: 'full' | 'standard' | 'half') => void;
  onSetSecurityProtocol: (protocol: 'open' | 'quarantine' | 'lockdown') => void;
}

export const BaseTab: React.FC<Props> = ({
  gameState,
  onEstablishBase,
  onRenameBase,
  onRoleChange,
  onTalkSurvivor,
  onPraiseSurvivor,
  onGiftSurvivor,
  onExileSurvivor,
  onRepairBarricade,
  onBuildRoom,
  onAssignRoom,
  onUpgradeFacility,
  onSetRationPolicy,
  onSetSecurityProtocol
}) => {
  const { shelter, campMembers, inventory, player } = gameState;
  const [subView, setSubView] = useState<'survivors' | 'housing' | 'facilities' | 'laws'>('survivors');
  const [selectedMember, setSelectedMember] = useState<CampMember | null>(null);
  const [roomAssignModalMember, setRoomAssignModalMember] = useState<CampMember | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newBaseName, setNewBaseName] = useState(shelter.name || 'Sanctuary Haven');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const hasFood = inventory.some(i => i.category === 'food' && i.quantity > 0);
  const woodCount = inventory.filter(i => i.id.includes('wood') || i.id.includes('plank')).reduce((sum, i) => sum + i.quantity, 0);
  const nailsCount = inventory.filter(i => i.id.includes('nail')).reduce((sum, i) => sum + i.quantity, 0);
  const waterCount = inventory.filter(i => i.category === 'water').reduce((sum, i) => sum + i.quantity, 0);
  const medsCount = inventory.filter(i => i.category === 'medical').reduce((sum, i) => sum + i.quantity, 0);

  // Compute total bed capacity
  const defaultBedCapacity = shelter.rooms && shelter.rooms.length > 0 
    ? shelter.rooms.reduce((sum, r) => sum + r.capacity, 0)
    : (shelter.maxSurvivors || (shelter.isEstablished ? 4 : 2));
  
  const totalResidents = campMembers.length + 1; // including player
  const occupiedBeds = totalResidents;
  const vacantBeds = Math.max(0, defaultBedCapacity - occupiedBeds);
  const campMorale = shelter.morale ?? 75;
  const rationPolicy = shelter.rationPolicy ?? 'standard';
  const securityProtocol = shelter.securityProtocol ?? 'open';

  const triggerFeedback = (msg: string, cb?: () => void) => {
    if (cb) cb();
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const ROLES: { id: CampRole; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'guard', label: 'Guard', desc: 'Maintains defense & defends against night raids', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'scavenger', label: 'Scout', desc: 'Actively scavenges food, ammo & resources daily', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'medic', label: 'Medic', desc: 'Treats wounded & sick camp members daily', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'craftsman', label: 'Builder', desc: 'Maintains barricades and constructs rooms', icon: <Hammer className="w-3.5 h-3.5" /> },
    { id: 'sickbay', label: 'Quarantine', desc: 'Isolated for medical monitoring', icon: <Bed className="w-3.5 h-3.5" /> },
  ];

  // Default rooms if none initialized
  const rooms = shelter.rooms && shelter.rooms.length > 0 ? shelter.rooms : [
    {
      id: 'room_cots_1',
      name: 'Makeshift Cots & Lean-To',
      type: 'cots' as const,
      capacity: 2,
      comfort: 20,
      assignedMemberIds: campMembers.slice(0, 1).map(m => m.id)
    },
    {
      id: 'room_bunk_1',
      name: 'Main Fortified Bunkhouse',
      type: 'bunk' as const,
      capacity: 2,
      comfort: 45,
      assignedMemberIds: campMembers.slice(1, 3).map(m => m.id)
    }
  ];

  // UNCLAIMED BASE / ESTABLISHMENT VIEW
  if (!shelter.isEstablished && campMembers.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full font-sans select-none">
        <div className="p-5 bg-white/[0.04] border border-white/10 rounded-3xl space-y-3.5 text-center shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">No Base Sanctuary Established</h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              You are currently wandering exposed ruins. Establish a permanent sanctuary to welcome survivors, construct living cabins, assign daily scavenging shifts, and enact camp laws.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onEstablishBase(gameState.startingLocation.name || 'Sanctuary Haven', 'Fortified Haven')}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim & Establish Base at {gameState.startingLocation.name}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans select-none">
      {/* ACTION TOAST */}
      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono text-center animate-fade-in shadow-sm">
          {actionFeedback}
        </div>
      )}

      {/* BASE SANCTUARY HERO CARD */}
      <div className="p-4 bg-white/[0.04] border border-white/10 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            {isRenaming ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newBaseName}
                  onChange={(e) => setNewBaseName(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded-xl px-2.5 py-1 text-xs text-white font-bold w-full focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    onRenameBase(newBaseName.trim() || 'Sanctuary Haven');
                    setIsRenaming(false);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base font-bold text-white tracking-tight truncate">
                  {shelter.name || 'Sanctuary Haven'}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsRenaming(true)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                  title="Rename Base"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Settlement Overseer: <span className="text-zinc-200 font-medium">{player.name}</span> ({player.profession})
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              Morale {campMorale}%
            </span>
          </div>
        </div>

        {/* Vital Settlement Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
          {/* Housing Capacity */}
          <div className="p-2.5 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 uppercase font-mono">
              <Bed className="w-3 h-3 text-cyan-400" />
              <span>Housing</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-0.5">
              {occupiedBeds} / {defaultBedCapacity} <span className="text-[10px] font-normal text-zinc-400">beds</span>
            </div>
            <div className="text-[9px] font-mono text-emerald-400 mt-0.5">
              {vacantBeds > 0 ? `+${vacantBeds} vacant` : 'Full (Need room)'}
            </div>
          </div>

          {/* Defense Score */}
          <div className="p-2.5 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 uppercase font-mono">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Defense</span>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
              {shelter.defenseRating || 35}%
            </div>
            <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
              Guarded
            </div>
          </div>

          {/* Barricade Integrity */}
          <div className="p-2.5 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 uppercase font-mono">
              <Hammer className="w-3 h-3 text-amber-400" />
              <span>Walls</span>
            </div>
            <div className="font-mono text-sm font-bold text-amber-300 mt-0.5">
              {shelter.barricadeIntegrity}%
            </div>
            <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
              Fortified
            </div>
          </div>
        </div>

        {/* Quick Barricade Reinforce Button */}
        {shelter.barricadeIntegrity < 100 && (
          <button
            type="button"
            onClick={() => triggerFeedback('Reinforced perimeter barricades (+25% integrity).', onRepairBarricade)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>Reinforce Perimeter Barricades (+25% Integrity)</span>
          </button>
        )}
      </div>

      {/* SUB-VIEW PILL TABS */}
      <div className="flex gap-1 overflow-x-auto py-0.5 no-scrollbar text-[11px] font-medium border-b border-white/5 pb-2">
        <button
          type="button"
          onClick={() => setSubView('survivors')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
            subView === 'survivors'
              ? 'bg-white text-zinc-950 font-bold shadow-sm'
              : 'bg-white/5 text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Survivors ({totalResidents})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubView('housing')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
            subView === 'housing'
              ? 'bg-white text-zinc-950 font-bold shadow-sm'
              : 'bg-white/5 text-zinc-400 hover:text-white'
          }`}
        >
          <Bed className="w-3.5 h-3.5" />
          <span>Housing & Rooms ({rooms.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubView('facilities')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
            subView === 'facilities'
              ? 'bg-white text-zinc-950 font-bold shadow-sm'
              : 'bg-white/5 text-zinc-400 hover:text-white'
          }`}
        >
          <Hammer className="w-3.5 h-3.5" />
          <span>Facilities</span>
        </button>

        <button
          type="button"
          onClick={() => setSubView('laws')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
            subView === 'laws'
              ? 'bg-white text-zinc-950 font-bold shadow-sm'
              : 'bg-white/5 text-zinc-400 hover:text-white'
          }`}
        >
          <Scroll className="w-3.5 h-3.5" />
          <span>Decrees & Laws</span>
        </button>
      </div>

      {/* 1. SUB-VIEW: SURVIVORS & COMMUNITY */}
      {subView === 'survivors' && (
        <div className="space-y-3">
          {/* Overseer Card (You!) */}
          <div className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
                    Settlement Mayor
                  </span>
                  <h3 className="text-xs font-bold text-white">{player.name} (You)</h3>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">{player.profession} â€¢ Age {player.age}</p>
              </div>
              <div className="font-mono text-[11px] text-emerald-400 font-bold">
                HP {player.health}% â€¢ Mind {player.sanity}%
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5 flex-wrap">
              <span className="text-zinc-500">Skills:</span>
              <span className="text-rose-400 font-semibold">Cbt {player.combatSkill}</span>
              <span className="text-zinc-600">â€¢</span>
              <span className="text-cyan-400 font-semibold">Med {player.medicalSkill}</span>
              <span className="text-zinc-600">â€¢</span>
              <span className="text-amber-400 font-semibold">Crf {player.craftingSkill}</span>
              <span className="text-zinc-600">â€¢</span>
              <span className="text-indigo-400 font-semibold">Stl {player.stealthSkill}</span>
              <span className="text-zinc-600">â€¢</span>
              <span className="text-emerald-400 font-semibold">Fit {player.fitnessSkill}</span>
            </div>
          </div>

          {/* Camp Members */}
          {campMembers.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs space-y-2">
              <Users className="w-6 h-6 text-zinc-600 mx-auto" />
              <p className="font-semibold text-zinc-400">No other survivors in camp yet.</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Explore landmarks (Pharmacy, Supermarket, Outpost Church) or answer strangers knocking at your gate during rain to welcome new companions!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {campMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between cursor-pointer" onClick={() => setSelectedMember(member)}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                        {member.relation && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-white/10 text-amber-300 border border-white/10 shrink-0">
                            {member.relation}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300">Tap for Bio</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{member.profession} â€¢ Age {member.age}</p>
                      
                      {(member.combatSkill !== undefined) && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-1 flex-wrap">
                          <span className="text-zinc-500">Skills:</span>
                          <span className="text-rose-400 font-semibold">Cbt {member.combatSkill}</span>
                          <span className="text-zinc-600">â€¢</span>
                          <span className="text-cyan-400 font-semibold">Med {member.medicalSkill}</span>
                          <span className="text-zinc-600">â€¢</span>
                          <span className="text-amber-400 font-semibold">Crf {member.craftingSkill}</span>
                          <span className="text-zinc-600">â€¢</span>
                          <span className="text-indigo-400 font-semibold">Stl {member.stealthSkill}</span>
                          <span className="text-zinc-600">â€¢</span>
                          <span className="text-emerald-400 font-semibold">Fit {member.fitnessSkill}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right font-mono text-[11px] shrink-0">
                      <span className="text-emerald-400 font-bold">HP {member.health}%</span>
                      <span className="text-zinc-600 mx-1">â€¢</span>
                      <span className="text-cyan-400 font-bold">Trust {member.trust}%</span>
                    </div>
                  </div>

                  {/* Role Selector & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                    {/* Role Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {ROLES.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => onRoleChange(member.id, r.id)}
                          title={r.desc}
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

                    {/* Interactive Action Buttons */}
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => triggerFeedback(`Checked in with ${member.name} (+Trust & Sanity).`, () => onTalkSurvivor(member.id))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300"
                        title="Talk & Check In"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {onPraiseSurvivor && (
                        <button
                          type="button"
                          onClick={() => triggerFeedback(`Commended ${member.name} for their dedicated efforts (+Morale & Productivity).`, () => onPraiseSurvivor(member.id))}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300"
                          title="Praise & Commend"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setRoomAssignModalMember(member)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300"
                        title="Assign Living Quarters"
                      >
                        <DoorOpen className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={!hasFood}
                        onClick={() => triggerFeedback(`Shared food rations with ${member.name} (+Trust & Health).`, () => onGiftSurvivor(member.id))}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 disabled:opacity-30"
                        title="Share Food Rations"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                      </button>

                      {member.trust < 40 && (
                        <button
                          type="button"
                          onClick={() => triggerFeedback(`Exiled ${member.name} from the camp.`, () => onExileSurvivor(member.id))}
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
          )}
        </div>
      )}

      {/* 2. SUB-VIEW: HOUSING & ROOMS */}
      {subView === 'housing' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-cyan-400" /> Living Quarters & Assigned Rooms
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {occupiedBeds} of {defaultBedCapacity} Beds Filled
            </span>
          </div>

          {/* Current Rooms List */}
          <div className="space-y-2.5">
            {rooms.map((room) => {
              const assignedMembers = campMembers.filter(m => room.assignedMemberIds && room.assignedMemberIds.includes(m.id));
              return (
                <div key={room.id} className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                        {room.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Capacity: {assignedMembers.length} / {room.capacity} beds filled â€¢ Comfort {room.comfort}%
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {room.capacity - assignedMembers.length} Open
                    </span>
                  </div>

                  {/* Residents in this room */}
                  <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-[11px] text-zinc-300 space-y-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">Current Roommates:</span>
                    {assignedMembers.length === 0 ? (
                      <span className="text-zinc-500 italic text-[10px]">No survivors currently assigned.</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {assignedMembers.map(m => (
                          <span key={m.id} className="px-2 py-0.5 rounded-lg bg-white/10 text-white font-medium text-[10px] flex items-center gap-1">
                            <span>{m.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand Housing Section */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold px-1 block">
              Construct New Quarters (+Bed Capacity)
            </span>

            <div className="space-y-2">
              {/* Option 1: Lean-To */}
              <div className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white">Makeshift Lean-To</h5>
                  <p className="text-[10px] text-zinc-400">+1 Bed Capacity (Requires 1 Wood Plank)</p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 1}
                  onClick={() => triggerFeedback('Constructed Makeshift Lean-To (+1 Bed Capacity).', () => onBuildRoom('cots'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    woodCount >= 1
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Build (1 Wood)
                </button>
              </div>

              {/* Option 2: Reinforced Bunkhouse */}
              <div className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white">Reinforced Bunk Room</h5>
                  <p className="text-[10px] text-zinc-400">+2 Bed Capacity (Requires 3 Wood, 10 Nails)</p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 3 || nailsCount < 10}
                  onClick={() => triggerFeedback('Constructed Reinforced Bunk Room (+2 Beds Capacity).', () => onBuildRoom('bunk'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    woodCount >= 3 && nailsCount >= 10
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Build (3 Wood, 10 Nails)
                </button>
              </div>

              {/* Option 3: Private Cabin */}
              <div className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-white">Private Living Cabin</h5>
                  <p className="text-[10px] text-zinc-400">+2 Beds, +15 Morale Boost for Couples</p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 4 || nailsCount < 15}
                  onClick={() => triggerFeedback('Built Private Living Cabin (+2 Beds, High Comfort).', () => onBuildRoom('cabin'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    woodCount >= 4 && nailsCount >= 15
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Build (4 Wood, 15 Nails)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-VIEW: FACILITIES & UPGRADES */}
      {subView === 'facilities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Projects & Expansion
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Water Catchment */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Rooftop Rain Catchment Cistern
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Storage: {shelter.storedRainwater} / {shelter.maxRainwater} Liters â€¢ Level {shelter.waterCollectorLevel || 1}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 2}
                  onClick={() => triggerFeedback('Expanded Rainwater Cistern (+5L capacity).', () => onUpgradeFacility('water_collector'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    woodCount >= 2
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Upgrade (2 Wood)
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Automatically collects pure drinking water during rainy and stormy weather without using fuel.
              </p>
            </div>

            {/* Greenhouse / Raised Garden */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Rooftop Greenhouse & Raised Garden
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.greenhouseLevel ? `Active Farm (Tier ${shelter.greenhouseLevel})` : 'Unbuilt'} â€¢ Yields fresh vegetables every 3 days
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 3 || waterCount < 2}
                  onClick={() => triggerFeedback('Built Rooftop Garden Beds (+Passive Food Production).', () => onUpgradeFacility('greenhouse'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    woodCount >= 3 && waterCount >= 2
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {shelter.greenhouseLevel ? 'Upgrade' : 'Build (3 Wood, 2 Water)'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Grows fresh carrots, potatoes, and beans, reducing dependency on dangerous scavenging runs.
              </p>
            </div>

            {/* Infirmary Corner */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    Camp Infirmary & Triage Corner
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.infirmaryLevel ? `Operational (Tier ${shelter.infirmaryLevel})` : 'Unbuilt'} â€¢ Boosts First Aid recovery rate
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 2 || medsCount < 2}
                  onClick={() => triggerFeedback('Established Camp Infirmary (+Medical Care).', () => onUpgradeFacility('infirmary'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    woodCount >= 2 && medsCount >= 2
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {shelter.infirmaryLevel ? 'Upgrade' : 'Build (2 Wood, 2 Meds)'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Sterile beds and trauma supplies enable camp medics to treat infections and stop bleeding efficiently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-VIEW: DECREES & LAWS */}
      {subView === 'laws' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-amber-400" /> Settlement Decrees & Community Laws
            </span>
          </div>

          {/* Law 1: Rationing Policy */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">Daily Food Rationing Policy</h4>
              <p className="text-[10px] text-zinc-400">Controls how much food is distributed to survivors each day.</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSetRationPolicy('full');
                  triggerFeedback('Enacted Full Feast decree (+15% Morale, 2x food burn).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  rationPolicy === 'full'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Full Feast</div>
                <div className="text-[9px] opacity-80">+Morale, 2x Food</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetRationPolicy('standard');
                  triggerFeedback('Enacted Standard Rations policy.');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  rationPolicy === 'standard'
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Standard</div>
                <div className="text-[9px] opacity-80">1x Food, Normal</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetRationPolicy('half');
                  triggerFeedback('Enacted Half Rations decree (Conserves supplies, -Morale).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  rationPolicy === 'half'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Half Rations</div>
                <div className="text-[9px] opacity-80">0.5x Food, -Morale</div>
              </button>
            </div>
          </div>

          {/* Law 2: Newcomer Gate Protocol */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">Perimeter & Newcomer Protocol</h4>
              <p className="text-[10px] text-zinc-400">Rules for strangers and refugees arriving at the perimeter.</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSetSecurityProtocol('open');
                  triggerFeedback('Enacted Open Sanctuary protocol (Refugees welcomed).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  securityProtocol === 'open'
                    ? 'bg-emerald-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Open Gate</div>
                <div className="text-[9px] opacity-80">Welcomes all</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetSecurityProtocol('quarantine');
                  triggerFeedback('Enacted 3-Day Quarantine protocol (Checks for bites).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  securityProtocol === 'quarantine'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Quarantine</div>
                <div className="text-[9px] opacity-80">3-Day Hold</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetSecurityProtocol('lockdown');
                  triggerFeedback('Enacted Fortified Lockdown (No outsiders admitted).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  securityProtocol === 'lockdown'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Lockdown</div>
                <div className="text-[9px] opacity-80">Closed gates</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROOM ASSIGNMENT MODAL */}
      {roomAssignModalMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <DoorOpen className="w-4 h-4 text-emerald-400" />
                Assign Quarters for {roomAssignModalMember.name}
              </h3>
              <button
                type="button"
                onClick={() => setRoomAssignModalMember(null)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                âœ•
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Survivors sharing the same quarters converse at night, share rations, and naturally develop strong bonds or romances over time!
            </p>

            <div className="space-y-2 pt-1">
              {rooms.map(room => {
                const assigned = campMembers.filter(m => room.assignedMemberIds && room.assignedMemberIds.includes(m.id));
                const isAssignedHere = room.assignedMemberIds && room.assignedMemberIds.includes(roomAssignModalMember.id);
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      onAssignRoom(roomAssignModalMember.id, room.id);
                      triggerFeedback(`Assigned ${roomAssignModalMember.name} to ${room.name}.`);
                      setRoomAssignModalMember(null);
                    }}
                    className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      isAssignedHere
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                        : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{room.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {assigned.length}/{room.capacity} Beds filled {assigned.length > 0 && `(${assigned.map(a => a.name).join(', ')})`}
                      </div>
                    </div>
                    {isAssignedHere && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SURVIVOR FULL DOSSIER MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-sm w-full p-4 space-y-3.5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{selectedMember.name}</h3>
                <p className="text-xs text-zinc-400">{selectedMember.profession} â€¢ Age {selectedMember.age}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                âœ•
              </button>
            </div>

            {selectedMember.bio && (
              <p className="text-xs text-zinc-300 italic bg-black/40 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                "{selectedMember.bio}"
              </p>
            )}

            {/* Vitals & Status */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Physical Health</span>
                <span className="text-sm font-bold text-emerald-400">{selectedMember.health}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Trust in You</span>
                <span className="text-sm font-bold text-cyan-400">{selectedMember.trust}%</span>
              </div>
            </div>

            {/* RPG Skills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">Attributes & Skills</span>
              <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono">
                <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-rose-400 font-bold block">{selectedMember.combatSkill || 5}</span>
                  <span className="text-zinc-500 text-[9px]">Cbt</span>
                </div>
                <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-cyan-400 font-bold block">{selectedMember.medicalSkill || 5}</span>
                  <span className="text-zinc-500 text-[9px]">Med</span>
                </div>
                <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-amber-400 font-bold block">{selectedMember.craftingSkill || 5}</span>
                  <span className="text-zinc-500 text-[9px]">Crf</span>
                </div>
                <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-indigo-400 font-bold block">{selectedMember.stealthSkill || 5}</span>
                  <span className="text-zinc-500 text-[9px]">Stl</span>
                </div>
                <div className="p-1 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-emerald-400 font-bold block">{selectedMember.fitnessSkill || 5}</span>
                  <span className="text-zinc-500 text-[9px]">Fit</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  triggerFeedback(`Talked and shared stories with ${selectedMember.name} (+Trust).`, () => onTalkSurvivor(selectedMember.id));
                  setSelectedMember(null);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Have a Heart-to-Heart Chat</span>
              </button>

              <button
                type="button"
                disabled={!hasFood}
                onClick={() => {
                  triggerFeedback(`Shared warm food with ${selectedMember.name} (+Trust & Health).`, () => onGiftSurvivor(selectedMember.id));
                  setSelectedMember(null);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span>Gift Food Rations</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
