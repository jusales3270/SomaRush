import { generateActionPlan } from "./actionEngine";
import { getMaiHistory } from "./maiHistory";
import { GeoScanResult, BenchmarkSnapshot, ExecutiveReport } from "../../types";

export function buildExecutiveReport(result: GeoScanResult, benchmark?: BenchmarkSnapshot): ExecutiveReport {
    return {
        brand: result.url.replace('https://', '').replace('http://', '').split('.')[0],
        mai: result.mai!,
        som: result.som!,
        history: getMaiHistory(),
        benchmark,
        actionPlan: generateActionPlan(result),
        generatedAt: new Date().toISOString(),
    };
}
