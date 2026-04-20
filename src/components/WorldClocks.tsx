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
    <div className="flex items-center gap-3 px-6 border-r border-white/5 last:border-0">
      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em]">{label}</span>
      <span className="text-base font-mono font-black text-primary tabular-nums">{formatted}</span>
    </div>
  );
};

export const WorldClocks = () => {
  return (
    <div className="flex items-center justify-center bg-[#050505] border-b border-white/5 py-2 w-full">
      <Clock label="NEW YORK" timezone="America/New_York" />
      <Clock label="LONDON" timezone="Europe/London" />
      <Clock label="TOKYO" timezone="Asia/Tokyo" />
      <Clock label="SYDNEY" timezone="Australia/Sydney" />
    </div>
  );
};