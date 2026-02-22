import { BenchmarkSnapshot } from "../../types";

export function generateBenchmark(
    industry: string,
    entries: { brand: string; mai: number; som: number }[]
): BenchmarkSnapshot {
    const sorted = [...entries].sort((a, b) => b.mai - a.mai);

    return {
        industry,
        entries: sorted.map((e) => ({
            ...e,
            calculatedAt: new Date().toISOString(),
        })),
        generatedAt: new Date().toISOString(),
    };
}
