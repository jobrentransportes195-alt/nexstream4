import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvukroggvzdzvydmykdo.supabase.co';
const supabaseAnonKey = 'COLE_SUA_ANON_KEY_AQUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
