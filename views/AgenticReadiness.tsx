
import React, { useState } from 'react';
import Terminal from '../components/Terminal';
import { auditAgenticReadiness } from '../services/gemini';
import { AgenticAuditResult } from '../types';
import { ICONS } from '../constants';

const AgenticReadiness: React.FC = () => {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AgenticAuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAuditing(true);
    setResult(null);
    setLogs([
      `INICIANDO PROTOCOLO AGÊNTICO v2.2...`,
      `TARGET: ${url}`,
      `> EXECUTANDO MCP HANDSHAKE (/.well-known/mcp.json)...`,
      `> INICIANDO PRIVACY SHIELD AUDIT (Data Leak Check)...`,
      `> ANALISANDO PERMISSÕES DE AGENTE (GET vs POST)...`,
      `> VERIFICANDO GPT STORE POSITIONING...`,
    ]);

    try {
      const data = await auditAgenticReadiness(url);
      setResult(data);
      setLogs(prev => [...prev, `AUDITORIA v2.2 CONCLUÍDA. STATUS: ${data.statusLabel}`]);
    } catch (error) {
      setLogs(prev => [...prev, `!ERRO NA AUDITORIA AGÊNTICA: ${error}`]);
    } finally {
      setIsAuditing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY_FOR_STORE': return 'text-green-500 border-green-500';
      case 'PASSIVE_ONLY': return 'text-yellow-500 border-yellow-500';
      case 'BLOCKED': return 'text-red-500 border-red-500';
      default: return 'text-cyan-500 border-cyan-500';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold terminal-glow uppercase italic">Agent_Protoc_v2.2</h1>
          <p className="text-cyan-600 text-sm">MCP Infrastructure & Privacy Shield Auditor</p>
        </div>
        <div className="bg-purple-900/20 px-3 py-1 rounded border border-purple-500/30">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Agentic Readiness Era</span>
        </div>
      </div>

      <form onSubmit={handleAudit} className="flex gap-2">
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://sua-empresa.com.br"
          className="flex-1 bg-black industrial-border p-4 rounded text-cyan-400 placeholder-cyan-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button 
          disabled={isAuditing}
          className="bg-purple-600 text-white px-8 font-bold rounded hover:bg-purple-500 disabled:opacity-50 transition-all uppercase border border-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
        >
          {isAuditing ? 'Auditoria v2.2...' : 'Escanear_Prontidão'}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Feedback Estruturado v2.2 */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Diagnóstico SomaRush OS</h3>
          <Terminal logs={logs} />
          
          {result && (
            <div className={`industrial-border bg-black/40 p-6 rounded border-l-4 ${getStatusColor(result.statusLabel).split(' ')[1]}`}>
              <h3 className="text-xs font-bold uppercase mb-3 text-cyan-200 border-b border-cyan-900/30 pb-2 flex justify-between">
                Relatório de Engenharia v2.2
                <span className="text-[10px] opacity-50">SomaVerso Lab</span>
              </h3>
              
              <p className="text-xs text-cyan-400 leading-relaxed font-sans mb-4 italic">
                "{result.report.summary}"
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold text-cyan-700 uppercase mb-2">Pontos Críticos de Atenção</h4>
                  <ul className="space-y-1">
                    {result.report.bulletPoints.map((point, i) => (
                      <li key={i} className="text-[11px] text-cyan-500 flex items-start gap-2">
                         <span className="mt-1 text-[8px] opacity-70">►</span> 
                         <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-900/10 p-4 rounded border border-purple-500/20">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-2">Compliance & Privacy Shield</h4>
                  <p className="text-[10px] text-purple-300 leading-relaxed font-mono">
                    {result.report.complianceNote}
                  </p>
                </div>

                <div className="bg-black/60 p-4 rounded border border-cyan-900/50">
                  <h4 className="text-[10px] font-bold text-cyan-200 uppercase mb-2 italic">Plano de Correção Imediata</h4>
                  <ul className="space-y-2">
                    {result.report.actionChecklist.map((action, i) => (
                      <li key={i} className="text-[11px] text-cyan-500 flex items-start gap-2">
                        <input type="checkbox" disabled className="mt-0.5 accent-cyan-500" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lado Direito: Dashboard Agêntico v2.2 */}
        <div className="lg:col-span-7 space-y-6">
           {!result && !isAuditing && (
            <div className="industrial-border bg-black/40 rounded h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-purple-900/50">
               <div className="w-16 h-16 border-2 border-purple-900 rounded-full flex items-center justify-center mb-4 text-purple-800">
                 <ICONS.Bot />
               </div>
               <p className="text-purple-800 text-sm uppercase font-bold">Pronto para Handshake MCP e Privacy Audit.</p>
               <p className="text-cyan-900 text-[10px] mt-2 italic">Insira uma URL para validar se o domínio é visível para agentes ativos.</p>
            </div>
           )}

           {isAuditing && (
              <div className="industrial-border bg-black/40 rounded h-full flex flex-col items-center justify-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 animate-pulse uppercase tracking-[0.3em] text-[10px] font-bold">Injetando Protocolo v2.2</div>
                  <div className="text-cyan-900 text-[8px] mt-2">Acessando manifests, logs e instrução de sistema...</div>
                </div>
              </div>
           )}

           {result && (
             <div className="space-y-6 animate-in zoom-in-95 duration-300">
               {/* Velocímetro Duplo */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="industrial-border bg-black/60 p-6 rounded text-center border-b-4 border-cyan-500">
                   <div className="text-[10px] text-cyan-700 uppercase font-bold mb-2">GEO Score (Legibilidade)</div>
                   <div className="text-6xl font-black text-cyan-400">
                     {result.geoScore}
                   </div>
                   <div className="text-[10px] text-cyan-900 mt-2 uppercase tracking-tighter">Visibilidade de Conteúdo</div>
                 </div>
                 <div className="industrial-border bg-black/60 p-6 rounded text-center border-b-4 border-purple-500 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
                   <div className="text-[10px] text-purple-600 uppercase font-bold mb-2">Agentic Score (Ação)</div>
                   <div className="text-6xl font-black text-purple-400">
                     {result.score}
                   </div>
                   <div className="text-[10px] text-purple-900 mt-2 uppercase tracking-tighter">Capacidade Transacional</div>
                 </div>
               </div>

               {/* Grid de Status v2.2 */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="industrial-border bg-black/40 p-4 rounded text-center group">
                    <div className="text-[9px] text-cyan-800 uppercase mb-2">MCP Status</div>
                    <div className={`text-sm font-bold ${result.mcpStatus === 'CONNECTED' ? 'text-green-400' : 'text-red-500'}`}>
                      {result.mcpStatus}
                    </div>
                    <div className="text-[8px] text-cyan-900 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Model Context Protocol</div>
                 </div>
                 <div className="industrial-border bg-black/40 p-4 rounded text-center group">
                    <div className="text-[9px] text-cyan-800 uppercase mb-2">Privacy Shield</div>
                    <div className={`text-sm font-bold ${result.privacyStatus === 'SAFE_HARBOR' ? 'text-green-400' : 'text-red-500'}`}>
                      {result.privacyStatus.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[8px] text-cyan-900 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Data Leak Protection</div>
                 </div>
                 <div className="industrial-border bg-black/40 p-4 rounded text-center group">
                    <div className="text-[9px] text-cyan-800 uppercase mb-2">Agent Type</div>
                    <div className={`text-sm font-bold ${result.schemaChecks.actionType === 'TRANSACTIONAL' ? 'text-purple-400' : 'text-yellow-500'}`}>
                      {result.schemaChecks.actionType}
                    </div>
                    <div className="text-[8px] text-cyan-900 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">GET vs POST Capability</div>
                 </div>
               </div>

               {/* Store Rank Tracking */}
               {result.storeRank && (
                 <div className="industrial-border bg-purple-950/10 p-5 rounded border-purple-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-purple-400 uppercase italic">GPT Store Visibility Tracker</h4>
                      <span className="text-[9px] bg-purple-900/40 text-purple-200 px-2 py-0.5 rounded">Live_Sync</span>
                    </div>
                    <div className="flex items-end gap-6">
                      <div className="flex-1">
                        <div className="text-[10px] text-cyan-800 uppercase mb-1">Palavra-Chave</div>
                        <div className="text-lg font-bold text-cyan-200">"{result.storeRank.keyword}"</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-cyan-800 uppercase mb-1">Posição</div>
                        <div className="text-3xl font-black text-purple-400 italic">#{result.storeRank.position}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-900/30">
                       <div className="text-[9px] text-cyan-900 uppercase mb-2 italic">Concorrentes Diretos Acima</div>
                       <div className="flex gap-2">
                         {result.storeRank.competitorsAbove.map((comp, i) => (
                           <span key={i} className="text-[10px] bg-black/60 px-2 py-1 rounded text-cyan-700 border border-cyan-900/30">{comp}</span>
                         ))}
                       </div>
                    </div>
                 </div>
               )}

               {/* Manifests Checklist */}
               <div className="industrial-border bg-black/20 p-5 rounded">
                 <h4 className="text-[10px] font-bold text-cyan-800 uppercase mb-3 border-b border-cyan-950 pb-2">Infra_Manifest_Check</h4>
                 <div className="grid grid-cols-3 gap-4 text-center">
                   <div className="space-y-1">
                     <div className="text-[9px] text-cyan-900">ai-plugin.json</div>
                     <div className={`text-xs font-bold ${result.manifests.aiPluginJson ? 'text-green-500' : 'text-red-900'}`}>{result.manifests.aiPluginJson ? '✅ FOUND' : '❌ MISSING'}</div>
                   </div>
                   <div className="space-y-1">
                     <div className="text-[9px] text-cyan-900">openapi.yaml</div>
                     <div className={`text-xs font-bold ${result.manifests.openApiYaml ? 'text-green-500' : 'text-red-900'}`}>{result.manifests.openApiYaml ? '✅ FOUND' : '❌ MISSING'}</div>
                   </div>
                   <div className="space-y-1">
                     <div className="text-[9px] text-cyan-900">mcp.json</div>
                     <div className={`text-xs font-bold ${result.manifests.mcpJson ? 'text-green-500' : 'text-red-900'}`}>{result.manifests.mcpJson ? '✅ FOUND' : '❌ MISSING'}</div>
                   </div>
                 </div>
               </div>

             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AgenticReadiness;
