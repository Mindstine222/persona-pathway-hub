
-- Create assessments table to store user assessment data
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  email TEXT,
  responses JSONB NOT NULL,
  mbti_type TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  results_sent BOOLEAN DEFAULT FALSE
);

-- Create subscription_requests table for bulk purchases and subscriptions
CREATE TABLE public.subscription_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  team_size TEXT,
  package_type TEXT NOT NULL, -- 'starter', 'business', 'enterprise', 'monthly', 'annual'
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assessments (if logged in)
CREATE POLICY "Users can view their own assessments" 
  ON public.assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow inserting assessments (for both logged in and anonymous users)
CREATE POLICY "Anyone can create assessments" 
  ON public.assessments 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for subscription requests
ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create subscription requests
CREATE POLICY "Anyone can create subscription requests" 
  ON public.subscription_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Only authenticated users can view subscription requests (for admin purposes)
CREATE POLICY "Authenticated users can view subscription requests" 
  ON public.subscription_requests 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);
