import React, { useState, useEffect } from 'react';

interface TerminalProps {
  logs?: string[];
  title?: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export const Terminal: React.FC<TerminalProps> = ({ 
  logs: externalLogs, 
  title = "Live Engine Logs",
  className = "",
  theme = 'dark'
}) => {
  const [internalLogs, setInternalLogs] = useState([
    "> System ready. Waiting for target...",
    "> Neural engine initialized.",
    "> Protocol v3.5 active."
  ]);
  
  const logs = externalLogs || internalLogs;

  useEffect(() => {
    if (externalLogs) return;
    
    const messages = [
      "> Scanning sitemap.xml... [OK]",
      "> Analyzing entity Vector X... [WARN]",
      "> Semantic density check: 84%",
      "> Re-indexing knowledge graph...",
      "> Authority node stable.",      "> Optimizing latent space mapping...",
      "> Syncing GEO data points...",
    ];

    const interval = setInterval(() => {
      setInternalLogs(prev => [...prev.slice(-12), messages[Math.floor(Math.random() * messages.length)]]);
    }, 2500);

    return () => clearInterval(interval);
  }, [externalLogs]);

  // Scroll automático completamente removido
  // O usuário deve rolar manualmente se quiser ver logs mais recentes

  return (
    <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-700'} rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto flex flex-col shadow-inner ${className}`}>
      <div className={`flex justify-between items-center mb-3 border-b ${theme === 'dark' ? 'border-gray-900' : 'border-gray-700'} pb-2`}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} text-[10px] uppercase tracking-widest`}>{title}</span>
      </div>
      <div className="flex-1 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('[WARN]') ? 'text-purple-400' : log.includes('[ERROR]') ? 'text-red-400' : 'text-cyan-400/80'}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
