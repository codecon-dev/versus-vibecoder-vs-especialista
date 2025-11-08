import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Document = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

