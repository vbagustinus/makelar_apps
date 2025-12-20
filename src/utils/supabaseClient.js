import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.HOT_UPDATER_SUPABASE_URL;
const supabaseAnonKey = process.env.HOT_UPDATER_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
