"use client";

import React, { useState } from 'react';

const Logo = () => {
  const [error, setError] = useState(false);
  // Usando o link da imagem fornecida
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {!error ? (
          <img 
            src={logoUrl} 
            alt="Braxel Markets" 
            className="w-full h-full object-contain transition-opacity duration-300"
            onError={() => setError(true)}
          />
        ) : (
          /* Fallback profissional caso a imagem não carregue */
          <div className="w-full h-full bg-primary flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.4)] transform -skew-x-6">
            <span className="text-black font-black text-xl italic">B</span>
          </div>
        )}
        {/* Brilho decorativo atrás do logo */}
        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full -z-10" />
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <h1 className="text-lg font-black tracking-tighter leading-none text-white italic">
            BRAXEL
          </h1>
          <span className="text-primary font-black text-lg italic tracking-tighter">MARKETS</span>
        </div>
        <p className="text-[7px] font-bold text-muted-foreground tracking-[0.5em] mt-1 uppercase opacity-70">
          Institutional Terminal
        </p>
      </div>
    </div>
  );
};

export default Logo;