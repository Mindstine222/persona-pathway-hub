// Updated generate-mbti-insights Edge Function with retry protection & timeouts New Versoin
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;
const TIMEOUT_MS = 15000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mbtiType, scores } = await req.json();

    console.log("Generating insights for:", { mbtiType, scores });

    const prompt = `
You are an expert MBTI analyst. Generate a comprehensive, personalized MBTI analysis for someone with type ${mbtiType} and the following preference scores:

Preference Scores:
- Extraversion: ${scores.E}% vs Introversion: ${scores.I}%
- Sensing: ${scores.S}% vs Intuition: ${scores.N}%
- Thinking: ${scores.T}% vs Feeling: ${scores.F}%
- Judging: ${scores.J}% vs Perceiving: ${scores.P}%

Based on these SPECIFIC scores (not just the type), provide a JSON response with:
1. "personalityDescription": A unique 2-3 sentence description that reflects their specific score intensities
2. "personalizedInsights": 4 detailed insights (~50 words each)
3. "strengths": 6-8 strengths
4. "careers": 10-12 career suggestions

Make it unique, actionable, score-based, and positive. Return ONLY valid JSON.
`;

    const fetchWithRetry = async (attempt = 1): Promise<Response> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert MBTI analyst. Respond with valid JSON only.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.8,
            max_tokens: 1500,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        return res;
      } catch (err) {
        clearTimeout(timeout);
        if (attempt < MAX_RETRIES) {
          console.warn(`Retrying OpenAI call (Attempt ${attempt})...`);
          await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
          return fetchWithRetry(attempt + 1);
        } else {
          throw new Error("OpenAI request failed after retries.");
        }
      }
    };

    const response = await fetchWithRetry();

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content || "";
    console.log("Generated content:", generatedContent);

    let insights;
    try {
      insights = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI-generated content");
    }

    // Basic structure check
    if (!insights.personalityDescription || !insights.personalizedInsights || !insights.strengths || !insights.careers) {
      throw new Error("Invalid AI response structure");
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-mbti-insights function:", error);
    return new Response(
      JSON.stringify({ error: error.message, fallback: true }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
