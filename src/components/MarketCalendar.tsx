import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export const MarketCalendar = () => {
  const now = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentDay = now.getDay();
  
  return (
    <div className="bg-black border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Market Calendar</h3>
        </div>
        <div className="flex gap-2">
          <ChevronLeft className="w-3 h-3 text-muted-foreground cursor-not-allowed" />
          <ChevronRight className="w-3 h-3 text-muted-foreground cursor-not-allowed" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div key={day} className="text-center">
            <span className="text-[8px] font-black text-muted-foreground mb-2 block">{day}</span>
            <div className={`aspect-square flex items-center justify-center border ${i === currentDay ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 text-muted-foreground/50'} text-[10px] font-mono`}>
              {new Date(now.setDate(now.getDate() - currentDay + i)).getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Next Session</span>
          <span className="text-[8px] font-mono text-primary uppercase">London Open (Mon)</span>
        </div>
      </div>
    </div>
  );
};