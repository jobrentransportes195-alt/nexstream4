import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvukroggvzdzvydmykdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZGNmbG10c2dhbnV0em1qYWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTM5NjMsImV4cCI6MjA4MzM2OTk2M30.C7AE5qDHGStXKcv3uS2fNagF1ycqyDEwFTSZlU9IkVA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);