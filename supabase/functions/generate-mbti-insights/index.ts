import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchWithRetry(body: any, maxRetries = 5, baseDelay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) return response;

    if (response.status === 429) {
      const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
      console.warn(`Rate limit hit (429). Retrying in ${delay}ms... [Attempt ${attempt}]`);
      await new Promise(res => setTimeout(res, delay));
    } else {
      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`);
    }
  }

  throw new Error(`OpenAI API rate limit exceeded after ${maxRetries} attempts`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mbtiType, scores, responses } = await req.json();
    console.log('Generating insights for:', { mbtiType, scores });

    const prompt = `
You are an expert MBTI analyst. Generate a comprehensive, personalized MBTI analysis for someone with type ${mbtiType} and the following preference scores:

Preference Scores:
- Extraversion: ${scores.E}% vs Introversion: ${scores.I}%
- Sensing: ${scores.S}% vs Intuition: ${scores.N}%
- Thinking: ${scores.T}% vs Feeling: ${scores.F}%
- Judging: ${scores.J}% vs Perceiving: ${scores.P}%

Based on these SPECIFIC scores (not just the type), provide a JSON response with:

1. "personalityDescription": A unique 2-3 sentence description that reflects their specific score intensities
2. "personalizedInsights": An array of 4 detailed insights (each 40-60 words)
3. "strengths": An array of 6-8 personalized strengths
4. "careers": An array of 10-12 career suggestions

Respond only with valid JSON. No extra text.
`;

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert MBTI analyst. Only return valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    };

    const response = await fetchWithRetry(body);
    const data = await response.json();

    const content = data.choices?.[0]?.message?.content || '';
    console.log('Generated content:', content);

    let insights;
    try {
      insights = JSON.parse(content);
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      throw new Error('Invalid JSON from OpenAI');
    }

    if (!insights.personalityDescription || !insights.personalizedInsights || !insights.strengths || !insights.careers) {
      throw new Error('Missing required fields in AI response');
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error in generate-mbti-insights function:', err);
    return new Response(JSON.stringify({
      error: err.message || 'Internal Server Error',
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
