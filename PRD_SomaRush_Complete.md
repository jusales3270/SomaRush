# PRD Estrutural Completo - SomaRush v3.5
## Product Requirements Document

---

## 1. VISÃO GERAL DO PRODUTO

### 1.1 Propósito
SomaRush é uma plataforma de **Engineering Intelligence** focada em **AI Readiness** e **Model Authority Optimization**. A ferramenta analisa a presença digital de marcas através da lente dos modelos de linguagem (LLMs), identificando oportunidades de otimização para serem recomendados por IAs como ChatGPT, Gemini e Perplexity.

### 1.2 Diferencial Competitivo
- **Abordagem Técnica**: Foco em infraestrutura semântica e protocolos emergentes (MCP, llm.txt, ai-plugin.json)
- **Métricas Proprietárias**: MAI (Model Authority Index) e SoM (Share of Model)
- **Execução Completa**: Do scan técnico à geração de relatórios executivos em PDF

### 1.3 Arquitetura Tecnológica
```
Frontend: React + TypeScript + TailwindCSS + Recharts
Backend: Supabase (Edge Functions + PostgreSQL)
Integrações: Google Gemini 2.0 API, Web Crawler Engine
Exportação: jsPDF + html2canvas
```

---

## 2. CORE ENGINES (MOTORES DE ANÁLISE)

### 2.1 MAI Engine (Model Authority Index) v1.1.0

**Localização**: `src/core/maiEngine.ts`

**Descrição**: Algoritmo proprietário que calcula a autoridade de uma marca no ecossistema de IAs através de 6 dimensões ponderadas.

**Fórmula MAI v1.1.0**:
```
MAI Score = 
  (Infraestrutura × 0.25) +
  (Visibilidade × 0.20) +
  (Recomendação × 0.15) +
  (Execução de Agente × 0.15) +
  (Compliance de Protocolo × 0.10) +
  (Share of Model × 0.15)
```

**Componentes**:
| Dimensão | Peso | Descrição |
|----------|------|-----------|
| Infrastructure | 25% | Qualidade técnica do HTML semântico, Schema.org, H1-H6 |
| Visibility | 20% | Presença em fontes citáveis, menções web |
| Recommendation | 15% | Frequência de recomendação em respostas de LLM |
| Agent Execution | 15% | Capacidade transacional (GET vs POST) |
| Protocol Compliance | 10% | Presença de llm.txt, ai-plugin.json, mcp.json |
| Share of Model | 15% | Dominância percentual em prompts do nicho |

**Possibilidades para o Usuário**:
- Identificar exatamente qual pilar técnico está enfraquecendo a autoridade da marca
- Comparar MAI Score com benchmarks industriais
- Acompanhar evolução temporal do MAI via histórico versionado

---

### 2.2 SOM Engine (Share of Model)

**Localização**: `src/core/somEngine.ts`

**Descrição**: Calcula o percentual de "dominação mental" da marca dentro de um nicho específico de prompts.

**Funcionamento**:
1. Gera prompts estratégicos baseados no tópico do usuário
2. Sonda modelos de linguagem (Gemini, simulações)
3. Conta menções diretas e variações da marca
4. Calcula: `(Menções da Marca / Total de Respostas) × 100`

**Interpretação do Score**:
| Range | Classificação | Significado |
|-------|---------------|-------------|
| 0-20% | Invisível | Marca praticamente inexistente para IAs |
| 21-40% | Emergente | Presença tímida, concorrentes dominam |
| 41-60% | Competitivo | Marca é citada, mas não dominante |
| 61-80% | Dominante | Referência principal no nicho |
| 81-100% | Authority Leader | Marca sinônima do tópico |

**Possibilidades para o Usuário**:
- Descobrir se a marca aparece quando clientes perguntam à IA sobre o nicho
- Identificar "roubo" de autoridade por concorrentes
- Mapear variações de nome que a IA reconhece (ou não)

