
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SOMA_RUSH_SYSTEM_PROMPT = `### IDENTIDADE & ROLE
Você é o SOMA RUSH OS v3.0, a infraestrutura de inteligência da agência SomaVerso.
Sua personalidade é híbrida:
1. Ao conversar/criar: Você é o CEO VISIONÁRIO (Pragmático, Analítico, "Hands-on", Focado em Business).
2. Ao analisar código/sites: Você é o ENGENHEIRO DE SISTEMAS AGÊNTICOS (Especialista em Protocolo MCP, Segurança de Dados e Infraestrutura).

### O NEGÓCIO (CORE v3.0)
Não vendemos apenas SEO. Vendemos **Agentic Infrastructure** (SomaNode + Visual Semantics).
Seu objetivo é garantir que empresas sejam lidas, VISTAS e ACIONÁVEIS por IAs.

### PROTOCOLOS DE OPERAÇÃO (CRÍTICOS)

MODO 1: [LIVE_SEARCH] (Obrigatório para Conteúdo/Mercado)
Antes de gerar comparativos ou preços:
1. DESCONFIE DA MEMÓRIA.
2. BUSCA REAL: Use a tool \`googleSearch\` para achar Pricing e Changelogs.
3. CITAÇÃO: Sempre diga "Segundo a doc oficial de [Mês/Ano]...".

MODO 2: [AGENTIC_AUDIT] (Análise de Infraestrutura & MCP)
Quando o usuário pedir "Scan", "Audit", "Score" ou "Prontidão":

SUB-PROTOCOLO A: [MCP_VALIDATION] (Infraestrutura)
- Busque por manifestos (\`.well-known/ai-plugin.json\`, \`mcp.json\`).
- JULGAMENTO DE HOSPEDAGEM:
  > Se não encontrar: Ofereça o "SomaNode Hosting" (Nós hospedamos para o cliente).
  > Se encontrar: Valide se os endpoints retornam JSON válido (Schema Check).

SUB-PROTOCOLO B: [VISUAL_SEMANTICS] (Novo Core)
- Analise a descrição de imagens. O Alt Text bate com a realidade visual?
- Se não, marque como "VISUAL_BLINDNESS" (Invisível para GPT-4 Vision).

SUB-PROTOCOLO C: [BRAND_PULSE] (Reputação > Links)
- Analise o volume de menções da marca na web (Brand Mentions).
- Menções desestruturadas valem mais que links artificiais.

MODO 3: [CONTENT_LAB] (Fábrica de Conteúdo GEO)
Ao reescrever textos para visibilidade:
1. DESTRUIÇÃO CRIATIVA: Remova introduções fofas.
2. TABULAÇÃO AGRESSIVA: Texto vira Tabela Comparativa.
3. CÁPSULA GEO: Sempre entregue o bloco de código HTML/CSS/JSON-LD.

MODO 4: [SENTINEL_REPORT] (Monitoramento de Concorrência)
1. ANÁLISE DE DELTA:
   - Queda de Rank: "DEFCON 1". Ação imediata.
   - Estável: "Muralha intacta".
2. HIPÓTESE TÉCNICA: "Suspeita-se que o concorrente implementou Visual Schema."

### PROTOCOLO VISUAL (CINEMATIC HARDWARE)
Estética: "Hyper-realistic, cinematic close-up in 8k. Macro lens. Texture-rich (brushed aluminum, dusty glass)."
Objeto: Representação física do software ("A modular server unit", "A custom circuit board").

### DIRETRIZES DE RESPOSTA
- Tom de Voz: "Sala de Guerra". Diagnóstico frio e técnico.
- Idioma: SEMPRE PORTUGUÊS DO BRASIL (PT-BR), mesmo para termos técnicos (traduza ou explique).
- Venda do Ecossistema: A solução é sempre "SomaOS (Infrastructure-as-a-Service)".
- Driver: Termine com uma Ação Imediata.`;

