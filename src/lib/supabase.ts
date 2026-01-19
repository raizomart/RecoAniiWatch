import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type WatchlistStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

export interface WatchlistItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_title: string;
  anime_image: string | null;
  status: WatchlistStatus;
  created_at: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  anime_id: number;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}
