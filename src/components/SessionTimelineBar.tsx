import React from 'react';

export const SessionTimelineBar = () => {
  const sessions = [
    { name: 'London', start: 3, end: 12, color: '#3b82f6' }, // Ajustado para horários comuns de volatilidade
    { name: 'New York', start: 8, end: 17, color: '#eab308' },
    { name: 'Tokyo', start: 19, end: 4, color: '#ef4444' },
  ];

  // Get current hour in NY
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
    <div className="bg-black border-y border-white/5 p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Institutional Trading Windows (NY Time)</h3>
        <div className="flex gap-6">
          {sessions.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative h-16 w-full bg-white/[0.02] border border-white/5 rounded-none overflow-hidden">
        {/* Grid lines para as 24 horas */}
        {Array.from({ length: 25 }).map((_, h) => (
          <div 
            key={h} 
            className={`absolute top-0 bottom-0 border-l ${h % 4 === 0 ? 'border-white/10' : 'border-white/5'}`} 
            style={{ left: `${(h/24)*100}%` }}
          >
            {h % 2 === 0 && (
              <span className="absolute bottom-1 left-1 text-[8px] text-muted-foreground/40 font-mono">{h}h</span>
            )}
          </div>
        ))}

        {/* Session blocks */}
        {sessions.map((s) => {
          const startPos = (s.start / 24) * 100;
          let width = ((s.end - s.start) / 24) * 100;
          
          // Lógica para sessões que cruzam a meia-noite (como Tokyo)
          if (s.end < s.start) {
            width = ((24 - s.start + s.end) / 24) * 100;
          }

          return (
            <div 
              key={s.name}
              className="absolute h-6 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-all border-y border-white/10"
              style={{ 
                left: `${startPos}%`, 
                width: `${width}%`,
                backgroundColor: s.color,
                boxShadow: `0 0 20px ${s.color}20`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-white mix-blend-overlay">{s.name}</span>
              </div>
            </div>
          );
        })}

        {/* Current time indicator (A linha amarela que se move) */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 shadow-[0_0_15px_#EAB308]"
          style={{ left: `${(currentHourNY/24)*100}%` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
        </div>
      </div>
    </div>
  );
};