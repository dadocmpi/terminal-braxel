"use client";

import React from 'react';

const Logo = () => {
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10 bg-white rounded-full p-1.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;