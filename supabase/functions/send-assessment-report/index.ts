
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// MBTI Questions data structure (subset needed for calculation)
interface MBTIQuestion {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 'positive' | 'negative';
}

// MBTI calculation logic moved into the edge function
interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

interface MBTIResult {
  type: string;
  scores: MBTIScores;
}

// Simplified MBTI questions structure for calculation
const mbtiQuestions: MBTIQuestion[] = [
  // EI dimension (23 questions)
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' }, { dimension: 'EI', direction: 'negative' },
  { dimension: 'EI', direction: 'positive' },
  
  // SN dimension (23 questions)
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' }, { dimension: 'SN', direction: 'negative' },
  { dimension: 'SN', direction: 'positive' },
  
  // TF dimension (23 questions)
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' }, { dimension: 'TF', direction: 'negative' },
  { dimension: 'TF', direction: 'positive' },
  
  // JP dimension (24 questions)
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' },
  { dimension: 'JP', direction: 'positive' }, { dimension: 'JP', direction: 'negative' }
];

const calculateMBTIType = (responses: number[]): MBTIResult => {
  const scores: MBTIScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  responses.forEach((response, index) => {
    const question = mbtiQuestions[index];
    if (!question) return;

    // Convert response (1-7) to score (-3 to +3)
    const score = response - 4;

    switch (question.dimension) {
      case 'EI':
        if (question.direction === 'positive') {
          scores.E += score;
          scores.I -= score;
        } else {
          scores.I += score;
          scores.E -= score;
        }
        break;
      case 'SN':
        if (question.direction === 'positive') {
          scores.S += score;
          scores.N -= score;
        } else {
          scores.N += score;
          scores.S -= score;
        }
        break;
      case 'TF':
        if (question.direction === 'positive') {
          scores.T += score;
          scores.F -= score;
        } else {
          scores.F += score;
          scores.T -= score;
        }
        break;
      case 'JP':
        if (question.direction === 'positive') {
          scores.J += score;
          scores.P -= score;
        } else {
          scores.P += score;
          scores.J -= score;
        }
        break;
    }
  });

  // Normalize scores to positive values
  const normalizedScores = {
    E: scores.E + 69, // 23 questions * 3 max score
    I: scores.I + 69,
    S: scores.S + 69, // 23 questions * 3 max score  
    N: scores.N + 69,
    T: scores.T + 69, // 23 questions * 3 max score
    F: scores.F + 69,
    J: scores.J + 72, // 24 questions * 3 max score
    P: scores.P + 72
  };

  // Determine type
  const type = 
    (normalizedScores.E > normalizedScores.I ? 'E' : 'I') +
    (normalizedScores.S > normalizedScores.N ? 'S' : 'N') +
    (normalizedScores.T > normalizedScores.F ? 'T' : 'F') +
    (normalizedScores.J > normalizedScores.P ? 'J' : 'P');

  return {
    type,
    scores: normalizedScores
  };
};

