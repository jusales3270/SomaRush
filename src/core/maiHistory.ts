import { MaiHistoryEntry } from '../../types';

const STORAGE_KEY = "mai_history";

export function saveMaiHistory(entry: MaiHistoryEntry) {
    const existing = getMaiHistory();
    const updated = [...existing, entry];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getMaiHistory(): MaiHistoryEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function clearMaiHistory() {
    localStorage.removeItem(STORAGE_KEY);
}
