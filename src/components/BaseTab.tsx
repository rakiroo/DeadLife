import React, { useState } from 'react';
import { GameState, CampMember, CampRole, CampRoom, SurvivorChild, SurvivorBackstory } from '../types/game';
import { 
  Home, Users, Shield, HeartPulse, Hammer, Search, Bed, MessageSquare, 
  Utensils, UserMinus, Sparkles, Droplets, Edit3, Award, DoorOpen, Scroll, Check,
  Heart, Baby, GraduationCap, Flower2, UserPlus,
  Egg, Crown, Flame, Swords, BookOpen, Brush, ShieldCheck, AlertCircle
} from 'lucide-react';
import { HookupModal } from './HookupModal';
import { WillAndTestamentModal } from './WillAndTestamentModal';
import { InscribeRelicModal } from './InscribeRelicModal';
import { HeirloomDetailModal } from './HeirloomDetailModal';
import { DynastyTreeModal } from './DynastyTreeModal';
import { KinMemoirModal } from './KinMemoirModal';
import { FamilyHeirloom } from '../types/game';
import { WillAndTestament } from '../types/game';
import { MatchmakeModal } from './MatchmakeModal';

interface Props {
  gameState: GameState;
  onEstablishBase: (name: string, type: string) => void;
  onRenameBase: (name: string) => void;
  onRoleChange: (memberId: string, newRole: CampRole) => void;
  onTalkSurvivor: (memberId: string) => void;
  onPraiseSurvivor?: (memberId: string) => void;
  onGiftSurvivor: (memberId: string) => void;
  onSparSurvivor?: (memberId: string) => void;
  onSeduceSurvivor?: (memberId: string) => void;
  onHookupSurvivor?: (memberId: string, useProtection: boolean) => void;
  onMatchmake?: (member1Id: string, member2Id: string) => void;
  onExileSurvivor: (memberId: string) => void;
  onRepairBarricade: () => void;
  onBuildRoom: (roomType: 'cots' | 'bunk' | 'cabin') => void;
  onUpgradeRoom?: (roomId: string) => void;
  onAssignRoom: (memberId: string, roomId: string) => void;
  onAssignPlayerRoom?: (roomId: string) => void;
  onTidyRoom?: (roomId: string) => void;
  onReinforceRoom?: (roomId: string) => void;
  onUpgradeFacility: (facilityId: 'water_collector' | 'greenhouse' | 'infirmary' | 'schoolhouse' | 'nursery' | 'memorial_garden' | 'chicken_coop' | 'sanctuary_well') => void;
  onInteractFacility?: (facilityType: string) => void;
  onMentorChild?: (childId: string, skill: 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness') => void;
  onToddlerInteract?: (childId: string, actionType: 'play' | 'words' | 'story' | 'feed') => void;
  onBestowHeirloom?: (name: string, type: 'weapon' | 'ring' | 'journal' | 'tool' | 'locket', bonusSkill: 'combat' | 'medical' | 'crafting' | 'stealth' | 'fitness') => void;
  onSetRationPolicy: (policy: 'full' | 'standard' | 'half') => void;
  onSetSecurityProtocol: (protocol: 'open' | 'quarantine' | 'lockdown') => void;
  onSetFarmingDecree?: (decree: 'standard' | 'intensive' | 'water_saving') => void;
  onSetScavengeQuotaDecree?: (decree: 'conservative' | 'balanced' | 'aggressive') => void;
  onSetBirthDecree?: (decree: 'encouraged' | 'normal' | 'austerity') => void;
  onCourtSurvivor: (memberId: string) => void;
  onProposeMarriage: (memberId: string) => void;
  onTryForBaby: () => void;
  onMakeLove: () => void;
  onStokeWoodstove?: () => void;
  onSaveWill?: (will: WillAndTestament) => void;
  onDeclareSpouseFallen?: () => void;
  onLegitimizeChild?: (childId: string) => void;
  onInscribeRelic?: (heirloom: FamilyHeirloom, consumedItemId?: string) => void;
  onRepairRelic?: (heirloomId: string) => void;
}

export const BaseTab: React.FC<Props> = ({
  gameState,
  onEstablishBase,
  onRenameBase,
  onRoleChange,
  onTalkSurvivor,
  onPraiseSurvivor,
  onGiftSurvivor,
  onSparSurvivor,
  onSeduceSurvivor,
  onHookupSurvivor,
  onMatchmake,
  onExileSurvivor,
  onRepairBarricade,
  onBuildRoom,
  onUpgradeRoom,
  onAssignRoom,
  onAssignPlayerRoom,
  onTidyRoom,
  onReinforceRoom,
  onUpgradeFacility,
  onInteractFacility,
  onSetRationPolicy,
  onSetSecurityProtocol,
  onSetFarmingDecree,
  onSetScavengeQuotaDecree,
  onSetBirthDecree,
  onCourtSurvivor,
  onProposeMarriage,
  onTryForBaby,
  onMakeLove,
  onMentorChild,
  onToddlerInteract,
  onBestowHeirloom,
  onStokeWoodstove,
  onSaveWill,
  onDeclareSpouseFallen,
  onLegitimizeChild,
  onInscribeRelic,
  onRepairRelic
}) => {
  const { shelter, campMembers, inventory, player } = gameState;
  const [subView, setSubView] = useState<'survivors' | 'family' | 'housing' | 'facilities' | 'laws'>('survivors');
  const [selectedMember, setSelectedMember] = useState<CampMember | null>(null);
  const [selectedKinForMemoir, setSelectedKinForMemoir] = useState<SurvivorBackstory | null>(null);
  const [roomAssignModalMember, setRoomAssignModalMember] = useState<{ id: string; name: string; isPlayer?: boolean } | null>(null);
  const [assignToRoom, setAssignToRoom] = useState<CampRoom | null>(null);
  const [hookupModalMember, setHookupModalMember] = useState<CampMember | null>(null);
  const [showMatchmakeModal, setShowMatchmakeModal] = useState(false);
  const [showWillModal, setShowWillModal] = useState(false);
  const [showInscribeModal, setShowInscribeModal] = useState(false);
  const [inspectHeirloom, setInspectHeirloom] = useState<FamilyHeirloom | null>(null);
  const [showTreeModal, setShowTreeModal] = useState(false);
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
  
  // Children under 16 stay with parents in family quarters and don't take adult bed slots!
  const adultResidents = campMembers.filter(m => !m.isChild || (m.age !== undefined && m.age >= 16)).length + 1;
  const totalChildrenCount = (campMembers.filter(m => m.isChild && (m.age === undefined || m.age < 16)).length) + (player.children ? player.children.filter(c => c.age < 16).length : 0);
  const totalSurvivorsCount = campMembers.length + (player.children ? player.children.length : 0) + 1;

  const occupiedBeds = adultResidents;
  const vacantBeds = Math.max(0, defaultBedCapacity - occupiedBeds);
  const campMorale = shelter.morale ?? 75;
  const rationPolicy = shelter.rationPolicy ?? 'standard';
  const securityProtocol = shelter.securityProtocol ?? 'open';
  const farmingDecree = shelter.farmingDecree ?? 'standard';
  const scavengeQuotaDecree = shelter.scavengeQuotaDecree ?? 'balanced';
  const birthDecree = shelter.birthDecree ?? 'normal';

  const marriedColonyCouples = campMembers.filter(m => m.datingStage === 'married');
  const totalMarriages = (shelter.marriagesCount ?? 0) + (player.romanceStage === 'married' ? 1 : 0);

  // Pregnancy status check for player or partner
  const spouseMember = campMembers.find(m => m.id === player.spouseId);
  const datingMember = campMembers.find(m => m.id === player.datingTargetId);
  const isSpouseMissing = Boolean(player.isSpouseMissing || (player.spouseId && player.spouseId.startsWith('missing_')) || (player.backstory?.theme === 'love' && player.backstory?.status !== 'resolved' && (player.backstory?.relation.includes('Spouse') || player.backstory?.relation.includes('Wife') || player.backstory?.relation.includes('Husband'))));
  const isPartnerMissing = Boolean(player.isPartnerMissing || (player.datingTargetId && player.datingTargetId.startsWith('missing_')) || (player.backstory?.theme === 'love' && player.backstory?.status !== 'resolved' && !player.backstory?.relation.includes('Spouse')));
  const hasMissingChild = Boolean(player.backstory?.theme === 'family' && (player.backstory.relation.includes('Son') || player.backstory.relation.includes('Daughter')) && player.backstory.status !== 'resolved');
  const hasMissingKin = Boolean(player.backstory && player.backstory.status !== 'resolved' && (player.backstory.theme === 'pet' || player.backstory.relation.includes('Father') || player.backstory.relation.includes('Mother') || player.backstory.relation.includes('Brother') || player.backstory.relation.includes('Sister')));
  const isExpectingBaby = player.isPregnant || (spouseMember && spouseMember.isPregnant) || (datingMember && datingMember.isPregnant);
  const pregnancyMonths = player.isPregnant ? (player.pregnancyMonths || 1) : (spouseMember?.pregnancyMonths || datingMember?.pregnancyMonths || 1);
  const pregnantMotherName = player.gender === 'female' && player.isPregnant 
    ? player.name 
    : (spouseMember?.name || datingMember?.name || player.spouseName || 'Spouse');

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

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 max-w-md mx-auto w-full font-sans select-none pb-24">
      {/* ACTION TOAST */}
      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono text-center animate-fade-in shadow-sm">
          {actionFeedback}
        </div>
      )}

      {/* 1. HERO HEADER: ROAMING PARTY BANNER OR ESTABLISHED BASE CARD */}
      {!shelter.isEstablished ? (
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-black/60 border border-emerald-500/30 rounded-3xl space-y-3 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                  No Base Established
                </span>
                <h3 className="text-base font-bold text-white">Roaming Survivor Party ({totalSurvivorsCount})</h3>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-zinc-300">
              On the Road
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            You and your companions are currently surviving exposed in the ruins. Claim a permanent sanctuary base to unlock housing cabins, facilities, and settlement decrees!
          </p>

          <button
            type="button"
            onClick={() => onEstablishBase(gameState.district?.name || gameState.startingLocation.name || 'Sanctuary Haven', 'Fortified Haven')}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim & Establish Sanctuary Base</span>
          </button>
        </div>
      ) : (
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
                  <span className="text-rose-400 font-semibold ml-1">• Married to {player.spouseName || 'Spouse'}</span>
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
                <Bed className="w-3 h-3 text-cyan-400" /> Adult Beds
              </div>
              <div className="font-mono text-xs font-bold text-white mt-0.5">
                {occupiedBeds}/{defaultBedCapacity}
              </div>
            </div>

            <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
              <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Total Souls
              </div>
              <div className="font-mono text-xs font-bold text-emerald-300 mt-0.5">
                {totalSurvivorsCount}
              </div>
            </div>

            <div className="p-2 bg-black/30 border border-white/5 rounded-2xl">
              <div className="text-[9px] text-zinc-400 uppercase font-mono flex items-center justify-center gap-1">
                <Baby className="w-3 h-3 text-amber-400" /> Kids
              </div>
              <div className="font-mono text-xs font-bold text-amber-300 mt-0.5">
                {totalChildrenCount}
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
              <span>Reinforce Barricades</span>
            </button>
          )}
        </div>
      )}

      {/* SUB-VIEW PILL TABS */}
      {!shelter.isEstablished ? (
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setSubView('survivors')}
            className={'py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ' + (subView === 'survivors' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-zinc-400 hover:text-white')}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Party ({totalSurvivorsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('family')}
            className={'py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ' + (subView === 'family' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-rose-300')}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Family & Romance</span>
          </button>
        </div>
      ) : (
        <div className="flex gap-1 overflow-x-auto py-0.5 no-scrollbar text-[11px] font-medium border-b border-white/5 pb-2">
          <button
            type="button"
            onClick={() => setSubView('survivors')}
            className={'px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ' + (subView === 'survivors' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-white/5 text-zinc-400 hover:text-white')}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Survivors ({totalSurvivorsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('family')}
            className={'px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ' + (subView === 'family' ? 'bg-rose-500 text-white font-bold shadow-sm' : 'bg-white/5 text-zinc-400 hover:text-rose-300')}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Family & Romance</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('housing')}
            className={'px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ' + (subView === 'housing' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-white/5 text-zinc-400 hover:text-white')}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>Housing ({rooms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('facilities')}
            className={'px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ' + (subView === 'facilities' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-white/5 text-zinc-400 hover:text-white')}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>Facilities</span>
          </button>

          <button
            type="button"
            onClick={() => setSubView('laws')}
            className={'px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all ' + (subView === 'laws' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'bg-white/5 text-zinc-400 hover:text-white')}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Decrees</span>
          </button>
        </div>
      )}

      {/* 1. SUB-VIEW: SURVIVORS ROSTER */}
      {subView === 'survivors' && (
        <div className="space-y-3">
          {/* Overseer Card */}
          <div className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {shelter.isEstablished && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
                      Colony Leader
                    </span>
                  )}
                  <h3 className="text-xs font-bold text-white">{player.name} (You)</h3>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Age {player.age} • {player.profession}
                  {player.romanceStage === 'dating' && <span className="text-pink-400 font-semibold ml-1">• Dating {player.datingTargetName || 'Partner'}</span>}
                  {player.romanceStage === 'married' && <span className="text-rose-400 font-semibold ml-1">• Married to {player.spouseName || 'Spouse'}</span>}
                  {player.roomId && (
                    <span className="text-emerald-400 font-medium ml-1">
                      • Quarters: {rooms.find(r => r.id === player.roomId)?.name || 'Private Room'}
                    </span>
                  )}
                </p>
              </div>
              <div className="font-mono text-[11px] text-emerald-400 font-bold">
                HP {player.health}% • Mind {player.sanity}%
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/5 flex-wrap">
              <span className="text-zinc-500">Skills:</span>
              <span className="text-rose-400 font-semibold">Cbt {player.combatSkill}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-cyan-400 font-semibold">Med {player.medicalSkill}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-semibold">Crf {player.craftingSkill}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-indigo-400 font-semibold">Stl {player.stealthSkill}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-semibold">Fit {player.fitnessSkill}</span>
            </div>
          </div>

          {/* Quick Matchmaking Banner Button */}
          {campMembers.filter(m => !m.isChild && m.datingStage !== 'married').length >= 2 && onMatchmake && (
            <div className="p-3 bg-gradient-to-r from-rose-950/30 to-purple-950/30 border border-rose-500/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Arrange Colony Union</h4>
                  <p className="text-[10px] text-zinc-400">Matchmake two uncommitted survivors</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMatchmakeModal(true)}
                className="py-1 px-3 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-sm active:scale-95 transition-all"
              >
                Matchmake
              </button>
            </div>
          )}

          {/* Camp Members */}
          {campMembers.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs space-y-2">
              <Users className="w-6 h-6 text-zinc-600 mx-auto" />
              <p className="font-semibold text-zinc-400">No other survivors in camp yet.</p>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Explore landmarks in Activities or answer knocking survivors at the gate to welcome new companions!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {campMembers.map((member) => {
                const isSingle = !member.datingStage || member.datingStage === 'single';
                const isDatingPlayer = player.datingTargetId === member.id;
                const isMarriedToPlayer = player.spouseId === member.id;
                const isChild = member.isChild && (member.age === undefined || member.age < 16);
                const assignedRoom = rooms.find(r => r.assignedMemberIds && r.assignedMemberIds.includes(member.id));

                return (
                  <div
                    key={member.id}
                    className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between cursor-pointer" onClick={() => setSelectedMember(member)}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs font-bold text-white truncate">{member.name}</h3>
                          {isChild && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                              {member.stage === 'infant' ? 'Infant' : member.stage === 'child' ? 'Child' : 'Teen'} (Family Quarters)
                            </span>
                          )}
                          {!isChild && member.isSleepingRough && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                              No Bed • Floor
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
                          {member.isPregnant && (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0 animate-pulse">
                              Pregnant (M{member.pregnancyMonths || 1}/9)
                            </span>
                          )}
                          <span className="text-[9px] font-mono text-zinc-500 hover:text-zinc-300">Dossier</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          {member.profession} • Age {member.age}
                          {member.gender && (
                            <span className="text-zinc-500 ml-1">
                              • {member.gender === 'female' ? '♀ Female' : '♂ Male'}
                            </span>
                          )}
                          {assignedRoom && <span className="text-zinc-500 ml-1">• {assignedRoom.name}</span>}
                        </p>

                        {/* Married / Dating Partner indicator directly below occupation and age */}
                        {isMarriedToPlayer && (
                          <p className="text-[10px] text-rose-300 font-medium flex items-center gap-1 mt-0.5">
                            <span>💍 Married to You ({player.name})</span>
                          </p>
                        )}
                        {member.datingStage === 'married' && !isMarriedToPlayer && (
                          <p className="text-[10px] text-rose-300 font-medium flex items-center gap-1 mt-0.5">
                            <span>💍 Married to {member.spouseName || member.partnerName || 'Spouse'}</span>
                          </p>
                        )}
                        {isDatingPlayer && (
                          <p className="text-[10px] text-pink-300 font-medium flex items-center gap-1 mt-0.5">
                            <span>❤️ Dating You ({player.name})</span>
                          </p>
                        )}
                        {member.datingStage === 'dating' && !isDatingPlayer && member.partnerName && (
                          <p className="text-[10px] text-pink-300 font-medium flex items-center gap-1 mt-0.5">
                            <span>❤️ Dating {member.partnerName}</span>
                          </p>
                        )}

                        {!isChild && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-1 flex-wrap">
                            <span className="text-zinc-500">Skills:</span>
                            <span className="text-rose-400 font-semibold">Cbt {member.combatSkill || 5}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-cyan-400 font-semibold">Med {member.medicalSkill || 5}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-amber-400 font-semibold">Crf {member.craftingSkill || 5}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-indigo-400 font-semibold">Stl {member.stealthSkill || 5}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-emerald-400 font-semibold">Fit {member.fitnessSkill || 5}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right font-mono text-[11px] shrink-0">
                        <span className="text-emerald-400 font-bold">HP {member.health}%</span>
                        <span className="text-zinc-600 mx-1">•</span>
                        <span className="text-cyan-400 font-bold">Trust {member.trust}%</span>
                      </div>
                    </div>

                    {/* Toddler/Child interactions if under 16 */}
                    {isChild && (
                      <div className="pt-2 border-t border-white/5 space-y-1.5">
                        <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                          Toddler & Child Nurturing (Stays in family quarters until 16):
                        </span>
                        <div className="grid grid-cols-4 gap-1">
                          <button
                            type="button"
                            onClick={() => triggerFeedback(`Cuddled and played with ${member.name} (+Morale & Sanity).`, () => onToddlerInteract && onToddlerInteract(member.id, 'play'))}
                            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20"
                          >
                            🧸 Cuddle
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerFeedback(`Taught survival basics to ${member.name} (+Skills).`, () => onToddlerInteract && onToddlerInteract(member.id, 'words'))}
                            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/20"
                          >
                            📖 Teach
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerFeedback(`Read an evening story to ${member.name} (+Sanity).`, () => onToddlerInteract && onToddlerInteract(member.id, 'story'))}
                            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/20"
                          >
                            🌙 Story
                          </button>
                          <button
                            type="button"
                            disabled={!hasFood}
                            onClick={() => triggerFeedback(`Fed warm broth to ${member.name} (+Health).`, () => onToddlerInteract && onToddlerInteract(member.id, 'feed'))}
                            className="py-1 px-1 rounded-lg text-[9px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 disabled:opacity-30"
                          >
                            🥣 Feed
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Role Selection for Adults */}
                    {!isChild && (
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex flex-wrap gap-1">
                          {ROLES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => onRoleChange(member.id, r.id)}
                              title={r.desc}
                              className={"px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all " + (member.role === r.id ? "bg-white text-zinc-950 font-bold shadow-sm" : "bg-white/5 text-zinc-400 hover:text-white")}
                            >
                              {r.icon}
                              <span>{r.label}</span>
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Tap for Dossier</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. SUB-VIEW: FAMILY & ROMANCE */}
      {subView === 'family' && (
        <div className="space-y-3">
          {/* Active Pregnancy Card */}
          {isExpectingBaby && (
            <div className="p-4 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-rose-950/40 border border-pink-500/30 rounded-3xl space-y-2.5 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Baby className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold block">
                      Expecting a Baby!
                    </span>
                    <h3 className="text-xs font-bold text-white">
                      {pregnantMotherName} is {pregnancyMonths} {pregnancyMonths === 1 ? 'Month' : 'Months'} Pregnant
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Due in {Math.max(0, 9 - pregnancyMonths)} Months
                </span>
              </div>

              {/* Month 1-9 Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Conception</span>
                  <span>Month {pregnancyMonths} of 9</span>
                  <span>Delivery</span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((pregnancyMonths / 9) * 100))}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Advance +1 Month (or +1 Year) to progress the pregnancy. When the time arrives, a naming pop-up will appear to name your baby!
              </p>
            </div>
          )}

          {/* Player Dynasty Card */}
          <div className="p-4 bg-gradient-to-br from-rose-950/40 via-zinc-900 to-black/60 border border-rose-500/30 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  Colony Founder Lineage
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{player.name} & Family</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => setShowTreeModal(true)}
                  className="py-1 px-2.5 rounded-full text-[10px] font-bold bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/10 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                >
                  <span>🌳 Dynasty Tree</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {isSpouseMissing ? 'Married (Missing)' : isPartnerMissing ? (player.romanceStage === 'engaged' ? 'Engaged (Missing)' : 'Dating (Missing)') : player.romanceStage === 'married' ? 'Married' : player.romanceStage === 'dating' ? 'Dating' : 'Single'}
                </span>
              </div>
            </div>

            {/* Spouse & Dating status */}
            <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-2">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Marital & Relationship Status:</span>
              {player.romanceStage === 'married' ? (
                isSpouseMissing ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white">Married to {player.spouseName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Separated • Missing
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                      Your spouse {player.spouseName} was cut off when society collapsed. Search {player.backstory?.searchGoal || 'the district'} to follow their trail and reunite!
                    </p>
                    {onDeclareSpouseFallen && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => triggerFeedback('Declared ' + player.spouseName + ' presumed fallen. You have accepted the loss and are now single.', onDeclareSpouseFallen)}
                          className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors font-medium underline"
                        >
                          Declare Presumed Fallen (Accept Loss & Move On)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                        <span className="font-bold text-white">Married to {player.spouseName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isExpectingBaby}
                        onClick={() => triggerFeedback('Conceived a baby with ' + player.spouseName + '! Due in 9 months (+Morale).', onTryForBaby)}
                        className="py-2 px-3 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Baby className="w-3.5 h-3.5" />
                        <span>{isExpectingBaby ? 'Currently Expecting' : 'Try for Baby'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerFeedback('Spent a passionate, restorative evening with ' + player.spouseName + ' (+Sanity & Morale).', onMakeLove)}
                        className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Make Love</span>
                      </button>
                    </div>
                  </div>
                )
              ) : isPartnerMissing ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="font-bold text-white">{player.romanceStage === 'engaged' ? 'Engaged to' : 'Dating'} {player.datingTargetName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      Separated • Missing
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                    Your partner {player.datingTargetName} was separated during the outbreak. Search {player.backstory?.searchGoal || 'the district'} to find them!
                  </p>
                  {onDeclareSpouseFallen && (
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => triggerFeedback('Declared ' + player.datingTargetName + ' presumed fallen. You have accepted the loss and are now single.', onDeclareSpouseFallen)}
                        className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors font-medium underline"
                      >
                        Declare Presumed Fallen (Accept Loss & Move On)
                      </button>
                    </div>
                  )}
                </div>
              ) : player.romanceStage === 'dating' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Dating <span className="font-bold text-pink-300">{player.datingTargetName}</span></span>
                    <span className="text-[10px] text-zinc-500">Propose marriage in Survivors tab</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isExpectingBaby}
                      onClick={() => triggerFeedback('Conceived a baby with ' + player.datingTargetName + '! Due in 9 months.', onTryForBaby)}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Baby className="w-3.5 h-3.5" />
                      <span>{isExpectingBaby ? 'Currently Expecting' : 'Try for Baby'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => triggerFeedback('Spent a passionate evening with ' + player.datingTargetName + ' (+Sanity & Morale).', onMakeLove)}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Make Love</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400 text-[11px]">
                  You are currently single. Spend time courting a companion in the Survivors tab or arrange a match to start a family.
                </p>
              )}
            </div>
            {/* Children List */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block px-1">
                Your Offspring ({player.children ? player.children.length : 0})
              </span>
              {hasMissingChild && player.backstory && (
                <div className="p-3 bg-black/40 border border-amber-500/30 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{player.backstory.targetName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {player.backstory.relation} • Missing in Ruins
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Your {player.backstory.relation.toLowerCase()} {player.backstory.targetName} was separated during the initial panic. Follow the trail in {player.backstory.searchGoal} to bring them home!
                  </p>
                </div>
              )}
              {(!player.children || player.children.length === 0) && !hasMissingChild && (
                <div className="p-3 text-center text-zinc-500 bg-black/20 rounded-2xl border border-white/5 text-[11px]">
                  No children yet. Try for a baby or make love to start a family and carry your dynasty forward!
                </div>
              )}

              {player.children && player.children.length > 0 && (
                <div className="space-y-2">
                  {player.children.map(child => (
                    <div key={child.id} className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{child.name}</span>
                          <span className="text-[10px] text-zinc-400 ml-2">Age {child.age} • {child.stage}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {child.age >= 16 ? 'Adult Heir (Age 16+)' : 'Growing Up (Family Quarters)'}
                        </span>
                      </div>

                      {/* RPG Attributes */}
                      {child.skills && (
                        <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono py-1 border-y border-white/5">
                          <div className="p-1 bg-white/[0.02] rounded">
                            <span className="text-rose-400 font-bold block">{child.skills.combat}</span>
                            <span className="text-zinc-500 text-[8px]">Cbt</span>
                          </div>
                          <div className="p-1 bg-white/[0.02] rounded">
                            <span className="text-cyan-400 font-bold block">{child.skills.medical}</span>
                            <span className="text-zinc-500 text-[8px]">Med</span>
                          </div>
                          <div className="p-1 bg-white/[0.02] rounded">
                            <span className="text-amber-400 font-bold block">{child.skills.crafting}</span>
                            <span className="text-zinc-500 text-[8px]">Crf</span>
                          </div>
                          <div className="p-1 bg-white/[0.02] rounded">
                            <span className="text-indigo-400 font-bold block">{child.skills.stealth}</span>
                            <span className="text-zinc-500 text-[8px]">Stl</span>
                          </div>
                          <div className="p-1 bg-white/[0.02] rounded">
                            <span className="text-emerald-400 font-bold block">{child.skills.fitness}</span>
                            <span className="text-zinc-500 text-[8px]">Fit</span>
                          </div>
                        </div>
                      )}

                      {/* Toddler & Mentorship Interactions */}
                      <div className="pt-1 space-y-1">
                        {child.age < 16 && (
                          <div className="grid grid-cols-4 gap-1 pb-1">
                            <button
                              type="button"
                              onClick={() => triggerFeedback(`Cuddled and played with ${child.name} (+Morale & Sanity).`, () => onToddlerInteract && onToddlerInteract(child.id, 'play'))}
                              className="py-1 px-1 rounded-lg text-[9px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20"
                            >
                              🧸 Play
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerFeedback(`Taught first words and survival basics to ${child.name} (+Skills).`, () => onToddlerInteract && onToddlerInteract(child.id, 'words'))}
                              className="py-1 px-1 rounded-lg text-[9px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/20"
                            >
                              📖 Teach
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerFeedback(`Read an evening story to ${child.name} (+Sanity).`, () => onToddlerInteract && onToddlerInteract(child.id, 'story'))}
                              className="py-1 px-1 rounded-lg text-[9px] font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/20"
                            >
                              🌙 Story
                            </button>
                            <button
                              type="button"
                              disabled={!hasFood}
                              onClick={() => triggerFeedback(`Nursed and fed warm meal to ${child.name} (+Health).`, () => onToddlerInteract && onToddlerInteract(child.id, 'feed'))}
                              className="py-1 px-1 rounded-lg text-[9px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 disabled:opacity-30"
                            >
                              🥣 Nurse
                            </button>
                          </div>
                        )}

                        {child.age >= 4 && onMentorChild && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-zinc-400">
                              <span className="flex items-center gap-1 font-semibold text-zinc-300"><GraduationCap className="w-3 h-3 text-amber-400" /> Train & Mentor:</span>
                              {child.lastMentoredDay === gameState.day && (
                                <span className="text-emerald-400 text-[9px] font-mono">Trained Today</span>
                              )}
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                              <button
                                type="button"
                                disabled={child.lastMentoredDay === gameState.day || (child.skills && child.skills.combat >= 10)}
                                onClick={() => triggerFeedback(`Mentored ${child.name} in Combat tactics (+1 Combat).`, () => onMentorChild(child.id, 'combat'))}
                                className="py-1 px-0.5 rounded-lg text-[9px] font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 disabled:opacity-30"
                              >
                                +Cbt
                              </button>
                              <button
                                type="button"
                                disabled={child.lastMentoredDay === gameState.day || (child.skills && child.skills.medical >= 10)}
                                onClick={() => triggerFeedback(`Mentored ${child.name} in Field Medicine (+1 Medical).`, () => onMentorChild(child.id, 'medical'))}
                                className="py-1 px-0.5 rounded-lg text-[9px] font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/20 disabled:opacity-30"
                              >
                                +Med
                              </button>
                              <button
                                type="button"
                                disabled={child.lastMentoredDay === gameState.day || (child.skills && child.skills.crafting >= 10)}
                                onClick={() => triggerFeedback(`Mentored ${child.name} in Fortification Crafting (+1 Crafting).`, () => onMentorChild(child.id, 'crafting'))}
                                className="py-1 px-0.5 rounded-lg text-[9px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/20 disabled:opacity-30"
                              >
                                +Crf
                              </button>
                              <button
                                type="button"
                                disabled={child.lastMentoredDay === gameState.day || (child.skills && child.skills.stealth >= 10)}
                                onClick={() => triggerFeedback(`Mentored ${child.name} in Stealth & Concealment (+1 Stealth).`, () => onMentorChild(child.id, 'stealth'))}
                                className="py-1 px-0.5 rounded-lg text-[9px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/20 disabled:opacity-30"
                              >
                                +Stl
                              </button>
                              <button
                                type="button"
                                disabled={child.lastMentoredDay === gameState.day || (child.skills && child.skills.fitness >= 10)}
                                onClick={() => triggerFeedback(`Mentored ${child.name} in Survival Fitness (+1 Fitness).`, () => onMentorChild(child.id, 'fitness'))}
                                className="py-1 px-0.5 rounded-lg text-[9px] font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 disabled:opacity-30"
                              >
                                +Fit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              
{/* Loved Ones & Family Kin in the Ruins */}
              {player.backstory && player.backstory.outcome !== 'reunited' && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold block">
                      Loved Ones & Family Kin
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">Tap to inspect memoir</span>
                  </div>
                  {(() => {
                    const isDeceased = player.backstory.status === 'resolved' && (player.backstory.outcome === 'deceased' || player.backstory.outcome === 'mercy' || Boolean((player as any).isSpousePresumedDead));
                    const kinGender = player.backstory.targetGender || (
                      player.backstory.relation.includes('Mother') || player.backstory.relation.includes('Sister') || player.backstory.relation.includes('Wife') || player.backstory.relation.includes('Daughter') ? 'female' : 'male'
                    );

                    return (
                      <div 
                        onClick={() => setSelectedKinForMemoir(player.backstory!)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] ${
                          isDeceased
                            ? 'bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40'
                            : 'bg-black/40 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                              {player.backstory.theme === 'pet' ? '🐕 ' : '👥 '}
                              {player.backstory.targetName}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold border ${
                              kinGender === 'female' 
                                ? 'bg-pink-500/15 text-pink-300 border-pink-500/30' 
                                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            }`}>
                              {kinGender === 'female' ? '♀' : '♂'}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
                            isDeceased
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {player.backstory.relation} • {isDeceased ? '🪦 Deceased' : '🔍 Missing'}
                          </span>
                        </div>
                        {isDeceased ? (
                          <p className="text-[11px] text-rose-300/90 leading-snug pt-1">
                            {player.backstory.targetCauseOfDeath || player.backstory.outcomeSummary || 'Fallen in the ruins.'}
                          </p>
                        ) : (
                          <p className="text-[11px] text-zinc-300 leading-snug pt-1">
                            {player.backstory.hookText}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                          <span className="text-zinc-500">Age {player.backstory.targetAge || 24}</span>
                          <span className="text-amber-400 group-hover:underline">View Flashback & Skills →</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Family Heirlooms */}
              <div className="space-y-1.5 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> Family Relics & Heirlooms ({player.heirlooms ? player.heirlooms.length : 0}/3)
                  </span>
                  {(!player.heirlooms || player.heirlooms.length < 3) && (
                    <button
                      type="button"
                      onClick={() => setShowInscribeModal(true)}
                      className="text-[10px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 py-0.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                    >
                      + Inscribe Relic
                    </button>
                  )}
                </div>

                {(!player.heirlooms || player.heirlooms.length === 0) ? (
                  <div className="p-3 text-center text-zinc-500 bg-black/20 rounded-2xl border border-white/5 text-[11px]">
                    No relics inscribed yet. Consecrate a weapon or heirloom to record its origin story, durability, and pass down permanent stat blessings!
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {player.heirlooms.map(h => (
                      <div
                        key={h.id}
                        onClick={() => setInspectHeirloom(h)}
                        className="p-2.5 bg-black/40 hover:bg-black/60 border border-amber-500/20 hover:border-amber-400/50 rounded-2xl flex items-center justify-between text-xs cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                      >
                        <div>
                          <div className="font-bold text-amber-200 group-hover:text-amber-300 flex items-center gap-1.5">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>{h.name}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            {h.condition || 'Pristine'} • {h.durability ?? 100}% Durability • +{h.bonusValue} {h.bonusSkill.toUpperCase()}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 group-hover:bg-amber-500/25">
                          Inspect Lore
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
{/* Founder's Dynasty Will & Testament Card */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-black/60 border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Scroll className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
                    Dynasty Succession
                  </span>
                  <h4 className="text-xs font-bold text-white">Founder's Will & Testament</h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWillModal(true)}
                className="py-1 px-3 rounded-xl text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-sm active:scale-95 transition-all"
              >
                {player.will ? 'Edit Testament' : 'Draft Will'}
              </button>
            </div>

            {player.will ? (
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-medium">Designated Successor:</span>
                  <span className="font-bold text-amber-300">{player.will.designatedHeirName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[10px]">Dynasty Creed:</span>
                  <span className="font-bold text-zinc-200 text-[10px]">{player.will.creedTitle}</span>
                </div>
                {player.will.bequeathedHeirloomName && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[10px]">Bequeathed Relic:</span>
                    <span className="text-amber-200 text-[10px]">{player.will.bequeathedHeirloomName}</span>
                  </div>
                )}
                <p className="text-[10px] text-zinc-400 italic pt-1 border-t border-white/5">
                  "{player.will.personalMessage}"
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400">
                You have not formalized a will yet. Designate a primary successor, choose a guiding creed, and bequeath relics to secure your family's future.
              </p>
            )}
          </div>

          {/* Colony Marriages & Romance Web */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold block">
                Colony Marriages & Interpersonal Ties
              </span>
              {onMatchmake && (
                <button
                  type="button"
                  onClick={() => setShowMatchmakeModal(true)}
                  className="text-[10px] font-bold text-rose-300 hover:text-white flex items-center gap-1"
                >
                  + Matchmake
                </button>
              )}
            </div>

            {marriedColonyCouples.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 bg-white/[0.02] rounded-2xl border border-white/5 text-xs">
                No colony survivors have tied the knot yet. Pair survivors using Matchmaking or let roommates naturally fall in love!
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
      {subView === 'housing' && !shelter.isEstablished && (
        <div className="p-8 text-center bg-white/[0.02] rounded-3xl border border-white/5 space-y-2">
          <Home className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Base Sanctuary Required</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            You are currently roaming as an exposed party. Claim and establish a sanctuary base above to build cabins and allocate living quarters.
          </p>
        </div>
      )}

      {subView === 'housing' && shelter.isEstablished && (
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
              const isPlayerHere = player.roomId === room.id || (room.assignedMemberIds && room.assignedMemberIds.includes('player'));
              const totalAssignedCount = assignedMembers.length + (isPlayerHere ? 1 : 0);
              const isRoomFull = totalAssignedCount >= room.capacity;

              return (
                <div key={room.id} className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                        {room.name}
                        {isPlayerHere && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Your Quarters
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Capacity: {totalAssignedCount} / {room.capacity} beds filled • Comfort {room.comfort}%
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isRoomFull ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'
                    }`}>
                      {room.capacity - totalAssignedCount} Open
                    </span>
                  </div>

                  {/* Current Occupants List */}
                  <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-[11px] text-zinc-300 space-y-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">Current Occupants:</span>
                    {totalAssignedCount === 0 ? (
                      <span className="text-zinc-500 italic text-[10px]">Vacant quarters.</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {isPlayerHere && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>{player.name} (You)</span>
                          </span>
                        )}
                        {assignedMembers.map(m => (
                          <span key={m.id} className="px-2 py-0.5 rounded-lg bg-white/10 text-white font-medium text-[10px] flex items-center gap-1">
                            <span>{m.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Room Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5 text-xs">
                    <div className="flex gap-1 flex-wrap">
                      {/* Upgrade Room (+1 Bed Capacity) */}
                      {onUpgradeRoom && (
                        <button
                          type="button"
                          disabled={woodCount < 2}
                          onClick={() => triggerFeedback(`Expanded ${room.name} (+1 Bed Capacity).`, () => onUpgradeRoom(room.id))}
                          className={`py-1 px-2.5 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all ${
                            woodCount >= 2
                              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 active:scale-95'
                              : 'bg-white/5 border border-white/5 text-zinc-500 opacity-60 cursor-not-allowed'
                          }`}
                          title={woodCount >= 2 ? 'Upgrade with 2 Timber to add +1 Bed' : 'Requires 2 Timber (Have ' + woodCount + ')'}
                        >
                          <Hammer className="w-3 h-3 text-emerald-400" />
                          <span>Upgrade (+1 Bed)</span>
                          <span className="text-[9px] font-mono text-zinc-400">2 Wood</span>
                        </button>
                      )}

                      {/* Move Player Here Button */}
                      {!isPlayerHere && onAssignPlayerRoom && (
                        <button
                          type="button"
                          disabled={isRoomFull}
                          onClick={() => triggerFeedback(`Moved your personal quarters to ${room.name}.`, () => onAssignPlayerRoom(room.id))}
                          className="py-1 px-2.5 rounded-xl text-[10px] font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 flex items-center gap-1"
                        >
                          <Home className="w-3 h-3" />
                          <span>Move Here</span>
                        </button>
                      )}

                      {/* Tidy & Clean */}
                      {onTidyRoom && (
                        <button
                          type="button"
                          onClick={() => triggerFeedback(`Cleaned and tidied ${room.name} (+Comfort & Sanity).`, () => onTidyRoom(room.id))}
                          className="py-1 px-2 rounded-xl text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center gap-1"
                        >
                          <Brush className="w-3 h-3 text-cyan-400" />
                          <span>Tidy</span>
                        </button>
                      )}

                      {/* Reinforce */}
                      {onReinforceRoom && (
                        <button
                          type="button"
                          disabled={woodCount < 1}
                          onClick={() => triggerFeedback(`Reinforced ${room.name} with timber braces (+Comfort).`, () => onReinforceRoom(room.id))}
                          className="py-1 px-2 rounded-xl text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-40 flex items-center gap-1"
                        >
                          <Hammer className="w-3 h-3 text-amber-400" />
                          <span>Reinforce (1 Wood)</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isRoomFull}
                      onClick={() => setAssignToRoom(room)}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      + Assign
                    </button>
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
                  <p className="text-[10px] text-zinc-400">+2 Beds, +15 Morale Boost for Couples & Overseer</p>
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

      {/* 4. SUB-VIEW: FACILITIES & EXPANSION */}
      {subView === 'facilities' && !shelter.isEstablished && (
        <div className="p-8 text-center bg-white/[0.02] rounded-3xl border border-white/5 space-y-2">
          <Hammer className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Base Sanctuary Required</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            You are currently roaming as an exposed party. Claim and establish a sanctuary base above to build greenhouses, wells, and community infirmaries.
          </p>
        </div>
      )}

      {subView === 'facilities' && shelter.isEstablished && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Hammer className="w-3.5 h-3.5 text-amber-400" /> Infrastructure Projects & Expansion
            </span>
          </div>

          <div className="space-y-2.5">

            {/* Winter Woodstove & Heating */}
            <div className="p-3.5 bg-gradient-to-r from-orange-950/30 to-amber-950/20 border border-amber-500/20 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Sanctuary Woodstove Heating
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.heatingDaysRemaining && shelter.heatingDaysRemaining > 0
                      ? 'Active Warmth: ' + shelter.heatingDaysRemaining + ' days remaining (+Morale, frost-proof)'
                      : 'Unheated: Sub-zero winter chills cause hypothermia and illness'}
                  </p>
                </div>
                {onStokeWoodstove && (
                  <button
                    type="button"
                    disabled={woodCount < 1}
                    onClick={() => triggerFeedback('Stoked the woodstove with timber (+7 Days Sanctuary Heat)!', onStokeWoodstove)}
                    className={'px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ' + (woodCount >= 1 ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm active:scale-95' : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5')}
                  >
                    Stoke Stove (1 Wood)
                  </button>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 bg-black/30 p-2 rounded-xl">
                Keeps living quarters and bunkhouses cozy. Essential during Winter and freezing cold snaps to protect residents from frostbite and pneumonia.
              </p>
            </div>

            {/* Rooftop Greenhouse */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Rooftop Greenhouse
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.greenhouseLevel ? `Active Farm (Tier ${shelter.greenhouseLevel})` : 'Unbuilt'} • Produces vegetables
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.greenhouseLevel && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Harvested fresh greenhouse vegetables (+Food Rations)!', () => onInteractFacility('greenhouse'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition-all"
                    >
                      Harvest Now
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={woodCount < 3 || waterCount < 2}
                    onClick={() => triggerFeedback('Upgraded Rooftop Garden Beds (+Passive Food Production).', () => onUpgradeFacility('greenhouse'))}
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
            </div>

            {/* Chicken Coop & Livestock */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Egg className="w-3.5 h-3.5 text-amber-400" />
                    Sanctuary Chicken Coop
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasChickenCoop ? 'Active Coop' : 'Unbuilt'} • Produces fresh farm eggs daily
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.hasChickenCoop && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Collected fresh eggs from the nesting boxes (+Food)!', () => onInteractFacility('chicken_coop'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all"
                    >
                      Gather Eggs
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={woodCount < 3 || nailsCount < 8 || shelter.hasChickenCoop}
                    onClick={() => triggerFeedback('Constructed Chicken Coop (+Fresh Eggs Daily)!', () => onUpgradeFacility('chicken_coop'))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      shelter.hasChickenCoop
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : woodCount >= 3 && nailsCount >= 8
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm active:scale-95'
                        : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {shelter.hasChickenCoop ? 'Built' : 'Build (3 Wood, 8 Nails)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sanctuary Aquifer Well */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Sanctuary Aquifer Well
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasSanctuaryWell ? 'Active Deep Well' : 'Unbuilt'} • Clean drought-proof water daily
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.hasSanctuaryWell && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Pumped clean drinking water from the well (+Water)!', () => onInteractFacility('sanctuary_well'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all"
                    >
                      Pump Water
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={woodCount < 4 || nailsCount < 12 || shelter.hasSanctuaryWell}
                    onClick={() => triggerFeedback('Dug and reinforced Sanctuary Well (+Clean Water Daily)!', () => onUpgradeFacility('sanctuary_well'))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      shelter.hasSanctuaryWell
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : woodCount >= 4 && nailsCount >= 12
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm active:scale-95'
                        : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {shelter.hasSanctuaryWell ? 'Operational' : 'Dig Well (4 Wood, 12 Nails)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Schoolhouse */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    Colony Schoolhouse
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasSchoolhouse ? 'Operational' : 'Unbuilt'} • Enrolled children gain +1 to all skills annually
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.hasSchoolhouse && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Held a community survival class for all children (+Skills & Sanity)!', () => onInteractFacility('schoolhouse'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 active:scale-95 transition-all"
                    >
                      Hold Class
                    </button>
                  )}
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
              </div>
            </div>

            {/* Sanctuary Nursery & Daycare */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-amber-400" />
                    Sanctuary Nursery & Daycare
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasNursery ? 'Operational' : 'Unbuilt'} • Safe cribs, +20% Morale, safe infant growth
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.hasNursery && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Tucked infants into warm cribs (+Morale & Hope)!', () => onInteractFacility('nursery'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all"
                    >
                      Check Cribs
                    </button>
                  )}
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
                    {shelter.infirmaryLevel ? `Operational (Tier ${shelter.infirmaryLevel})` : 'Unbuilt'} • Sterile recovery
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.infirmaryLevel && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Rested in sterile triage bed (+15 HP, wounds disinfected)!', () => onInteractFacility('infirmary'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 active:scale-95 transition-all"
                    >
                      Rest in Triage
                    </button>
                  )}
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

            {/* Memorial Garden */}
            <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5 text-rose-400" />
                    Memorial Garden & Cemetery
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {shelter.hasMemorialGarden ? 'Dedicated' : 'Unbuilt'} • Honoring fallen founders and ancestors
                  </p>
                </div>
                <div className="flex gap-1">
                  {shelter.hasMemorialGarden && onInteractFacility && (
                    <button
                      type="button"
                      onClick={() => triggerFeedback('Placed wildflowers at the graves of the fallen (+Sanity & Peace).', () => onInteractFacility('memorial_garden'))}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 active:scale-95 transition-all"
                    >
                      Visit Memorial
                    </button>
                  )}
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
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW: DECREES & COLONY LAWS */}
      {subView === 'laws' && !shelter.isEstablished && (
        <div className="p-8 text-center bg-white/[0.02] rounded-3xl border border-white/5 space-y-2">
          <Scroll className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">Base Sanctuary Required</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            You are currently roaming as an exposed party. Claim and establish a sanctuary base above to enact community laws, rationing decrees, and security protocols.
          </p>
        </div>
      )}

      {subView === 'laws' && shelter.isEstablished && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Scroll className="w-3.5 h-3.5 text-amber-400" /> Settlement Decrees & Community Laws
            </span>
          </div>

          {/* Daily Food Rationing */}
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

          {/* Farming & Irrigation Mandate */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">Farming & Watering Mandate</h4>
              <p className="text-[10px] text-zinc-400">Controls agricultural irrigation schedule and crop targets.</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSetFarmingDecree && onSetFarmingDecree('intensive');
                  triggerFeedback('Enacted Intensive Irrigation mandate (+60% Greenhouse Yield, consumes +1 extra water).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  farmingDecree === 'intensive'
                    ? 'bg-emerald-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Intensive</div>
                <div className="text-[9px] opacity-80">+60% Food Yield</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetFarmingDecree && onSetFarmingDecree('standard');
                  triggerFeedback('Enacted Standard Farming decree.');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  farmingDecree === 'standard'
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Standard</div>
                <div className="text-[9px] opacity-80">Balanced Harvest</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetFarmingDecree && onSetFarmingDecree('water_saving');
                  triggerFeedback('Enacted Drought Conservation mandate (Conserves water, lowers food yield).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  farmingDecree === 'water_saving'
                    ? 'bg-cyan-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Water Saving</div>
                <div className="text-[9px] opacity-80">0 Extra Water</div>
              </button>
            </div>
          </div>

          {/* Scout Resource Quotas */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">Scout Scavenging Quota & Targets</h4>
              <p className="text-[10px] text-zinc-400">Sets the supply quotas scouts must haul back from expeditions.</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSetScavengeQuotaDecree && onSetScavengeQuotaDecree('aggressive');
                  triggerFeedback('Enacted Aggressive Scavenging Quota (+50% Resource hauls, higher hazard risk).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  scavengeQuotaDecree === 'aggressive'
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">High Quota</div>
                <div className="text-[9px] opacity-80">+50% Hauls, Risk</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetScavengeQuotaDecree && onSetScavengeQuotaDecree('balanced');
                  triggerFeedback('Enacted Balanced Scouting protocol.');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  scavengeQuotaDecree === 'balanced'
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Balanced</div>
                <div className="text-[9px] opacity-80">Standard Haul</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetScavengeQuotaDecree && onSetScavengeQuotaDecree('conservative');
                  triggerFeedback('Enacted Safe Recon mandate (-50% ambush risk, lower hauls).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  scavengeQuotaDecree === 'conservative'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Safe Recon</div>
                <div className="text-[9px] opacity-80">Low Ambush Risk</div>
              </button>
            </div>
          </div>

          {/* Sanctuary Birth Policy */}
          <div className="p-3.5 bg-white/[0.04] border border-white/5 rounded-2xl space-y-2.5">
            <div>
              <h4 className="text-xs font-bold text-white">Sanctuary Birth & Family Policy</h4>
              <p className="text-[10px] text-zinc-400">Colony stance on marriages, childbirth, and expanding the settlement.</p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  onSetBirthDecree && onSetBirthDecree('encouraged');
                  triggerFeedback('Enacted Family Growth decree (+Morale, higher pregnancy rates).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  birthDecree === 'encouraged'
                    ? 'bg-pink-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Grow Families</div>
                <div className="text-[9px] opacity-80">+Births, +Morale</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetBirthDecree && onSetBirthDecree('normal');
                  triggerFeedback('Enacted Standard Family policy.');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  birthDecree === 'normal'
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Natural</div>
                <div className="text-[9px] opacity-80">Organic Growth</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSetBirthDecree && onSetBirthDecree('austerity');
                  triggerFeedback('Enacted Austerity Contraception mandate (Halts new births to conserve food).');
                }}
                className={`p-2 rounded-xl text-center transition-all ${
                  birthDecree === 'austerity'
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[11px] font-bold">Austerity</div>
                <div className="text-[9px] opacity-80">Halt Births</div>
              </button>
            </div>
          </div>

          {/* Perimeter & Newcomer Protocol */}
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
                ✕
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Survivors sharing the same room converse at night, share meals, and naturally develop friendships, romances, or marriage proposals over time!
            </p>

            <div className="space-y-2 pt-1 max-h-60 overflow-y-auto">
              {rooms.map(room => {
                const assigned = campMembers.filter(m => room.assignedMemberIds && room.assignedMemberIds.includes(m.id));
                const isPlayerHere = player.roomId === room.id || (room.assignedMemberIds && room.assignedMemberIds.includes('player'));
                const isAssignedHere = roomAssignModalMember.id === 'player'
                  ? isPlayerHere
                  : room.assignedMemberIds && room.assignedMemberIds.includes(roomAssignModalMember.id);
                const totalAssigned = assigned.length + (isPlayerHere ? 1 : 0);
                const isFull = totalAssigned >= room.capacity && !isAssignedHere;

                return (
                  <button
                    key={room.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => {
                      if (isFull) return;
                      if (roomAssignModalMember.id === 'player') {
                        onAssignPlayerRoom && onAssignPlayerRoom(room.id);
                        triggerFeedback(`Assigned your quarters to ${room.name}.`);
                      } else {
                        onAssignRoom(roomAssignModalMember.id, room.id);
                        triggerFeedback(`Assigned ${roomAssignModalMember.name} to ${room.name}.`);
                      }
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
                        {totalAssigned}/{room.capacity} Beds filled {assigned.length > 0 && `(${assigned.map(a => a.name).join(', ')})`}
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
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-base font-bold text-white">{selectedMember.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    selectedMember.gender === 'female' 
                      ? 'bg-pink-500/15 text-pink-300 border-pink-500/30' 
                      : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  }`}>
                    {selectedMember.gender === 'female' ? '♀ Female' : '♂ Male'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedMember.profession} • Age {selectedMember.age}
                </p>
                {/* Married to / Dating indicator below occupation and age */}
                {selectedMember.id === player.spouseId && (
                  <p className="text-[11px] text-rose-300 font-medium flex items-center gap-1 mt-0.5">
                    <span>💍 Married to You ({player.name})</span>
                  </p>
                )}
                {selectedMember.datingStage === 'married' && selectedMember.id !== player.spouseId && (
                  <p className="text-[11px] text-rose-300 font-medium flex items-center gap-1 mt-0.5">
                    <span>💍 Married to {selectedMember.spouseName || selectedMember.partnerName || 'Spouse'}</span>
                  </p>
                )}
                {selectedMember.id === player.datingTargetId && (
                  <p className="text-[11px] text-pink-300 font-medium flex items-center gap-1 mt-0.5">
                    <span>❤️ Dating You ({player.name})</span>
                  </p>
                )}
                {selectedMember.datingStage === 'dating' && selectedMember.id !== player.datingTargetId && selectedMember.partnerName && (
                  <p className="text-[11px] text-pink-300 font-medium flex items-center gap-1 mt-0.5">
                    <span>❤️ Dating {selectedMember.partnerName}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                ✕
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
                  triggerFeedback(`Talked and shared stories with ${selectedMember.name} (+Trust & Sanity).`, () => onTalkSurvivor(selectedMember.id));
                  setSelectedMember(null);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Talk & Bond</span>
              </button>

              {onSparSurvivor && !selectedMember.isChild && (
                <button
                  type="button"
                  onClick={() => {
                    triggerFeedback(`Sparred with ${selectedMember.name} (+Combat & Fitness).`, () => onSparSurvivor(selectedMember.id));
                    setSelectedMember(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5 text-rose-400" />
                  <span>Spar & Train</span>
                </button>
              )}

              {/* Seduce / Flirt */}
              {onSeduceSurvivor && !selectedMember.isChild && (
                <button
                  type="button"
                  onClick={() => {
                    triggerFeedback(`Flirted and seduced ${selectedMember.name} (+Attraction).`, () => onSeduceSurvivor(selectedMember.id));
                    setSelectedMember(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5 text-pink-400" />
                  <span>Seduce</span>
                </button>
              )}

              {/* Hook Up Button */}
              {onHookupSurvivor && !selectedMember.isChild && (
                <button
                  type="button"
                  onClick={() => {
                    setHookupModalMember(selectedMember);
                    setSelectedMember(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hook Up</span>
                </button>
              )}

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
                      <span>Court</span>
                    </button>
                  )}

                  {player.datingTargetId === selectedMember.id && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerFeedback(`Proposed marriage to ${selectedMember.name}! They said yes! Wedding bells ring!`, () => onProposeMarriage(selectedMember.id));
                        setSelectedMember(null);
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
                    >
                      <Crown className="w-3.5 h-3.5" />
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
                <span>Gift Food</span>
              </button>

              {onPraiseSurvivor && !selectedMember.isChild && (
                <button
                  type="button"
                  onClick={() => {
                    triggerFeedback(`Commended ${selectedMember.name} for their dedicated duty (+Trust & Morale).`, () => onPraiseSurvivor(selectedMember.id));
                    setSelectedMember(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Commend Duty</span>
                </button>
              )}

              {shelter.isEstablished && (
  <button
                type="button"
                onClick={() => {
                  setRoomAssignModalMember({ id: selectedMember.id, name: selectedMember.name });
                  setSelectedMember(null);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5"
              >
                <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Assign Room</span>
              </button>
)}

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOOKUP MODAL */}
      {hookupModalMember && onHookupSurvivor && (
        <HookupModal
          member={hookupModalMember}
          player={player}
          onConfirm={(useProtection) => {
            onHookupSurvivor(hookupModalMember.id, useProtection);
            setHookupModalMember(null);
          }}
          onClose={() => setHookupModalMember(null)}
        />
      )}

      {/* MATCHMAKE MODAL */}
      {showMatchmakeModal && onMatchmake && (
        <MatchmakeModal
          campMembers={campMembers}
          onArrangeUnion={(m1, m2) => {
            onMatchmake(m1, m2);
            setShowMatchmakeModal(false);
            triggerFeedback('Blessed the union! They are now married and co-habiting in quarters.');
          }}
          onClose={() => setShowMatchmakeModal(false)}
        />
      )}

      {/* ASSIGN SURVIVOR TO SPECIFIC ROOM MODAL */}
      {assignToRoom && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-fade-in font-sans select-none">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DoorOpen className="w-4 h-4 text-emerald-400" />
                  Assign Occupant to {assignToRoom.name}
                </h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Select a survivor or yourself to move into this room
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignToRoom(null)}
                className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {/* Player Option */}
              {player.roomId !== assignToRoom.id && onAssignPlayerRoom && (
                <button
                  type="button"
                  onClick={() => {
                    onAssignPlayerRoom(assignToRoom.id);
                    triggerFeedback('Moved your quarters to ' + assignToRoom.name + '.');
                    setAssignToRoom(null);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white">{player.name} (You)</span>
                      <span className="text-[10px] text-zinc-400 block">Colony Leader</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg">
                    Move Here
                  </span>
                </button>
              )}

              {/* All Camp Members */}
              {campMembers.filter(m => !assignToRoom.assignedMemberIds || !assignToRoom.assignedMemberIds.includes(m.id)).map(m => {
                const currentRoom = rooms.find(r => r.assignedMemberIds && r.assignedMemberIds.includes(m.id));
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onAssignRoom(m.id, assignToRoom.id);
                      triggerFeedback('Assigned ' + m.name + ' to ' + assignToRoom.name + '.');
                      setAssignToRoom(null);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{m.name}</span>
                        {m.isChild && <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">Child</span>}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {m.profession} • Current: {currentRoom ? currentRoom.name : 'Floor / Sleeping Rough'}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                      Assign
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WILL & TESTAMENT MODAL */}
      {showWillModal && onSaveWill && (
        <WillAndTestamentModal
          player={player}
          campMembers={campMembers}
          rooms={rooms}
          currentDay={gameState.day}
          onSaveWill={(will) => {
            onSaveWill(will);
            setShowWillModal(false);
            triggerFeedback('Founder\'s Will & Testament sealed successfully!');
          }}
          onClose={() => setShowWillModal(false)}
        />
      )}

      {/* INSCRIBE RELIC WORKSHOP MODAL */}
      {showInscribeModal && onInscribeRelic && (
        <InscribeRelicModal
          player={player}
          inventory={inventory}
          campMembers={campMembers}
          currentDay={gameState.day}
          onConfirmInscribe={(heirloom, consumedId) => {
            onInscribeRelic(heirloom, consumedId);
            setShowInscribeModal(false);
            triggerFeedback('Consecrated family relic: "' + heirloom.name + '"!');
          }}
          onClose={() => setShowInscribeModal(false)}
        />
      )}

      {/* INSPECT HEIRLOOM DETAIL MODAL */}
      {inspectHeirloom && (
        <HeirloomDetailModal
          heirloom={inspectHeirloom}
          player={player}
          currentDay={gameState.day}
          onRepairRelic={(id) => {
            onRepairRelic && onRepairRelic(id);
            setInspectHeirloom(prev => prev ? { ...prev, durability: 100, condition: 'Pristine' } : null);
            triggerFeedback('Polished and restored relic to pristine condition.');
          }}
          onClose={() => setInspectHeirloom(null)}
        />
      )}

      {/* DYNASTY FAMILY TREE MODAL */}
      {showTreeModal && (
        <DynastyTreeModal
          player={player}
          campMembers={campMembers}
          onLegitimizeChild={(childId) => {
            onLegitimizeChild && onLegitimizeChild(childId);
            triggerFeedback("Child officially legitimized in the colony registry!");
          }}
          onClose={() => setShowTreeModal(false)}
        />
      )}

    </div>
  );
};

