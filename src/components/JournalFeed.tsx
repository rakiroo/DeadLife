import React, { useEffect, useRef, useMemo } from 'react';
import { LogEntry } from '../types/game';

interface Props {
  logs: LogEntry[];
}

export const JournalFeed: React.FC<Props> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest entries at the bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  // Group log entries by day (BitLife style)
  const groupedLogs = useMemo(() => {
    const groups: { day: number; entries: LogEntry[] }[] = [];
    logs.forEach((log) => {
      let g = groups.find((item) => item.day === log.day);
      if (!g) {
        g = { day: log.day, entries: [] };
        groups.push(g);
      }
      g.entries.push(log);
    });
    return groups;
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-500 text-sm italic font-sans max-w-md mx-auto w-full">
        No survival events recorded yet.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 max-w-md mx-auto w-full font-sans select-text">
      {groupedLogs.map((group) => (
        <div key={group.day} className="space-y-1.5">
          {/* Day Header - BitLife Age style in bold blue */}
          <h3 className="text-base font-bold text-sky-400 font-sans tracking-tight">
            Day: {group.day} {group.day === 1 ? 'day' : 'days'}
          </h3>

          {/* Clean, compact event lines without bulky card containers */}
          <div className="space-y-1 text-sm text-zinc-300 leading-relaxed font-sans">
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
