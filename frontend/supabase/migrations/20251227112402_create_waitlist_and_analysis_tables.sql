/*
  # Create Quill AI Database Schema

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `platform` (text) - Which platform user is interested in (Instagram or X)
      - `created_at` (timestamptz)
    
    - `analysis_history`
      - `id` (uuid, primary key)
      - `url` (text) - The analyzed URL
      - `platform` (text) - Platform type (YouTube, Instagram, X)
      - `sentiment_score` (numeric) - Overall sentiment percentage
      - `lead_percentage` (numeric) - Percentage of potential leads
      - `total_comments` (integer) - Total number of comments analyzed
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policy for public insert to waitlist (for beta signups)
    - Add policy for public read/write to analysis_history (for now, simulated data)
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  platform text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert to waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read waitlist"
  ON waitlist FOR SELECT
  TO anon
  USING (true);

CREATE TABLE IF NOT EXISTS analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  platform text NOT NULL DEFAULT 'youtube',
  sentiment_score numeric DEFAULT 0,
  lead_percentage numeric DEFAULT 0,
  total_comments integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analysis history"
  ON analysis_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert analysis history"
  ON analysis_history FOR INSERT
  TO anon
  WITH CHECK (true);