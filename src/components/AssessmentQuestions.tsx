
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswerSelect = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);

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
    { value: "1", size: "w-[20px] h-[20px]", color: "bg-red-400" },
    { value: "2", size: "w-[28px] h-[28px]", color: "bg-orange-400" },
    { value: "3", size: "w-[36px] h-[36px]", color: "bg-yellow-400" },
    { value: "4", size: "w-[44px] h-[44px]", color: "bg-gray-300" },
    { value: "5", size: "w-[36px] h-[36px]", color: "bg-blue-300" },
    { value: "6", size: "w-[28px] h-[28px]", color: "bg-green-400" },
    { value: "7", size: "w-[20px] h-[20px]", color: "bg-green-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4 py-6">
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200 rounded-full" />
        </div>

        {/* Question Card */}
        <Card
          className={`bg-white shadow-md border-0 transition-all duration-500 ${
            isTransitioning ? "opacity-30 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <CardContent className="px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 text-center">
            {/* Question Text */}
            <div className="mb-10 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed max-w-3xl mx-auto">
                {mbtiQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options - Scaled circles like 16Personalities */}
            <div className="flex flex-col items-center gap-6 w-full mb-8 px-2 sm:px-0">
              <RadioGroup
                value={responses[currentQuestion].toString()}
                onValueChange={handleAnswerSelect}
                className="w-full flex items-center justify-between"
                disabled={isTransitioning}
              >
                <span className="text-xs sm:text-sm text-red-600 font-semibold">DISAGREE</span>
                <div className="flex gap-2 sm:gap-3 justify-center items-center flex-1">
                  {answerOptions.map((option) => (
                    <RadioGroupItem
                      key={option.value}
                      value={option.value}
                      id={`option${option.value}`}
                      className={`rounded-full border-2 border-gray-300 hover:border-gray-400 transition
                        ${option.size} ${option.color}
                        ${
                          responses[currentQuestion].toString() === option.value
                            ? "ring-2 ring-offset-2 ring-blue-400"
                            : ""
                        }
                      `}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-green-600 font-semibold">AGREE</span>
              </RadioGroup>
            </div>

            {/* Navigation */}
            {!isAnswered && (
              <div className="flex justify-between items-center pt-6 text-sm sm:text-base">
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
                  {currentQuestion === 92 ? "Complete" : "Skip"}
                  {currentQuestion !== 92 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Question Preview */}
        <div className="mt-8 space-y-2 max-h-32 overflow-hidden px-2">
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




{/*
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
    {/* <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> */}
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4 py-6">  
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
               <div className="flex flex-col items-center gap-6 w-full mb-8 px-2 sm:px-0">
                <RadioGroup
                  value={responses[currentQuestion].toString()}
                  onValueChange={handleAnswerSelect}
                  className="w-full flex items-center justify-between"
                  disabled={isTransitioning}
                >
                  <span className="text-xs sm:text-sm text-green-600 font-semibold">AGREE</span>
              
                  <div className="flex gap-2 sm:gap-3 justify-center items-center flex-1">
                    {answerOptions.map((option) => (
                      <RadioGroupItem
                        key={option.value}
                        value={option.value}
                        id={`option${option.value}`}
                        className={`
                          w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition
                          ${
                            responses[currentQuestion].toString() === option.value
                              ? 'bg-green-500 border-green-600'
                              : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      />
                    ))}
                  </div>
              
                  <span className="text-xs sm:text-sm text-purple-600 font-semibold">DISAGREE</span>
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

      */}
