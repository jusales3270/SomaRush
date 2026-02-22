import { GeoScanResult } from "../../types";

export function generateActionPlan(result: GeoScanResult) {
    const high: string[] = [];
    const medium: string[] = [];
    const low: string[] = [];

    // Protocol Compliance checks
    if (result.protocolAudit?.llmTxt === false) {
        high.push("Implement /llm.txt for AI crawlability");
    }

    if (result.protocolAudit?.aiPlugin === false) {
        high.push("Deploy ai-plugin.json manifest");
    }

    if (result.protocolAudit?.mcpJson === false) {
        medium.push("Consider exposing an MCP (Model Context Protocol) connection endpoint");
    }

    // SOM checks
    if ((result.som?.share ?? 0) < 30) {
        high.push("Increase brand mention frequency in niche prompts to improve Domination %");
    } else if ((result.som?.share ?? 0) < 50) {
        medium.push("Expand entity co-occurrence strategies in broad semantic topics");
    } else {
        low.push("Excellent Share of Model (Market Dominance). Maintain contextual content pace.");
    }

    // MAI Breakdown checks
    if ((result.mai?.breakdown.infrastructure ?? 0) < 20) {
        high.push("Urgent: Optimize semantic HTML and structured data for better machine reading speed");
    }

    if ((result.mai?.breakdown.visibility ?? 0) < 15) {
        medium.push("Improve general web footprint and citation velocity across high-authority sources");
    }

    if ((result.mai?.score ?? 0) > 80) {
        low.push("Maintain authority positioning and monitor emerging competitors closely");
    } else if ((result.mai?.score ?? 0) < 50) {
        high.push("Complete overhaul of AI-readiness needed to climb out of 'Low Authority' tier");
    }

    return { high, medium, low };
}
