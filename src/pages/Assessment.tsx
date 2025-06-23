
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AssessmentQuestions from "@/components/AssessmentQuestions";
import AssessmentResults from "@/components/AssessmentResults";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {currentStep === 'intro' && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-gray-900">
                MBTI Personality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-600">
                  Discover your personality type with our comprehensive Myers-Briggs Type Indicator assessment.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">What you'll learn:</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="font-medium text-gray-700">Energy Direction:</p>
                      <p className="text-sm text-gray-600">Extraversion (E) vs Introversion (I)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Information Processing:</p>
                      <p className="text-sm text-gray-600">Sensing (S) vs Intuition (N)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Decision Making:</p>
                      <p className="text-sm text-gray-600">Thinking (T) vs Feeling (F)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Lifestyle Approach:</p>
                      <p className="text-sm text-gray-600">Judging (J) vs Perceiving (P)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Instructions:</strong> Answer all 93 questions honestly based on your natural preferences. 
                    There are no right or wrong answers. The assessment takes approximately 15-20 minutes.
                  </p>
                </div>
                <Button 
                  onClick={handleStartAssessment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'questions' && (
          <AssessmentQuestions onComplete={handleCompleteAssessment} />
        )}

        {currentStep === 'results' && (
          <AssessmentResults responses={responses} onRetakeTest={handleRetakeTest} />
        )}
      </div>
    </div>
  );
};

export default Assessment;
