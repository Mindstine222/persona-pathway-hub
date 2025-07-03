
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AssessmentReportRequest {
  email: string;
  name?: string;
  mbtiType: string;
  reportUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, mbtiType, reportUrl }: AssessmentReportRequest = await req.json();

    console.log('Assessment report request:', { email, name, mbtiType, reportUrl });

    // Use the correct custom domain
    const baseUrl = "https://duskydunes.com";
    const finalReportUrl = reportUrl || `${baseUrl}/dashboard`;

    const modernEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your INTRA16 Assessment Results</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .email-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
            backdrop-filter: blur(10px);
        }
        .brand-name {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .tagline {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
        }
        .description {
            font-size: 16px;
            line-height: 1.6;
            color: #6b7280;
            margin-bottom: 32px;
        }
        .mbti-badge {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 32px;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
        }
        .features {
            margin: 32px 0;
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #374151;
        }
        .feature-icon {
            width: 20px;
            height: 20px;
            background: #10b981;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
            color: white;
        }
        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
        }
        .social-links {
            margin-top: 20px;
        }
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 32px 0;
        }
        @media (max-width: 600px) {
            .email-container { padding: 20px 10px; }
            .header, .content { padding: 30px 20px; }
            .greeting { font-size: 20px; }
            .cta-button { display: block; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="header">
                <div class="logo">I</div>
                <div class="brand-name">INTRA16</div>
                <div class="tagline">Discover Your True Personality</div>
            </div>
            
            <div class="content">
                <div class="greeting">
                    🎉 Congratulations${name ? `, ${name}` : ''}!
                </div>
                
                <div class="description">
                    Your INTRA16 personality assessment is complete! We've analyzed your responses and generated a comprehensive personality report tailored specifically for you.
                </div>
                
                <div style="text-align: center;">
                    <div class="mbti-badge">${mbtiType || 'Your Personality Type'}</div>
                </div>
                
                <div class="features">
                    <ul class="feature-list">
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            Detailed personality breakdown and insights
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            Strengths and growth opportunities
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            Career and relationship guidance
                        </li>
                        <li class="feature-item">
                            <span class="feature-icon">✓</span>
                            Communication style analysis
                        </li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${finalReportUrl}" class="cta-button">
                        📊 View Your Complete Report
                    </a>
                </div>
                
                <div class="divider"></div>
                
                <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <div style="color: #92400e; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                        💡 Pro Tip
                    </div>
                    <div style="color: #78350f; font-size: 14px; line-height: 1.5;">
                        Your personality type is just the beginning. The real value lies in understanding how to leverage your strengths and develop your potential areas for growth.
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-text">
                    This report was generated by INTRA16 - Advanced Personality Assessment Platform
                </div>
                <div class="footer-text">
                    Questions? Reply to this email or visit our support center.
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                    INTRA16 by Linked Up Consulting | Discover Your Potential
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "INTRA16 <info@duskydunes.com>",
      to: [email],
      subject: `🎉 Your ${mbtiType || 'Personality'} Report is Ready!`,
      html: modernEmailTemplate,
    });

    console.log("Assessment report email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-assessment-report:", error);
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
