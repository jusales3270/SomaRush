
export enum View {
  DASHBOARD = 'DASHBOARD',
  GEO_SCANNER = 'GEO_SCANNER',
  AUTHORITY_VALIDATOR = 'AUTHORITY_VALIDATOR',
  DATA_LAB = 'DATA_LAB',
  AGENT_PROTOC = 'AGENT_PROTOC',
}

export interface MaiBreakdown {
  infrastructure: number;
  visibility: number;
  recommendation: number;
  agentExecution: number;
  protocolCompliance: number;
}

export interface MaiResult {
  score: number;
  version: string;
  breakdown: MaiBreakdown;
  calculatedAt: string;
}

export interface MaiHistoryEntry {
  score: number;
  version: string;
  calculatedAt: string;
}

export interface ProtocolAuditResult {
  llmTxt: boolean;
  aiPlugin: boolean;
  mcpJson: boolean;
  score: number;
}

export interface SomResult {
  brand: string;
  share: number;
  mentions: number;
  totalMentions: number;
}

export interface BenchmarkEntry {
  brand: string;
  mai: number;
  som: number;
  calculatedAt: string;
}

export interface BenchmarkSnapshot {
  industry: string;
  entries: BenchmarkEntry[];
  generatedAt: string;
}

export interface GeoScanResult {
  url: string;
  score: number;
  mai?: MaiResult;
  protocolAudit?: ProtocolAuditResult;
  som?: SomResult;

  semanticAnalysis: {
    headers: boolean;
    tables: boolean;
    lists: boolean;
    schemaValid: boolean;
  };
  criticalAlerts: string[];
  rawReading: string;
  timestamp: string;
}

export interface ActionPlan {
  high: string[];
  medium: string[];
  low: string[];
}

export interface ExecutiveReport {
  brand: string;
  mai: MaiResult;
  som: SomResult;
  history: MaiHistoryEntry[];
  benchmark?: BenchmarkSnapshot;
  actionPlan: ActionPlan;
  generatedAt: string;
}

export interface AgenticAuditResult {
  score: number;
  geoScore: number;
  statusLabel: 'READY_FOR_STORE' | 'PASSIVE_ONLY' | 'BLOCKED';
  mcpStatus: 'CONNECTED' | 'MALFORMED' | 'MISSING';
  privacyStatus: 'SAFE_HARBOR' | 'DATA_LEAK_RISK';
  manifests: {
    aiPluginJson: boolean;
    openApiYaml: boolean;
    mcpJson: boolean;
  };
  schemaChecks: {
    productType: boolean;
    priceFormat: 'VALID_NUMBER' | 'INVALID_STRING' | 'MISSING';
    merchantPolicy: boolean;
    actionType: 'READ_ONLY' | 'TRANSACTIONAL';
  };
  robotsAnalysis: {
    gptBotBlocked: boolean;
    ccBotBlocked: boolean;
    securityRisk: boolean;
  };
  storeRank?: {
    keyword: string;
    position: number;
    competitorsAbove: string[];
  };
  report: {
    summary: string;
    bulletPoints: string[];
    actionChecklist: string[];
    complianceNote: string;
  };
}

export interface AuthorityResult {
  brand: string;
  shareOfModel: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'HALLUCINATED';
  modelResponses: {
    model: string;
    snippet: string;
  }[];
}

export interface MonitoringLog {
  timestamp: string;
  score: number;
  status: 'DROP' | 'STABLE' | 'GAIN';
  competitorSurged?: string;
}

export interface AlertSettings {
  enabled: boolean;
  channel: 'WHATSAPP' | 'EMAIL';
  contact: string;
  frequency: 'DAILY' | 'WEEKLY';
  trigger: 'ALWAYS' | 'DROP_ONLY';
}

export interface OptimizedContent {
  original: string;
  optimized: string;
  format: 'HTML' | 'MARKDOWN' | 'JSON-LD';
}

// ==========================================
// INTELLIGENCE LAYER TYPES
// ==========================================

export interface ModelSamplingParams {
  prompts: string[];
  competitors: string[];
  models: string[];
  temperature: number;
  context: 'clean' | 'enriched';
  brand: string;
}

export interface ModelSamplingResult {
  mentionFrequency: number;
  recommendationRank: number;
  crossModelConsistency: number;
  shareOfModel: number;
  rawResponses: any[];
}

export interface SnapshotHistory {
  id?: string;
  created_at: string;
  model: string;
  prompt: string;
  fullResponse: string;
  computedScore: number;
  competitors: string[];
  brand: string;
}

export interface AggregatedScore {
  infrastructure: number;    // Weight: 0.25
  visibility: number;        // Weight: 0.35
  recommendation: number;    // Weight: 0.25
  agentExecution: number;    // Weight: 0.15
}

export interface MAIResult {
  brand: string;
  maiScore: number;
  subScores: AggregatedScore;
  timestamp: string;
}

export interface PromptTemplate {
  id: string;
  niche: string;
  subcategory: string;
  type: 'informational' | 'comparative' | 'decisional';
  strategicWeight: number;
  text: string;
}

export interface SimulationResult {
  endpoint: string;
  method: 'GET' | 'POST';
  latencyMs: number;
  success: boolean;
  actionOutput?: any;
}

export interface CertificationResult {
  brand: string;
  isEligible: boolean;
  certifiedDate?: string;
  badgeUrl?: string;
  publicJsonUrl?: string;
  rejectionReasons?: string[];
}

export interface BenchmarkReport {
  sector: string;
  ranking: { brand: string; maiScore: number }[];
  generatedAt: string;
  exportUrl?: string;
}
