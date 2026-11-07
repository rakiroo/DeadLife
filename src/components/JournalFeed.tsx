import React from 'react';
import { LogEntry } from '../types/game';
import { Skull, AlertTriangle, Cross, Shield, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  logs: LogEntry[];
}

export const JournalFeed: React.FC<Props> = ({ logs }) => {
  const getEntryBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'combat':
        return <span className="p-1 rounded bg-rose-950 text-rose-400 border border-rose-800"><Skull className="w-3.5 h-3.5" /></span>;
      case 'hazard':
        return <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800"><AlertTriangle className="w-3.5 h-3.5" /></span>;
      case 'medical':
        return <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800"><Cross className="w-3.5 h-3.5" /></span>;
      case 'milestone':
        return <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800"><Sparkles className="w-3.5 h-3.5" /></span>;
      case 'camp':
        return <span className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-800"><Shield className="w-3.5 h-3.5" /></span>;
      default:
        return <span className="p-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"><BookOpen className="w-3.5 h-3.5" /></span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-md mx-auto w-full">
      <div className="text-center py-2">
        <span className="text-[11px] uppercase tracking-widest text-zinc-600 font-mono font-medium">
          — Survivor's Daily Log —
        </span>
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className={`flex gap-3 items-start p-3 rounded-xl border backdrop-blur-sm transition-all duration-200 ${
            log.type === 'hazard' || log.type === 'combat'
              ? 'bg-rose-950/20 border-rose-900/40 text-rose-100'
              : log.type === 'milestone'
              ? 'bg-zinc-900/80 border-zinc-800/90 text-zinc-200'
              : 'bg-zinc-900/50 border-zinc-800/40 text-zinc-300'
          }`}
        >
          <div className="pt-0.5 shrink-0">
            {getEntryBadge(log.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-0.5">
              <span className="font-semibold text-zinc-400">DAY {log.day}</span>
              <span>{log.timestamp}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-200 break-words font-sans">
              {log.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
