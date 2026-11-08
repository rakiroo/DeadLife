import React from 'react';
import { CheckCircle2, AlertOctagon } from 'lucide-react';

interface Props {
  result: { title: string; text: string; isFatal?: boolean };
  onClose: () => void;
}

export const DilemmaResultModal: React.FC<Props> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-sm w-full shadow-2xl p-6 text-center space-y-4 font-sans text-zinc-100 animate-in zoom-in-95 duration-150">
        {/* Centered Circle Icon Badge */}
        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center border shadow-sm ${
          result.isFatal 
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' 
            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        }`}>
          {result.isFatal ? <AlertOctagon className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {result.isFatal ? 'Fatal Outcome' : 'Event Concluded'}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {result.title}
          </h3>
        </div>

        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/5 text-sm leading-relaxed text-zinc-300 text-left font-sans">
          {result.text}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-sm bg-white hover:bg-zinc-100 text-zinc-950 active:scale-[0.98] transition-all shadow-md mt-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
