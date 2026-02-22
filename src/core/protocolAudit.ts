import { ProtocolAuditResult } from "../../types";

// Helper to reliably check an endpoint using a CORS proxy/Edge Function approach
// For browser safety, we simulate the fetch if it fails due to CORS in development,
// but in production this should ideally run in an Edge Function like Crawler.
async function checkEndpoint(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: "GET" });
        return res.ok;
    } catch {
        return false;
    }
}

async function validateJson(url: string): Promise<boolean> {
    try {
        const res = await fetch(url);
        if (!res.ok) return false;

        const data = await res.json();
        return typeof data === "object";
    } catch {
        return false;
    }
}

export async function auditProtocols(baseUrl: string): Promise<ProtocolAuditResult> {
    // Extract base domain cleanly
    let normalized = baseUrl.replace(/\/$/, "");
    try {
        const urlObj = new URL(baseUrl);
        normalized = `${urlObj.protocol}//${urlObj.hostname}`;
    } catch (e) {
        // If invalid URL, use as is (might be just a domain)
        if (!normalized.startsWith('http')) {
            normalized = `https://${normalized}`;
        }
    }

    // Promise.all to fetch them all in parallel instead of sequentially
    const [llmTxt, aiPlugin, mcpJson] = await Promise.all([
        checkEndpoint(`${normalized}/llm.txt`),
        validateJson(`${normalized}/.well-known/ai-plugin.json`),
        validateJson(`${normalized}/.well-known/mcp.json`)
    ]);

    let score = 0;

    if (llmTxt) score += 35;
    if (aiPlugin) score += 35;
    if (mcpJson) score += 30;

    return {
        llmTxt,
        aiPlugin,
        mcpJson,
        score,
    };
}
