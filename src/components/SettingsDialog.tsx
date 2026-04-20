"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, ShieldCheck, Database } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { showSuccess } from '../utils/toast';

export const SettingsDialog = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('twelve_data_key') || '');
  const [isRealData, setIsRealData] = useState(localStorage.getItem('data_mode') === 'real');

  const handleSave = () => {
    localStorage.setItem('twelve_data_key', apiKey);
    localStorage.setItem('data_mode', isRealData ? 'real' : 'mock');
    showSuccess("Configurações aplicadas. Reiniciando terminal...");
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 border-white/10 bg-white/5 hover:bg-primary hover:text-black rounded-none">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-white/10 text-white rounded-none sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Terminal Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest">Real-Time Data Mode</Label>
              <p className="text-[8px] text-muted-foreground uppercase">Switch between simulated and live API data</p>
            </div>
            <Switch checked={isRealData} onCheckedChange={setIsRealData} />
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] uppercase font-black text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Twelve Data API Key
            </Label>
            <Input 
              type="password"
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Enter your API Key..."
              className="bg-white/5 border-white/10 rounded-none h-9 text-xs font-mono" 
            />
            <p className="text-[7px] text-muted-foreground uppercase tracking-tighter">
              Get a free key at <a href="https://twelvedata.com" target="_blank" className="text-primary underline">twelvedata.com</a>
            </p>
          </div>

          <Button onClick={handleSave} className="w-full bg-primary text-black font-black rounded-none hover:bg-primary/80 text-[10px] tracking-widest">
            SAVE & REBOOT TERMINAL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};