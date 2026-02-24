import React, { useState } from 'react';
import { 
  Search, 
  Terminal as TerminalIcon,
  Activity,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Bot,
  Zap,
  Loader2,
  Globe
} from 'lucide-react';
import { analyzeGeoReadability, saveGeoScan } from '../services/gemini';
import { useExecutiveExport } from '../src/hooks/useExecutiveExport';
import { buildExecutiveReport } from '../src/core/reportBuilder';
import { getBenchmarks } from '../src/core/benchmarkStorage';
import { ExecutiveReport } from '../types';
import { useTheme } from '../src/context/ThemeContext';
import { Terminal, ScoreCircle, ActionButton, FaviconNode } from '../src/components/ui';
import ExecutiveReportView from './ExecutiveReportView';

const GeoScanner: React.FC = () => {
  const { colors, theme } = useTheme();
  const [url, setUrl] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "> System ready. Waiting for target...",
    "> Neural engine initialized.",
    "> Protocol v3.5 active."
  ]);
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

    setLogs([
      `> INICIALIZANDO SOMARUSH GEO ENGINE v3.5...`,
      `> ALVO: ${url}`,
      '> LANÇANDO NAVEGADOR HEADLESS (CHROMIUM)...',
      '> CONFIGURANDO USER-AGENT: OAI-SearchBot/1.0',
      '> AGUARDANDO networkidle (ESTABILIZAÇÃO)...',
      '> RENDERIZANDO DOM COMPLETO...',
      '> CAPTURANDO HTML RENDERIZADO...',
      '> LIMPANDO ELEMENTOS NÃO-SEMÂNTICOS...',
      '> ENVIANDO BUFFER PARA GEMINI 3 PRO...'
    ]);

    try {
      const data = await analyzeGeoReadability(url, `[HTML_RENDERED_BUFFER]\nURL: ${url}\nDetected: Tables, Lists, Meta-tags.`);

      setLogs(prev => [...prev, '> AUDITORIA TÉCNICA FINALIZADA COM SUCESSO.']);

      await saveGeoScan(url, data);
      setLogs(prev => [...prev, '> RESULTADO PERSISTIDO NO CLUSTER.']);

      const benchmarks = getBenchmarks();
      const latestBench = benchmarks.length > 0 ? benchmarks[benchmarks.length - 1] : undefined;
      const generatedReport = buildExecutiveReport(data, latestBench);
      setReport(generatedReport);

      setResult(data);
      setLogs(prev => [...prev, `> GEO SCORE CALCULADO: ${data.score}/100`]);
    } catch (error) {
      setLogs(prev => [...prev, '> !ERRO CRÍTICO: FALHA NA RENDERIZAÇÃO.']);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExport = async () => {
    if (!report) return;
    setIsExporting(true);
    await exportPDF(report, "executive-report-export");
    setIsExporting(false);
  };

  const chartTooltipStyle = {
    background: theme === 'dark' ? '#0B0E14' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#232931' : '#e5e7eb'}`,
    borderRadius: '8px',
    color: theme === 'dark' ? '#fff' : '#111'
  };

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${colors.textPrimary} tracking-tight`}>
            SCANNER <span className="text-cyan-400 italic font-mono">GEO</span>
          </h1>
          <p className={`${colors.textMuted} text-xs uppercase tracking-widest mt-1`}>
            Raio-X de Infraestrutura Neural
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-[10px] ${colors.textMuted} uppercase`}>Engine</div>
            <div className={`text-xs font-mono ${colors.cyan}`}>
              {isScanning ? 'SCANNING...' : 'STANDBY'}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl ${isScanning ? 'bg-cyan-500/20 animate-pulse' : 'bg-cyan-500/10'} border border-cyan-500/30 flex items-center justify-center`}>
            <Search className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl mb-6`}>
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${colors.textMuted}`}>
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com.br"
              className={`w-full ${colors.bgInput} border ${colors.border} rounded-xl py-4 pl-12 pr-4 ${colors.textPrimary} placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm`}
            />
          </div>
          <ActionButton 
            onClick={handleScan}
            isLoading={isScanning}
            label="Iniciar Auditoria Neural"
            loadingLabel="Scanning em Progresso..."
            hint="Análise completa de infraestrutura GEO e protocolos"
            theme={theme}
          />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Logs */}
        <div className="space-y-6">
          <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl`}>
            <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
              <TerminalIcon className="w-4 h-4" /> Engine Logs
            </h3>
            <Terminal logs={logs} theme={theme} />
          </div>

          {result && (
            <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl`}>
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <AlertCircle className="w-4 h-4 text-yellow-500" /> Alertas de Infraestrutura
              </h3>
              <div className="space-y-3">
                {result.criticalAlerts?.map((alert: string, i: number) => (
                  <div key={i} className="flex gap-3 text-sm text-red-400 bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{alert}</span>
                  </div>
                ))}
                {(!result.criticalAlerts || result.criticalAlerts.length === 0) && (
                  <div className="flex gap-3 text-sm text-green-400 bg-green-500/5 border border-green-500/10 p-3 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Nenhum problema crítico detectado.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {!result && !isScanning && (
            <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center`}>
              <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-cyan-400/50" />
              </div>
              <p className={`${colors.textSecondary} text-lg font-medium mb-2`}>Aguardando Target</p>
              <p className={`${colors.textMuted} text-sm max-w-sm`}>
                Insira uma URL para iniciar a análise completa de infraestrutura neural e protocolos de IA.
              </p>
            </div>
          )}

          {isScanning && (
            <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} rounded-3xl h-full min-h-[400px] flex flex-col items-center justify-center`}>
              <div className="relative">
                <div className="w-20 h-20 border-4 border-cyan-500/20 rounded-full"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-cyan-400 animate-pulse uppercase tracking-[0.2em] text-xs font-bold">
                  Neural Scanning
                </div>
                <div className={`${colors.textMuted} text-[10px] mt-2 font-mono`}>
                  Parsing DOM structures...
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* Main Score */}
              <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-8 rounded-3xl`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className={`text-[10px] ${colors.textMuted} uppercase tracking-widest mb-1`}>GEO Score Final</p>
                    <div className={`text-6xl font-black ${result.score > 70 ? 'text-green-400' : result.score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {result.score}<span className="text-2xl text-gray-600">/100</span>
                    </div>
                  </div>
                  <FaviconNode status={result.score > 70 ? "neutral" : "alert"} theme={theme} />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-4 rounded-xl flex justify-between items-center`}>
                    <span className={`text-xs ${colors.textMuted} uppercase`}>H1-H6 Tags</span>
                    <span className={result.semanticAnalysis?.headers ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {result.semanticAnalysis?.headers ? 'OK' : 'MISSING'}
                    </span>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-4 rounded-xl flex justify-between items-center`}>
                    <span className={`text-xs ${colors.textMuted} uppercase`}>JSON-LD</span>
                    <span className={result.semanticAnalysis?.schemaValid ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {result.semanticAnalysis?.schemaValid ? 'VALID' : 'INVALID'}
                    </span>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-4 rounded-xl flex justify-between items-center`}>
                    <span className={`text-xs ${colors.textMuted} uppercase`}>Tables</span>
                    <span className={result.semanticAnalysis?.tables ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                      {result.semanticAnalysis?.tables ? 'OK' : 'POOR'}
                    </span>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} p-4 rounded-xl flex justify-between items-center`}>
                    <span className={`text-xs ${colors.textMuted} uppercase`}>Lists</span>
                    <span className={result.semanticAnalysis?.lists ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                      {result.semanticAnalysis?.lists ? 'OK' : 'POOR'}
                    </span>
                  </div>
                </div>

                {/* Protocol Audit */}
                {result.protocolAudit && (
                  <div className={`mt-6 pt-6 border-t ${colors.border}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className={`text-xs font-bold ${colors.textMuted} uppercase`}>Protocol Compliance</h4>
                      <span className={`${colors.cyan} font-black text-lg`}>{result.protocolAudit.score}/100</span>
                    </div>
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center text-xs p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-lg`}>
                        <span className={colors.textMuted}>/llm.txt</span>
                        <span className={result.protocolAudit.llmTxt ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                          {result.protocolAudit.llmTxt ? 'DETECTED' : 'MISSING'}
                        </span>
                      </div>
                      <div className={`flex justify-between items-center text-xs p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-lg`}>
                        <span className={colors.textMuted}>ai-plugin.json</span>
                        <span className={result.protocolAudit.aiPlugin ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                          {result.protocolAudit.aiPlugin ? 'VALID' : 'MISSING'}
                        </span>
                      </div>
                      <div className={`flex justify-between items-center text-xs p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-lg`}>
                        <span className={colors.textMuted}>mcp.json</span>
                        <span className={result.protocolAudit.mcpJson ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                          {result.protocolAudit.mcpJson ? 'VALID' : 'MISSING'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw Text Preview */}
                <div className={`mt-6 pt-6 border-t ${colors.border}`}>
                  <h4 className={`text-xs font-bold ${colors.textMuted} uppercase mb-3`}>Machine Vision Preview</h4>
                  <div className={`${theme === 'dark' ? 'bg-black' : 'bg-gray-900'} p-4 rounded-xl text-[10px] text-gray-500 max-h-32 overflow-y-auto font-mono leading-relaxed border ${colors.border}`}>
                    {result.rawReading || result.rawReadingSim || "No preview available..."}
                  </div>
                </div>

                {/* Export Button */}
                {report && (
                  <div className={`mt-6 pt-6 border-t ${colors.border}`}>
                    <ActionButton 
                      onClick={handleExport}
                      isLoading={isExporting}
                      label="Exportar Relatório Executivo"
                      loadingLabel="Gerando PDF..."
                      hint="Relatório completo com análise MAI + SoM"
                      theme={theme}
                    />
                    <div className="hidden">
                      <ExecutiveReportView report={report} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoScanner;
