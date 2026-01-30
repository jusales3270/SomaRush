
import React, { useState } from 'react';
import { optimizeContent } from '../services/gemini';

const DataLab: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!input) return;
    setIsOptimizing(true);
    try {
      const result = await optimizeContent(input);
      setOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simulating a more modern toast or simple feedback
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold terminal-glow uppercase">SomaEmbed_Engine</h1>
        <p className="text-cyan-600 text-sm">GeoCapsule Generator: Blinde seu conteúdo com HTML/CSS Agêntico + Schema JSON-LD</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto min-h-[600px]">
        {/* Lado Esquerdo: Input */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cyan-800 uppercase">Input de Texto Bruto</h3>
            <button 
              onClick={() => { setInput(''); setOutput(null); }}
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
          
          {!output && !isOptimizing && (
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

          {output && (
            <div className="space-y-6">
              {/* 1. CÁPSULA GEO (Priority) */}
              <div className="industrial-border bg-cyan-950/20 p-5 rounded border-cyan-500/40 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="flex justify-between items-center border-b border-cyan-900/50 pb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <h4 className="text-xs font-bold text-cyan-300 uppercase">Cápsula GEO (Embed Final)</h4>
                  </div>
                  <button onClick={() => copyToClipboard(output.geoCapsule)} className="px-4 py-1.5 text-[10px] font-bold bg-cyan-500 text-black rounded hover:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)] uppercase">
                    Copiar Código HTML
                  </button>
                </div>
                <div className="bg-black/90 p-4 rounded border border-cyan-900 shadow-inner max-h-48 overflow-y-auto">
                  <pre className="text-[10px] text-gray-500 whitespace-pre-wrap font-mono">
                    {output.geoCapsule}
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
                  <button onClick={() => copyToClipboard(output.blogText)} className="px-3 py-1 text-[10px] bg-black text-cyan-700 rounded hover:text-cyan-400 border border-cyan-900 uppercase">Copiar Texto</button>
                </div>
                <div className="text-sm text-cyan-400/80 font-sans leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto pr-2">
                  {output.blogText}
                </div>
              </div>

              {/* 3. MANUAL */}
              <div className="industrial-border bg-black/40 p-5 rounded border-cyan-900/40 space-y-3">
                <h4 className="text-xs font-bold text-cyan-800 uppercase border-b border-cyan-900/50 pb-2">Instruções de Deploy</h4>
                <div className="text-[10px] text-cyan-600 font-mono leading-relaxed whitespace-pre-wrap">
                  {output.manual}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataLab;
