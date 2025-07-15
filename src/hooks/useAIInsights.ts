
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIInsights {
  personalityDescription: string;
  personalizedInsights: Array<{
    title: string;
    content: string;
  }>;
  strengths: string[];
  careers: string[];
}

export const useAIInsights = (mbtiType: string, scores: any, responses: number[]) => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching AI insights for:', { mbtiType, scores });

        const { data, error: functionError } = await supabase.functions.invoke('generate-mbti-insights', {
          body: {
            mbtiType,
            scores,
            responses
          }
        });

        if (functionError) {
          console.error('Function error:', functionError);
          throw new Error(functionError.message || 'Failed to generate insights');
        }

        if (data.error) {
          console.error('AI generation error:', data.error);
          throw new Error(data.error);
        }

        console.log('AI insights received:', data);
        setInsights(data);
      } catch (err) {
        console.error('Error fetching AI insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate personalized insights');
      } finally {
        setLoading(false);
      }
    };

    if (mbtiType && scores) {
      fetchInsights();
    }
  }, [mbtiType, scores, responses]);

  return { insights, loading, error };
};
