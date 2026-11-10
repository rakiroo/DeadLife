import React from 'react';

interface Props {
  result: { title?: string; text: string; isFatal?: boolean };
  onClose: () => void;
}

export const DilemmaResultModal: React.FC<Props> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl max-w-sm w-full shadow-2xl p-4 sm:p-5 space-y-3 font-sans text-zinc-100 animate-in zoom-in-95 duration-150">
        <div className="bg-white/[0.04] p-3.5 rounded-xl border border-white/5 text-xs leading-relaxed text-zinc-200 font-sans">
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
