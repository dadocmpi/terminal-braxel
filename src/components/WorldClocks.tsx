import React, { useState, useEffect } from 'react';

const Clock = ({ label, timezone }: { label: string, timezone: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="flex flex-col items-center px-3 border-r border-border/50 last:border-0">
      <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{label}</span>
      <span className="text-sm font-mono font-bold text-primary">{formatted}</span>
    </div>
  );
};

export const WorldClocks = () => {
  return (
    <div className="flex items-center bg-secondary/30 rounded-md border border-border/50 py-1">
      <Clock label="NY" timezone="America/New_York" />
      <Clock label="LON" timezone="Europe/London" />
      <Clock label="TKY" timezone="Asia/Tokyo" />
    </div>
  );
};