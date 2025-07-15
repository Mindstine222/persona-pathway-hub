
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mbtiType, scores, responses } = await req.json();
    
    console.log('Generating insights for:', { mbtiType, scores });

    // Create a detailed prompt for personalized insights
    const prompt = `
You are an expert MBTI analyst. Generate a comprehensive, personalized MBTI analysis for someone with type ${mbtiType} and the following preference scores:

Preference Scores:
- Extraversion: ${scores.E}% vs Introversion: ${scores.I}%
- Sensing: ${scores.S}% vs Intuition: ${scores.N}%
- Thinking: ${scores.T}% vs Feeling: ${scores.F}%
- Judging: ${scores.J}% vs Perceiving: ${scores.P}%

Based on these SPECIFIC scores (not just the type), provide a JSON response with:

1. "personalityDescription": A unique 2-3 sentence description that reflects their specific score intensities
2. "personalizedInsights": An array of 4 detailed insights (each 40-60 words) that address:
   - Energy management based on E/I score strength
   - Information processing style based on S/N score strength  
   - Decision-making approach based on T/F score strength
   - Lifestyle preferences based on J/P score strength
3. "strengths": An array of 6-8 personalized strengths that reflect their specific score patterns
4. "careers": An array of 10-12 career suggestions tailored to their unique score combination

Make each insight title descriptive and specific to their score levels (e.g., "Strong Extraversion Advantage" vs "Balanced Energy Approach").

Ensure the content is:
- Highly specific to their exact scores, not generic type descriptions
- Positive and empowering in tone
- Actionable and practical
- Unique - no two people with the same type but different scores should get identical content

Return only valid JSON, no additional text.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert MBTI analyst who creates personalized, unique insights. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);
    
    // Parse the JSON response
    let insights;
    try {
      insights = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI-generated content');
    }

    // Validate the response structure
    if (!insights.personalityDescription || !insights.personalizedInsights || !insights.strengths || !insights.careers) {
      throw new Error('Invalid AI response structure');
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-mbti-insights function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
