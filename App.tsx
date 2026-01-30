
import React, { useState } from 'react';
import { View } from './types';
import { ICONS } from './constants';
import Dashboard from './views/Dashboard';
import GeoScanner from './views/GeoScanner';
import AuthorityValidator from './views/AuthorityValidator';
import DataLab from './views/DataLab';
import AgenticReadiness from './views/AgenticReadiness';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);

  const NavItem = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-mono tracking-tight transition-all border-l-2
        ${activeView === view 
          ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 terminal-glow' 
          : 'border-transparent text-cyan-800 hover:text-cyan-600 hover:bg-cyan-900/5'
        }`}
    >
      <Icon />
      <span className="uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-cyan-400 selection:bg-cyan-900 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 industrial-border border-r border-t-0 border-b-0 border-l-0 flex flex-col z-10">
        <div className="p-6 mb-4">
          <div className="text-2xl font-bold terminal-glow italic">SOMA_RUSH</div>
          <div className="text-[10px] text-cyan-800 uppercase tracking-widest mt-1">Console v3.0 // Infra</div>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem view={View.DASHBOARD} label="Painel_v3" icon={ICONS.Activity} />
          <NavItem view={View.GEO_SCANNER} label="Scanner_GEO" icon={ICONS.Search} />
          <NavItem view={View.AGENT_PROTOC} label="[O] AGENT_PROTOC" icon={ICONS.Bot} />
          <NavItem view={View.AUTHORITY_VALIDATOR} label="Validador_Aut" icon={ICONS.Shield} />
          <NavItem view={View.DATA_LAB} label="Lab_Estrutura" icon={ICONS.Code} />
        </nav>

        {/* System Heartbeat v3.0 */}
        <div className="p-4 border-t border-cyan-900/40 cursor-pointer hover:bg-cyan-900/10 transition-colors group">
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] text-cyan-900 uppercase font-bold">System_Heartbeat</div>
             <div className="text-[8px] bg-green-900/20 text-green-500 px-1 rounded border border-green-500/20">99.9%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-cyan-700">SomaNode Host</span>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-cyan-700">Visual Engine</span>
            </div>
            <div className="flex items-center gap-2 text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <span className="text-cyan-700">Mention Radar (Busy)</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#050505] p-8">
        <div className="max-w-6xl mx-auto">
          {activeView === View.DASHBOARD && <Dashboard />}
          {activeView === View.GEO_SCANNER && <GeoScanner />}
          {activeView === View.AGENT_PROTOC && <AgenticReadiness />}
          {activeView === View.AUTHORITY_VALIDATOR && <AuthorityValidator />}
          {activeView === View.DATA_LAB && <DataLab />}
        </div>
      </main>

      {/* Subtle Terminal Scan Line Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-50"></div>
    </div>
  );
};

export default App;
