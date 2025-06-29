/*
  # Customer Support Requests Table

  1. New Table
    - `customer_support_requests`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on the table
    - Add policy for authenticated users to insert their own requests
    - Add policy for public users to insert requests (if needed)
*/

-- Create customer_support_requests table
CREATE TABLE IF NOT EXISTS customer_support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customer_support_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert support requests
-- This allows both authenticated and unauthenticated users to submit support requests
CREATE POLICY "Anyone can submit support requests"
  ON customer_support_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for authenticated users to view their own requests
CREATE POLICY "Users can view own support requests"
  ON customer_support_requests
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Add updated_at trigger
CREATE TRIGGER update_customer_support_requests_updated_at
  BEFORE UPDATE ON customer_support_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_customer_support_requests_email ON customer_support_requests(email);
CREATE INDEX IF NOT EXISTS idx_customer_support_requests_status ON customer_support_requests(status);
CREATE INDEX IF NOT EXISTS idx_customer_support_requests_created_at ON customer_support_requests(created_at);