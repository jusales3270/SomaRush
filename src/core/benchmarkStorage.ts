import { BenchmarkSnapshot } from "../../types";

const KEY = "benchmark_snapshots";

export function saveBenchmark(snapshot: BenchmarkSnapshot) {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(KEY, JSON.stringify([...existing, snapshot]));
}

export function getBenchmarks(): BenchmarkSnapshot[] {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
}
