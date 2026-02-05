
import React, { useState } from 'react';
import { View } from './types';
import { ICONS } from './constants';
import Dashboard from './views/Dashboard';
import GeoScanner from './views/GeoScanner';
import AuthorityValidator from './views/AuthorityValidator';
import DataLab from './views/DataLab';
import AgenticReadiness from './views/AgenticReadiness';

// Import Theme Context
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a] p-10 font-mono text-red-500">
          <div className="max-w-2xl w-full border border-red-500/30 bg-red-900/10 p-8 rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <ICONS.Shield />
              SYSTEM CRITICAL FAILURE
            </h1>
            <p className="text-red-400 mb-6 uppercase tracking-widest text-xs">Runtime Exception Detected</p>

            <div className="bg-black/50 p-4 rounded border border-red-500/20 overflow-auto max-h-64">
              <code className="whitespace-pre-wrap break-all text-sm">
                {this.state.error?.toString()}
              </code>
            </div>

            <div className="mt-6 pt-6 border-t border-red-500/20 text-xs text-red-400/60">
              SOMA_RUSH // DEBUG_MODE // v3.0
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const { theme, sidebarCollapsed, toggleTheme, toggleSidebar } = useTheme();

  // Dynamic Styles based on Theme
  const bgMain = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'; // Background Main
  const bgSidebar = theme === 'dark' ? 'bg-[#0b0b0b]' : 'bg-white'; // Sidebar BG
  const textPrimary = theme === 'dark' ? 'text-cyan-400' : 'text-slate-700'; // Primary Text
  const textSecondary = theme === 'dark' ? 'text-cyan-800' : 'text-slate-400'; // Secondary Text
  const borderMain = theme === 'dark' ? 'border-cyan-900/40' : 'border-slate-200'; // Borders
  const navHover = theme === 'dark' ? 'hover:bg-cyan-900/20 hover:text-cyan-400' : 'hover:bg-slate-100 hover:text-slate-900';
  const navActive = theme === 'dark'
    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 terminal-glow'
    : 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold';

  const NavItem = ({ view, label, icon: Icon }: { view: View, label: string, icon: any }) => (
    <button
      onClick={() => setActiveView(view)}
      title={sidebarCollapsed ? label : ''}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-mono tracking-tight transition-all border-l-2
        ${activeView === view ? navActive : `border-transparent ${textSecondary} ${navHover}`}`}
    >
      <div className={`${sidebarCollapsed ? 'mx-auto' : ''}`}>
        <Icon />
      </div>
      {!sidebarCollapsed && <span className="uppercase truncate">{label}</span>}
    </button>
  );

  return (
    <div className={`flex h-screen ${bgMain} ${textPrimary} selection:bg-cyan-900 selection:text-white transition-colors duration-300`}>
      {/* Sidebar Navigation */}
      <aside
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${bgSidebar} border-r ${borderMain} flex flex-col z-10 transition-all duration-300 shadow-xl`}
      >
        <div className={`p-6 mb-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div>
              <div className={`text-2xl font-bold italic ${theme === 'dark' ? 'terminal-glow' : 'text-indigo-600'}`}>SOMA_RUSH</div>
              <div className={`text-[10px] uppercase tracking-widest mt-1 ${textSecondary}`}>Console v3.5 // Infra</div>
            </div>
          )}
          {/* Logo/Icon when collapsed or just consistent placement */}
          {sidebarCollapsed && <div className="text-xl font-bold text-indigo-500">SR</div>}
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem view={View.DASHBOARD} label="Painel_v3" icon={ICONS.Activity} />
          <NavItem view={View.GEO_SCANNER} label="Scanner_GEO" icon={ICONS.Search} />
          <NavItem view={View.AGENT_PROTOC} label="Agente_Protocol" icon={ICONS.Bot} />
          <NavItem view={View.AUTHORITY_VALIDATOR} label="Validador_Aut" icon={ICONS.Shield} />
          <NavItem view={View.DATA_LAB} label="Lab_Conteúdo" icon={ICONS.Code} />
        </nav>

        {/* System Controls */}
        <div className={`p-4 border-t ${borderMain} space-y-2`}>
          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors ${navHover} ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
            {!sidebarCollapsed && <span className="text-xs uppercase font-bold">Mudar Tema</span>}
          </button>

          {/* Toggle Sidebar */}
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors ${navHover} ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Toggle Sidebar"
          >
            {sidebarCollapsed ? '»' : '«'}
            {!sidebarCollapsed && <span className="text-xs uppercase font-bold">Colapsar Menu</span>}
          </button>
        </div>

        {/* System Heartbeat v3.0 */}
        {!sidebarCollapsed && (
          <div className={`p-4 border-t ${borderMain} cursor-pointer transition-colors group ${theme === 'light' ? 'bg-slate-50' : 'hover:bg-cyan-900/10'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className={`text-[10px] uppercase font-bold ${textSecondary}`}>System_Heartbeat</div>
              <div className="text-[8px] bg-green-500/20 text-green-600 px-1 rounded border border-green-500/20">99.9%</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className={`font-mono ${textSecondary}`}>SomaNode Host</span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span className={`font-mono ${textSecondary}`}>Visual Engine</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-7xl mx-auto">
          {activeView === View.DASHBOARD && <Dashboard />}
          {activeView === View.GEO_SCANNER && <GeoScanner />}
          {activeView === View.AGENT_PROTOC && <AgenticReadiness />}
          {activeView === View.AUTHORITY_VALIDATOR && <AuthorityValidator />}
          {activeView === View.DATA_LAB && <DataLab />}
        </div>
      </main>

      {/* Subtle Terminal Scan Line Overlay (Dark Mode Only) */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-50"></div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;

