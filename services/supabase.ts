
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvukroggvzdzvydmykdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dWtyb2dndnpkenZ5ZG15a2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQ0ODQsImV4cCI6MjA4Njc3MDQ4NH0.YcK2VZ9dHwWzD-37P0GhuLFVa2hI8PFuzK-WAS8pQPo';
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
