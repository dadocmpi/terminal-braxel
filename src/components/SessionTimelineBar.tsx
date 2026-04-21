import React from 'react';

export const SessionTimelineBar = () => {
  const sessions = [
    { name: 'LONDON', start: 3, end: 12, color: '#3b82f6' },
    { name: 'NEW YORK', start: 8, end: 17, color: '#eab308' },
    { name: 'TOKYO', start: 19, end: 4, color: '#ef4444' },
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
        {/* Grid de Horas */}
        {Array.from({ length: 25 }).map((_, h) => (
          <div 
            key={h} 
            className={`absolute top-0 bottom-0 border-l ${h % 4 === 0 ? 'border-white/10' : 'border-white/5'}`} 
            style={{ left: `${(h/24)*100}%` }}
          />
        ))}

        {/* Barras de Sessão */}
        {sessions.map((s) => {
          const startPos = (s.start / 24) * 100;
          let width = ((s.end - s.start) / 24) * 100;
          if (s.end < s.start) width = ((24 - s.start + s.end) / 24) * 100;

          return (
            <div 
              key={s.name}
              className="absolute h-6 top-1/2 -translate-y-1/2 border border-white/10 flex items-center justify-center overflow-hidden"
              style={{ 
                left: `${startPos}%`, 
                width: `${width}%`,
                backgroundColor: s.color,
                opacity: 0.6
              }}
            >
              <span className="text-[8px] font-black text-white uppercase tracking-tighter whitespace-nowrap px-1">
                {s.name}
              </span>
            </div>
          );
        })}

        {/* Indicador de Hora Atual */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 shadow-[0_0_15px_#EAB308]"
          style={{ left: `${(currentHourNY/24)*100}%` }}
        />
      </div>
    </div>
  );
};