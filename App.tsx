import React, { useState } from 'react';
import { View } from './types';
import Dashboard from './views/Dashboard';
import GeoScanner from './views/GeoScanner';
import AuthorityValidator from './views/AuthorityValidator';
import DataLab from './views/DataLab';
import AgenticReadiness from './views/AgenticReadiness';

// Import Theme Context
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Logo, FaviconNode } from './src/components/ui';
import { 
  Activity, 
  Search, 
  Bot, 
  ShieldCheck, 
  Code,
  ChevronRight,
  User,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class ErrorBoundary extends React.Component<{children: any}, {hasError: boolean; error: any}> {
  // @ts-ignore
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0B0E14] p-10 font-mono text-red-500">
          <div className="max-w-2xl w-full border border-red-500/30 bg-red-900/10 p-8 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8" />
              SYSTEM CRITICAL FAILURE
            </h1>
            <p className="text-red-400 mb-6 uppercase tracking-widest text-xs">Runtime Exception Detected</p>

            <div className="bg-black/50 p-4 rounded-lg border border-red-500/20 overflow-auto max-h-64">
              <code className="whitespace-pre-wrap break-all text-sm">
                {/* @ts-ignore */}
                {this.state.error?.toString()}
              </code>
            </div>

            <div className="mt-6 pt-6 border-t border-red-500/20 text-xs text-red-400/60">
              SOMA_RUSH // DEBUG_MODE // v3.5
            </div>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const { theme, colors, sidebarCollapsed, toggleTheme, toggleSidebar } = useTheme();

  // Map icon components
  const iconMap = {
    [View.DASHBOARD]: Activity,
    [View.GEO_SCANNER]: Search,
    [View.AGENT_PROTOC]: Bot,
    [View.AUTHORITY_VALIDATOR]: ShieldCheck,
    [View.DATA_LAB]: Code,
  };

  const viewLabels = {
    [View.DASHBOARD]: 'Painel Neural',
    [View.GEO_SCANNER]: 'Scanner GEO',
    [View.AGENT_PROTOC]: 'Agente Protocol',
    [View.AUTHORITY_VALIDATOR]: 'Autoridade',
    [View.DATA_LAB]: 'Lab Conteúdo',
  };

  const NavItem = ({ view }: { view: View }) => {
    const Icon = iconMap[view];
    const isActive = activeView === view;
    
    return (
      <button
        onClick={() => setActiveView(view)}
        title={sidebarCollapsed ? viewLabels[view] : ''}
        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-mono tracking-tight transition-all border-l-2 rounded-r-lg
          ${isActive 
            ? `bg-cyan-500/10 border-cyan-400 ${colors.cyan}` 
            : `border-transparent ${colors.textMuted} ${colors.bgCardHover} hover:${colors.textSecondary}`
          }`}
      >
        <div className={`${sidebarCollapsed ? 'mx-auto' : ''}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!sidebarCollapsed && <span className="uppercase truncate">{viewLabels[view]}</span>}
        {!sidebarCollapsed && isActive && (
          <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
        )}
      </button>
    );
  };

  return (
    <div className={`flex h-screen ${colors.bgMain} ${colors.textPrimary} selection:bg-cyan-500/30 font-sans overflow-hidden transition-colors duration-300`}>
      {/* Background Ambience - only in dark mode */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px]"></div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} ${colors.bgSidebar} backdrop-blur-xl border-r ${colors.border} flex flex-col z-20 transition-all duration-300`}
      >
        {/* Logo Area */}
        <div className={`p-6 mb-2 flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon 
                  points="50,5 95,25 95,75 50,95 5,75 5,25" 
                  fill={theme === 'dark' ? '#0B0E14' : '#fff'}
                  stroke="#00F5FF" 
                  strokeWidth="3"
                />
                <circle cx="50" cy="50" r="12" fill="#00F5FF" className="animate-pulse" />
              </svg>
            </div>
          ) : (
            <Logo theme={theme} />
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-2">
          <NavItem view={View.DASHBOARD} />
          <NavItem view={View.GEO_SCANNER} />
          <NavItem view={View.AGENT_PROTOC} />
          <NavItem view={View.AUTHORITY_VALIDATOR} />
          <NavItem view={View.DATA_LAB} />
        </nav>

        {/* System Controls */}
        <div className={`p-4 border-t ${colors.border} space-y-2`}>
          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${colors.textMuted} ${colors.bgCardHover} hover:${colors.textSecondary} transition-colors`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-xs uppercase font-bold">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>

          {/* Toggle Sidebar */}
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${colors.textMuted} ${colors.bgCardHover} hover:${colors.textSecondary} transition-colors`}
            title="Toggle Sidebar"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-xs uppercase font-bold">Recolher</span>}
          </button>
        </div>

        {/* System Status */}
        {!sidebarCollapsed && (
          <div className={`p-4 border-t ${colors.border}`}>
            <div className="flex justify-between items-center mb-3">
              <div className={`text-[10px] uppercase font-bold ${colors.textMuted}`}>System Status</div>
              <FaviconNode status="neutral" theme={theme} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className={`font-mono ${colors.textMuted}`}>Neural Engine Online</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span className={`font-mono ${colors.textMuted}`}>Gemini Protocol v3.5</span>
              </div>
            </div>
            <div className={`mt-3 pt-3 border-t ${colors.border}`}>
              <div className={`flex justify-between text-[9px] ${colors.textMuted} uppercase`}>
                <span>Uptime</span>
                <span className={colors.statusOnline}>99.9%</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Top Bar */}
        <div className={`sticky top-0 z-20 ${colors.bgSidebar} backdrop-blur-md border-b ${colors.border} px-8 py-4`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${colors.textMuted} font-mono text-xs`}>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>VIEW:</span>
              <span className={`${colors.cyan} uppercase tracking-wider`}>{viewLabels[activeView]}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full`}>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-[10px] font-mono font-bold ${colors.statusOnline} uppercase tracking-widest`}>Online</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className={`w-full h-full ${theme === 'dark' ? 'bg-[#0B0E14]' : 'bg-white'} rounded-[7px] flex items-center justify-center`}>
                  <User className={`w-4 h-4 ${colors.textMuted}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {activeView === View.DASHBOARD && <Dashboard />}
            {activeView === View.GEO_SCANNER && <GeoScanner />}
            {activeView === View.AGENT_PROTOC && <AgenticReadiness />}
            {activeView === View.AUTHORITY_VALIDATOR && <AuthorityValidator />}
            {activeView === View.DATA_LAB && <DataLab />}
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-12 px-8 pb-8 border-t ${colors.border} pt-6`}>
          <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] ${colors.textMuted} font-mono uppercase tracking-[0.2em]`}>
            <div className="flex gap-6">
              <span className={`hover:${colors.cyan} cursor-pointer transition-colors`}>Infra: Neural-01</span>
              <span className={`hover:${colors.purple} cursor-pointer transition-colors`}>Encryption: AES-256</span>
            </div>
            <p>© 2026 SOMA RUSH // THE NEURAL FLOW ENGINE</p>
          </div>
        </footer>
      </main>
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
