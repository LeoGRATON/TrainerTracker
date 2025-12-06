import React from "react";

interface CircleProgressProps {
  percentage: number; // 0 à 100
  text?: string;
  size?: number; // taille en pixels
  strokeWidth?: number;
  className?: string;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  text,
  size = 70,
  strokeWidth = 5,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex ${className}`}>
      <svg width={size} height={size} className="transform">
        {/* Cercle de fond (gris) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Cercle de progression (jaune) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(243 254 57)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      {/* Texte au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-neutral-100 font-mango text-[2rem]">
          {text || `${percentage}%`}
        </span>
      </div>
    </div>
  );
};
