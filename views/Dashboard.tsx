import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { 
  Activity, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Terminal as TerminalIcon,
  RefreshCcw,
  AlertCircle,
  Bot,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getDashboardStats, getRecentGeoScans, getRecentAuthorityProbes } from '../services/gemini';
import { getMaiHistory } from '../src/core/maiHistory';
import { getBenchmarks } from '../src/core/benchmarkStorage';
import { BenchmarkSnapshot } from '../types';
import { useTheme } from '../src/context/ThemeContext';
import { 
  Terminal, 
  RadarChart, 
  ScoreCircle,
  FaviconNode,
  ActionButton 
} from '../src/components/ui';

// Fallback data when no database records exist
const fallbackHistoryData = [
  { name: 'Seg', score: 0, agent: 0 },
  { name: 'Ter', score: 0, agent: 0 },
  { name: 'Qua', score: 0, agent: 0 },
  { name: 'Qui', score: 0, agent: 0 },
  { name: 'Sex', score: 0, agent: 0 },
  { name: 'Sáb', score: 0, agent: 0 },
  { name: 'Dom', score: 0, agent: 0 },
];

const fallbackSparklineData = [
  { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }
];

interface DashboardStats {
  geoScore: number;
  agenticScore: number;
  somScore: number;
  storePosition: number | null;
  lastScanDate: string | null;
}