---

### 2.3 Protocol Audit Engine

**Localização**: `src/core/protocolAudit.ts`

**Descrição**: Verifica a implementação dos novos padrões de comunicação entre sites e agentes de IA.

**Arquivos Verificados**:

| Arquivo | Endpoint | Propósito | Pontuação |
|---------|----------|-----------|-----------|
| llm.txt | `/llm.txt` | Guia markdown para crawlers de IA | 35 pts |
| AI Plugin | `/.well-known/ai-plugin.json` | Manifesto para ChatGPT Plugins | 35 pts |
| MCP | `/.well-known/mcp.json` | Model Context Protocol handshake | 30 pts |

**Penalidade por Ausência**:
- Cada arquivo ausente reduz 15% a "Machine Readability" no cálculo do Platform Readiness
- Score máximo de Protocol Compliance: 100 pontos

**Possibilidades para o Usuário**:
- Verificar compatibilidade com ChatGPT, Gemini e outros agentes
- Receber alertas específicos sobre qual arquivo implementar
- Priorizar investimentos técnicos baseados em gaps identificados

---

### 2.4 Platform Readiness Engine

**Localização**: Integrado em `services/gemini.ts`

**Descrição**: Segmenta o score de autoridade por plataforma de IA, reconhecendo que cada modelo valoriza diferentes sinais.

**Scores Segmentados**:

| Plataforma | Foco Técnico | Fórmula de Ajuste |
|------------|--------------|-------------------|
| **ChatGPT** | Schemas estruturados, Plugins | Base × 0.90 |
| **Gemini** | Indexação Google, Multimodalidade | Base × 1.00 |
| **Perplexity** | Citações, Fontes acadêmicas | Base × 0.85 |

**Aplicação da Penalidade**:
```typescript
const missingFilesCount = [llmTxt, aiPlugin, mcpJson].filter(v => !v).length;
const penalty = missingFilesCount > 0 ? 0.15 * missingFilesCount : 0;
const adjustedScore = baseScore * (1 - penalty);
```

**Possibilidades para o Usuário**:
- Entender em qual plataforma a marca é mais/menos visível
- Adaptar estratégia de conteúdo para cada modelo
- Visualizar disparidades via BarChart comparativo no Dashboard

---

### 2.5 Action Plan Generator

**Localização**: `src/core/actionEngine.ts`

**Descrição**: Gera plano de ação priorizado automaticamente baseado nos gaps identificados no scan.

**Lógica de Priorização**:

**HIGH PRIORITY** (Executar imediatamente):
- MAI Score < 50 (overhaul completo necessário)
- SoM < 30% (risco de invisibilidade)
- llm.txt ausente (bloqueia crawlers de IA)
- ai-plugin.json ausente (incompatível com ChatGPT)
- Infraestrutura < 20 pontos (HTML não semântico)

**MEDIUM PRIORITY** (Implementar em 30 dias):
- SoM entre 30-50% (expandir co-ocorrência)
- mcp.json ausente (perde handshake com agentes)
- Visibility < 15 pontos (poucas citações)

**LOW PRIORITY** (Manter/Monitorar):
- MAI > 80 (autoridade consolidada)
- SoM > 50% (dominância estabelecida)

**Possibilidades para o Usuário**:
- Receber roadmap técnico personalizado
- Priorizar investimentos por impacto
- Delegar tarefas para equipe com base na criticidade

---

### 2.6 Report Builder Engine

**Localização**: `src/core/reportBuilder.ts`

**Descrição**: Consolida todos os dados de análise em um relatório executivo estruturado.

**Estrutura do ExecutiveReport**:
```typescript
{
  brand: string,              // Nome extraído da URL
  mai: MaiResult,             // Score MAI completo com breakdown
  som: SomResult,             // Share of Model calculado
  history: MaiHistoryEntry[], // Série temporal de scores
  benchmark?: BenchmarkSnapshot, // Comparação com concorrentes
  actionPlan: ActionPlan,     // Plano de ação priorizado
  generatedAt: string         // Timestamp ISO
}
```

