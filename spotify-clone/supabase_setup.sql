-- Supabase SQL commands to create required tables
-- Run these in your Supabase SQL editor

-- Create the songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  author TEXT,
  title TEXT,
  song_path TEXT,
  image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policies for songs table
CREATE POLICY "Users can view own songs" ON songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own songs" ON songs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own songs" ON songs
  FOR DELETE USING (auth.uid() = user_id);

-- Create liked_songs table if you need it
CREATE TABLE IF NOT EXISTS liked_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  song_id UUID REFERENCES songs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Enable Row Level Security for liked_songs
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for liked_songs table
CREATE POLICY "Users can view own liked songs" ON liked_songs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own liked songs" ON liked_songs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own liked songs" ON liked_songs
  FOR DELETE USING (auth.uid() = user_id);
