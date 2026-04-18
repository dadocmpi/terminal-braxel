import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTrading } from '../contexts/TradingContext';

export const WinLossChart = () => {
  const { signalsData } = useTrading();
  const history = signalsData.signals;

  const distMap = history.reduce((acc: any, signal) => {
    if (!acc[signal.asset]) acc[signal.asset] = { name: signal.asset, win: 0, loss: 0 };
    if (signal.status === 'WIN') acc[signal.asset].win += 1;
    else acc[signal.asset].loss += 1;
    return acc;
  }, {});

  const distData = Object.values(distMap);

  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Asset Win/Loss Distribution</h3>
        <span className="text-[8px] font-mono text-primary/50">VERIFIED</span>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distData.length > 0 ? distData : [{ name: 'Waiting...', win: 0, loss: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
              itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
            />
            <Legend iconType="square" wrapperStyle={{ fontSize: '9px', paddingTop: '20px', fontWeight: 'bold', textTransform: 'uppercase' }} />
            <Bar dataKey="win" stackId="a" fill="hsl(var(--bull))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="loss" stackId="a" fill="hsl(var(--bear))" radius={[0, 0, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};