**Possibilidades para o Usuário**:
- Exportar PDF profissional para apresentações
- Acompanhar evolução histórica em gráficos
- Comparar performance contra benchmarks industriais

---

## 3. VIEWS E FUNCIONALIDADES

### 3.1 Painel_v3 (Dashboard)

**Localização**: `views/Dashboard.tsx`

**Propósito**: Central de comando visualizando métricas consolidadas e tendências.

**Componentes Visuais**:

#### A. MAI Motor v1.1 Card
- **MAI Score** principal (display grande)
- **Breakdown em 6 pilares** com porcentagens de peso
- **Badge "ATIVO + SOM"** indicando versão do motor

#### B. KPI Cards (Grid 4 colunas)
| Card | Métrica | Visual |
|------|---------|--------|
| GEO_Score | Legibilidade técnica | Grande número + status |
| Volatility_Idx | Estabilidade de resposta IA | STABLE / HIGH |
| SOM (Share of Model) | Dominância % | Barra de progresso |
| Store_Pos | Ranking GPT Store | Sparkline dos últimos 7 dias |

#### C. Platform Readiness BarChart
- Gráfico comparativo ChatGPT vs Gemini vs Perplexity
- Cores distintivas por plataforma
- Legendas explicativas do foco de cada IA

#### D. Evolução Semanal (LineChart)
- Linha do tempo de GEO Score
- Linha de Agentic Score
- Tooltip interativo

#### E. Radar_Infra (RadarChart)
- Dimensões: MCP Handshake, Privacy Shield, Visual Clarity, Web Mentions, Machine Readability
- Visualização de lacunas equilibradas

#### F. State of the Industry Ranking
- Tabela comparativa de concorrentes
- MAI Score e SOM Share lado a lado
- Badge "Industry Leader" para #1

#### G. Evolução MAI v1.0 (Série Temporal)
- Gráfico de linha step-after
- Dados persistidos em LocalStorage
- Indicador de histórico local

**Possibilidades para o Usuário**:
- Monitorar saúde geral da presença em IAs
- Identificar tendências de queda antes que se tornem críticas
- Visualizar rapidamente qual plataforma priorizar

---

### 3.2 Scanner_GEO.v2 (GeoScanner)

**Localização**: `views/GeoScanner.tsx`

**Propósito**: Ferramenta principal de auditoria técnica de infraestrutura web.

**Fluxo de Uso**:
1. Usuário insere URL
2. Sistema executa crawler headless (Chromium/Playwright)
3. Análise semântica do DOM renderizado
4. Verificação paralela de protocolos emergentes
5. Cálculo de MAI + SOM
6. Geração de relatório executivo
7. Persistência no Supabase

**Terminal de Logs (Engine v2.0)**:
- INICIALIZANDO SOMARUSH GEO ENGINE
- LANÇANDO NAVEGADOR HEADLESS
- CONFIGURANDO USER-AGENT: OAI-SearchBot
- AGUARDANDO networkidle
- RENDERIZANDO DOM COMPLETO
- CAPTURANDO HTML RENDERIZADO
- LIMPANDO ELEMENTOS NÃO-SEMÂNTICOS
- ENVIANDO BUFFER PARA GEMINI

**Métricas de Legibilidade**:
- **GEO SCORE FINAL**: Score agregado 0-100
- **H1-H6 Tags**: DETECTADO / AUSENTE
- **JSON-LD**: VÁLIDO / FALHA
- **Table Parse**: OK / ERRO
- **List Struct**: OK / POBRE

**Protocol Compliance Section**:
- /llm.txt: DETECTED / MISSING
- ai-plugin.json: VALID / MISSING
- mcp.json: VALID / MISSING
- Score consolidado: X/100

