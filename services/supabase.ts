import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvukroggvzdzvydmykdo.supabase.co';
const supabaseAnonKey = 'sb_publishable_K0gY0s_99gSn-7UvhPFDsA_Cg1nmeV0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 

