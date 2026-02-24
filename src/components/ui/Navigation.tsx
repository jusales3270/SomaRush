import React from 'react';
import { User, RefreshCcw, Globe, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface NavigationProps {
  lastScan?: string;
  domain?: string;
  protocol?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  lastScan = "15 min atrás",
  domain = "empresa-global.com",
  protocol = "GEO-Active v3.5"
}) => {
  return (
    <>
      {/* Main Nav */}
      <nav className="flex flex-col md:flex-row md:items-center justify-between p-4 mb-8 bg-[#1A1F2B]/40 backdrop-blur-xl border border-gray-800 rounded-2xl">
        <Logo />
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">System Online</span>
          </div>
          <div className="h-6 w-[1px] bg-gray-800 hidden md:block"></div>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Admin_Node</p>
              <p className="text-[10px] text-gray-600">Protocol v3.5.2</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-[#0B0E14] rounded-[11px] flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-8 px-4 text-gray-500 font-mono text-xs border-l-2 border-cyan-500/50">
        <div className="flex items-center gap-2">
          <RefreshCcw className="w-3 h-3" />
          <span>Último Scan: <span className="text-gray-300">{lastScan}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3" />
          <span>Domínio Alvo: <span className="text-gray-300">{domain}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          <span>Protocolo: <span className="text-cyan-400">{protocol}</span></span>
        </div>
      </div>
    </>
  );
};
