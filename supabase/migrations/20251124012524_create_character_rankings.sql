/*
  # Character Rankings System

  1. New Tables
    - `character_votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `character_id` (integer, MAL character ID)
      - `character_name` (text)
      - `character_image` (text)
      - `anime_id` (integer, MAL anime ID)
      - `anime_title` (text)
      - `vote_type` (text, 'like' or 'favorite')
      - `created_at` (timestamptz)
      - Unique constraint on user_id, character_id, vote_type

    - `character_views`
      - `id` (uuid, primary key)
      - `character_id` (integer, MAL character ID)
      - `view_count` (integer)
      - `last_viewed` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read all character votes and views
    - Users can only insert/update/delete their own votes
    - Character views are public for reading
*/

CREATE TABLE IF NOT EXISTS character_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  character_id integer NOT NULL,
  character_name text NOT NULL,
  character_image text NOT NULL,
  anime_id integer NOT NULL,
  anime_title text NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('like', 'favorite')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, character_id, vote_type)
);

CREATE TABLE IF NOT EXISTS character_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id integer UNIQUE NOT NULL,
  view_count integer DEFAULT 1,
  last_viewed timestamptz DEFAULT now()
);

ALTER TABLE character_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view character votes"
  ON character_votes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON character_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON character_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view character views"
  ON character_views FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can insert character views"
  ON character_views FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update character views"
  ON character_views FOR UPDATE
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_character_votes_character_id ON character_votes(character_id);
CREATE INDEX IF NOT EXISTS idx_character_votes_user_id ON character_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_character_votes_vote_type ON character_votes(vote_type);
CREATE INDEX IF NOT EXISTS idx_character_views_character_id ON character_views(character_id);
