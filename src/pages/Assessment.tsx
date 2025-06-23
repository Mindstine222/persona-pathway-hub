import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AssessmentQuestions from "@/components/AssessmentQuestions";
import AssessmentResults from "@/components/AssessmentResults";
import AssessmentCompletion from "@/components/AssessmentCompletion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [responses, setResponses] = useState<number[]>([]);

  const handleStartAssessment = () => {
    setCurrentStep('questions');
  };

  const handleCompleteAssessment = (finalResponses: number[]) => {
    setResponses(finalResponses);
    setCurrentStep('results');
  };

  const handleRetakeTest = () => {
    setResponses([]);
    setCurrentStep('questions');
  };

  if (currentStep === 'questions') {
    return <AssessmentQuestions onComplete={handleCompleteAssessment} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {currentStep === 'intro' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Discover Your
                <span className="block text-blue-600">Personality Type</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Take our comprehensive Myers-Briggs Type Indicator assessment and unlock insights about your personality.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900 mb-2">Energy Direction</h3>
                    <p className="text-sm text-slate-600">Extraversion vs Introversion</p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900 mb-2">Information Processing</h3>
                    <p className="text-sm text-slate-600">Sensing vs Intuition</p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900 mb-2">Decision Making</h3>
                    <p className="text-sm text-slate-600">Thinking vs Feeling</p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900 mb-2">Lifestyle Approach</h3>
                    <p className="text-sm text-slate-600">Judging vs Perceiving</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>Time to complete:</strong> 15-20 minutes • <strong>Questions:</strong> 93 total
                  </p>
                </div>

                <Button 
                  onClick={handleStartAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-lg transition-colors"
                  size="lg"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'results' && (
          <AssessmentCompletion responses={responses} onRetakeTest={handleRetakeTest} />
        )}
      </div>
    </div>
  );
};

export default Assessment;