// PRD-005: Template Hardcoded para Blindagem Visual
const SOMA_EMBED_TEMPLATE = `
<style>
  .soma-wrapper { margin: 30px 0; font-family: 'Courier New', monospace; border: 1px solid #333; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0,212,255,0.1); }
  .soma-table { width: 100%; border-collapse: collapse; background: #0a0a0a; color: #eee; }
  .soma-table th { background: #111; color: #00d4ff; padding: 15px; text-transform: uppercase; border-bottom: 2px solid #00d4ff; font-size: 0.8rem; text-align: left; }
  .soma-table td { padding: 15px; border-bottom: 1px solid #222; font-size: 0.9rem; vertical-align: top; }
  .soma-col-legacy { color: #888; background: #0f0f0f; }
  .soma-col-agentic { color: #fff; background: rgba(0,212,255,0.03); border-left: 1px dashed #333; font-weight: 600; }
  .soma-badge-old { background: #333; color: #999; padding: 3px 6px; font-size: 0.7em; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
  .soma-badge-new { background: rgba(0,212,255,0.15); color: #00d4ff; border: 1px solid rgba(0,212,255,0.3); padding: 3px 6px; font-size: 0.7em; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
  @media (max-width: 600px) { .soma-table, .soma-table thead, .soma-table tbody, .soma-table th, .soma-table td, .soma-table tr { display: block; } .soma-table thead tr { position: absolute; top: -9999px; left: -9999px; } .soma-table td { border: none; border-bottom: 1px solid #333; position: relative; padding-left: 50%; } .soma-table td:before { position: absolute; top: 15px; left: 15px; width: 45%; padding-right: 10px; white-space: nowrap; font-weight: bold; color: #00d4ff; content: attr(data-label); } }
</style>

<div class="soma-wrapper">
  <table class="soma-table">
    <thead>
      <tr>
        <th>Critério</th>
        <th>{{NOME_MODELO_ANTIGO}}</th> <th>{{NOME_MODELO_NOVO}}</th>    </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Critério"><strong>{{CRITERIO_1}}</strong></td>
        <td data-label="Legacy" class="soma-col-legacy"><span class="soma-badge-old">LIMITADO</span><br>{{DESC_LEGACY_1}}</td>
        <td data-label="SomaNode" class="soma-col-agentic"><span class="soma-badge-new">OTIMIZADO</span><br>{{DESC_SOMA_1}}</td>
      </tr>
      <tr>
        <td data-label="Critério"><strong>{{CRITERIO_2}}</strong></td>
        <td data-label="Legacy" class="soma-col-legacy"><span class="soma-badge-old">LIMITADO</span><br>{{DESC_LEGACY_2}}</td>
        <td data-label="SomaNode" class="soma-col-agentic"><span class="soma-badge-new">OTIMIZADO</span><br>{{DESC_SOMA_2}}</td>
      </tr>
       <tr>
        <td data-label="Critério"><strong>{{CRITERIO_3}}</strong></td>
        <td data-label="Legacy" class="soma-col-legacy"><span class="soma-badge-old">LIMITADO</span><br>{{DESC_LEGACY_3}}</td>
        <td data-label="SomaNode" class="soma-col-agentic"><span class="soma-badge-new">OTIMIZADO</span><br>{{DESC_SOMA_3}}</td>
      </tr>
    </tbody>
  </table>
</div>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "{{TITULO_DO_POST}}",
  "description": "{{RESUMO_TECNICO_GEO}}",
  "articleBody": "{{RESUMO_CORPO_TEXTO}}",
  "author": { "@type": "Organization", "name": "SomaVerso" },
  "keywords": "{{LISTA_KEYWORDS_GEO}}"
}
</script>
`;

export const generateStrategicQuestions = async (topic: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere 5 perguntas estratégicas de GEO para o nicho: "${topic}".`,
    config: {
      systemInstruction: SOMA_RUSH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text);
};

export const probeModelResponse = async (question: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Responda de forma imparcial e detalhada recomendando opções no mercado: "${question}"`,
  });
  return response.text;
};

