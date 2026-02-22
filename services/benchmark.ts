import { BenchmarkReport } from '../types';
import { runModelSamplingBatch } from './model_sampler';
import { generateMAI } from './score_aggregator';

// Feature 9: Public Benchmark Engine
// Rodar batch por setor, Criar ranking automáticos

export const executeSectorBenchmark = async (sector: string, brands: string[]): Promise<BenchmarkReport> => {

    const rankings = [];

    for (const brand of brands) {
        // 1. In a real system you'd pull Infra/Agent scores from recent scans or DB
        const mockInfra = Math.random() * 40 + 60; // 60-100
        const mockAgent = Math.random() * 40 + 60; // 60-100

        // 2. Run sampling for visibility & recommendation
        const samplingResult = await runModelSamplingBatch({
            brand,
            prompts: ['Best in sector', 'Compare brands'],
            competitors: brands.filter(b => b !== brand),
            models: ['gpt-4o', 'claude-3-opus'],
            temperature: 0.3,
            context: 'clean'
        });

        // 3. Aggregate MAI
        const maiResult = await generateMAI(brand, {
            infrastructure: mockInfra,
            agentExecution: mockAgent,
            visibility: samplingResult.mentionFrequency, // rough mapping
            recommendation: samplingResult.recommendationRank // rough mapping
        });

        rankings.push({ brand, maiScore: maiResult.maiScore });
    }

    // Sort highest first
    rankings.sort((a, b) => b.maiScore - a.maiScore);

    return {
        sector,
        ranking: rankings,
        generatedAt: new Date().toISOString(),
        exportUrl: `https://somarush.com/exports/benchmark_${sector.toLowerCase()}_${Date.now()}.csv`
    };
};
