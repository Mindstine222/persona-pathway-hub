
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssessmentReportRequest {
  email: string;
  name: string;
  personalityType: string;
  scores: any;
  insights: string[];
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Assessment report function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, personalityType, scores, insights }: AssessmentReportRequest = await req.json();
    
    console.log("Sending assessment report to:", email);
    console.log("Personality type:", personalityType);

    const emailResponse = await resend.emails.send({
      from: "INTRA16 Assessment <info@duskydunes.com>",
      to: [email],
      reply_to: "info@duskydunes.com",
      subject: `Your INTRA16 Personality Assessment Results - ${personalityType}`,
      headers: {
        'X-Entity-Ref-ID': `assessment-${Date.now()}`,
        'X-Priority': '1',
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your INTRA16 Assessment Results</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f8fafc;
            }
            .header { 
              background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 12px 12px 0 0;
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 0 0 12px 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .personality-badge { 
              background: #3B82F6; 
              color: white; 
              padding: 12px 24px; 
              border-radius: 8px; 
              font-size: 24px; 
              font-weight: bold; 
              display: inline-block; 
              margin: 20px 0;
            }
            .scores-section { 
              background: #F1F5F9; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .score-item { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              padding: 10px 0; 
              border-bottom: 1px solid #E2E8F0;
            }
            .score-item:last-child { border-bottom: none; }
            .insights-section { 
              background: #FEF3C7; 
              border: 1px solid #F59E0B; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .insight-item { 
              margin: 15px 0; 
              padding: 10px 0; 
            }
            .cta-button { 
              background: #3B82F6; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 8px; 
              display: inline-block; 
              font-weight: bold; 
              margin: 20px 0;
            }
            .footer { 
              text-align: center; 
              color: #64748B; 
              font-size: 14px; 
              margin-top: 30px; 
              padding: 20px; 
              border-top: 1px solid #E2E8F0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎯 Your INTRA16 Personality Assessment Results</h1>
            <p>Discover insights about your unique personality type</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name || 'Assessment Taker'}!</h2>
            
            <p>Congratulations on completing your INTRA16 personality assessment! Your results reveal fascinating insights about your personality preferences and behavioral tendencies.</p>
            
            <div style="text-align: center;">
              <div class="personality-badge">${personalityType}</div>
            </div>
            
            <div class="scores-section">
              <h3>📊 Your Personality Preference Scores</h3>
              <div class="score-item">
                <span><strong>Energy Direction:</strong></span>
                <span>${scores.E > scores.I ? 'Extraverted' : 'Introverted'} (${Math.round((Math.max(scores.E, scores.I) / (scores.E + scores.I)) * 100)}%)</span>
              </div>
              <div class="score-item">
                <span><strong>Information Processing:</strong></span>
                <span>${scores.S > scores.N ? 'Observant' : 'Intuitive'} (${Math.round((Math.max(scores.S, scores.N) / (scores.S + scores.N)) * 100)}%)</span>
              </div>
              <div class="score-item">
                <span><strong>Decision Making:</strong></span>
                <span>${scores.T > scores.F ? 'Thinking' : 'Feeling'} (${Math.round((Math.max(scores.T, scores.F) / (scores.T + scores.F)) * 100)}%)</span>
              </div>
              <div class="score-item">
                <span><strong>Lifestyle Approach:</strong></span>
                <span>${scores.J > scores.P ? 'Judging' : 'Prospecting'} (${Math.round((Math.max(scores.J, scores.P) / (scores.J + scores.P)) * 100)}%)</span>
              </div>
            </div>
            
            ${insights && insights.length > 0 ? `
            <div class="insights-section">
              <h3>💡 Key Insights About Your Personality</h3>
              ${insights.map(insight => `<div class="insight-item">• ${insight}</div>`).join('')}
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://duskydunes.com/dashboard" class="cta-button">
                View Your Complete Report
              </a>
            </div>
            
            <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
              <h4>🚀 What's Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Log in to your dashboard to access your complete personality profile</li>
                <li>Download your detailed PDF report with career suggestions</li>
                <li>Explore personalized development recommendations</li>
                <li>Share your results with friends and colleagues</li>
              </ul>
            </div>
            
            <p><strong>Remember:</strong> Your personality type is just one lens through which to understand yourself. Use these insights as a starting point for personal growth and self-awareness.</p>
          </div>
          
          <div class="footer">
            <p>This assessment was powered by <strong>INTRA16</strong> - Advanced Personality Insights</p>
            <p>Questions? Contact us at <a href="mailto:support@duskydunes.com">support@duskydunes.com</a></p>
            <p style="font-size: 12px; color: #94A3B8;">
              You're receiving this email because you completed a personality assessment on our platform.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
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
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send assessment report email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
