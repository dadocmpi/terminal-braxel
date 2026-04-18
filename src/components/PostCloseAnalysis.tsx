import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { BarChart3, Zap, Target, ShieldAlert } from 'lucide-react';

export const PostCloseAnalysis = () => {
  const { signalsData } = useTrading();
  const history = signalsData.signals;
  
  const totalPips = history.reduce((acc, s) => acc + s.pips, 0);
  const winRate = history.length > 0 
    ? Math.round((history.filter(s => s.status === 'WIN').length / history.length) * 100) 
    : 0;

  return (
    <div className="bg-black border border-white/10 p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
      
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Post-Session Intelligence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary" /> Net Performance
          </span>
          <p className={`text-3xl font-black tracking-tighter ${totalPips >= 0 ? 'text-bull' : 'text-bear'}`}>
            {totalPips >= 0 ? '+' : ''}{totalPips.toFixed(1)} <span className="text-xs opacity-50">PIPS</span>
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <Target className="w-3 h-3 text-primary" /> Accuracy
          </span>
          <p className="text-3xl font-black tracking-tighter text-white">
            {winRate}% <span className="text-xs opacity-50">WIN RATE</span>
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-3 h-3 text-primary" /> Risk Exposure
          </span>
          <p className="text-3xl font-black tracking-tighter text-primary">
            LOW <span className="text-xs opacity-50">STABLE</span>
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white/[0.02] border border-white/5">
        <p className="text-[10px] text-muted-foreground leading-relaxed italic">
          "Market is currently in consolidation phase. Institutional order flow suggests a potential liquidity sweep above previous weekly highs. Prepare for London Open volatility."
        </p>
      </div>
    </div>
  );
};