import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://twdcflmtsganutzmjald.supabase.co";
const supabaseAnonKey = "SUA_ANON_KEY";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);