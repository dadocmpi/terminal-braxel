import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Info, AlertTriangle, Target, Search, Zap } from 'lucide-react';

export const ZoneActivityFeed = () => {
  const { signalsData } = useTrading();

  const getIcon = (type: string) => {
    switch (type) {
      case 'signal': return <Zap className="w-3 h-3 text-primary fill-primary/20" />;
      case 'touch': return <Target className="w-3 h-3 text-bull" />;
      case 'scan': return <Search className="w-3 h-3 text-muted-foreground" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-bear" />;
      default: return <Info className="w-3 h-3 text-muted-foreground" />;
    }
  };

  // Filter for today's logs only
  const dailyLogs = signalsData.market_context.activity_log.filter(log => log.isToday);

  return (
    <div className="bg-black border border-white/10 rounded-none p-6 flex flex-col h-[400px] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#EAB308]" />
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Institutional Feed</h3>
        </div>
        <span className="text-[9px] font-mono text-primary/60 uppercase tracking-widest">Today Only</span>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-6">
          {dailyLogs.length > 0 ? dailyLogs.map((log) => (
            <div key={log.id} className="group relative flex gap-4 items-start transition-all hover:translate-x-1">
              <div className="mt-1 p-1.5 bg-white/5 rounded-none border border-white/10 group-hover:border-primary/50 transition-colors">
                {getIcon(log.type)}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-muted-foreground/60">{log.time}</span>
                  {log.type === 'signal' && (
                    <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-none uppercase tracking-tighter">High Impact</span>
                  )}
                </div>
                <p className={`text-[11px] leading-relaxed font-medium tracking-tight ${log.type === 'signal' ? 'text-white' : 'text-muted-foreground'}`}>
                  {log.message}
                </p>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
              <Search className="w-8 h-8 mb-4 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">No Activity Detected</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Bot Status: Active</span>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-1 h-1 bg-primary/40 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};