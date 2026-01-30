
export enum View {
  DASHBOARD = 'DASHBOARD',
  GEO_SCANNER = 'GEO_SCANNER',
  AUTHORITY_VALIDATOR = 'AUTHORITY_VALIDATOR',
  DATA_LAB = 'DATA_LAB',
  AGENT_PROTOC = 'AGENT_PROTOC',
}

export interface GeoScanResult {
  url: string;
  score: number;
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
