import React from 'react';
import { Shield, Wifi, Lock } from 'lucide-react';

export const BrokerStatus = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-1 bg-bull/5 border border-bull/20">
      <div className="flex items-center gap-2">
        <Wifi className="w-3 h-3 text-bull animate-pulse" />
        <span className="text-[9px] font-black text-bull uppercase tracking-widest">Cloud Engine: Active</span>
      </div>
      <div className="h-3 w-[1px] bg-white/10" />
      <div className="flex items-center gap-2">
        <Shield className="w-3 h-3 text-primary" />
        <span className="text-[9px] font-black text-white uppercase tracking-widest">Broker: Connected (MT5)</span>
      </div>
      <div className="h-3 w-[1px] bg-white/10" />
      <div className="flex items-center gap-2 opacity-50">
        <Lock className="w-3 h-3 text-muted-foreground" />
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Copytrade: Enabled</span>
      </div>
    </div>
  );
};