import React from 'react';
import { CampMember, Survivor } from '../types/game';
import { Heart, ShieldCheck, Flame, AlertTriangle, X } from 'lucide-react';

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
  const isPlayerFemale = player.gender === 'female';
  const isMemberMarried = member.datingStage === 'married' && member.spouseId !== 'player';
  const isPlayerMarried = player.romanceStage === 'married' && player.spouseId !== member.id;
  const isAffair = isMemberMarried || isPlayerMarried;

  const protectionLabel = isPlayerFemale
    ? 'Use Protection (Contraception)'
    : 'Use Protection (Condom)';
  
  const protectionSubtext = isPlayerFemale
    ? 'Take morning-after emergency pills or contraception from the medical stash. 0% chance of pregnancy.'
    : 'Use a sealed latex condom scavenged from pharmacy supplies. 0% chance of pregnancy.';

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

        {/* Options */}
        <div className="space-y-2.5 pt-1">
          {/* Protected */}
          <button
            type="button"
            onClick={() => onConfirm(true)}
            className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                Use Protection
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                {protectionSubtext} Safe pleasure (+Sanity & Trust).
              </p>
            </div>
          </button>

          {/* Unprotected */}
          <button
            type="button"
            onClick={() => onConfirm(false)}
            className="w-full p-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-left transition-all group flex items-start gap-3 active:scale-[0.98]"
          >
            <div className="p-2 rounded-xl bg-rose-500/30 text-rose-300 shrink-0 mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-200 group-hover:text-white transition-colors">
                No Protection
              </div>
              <p className="text-[10px] text-rose-300/80 mt-0.5 leading-snug">
                Passionate and uninhibited. 35% chance of pregnancy and conceiving a child!
              </p>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
