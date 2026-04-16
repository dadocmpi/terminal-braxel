"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign } from 'lucide-react';
import { Asset } from '../types/trading';
import { useTrading } from '../contexts/TradingContext';

const ALL_ASSETS: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD'];

export const RiskCalculator = () => {
  const { allAssetsData } = useTrading();
  const [asset, setAsset] = useState<Asset>("EURUSD");
  const [riskAmount, setRiskAmount] = useState("1"); // Base de $1
  const [entry, setEntry] = useState("1.08500");
  const [sl, setSl] = useState("1.08400");

  const handleAssetChange = (newAsset: Asset) => {
    setAsset(newAsset);
    const assetData = allAssetsData[newAsset];
    const currentPrice = assetData?.candles[assetData.candles.length - 1]?.close;

    if (currentPrice) {
      const isJpy = newAsset.includes('JPY');
      const pipsOffset = isJpy ? 0.10 : 0.0010; 
      setEntry(currentPrice.toFixed(isJpy ? 2 : 5));
      setSl((currentPrice - pipsOffset).toFixed(isJpy ? 2 : 5));
    }
  };

  const calculateLot = () => {
    const r = parseFloat(riskAmount);
    const e = parseFloat(entry);
    const s = parseFloat(sl);

    if (isNaN(r) || isNaN(e) || isNaN(s) || e === s) return "0.00";

    const isJpy = asset.includes('JPY');
    const multiplier = isJpy ? 100 : 10000;
    const pips = Math.abs(e - s) * multiplier;
    
    // Pip Value para 1 lote padrão (100k unidades) é geralmente $10 para a maioria dos pares
    // Para JPY, o cálculo é similar em termos de valor de pip em USD na maioria das corretoras
    const pipValuePerLot = 10; 
    
    const lot = r / (pips * pipValuePerLot);
    return Math.max(0.01, lot).toFixed(2);
  };

  const lot = calculateLot();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all rounded-none">
          <Calculator className="w-3 h-3 mr-2" />
          RISK CALC
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-white/10 text-white rounded-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Institutional Risk Manager</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase font-black text-muted-foreground">Asset Selection</Label>
            <Select value={asset} onValueChange={(value: Asset) => handleAssetChange(value)}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-9 text-xs font-mono">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 text-white rounded-none">
                {ALL_ASSETS.map((a) => (
                  <SelectItem key={a} value={a} className="text-xs font-mono focus:bg-primary focus:text-black">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] uppercase font-black text-muted-foreground">Risk Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
              <Input value={riskAmount} onChange={(e) => setRiskAmount(e.target.value)} className="bg-white/5 border-white/10 pl-8 rounded-none h-9 text-xs font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black text-muted-foreground">Entry Price</Label>
              <Input value={entry} onChange={(e) => setEntry(e.target.value)} className="bg-white/5 border-white/10 rounded-none h-9 text-xs font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black text-muted-foreground">Stop Loss</Label>
              <Input value={sl} onChange={(e) => setSl(e.target.value)} className="bg-white/5 border-white/10 rounded-none h-9 text-xs font-mono" />
            </div>
          </div>
          
          <div className="mt-4 p-6 bg-primary/10 border border-primary/20 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Recommended Lot Size</span>
            <span className="text-4xl font-black tracking-tighter text-white">{lot}</span>
            <div className="flex gap-4 mt-2">
              <span className="text-[10px] text-muted-foreground font-mono">Risk: ${parseFloat(riskAmount).toFixed(2)}</span>
              <span className="text-[10px] text-muted-foreground font-mono">Asset: {asset}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};