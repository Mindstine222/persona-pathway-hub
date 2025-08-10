-- Fix RLS policies for assessment linking during signup
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow assessment creation for all users" ON public.assessments;
DROP POLICY IF EXISTS "Users can claim email-based assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow new users to link assessments" ON public.assessments;

-- Create more permissive policies for assessment creation and linking
CREATE POLICY "Enable assessment creation for everyone" 
  ON public.assessments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable assessment linking and updates" 
  ON public.assessments 
  FOR UPDATE 
  USING (
    -- Allow linking assessments with matching email during signup
    (user_id IS NULL AND email IS NOT NULL) OR
    -- Allow users to update their own assessments
    (auth.uid() = user_id) OR
    -- Allow authenticated users to claim assessments with their email
    (auth.uid() IS NOT NULL AND email = get_user_email())
  );