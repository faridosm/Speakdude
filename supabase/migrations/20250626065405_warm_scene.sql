/*
  # Fix user signup trigger

  1. Database Functions
    - Create or replace `handle_new_user` function to automatically create profile entries
    - Function triggers on new user creation in auth.users table

  2. Database Triggers  
    - Create trigger on auth.users table to call handle_new_user function
    - Ensures profile is created automatically when user signs up

  3. Security
    - Maintains existing RLS policies on profiles table
    - Ensures proper user isolation and data security
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  
  -- Also create initial user progress record
  INSERT INTO public.user_progress (user_id, created_at, updated_at)
  VALUES (
    new.id,
    now(),
    now()
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();