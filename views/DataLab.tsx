
import React, { useState } from 'react';
import { optimizeContent, generateSmartFAQ } from '../services/gemini';

type Mode = 'OPTIMIZER' | 'FAQ_GEN';

const DataLab: React.FC = () => {
  const [mode, setMode] = useState<Mode>('OPTIMIZER');
  const [input, setInput] = useState('');

  // Optimizer State
  const [optOutput, setOptOutput] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // FAQ State
  const [faqTopic, setFaqTopic] = useState('');
  const [faqOutput, setFaqOutput] = useState<any>(null);
  const [isGeneratingFaq, setIsGeneratingFaq] = useState(false);

  // Handlers
  const handleOptimize = async () => {
    if (!input) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeContent(input);
      setOptOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateFaq = async () => {
    if (!faqTopic) return;
    setIsGeneratingFaq(true);
    try {
      const result = await generateSmartFAQ(faqTopic);
      setFaqOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingFaq(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end border-b border-cyan-900/30 pb-4">
        <div>
          <h1 className="text-3xl font-bold terminal-glow uppercase">Soma_Lab v3.5</h1>
          <p className="text-cyan-600 text-sm">Fábrica de Estruturas Semânticas & Engenharia de Prompt</p>
        </div>
        <div className="flex bg-black p-1 rounded border border-cyan-900/30">
          <button
            onClick={() => setMode('OPTIMIZER')}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ${mode === 'OPTIMIZER' ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'text-cyan-800 hover:text-cyan-500'}`}
          >
            Otimizador_GEO
          </button>
          <button
            onClick={() => setMode('FAQ_GEN')}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all rounded ml-2 ${mode === 'FAQ_GEN' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'text-indigo-900 hover:text-indigo-500'}`}
          >
            FAQ_Engine (AI)
          </button>
        </div>
      </div>

      {mode === 'OPTIMIZER' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[600px]">
          {/* Lado Esquerdo: Input */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-cyan-800 uppercase">Input de Texto Bruto</h3>
              <button
                onClick={() => { setInput(''); setOptOutput(null); }}
                className="text-[10px] text-cyan-800 hover:text-cyan-400"
              >
                LIMPAR_BUFFER
              </button>
            </div>
            <textarea
              className="flex-1 bg-black industrial-border p-4 rounded text-sm text-cyan-400 placeholder-cyan-900 focus:outline-none resize-none font-mono min-h-[400px]"
              placeholder="Cole o rascunho do seu artigo, descrição de produto ou comparativo aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !input}
              className="bg-cyan-500 text-black py-4 font-bold rounded hover:bg-cyan-400 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2"
            >
              {isOptimizing ? 'POPULANDO_TEMPLATE...' : 'Gerar_Cápsula_GEO'}
            </button>
          </div>

          {/* Lado Direito: Outputs Segmentados */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-cyan-800 uppercase">Output: SomaEmbed Structure</h3>

            {!optOutput && !isOptimizing && (
              <div className="flex-1 industrial-border bg-black/40 rounded flex items-center justify-center text-cyan-800 text-sm p-12 text-center border-dashed">
                Cole o texto e aguarde a injeção no Template Visual...
              </div>
            )}

            {isOptimizing && (
              <div className="flex-1 industrial-border bg-black/40 rounded flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-cyan-600 animate-pulse uppercase tracking-[0.2em]">Extraindo Dados & Injetando HTML...</div>
              </div>
            )}

            {optOutput && (
              <div className="space-y-6">
                {/* 1. CÁPSULA GEO (Priority) */}
                <div className="industrial-border bg-cyan-950/20 p-5 rounded border-cyan-500/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-center border-b border-cyan-900/50 pb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <h4 className="text-xs font-bold text-cyan-300 uppercase">Cápsula GEO (Embed Final)</h4>
                    </div>
                    <button onClick={() => copyToClipboard(optOutput.geoCapsule)} className="px-4 py-1.5 text-[10px] font-bold bg-cyan-500 text-black rounded hover:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] uppercase">
                      Copiar Código HTML
                    </button>
                  </div>
                  <div className="bg-black/90 p-4 rounded border border-cyan-900 shadow-inner max-h-48 overflow-y-auto">
                    <pre className="text-[10px] text-gray-500 whitespace-pre-wrap font-mono">
                      {optOutput.geoCapsule}
                    </pre>
                  </div>
                  <p className="text-[9px] text-cyan-600 italic mt-2">
                    *Este bloco contém a Tabela Visual (CSS embutido) + Metadados JSON-LD invisíveis. Cole em um bloco "HTML Personalizado".
                  </p>
                </div>

                {/* 2. TEXTO DO BLOG */}
                <div className="industrial-border bg-black/60 p-5 rounded space-y-3">
                  <div className="flex justify-between items-center border-b border-cyan-900/50 pb-2">
                    <h4 className="text-xs font-bold text-cyan-800 uppercase">Conteúdo Textual (Clean)</h4>
                    <button onClick={() => copyToClipboard(optOutput.blogText)} className="px-3 py-1 text-[10px] bg-black text-cyan-700 rounded hover:text-cyan-400 border border-cyan-900 uppercase">Copiar Texto</button>
                  </div>
                  <div className="text-sm text-cyan-400/80 font-sans leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto pr-2">
                    {optOutput.blogText}
                  </div>
                </div>

                {/* 3. MANUAL */}
                <div className="industrial-border bg-black/40 p-5 rounded border-cyan-900/40 space-y-3">
                  <h4 className="text-xs font-bold text-cyan-800 uppercase border-b border-cyan-900/50 pb-2">Instruções de Deploy</h4>
                  <div className="text-[10px] text-cyan-600 font-mono leading-relaxed whitespace-pre-wrap">
                    {optOutput.manual}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* FAQ GENERATOR UI */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[600px]">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase">Parâmetros de Geração (People Also Ask)</h3>
            <div className="space-y-2">
              <label className="text-[10px] text-indigo-900 uppercase font-bold">Tópico Central / Keyword</label>
              <input
                value={faqTopic}
                onChange={(e) => setFaqTopic(e.target.value)}
                className="w-full bg-black industrial-border p-4 rounded text-indigo-300 placeholder-indigo-900/50 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Como funciona seguro de vida"
              />
            </div>
            <button
              onClick={handleGenerateFaq}
              disabled={isGeneratingFaq || !faqTopic}
              className="bg-indigo-600 text-white py-4 font-bold rounded hover:bg-indigo-500 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
            >
              {isGeneratingFaq ? 'MINERANDO PERGUNTAS...' : 'Gerar_FAQ_Estruturado'}
            </button>

            <div className="bg-indigo-950/20 p-4 rounded border border-indigo-900/30 text-[10px] text-indigo-400 leading-relaxed">
              Este módulo utiliza IA para prever perguntas frequentes (PAA) e gera automaticamente o código JSON-LD para conquistar Rich Snippets nos buscadores.
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-indigo-400 uppercase">Output: FAQ Schema (JSON-LD)</h3>

            {!faqOutput && !isGeneratingFaq && (
              <div className="flex-1 industrial-border bg-black/40 rounded flex items-center justify-center text-indigo-900/50 text-sm p-12 text-center border-dashed border-indigo-900/30">
                Defina um tópico para gerar as perguntas.
              </div>
            )}

            {isGeneratingFaq && (
              <div className="flex-1 industrial-border bg-black/40 rounded flex flex-col items-center justify-center gap-4 border-indigo-900/30">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-indigo-400 animate-pulse uppercase tracking-[0.2em]">Construindo Knowledge Graph...</div>
              </div>
            )}

            {faqOutput && (
              <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="industrial-border bg-indigo-950/10 p-5 rounded border-indigo-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase">Perguntas Geradas ({faqOutput.faqs.length})</h4>
                    <button onClick={() => copyToClipboard(faqOutput.schema)} className="px-3 py-1 text-[10px] bg-indigo-600 text-white rounded hover:bg-indigo-500 uppercase font-bold">
                      Copiar JSON-LD
                    </button>
                  </div>
                  <div className="space-y-3">
                    {faqOutput.faqs.map((faq: any, i: number) => (
                      <div key={i} className="bg-black/50 p-3 rounded border border-indigo-900/20">
                        <div className="text-xs text-indigo-200 font-bold mb-1">P: {faq.question}</div>
                        <div className="text-[11px] text-indigo-400/70 italic">R: {faq.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="industrial-border bg-black/80 p-0 rounded border-indigo-900/50 overflow-hidden">
                  <div className="bg-indigo-950/30 p-2 border-b border-indigo-900/30 text-[9px] text-indigo-400 font-mono uppercase">
                    HEAD_INJECTION_PREVIEW.JSON
                  </div>
                  <pre className="p-4 text-[10px] text-gray-500 font-mono overflow-x-auto">
                    {faqOutput.schema}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLab;
