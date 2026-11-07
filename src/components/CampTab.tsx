import React from 'react';
import { CampMember, CampRole, GameState } from '../types/game';
import { UserPlus, Shield, HeartPulse, Hammer, Search, Bed } from 'lucide-react';

interface Props {
  gameState: GameState;
  onRoleChange: (memberId: string, newRole: CampRole) => void;
}

export const CampTab: React.FC<Props> = ({ gameState, onRoleChange }) => {
  const { campMembers } = gameState;

  const ROLES: { id: CampRole; label: string; icon: React.ReactNode }[] = [
    { id: 'guard', label: 'Guard Duty', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'scavenger', label: 'Scavenger', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'medic', label: 'Camp Medic', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'craftsman', label: 'Builder', icon: <Hammer className="w-3.5 h-3.5" /> },
    { id: 'sickbay', label: 'Quarantine', icon: <Bed className="w-3.5 h-3.5" /> },
  ];

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
          {campMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{member.name}</h3>
                  <p className="text-xs text-zinc-400">{member.profession} • {member.relation}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-emerald-400">Trust: {member.trust}%</span>
                  <div className="text-[10px] text-zinc-500">Health: {member.health}%</div>
                </div>
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
          ))}
        </div>
      )}
    </div>
  );
};
