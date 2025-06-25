
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company_name, team_size, package_type, message } = await req.json();

    if (!name || !email || !package_type) {
      throw new Error("Name, email, and package type are required");
    }

    const getPackageDetails = (type: string) => {
      switch (type) {
        case 'starter': return { name: 'Starter Package', price: '$99/month' };
        case 'business': return { name: 'Business Package', price: '$299/month' };
        case 'enterprise': return { name: 'Enterprise Package', price: 'Custom pricing' };
        case 'monthly': return { name: 'Monthly Subscription', price: '$49/month' };
        case 'annual': return { name: 'Annual Subscription', price: '$490/year' };
        default: return { name: 'Subscription Package', price: 'Contact for pricing' };
      }
    };

    const packageDetails = getPackageDetails(package_type);

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "INTRA16 <onboarding@resend.dev>",
      to: [email],
      subject: `Subscription Request Received - ${packageDetails.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Subscription Request Confirmation</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9fafb; }
              .footer { padding: 20px; text-align: center; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Interest!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>We've received your subscription request for the <strong>${packageDetails.name}</strong>.</p>
                
                <h3>Request Details:</h3>
                <ul>
                  <li><strong>Package:</strong> ${packageDetails.name}</li>
                  <li><strong>Pricing:</strong> ${packageDetails.price}</li>
                  ${company_name ? `<li><strong>Company:</strong> ${company_name}</li>` : ''}
                  ${team_size ? `<li><strong>Team Size:</strong> ${team_size}</li>` : ''}
                </ul>
                
                ${message ? `<p><strong>Your Message:</strong><br>${message}</p>` : ''}
                
                <p>Our team will review your request and contact you within 24 hours to:</p>
                <ul>
                  <li>Discuss your specific requirements</li>
                  <li>Provide payment instructions</li>
                  <li>Set up your account once payment is confirmed</li>
                </ul>
                
                <p>If you have any immediate questions, please don't hesitate to contact us.</p>
              </div>
              <div class="footer">
                <p>Best regards,<br>The INTRA16 Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "INTRA16 <onboarding@resend.dev>",
      to: ["admin@intra16.com"], // Replace with actual admin email
      subject: `New Subscription Request - ${packageDetails.name}`,
      html: `
        <h2>New Subscription Request</h2>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Package:</strong> ${packageDetails.name}</p>
        ${company_name ? `<p><strong>Company:</strong> ${company_name}</p>` : ''}
        ${team_size ? `<p><strong>Team Size:</strong> ${team_size}</p>` : ''}
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Emails sent successfully:", { customerEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-subscription-confirmation function:", error);
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
