
import { useState } from "react";
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
  const { toast } = useToast();

  // Save assessment automatically when component mounts
  useState(() => {
    const saveAssessment = async () => {
      if (assessmentSaved) return;
      
      try {
        const result = calculateMBTIType(responses);
        
        const { error } = await supabase
          .from('assessments')
          .insert([{
            email: null, // Will be updated when user requests results
            responses: responses,
            mbti_type: result.type,
            user_id: null, // Anonymous for now
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
  });

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
      // Calculate MBTI type
      const result = calculateMBTIType(responses);

      // Store or update assessment in database with email
      const { error: dbError } = await supabase
        .from('assessments')
        .insert([{
          email: email,
          responses: responses,
          mbti_type: result.type,
          user_id: null // Will be null for anonymous users
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

      // Send email with results
      const { error: emailError } = await supabase.functions.invoke('send-assessment-report', {
        body: { email, responses }
      });

      if (emailError) {
        console.error('Email function error:', emailError);
        throw new Error('Failed to send email. Please check if RESEND_API_KEY is configured.');
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
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-gray-900">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600">
            Congratulations! You've successfully completed the Myers-Briggs Type Indicator assessment.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Your Comprehensive Report Includes:</h3>
            <ul className="text-left text-blue-800 space-y-1">
              <li>• Your complete MBTI personality type</li>
              <li>• Detailed analysis of your preferences</li>
              <li>• Strength and development areas</li>
              <li>• Career recommendations</li>
              <li>• Communication and relationship insights</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Your assessment has been saved. Enter your email below to receive your detailed results report.
            </p>
          </div>

          {!emailSent ? (
            <div className="space-y-4">
              <div className="text-left space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✅ Report sent successfully to {email}
              </p>
              <p className="text-green-700 text-sm mt-1">
                Please check your inbox (and spam folder) for your detailed personality report.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={onRetakeTest} 
              variant="outline" 
              className="px-6"
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
