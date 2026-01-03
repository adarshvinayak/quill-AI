/*
  # Add Analysis Jobs and Details Tables
  
  1. New Tables
    - `analysis_jobs`
      - Tracks background job processing status
      - Stores progress for embeddings and Gemini analysis
    
    - `analysis_details`
      - Stores full analysis results as JSON
      - Links to analysis_history for metadata
  
  2. Security
    - Enable RLS on both tables
    - Allow public read/write for demo (adjust in production)
*/

-- Create analysis_jobs table
CREATE TABLE IF NOT EXISTS analysis_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  status text NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  embeddings_progress int DEFAULT 0 CHECK (embeddings_progress >= 0 AND embeddings_progress <= 100),
  gemini_progress int DEFAULT 0 CHECK (gemini_progress >= 0 AND gemini_progress <= 100),
  error text,
  analysis_id uuid,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create index for faster status lookups
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_status ON analysis_jobs(status);
CREATE INDEX IF NOT EXISTS idx_analysis_jobs_created_at ON analysis_jobs(created_at DESC);

-- Enable RLS
ALTER TABLE analysis_jobs ENABLE ROW LEVEL SECURITY;

-- Allow public access (adjust for production)
CREATE POLICY "Anyone can read analysis jobs"
  ON analysis_jobs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert analysis jobs"
  ON analysis_jobs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update analysis jobs"
  ON analysis_jobs FOR UPDATE
  TO anon
  USING (true);

-- Create analysis_details table
CREATE TABLE IF NOT EXISTS analysis_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_history_id uuid REFERENCES analysis_history(id) ON DELETE CASCADE,
  sentiment_breakdown jsonb NOT NULL,
  leads jsonb NOT NULL,
  top_feedback_topics jsonb NOT NULL,
  top_discussed_topics jsonb NOT NULL,
  actionable_todos jsonb,
  creator_insights jsonb,
  competitor_insights jsonb,
  engagement_spikes jsonb NOT NULL,
  top_influencers jsonb NOT NULL,
  vibe_trend jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_analysis_details_history_id ON analysis_details(analysis_history_id);

-- Enable RLS
ALTER TABLE analysis_details ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Anyone can read analysis details"
  ON analysis_details FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert analysis details"
  ON analysis_details FOR INSERT
  TO anon
  WITH CHECK (true);

