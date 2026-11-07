import React from 'react';
import { CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';

interface Props {
  result: { title: string; text: string; isFatal?: boolean };
  onClose: () => void;
}

export const DilemmaResultModal: React.FC<Props> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        <div className={`p-4 border-b flex items-center gap-2 ${result.isFatal ? 'bg-rose-950/80 border-rose-800 text-rose-300' : 'bg-zinc-950/80 border-zinc-800 text-emerald-400'}`}>
          {result.isFatal ? <AlertOctagon className="w-5 h-5 text-rose-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          <span className="font-mono text-xs uppercase tracking-wider font-bold">
            {result.isFatal ? 'Fatal Consequence' : 'Encounter Resolved'}
          </span>
        </div>

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
            {result.title}
          </h3>

          <p className="text-sm leading-relaxed text-zinc-300 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 font-sans">
            {result.text}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-zinc-100 hover:bg-white text-zinc-950 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Continue Survival</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
