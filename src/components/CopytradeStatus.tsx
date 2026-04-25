import React from 'react';
import { ShieldCheck, Zap, BarChart3, Server } from 'lucide-react';

export const CopytradeStatus = () => {
  return (
    <div className="bg-black border border-white/10 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5">
        <Server className="w-20 h-20 text-primary" />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-bull" />
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Master Account</h3>
        </div>
        <Badge className="bg-bull/10 text-bull border-bull/20 text-[8px] rounded-none">LIVE EXECUTION</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Balance</span>
          <p className="text-xl font-black tracking-tighter text-white">$12,450.00</p>
        </div>
        <div className="space-y-1">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Equity</span>
          <p className="text-xl font-black tracking-tighter text-bull">$12,450.00</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Server Latency</span>
          <span className="text-[8px] font-mono text-bull">14ms</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Active Slaves</span>
          <span className="text-[8px] font-mono text-primary">142 Accounts</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[8px] font-black text-white uppercase tracking-widest">Bridge: Connected</span>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-0.5 border text-[10px] font-bold ${className}`}>
    {children}
  </span>
);