**Exportação de Relatório**:
- Botão: "Export Agency Report (PDF)"
- Geração via `useExecutiveExport` hook
- PDF com capa, gauges, action plan e histórico

**Possibilidades para o Usuário**:
- Realizar auditoria completa em <20 segundos
- Receber diagnóstico técnico detalhado
- Exportar relatório profissional para clientes
- Salvar histórico de evolução

---

### 3.3 Agente_Protocol v2.2 (AgenticReadiness)

**Localização**: `views/AgenticReadiness.tsx`

**Propósito**: Auditoria especializada em capacidade transacional e segurança para agentes autônomos.

**Fluxo de Auditoria**:
1. MCP Handshake (verificação de conexão)
2. Privacy Shield Audit (checagem de vazamento de dados)
3. Análise de permissões de agente (GET vs POST)
4. Verificação de GPT Store Positioning

**Dashboard Agêntico**:

#### Velocímetro Duplo
- **GEO Score**: Legibilidade de conteúdo (0-100)
- **Agentic Score**: Capacidade de ação (0-100)

#### Grid de Status v2.2
| Status | Valores Possíveis | Indicador |
|--------|-------------------|-----------|
| MCP Status | CONNECTED / MALFORMED / MISSING | Verde/Vermelho |
| Privacy Shield | SAFE_HARBOR / DATA_LEAK_RISK | Verde/Vermelho |
| Agent Type | READ_ONLY / TRANSACTIONAL | Amarelo/Roxo |

#### GPT Store Visibility Tracker
- Palavra-chave monitorada
- Posição no ranking
- Lista de concorrentes acima

#### Infra_Manifest_Check
- ai-plugin.json: ✅ FOUND / ❌ MISSING
- openapi.yaml: ✅ FOUND / ❌ MISSING
- mcp.json: ✅ FOUND / ❌ MISSING

**Relatório de Engenharia**:
- Sumário executivo com citação
- Pontos críticos de atenção (bullet points)
- Compliance & Privacy Shield (nota técnica)
- Plano de Correção Imediata (checkboxes)

**Possibilidades para o Usuário**:
- Validar se domínio está pronto para agentes transacionais
- Identificar riscos de vazamento de dados
- Monitorar posicionamento na GPT Store
- Receber checklist técnico de correções

---

### 3.4 Validador_Aut v2.2 (AuthorityValidator)

**Localização**: `views/AuthorityValidator.tsx`

**Propósito**: Sondagem ativa de Share of Model e monitoramento competitivo contínuo.

**Três Modos de Operação**:

#### A. Sondagem_Manual (PROBE)
**Inputs**:
- Marca / Target
- Variações de nome (separadas por vírgula)
- Nicho de Autoridade

**Processo**:
1. Gera questionário estratégico via Gemini
2. Sonda modelo com cada pergunta
3. Verifica menção da marca nas respostas
4. Calcula SoM: `(Citações / Total de Perguntas) × 100`

**Resultados**:
- **Share of Model %**: Score de frequência de recomendação
- **Dominação de Nicho**: X / Y perguntas conquistadas
- **Detalhamento Técnico**: Lista com snippet de cada resposta
- **Status**: ✓ CITADO / ✗ INVISÍVEL

#### B. Modo_Sentinela (SENTINEL)
**Configuração**:
- Canal de Alerta: WHATSAPP / EMAIL
- Destino/Contato
- Frequência: DIÁRIO / SEMANAL
- Gatilho: SEMPRE / SÓ SE CAIR

**Dashboard**:
- Histórico de Visibilidade (LineChart SoM)
- Diário do Sentinela: eventos críticos com timestamps
- Indicadores: ▲ VITÓRIA / ▼ QUEDA / ■ ESTÁVEL
- Alertas de risco com nome do concorrente

#### C. Social_Pulse v3.5
**Funcionalidade**:
- Social Listening em Reddit/Fóruns
- Análise de sentimento do Brand Pulse
- Tópicos em alta relacionados à marca
- Citation Velocity (frequência de discussão)

