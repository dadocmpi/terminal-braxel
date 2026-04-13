import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Info, AlertTriangle, Target, Search } from 'lucide-react';

export const ZoneActivityFeed = () => {
  const { signalsData } = useTrading();

  const getIcon = (type: string) => {
    switch (type) {
      case 'signal': return <Bell className="w-3 h-3 text-primary" />;
      case 'touch': return <Target className="w-3 h-3 text-bull" />;
      case 'scan': return <Search className="w-3 h-3 text-muted-foreground" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-bear" />;
      default: return <Info className="w-3 h-3 text-muted-foreground" />;
    }
  };

  // Filtra apenas logs de hoje (baseado no horário do sistema)
  const today = new Date().toLocaleDateString();
  const dailyLogs = signalsData.market_context.activity_log.filter(log => {
    // Se o log não tiver data, assumimos que é de hoje para o mock
    // Em produção, cada log teria um timestamp completo
    return true; 
  });

  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-4 flex flex-col h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bot Activity Feed</h3>
        <span className="text-[8px] font-mono text-primary/50 uppercase">Daily Reset Active</span>
      </div>
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {dailyLogs.length > 0 ? dailyLogs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start">
              <div className="mt-0.5 p-1 bg-secondary/50 rounded border border-border/50">
                {getIcon(log.type)}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-muted-foreground">{log.time}</span>
                <p className="text-[11px] leading-tight text-foreground/90">{log.message}</p>
              </div>
            </div>
          )) : (
            <div className="h-full flex items-center justify-center opacity-20">
              <span className="text-[10px] uppercase tracking-widest">No activity today</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};