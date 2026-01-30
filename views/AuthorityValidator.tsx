
import React, { useState } from 'react';
import { generateStrategicQuestions, probeModelResponse } from '../services/gemini';
import Terminal from '../components/Terminal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ICONS } from '../constants';
import { MonitoringLog, AlertSettings } from '../types';

interface ProbeResult {
  question: string;
  cited: boolean;
  snippet: string;
}

const mockHistoryData: MonitoringLog[] = [
  { timestamp: '01/01', score: 40, status: 'STABLE' },
  { timestamp: '08/01', score: 45, status: 'GAIN' },
  { timestamp: '15/01', score: 80, status: 'GAIN' },
  { timestamp: '22/01', score: 60, status: 'DROP', competitorSurged: 'Concorrente X' },
  { timestamp: '29/01', score: 75, status: 'GAIN' },
];

const AuthorityValidator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROBE' | 'SENTINEL'>('PROBE');
  const [brand, setBrand] = useState('');
  const [variations, setVariations] = useState('');
  const [topic, setTopic] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [results, setResults] = useState<ProbeResult[]>([]);
  const [somScore, setSomScore] = useState<number | null>(null);

  // Sentinel Settings
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    enabled: true,
    channel: 'WHATSAPP',
    contact: '',
    frequency: 'WEEKLY',
    trigger: 'DROP_ONLY'
  });

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !topic) return;

    setIsBusy(true);
    setResults([]);
    setSomScore(null);
    
    const brandsToSearch = [
      brand.toLowerCase(),
      ...variations.split(',').map(v => v.trim().toLowerCase()).filter(v => v !== '')
    ];

    setLogs([
      `📡 INICIANDO SONDAGEM DE AUTORIDADE v2.2`,
      `ALVO: ${brand.toUpperCase()}`,
      `STATUS: ATIVANDO PROTOCOLO SENTINELA...`,
      '🧠 GERANDO QUESTIONÁRIO ESTRATÉGICO...'
    ]);

    try {
      const questions = await generateStrategicQuestions(topic);
      setLogs(prev => [...prev, `✅ ${questions.length} PERGUNTAS GERADAS.`]);

      const probeResults: ProbeResult[] = [];
      let citations = 0;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        setLogs(prev => [...prev, `❓ SONDANDO: "${question}"`]);
        const response = await probeModelResponse(question);
        const cited = brandsToSearch.some(v => response.toLowerCase().includes(v));
        
        if (cited) {
          citations++;
          setLogs(prev => [...prev, '✅ MARCA DETECTADA NA RESPOSTA.']);
        } else {
          setLogs(prev => [...prev, '❌ MARCA INVISÍVEL.']);
        }

        probeResults.push({
          question,
          cited,
          snippet: response.substring(0, 180) + '...'
        });
        setResults([...probeResults]);
      }

      const score = (citations / questions.length) * 100;
      setSomScore(score);
      setLogs(prev => [
        ...prev, 
        '='.repeat(40),
        `📊 SHARE OF MODEL: ${score}%`,
        `STATUS: ${score > 50 ? 'DOMINÂNCIA' : 'RISCO DE INVISIBILIDADE'}`,
        '='.repeat(40)
      ]);

    } catch (err) {
      setLogs(prev => [...prev, '!ERRO NO CLUSTER DE SONDAGEM.']);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end border-b border-cyan-900/30 pb-4">
        <div>
          <h1 className="text-3xl font-black terminal-glow uppercase italic">Authority_Sentinela_v2.2</h1>
          <p className="text-cyan-600 text-sm">Vigilância Ativa de Share of Model & Inteligência Competitiva</p>
        </div>
        <div className="flex bg-black p-1 rounded border border-cyan-900/30">
          <button 
            onClick={() => setActiveTab('PROBE')}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${activeTab === 'PROBE' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-cyan-800 hover:text-cyan-500'}`}
          >
            Sondagem_Manual
          </button>
          <button 
            onClick={() => setActiveTab('SENTINEL')}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${activeTab === 'SENTINEL' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-purple-900 hover:text-purple-500'}`}
          >
            Modo_Sentinela
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel de Controle */}
        <div className="lg:col-span-4 space-y-4">
          {activeTab === 'PROBE' ? (
            <form onSubmit={handleRunSimulation} className="industrial-border bg-black/40 p-6 rounded space-y-4">
              <h3 className="text-xs font-bold text-cyan-800 uppercase mb-4">Parâmetros de Missão</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-cyan-700 uppercase font-bold tracking-widest">Marca / Target</label>
                <input 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-black industrial-border p-3 rounded text-sm text-cyan-400 focus:ring-1 focus:ring-cyan-500 outline-none"
                  placeholder="Ex: SomaVerso"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-cyan-700 uppercase font-bold tracking-widest">Nicho de Autoridade</label>
                <input 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-black industrial-border p-3 rounded text-sm text-cyan-400 focus:ring-1 focus:ring-cyan-500 outline-none"
                  placeholder="Ex: Software de Logística"
                  required
                />
              </div>

              <button 
                disabled={isBusy}
                className="w-full bg-cyan-500 text-black py-4 font-bold rounded hover:bg-cyan-400 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2 text-xs"
              >
                {isBusy ? 'Sondando...' : 'Iniciar_Ataque_Visibilidade'}
              </button>
            </form>
          ) : (
            <div className="industrial-border bg-purple-950/5 p-6 rounded space-y-4 border-purple-500/20">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-purple-400 uppercase">Configuração Sentinela</h3>
                <div className={`w-2 h-2 rounded-full ${alertSettings.enabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] text-purple-900 uppercase font-bold">Canal de Alerta</label>
                <select 
                  className="w-full bg-black industrial-border p-3 rounded text-xs text-purple-300 outline-none border-purple-900/40"
                  value={alertSettings.channel}
                  onChange={(e: any) => setAlertSettings({...alertSettings, channel: e.target.value})}
                >
                  <option value="WHATSAPP">WHATSAPP (Prioritário)</option>
                  <option value="EMAIL">E-MAIL (Relatório)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-purple-900 uppercase font-bold">Destino / Contato</label>
                <input 
                  className="w-full bg-black industrial-border p-3 rounded text-xs text-purple-300 outline-none border-purple-900/40"
                  placeholder="+55 (11) 99999-9999"
                  value={alertSettings.contact}
                  onChange={(e) => setAlertSettings({...alertSettings, contact: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase font-bold">Frequência</label>
                  <select 
                    className="w-full bg-black industrial-border p-2 rounded text-[10px] text-purple-300 outline-none border-purple-900/40"
                    value={alertSettings.frequency}
                    onChange={(e: any) => setAlertSettings({...alertSettings, frequency: e.target.value})}
                  >
                    <option value="DAILY">DIÁRIO</option>
                    <option value="WEEKLY">SEMANAL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase font-bold">Gatilho</label>
                  <select 
                    className="w-full bg-black industrial-border p-2 rounded text-[10px] text-purple-300 outline-none border-purple-900/40"
                    value={alertSettings.trigger}
                    onChange={(e: any) => setAlertSettings({...alertSettings, trigger: e.target.value})}
                  >
                    <option value="ALWAYS">SEMPRE</option>
                    <option value="DROP_ONLY">SÓ SE CAIR</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setAlertSettings({...alertSettings, enabled: !alertSettings.enabled})}
                className={`w-full py-3 font-bold rounded transition-all uppercase text-[10px] border ${alertSettings.enabled ? 'bg-purple-600 text-white border-purple-400' : 'bg-black text-purple-900 border-purple-900'}`}
              >
                {alertSettings.enabled ? 'SENTINELA_ATIVO' : 'ATIVAR_SENTINELA'}
              </button>
            </div>
          )}

          <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-widest">Logs de Sonda</h3>
          <Terminal logs={logs} />
        </div>

        {/* Resultados */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'SENTINEL' ? (
            <div className="space-y-6">
              {/* Gráfico Histórico */}
              <div className="industrial-border bg-black/60 p-6 rounded min-h-[350px]">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xs font-bold text-cyan-200 uppercase italic">Histórico de Visibilidade (SoM)</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-[9px] text-cyan-800 uppercase">Share_of_Model</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#164e63" opacity={0.1} />
                    <XAxis dataKey="timestamp" stroke="#0891b2" fontSize={10} />
                    <YAxis stroke="#0891b2" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #7c3aed', color: '#a855f7', fontSize: '10px' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Tabela de Eventos Críticos */}
              <div className="industrial-border bg-black/40 p-5 rounded">
                <h4 className="text-[10px] font-bold text-cyan-800 uppercase mb-4 tracking-widest">Diário do Sentinela</h4>
                <div className="space-y-2">
                  {mockHistoryData.slice().reverse().map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/60 rounded border-l-2 border-cyan-900/30 group hover:border-purple-500 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-cyan-900 font-mono">{log.timestamp}</span>
                        <div className={`text-xs font-bold ${log.status === 'DROP' ? 'text-red-500' : log.status === 'GAIN' ? 'text-green-500' : 'text-cyan-600'}`}>
                          {log.status === 'DROP' ? '▼ QUEDA' : log.status === 'GAIN' ? '▲ VITÓRIA' : '■ ESTÁVEL'}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-black text-cyan-200">{log.score}%</span>
                        {log.competitorSurged && (
                          <span className="text-[9px] bg-red-900/20 text-red-400 px-2 py-1 rounded uppercase italic">Risco: {log.competitorSurged}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {!results.length && !isBusy && (
                <div className="industrial-border bg-black/40 rounded h-[600px] flex flex-col items-center justify-center p-12 text-center border-dashed">
                  <div className="w-16 h-16 border-2 border-cyan-900 rounded-full flex items-center justify-center mb-4">
                    <span className="text-cyan-900 text-2xl font-black italic">!</span>
                  </div>
                  <p className="text-cyan-900 text-sm max-w-md uppercase tracking-widest leading-relaxed">
                    Sua marca aparece quando alguém pergunta para a IA? <br/>
                    <span className="text-[10px] block mt-2 opacity-50 italic">Execute a sondagem para mapear sua autoridade orgânica em modelos de linguagem.</span>
                  </p>
                </div>
              )}

              {isBusy && !results.length && (
                <div className="industrial-border bg-black/40 rounded h-[600px] flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-cyan-400 animate-pulse uppercase text-[10px] tracking-[0.5em] font-bold">Mapeando Frequência no Modelo...</p>
                </div>
              )}

              {(results.length > 0 || somScore !== null) && (
                <div className="space-y-6 animate-in zoom-in-95 duration-300">
                  {/* Score Header */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="industrial-border bg-cyan-950/20 p-6 rounded flex flex-col items-center justify-center border-b-4 border-cyan-500">
                      <div className="text-[10px] text-cyan-700 uppercase font-bold mb-2 tracking-tighter">Share of Model (SoM)</div>
                      <div className={`text-6xl font-black ${somScore && somScore > 40 ? 'text-green-400' : 'text-yellow-500'} terminal-glow italic`}>
                        {somScore !== null ? `${somScore.toFixed(0)}%` : '--'}
                      </div>
                      <div className="text-[10px] text-cyan-900 mt-2 uppercase">Frequência de Recomendação</div>
                    </div>

                    <div className="industrial-border bg-black/60 p-6 rounded flex flex-col items-center justify-center border-b-4 border-purple-500">
                      <div className="text-[10px] text-cyan-700 uppercase font-bold mb-2 tracking-tighter">Dominação de Nicho</div>
                      <div className="text-5xl font-black text-purple-400 italic">
                        {results.filter(r => r.cited).length} <span className="text-xl text-purple-900">/ {results.length || 5}</span>
                      </div>
                      <div className="text-[10px] text-cyan-900 mt-2 uppercase">Perguntas Conquistadas</div>
                    </div>
                  </div>

                  {/* Lista de Provas */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-cyan-800 uppercase italic">Detalhamento Técnico</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {results.map((item, idx) => (
                        <div key={idx} className="industrial-border bg-black/80 p-5 rounded border-l-4 transition-all hover:translate-x-1" style={{ borderLeftColor: item.cited ? '#10b981' : '#ef4444' }}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-cyan-300 pr-4 italic">"{item.question}"</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-widest ${item.cited ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {item.cited ? '✓ CITADO' : '✗ INVISÍVEL'}
                            </span>
                          </div>
                          <p className="text-[10px] text-cyan-700 italic font-mono leading-relaxed opacity-70">
                            RAW_IA: "{item.snippet}"
                          </p>
                        </div>
                      ))}
                      {isBusy && results.length < 5 && (
                        <div className="industrial-border bg-black/20 p-8 rounded flex items-center justify-center border-dashed border-cyan-900/50">
                           <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {somScore !== null && somScore < 100 && (
                    <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-lg shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="p-1 bg-yellow-500 text-black rounded text-[8px] font-bold">SENTINELA_ALERTA</div>
                         <p className="text-[10px] text-yellow-500 uppercase font-black italic">Vulnerabilidade Detectada</p>
                      </div>
                      <p className="text-xs text-yellow-600/70 font-sans leading-relaxed">
                        {somScore === 0 
                          ? "FALHA TOTAL DE AUTORIDADE. Sua marca não existe para este cluster. Implemente o SomaOS imediatamente para forçar a indexação agêntica."
                          : "VISIBILIDADE EM RISCO. Concorrentes estão 'roubando' suas perguntas. Recomendamos ativar o MODO SENTINELA para vigiar variações de rank semanal."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorityValidator;
