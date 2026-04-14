import React from 'react';

export const SessionTimelineBar = () => {
  const sessions = [
    { name: 'London', start: 5, end: 8, color: '#3b82f6' },
    { name: 'New York', start: 8, end: 11, color: '#eab308' },
    { name: 'Tokyo', start: 11, end: 14, color: '#ef4444' },
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
    <div className="bg-card/50 border border-border/50 rounded-xl p-4">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Trading Windows (NY Time)</h3>
      <div className="relative h-24 w-full bg-secondary/20 rounded-lg overflow-hidden">
        {/* Grid lines */}
        {[0, 4, 8, 12, 16, 20, 24].map(h => (
          <div key={h} className="absolute top-0 bottom-0 border-l border-border/20" style={{ left: `${(h/24)*100}%` }}>
            <span className="absolute bottom-1 left-1 text-[8px] text-muted-foreground font-mono">{h}h</span>
          </div>
        ))}

        {/* Session blocks */}
        {sessions.map((s, i) => (
          <div 
            key={s.name}
            className="absolute h-3 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            style={{ 
              top: `${20 + i * 15}px`, 
              left: `${(s.start/24)*100}%`, 
              width: `${((s.end - s.start)/24)*100}%`,
              backgroundColor: s.color
            }}
          >
            <span className="absolute -top-3 left-0 text-[7px] font-bold uppercase tracking-tighter" style={{ color: s.color }}>{s.name}</span>
          </div>
        ))}

        {/* Current time indicator */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          style={{ left: `${(currentHourNY/24)*100}%` }}
        />
      </div>
    </div>
  );
};