import React, { useState } from 'react';
import { CampMember, CampRole, GameState } from '../types/game';
import { Shield, HeartPulse, Hammer, Search, Bed, Heart, MessageSquare, Utensils, UserMinus } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRoleChange: (memberId: string, newRole: CampRole) => void;
  onTalkSurvivor: (memberId: string) => void;
  onGiftSurvivor: (memberId: string) => void;
  onRomanceSurvivor: (memberId: string) => void;
  onExileSurvivor: (memberId: string) => void;
}

export const CampTab: React.FC<Props> = ({
  gameState,
  onRoleChange,
  onTalkSurvivor,
  onGiftSurvivor,
  onRomanceSurvivor,
  onExileSurvivor
}) => {
  const { campMembers, inventory } = gameState;
  const hasFood = inventory.some(i => i.category === 'food' && i.quantity > 0);
  const [recentAction, setRecentAction] = useState<string | null>(null);

  const triggerAction = (text: string, callback: () => void) => {
    callback();
    setRecentAction(text);
    setTimeout(() => setRecentAction(null), 3000);
  };

  const ROLES: { id: CampRole; label: string; icon: React.ReactNode }[] = [
    { id: 'guard', label: 'Guard Duty', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'scavenger', label: 'Scavenger', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'medic', label: 'Camp Medic', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'craftsman', label: 'Builder', icon: <Hammer className="w-3.5 h-3.5" /> },
    { id: 'sickbay', label: 'Quarantine', icon: <Bed className="w-3.5 h-3.5" /> },
  ];

  const getRelationshipBadge = (member: CampMember) => {
    const stage = member.relationshipStage || 'stranger';
    switch (stage) {
      case 'romance':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-700 flex items-center gap-1 shadow-sm">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Romance Partner
          </span>
        );
      case 'close_friend':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
            🤝 Close Friend
          </span>
        );
      case 'friend':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-1">
            😊 Friend
          </span>
        );
      case 'tense':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1">
            ⚠️ Tense
          </span>
        );
      case 'enemy':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-400 border border-rose-800 flex items-center gap-1">
            💀 Enemy
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
            😐 Stranger
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-100">Survivor Sanctuary</h2>
          <p className="text-xs text-zinc-400">Total camp members: {campMembers.length + 1} (including you)</p>
        </div>
      </div>

      {campMembers.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-sm">You are surviving completely alone.</p>
          <p className="text-xs mt-1 text-zinc-500">Listen for radio distress calls or rescue wanderers at your gates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campMembers.map((member) => {
            const affection = member.affection ?? 20;
            const canRomance = (member.trust >= 65 && affection >= 65 && member.relationshipStage !== 'romance');

            return (
            <div
              key={member.id}
              className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">{member.name}</h3>
                    {getRelationshipBadge(member)}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{member.profession} • Age {member.age}</p>
                  {member.bio && (
                    <p className="text-[11px] text-zinc-500 mt-0.5 italic">{member.bio}</p>
                  )}
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                    Surviving together: {member.daysTogether || 1} days
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">Health: {member.health}%</div>
                </div>
              </div>

              {/* Vitals & Bonds Bars */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="flex items-center gap-1 font-medium"><Shield className="w-3 h-3 text-cyan-400" /> Trust</span>
                    <span className="font-mono font-bold text-zinc-200">{member.trust}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: member.trust + '%' }}
                    />
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="flex items-center gap-1 font-medium"><Heart className="w-3 h-3 text-rose-400" /> Bond / Love</span>
                    <span className="font-mono font-bold text-zinc-200">{affection}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all duration-300"
                      style={{ width: affection + '%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => triggerAction('Talked with ' + member.name + '. Bond strengthened (+Trust & Affection).', () => onTalkSurvivor(member.id))}
                    className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-zinc-700/60"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Chat & Bond</span>
                  </button>

                  <button
                    type="button"
                    disabled={!hasFood}
                    onClick={() => triggerAction('Shared food with ' + member.name + '. They are deeply grateful (+Trust).', () => onGiftSurvivor(member.id))}
                    className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all border border-zinc-700/60"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share Food</span>
                  </button>

                  {canRomance && (
                    <button
                      type="button"
                      onClick={() => triggerAction('❤️ You confessed your love to ' + member.name + '! You are now romantic partners.', () => onRomanceSurvivor(member.id))}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Confess Feelings (Start Romance)</span>
                    </button>
                  )}

                  {(member.relationshipStage === 'enemy' || member.relationshipStage === 'tense') && (
                    <button
                      type="button"
                      onClick={() => triggerAction('Exiled ' + member.name + ' from the camp.', () => onExileSurvivor(member.id))}
                      className="py-1 px-2.5 rounded-xl text-xs font-medium bg-rose-950/60 hover:bg-rose-950 text-rose-300 flex items-center gap-1 active:scale-95 transition-all border border-rose-800/60"
                    >
                      <UserMinus className="w-3 h-3 text-rose-400" />
                      <span>Exile</span>
                    </button>
                  )}
                </div>

              {/* Roles selection */}
              <div className="pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1.5">Assigned Duty:</span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onRoleChange(member.id, r.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        member.role === r.id
                          ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
