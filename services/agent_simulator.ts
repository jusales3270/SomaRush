import { SimulationResult } from '../types';
import { callGeminiProxy } from './gemini';

// Feature 8: Agent Simulation Layer
// Simular fluxo completo, Validar GET/POST, Testar latência.

export const simulateAgentExecution = async (apiUrl: string, actionType: 'GET' | 'POST', payload?: any): Promise<SimulationResult> => {
    const start = performance.now();

    try {
        // In a real scenario, this would likely be an Edge Function doing the actual HTTP call 
        // to bypass CORS and properly measure external latency without browser restrictions.
        const result = await callGeminiProxy('agent_simulate', {
            apiUrl,
            actionType,
            payload
        });

        const end = performance.now();

        return {
            endpoint: apiUrl,
            method: actionType,
            latencyMs: Math.round(end - start),
            success: result.success === true,
            actionOutput: result.output || 'No output generated'
        };

    } catch (err: any) {
        const end = performance.now();
        return {
            endpoint: apiUrl,
            method: actionType,
            latencyMs: Math.round(end - start),
            success: false,
            actionOutput: err.message
        };
    }
};
