/*
  # Episode Discussion System

  1. New Tables
    - `episode_discussions`
      - `id` (uuid, primary key)
      - `anime_id` (integer, MAL anime ID)
      - `anime_title` (text)
      - `episode_number` (integer)
      - `user_id` (uuid, references auth.users)
      - `username` (text, user email for display)
      - `comment` (text)
      - `is_spoiler` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `episode_reactions`
      - `id` (uuid, primary key)
      - `discussion_id` (uuid, references episode_discussions)
      - `user_id` (uuid, references auth.users)
      - `reaction` (text, emoji or reaction type)
      - `created_at` (timestamptz)
      - Unique constraint on user_id, discussion_id

  2. Security
    - Enable RLS on both tables
    - Anyone can read discussions and reactions
    - Only authenticated users can create discussions and reactions
    - Users can update/delete their own discussions
    - Users can delete their own reactions
*/

CREATE TABLE IF NOT EXISTS episode_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id integer NOT NULL,
  anime_title text NOT NULL,
  episode_number integer NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  comment text NOT NULL,
  is_spoiler boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS episode_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES episode_discussions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, discussion_id, reaction)
);

ALTER TABLE episode_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view episode discussions"
  ON episode_discussions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON episode_discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discussions"
  ON episode_discussions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions"
  ON episode_discussions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reactions"
  ON episode_reactions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can add reactions"
  ON episode_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON episode_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_episode_discussions_anime_id ON episode_discussions(anime_id);
CREATE INDEX IF NOT EXISTS idx_episode_discussions_episode_number ON episode_discussions(episode_number);
CREATE INDEX IF NOT EXISTS idx_episode_discussions_user_id ON episode_discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_episode_reactions_discussion_id ON episode_reactions(discussion_id);
CREATE INDEX IF NOT EXISTS idx_episode_reactions_user_id ON episode_reactions(user_id);
