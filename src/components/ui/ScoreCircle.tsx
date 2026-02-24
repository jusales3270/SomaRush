import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ScoreCircleProps {
  score: number;
  label: string;
  color?: "cyan" | "purple" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  label, 
  color = "cyan",
  size = "lg",
  className = ""
}) => {
  const { colors } = useTheme();
  
  const colorClasses = {
    cyan: colors.cyan,
    purple: colors.purple,
    green: colors.green
  };

  const strokeColors = {
    cyan: "#00F5FF",
    purple: "#8A2BE2",
    green: "#10b981"
  };

  const sizes = {
    sm: { width: 80, stroke: 6, font: "text-xl" },
    md: { width: 100, stroke: 8, font: "text-2xl" },
    lg: { width: 128, stroke: 8, font: "text-4xl" }
  };

  const { width, stroke, font } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const center = width / 2;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width, height: width }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.chartGrid}
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={strokeColors[color]}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
          <span className={`font-bold ${font} ${colorClasses[color]} tracking-tighter`}>
            {score}
          </span>
        </div>
      </div>
      <span className={`text-[10px] ${colors.textMuted} uppercase font-bold tracking-widest mt-2`}>
        {label}
      </span>
    </div>
  );
};
