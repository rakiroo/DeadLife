import React, { useState } from 'react';
import { GameState, CampMember, CampRole, SurvivorChild } from '../types/game';
import { 
  Home, Users, Shield, HeartPulse, Hammer, Search, Bed, MessageSquare, 
  Utensils, UserMinus, Sparkles, Droplets, Edit3, Award, DoorOpen, Scroll, Check,
  Heart, Baby, GraduationCap, Flower2, UserPlus
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
  onUpgradeFacility: (facilityId: 'water_collector' | 'greenhouse' | 'infirmary' | 'schoolhouse' | 'nursery' | 'memorial_garden') => void;
  onSetRationPolicy: (policy: 'full' | 'standard' | 'half') => void;
  onSetSecurityProtocol: (protocol: 'open' | 'quarantine' | 'lockdown') => void;
  onCourtSurvivor: (memberId: string) => void;
  onProposeMarriage: (memberId: string) => void;
  onHaveBaby: () => void;
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
  onSetSecurityProtocol,
  onCourtSurvivor,
  onProposeMarriage,
  onHaveBaby
}) => {
  const { shelter, campMembers, inventory, player } = gameState;
  const [subView, setSubView] = useState<'survivors' | 'family' | 'housing' | 'facilities' | 'laws'>('survivors');
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

  const defaultBedCapacity = shelter.rooms && shelter.rooms.length > 0 
    ? shelter.rooms.reduce((sum, r) => sum + r.capacity, 0)
    : (shelter.maxSurvivors || (shelter.isEstablished ? 4 : 2));
  
  const totalResidents = campMembers.length + 1;
  const occupiedBeds = totalResidents;
  const vacantBeds = Math.max(0, defaultBedCapacity - occupiedBeds);
  const campMorale = shelter.morale ?? 75;
  const rationPolicy = shelter.rationPolicy ?? 'standard';
  const securityProtocol = shelter.securityProtocol ?? 'open';

  const marriedColonyCouples = campMembers.filter(m => m.datingStage === 'married');
  const totalMarriages = (shelter.marriagesCount ?? 0) + (player.romanceStage === 'married' ? 1 : 0);
  const totalChildren = (campMembers.filter(m => m.isChild).length) + (player.children ? player.children.length : 0);

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
              You are currently wandering exposed ruins. Establish a permanent sanctuary to welcome survivors, marry, raise families, construct cabins, and build a lasting dynasty.
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
              Settlement Overseer: <span className="text-zinc-200 font-medium">{player.name}</span> (Age {player.age})
              {player.romanceStage === 'married' && (
                <span className="text-rose-400 font-semibold ml-1">â€¢ Married to {player.spouseName || 'Spouse'}</span>
              )}
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
        <div className="grid grid-cols-4 gap-1.5 text-center text-xs pt-1">
          <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
              <Bed className="w-3 h-3 text-cyan-400" /> Beds
            </div>
            <div className="font-mono text-xs font-bold text-white mt-0.5">
              {occupiedBeds}/{defaultBedCapacity}
            </div>
          </div>

          <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-rose-400" /> Marriages
            </div>
            <div className="font-mono text-xs font-bold text-rose-300 mt-0.5">
              {totalMarriages}
            </div>
          </div>

          <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
              <Baby className="w-3 h-3 text-amber-400" /> Children
            </div>
            <div className="font-mono text-xs font-bold text-amber-300 mt-0.5">
              {totalChildren}
            </div>
          </div>

          <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
            <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Def
            </div>
            <div className="font-mono text-xs font-bold text-emerald-400 mt-0.5">
              {shelter.defenseRating || 35}%
            </div>
          </div>
        </div>

        {shelter.barricadeIntegrity < 100 && (
          <button
            type="button"
            onClick={() => triggerFeedback('Reinforced perimeter barricades (+25% integrity).', onRepairBarricade)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>Reinforce Barricades ({shelter.barricadeIntegrity}% Integrity)</span>
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
          onClick={() => setSubView('family')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ${
            subView === 'family'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'bg-white/5 text-zinc-400 hover:text-rose-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Family & Romance</span>
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
          <span>Housing ({rooms.length})</span>
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
          <span>Decrees</span>
        </button>
      </div>

      {/* 1. SUB-VIEW: SURVIVORS ROSTER */}
      {subView === 'survivors' && (
        <div className="space-y-3">
          {/* Overseer Card */}
          <div className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
                    Colony Leader
                  </span>
                  <h3 className="text-xs font-bold text-white">{player.name} (You)</h3>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Age {player.age} â€¢ {player.profession}
                  {player.romanceStage === 'dating' && <span className="text-pink-400 font-semibold ml-1">â€¢ Dating {player.datingTargetName || 'Partner'}</span>}
                  {player.romanceStage === 'married' && <span className="text-rose-400 font-semibold ml-1">â€¢ Married to {player.spouseName || 'Spouse'}</span>}
                </p>
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
                Explore landmarks in Activities or answer knocking survivors during rain to welcome new companions!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {campMembers.map((member) => {
                const isSingle = !member.datingStage || member.datingStage === 'single';
                const isDatingPlayer = player.datingTargetId === member.id;
                const isMarriedToPlayer = player.spouseId === member.id;

                return (
                  <div
                    key={member.id}
                    className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => setSelectedMember(member)}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                          {member.isChild && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                              {member.stage === 'infant' ? 'Infant' : member.stage === 'child' ? 'Child' : 'Teen'}
                            </span>
                          )}
                          {isMarriedToPlayer && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 flex items-center gap-0.5">
                              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" /> Spouse
                            </span>
                          )}
                          {member.datingStage === 'married' && !isMarriedToPlayer && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-white/10 text-rose-300 border border-white/10 shrink-0">
                              Married
                            </span>
                          )}
                          {isDatingPlayer && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0">
                              Dating You
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300">Dossier</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{member.profession} â€¢ Age {member.age}</p>

                        {!member.isChild && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-1 flex-wrap">
                            <span className="text-zinc-500">Skills:</span>
                            <span className="text-rose-400 font-semibold">Cbt {member.combatSkill || 5}</span>
                            <span className="text-zinc-600">â€¢</span>
                            <span className="text-cyan-400 font-semibold">Med {member.medicalSkill || 5}</span>
                            <span className="text-zinc-600">â€¢</span>
                            <span className="text-amber-400 font-semibold">Crf {member.craftingSkill || 5}</span>
                            <span className="text-zinc-600">â€¢</span>
                            <span className="text-indigo-400 font-semibold">Stl {member.stealthSkill || 5}</span>
                            <span className="text-zinc-600">â€¢</span>
                            <span className="text-emerald-400 font-semibold">Fit {member.fitnessSkill || 5}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right font-mono text-[11px] shrink-0">
                        <span className="text-emerald-400 font-bold">HP {member.health}%</span>
                        <span className="text-zinc-600 mx-1">â€¢</span>
                        <span className="text-cyan-400 font-bold">Trust {member.trust}%</span>
                      </div>
                    </div>

                    {/* Role & Interactive Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                      {!member.isChild ? (
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
                      ) : (
                        <div className="text-[10px] font-mono text-amber-400 italic">
                          {member.stage === 'infant' && 'Cared for in Nursery (Consumes half rations)'}
                          {member.stage === 'child' && 'Helping with light colony chores'}
                          {member.stage === 'teen' && 'Apprenticing & training attributes'}
                        </div>
                      )}

                      <div className="flex gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => triggerFeedback(`Checked in with ${member.name} (+Trust & Sanity).`, () => onTalkSurvivor(member.id))}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300"
                          title="Talk & Check In"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Court / Flirt Button */}
                        {!member.isChild && (
                          <>
                            {isSingle && player.romanceStage !== 'married' && (
                              <button
                                type="button"
                                onClick={() => triggerFeedback(`Spent quality time courting ${member.name} (+Affection).`, () => onCourtSurvivor(member.id))}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                                title="Court / Flirt"
                              >
                                <Heart className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {isDatingPlayer && (
                              <button
                                type="button"
                                onClick={() => triggerFeedback(`Proposed marriage to ${member.name}! Wedding bells ring (+Morale).`, () => onProposeMarriage(member.id))}
                                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 animate-pulse"
                                title="Propose Marriage"
                              >
                                <Heart className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
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

                        {member.trust < 40 && !member.isChild && (
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
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. SUB-VIEW: FAMILY & DYNASTY */}
      {subView === 'family' && (
        <div className="space-y-3">
          {/* Player Dynasty Card */}
          <div className="p-4 bg-gradient-to-br from-rose-950/40 via-zinc-900 to-black/60 border border-rose-500/30 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  Colony Founder Lineage
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{player.name} & Family</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {player.romanceStage === 'married' ? 'Married' : player.romanceStage === 'dating' ? 'Dating' : 'Single'}
              </span>
            </div>

            {/* Spouse & Dating status */}
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Marital Status:</span>
              {player.romanceStage === 'married' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white">Married to {player.spouseName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerFeedback('Spent a quiet romantic evening with your spouse (+Sanity, +Morale).', onHaveBaby)}
                    className="py-1 px-3 rounded-xl text-[10px] font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Baby className="w-3 h-3" />
                    <span>Try for Baby</span>
                  </button>
                </div>
              ) : player.romanceStage === 'dating' ? (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Dating <span className="font-bold text-pink-300">{player.datingTargetName}</span></span>
                  <span className="text-[10px] text-zinc-500">Propose marriage in Survivors tab</span>
                </div>
              ) : (
                <p className="text-zinc-400 text-[11px]">
                  You are currently single. Spend time courting a companion in the Survivors tab to spark a romance and build a family.
                </p>
              )}
            </div>

            {/* Children List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block px-1">
                Your Offspring ({player.children ? player.children.length : 0})
              </span>
              {(!player.children || player.children.length === 0) ? (
                <div className="p-3 text-center text-zinc-500 bg-black/20 rounded-2xl border border-white/5 text-[11px]">
                  No children yet. Once married, you can start a family to ensure your lineage continues when you grow old!
                </div>
              ) : (
                <div className="space-y-1.5">
                  {player.children.map(child => (
                    <div key={child.id} className="p-2.5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{child.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2">Age {child.age} â€¢ {child.stage}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {child.age >= 18 ? 'Adult Heir' : 'Growing Up'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colony Marriages & Romance Web */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block px-1">
              Colony Marriages & Interpersonal Ties
            </span>

            {marriedColonyCouples.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs">
                No colony survivors have tied the knot yet. Survivors sharing rooms or working together will naturally fall in love over time!
              </div>
            ) : (
              <div className="space-y-2">
                {marriedColonyCouples.map(member => (
                  <div key={member.id} className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span className="font-bold text-white">{member.name}</span>
                      <span className="text-zinc-500">married to</span>
                      <span className="font-bold text-rose-300">{member.spouseName || 'Spouse'}</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Co-habiting
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SUB-VIEW: HOUSING & ROOMS */}
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

          <div className="pt-2 space-y-2">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold px-1 block">
              Construct New Quarters (+Bed Capacity)
            </span>

            <div className="space-y-2">
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

      {/* 4. SUB-VIEW: FACILITIES & SCHOOLHOUSE */}
      {subView === 'facilities' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Projects & Expansion
            </span>
          </div>

          <div className="space-y-2.5">
            {/* The Schoolhouse */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    Colony Schoolhouse
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasSchoolhouse ? 'Operational' : 'Unbuilt'} â€¢ Enrolled children gain +1 to all skills every year
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 4 || nailsCount < 10 || shelter.hasSchoolhouse}
                  onClick={() => triggerFeedback('Built the Colony Schoolhouse! Enrolled children will gain +1 to all skills annually.', () => onUpgradeFacility('schoolhouse'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    shelter.hasSchoolhouse
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : woodCount >= 4 && nailsCount >= 10
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {shelter.hasSchoolhouse ? 'Built' : 'Build (4 Wood, 10 Nails)'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Converts old chalkboards and books into a sanctuary classroom. Ensures the next generation inherits knowledge.
              </p>
            </div>

            {/* The Nursery & Daycare */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-amber-400" />
                    Sanctuary Nursery & Daycare
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasNursery ? 'Operational' : 'Unbuilt'} â€¢ Safe cribs, +20% Morale, higher baby birth rate
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 3 || shelter.hasNursery}
                  onClick={() => triggerFeedback('Built Sanctuary Nursery (+20% Colony Hope & Safe Childcare).', () => onUpgradeFacility('nursery'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    shelter.hasNursery
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : woodCount >= 3
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {shelter.hasNursery ? 'Built' : 'Build (3 Wood)'}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Warm cribs, clean swaddles, and round-the-clock supervision for newborn infants and toddlers.
              </p>
            </div>

            {/* The Memorial Garden */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-rose-400" />
                    Memorial Garden & Cemetery
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasMemorialGarden ? 'Dedicated' : 'Unbuilt'} â€¢ Honoring fallen founders and ancestors
                  </p>
                </div>
                <button
                  type="button"
                  disabled={woodCount < 2 || shelter.hasMemorialGarden}
                  onClick={() => triggerFeedback('Dedicated Memorial Garden (+Colony Emotional Resolve).', () => onUpgradeFacility('memorial_garden'))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    shelter.hasMemorialGarden
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : woodCount >= 2
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm active:scale-95'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {shelter.hasMemorialGarden ? 'Dedicated' : 'Build (2 Wood)'}
                </button>
              </div>
            </div>

            {/* Greenhouse */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Rooftop Greenhouse
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.greenhouseLevel ? `Active Farm (Tier ${shelter.greenhouseLevel})` : 'Unbuilt'} â€¢ Fresh crops
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
            </div>

            {/* Infirmary */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    Camp Infirmary
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.infirmaryLevel ? `Operational (Tier ${shelter.infirmaryLevel})` : 'Unbuilt'}
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
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW: DECREES */}
      {subView === 'laws' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-amber-400" /> Settlement Decrees & Community Laws
            </span>
          </div>

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
              Survivors sharing the same room converse at night, share meals, and naturally develop friendships, romances, or marriage proposals over time!
            </p>

            <div className="space-y-2 pt-1">
              {rooms.map(room => {
                const assigned = campMembers.filter(m => room.assignedMemberIds && room.assignedMemberIds.includes(m.id));
                const isAssignedHere = room.assignedMemberIds && room.assignedMemberIds.includes(roomAssignModalMember.id);
                const isFull = assigned.length >= room.capacity && !isAssignedHere;
                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => {
                      if (isFull) return;
                      onAssignRoom(roomAssignModalMember.id, room.id);
                      triggerFeedback(`Assigned ${roomAssignModalMember.name} to ${room.name}.`);
                      setRoomAssignModalMember(null);
                    }}
                    className={`w-full p-2.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      isAssignedHere
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                        : isFull
                        ? 'bg-white/[0.02] border-white/5 text-zinc-500 opacity-60 cursor-not-allowed'
                        : 'bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{room.name}</span>
                        {isFull && <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Full</span>}
                      </div>
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
                <p className="text-xs text-zinc-400">
                  {selectedMember.profession} â€¢ Age {selectedMember.age}
                  {selectedMember.datingStage === 'married' && <span className="text-rose-400 font-bold ml-1">â€¢ Married</span>}
                </p>
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
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Trust in Leader</span>
                <span className="text-sm font-bold text-cyan-400">{selectedMember.trust}%</span>
              </div>
            </div>

            {/* RPG Skills */}
            {!selectedMember.isChild && (
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
            )}

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

              {!selectedMember.isChild && (
                <>
                  {(!selectedMember.datingStage || selectedMember.datingStage === 'single') && player.romanceStage !== 'married' && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerFeedback(`Courted ${selectedMember.name} (+Affection).`, () => onCourtSurvivor(selectedMember.id));
                        setSelectedMember(null);
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center gap-1.5"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Court & Express Affection</span>
                    </button>
                  )}

                  {player.datingTargetId === selectedMember.id && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerFeedback(`Proposed marriage to ${selectedMember.name}! They said yes!`, () => onProposeMarriage(selectedMember.id));
                        setSelectedMember(null);
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Propose Marriage</span>
                    </button>
                  )}
                </>
              )}

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
