import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, Globe } from 'lucide-react';

const news = [
  { time: '14:30', impact: 'HIGH', event: 'FED Chair Powell Speaks', currency: 'USD' },
  { time: '15:00', impact: 'HIGH', event: 'FOMC Meeting Minutes', currency: 'USD' },
  { time: '16:15', impact: 'MED', event: 'ECB President Lagarde Speaks', currency: 'EUR' },
  { time: '18:00', impact: 'HIGH', event: 'Interest Rate Decision', currency: 'USD' },
];

export const MarketNews = () => {
  return (
    <Card className="bg-card/50 border-border/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Globe className="w-3 h-3" /> FED & High Impact News
        </h3>
        <div className="px-2 py-0.5 bg-bear/20 rounded text-[8px] font-bold text-bear animate-pulse">LIVE FEED</div>
      </div>
      
      <div className="space-y-3">
        {news.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded bg-secondary/20 border border-border/30">
            <div className="flex flex-col items-center justify-center min-w-[40px] border-r border-border/50 pr-2">
              <Clock className="w-3 h-3 text-muted-foreground mb-1" />
              <span className="text-[10px] font-mono font-bold">{item.time}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary">{item.currency}</span>
                <span className={`text-[8px] font-bold px-1 rounded ${item.impact === 'HIGH' ? 'bg-bear text-white' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {item.impact}
                </span>
              </div>
              <p className="text-[11px] font-medium leading-tight mt-0.5">{item.event}</p>
            </div>
            {item.impact === 'HIGH' && <AlertCircle className="w-4 h-4 text-bear" />}
          </div>
        ))}
      </div>
    </Card>
  );
};