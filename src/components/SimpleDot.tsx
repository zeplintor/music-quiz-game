
import React from "react";

type SimpleDotProps = {
  x: number;
  y: number;
  gridSize?: number;
  className?: string;
};

const SimpleDot: React.FC<SimpleDotProps> = ({
  x,
  y,
  gridSize = 36,
  className = ""
}) => {
  // Calculer la position du point en pourcentage
  const dotX = (y / gridSize) * 100; // y correspond à la colonne (axe horizontal)
  const dotY = (x / gridSize) * 100; // x correspond à la ligne (axe vertical)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="text-xs font-semibold text-[#999] mb-1 uppercase tracking-wide">
        Position ({x}, {y})
      </span>
      <div
        className="relative rounded border border-[#c4f5e0] bg-[#f6faf8] shadow-xs"
        style={{
          width: "60px",
          height: "60px",
          backgroundImage: `
            linear-gradient(to right, #f1f1f1 1px, transparent 1px),
            linear-gradient(to bottom, #f1f1f1 1px, transparent 1px)
          `,
          backgroundSize: `${60 / gridSize}px ${60 / gridSize}px`,
        }}
      >
        {/* Point rouge représentant le bloc sélectionné */}
        <div
          className="absolute bg-red-400 rounded-sm border border-red-500"
          style={{
            width: `${60 / gridSize}px`,
            height: `${60 / gridSize}px`,
            left: `${dotX}%`,
            top: `${dotY}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 2px 1px rgba(144, 0, 0, 0.3)"
          }}
        />
        {/* Bordure pour emphasiser */}
        <div 
          className="absolute inset-0 pointer-events-none rounded" 
          style={{border: "1.5px solid #00cc5faa"}}
        />
      </div>
    </div>
  );
};

export default SimpleDot;
