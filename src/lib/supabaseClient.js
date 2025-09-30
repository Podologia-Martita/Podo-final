import { createClient } from '@supabase/supabase-js';

// Se leen las variables de entorno definidas en Vercel o .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);