**Métricas**:
- Social Sentiment: Índice de positividade (+/-)
- Citation Velocity: Freq. de menções sociais
- Top Topics: Hashtags em alta
- Resumo da Análise: Parágrafo interpretativo

**Possibilidades para o Usuário**:
- Descobrir se marca é recomendada por IAs no nicho
- Configurar alertas automáticos de queda de autoridade
- Monitorar concorrentes que "roubam" posição
- Analisar sentimento social em tempo real

---

### 3.5 Lab_Conteúdo (DataLab)

**Localização**: `views/DataLab.tsx`

**Propósito**: Geração e otimização de conteúdo compatível com LLMs.

**Funcionalidades**:

#### Smart FAQ Generator
- Input: Tópico
- Output: Perguntas e respostas otimizadas
- JSON-LD Schema automático para SEO

#### Content Optimizer
- Input: Texto original
- Output: Versão otimizada para leitura por IA
- Formato: HTML / MARKDOWN / JSON-LD

#### GEO Capsule Builder
- Template visual comparativo (Modelo Antigo vs Otimizado)
- Tabela estilizada com badges "OTIMIZADO"
- Schema.org TechArticle embutido

**Possibilidades para o Usuário**:
- Criar conteúdo que IAs consigam parsear facilmente
- Otimizar páginas existentes para maior legibilidade
- Gerar FAQ Schema para rich snippets

---

## 4. SERVIÇOS E INTEGRAÇÕES

### 4.1 Gemini Proxy Service

**Localização**: `services/gemini.ts`

**Funções**:
- `analyzeGeoReadability(url)`: Scan completo com crawler
- `analyzeBrandSentiment(brand)`: Análise de sentimento
- `generateSmartFAQ(topic)`: Geração de FAQ com schema
- `optimizeContent(text)`: Otimização de texto
- `auditAgenticReadiness(url)`: Auditoria MCP/Privacy
- `runIndustryBenchmark(industry, competitors)`: Benchmark comparativo

**Fluxo de Dados**:
```
URL → Crawler → Gemini API → Protocol Audit → SOM Calc → MAI Calc → 
Action Plan → Supabase Persist → Report Build
```

### 4.2 Supabase Data Layer

**Tabelas**:
| Tabela | Dados | Propósito |
|--------|-------|-----------|
| geo_scans | Scores, análise semântica, alertas | Histórico de auditorias |
| geo_history | URL, geo_score | Timeline rápida |
| crawl_logs | URL, status, duration_ms | Monitoramento de crawler |
| agentic_audits | Score, MCP status, privacy | Auditorias agênticas |
| authority_probes | Brand, som_score, results | Sondagens SoM |

### 4.3 Executive Export Service

**Localização**: `src/hooks/useExecutiveExport.ts`

**Tecnologia**: jsPDF + html2canvas

