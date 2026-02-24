import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://vdiakqooykmkwxfrkgsu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaWFrcW9veWtta3d4ZnJrZ3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTQ0OTIsImV4cCI6MjA4NTg3MDQ5Mn0.pajBXj0OHkZtqcVfvZrHtI8vV5CMv-JJwGSwgn83AD8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Edge Function URL for Gemini API proxy
export const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/gemini-proxy`;
