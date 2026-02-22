import { generateMAI } from './score_aggregator';
import { runModelSamplingBatch } from './model_sampler';
import { getScoreEvolution, getBrandHistory } from './history_manager';
import { AggregatedScore } from '../types';

// Feature 10: Enterprise API Layer
// Simulated API gateway that maps to /api/v1/* endpoints.
// This structure can easily be moved to Supabase Edge Functions.

export const apiGateway = {
    // Simulates /api/v1/mai/{brand}
    getBrandMAI: async (brand: string, latestScores: AggregatedScore) => {
        return generateMAI(brand, latestScores);
    },

    // Simulates /api/v1/som/{brand}
    getBrandSOM: async (brand: string) => {
        // Requires executing a sampling batch to determine live SOM
        const result = await runModelSamplingBatch({
            brand,
            prompts: ['industry leader'],
            competitors: [],
            models: ['gpt-4o', 'claude-3-5-sonnet'],
            temperature: 0,
            context: 'clean'
        });
        return { brand, som: result.shareOfModel };
    },

    // Simulates /api/v1/history
    getBrandHistory: async (brand: string) => {
        return getBrandHistory(brand);
    },

    // Simulates /api/v1/history/score-evolution
    getScoreEvolution: async (brand: string) => {
        return getScoreEvolution(brand);
    },

    // Token-based auth simulation middleware
    validateToken: (token: string) => {
        return token.startsWith('sk_soma_');
    }
};
