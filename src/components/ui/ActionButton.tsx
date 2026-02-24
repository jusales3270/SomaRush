import React from 'react';
import { Zap, ChevronRight, RefreshCcw, Loader2 } from 'lucide-react';

interface ActionButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  label?: string;
  loadingLabel?: string;
  hint?: string;
  disabled?: boolean;
  theme?: 'dark' | 'light';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick,
  isLoading = false,
  label = "Iniciar Recalibragem de Protocolo",
  loadingLabel = "Recalibrando Protocolos...",
  hint = "Atenção: Esta ação re-indexará vetores de contexto.",
  disabled = false,
  theme = 'dark'
}) => {
  return (
    <div className="relative group">
      <button 
        onClick={onClick}
        disabled={isLoading || disabled}
        className={`w-full relative py-6 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-500 overflow-hidden
          ${isLoading || disabled ? 'cursor-not-allowed opacity-80' : 'hover:shadow-[0_0_30px_rgba(0,245,255,0.2)] active:scale-[0.98]'}
        `}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 transition-transform duration-1000
          ${isLoading ? 'animate-pulse' : 'group-hover:opacity-90'}
        `}></div>
        
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Label */}
        <div className="relative flex items-center justify-center gap-3 text-white">
          {isLoading ? (
            <>
              <RefreshCcw className="w-5 h-5 animate-spin" />
              <span>{loadingLabel}</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-current" />
              <span>{label}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>
      </button>
      
      {/* Secondary Hint */}
      <div className={`mt-3 flex items-center justify-center gap-2 text-[10px] ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} uppercase font-mono italic tracking-tighter`}>
        {isLoading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processando análise em tempo real...</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
            <span>{hint}</span>
          </>
        )}
      </div>
    </div>
  );
};
