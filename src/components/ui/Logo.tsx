import React from 'react';

interface LogoProps {
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ theme = 'dark' }) => {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Lado Esquerdo: Blocos Rígidos */}
          <rect x="10" y="25" width="30" height="12" fill="#999" rx="2" className="group-hover:fill-cyan-400 transition-colors duration-500" />
          <rect x="5" y="44" width="35" height="12" fill={theme === 'dark' ? '#0B0E14' : '#f3f4f6'} stroke="#232931" rx="2" />
          <rect x="10" y="63" width="30" height="12" fill="#999" rx="2" className="group-hover:fill-cyan-400 transition-colors duration-500" />
          
          {/* Scanner Line */}
          <line x1="45" y1="20" x2="45" y2="80" stroke="#00F5FF" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
          
          {/* Lado Direito: Ondas Fluidas */}
          <path d="M50 31 Q 65 15, 80 31 T 95 31" fill="none" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 50 Q 65 34, 80 50 T 95 50" fill="none" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 69 Q 65 53, 80 69 T 95 69" fill="none" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" />
          
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex items-baseline">
        <span className={`font-bold text-2xl tracking-tight font-sans ${textColor}`}>SOMA</span>
        <span className="text-cyan-400 font-mono text-xl italic ml-1">RUSH</span>
      </div>
    </div>
  );
};

interface FaviconNodeProps {
  status?: "neutral" | "alert";
  theme?: 'dark' | 'light';
}

export const FaviconNode: React.FC<FaviconNodeProps> = ({ status = "neutral", theme = 'dark' }) => {
  const fillColor = theme === 'dark' ? '#0B0E14' : '#ffffff';
  
  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,245,255,0.3)]">
        <polygon 
          points="50,5 95,25 95,75 50,95 5,75 5,25" 
          fill={fillColor}
          stroke="#232931" 
          strokeWidth="4"
        />
        <circle cx="50" cy="50" r="15" fill={status === "neutral" ? "#00F5FF" : "#8A2BE2"} className="animate-ping opacity-75" />
        <circle cx="50" cy="50" r="12" fill={status === "neutral" ? "#00F5FF" : "#8A2BE2"} />
      </svg>
    </div>
  );
};
