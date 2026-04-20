"use client";

import React, { useState } from 'react';

const Logo = () => {
  const [error, setError] = useState(false);
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 flex items-center justify-center">
        {!error ? (
          <img 
            src={logoUrl} 
            alt="Braxel Logo" 
            className="w-full h-full object-contain brightness-125 contrast-125"
            style={{ filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.4))' }}
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center">
            <span className="text-black font-black text-xs">B</span>
          </div>
        )}
      </div>
      <span className="text-sm font-black tracking-[0.2em] text-white hidden sm:block">
        BRAXEL<span className="text-primary">MARKETS</span>
      </span>
    </div>
  );
};

export default Logo;