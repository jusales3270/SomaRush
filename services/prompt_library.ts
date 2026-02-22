import { PromptTemplate } from '../types';
import { supabase } from './supabaseClient';

// Feature 6: Prompt Intelligence System
// Banco próprio de prompts categorizados por nicho para dar padrão científico.

export const fetchPromptsByNiche = async (niche: string): Promise<PromptTemplate[]> => {
    const { data, error } = await supabase
        .from('prompt_library')
        .select('*')
        .eq('niche', niche)
        .order('strategicWeight', { ascending: false });

    if (error) {
        console.error("Failed to fetch prompts:", error);
        // Return fallback prompts for resilience
        return [
            {
                id: 'fallback-1',
                niche: niche,
                subcategory: 'general',
                type: 'informational',
                strategicWeight: 0.5,
                text: `What are the best brands in the ${niche} sector?`
            }
        ];
    }

    return data as PromptTemplate[];
};

export const createPromptTemplate = async (prompt: Omit<PromptTemplate, 'id'>) => {
    const { data, error } = await supabase
        .from('prompt_library')
        .insert(prompt)
        .select();

    if (error) throw error;
    return data;
};
