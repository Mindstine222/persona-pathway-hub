-- Check and fix the handle_new_user trigger function
-- The issue is that the trigger is trying to access assessments table but doesn't have proper permissions

-- Let's examine what the current handle_new_user function is doing
-- and modify it to work with our RLS policies

-- First, let's recreate the function with proper security context
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Link any existing assessments with this user's email
  -- This needs to be done with elevated privileges
  UPDATE public.assessments 
  SET user_id = NEW.id 
  WHERE user_id IS NULL 
    AND email = NEW.email;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();