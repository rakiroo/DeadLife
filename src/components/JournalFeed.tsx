import React, { useEffect, useRef, useMemo } from 'react';
import { LogEntry } from '../types/game';

interface Props {
  logs: LogEntry[];
  onOpenAmbitions?: () => void;
}

export const JournalFeed: React.FC<Props> = ({ logs, onOpenAmbitions }) => {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest entries at the bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  // Group log entries by day or day range (e.g. Day 2 – 8)
  const groupedLogs = useMemo(() => {
    const groups: { dayKey: string; dayLabel: string; entries: LogEntry[] }[] = [];
    logs.forEach((log) => {
      const dayKey = log.dayLabel ? `range_${log.dayLabel}` : `day_${log.day}`;
      const dayLabel = log.dayLabel || `${log.day}`;
      let g = groups.find((item) => item.dayKey === dayKey);
      if (!g) {
        g = { dayKey, dayLabel, entries: [] };
        groups.push(g);
      }
      g.entries.push(log);
    });
    return groups;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-500 text-xs italic font-sans max-w-md mx-auto w-full">
        No survival events recorded yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-w-md mx-auto w-full font-sans select-text">
      {/* Top Feed Header with Optional Ambitions Button */}
      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          Survivor Chronicle
        </span>
        {onOpenAmbitions && (
          <button
            type="button"
            onClick={onOpenAmbitions}
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 flex items-center gap-1.5 transition-all active:scale-95"
            title="View optional sandbox escape goals"
          >
            <span>🎯 Ambitions</span>
          </button>
        )}
      </div>

      {groupedLogs.map((group) => (
        <div key={group.dayKey} className="space-y-1">
          {/* Day Header - Sleek, compact monospace */}
          <h3 className="text-xs font-bold text-sky-400 font-mono tracking-tight uppercase">
            Day: {group.dayLabel}
          </h3>

          {/* Clean, compact event lines with lowered/smaller text size */}
          <div className="space-y-1 text-xs text-zinc-300 leading-normal font-sans">
            {group.entries.map((entry) => {
              const isDanger = entry.type === 'hazard' || entry.type === 'combat' || entry.type === 'death';
              const isMedical = entry.type === 'medical';

              return (
                <p
                  key={entry.id}
                  className={`break-words transition-colors ${
                    isDanger
                      ? 'text-rose-300 font-medium'
                      : isMedical
                      ? 'text-cyan-300'
                      : 'text-zinc-300'
                  }`}
                >
                  {entry.text}
                </p>
              );
            })}
          </div>
        </div>
      ))}

      {/* Bottom auto-scroll anchor */}
      <div ref={endRef} className="h-4" />
    </div>
  );
};