// MBTI Types data (simplified version for the email)
const mbtiTypes: Record<string, any> = {
  "INTJ": { name: "The Architect", description: "Imaginative and strategic thinkers, with a plan for everything." },
  "INTP": { name: "The Thinker", description: "Innovative inventors with an unquenchable thirst for knowledge." },
  "ENTJ": { name: "The Commander", description: "Bold, imaginative and strong-willed leaders." },
  "ENTP": { name: "The Debater", description: "Smart and curious thinkers who cannot resist an intellectual challenge." },
  "INFJ": { name: "The Advocate", description: "Creative and insightful, inspired and independent." },
  "INFP": { name: "The Mediator", description: "Poetic, kind and altruistic people, always eager to help." },
  "ENFJ": { name: "The Protagonist", description: "Charismatic and inspiring leaders, able to mesmerize listeners." },
  "ENFP": { name: "The Campaigner", description: "Enthusiastic, creative and sociable free spirits." },
  "ISTJ": { name: "The Logistician", description: "Practical and fact-minded, reliable and responsible." },
  "ISFJ": { name: "The Protector", description: "Warm-hearted and dedicated, always ready to protect loved ones." },
  "ESTJ": { name: "The Executive", description: "Excellent administrators, unsurpassed at managing things or people." },
  "ESFJ": { name: "The Consul", description: "Extraordinarily caring, social and popular people." },
  "ISTP": { name: "The Virtuoso", description: "Bold and practical experimenters, masters of all kinds of tools." },
  "ISFP": { name: "The Adventurer", description: "Flexible and charming artists, always ready to explore new possibilities." },
  "ESTP": { name: "The Entrepreneur", description: "Smart, energetic and perceptive people, truly enjoy living on the edge." },
  "ESFP": { name: "The Entertainer", description: "Spontaneous, energetic and enthusiastic people - life is never boring." }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, responses } = await req.json();

    if (!email || !responses) {
      throw new Error("Email and responses are required");
    }

    console.log("Processing assessment report for email:", email);

    // Calculate result
    const result = calculateMBTIType(responses);
    const typeInfo = mbtiTypes[result.type] || { name: "Unknown Type", description: "Unable to determine type." };

    console.log("Calculated MBTI type:", result.type);

    // Update the assessment record to mark results as sent
    const { error: updateError } = await supabase
      .from('assessments')
      .update({ results_sent: true })
      .eq('email', email)
      .eq('responses', JSON.stringify(responses));

    if (updateError) {
      console.error('Error updating assessment:', updateError);
    }

    // Generate HTML email content with improved deliverability
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your INTRA16 Assessment Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 30px; }
            .type-badge { background: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 18px; display: inline-block; margin: 10px 0; }
            .section { margin: 25px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .preference { margin: 10px 0; padding: 10px; background: white; border-radius: 6px; display: flex; justify-content: space-between; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
            h1 { margin: 0; font-size: 32px; }
            h2 { color: #1e40af; margin-top: 0; }
            h3 { color: #374151; margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your INTRA16 Assessment Report</h1>
              <p style="margin: 0; opacity: 0.9;">Discover your personality type and unlock your potential</p>
            </div>
            
            <div class="content">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2>Your Personality Type</h2>
                <span class="type-badge">${result.type}</span>
                <h3>${typeInfo.name}</h3>
                <p style="font-size: 16px; color: #64748b;">${typeInfo.description}</p>
              </div>

              <div class="section">
                <h3>Your Personality Preferences</h3>
                <div class="preference">
                  <span><strong>Energy Direction:</strong></span>
                  <span>${result.scores.E > result.scores.I ? 'Extraversion (E)' : 'Introversion (I)'}</span>
                </div>
                <div class="preference">
                  <span><strong>Information Processing:</strong></span>
                  <span>${result.scores.S > result.scores.N ? 'Sensing (S)' : 'Intuition (N)'}</span>
                </div>
                <div class="preference">
                  <span><strong>Decision Making:</strong></span>
                  <span>${result.scores.T > result.scores.F ? 'Thinking (T)' : 'Feeling (F)'}</span>
                </div>
                <div class="preference">
                  <span><strong>Lifestyle Approach:</strong></span>
                  <span>${result.scores.J > result.scores.P ? 'Judging (J)' : 'Perceiving (P)'}</span>
                </div>
              </div>

              <div class="section">
                <h3>Preference Strength</h3>
                <p>The strength of your preferences shows how clear your tendencies are in each dimension:</p>
                <div class="preference">
                  <span>Energy (E vs I):</span>
                  <span>${Math.abs(result.scores.E - result.scores.I)} points</span>
                </div>
                <div class="preference">
                  <span>Information (S vs N):</span>
                  <span>${Math.abs(result.scores.S - result.scores.N)} points</span>
                </div>
                <div class="preference">
                  <span>Decision (T vs F):</span>
                  <span>${Math.abs(result.scores.T - result.scores.F)} points</span>
                </div>
                <div class="preference">
                  <span>Lifestyle (J vs P):</span>
                  <span>${Math.abs(result.scores.J - result.scores.P)} points</span>
                </div>
              </div>

              <div class="section">
                <h3>Understanding Your Results</h3>
                <p>Your personality type represents your natural preferences for how you direct your energy, take in information, make decisions, and approach the outside world. Remember that:</p>
                <ul>
                  <li>All types are equally valuable and have unique strengths</li>
                  <li>You can develop skills outside your preferences</li>
                  <li>Type doesn't limit what you can achieve</li>
                  <li>This is a starting point for self-understanding and growth</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p>This report was generated based on your responses to the INTRA16 personality assessment.</p>
              <p>For more detailed insights and career guidance, consider consulting with a certified practitioner.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log("Attempting to send email to:", email);
    console.log("Using domain: linkedupconsulting.com");

    const emailResponse = await resend.emails.send({
      from: "INTRA16 Assessment <noreply@linkedupconsulting.com>",
      to: [email],
      subject: `Your INTRA16 Assessment Results - ${result.type} (${typeInfo.name})`,
      html: htmlContent,
      reply_to: "support@linkedupconsulting.com",
      headers: {
        'X-Entity-Ref-ID': `assessment-${Date.now()}`,
      },
    });

    console.log("Resend API response:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message || emailResponse.error}`);
    }

    console.log("Email sent successfully with ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      recipient: email,
      type: result.type
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-report function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
