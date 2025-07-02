
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateMBTIType } from "@/utils/mbtiCalculator";

interface AssessmentCompletionProps {
  responses: number[];
  onRetakeTest: () => void;
}

const AssessmentCompletion = ({ responses, onRetakeTest }: AssessmentCompletionProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [assessmentSaved, setAssessmentSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Check if user is logged in and get their email
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    checkUser();
  }, []);

  // Save assessment automatically when component mounts
  useEffect(() => {
    const saveAssessment = async () => {
      if (assessmentSaved) return;
      
      try {
        const result = calculateMBTIType(responses);
        
        const { error } = await supabase
          .from('assessments')
          .insert([{
            email: currentUser?.email || null,
            responses: responses,
            mbti_type: result.type,
            user_id: currentUser?.id || null,
            results_sent: false
          }]);

        if (error) {
          console.error('Error saving assessment:', error);
        } else {
          setAssessmentSaved(true);
          console.log('Assessment saved successfully');
        }
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
    };

    saveAssessment();
  }, [responses, assessmentSaved, currentUser]);

  const handleSendReport = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive the report.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Calculate result
      const result = calculateMBTIType(responses);

      // Generate personalized insights
      const generatePersonalizedInsights = () => {
        const insights = [];
        const type = result.type;
        const scores = result.scores;

        // Energy Direction Insights
        const energyGap = Math.abs(scores.E - scores.I);
        if (type[0] === 'E') {
          if (energyGap > 30) {
            insights.push("You have a very clear preference for Extraversion. You likely feel most energized when interacting with others and may find isolation draining.");
          } else if (energyGap > 15) {
            insights.push("While you prefer Extraversion, you also have some comfort with Introversion. This flexibility allows you to adapt to both social and solitary work situations effectively.");
          } else {
            insights.push("Your energy preference is quite balanced. You can draw energy from both social interaction and quiet reflection, making you adaptable to various work environments.");
          }
        } else {
          if (energyGap > 30) {
            insights.push("You have a clear preference for Introversion. You likely do your best thinking in quiet environments and may need time alone to recharge after social interactions.");
          } else if (energyGap > 15) {
            insights.push("While you prefer Introversion, you can also engage effectively in social situations. This balance allows you to contribute thoughtfully in groups while maintaining your need for reflection.");
          } else {
            insights.push("Your energy preference is quite balanced. You can draw energy from both quiet reflection and social interaction, giving you versatility in different situations.");
          }
        }

        return insights;
      };

      const insights = generatePersonalizedInsights();

      // Store or update assessment in database with email
      const { error: dbError } = await supabase
        .from('assessments')
        .insert([{
          email: email,
          responses: responses,
          mbti_type: result.type,
          user_id: currentUser?.id || null
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        // If insert fails due to duplicate, try update
        const { error: updateError } = await supabase
          .from('assessments')
          .update({ email: email, results_sent: false })
          .eq('responses', JSON.stringify(responses))
          .eq('mbti_type', result.type);
        
        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error('Failed to save assessment');
        }
      }

      // Prepare data in the format expected by the edge function
      const emailData = {
        email: email,
        name: email.split('@')[0],
        personalityType: result.type,
        scores: result.scores,
        insights: insights
      };

      console.log('Sending email data:', emailData);

      // Send email with results
      const { error: emailError } = await supabase.functions.invoke('send-assessment-report', {
        body: emailData
      });

      if (emailError) {
        console.error('Email function error:', emailError);
        throw new Error('Failed to send email. Please check if RESEND_API_KEY is configured');
      }

      setEmailSent(true);
      toast({
        title: "Report sent!",
        description: "Your personality assessment report has been sent to your email.",
      });
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl text-gray-900 dark:text-gray-100">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Congratulations! You've successfully completed the INTRA16 personality assessment.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Your Comprehensive Report Includes:</h3>
            <ul className="text-left text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Your complete personality type</li>
              <li>• Detailed analysis of your preferences</li>
              <li>• Strength and development areas</li>
              <li>• Career recommendations</li>
              <li>• Communication and relationship insights</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              <strong>Note:</strong> Your assessment has been saved. Enter your email below to receive your detailed results report.
            </p>
          </div>

          {!emailSent ? (
            <div className="space-y-4">
              <div className="text-left space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <Button 
                onClick={handleSendReport}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                size="lg"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? "Sending Report..." : "Send My Report via Email"}
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-300 font-medium">
                ✅ Report sent successfully to {email}
              </p>
              <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                Please check your inbox (and spam folder) for your detailed personality report.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={onRetakeTest} 
              variant="outline" 
              className="px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentCompletion;
