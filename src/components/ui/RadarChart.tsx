import React from 'react';

interface RadarData {
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  data?: RadarData[];
  className?: string;
  theme?: 'dark' | 'light';
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  data = [
    { label: "TRUST", value: 85 },
    { label: "CONTEXT", value: 70 },
    { label: "DENSITY", value: 60 },
    { label: "LINKAGE", value: 75 },
    { label: "VECTORS", value: 80 },
    { label: "AUTHORITY", value: 90 }
  ],
  className = "",
  theme = 'dark'
}) => {
  const center = 100;
  const radius = 80;
  const levels = 5;
  
  const angleSlice = (Math.PI * 2) / data.length;
  
  const getPoint = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => getPoint(d.value, i));
  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');

  const gridColor = theme === 'dark' ? '#232931' : '#e5e7eb';
  const labelColor = theme === 'dark' ? '#999' : '#666';

  return (
    <div className={`relative w-full aspect-square flex items-center justify-center p-4 ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full max-w-[240px]">
        {/* Background Grids */}
        {Array.from({ length: levels }).map((_, i) => {
          const r = ((i + 1) / levels) * radius;
          const levelPoints = data.map((_, j) => {
            const angle = j * angleSlice - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={levelPoints}
              fill="none"
              stroke={gridColor}
              strokeWidth="1"
            />
          );
        })}
        
        {/* Axes */}
        {data.map((_, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={gridColor}
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data Shape */}
        <polygon
          points={pointsStr}
          fill="rgba(0, 245, 255, 0.1)"
          stroke="#00F5FF"
          strokeWidth="2"
          className="drop-shadow-[0_0_5px_#00F5FF]"
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </polygon>
        
        {/* Data Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#00F5FF"
            className="drop-shadow-[0_0_3px_#00F5FF]"
          />
        ))}
        
        {/* Labels */}
        {data.map((d, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const labelRadius = radius + 15;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={labelColor}
              fontSize="8"
              className="font-mono italic"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
