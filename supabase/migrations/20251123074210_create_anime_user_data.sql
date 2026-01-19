/*
  # Anime User Data Schema

  1. New Tables
    - `user_watchlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `anime_id` (integer, MyAnimeList ID)
      - `anime_title` (text)
      - `anime_image` (text)
      - `status` (text: watching, completed, plan_to_watch, dropped)
      - `created_at` (timestamptz)
    
    - `user_ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `anime_id` (integer)
      - `rating` (integer, 1-10)
      - `review` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own data
    - Authenticated users only
*/

CREATE TABLE IF NOT EXISTS user_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id integer NOT NULL,
  anime_title text NOT NULL,
  anime_image text,
  status text DEFAULT 'plan_to_watch' CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, anime_id)
);

CREATE TABLE IF NOT EXISTS user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  anime_id integer NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 10),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, anime_id)
);

ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
  ON user_watchlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist"
  ON user_watchlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlist"
  ON user_watchlist FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist"
  ON user_watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ratings"
  ON user_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ratings"
  ON user_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON user_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON user_ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings(user_id);