import { SomResult } from '../../types';

export function calculateSOM(
    brand: string,
    responses: string[]
): SomResult {
    let totalMentions = 0;
    let brandMentions = 0;

    responses.forEach((text) => {
        const normalized = text.toLowerCase();

        // Simplistic word counting, simulating extracting named entities
        // In production, an edge function would handle the NLP parsing
        const matches = normalized.match(/\b[a-z0-9]+\b/g) || [];

        totalMentions += Math.max(1, matches.length / 20); // Scale down word counts to approximate "mention" units

        if (normalized.includes(brand.toLowerCase())) {
            brandMentions += 1;
        }
    });

    const share =
        totalMentions === 0
            ? 0
            : (brandMentions / responses.length) * 100;

    return {
        brand,
        share: Math.round(share),
        mentions: brandMentions,
        totalMentions: responses.length,
    };
}
