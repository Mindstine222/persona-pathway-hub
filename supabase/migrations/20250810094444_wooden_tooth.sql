/*
  # Fix user signup trigger function

  1. Changes
    - Update handle_new_user function to handle case-insensitive email matching
    - Improve error handling and logging
    - Fix potential issues with profile creation

  2. Security
    - Maintain existing RLS policies
    - Ensure proper user isolation
*/

-- Drop and recreate the handle_new_user function with better error handling
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    -- Insert into profiles table
    INSERT INTO public.profiles (id, first_name, last_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    
    -- Link any existing assessments with matching email (case-insensitive)
    UPDATE public.assessments 
    SET user_id = NEW.id 
    WHERE LOWER(email) = LOWER(NEW.email) 
    AND user_id IS NULL;
    
    RETURN NEW;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();