
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { ICONS } from '../constants';

const mockHistoryData = [
  { name: 'Seg', score: 65, agent: 40 },
  { name: 'Ter', score: 68, agent: 45 },
  { name: 'Qua', score: 72, agent: 42 },
  { name: 'Qui', score: 71, agent: 50 },
  { name: 'Sex', score: 85, agent: 62 },
  { name: 'Sáb', score: 88, agent: 75 },
  { name: 'Dom', score: 92, agent: 88 },
];

const mockSparklineData = [
  { val: 4 }, { val: 5 }, { val: 4 }, { val: 3 }, { val: 4 }, { val: 4 }, { val: 4 }
];

const mockRadarData = [
  { subject: 'MCP Handshake', A: 120, fullMark: 150 },
  { subject: 'Privacy Shield', A: 98, fullMark: 150 },
  { subject: 'Visual Clarity', A: 45, fullMark: 150 }, // Low Visual Score
  { subject: 'Web Mentions', A: 130, fullMark: 150 }, // High Mentions
  { subject: 'Machine Readability', A: 130, fullMark: 150 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end border-b border-cyan-900/30 pb-4">
        <div>
          <h1 className="text-3xl font-black terminal-glow italic">PAINEL_SOMARUSH_v3.0</h1>
          <p className="text-cyan-600 text-sm">Visual Semantics & Brand Pulse Infrastructure</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div>
            <div className="text-[10px] text-cyan-800 uppercase">System_Mode</div>
            <div className="text-xs font-mono text-purple-400">INFRA_HOST_ACTIVE</div>
          </div>
          <div className="w-10 h-10 industrial-border rounded flex items-center justify-center bg-purple-500/10">
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
          <div className="text-4xl font-black text-cyan-400">84.2</div>
          <div className="text-[9px] text-cyan-600 mt-2 uppercase leading-tight">Alta Legibilidade Técnica / <br/>Baixa Densidade de Menção</div>
        </div>

        {/* 2. INFRA STATUS (SomaNode) */}
        <div className="industrial-border bg-purple-900/10 p-5 rounded border-l-4 border-l-purple-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10"><ICONS.Code /></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 italic">Infra_Status</span>
          </div>
          <div className="text-3xl font-black text-white">HOSTED</div>
          <div className="flex gap-2 mt-2">
             <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 text-[8px] font-bold rounded uppercase border border-green-500/30">SomaNode Active</span>
          </div>
        </div>

        {/* 3. BRAND PULSE (New Reputation Metric) */}
        <div className="industrial-border bg-black/40 p-5 rounded border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 italic">Brand_Pulse</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-black text-green-400">124</div>
            <div className="text-[10px] text-green-600 uppercase">Mentions/mo</div>
          </div>
          <div className="text-[9px] text-cyan-900 mt-2 uppercase tracking-tighter">Reputation > Backlinks</div>
        </div>

        {/* 4. STORE RANK (Sparkline) */}
        <div className="industrial-border bg-black/40 p-5 rounded relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-700 italic">Store_Pos</span>
            <span className="text-[9px] text-yellow-500 bg-yellow-900/20 px-1 rounded">Last 7d</span>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-black text-yellow-500">#4</div>
            <div className="w-20 h-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#eab308" fill="#eab308" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="industrial-border bg-black/40 p-6 rounded min-h-[300px]">
          <h3 className="text-xs font-bold uppercase mb-6 text-cyan-800 flex justify-between">
            Progressão de Autoridade (GEO vs AGENT)
            <span className="text-[10px] font-normal italic opacity-40">Mês_Atual</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#164e63" opacity={0.2} />
              <XAxis dataKey="name" stroke="#0891b2" fontSize={10} />
              <YAxis stroke="#0891b2" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #164e63', color: '#22d3ee', fontSize: '10px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee' }} name="GEO" />
              <Line type="monotone" dataKey="agent" stroke="#a855f7" strokeWidth={3} dot={{ fill: '#a855f7' }} name="AGENT" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="industrial-border bg-black/40 p-6 rounded min-h-[300px] flex flex-col items-center">
          <h3 className="text-xs font-bold uppercase mb-6 text-cyan-800 self-start italic">Vetores Agênticos v3.0 (Visual + Reputation)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockRadarData}>
              <PolarGrid stroke="#164e63" strokeOpacity={0.3} />
              <PolarAngleAxis dataKey="subject" stroke="#0891b2" fontSize={10} tick={{ fill: '#0891b2', fontSize: 9 }} />
              <PolarRadiusAxis stroke="#0891b2" fontSize={8} opacity={0.2} />
              <Radar name="Status" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Widget de Ação Rápida v3.0 */}
      <div className="industrial-border bg-cyan-950/10 p-6 rounded border-dashed border-cyan-500/20">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-cyan-500 text-black rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]">
             <ICONS.Search />
           </div>
           <div className="flex-1">
             <h4 className="text-sm font-bold text-cyan-400 uppercase italic">Recomendação Visual Semantics</h4>
             <p className="text-xs text-cyan-700 mt-1">"Seu Brand Pulse está alto, mas o **Visual Clarity** está crítico (45/150). Agentes de visão (GPT-4V) não conseguem ler seus produtos."</p>
           </div>
           <button className="px-6 py-2 bg-cyan-600 text-white text-[10px] font-bold rounded hover:bg-cyan-500 transition-all uppercase border border-cyan-400">Corrigir_Alt_Tags</button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
