import React from 'react';
import { CampMember, Survivor } from '../types/game';
import { ShieldCheck, Flame, AlertTriangle, X } from 'lucide-react';

interface Props {
  member: CampMember;
  player: Survivor;
  onConfirm: (useProtection: boolean) => void;
  onClose: () => void;
}

export const HookupModal: React.FC<Props> = ({
  member,
  player,
  onConfirm,
  onClose
}) => {
  const isMemberMarried = member.datingStage === 'married' && member.spouseId !== 'player';
  const isPlayerMarried = player.romanceStage === 'married' && player.spouseId !== member.id;
  const isAffair = isMemberMarried || isPlayerMarried;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-rose-500/30 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Intimate Encounter</h3>
              <p className="text-xs text-zinc-400">
                With <span className="text-rose-300 font-semibold">{member.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
          Behind locked quarters and quiet candlelight, a moment of passion sparks between you and {member.name}. How do you want to proceed?
        </p>

        {/* Warning if Affair */}
        {isAffair && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Forbidden Affair</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-snug">
              {isPlayerMarried && isMemberMarried
                ? 'Both you and ' + member.name + ' are married to other survivors! If discovered, it could tear the haven apart.'
                : isPlayerMarried
                ? 'You are already married to ' + (player.spouseName || 'your spouse') + '! A secret rendezvous risks discovery and heartbreak.'
                : member.name + ' is married to ' + (member.spouseName || 'their spouse') + '! Slipping away together is a dangerous secret.'}
            </p>
          </div>
        )}

        {/* Clean, Simple Choice Buttons */}
        <div className="space-y-2 pt-1">
          {/* Protected */}
          <button
            type="button"
            onClick={() => onConfirm(true)}
            className="w-full py-3 px-4 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Use Protection</span>
          </button>

          {/* Unprotected */}
          <button
            type="button"
            onClick={() => onConfirm(false)}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>No Protection</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
