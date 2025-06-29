/*
  # Fix RLS policy for customer support requests

  1. Policy Changes
    - Drop the existing INSERT policy that uses 'public' role
    - Create a new INSERT policy that allows both 'anon' and 'authenticated' roles
    - This enables both logged-in and anonymous users to submit support requests

  2. Security
    - Maintains security by only allowing INSERT operations
    - Users can still only view their own support requests if authenticated
*/

-- Drop the existing policy that uses 'public' role
DROP POLICY IF EXISTS "Anyone can submit support requests" ON customer_support_requests;

-- Create a new policy that allows both anon and authenticated users to insert
CREATE POLICY "Allow anon and authenticated users to submit support requests"
  ON customer_support_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);