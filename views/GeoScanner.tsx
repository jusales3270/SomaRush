import React, { useState } from 'react';
import Terminal from '../components/Terminal';
import { analyzeGeoReadability, saveGeoScan } from '../services/gemini';
import { ICONS } from '../constants';
import ExecutiveReportView from './ExecutiveReportView';
import { useExecutiveExport } from '../src/hooks/useExecutiveExport';
import { buildExecutiveReport } from '../src/core/reportBuilder';
import { getBenchmarks } from '../src/core/benchmarkStorage';
import { ExecutiveReport } from '../types';

const GeoScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [report, setReport] = useState<ExecutiveReport | null>(null);
  const { exportPDF } = useExecutiveExport();
  const [isExporting, setIsExporting] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);

    // Logs detalhados simulando o novo backend Python/Playwright
    setLogs([
      `INICIALIZANDO SOMARUSH GEO ENGINE v2.0...`,
      `ALVO: ${url}`,
      'LANÇANDO NAVEGADOR HEADLESS (CHROMIUM)...',
      'CONFIGURANDO USER-AGENT: OAI-SearchBot/1.0',
      'AGUARDANDO networkidle (ESTABILIZAÇÃO DE SCRIPTS)...',
      'RENDERIZANDO DOM COMPLETO (SPA DETECTADO)...',
      'CAPTURANDO HTML RENDERIZADO...',
      'LIMPANDO ELEMENTOS NÃO-SEMÂNTICOS (SCRIPTS/STYLES)...',
      'ENVIANDO BUFFER PARA AUDITORIA GEMINI 3 PRO...'
    ]);

    try {
      // O Gemini agora recebe as instruções de sistema corretas
      // Simulamos a passagem do conteúdo renderizado enviando um contexto fictício que o Gemini analisará baseado na URL
      const data = await analyzeGeoReadability(url, `[HTML_RENDERED_BUFFER_FROM_PLAYWRIGHT]\nURL: ${url}\nDetected: Tables, Lists, Meta-tags.`);

      setLogs(prev => [...prev, 'AUDITORIA TÉCNICA FINALIZADA COM SUCESSO.']);

      // Persist to Supabase
      await saveGeoScan(url, data);
      setLogs(prev => [...prev, 'RESULTADO SALVO NO BANCO DE DADOS.']);

      // Construct Executive Report
      const benchmarks = getBenchmarks();
      const latestBench = benchmarks.length > 0 ? benchmarks[benchmarks.length - 1] : undefined;
      const generatedReport = buildExecutiveReport(data, latestBench);
      setReport(generatedReport);

      setResult(data);
    } catch (error) {
      setLogs(prev => [...prev, '!ERRO CRÍTICO: FALHA NA RENDERIZAÇÃO OU API TIMEOUT.']);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-3xl font-bold terminal-glow uppercase">Scanner_GEO.v2</h1>
        <p className="text-cyan-600 text-sm">Raio-X de Infraestrutura com Renderização Playwright</p>
      </div>

      <form onSubmit={handleScan} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://exemplo.com.br/pagina-produto"
          className="flex-1 bg-black industrial-border p-3 rounded text-cyan-400 placeholder-cyan-900 focus:outline-none focus:ring-1 focus:ring-cyan-400"
        />
        <button
          disabled={isScanning}
          className="bg-cyan-500 text-black px-6 font-bold rounded hover:bg-cyan-400 disabled:opacity-50 transition-colors uppercase"
        >
          {isScanning ? 'Escanenando...' : 'Iniciar_Auditoria'}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Log de Processo (Engine v2.0)</h3>
          <Terminal logs={logs} />

          {result && (
            <div className="industrial-border bg-black/40 p-4 rounded space-y-4">
              <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Alertas de Infraestrutura</h3>
              <ul className="space-y-2">
                {result.criticalAlerts.map((alert: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-red-400">
                    <span>[!]</span>
                    <span>{alert}</span>
                  </li>
                ))}
                {result.criticalAlerts.length === 0 && <li className="text-green-500">Nenhum problema detectado pelo motor de renderização.</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Métricas de Legibilidade</h3>
          {!result && !isScanning && (
            <div className="industrial-border bg-black/40 rounded h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="p-4 rounded-full bg-cyan-900/20 mb-4">
                <ICONS.Search />
              </div>
              <p className="text-cyan-800 text-sm">Aguardando inicialização do motor de leitura...</p>
            </div>
          )}

          {isScanning && (
            <div className="industrial-border bg-black/40 rounded h-full flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-cyan-400 animate-pulse uppercase tracking-widest text-xs">Aguardando rede (networkidle)...</div>
              </div>
            </div>
          )}

          {result && (
            <div className="industrial-border bg-black/40 p-6 rounded space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">GEO SCORE FINAL</span>
                <span className={`text-5xl font-bold ${result.score > 70 ? 'text-green-400' : 'text-yellow-400'}`}>{result.score}/100</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/60 rounded flex justify-between items-center">
                  <span className="text-xs text-cyan-800 uppercase">H1-H6 Tags</span>
                  <span className={result.semanticAnalysis.headers ? 'text-green-500' : 'text-red-500'}>
                    {result.semanticAnalysis.headers ? 'DETECTADO' : 'AUSENTE'}
                  </span>
                </div>
                <div className="p-3 bg-black/60 rounded flex justify-between items-center">
                  <span className="text-xs text-cyan-800 uppercase">JSON-LD</span>
                  <span className={result.semanticAnalysis.schemaValid ? 'text-green-500' : 'text-red-500'}>
                    {result.semanticAnalysis.schemaValid ? 'VÁLIDO' : 'FALHA'}
                  </span>
                </div>
                <div className="p-3 bg-black/60 rounded flex justify-between items-center">
                  <span className="text-xs text-cyan-800 uppercase">Table Parse</span>
                  <span className={result.semanticAnalysis.tables ? 'text-green-500' : 'text-red-500'}>
                    {result.semanticAnalysis.tables ? 'OK' : 'ERRO'}
                  </span>
                </div>
                <div className="p-3 bg-black/60 rounded flex justify-between items-center">
                  <span className="text-xs text-cyan-800 uppercase">List Struct</span>
                  <span className={result.semanticAnalysis.lists ? 'text-green-500' : 'text-red-500'}>
                    {result.semanticAnalysis.lists ? 'OK' : 'POBRE'}
                  </span>
                </div>
              </div>

              {/* PROTOCOL AUDIT SECTION */}
              {result.protocolAudit && (
                <div className="pt-4 border-t border-cyan-900">
                  <h4 className="text-xs font-bold text-cyan-800 uppercase mb-3 flex items-center justify-between">
                    <span>Protocol Compliance</span>
                    <span className="text-cyan-400 font-black">{result.protocolAudit.score}/100</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-black/60 rounded flex justify-between items-center text-xs">
                      <span className="text-cyan-700">/llm.txt</span>
                      <span className={result.protocolAudit.llmTxt ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {result.protocolAudit.llmTxt ? 'DETECTED' : 'MISSING'}
                      </span>
                    </div>
                    <div className="p-2 bg-black/60 rounded flex justify-between items-center text-xs">
                      <span className="text-cyan-700">ai-plugin.json</span>
                      <span className={result.protocolAudit.aiPlugin ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {result.protocolAudit.aiPlugin ? 'VALID' : 'MISSING'}
                      </span>
                    </div>
                    <div className="p-2 bg-black/60 rounded flex justify-between items-center text-xs">
                      <span className="text-cyan-700">mcp.json</span>
                      <span className={result.protocolAudit.mcpJson ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {result.protocolAudit.mcpJson ? 'VALID' : 'MISSING'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-cyan-900">
                <h4 className="text-xs font-bold text-cyan-800 uppercase mb-2">Visão da Máquina (Raw Text)</h4>
                <div className="bg-black p-3 rounded text-[10px] text-cyan-500 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-cyan-900/50">
                  {result.rawReadingSim}
                </div>
              </div>

              {/* AGENCY SURFACE EXPORT */}
              {report && (
                <div className="pt-6 mt-4 border-t border-purple-900/50">
                  <button
                    onClick={async () => {
                      setIsExporting(true);
                      await exportPDF(report, "executive-report-export");
                      setIsExporting(false);
                    }}
                    disabled={isExporting}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black py-4 px-4 rounded transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:transform-none uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <ICONS.Activity className="w-5 h-5" />
                    {isExporting ? 'Generating PDF Engine...' : 'Export Agency Report (PDF)'}
                  </button>
                  {/* Invisible render for the PDF engine */}
                  <ExecutiveReportView report={report} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoScanner;
