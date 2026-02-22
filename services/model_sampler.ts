import { callGeminiProxy } from './gemini';
import { ModelSamplingParams, ModelSamplingResult } from '../types';

export const runModelSamplingBatch = async (
    params: ModelSamplingParams
): Promise<ModelSamplingResult> => {
    // Use Gemini Proxy to execute batch prompts against various models.
    // This invokes the actual Intelligence Layer engine which will detect:
    // - Direct/Indirect citations
    // - Mention ranking
    // - Context Sentiment (positive, neutral)
    const result = await callGeminiProxy('model_sampling', params as unknown as Record<string, unknown>);

    // Feature 5: Share of Model (SOM) Calculation
    // SOM = (Mentions da marca) / (Total mentions de todas marcas no batch)
    // This logic can be processed by the edge function and returned here.

    return {
        mentionFrequency: result.mentionFrequency || 0,
        recommendationRank: result.recommendationRank || 0,
        crossModelConsistency: result.crossModelConsistency || 0,
        shareOfModel: result.shareOfModel || 0, // SOM
        rawResponses: result.rawResponses || []
    };
};
