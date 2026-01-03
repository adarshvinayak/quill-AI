/*
  # Create feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key) - Unique identifier for each feedback entry
      - `name` (text) - Name of the person providing feedback
      - `email` (text) - Email address of the person providing feedback
      - `feedback` (text) - The actual feedback content
      - `created_at` (timestamptz) - Timestamp when feedback was submitted

  2. Security
    - Enable RLS on `feedback` table
    - Add policy for anyone to insert feedback (public form)
    - Add policy for authenticated users to read feedback (admin access)
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  feedback text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);