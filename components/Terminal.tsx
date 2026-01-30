
import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black/80 industrial-border p-4 rounded h-64 overflow-y-auto font-mono text-sm space-y-1">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-cyan-800">[{new Date().toLocaleTimeString('pt-BR')}]</span>
          <span className={`${log.startsWith('!') ? 'text-red-400' : 'text-cyan-400'}`}>
            {log.startsWith('!') ? 'ERRO' : '>'} {log.replace('!', '')}
          </span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-cyan-900 italic">SISTEMA EM ESPERA. AGUARDANDO ENTRADA...</div>
      )}
      <div ref={endRef} />
      <div className="inline-block w-2 h-4 bg-cyan-400 cursor-blink"></div>
    </div>
  );
};

export default Terminal;
