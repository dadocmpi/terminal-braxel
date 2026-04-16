"use client";

import React from 'react';

const Logo = () => {
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center">
      <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden">
        <img 
          src={logoUrl} 
          alt="Braxel Logo" 
          className="w-full h-full object-contain brightness-110 contrast-110"
          onError={(e) => {
            // Fallback caso a imagem falhe
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default Logo;