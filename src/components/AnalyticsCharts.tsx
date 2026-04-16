import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card } from "@/components/ui/card";

const equityData = [
  { name: 'Mon', pips: 0 },
  { name: 'Tue', pips: 120 },
  { name: 'Wed', pips: 80 },
  { name: 'Thu', pips: 250 },
  { name: 'Fri', pips: 420 },
  { name: 'Sat', pips: 380 },
  { name: 'Sun', pips: 550 },
];

const distData = [
  { name: 'EURUSD', win: 12, loss: 4 },
  { name: 'GBPUSD', win: 8, loss: 6 },
  { name: 'XAUUSD', win: 15, loss: 8 },
  { name: 'USDJPY', win: 5, loss: 2 },
];

export const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-none">
        <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Equity Growth (Pips)</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityData}>
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

      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-none">
        <h3 className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Signal Distribution</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distData}>
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
    </div>
  );
};