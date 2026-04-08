import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const AnalysisTabs = () => {
  const { obs, fvgs, structure } = useTrading();

  return (
    <Tabs defaultValue="obs" className="w-full mt-4">
      <TabsList className="bg-secondary/50 border border-border/50 w-full justify-start h-9 p-1">
        <TabsTrigger value="obs" className="text-[10px] uppercase font-bold px-4">Order Blocks</TabsTrigger>
        <TabsTrigger value="fvgs" className="text-[10px] uppercase font-bold px-4">FVGs</TabsTrigger>
        <TabsTrigger value="structure" className="text-[10px] uppercase font-bold px-4">Structure</TabsTrigger>
      </TabsList>
      
      <TabsContent value="obs" className="mt-2">
        <ScrollArea className="h-[150px] rounded-md border border-border/50 bg-card/30 p-2">
          <div className="space-y-1">
            {obs.map((ob) => (
              <div key={ob.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge className={ob.type === 'BUY' ? 'bg-bull/20 text-bull border-bull/30' : 'bg-bear/20 text-bear border-bear/30'}>
                    {ob.type}
                  </Badge>
                  <span className="text-[10px] font-mono text-foreground">{ob.low.toFixed(5)} - {ob.high.toFixed(5)}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{ob.ageCandles} candles ago</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="fvgs" className="mt-2">
        <ScrollArea className="h-[150px] rounded-md border border-border/50 bg-card/30 p-2">
          <div className="space-y-1">
            {fvgs.map((fvg) => (
              <div key={fvg.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={fvg.type === 'BUY' ? 'text-bull border-bull/30' : 'text-bear border-bear/30'}>
                    {fvg.type} FVG
                  </Badge>
                  <span className="text-[10px] font-mono text-foreground">{fvg.low.toFixed(5)} - {fvg.high.toFixed(5)}</span>
                </div>
                <Badge variant="secondary" className="text-[8px] uppercase">Active</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="structure" className="mt-2">
        <div className="h-[150px] rounded-md border border-border/50 bg-card/30 p-4 flex items-center justify-center">
          <div className="text-center">
            <Badge className="bg-bull text-white mb-2">BULLISH STRUCTURE</Badge>
            <p className="text-[10px] text-muted-foreground font-mono">Last Break of Structure: 1.08420</p>
            <div className="flex gap-2 mt-4 justify-center">
              {['HH', 'HL', 'HH', 'HL'].map((s, i) => (
                <div key={i} className="w-8 h-8 rounded border border-border/50 flex items-center justify-center text-[10px] font-bold text-primary">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};