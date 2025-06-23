
import { useState } from "react";
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

  const handleAnswerSelect = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < 92) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / 93) * 100;
  const isAnswered = responses[currentQuestion] !== 0;

  const answerOptions = [
    { value: "1", label: "Strongly Disagree", color: "text-red-600" },
    { value: "2", label: "Disagree", color: "text-orange-600" },
    { value: "3", label: "Neutral", color: "text-slate-600" },
    { value: "4", label: "Agree", color: "text-blue-600" },
    { value: "5", label: "Strongly Agree", color: "text-green-600" }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
        <CardContent className="p-8">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-600">
                Question {currentQuestion + 1} of 93
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-8 leading-relaxed">
              {mbtiQuestions[currentQuestion].question}
            </h2>

            <RadioGroup
              value={responses[currentQuestion].toString()}
              onValueChange={handleAnswerSelect}
              className="space-y-4"
            >
              {answerOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`option${option.value}`}
                    className="w-5 h-5" 
                  />
                  <Label 
                    htmlFor={`option${option.value}`} 
                    className={`text-lg cursor-pointer flex-1 ${option.color}`}
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {currentQuestion === 92 ? 'Complete Assessment' : 'Next'}
              {currentQuestion !== 92 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentQuestions;
