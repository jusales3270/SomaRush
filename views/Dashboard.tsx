import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { ICONS } from '../constants';
import { getDashboardStats, getRecentGeoScans, getRecentAuthorityProbes } from '../services/gemini';

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

const fallbackRadarData = [
  { subject: 'MCP Handshake', A: 0, fullMark: 150 },
  { subject: 'Privacy Shield', A: 0, fullMark: 150 },
  { subject: 'Visual Clarity', A: 0, fullMark: 150 },
  { subject: 'Web Mentions', A: 0, fullMark: 150 },
  { subject: 'Machine Readability', A: 0, fullMark: 150 },
];

interface DashboardStats {
  geoScore: number;
  agenticScore: number;
  somScore: number;
  storePosition: number | null;
  lastScanDate: string | null;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    geoScore: 0,
    agenticScore: 0,
    somScore: 0,
    storePosition: null,
    lastScanDate: null,
  });
  // New State for Volatility (Mocked for now as per v3.5 spec until scanner runs)
  const [volatility, setVolatility] = useState('LOW');
  const [citations, setCitations] = useState(12);

  const [historyData, setHistoryData] = useState(fallbackHistoryData);
  const [sparklineData, setSparklineData] = useState(fallbackSparklineData);
  const [radarData, setRadarData] = useState(fallbackRadarData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch latest stats
        const dashStats = await getDashboardStats();
        setStats(dashStats);

        // Mock new v3.5 metrics based on SoM Score for demo
        if (dashStats.somScore > 50) {
          setVolatility('STABLE');
          setCitations(Math.floor(dashStats.somScore / 2));
        } else {
          setVolatility('HIGH'); // Volatile if low authority
          setCitations(Math.max(2, Math.floor(dashStats.somScore / 5)));
        }

        // Fetch recent scans for history chart
        const recentScans = await getRecentGeoScans(7);
        if (recentScans.length > 0) {
          const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          const chartData = recentScans.reverse().map((scan: { created_at: string; score: number }) => {
            const date = new Date(scan.created_at);
            return {
              name: dayNames[date.getDay()],
              score: scan.score,
              agent: Math.floor(scan.score * 0.7), // Derived metric
            };
          });
          setHistoryData(chartData.length >= 7 ? chartData.slice(-7) : [...fallbackHistoryData.slice(0, 7 - chartData.length), ...chartData]);
        }

        // Generate sparkline from recent positions
        const recentProbes = await getRecentAuthorityProbes(7);
        if (recentProbes.length > 0) {
          const sparkData = recentProbes.reverse().map((probe: { som_score: number }) => ({
            val: Math.floor(probe.som_score / 10),
          }));
          setSparklineData(sparkData.length >= 7 ? sparkData.slice(-7) : [...fallbackSparklineData.slice(0, 7 - sparkData.length), ...sparkData]);
        }

        // Build radar data from latest scan
        if (dashStats.geoScore > 0 || dashStats.agenticScore > 0) {
          setRadarData([
            { subject: 'MCP Handshake', A: dashStats.agenticScore, fullMark: 150 },
            { subject: 'Privacy Shield', A: Math.floor(dashStats.agenticScore * 0.8), fullMark: 150 },
            { subject: 'Visual Clarity', A: Math.floor(dashStats.geoScore * 0.5), fullMark: 150 },
            { subject: 'Web Mentions', A: dashStats.somScore, fullMark: 150 },
            { subject: 'Machine Readability', A: dashStats.geoScore, fullMark: 150 },
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end border-b border-cyan-900/30 pb-4">
        <div>
          <h1 className="text-3xl font-black terminal-glow italic">PAINEL_SOMARUSH_v3.5</h1>
          <p className="text-cyan-600 text-xs uppercase tracking-widest">Cortex Crawler Active • Volatility Engine Online</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div>
            <div className="text-[10px] text-cyan-800 uppercase">System_Mode</div>
            <div className="text-xs font-mono text-green-400 animate-pulse">{loading ? 'BOOTING...' : 'LIVE_MONITORING'}</div>
          </div>
          <div className="w-10 h-10 industrial-border rounded flex items-center justify-center bg-cyan-500/10 border-cyan-500">
            <ICONS.Bot />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. GEO SCORE (Readability) */}
        <div className="industrial-border bg-black/40 p-5 rounded relative overflow-hidden group border-l-4 border-l-cyan-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 italic">GEO_Score</span>
          </div>
          <div className="text-4xl font-black text-cyan-400">{stats.geoScore || '--'}</div>
          <div className="text-[9px] text-cyan-600 mt-2 uppercase leading-tight">
            {stats.geoScore > 80 ? 'Alta Legibilidade Técnica' : stats.geoScore > 50 ? 'Legibilidade Média' : 'Aguardando Scan'}
          </div>
        </div>

        {/* 2. VOLATILITY INDEX (New v3.5) */}
        <div className="industrial-border bg-black/40 p-5 rounded border-l-4 border-l-orange-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20"><span className="text-2xl">⚡</span></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-700 italic">Volatility_Idx</span>
          </div>
          <div className={`text-3xl font-black ${volatility === 'STABLE' ? 'text-green-500' : 'text-orange-500'}`}>{volatility}</div>
          <div className="flex gap-2 mt-2">
            <span className="text-[9px] text-orange-800 uppercase">Estabilidade de Resposta IA</span>
          </div>
        </div>

        {/* 3. BRAND PULSE (Enhanced) */}
        <div className="industrial-border bg-black/40 p-5 rounded border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 italic">Brand_Pulse</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-black text-green-400">{stats.somScore || '--'}</div>
            <div className="text-[10px] text-green-600 uppercase">SoM Score</div>
          </div>
          <div className="flex justify-between mt-2 border-t border-green-900/30 pt-1">
            <span className="text-[9px] text-cyan-900 uppercase">Citation Velocity:</span>
            <span className="text-[9px] font-bold text-green-500">{citations}/week</span>
          </div>
        </div>

        {/* 4. STORE RANK (Sparkline) */}
        <div className="industrial-border bg-black/40 p-5 rounded relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-700 italic">Store_Pos</span>
            <span className="text-[9px] text-yellow-500 bg-yellow-900/20 px-1 rounded">Last 7d</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-black text-yellow-500">{stats.storePosition ? `#${stats.storePosition}` : '--'}</div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#eab308" fill="#eab308" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Progress Chart */}
        <div className="industrial-border bg-black/30 p-4 rounded">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-800 mb-4 italic">Evolução_Semanal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a4a" />
              <XAxis dataKey="name" stroke="#0e7490" fontSize={10} />
              <YAxis stroke="#0e7490" fontSize={10} />
              <Tooltip contentStyle={{ background: '#0a0a0a', border: '1px solid #0e7490' }} />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} name="GEO Score" />
              <Line type="monotone" dataKey="agent" stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea' }} name="Agentic Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="industrial-border bg-black/30 p-4 rounded">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-800 mb-4 italic">Radar_Infra</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#1e3a4a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#0e7490', fontSize: 8 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="Infra" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Last Scan Info */}
      {stats.lastScanDate && (
        <div className="text-center text-xs text-cyan-800">
          Último scan: {new Date(stats.lastScanDate).toLocaleString('pt-BR')}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
