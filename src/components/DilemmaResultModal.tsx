import React from 'react';
import { CheckCircle2, AlertOctagon } from 'lucide-react';

interface Props {
  result: { title: string; text: string; isFatal?: boolean };
  onClose: () => void;
}

export const DilemmaResultModal: React.FC<Props> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-xs w-full shadow-2xl p-4 text-center space-y-3 font-sans text-zinc-100 animate-in zoom-in-95 duration-150">
        {/* Centered Small Circle Icon Badge */}
        <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center border shadow-sm ${
          result.isFatal 
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        }`}>
          {result.isFatal ? <AlertOctagon className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {result.isFatal ? 'Fatal Outcome' : 'Event Outcome'}
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {result.title}
          </h3>
        </div>

        <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5 text-xs leading-relaxed text-zinc-300 text-left font-sans">
          {result.text}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs bg-white hover:bg-zinc-100 text-zinc-950 active:scale-[0.98] transition-all shadow-sm mt-1"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
