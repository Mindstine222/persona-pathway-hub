
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { mbtiQuestions } from "@/data/mbtiQuestions";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AssessmentQuestionsProps {
  onComplete: (responses: number[]) => void;
}

const AssessmentQuestions = ({ onComplete }: AssessmentQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>(new Array(93).fill(0));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswerSelect = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);

    // Auto-advance to next question with animation
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (currentQuestion < 92) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        onComplete(newResponses);
      }
      setIsTransitioning(false);
    }, 600);
  };

  const handleNext = () => {
    if (currentQuestion < 92) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const progress = ((currentQuestion + 1) / 93) * 100;
  const isAnswered = responses[currentQuestion] !== 0;

  const answerOptions = [
    { value: "1", label: "Disagree", color: "text-blue-500" },
    { value: "2", label: "", color: "text-blue-400" },
    { value: "3", label: "", color: "text-gray-400" },
    { value: "4", label: "", color: "text-gray-400" },
    { value: "5", label: "", color: "text-gray-400" },
    { value: "6", label: "", color: "text-green-400" },
    { value: "7", label: "Agree", color: "text-green-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        {/* Question Card */}
        <Card className={`bg-white shadow-sm border-0 transition-all duration-500 ${
          isTransitioning ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
        }`}>
          <CardContent className="p-12 text-center">
            {/* Question Text */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium text-gray-800 leading-relaxed max-w-3xl mx-auto">
                {mbtiQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options - Horizontal circles */}
            <div className="mb-8">
              <RadioGroup
                value={responses[currentQuestion].toString()}
                onValueChange={handleAnswerSelect}
                className="flex flex-wrap justify-center gap-3 sm:gap-4"
                disabled={isTransitioning}
                >
                <span className="text-blue-500 text-xs sm:text-sm font-medium mr-2 sm:mr-4">Disagree</span>
                {answerOptions.map((option) => (
                  <div key={option.value} className="flex flex-col items-center">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`option${option.value}`}
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 ${
                        responses[currentQuestion].toString() === option.value
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${isTransitioning ? 'pointer-events-none' : ''}`}
                    />
                    <Label htmlFor={`option${option.value}`} className="sr-only">
                      {option.label || `Option ${option.value}`}
                    </Label>
                  </div>
                ))}
                <span className="text-green-500 text-xs sm:text-sm font-medium ml-2 sm:ml-4">Agree</span>
              </RadioGroup>

            </div>

            {/* Navigation - Only show if manual navigation is needed */}
            {!isAnswered && (
              <div className="flex justify-between items-center pt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {currentQuestion === 92 ? 'Complete' : 'Skip'}
                  {currentQuestion !== 92 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Questions Preview */}
        <div className="mt-8 space-y-2 max-h-32 overflow-hidden">
          {currentQuestion > 0 && (
            <div className="opacity-30 text-center">
              <p className="text-sm text-gray-500 truncate">
                {mbtiQuestions[currentQuestion - 1].question}
              </p>
            </div>
          )}
          {currentQuestion > 1 && (
            <div className="opacity-20 text-center">
              <p className="text-xs text-gray-400 truncate">
                {mbtiQuestions[currentQuestion - 2].question}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestions;
