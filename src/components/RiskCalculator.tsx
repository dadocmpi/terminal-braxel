"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Percent, Target } from 'lucide-react';

export const RiskCalculator = () => {
  const [balance, setBalance] = useState("1000");
  const [risk, setRisk] = useState("1");
  const [entry, setEntry] = useState("1.08500");
  const [sl, setSl] = useState("1.08400");

  const calculateLot = () => {
    const b = parseFloat(balance);
    const r = parseFloat(risk);
    const e = parseFloat(entry);
    const s = parseFloat(sl);

    if (isNaN(b) || isNaN(r) || isNaN(e) || isNaN(s)) return 0;

    const riskAmount = b * (r / 100);
    const pips = Math.abs(e - s) * 10000; // Simplificado para majors
    if (pips === 0) return 0;
    
    // Lote = Risco $ / (Pips * Valor do Pip)
    // Assumindo $10 por pip em lote padrão
    return (riskAmount / (pips * 10)).toFixed(2);
  };

  const lot = calculateLot();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all rounded-none">
          <Calculator className="w-3 h-3 mr-2" />
          RISK
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-white/10 text-white rounded-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Position Size Calculator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black text-muted-foreground">Balance ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
                <Input value={balance} onChange={(e) => setBalance(e.target.value)} className="bg-white/5 border-white/10 pl-8 rounded-none h-9 text-xs font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] uppercase font-black text-muted-foreground">Risk (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary" />
                <Input value={risk} onChange={(e) => setRisk(e.target.value)} className="bg-white/5 border-white/10 pl-8 rounded-none h-9 text-xs font-mono" />
              </div>
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
            <span className="text-[10px] text-muted-foreground font-mono mt-2">Risk: ${(parseFloat(balance) * (parseFloat(risk)/100)).toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};