const Dashboard: React.FC = () => {
  const { colors, theme } = useTheme();
  
  const [stats, setStats] = useState<DashboardStats>({
    geoScore: 0,
    agenticScore: 0,
    somScore: 0,
    storePosition: null,
    lastScanDate: null,
  });
  const [volatility, setVolatility] = useState('LOW');
  const [citations, setCitations] = useState(12);
  const [historyData, setHistoryData] = useState(fallbackHistoryData);
  const [sparklineData, setSparklineData] = useState(fallbackSparklineData);
  const [loading, setLoading] = useState(true);
  const [maiHistoryPlot, setMaiHistoryPlot] = useState<any[]>([]);
  const [latestBenchmark, setLatestBenchmark] = useState<BenchmarkSnapshot | null>(null);
  const [platformScores, setPlatformScores] = useState([
    { name: 'ChatGPT', score: 0, fill: '#10b981' },
    { name: 'Gemini', score: 0, fill: '#8b5cf6' },
    { name: 'Perplexity', score: 0, fill: '#06b6d4' },
  ]);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const localHistory = getMaiHistory();
        if (localHistory.length > 0) {
          setMaiHistoryPlot(localHistory.map(h => ({
            ...h,
            formattedDate: new Date(h.calculatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          })));
        }

        const benchmarks = getBenchmarks();
        if (benchmarks.length > 0) {
          setLatestBenchmark(benchmarks[benchmarks.length - 1]);
        }

        const dashStats = await getDashboardStats();
        setStats(dashStats);

        if (dashStats.somScore > 50) {
          setVolatility('STABLE');
          setCitations(Math.floor(dashStats.somScore / 2));
        } else {
          setVolatility('HIGH');
          setCitations(Math.max(2, Math.floor(dashStats.somScore / 5)));
        }

        const recentScans = await getRecentGeoScans(7);
        if (recentScans.length > 0) {
          const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          const chartData = recentScans.reverse().map((scan: { created_at: string; score: number }) => {
            const date = new Date(scan.created_at);
            return {
              name: dayNames[date.getDay()],
              score: scan.score,
              agent: Math.floor(scan.score * 0.7),
            };
          });
          setHistoryData(chartData.length >= 7 ? chartData.slice(-7) : [...fallbackHistoryData.slice(0, 7 - chartData.length), ...chartData]);
        }

        const recentProbes = await getRecentAuthorityProbes(7);
        if (recentProbes.length > 0) {
          const sparkData = recentProbes.reverse().map((probe: { som_score: number }) => ({
            val: Math.floor(probe.som_score / 10),
          }));
          setSparklineData(sparkData.length >= 7 ? sparkData.slice(-7) : [...fallbackSparklineData.slice(0, 7 - sparkData.length), ...sparkData]);
        }

        const recentScansFull = await getRecentGeoScans(1);
        if (recentScansFull.length > 0 && recentScansFull[0].platformReadiness) {
          const pr = recentScansFull[0].platformReadiness;
          setPlatformScores([
            { name: 'ChatGPT', score: pr.chatgpt, fill: '#00F5FF' },
            { name: 'Gemini', score: pr.gemini, fill: '#8A2BE2' },
            { name: 'Perplexity', score: pr.perplexity, fill: '#06b6d4' },
          ]);
        } else {
          const baseScore = dashStats.geoScore || 0;
          setPlatformScores([
            { name: 'ChatGPT', score: Math.round(baseScore * 0.9), fill: '#00F5FF' },
            { name: 'Gemini', score: baseScore, fill: '#8A2BE2' },
            { name: 'Perplexity', score: Math.round(baseScore * 0.85), fill: '#06b6d4' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRecalibrate = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      window.location.reload();
    }, 3000);
  };

  const chartTooltipStyle = {
    background: theme === 'dark' ? '#0B0E14' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#232931' : '#e5e7eb'}`,
    borderRadius: '8px',
    color: theme === 'dark' ? '#fff' : '#111'
  };

  return (
    <div className="opacity-100 transition-opacity duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${colors.textPrimary} tracking-tight`}>
            PAINEL <span className="text-cyan-400 italic font-mono">NEURAL</span>
          </h1>
          <p className={`${colors.textMuted} text-xs uppercase tracking-widest mt-1`}>
            Cortex Crawler Active • Volatility Engine Online
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-[10px] ${colors.textMuted} uppercase`}>System_Mode</div>
            <div className={`text-xs font-mono ${colors.statusOnline} animate-pulse`}>
              {loading ? 'BOOTING...' : 'LIVE_MONITORING'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scores */}
        <div className="lg:col-span-4 space-y-6">
          {/* Score Cluster */}
          <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-8 rounded-3xl relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-4">
              <FaviconNode status={stats.geoScore > 70 ? "neutral" : "alert"} theme={theme} />
            </div>
            <div className="flex flex-col items-center justify-center gap-8 py-4">
              <ScoreCircle 
                score={stats.geoScore || 0} 
                label="MAI Score" 
                color="purple" 
              />
              <div className={`h-[1px] w-full bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-gray-700' : 'via-gray-300'} to-transparent`}></div>
              <ScoreCircle 
                score={stats.agenticScore || 0} 
                label="GEO Score" 
                color="cyan" 
              />
            </div>
            <div className="mt-4 text-center">
              <p className={`text-[10px] ${colors.textMuted} uppercase tracking-[0.2em]`}>
                Núcleo de Autoridade Vital
              </p>
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${colors.bgCard} border ${colors.border} p-4 rounded-2xl`}>
              <div className="flex justify-between items-start mb-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                {stats.somScore > 50 ? (
                  <span className={`text-[10px] ${colors.statusOnline} font-mono flex items-center gap-1`}>
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                ) : (
                  <span className={`text-[10px] ${colors.yellow} font-mono`}>--</span>
                )}
              </div>
              <p className={`text-xs ${colors.textMuted} font-medium`}>Agentic Score</p>
              <p className={`text-xl font-bold ${colors.textPrimary} tracking-tight`}>
                {(stats.agenticScore / 20).toFixed(1)}/5.0
              </p>
            </div>

            <div className={`${colors.bgCard} border ${colors.border} p-4 rounded-2xl`}>
              <div className="flex justify-between items-start mb-2">
                <Activity className="w-4 h-4 text-cyan-500" />
                <span className={`px-1.5 py-0.5 rounded-sm bg-${volatility === 'STABLE' ? 'green' : 'orange'}-500/10 text-[8px] ${volatility === 'STABLE' ? colors.statusOnline : colors.yellow} uppercase font-bold`}>
                  {volatility}
                </span>
              </div>
              <p className={`text-xs ${colors.textMuted} font-medium`}>Volatilidade</p>
              <p className={`text-xl font-bold ${colors.textPrimary} tracking-tight`}>
                {volatility === 'STABLE' ? 'BAIXA' : 'ALTA'}
              </p>
            </div>

            <div className={`${colors.bgCard} border ${colors.border} p-4 rounded-2xl`}>
              <div className="flex justify-between items-start mb-2">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <p className={`text-xs ${colors.textMuted} font-medium`}>SoM Share</p>
              <p className={`text-xl font-bold ${colors.textPrimary} tracking-tight`}>
                {stats.somScore || 0}%
              </p>
            </div>

            <div className={`${colors.bgCard} border ${colors.border} p-4 rounded-2xl`}>
              <div className="flex justify-between items-start mb-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <p className={`text-xs ${colors.textMuted} font-medium`}>Menções</p>
              <p className={`text-xl font-bold ${colors.textPrimary} tracking-tight`}>
                {citations}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis & Action */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Diagnosis Core */}
          <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 min-h-[400px]`}>
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <Layers className="w-4 h-4" /> Radar de Desequilíbrio
              </h3>
              <RadarChart theme={theme} />
              <div className={`mt-6 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs ${colors.textMuted} leading-relaxed italic max-w-xs text-center`}>
                "O GAP detectado entre o contexto fluido (MAI) e a estrutura técnica (GEO) indica necessidade de recalibragem."
              </div>
            </div>

            <div className="w-full md:w-1/2 h-full flex flex-col">
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <TerminalIcon className="w-4 h-4" /> Diagnóstico Estrutural
              </h3>
              <Terminal theme={theme} />
            </div>
          </div>

          {/* Platform Readiness */}
          <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest flex items-center gap-2`}>
                <Zap className="w-4 h-4 text-yellow-500" /> 
                Platform Readiness
                <span className={`ml-2 text-[9px] bg-cyan-500/10 ${colors.cyan} px-2 py-1 rounded border border-cyan-500/20 font-mono tracking-normal`}>v3.5</span>
              </h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
                  <XAxis dataKey="name" stroke={colors.chartAxis} fontSize={12} tick={{fill: theme === 'dark' ? '#999' : '#666'}} />
                  <YAxis stroke={colors.chartAxis} fontSize={10} domain={[0, 100]} tick={{fill: theme === 'dark' ? '#666' : '#999'}} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60} fill="#00F5FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div className={`p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-xl border ${colors.border}`}>
                <div className={`text-[10px] ${colors.cyan} uppercase mb-1`}>ChatGPT</div>
                <div className={`text-xs ${colors.textMuted}`}>Schemas & Plugins</div>
              </div>
              <div className={`p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-xl border ${colors.border}`}>
                <div className={`text-[10px] ${colors.purple} uppercase mb-1`}>Gemini</div>
                <div className={`text-xs ${colors.textMuted}`}>Google Index</div>
              </div>
              <div className={`p-3 ${theme === 'dark' ? 'bg-black/30' : 'bg-gray-100'} rounded-xl border ${colors.border}`}>
                <div className={`text-[10px] text-blue-400 uppercase mb-1`}>Perplexity</div>
                <div className={`text-xs ${colors.textMuted}`}>Citações</div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <ActionButton 
            onClick={handleRecalibrate}
            isLoading={isRecalibrating}
            label="Iniciar Recalibragem Neural"
            loadingLabel="Sincronizando Vetores..."
            hint={`Último scan: ${stats.lastScanDate ? new Date(stats.lastScanDate).toLocaleString('pt-BR') : 'Aguardando'} • ${historyData.length} pontos de dados`}
            theme={theme}
          />

          {/* MAI History Chart */}
          {maiHistoryPlot.length > 0 && (
            <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl`}>
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <Activity className="w-4 h-4" /> 
                Evolução MAI
                <span className={`ml-2 text-[9px] bg-purple-500/10 ${colors.purple} px-2 py-1 rounded border border-purple-500/20 font-mono`}>LOCAL_STORAGE</span>
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={maiHistoryPlot}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.chartGrid} vertical={false} />
                    <XAxis dataKey="formattedDate" stroke={colors.chartAxis} fontSize={10} tick={{fill: theme === 'dark' ? '#666' : '#999'}} />
                    <YAxis domain={['auto', 'auto']} stroke={colors.chartAxis} fontSize={10} tick={{fill: theme === 'dark' ? '#666' : '#999'}} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line 
                      type="stepAfter" 
                      dataKey="score" 
                      stroke="#8A2BE2" 
                      strokeWidth={3}
                      dot={{ fill: '#8A2BE2', r: 4 }}
                      activeDot={{ r: 6, fill: '#00F5FF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Benchmark Section */}
          {latestBenchmark && (
            <div className={`${colors.bgCard} backdrop-blur-md border ${colors.border} p-6 rounded-3xl`}>
              <h3 className={`text-xs font-bold ${colors.textMuted} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <Globe className="w-4 h-4 text-yellow-500" /> 
                State of the Industry
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`border-b ${colors.border} text-[10px] uppercase tracking-wider ${colors.textMuted}`}>
                      <th className="pb-3 pl-2">Rank</th>
                      <th className="pb-3">Brand</th>
                      <th className="pb-3">MAI</th>
                      <th className="pb-3">SoM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestBenchmark.entries.map((entry, idx) => (
                      <tr key={entry.brand} className={`border-b ${colors.border} hover:${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'} transition-colors`}>
                        <td className="py-3 pl-2">
                          {idx === 0 ? (
                            <span className="text-xl font-black text-yellow-400">#1</span>
                          ) : (
                            <span className={`text-sm font-bold ${colors.textMuted}`}>#{idx + 1}</span>
                          )}
                        </td>
                        <td className={`py-3 font-bold ${colors.textSecondary}`}>
                          {entry.brand}
                          {idx === 0 && (
                            <span className="ml-2 text-[8px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded uppercase font-bold">Leader</span>
                          )}
                        </td>
                        <td className={`py-3 font-mono ${colors.cyan} font-bold`}>{entry.mai}</td>
                        <td className={`py-3 font-mono ${colors.purple} font-bold`}>{entry.som}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
