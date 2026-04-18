import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrading } from '../contexts/TradingContext';

export const EquityChart = () => {
  const { signalsData } = useTrading();
  const history = signalsData.signals;

  const equityData = history.reduce((acc: any[], signal, idx) => {
    const prevPips = idx === 0 ? 0 : acc[idx - 1].pips;
    acc.push({
      name: new Date(signal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pips: prevPips + signal.pips
    });
    return acc;
  }, []);

  const displayEquity = equityData.length > 0 ? equityData : [{ name: 'Start', pips: 0 }];

  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-none w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Real Equity Growth (Pips)</h3>
        <span className="text-[8px] font-mono text-primary/50">LIVE DATA</span>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayEquity}>
            <defs>
              <linearGradient id="colorPips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--bull))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--bull))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
              itemStyle={{ color: 'hsl(var(--bull))', fontSize: '10px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="pips" stroke="hsl(var(--bull))" fillOpacity={1} fill="url(#colorPips)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};