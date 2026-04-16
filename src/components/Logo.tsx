"use client";

import React from 'react';

const Logo = () => {
  const logoUrl = "dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png";

  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <img 
          src={logoUrl} 
          alt="Braxel Logo" 
          className="w-full h-full object-contain brightness-125 contrast-125"
          style={{ filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.2))' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default Logo;