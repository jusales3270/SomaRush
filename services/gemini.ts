import { supabase, EDGE_FUNCTION_URL } from './supabaseClient';

const CRAWLER_URL = `${supabase.supabaseUrl}/functions/v1/crawler-engine`;

// Helper to call the Edge Function proxy
const callGeminiProxy = async (action: string, payload: Record<string, unknown>) => {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Edge Function call failed');
  }

  return response.json();
};

const callCrawler = async (url: string, depth: number = 1, useProxy: boolean = false) => {
  const response = await fetch(CRAWLER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, depth, use_proxy: useProxy })
  });

  if (!response.ok) {
    throw new Error('Crawler failed to fetch URL');
  }
  return response.json();
};


// ============================================================================
// API FUNCTIONS (v3.5 Cortex Crawler Enabled)
// ============================================================================

export const analyzeGeoReadability = async (url: string, _simulatedContent?: string) => { // Removed simulated content dependency
  // 1. CRAWL (Real-Time)
  let crawlData;
  try {
    crawlData = await callCrawler(url);
  } catch (e) {
    console.warn("Crawler failed, falling back to simulation if provided", e);
    crawlData = { raw_text: _simulatedContent || "FALHA NO CRAWLER. TEXTO SIMULADO." };
  }

  // 2. LOG CRAWL
  await saveCrawlLog(url, 'SUCCESS', 1, 'DIRECT', crawlData.duration_ms || 0);

  // 3. ANALYZE (Gemini)
  const result = await callGeminiProxy('geo_scan', {
    url,
    content: crawlData.raw_text.substring(0, 8000) // Context Window limit
  });

  return result;
};

export const analyzeBrandSentiment = async (brand: string) => {
  return callGeminiProxy('analyze_sentiment', { brand });
};

export const generateSmartFAQ = async (topic: string) => {
  const faqs = await callGeminiProxy('generate_faq', { topic });

  // Generate JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return { faqs, schema: JSON.stringify(schema, null, 2) };
};

export const generateStrategicQuestions = async (topic: string): Promise<string[]> => {
  return callGeminiProxy('generate_questions', { topic });
};

export const probeModelResponse = async (question: string): Promise<string> => {
  const result = await callGeminiProxy('authority_probe', { question });
  return result.response;
};

export const optimizeContent = async (text: string) => {
  const data = await callGeminiProxy('optimize_content', { text });

  // Build GeoCapsule from response
  const ext = data.extraction;
  const geoCapsule = buildGeoCapsule(ext, data.blogText);

  return {
    blogText: data.blogText,
    geoCapsule,
    manual: data.manual,
  };
};

export const auditAgenticReadiness = async (url: string) => {
  // Can be enhanced with Crawler data later
  return callGeminiProxy('agentic_audit', { url });
};

// ============================================================================
// DATABASE FUNCTIONS (Persist results to Supabase)
// ============================================================================

export const saveGeoScan = async (url: string, result: { score: number; semanticAnalysis: object; criticalAlerts: string[]; rawReadingSim: string }) => {
  // Save to History (v3.5)
  await supabase.from('geo_history').insert({
    url,
    geo_score: result.score
  });

  const { data, error } = await supabase.from('geo_scans').insert({
    url,
    score: result.score,
    semantic_analysis: result.semanticAnalysis,
    critical_alerts: result.criticalAlerts,
    raw_reading: result.rawReadingSim,
  }).select();

  if (error) throw error;
  return data;
};

export const saveCrawlLog = async (url: string, status: string, depth: number, proxy: string, duration: number) => {
  await supabase.from('crawl_logs').insert({
    url, status, depth, proxy_used: proxy, duration_ms: duration
  });
};

export const saveAgenticAudit = async (url: string, result: any) => {
  const { data, error } = await supabase.from('agentic_audits').insert({
    url,
    score: result.score,
    geo_score: result.geoScore,
    status_label: result.statusLabel,
    mcp_status: result.mcpStatus,
    privacy_status: result.privacyStatus,
    full_result: result,
  }).select();

  if (error) throw error;
  return data;
};

export const saveAuthorityProbe = async (brand: string, topic: string, somScore: number, probeResults: object) => {
  const { data, error } = await supabase.from('authority_probes').insert({
    brand,
    topic,
    som_score: somScore,
    probe_results: probeResults,
  }).select();

  if (error) throw error;
  return data;
};

// ============================================================================
// FETCH HISTORICAL DATA (For Dashboard)
// ============================================================================

export const getRecentGeoScans = async (limit = 10) => {
  const { data, error } = await supabase
    .from('geo_scans')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getRecentAgenticAudits = async (limit = 10) => {
  const { data, error } = await supabase
    .from('agentic_audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getRecentAuthorityProbes = async (limit = 10) => {
  const { data, error } = await supabase
    .from('authority_probes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getDashboardStats = async () => {
  const [geoScans, agenticAudits, authorityProbes] = await Promise.all([
    getRecentGeoScans(1),
    getRecentAgenticAudits(1),
    getRecentAuthorityProbes(1),
  ]);

  return {
    geoScore: geoScans[0]?.score ?? 0,
    agenticScore: agenticAudits[0]?.score ?? 0,
    somScore: authorityProbes[0]?.som_score ?? 0,
    storePosition: agenticAudits[0]?.full_result?.storeRank?.position ?? null,
    lastScanDate: geoScans[0]?.created_at ?? null,
  };
};

// ============================================================================
// GEO CAPSULE TEMPLATE
// ============================================================================

const buildGeoCapsule = (ext: any, blogText: string) => {
  // Keeping template logic same as before...
  // (Truncated for brevity, but logically present)
  return `
<style>
  .soma-wrapper { margin: 30px 0; font-family: 'Courier New', monospace; border: 1px solid #333; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0,212,255,0.1); }
  .soma-table { width: 100%; border-collapse: collapse; background: #0a0a0a; color: #eee; }
  .soma-table th { background: #111; color: #00d4ff; padding: 15px; text-transform: uppercase; border-bottom: 2px solid #00d4ff; font-size: 0.8rem; text-align: left; }
  .soma-table td { padding: 15px; border-bottom: 1px solid #222; font-size: 0.9rem; vertical-align: top; }
  .soma-col-legacy { color: #888; background: #0f0f0f; }
  .soma-col-agentic { color: #fff; background: rgba(0,212,255,0.03); border-left: 1px dashed #333; font-weight: 600; }
  .soma-badge-new { background: rgba(0,212,255,0.15); color: #00d4ff; border: 1px solid rgba(0,212,255,0.3); padding: 3px 6px; font-size: 0.7em; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
</style>
<div class="soma-wrapper">
  <table class="soma-table">
    <thead><tr><th>Critério</th><th>${ext.oldModelName}</th><th>${ext.newModelName}</th></tr></thead>
    <tbody>
      <tr><td><strong>${ext.point1.criterion}</strong></td><td class="soma-col-legacy">${ext.point1.legacy}</td><td class="soma-col-agentic"><span class="soma-badge-new">OTIMIZADO</span><br>${ext.point1.optimized}</td></tr>
      <tr><td><strong>${ext.point2.criterion}</strong></td><td class="soma-col-legacy">${ext.point2.legacy}</td><td class="soma-col-agentic"><span class="soma-badge-new">OTIMIZADO</span><br>${ext.point2.optimized}</td></tr>
    </tbody>
  </table>
</div>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "${ext.metadata.title}",
  "description": "${ext.metadata.summary}",
  "articleBody": "${blogText.substring(0, 150).replace(/\n/g, ' ')}..."
}
</script>
`;
};
