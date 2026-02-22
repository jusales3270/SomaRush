import { AggregatedScore, MAIResult } from '../types';
import { supabase } from './supabaseClient';

// Feature 3: Score Architecture Refactor
// Feature 4: Model Authority Index (MAI)

/**
 * Calculates the Model Authority Index (MAI) using the proprietary formula.
 * Formula:
 * - AI Infrastructure Score (25%) -> JSON-LD, MCP, Crawlability
 * - Model Visibility Score (35%) -> Mention freq, Prompt diversity, Presence
 * - Recommendation Score (25%) -> Top 3 mentions, "Best X", Sentiment
 * - Agent Execution Score (15%) -> Endpoint validation, Action simulation
 */
export const calculateMAI = (scores: AggregatedScore): number => {
    const mai = (
        (scores.infrastructure * 0.25) +
        (scores.visibility * 0.35) +
        (scores.recommendation * 0.25) +
        (scores.agentExecution * 0.15)
    );
    return parseFloat(mai.toFixed(2));
};

export const generateMAI = async (brand: string, scores: AggregatedScore): Promise<MAIResult> => {
    const maiScore = calculateMAI(scores);

    const result: MAIResult = {
        brand,
        maiScore,
        subScores: scores,
        timestamp: new Date().toISOString()
    };

    // Persist computed MAI Score Historical Snapshot
    const { error } = await supabase.from('mai_history').insert({
        brand,
        mai_score: maiScore,
        sub_scores: scores,
        calculated_at: result.timestamp
    });

    if (error) {
        console.error("Failed to save MAI history snapshot:", error);
    }

    return result;
};
