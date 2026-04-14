"use client";

import React from 'react';

const Logo = () => {
  // Link da imagem fornecida
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center gap-4">
      {/* Container do Logo com fundo branco para garantir que apareça em qualquer tema */}
      <div className="relative w-12 h-12 bg-white rounded-full p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
        <img 
          src={logoUrl} 
          alt="Braxel Markets Logo" 
          className="w-full h-full object-contain"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <h1 className="text-xl font-black tracking-tighter leading-none text-white italic">
            BRAXEL
          </h1>
          <span className="text-primary font-black text-xl italic tracking-tighter">MARKETS</span>
        </div>
        <p className="text-[8px] font-bold text-muted-foreground tracking-[0.4em] mt-1 uppercase opacity-80">
          Institutional Terminal
        </p>
      </div>
    </div>
  );
};

export default Logo;