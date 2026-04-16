"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Info } from 'lucide-react';
import { Asset } from '../types/trading';
import { useTrading } from '../contexts/TradingContext';

const ALL_ASSETS: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD'];

export const RiskCalculator = () => {
  const { allAssetsData } = useTrading();
  const [asset, setAsset] = useState<Asset>("EURUSD");
  const [riskPerPip, setRiskPerPip] = useState("1"); // Base de $1 por PIP

  const calculateLotForOneDollarPip = () => {
    const risk = parseFloat(riskPerPip);
    if (isNaN(risk) || risk <= 0) return "0.00";

    const assetData = allAssetsData[asset];
    const currentPrice = assetData?.candles[assetData.candles.length - 1]?.close || 1.0;

    // Lógica de Pip Value para 1.00 Lote (100k unidades)
    // Pares XXXUSD (EURUSD, GBPUSD, etc): 1 pip = $10
    // Pares USDXXX (USDCAD, USDJPY): 1 pip = $10 / Preço Atual
    // Pares XXXYYY (GBPJPY): 1 pip = (1000 JPY) / USDJPY_Rate
    
    let pipValueForStandardLot = 10; // Padrão para XXXUSD

    if (asset.includes('JPY')) {
      // Para JPY, 1 pip (0.01) em 100k é 1000 JPY. 
      // Convertendo para USD: 1000 / USDJPY (aproximadamente o preço do par se for USDJPY)
      // Se for GBPJPY, o cálculo real usa USDJPY, mas simplificamos para o preço do par para estimativa rápida
      const usdJpyRate = allAssetsData['USDJPY']?.candles.slice(-1)[0]?.close || 150;
      pipValueForStandardLot = 1000 / usdJpyRate;
    } else if (asset === 'USDCAD') {
      pipValueForStandardLot = 10 / currentPrice;
    } else if (asset === 'EURGBP') {
      const gbpUsdRate = allAssetsData['GBPUSD']?.candles.slice(-1)[0]?.close || 1.25;
      pipValueForStandardLot = 10 * gbpUsdRate;
    }

    // Lote = Risco Desejado / Valor do Pip de 1 Lote
    const lot = risk / pipValueForStandardLot;
    return lot.toFixed(2);
  };

  const lot = calculateLotForOneDollarPip();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all rounded-none">
          <Calculator className="w-3 h-3 mr-2" />
          RISK CALC
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-white/10 text-white rounded-none sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Pip Value Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label className="text-[9px] uppercase font-black text-muted-foreground">Select Asset</Label>
            <Select value={asset} onValueChange={(value: Asset) => setAsset(value)}>
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
            <Label className="text-[9px] uppercase font-black text-muted-foreground">Risk per PIP ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
              <Input 
                type="number"
                value={riskPerPip} 
                onChange={(e) => setRiskPerPip(e.target.value)} 
                className="bg-white/5 border-white/10 pl-8 rounded-none h-9 text-xs font-mono" 
              />
            </div>
          </div>
          
          <div className="mt-2 p-6 bg-primary/5 border border-primary/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-3">Required Lot Size</span>
            <span className="text-5xl font-black tracking-tighter text-white glow-text-gold">{lot}</span>
            <div className="flex items-center gap-2 mt-4 text-[9px] text-muted-foreground font-bold uppercase tracking-widest">
              <Info className="w-3 h-3" />
              Target: ${riskPerPip}/PIP on {asset}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};