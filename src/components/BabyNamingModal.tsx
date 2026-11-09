import React, { useState } from 'react';
import { BabyNamingPrompt } from '../types/game';
import { Baby, Sparkles, Dices, Heart, Check } from 'lucide-react';

interface Props {
  prompt: BabyNamingPrompt;
  onConfirm: (fullName: string) => void;
}

const BOY_NAMES = ['Noah', 'Liam', 'Arthur', 'Leo', 'Julian', 'Elias', 'Finn', 'Lucas', 'Oliver', 'Ezra', 'Mateo', 'Caleb'];
const GIRL_NAMES = ['Maya', 'Elena', 'Nora', 'Chloe', 'Hazel', 'Iris', 'Ivy', 'Aria', 'Aurora', 'Zoe', 'Isla', 'Clara'];

export const BabyNamingModal: React.FC<Props> = ({ prompt, onConfirm }) => {
  const [firstName, setFirstName] = useState(prompt.suggestedFirstName);
  const [lastName, setLastName] = useState(prompt.suggestedLastName);

  const handleRandomize = () => {
    const pool = prompt.gender === 'male' ? BOY_NAMES : GIRL_NAMES;
    const randomName = pool[Math.floor(Math.random() * pool.length)];
    setFirstName(randomName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFirst = firstName.trim() || prompt.suggestedFirstName;
    const finalLast = lastName.trim() || prompt.suggestedLastName;
    const full = `${finalFirst} ${finalLast}`.trim();
    onConfirm(full);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Top Glow & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/40 animate-pulse">
            <Baby className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block">
              New Life in the Apocalypse
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              A Healthy Baby {prompt.gender === 'male' ? 'Boy' : 'Girl'} is Born!
            </h2>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed bg-black/40 p-2.5 rounded-2xl border border-white/5">
            Born to <span className="text-rose-300 font-semibold">{prompt.motherName}</span> and{' '}
            <span className="text-cyan-300 font-semibold">{prompt.fatherName}</span>. Lanterns glow across the settlement as survivors welcome our new miracle!
          </p>
        </div>

        {/* Naming Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] uppercase font-mono text-zinc-400 font-bold">
                Choose Baby Name
              </label>
              <button
                type="button"
                onClick={handleRandomize}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold py-0.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <Dices className="w-3 h-3" />
                <span>Randomize</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-zinc-500 block mb-0.5 pl-1">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>

              <div>
                <span className="text-[9px] text-zinc-500 block mb-0.5 pl-1">Surname</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-snug flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Your child will grow up in the sanctuary, inherit family skills, and carry your legacy forward!
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Name</span>
          </button>
        </form>
      </div>
    </div>
  );
};
