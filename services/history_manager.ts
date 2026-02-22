import { supabase } from './supabaseClient';
import { SnapshotHistory } from '../types';

// Feature 2: Snapshot Histórico
// Armazenar: Data, Modelo, Prompt, Resposta completa, Score calculado, Concorrência

export const saveHistorySnapshot = async (snapshot: Omit<SnapshotHistory, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('history_snapshots').insert({
        brand: snapshot.brand,
        model: snapshot.model,
        prompt: snapshot.prompt,
        full_response: snapshot.fullResponse,
        computed_score: snapshot.computedScore,
        competitors: snapshot.competitors
    }).select();

    if (error) throw error;
    return data;
};

export const getBrandHistory = async (brand: string, limit = 50) => {
    const { data, error } = await supabase
        .from('history_snapshots')
        .select('*')
        .eq('brand', brand)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
};

export const getScoreEvolution = async (brand: string) => {
    const history = await getBrandHistory(brand);
    return history.map(h => ({
        date: h.created_at,
        score: h.computed_score
    }));
};

export const getModelComparison = async (brand: string) => {
    const history = await getBrandHistory(brand);
    const comparison: Record<string, { count: number; totalScore: number }> = {};

    history.forEach(h => {
        if (!comparison[h.model]) {
            comparison[h.model] = { count: 0, totalScore: 0 };
        }
        comparison[h.model].count++;
        comparison[h.model].totalScore += h.computed_score;
    });

    return Object.entries(comparison).map(([model, metrics]) => ({
        model,
        averageScore: metrics.totalScore / metrics.count
    }));
};