**Processo**:
1. Captura elemento DOM via html2canvas (scale: 2, background: #050505)
2. Converte para imagem PNG
3. Injeta no PDF A4 multi-página
4. Download: `{brand}_LLM_Authority_Report_v1.0.pdf`

**Layout do PDF**:
- **Página 1**: Capa, MAI Score gauge, SOM %, Breakdown 5 pilares
- **Página 2**: Action Plan (High/Medium/Low), Gráfico histórico

---

## 5. POSSIBILIDADES DO USUÁRIO (USER CAPABILITIES)

### 5.1 Para Agências de Marketing
- **Geração de Leads**: Usar scanner para prospectar clientes com baixo MAI
- **Relatórios White-label**: Exportar PDFs com branding profissional
- **Proposta de Valor Quantificada**: "Sua marca tem 15% de visibilidade em IAs, vamos aumentar para 60%"

### 5.2 Para Empresas (Product Managers)
- **Due Diligence Competitiva**: Benchmark contra concorrentes diretos
- **Roadmap Técnico**: Action Plan priorizado para equipe de dev
- **Monitoramento Contínuo**: Modo Sentinela alertando quedas de autoridade

### 5.3 Para Consultores de SEO
- **Expansão de Serviço**: Oferecer "AI SEO" além de SEO tradicional
- **Auditoria Técnica**: Verificar Schema.org, H1-H6, JSON-LD
- **Conteúdo Otimizado**: Usar DataLab para criar textos LLM-friendly

### 5.4 Para Desenvolvedores
- **Verificação de Protocolos**: Implementar llm.txt, ai-plugin.json, mcp.json
- **Teste de Agentes**: Validar se APIs estão prontas para consumo por IAs
- **Privacidade**: Auditar exposição de dados sensíveis a crawlers

### 5.5 Para Executivos (C-Level)
- **Visão Consolidada**: Dashboard com KPIs estratégicos
- **Relatórios Executivos**: PDFs prontos para board meetings
- **Alertas Proativos**: Notificações quando concorrentes ultrapassarem

---

## 6. FLUXOS DE DADOS

### 6.1 Fluxo Principal: Scan Completo
```
[Usuário insere URL]
         ↓
[GeoScanner] → [Crawler Engine] → [HTML Raw Text]
         ↓
[Gemini API] → [Semantic Analysis + Protocol Audit]
         ↓
[MAI Engine] + [SOM Engine] → [Scores Calculados]
         ↓
[Action Engine] → [Plano Priorizado]
         ↓
[Report Builder] → [Executive Report]
         ↓
[Supabase] ← Persistência
         ↓
[PDF Export] ← Relatório Gerado
```

### 6.2 Fluxo de Monitoramento
```
[Modo Sentinela Ativado]
         ↓
[Agendamento Cron] → [Scan Periódico]
         ↓
[Comparação com Baseline]
         ↓
[Se Score < Threshold] → [Alerta WhatsApp/Email]
         ↓
[Dashboard Update] → [Gráfico de Tendência]
```

### 6.3 Fluxo de Benchmark
```
[Usuário seleciona indústria + concorrentes]
         ↓
[Loop async: analyzeGeoReadability para cada concorrente]
         ↓
[Benchmark Engine] → [Consolidação de Rankings]
         ↓
[BenchmarkSnapshot] → [Persistência LocalStorage]
         ↓
[Dashboard] → [Tabela Comparativa]
```

---

## 7. ROADMAP DE FUNCIONALIDADES

### Implementado (v3.5 Atual)
- ✅ Scanner GEO com Protocol Audit
- ✅ MAI Engine v1.1.0 com SOM
- ✅ Platform Readiness Score
- ✅ Action Plan Generator
- ✅ Executive PDF Export
- ✅ Modo Sentinela (UI mockada)
- ✅ Social Pulse básico

### Planejado (v4.0)
- 🔄 Integração real com WhatsApp API para alertas
- 🔄 Webhook para notificações em tempo real
- 🔄 Análise multi-idioma (ES, EN)
- 🔄 Exportação em Word e PowerPoint
- 🔄 API pública para integrações

---

## 8. GLOSSÁRIO

| Termo | Definição |
|-------|-----------|
| **MAI** | Model Authority Index - Score proprietário de autoridade em IAs |
| **SoM** | Share of Model - Percentual de recomendação em um nicho |
| **MCP** | Model Context Protocol - Protocolo de comunicação com agentes |
| **GEO** | Generative Engine Optimization - Otimização para motores generativos |
| **Agentic** | Capacidade de realizar ações transacionais via agentes de IA |
| **llm.txt** | Arquivo de guia para crawlers de IA (similar a robots.txt) |
| **Sentinela** | Modo de monitoramento contínuo com alertas automáticos |

---

**Documento Version**: v1.0  
**Last Updated**: 2026-02-24  
**Product**: SomaRush v3.5
