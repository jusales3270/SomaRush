import { MaiResult, MaiBreakdown } from '../../types';

const MAI_VERSION = "1.1.0";

export function calculateMAI(breakdown: MaiBreakdown & { som?: number }): MaiResult {
    const somWeight = breakdown.som !== undefined ? 0.15 : 0;
    const protocolWeight = somWeight > 0 ? 0.10 : 0.10; // Keep protocol weight constant or adjust other weights if needed. We'll follow user's formula.

    let score = 0;
    if (somWeight > 0) {
        // MAI v1.1.0 Formula
        score =
            breakdown.infrastructure * 0.25 +
            breakdown.visibility * 0.20 +
            breakdown.recommendation * 0.15 +
            breakdown.agentExecution * 0.15 +
            breakdown.protocolCompliance * 0.10 +
            breakdown.som! * 0.15;
    } else {
        // Fallback to MAI v1.0.0 Formula if SOM is not provided
        score =
            breakdown.infrastructure * 0.30 +
            breakdown.visibility * 0.25 +
            breakdown.recommendation * 0.20 +
            breakdown.agentExecution * 0.15 +
            breakdown.protocolCompliance * 0.10;
    }

    return {
        score: Math.round(score),
        version: MAI_VERSION,
        breakdown: breakdown as MaiBreakdown,
        calculatedAt: new Date().toISOString(),
    };
}