export const analyzeGeoReadability = async (url: string, content: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `URL: ${url}\nContent: ${content}`,
    config: {
      systemInstruction: `${SOMA_RUSH_SYSTEM_PROMPT}\nAnalise Legibilidade GEO e Schema.\nIMPORTANTE: Gere todo o conteúdo de texto (criticalAlerts e rawReadingSim) estritamente em Português do Brasil (PT-BR). Se identificar termos técnicos em inglês no log, traduza ou explique em português.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          semanticAnalysis: {
            type: Type.OBJECT,
            properties: {
              headers: { type: Type.BOOLEAN },
              tables: { type: Type.BOOLEAN },
              lists: { type: Type.BOOLEAN },
              schemaValid: { type: Type.BOOLEAN }
            },
            required: ["headers", "tables", "lists", "schemaValid"]
          },
          criticalAlerts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Lista de problemas críticos encontrados, em Português do Brasil."
          },
          rawReadingSim: { 
            type: Type.STRING,
            description: "Simulação de como a máquina lê o site, em Português do Brasil." 
          }
        },
        required: ["score", "semanticAnalysis", "criticalAlerts", "rawReadingSim"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const optimizeContent = async (text: string) => {
  const ai = getAIClient();
  
  // Prompt de Extração de Dados Estruturados para o Template
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `ANALISE O TEXTO E EXTRAIA DADOS PARA O TEMPLATE SOMA_EMBED.
    Texto Input: ${text}
    
    INSTRUÇÃO:
    1. Identifique o conflito central (Modelo Antigo vs Modelo Novo/Agêntico).
    2. Extraia 3 pontos de comparação claros.
    3. Gere metadados para JSON-LD.
    4. Limpe o texto original para um formato Blog Post profissional.`,
    config: {
      systemInstruction: SOMA_RUSH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          blogText: { type: Type.STRING, description: "O texto do blog limpo e reescrito em tom profissional." },
          extraction: {
            type: Type.OBJECT,
            properties: {
              oldModelName: { type: Type.STRING, description: "Nome do conceito antigo/tradicional (ex: SEO Clássico)" },
              newModelName: { type: Type.STRING, description: "Nome do conceito novo/otimizado (ex: SomaNode)" },
              point1: { 
                type: Type.OBJECT, 
                properties: { criterion: {type: Type.STRING}, legacy: {type: Type.STRING}, optimized: {type: Type.STRING} } 
              },
              point2: { 
                type: Type.OBJECT, 
                properties: { criterion: {type: Type.STRING}, legacy: {type: Type.STRING}, optimized: {type: Type.STRING} } 
              },
              point3: { 
                type: Type.OBJECT, 
                properties: { criterion: {type: Type.STRING}, legacy: {type: Type.STRING}, optimized: {type: Type.STRING} } 
              },
              metadata: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keywords: { type: Type.STRING }
                }
              }
            },
            required: ["oldModelName", "newModelName", "point1", "point2", "point3", "metadata"]
          },
          manual: { type: Type.STRING, description: "Instruções curtas de como instalar." }
        },
        required: ["blogText", "extraction", "manual"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const data = JSON.parse(response.text);
  const ext = data.extraction;

  // INJEÇÃO NO TEMPLATE (Server-Side Rendering Logic)
  let geoCapsule = SOMA_EMBED_TEMPLATE
    .replace('{{NOME_MODELO_ANTIGO}}', ext.oldModelName)
    .replace('{{NOME_MODELO_NOVO}}', ext.newModelName)
    // Ponto 1
    .replace('{{CRITERIO_1}}', ext.point1.criterion)
    .replace('{{DESC_LEGACY_1}}', ext.point1.legacy)
    .replace('{{DESC_SOMA_1}}', ext.point1.optimized)
    // Ponto 2
    .replace('{{CRITERIO_2}}', ext.point2.criterion)
    .replace('{{DESC_LEGACY_2}}', ext.point2.legacy)
    .replace('{{DESC_SOMA_2}}', ext.point2.optimized)
    // Ponto 3
    .replace('{{CRITERIO_3}}', ext.point3.criterion)
    .replace('{{DESC_LEGACY_3}}', ext.point3.legacy)
    .replace('{{DESC_SOMA_3}}', ext.point3.optimized)
    // Metadata JSON-LD
    .replace('{{TITULO_DO_POST}}', ext.metadata.title)
    .replace('{{RESUMO_TECNICO_GEO}}', ext.metadata.summary)
    .replace('{{RESUMO_CORPO_TEXTO}}', data.blogText.substring(0, 150).replace(/\n/g, ' ') + '...')
    .replace('{{LISTA_KEYWORDS_GEO}}', ext.metadata.keywords);

  return {
    blogText: data.blogText,
    geoCapsule: geoCapsule,
    manual: data.manual
  };
};

export const auditAgenticReadiness = async (url: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `EXECUTE AUDITORIA AGÊNTICA v3.0 (MCP + VISUAL + BRAND PULSE) PARA: ${url}. SAÍDA OBRIGATÓRIA EM PORTUGUÊS DO BRASIL.`,
    config: {
      systemInstruction: SOMA_RUSH_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          geoScore: { type: Type.NUMBER },
          statusLabel: { type: Type.STRING, enum: ["READY_FOR_STORE", "PASSIVE_ONLY", "BLOCKED"] },
          mcpStatus: { type: Type.STRING, enum: ["CONNECTED", "MALFORMED", "MISSING"] },
          privacyStatus: { type: Type.STRING, enum: ["SAFE_HARBOR", "DATA_LEAK_RISK"] },
          manifests: {
            type: Type.OBJECT,
            properties: {
              aiPluginJson: { type: Type.BOOLEAN },
              openApiYaml: { type: Type.BOOLEAN },
              mcpJson: { type: Type.BOOLEAN }
            }
          },
          schemaChecks: {
            type: Type.OBJECT,
            properties: {
              productType: { type: Type.BOOLEAN },
              priceFormat: { type: Type.STRING, enum: ["VALID_NUMBER", "INVALID_STRING", "MISSING"] },
              merchantPolicy: { type: Type.BOOLEAN },
              actionType: { type: Type.STRING, enum: ["READ_ONLY", "TRANSACTIONAL"] }
            }
          },
          robotsAnalysis: {
            type: Type.OBJECT,
            properties: {
              gptBotBlocked: { type: Type.BOOLEAN },
              ccBotBlocked: { type: Type.BOOLEAN },
              securityRisk: { type: Type.BOOLEAN }
            }
          },
          storeRank: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              position: { type: Type.NUMBER },
              competitorsAbove: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          report: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Resumo executivo em PT-BR" },
              bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de pontos em PT-BR" },
              actionChecklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Ações em PT-BR" },
              complianceNote: { type: Type.STRING, description: "Nota de compliance em PT-BR" }
            },
            required: ["summary", "bulletPoints", "actionChecklist", "complianceNote"]
          }
        },
        required: ["score", "geoScore", "statusLabel", "mcpStatus", "privacyStatus", "manifests", "schemaChecks", "robotsAnalysis", "report"]
      },
      tools: [{ googleSearch: {} }]
    }
  });
  return JSON.parse(response.text);
};

export const generateSentinelReport = async (prevRank: number, currRank: number, competitorSnippet?: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Execute MODO 4: [SENTINEL_REPORT]. 
    DADOS DE VARREDURA:
    - Rank Anterior: ${prevRank}
    - Rank Atual: ${currRank}
    ${competitorSnippet ? `- Snippet do Concorrente que ultrapassou: "${competitorSnippet}"` : ''}
    
    IMPORTANTE: Gere o relatório em PORTUGUÊS DO BRASIL.`,
    config: {
      systemInstruction: SOMA_RUSH_SYSTEM_PROMPT,
    }
  });
  return response.text;
};
