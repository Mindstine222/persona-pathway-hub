
-- First, let's drop the existing conflicting policies
DROP POLICY IF EXISTS "Anyone can create assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can also view assessments by email match" ON public.assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can claim email-based assessments" ON public.assessments;

-- Create a comprehensive INSERT policy that allows both authenticated and anonymous users
CREATE POLICY "Allow assessment creation for all users"
  ON public.assessments
  FOR INSERT
  WITH CHECK (true);

-- Create SELECT policies
CREATE POLICY "Users can view their own assessments"
  ON public.assessments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view assessments by email match"
  ON public.assessments
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR
    (auth.uid() IS NULL AND email IS NOT NULL)
  );

-- Create UPDATE policies
CREATE POLICY "Users can update their own assessments"
  ON public.assessments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim email-based assessments"
  ON public.assessments
  FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );
