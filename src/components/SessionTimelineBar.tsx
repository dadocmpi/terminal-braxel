import React from 'react';

export const SessionTimelineBar = () => {
  const sessions = [
    { name: 'London', start: 3, end: 12, color: '#3b82f6' },
    { name: 'New York', start: 8, end: 17, color: '#eab308' },
    { name: 'Tokyo', start: 19, end: 4, color: '#ef4444' },
  ];

  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(new Date());
  
  const hour = parseInt(nyTime.find(p => p.type === 'hour')?.value || '0');
  const minute = parseInt(nyTime.find(p => p.type === 'minute')?.value || '0');
  const currentHourNY = hour + minute / 60;

  return (
    <div className="bg-black border-y border-white/5 p-4 w-full">
      <div className="relative h-10 w-full bg-white/[0.02] border border-white/5 rounded-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, h) => (
          <div 
            key={h} 
            className={`absolute top-0 bottom-0 border-l ${h % 4 === 0 ? 'border-white/10' : 'border-white/5'}`} 
            style={{ left: `${(h/24)*100}%` }}
          />
        ))}

        {sessions.map((s) => {
          const startPos = (s.start / 24) * 100;
          let width = ((s.end - s.start) / 24) * 100;
          if (s.end < s.start) width = ((24 - s.start + s.end) / 24) * 100;

          return (
            <div 
              key={s.name}
              className="absolute h-4 top-1/2 -translate-y-1/2 opacity-30 border-y border-white/10"
              style={{ 
                left: `${startPos}%`, 
                width: `${width}%`,
                backgroundColor: s.color,
              }}
            />
          );
        })}

        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 shadow-[0_0_15px_#EAB308]"
          style={{ left: `${(currentHourNY/24)*100}%` }}
        />
      </div>
    </div>
  );
};