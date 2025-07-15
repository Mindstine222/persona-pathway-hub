
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateMBTIType } from "@/utils/mbtiCalculator";
import { mbtiTypes } from "@/data/mbtiTypes";
import MBTIBarChart from "@/components/MBTIBarChart";
import { useAIInsights } from "@/hooks/useAIInsights";
import { Loader2 } from "lucide-react";

interface AssessmentResultsProps {
  responses: number[];
  onRetakeTest: () => void;
}

const AssessmentResults = ({ responses, onRetakeTest }: AssessmentResultsProps) => {
  const result = calculateMBTIType(responses);
  const typeInfo = mbtiTypes[result.type];
  
  const { insights, loading, error } = useAIInsights(result.type, result.scores, responses);

  // Fallback to static content if AI fails
  const getFallbackInsights = () => {
    return {
      personalityDescription: typeInfo.description,
      personalizedInsights: [
        {
          title: "Energy Direction",
          content: result.scores.E > result.scores.I 
            ? "You tend to draw energy from external interactions and social environments."
            : "You prefer to recharge through quiet reflection and internal processing."
        },
        {
          title: "Information Processing", 
          content: result.scores.S > result.scores.N
            ? "You focus on concrete details and practical, real-world information."
            : "You're drawn to patterns, possibilities, and abstract concepts."
        },
        {
          title: "Decision Making",
          content: result.scores.T > result.scores.F
            ? "You prefer logical, objective analysis when making decisions."
            : "You consider values and the human impact when making choices."
        },
        {
          title: "Lifestyle Approach",
          content: result.scores.J > result.scores.P
            ? "You appreciate structure, planning, and bringing things to completion."
            : "You value flexibility, spontaneity, and keeping options open."
        }
      ],
      strengths: typeInfo.strengths,
      careers: typeInfo.careers
    };
  };

  const displayInsights = insights || getFallbackInsights();

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Main Results Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Chart */}
        <div>
          <MBTIBarChart scores={result.scores} />
        </div>

        {/* Right Column - Type Info */}
        <div className="space-y-6">
          {/* Main Type Card */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="text-3xl px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {result.type}
                </Badge>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">{typeInfo.name}</CardTitle>
              
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Generating your personalized insights...</span>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-amber-600 dark:text-amber-400 text-sm mb-2">
                    ⚠️ Using standard insights (AI generation failed)
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{displayInsights.personalityDescription}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-green-600 dark:text-green-400 text-sm">✨ AI-Personalized</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{displayInsights.personalityDescription}</p>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Dominant Trait Summary */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {result.scores.E > result.scores.I ? 'Extraverted' : 'Introverted'} • {' '}
                    {result.scores.S > result.scores.N ? 'Observant' : 'Intuitive'} • {' '}
                    {result.scores.T > result.scores.F ? 'Thinking' : 'Feeling'} • {' '}
                    {result.scores.J > result.scores.P ? 'Judging' : 'Prospecting'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Your dominant personality traits combination
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        {/* Personalized Insights */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>💡</span> Your Personalized Insights
              {insights && !loading && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  AI-Generated
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {displayInsights.personalizedInsights.map((insight, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{insight.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths and Career Suggestions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>💪</span> Key Strengths
                {insights && !loading && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    Personalized
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayInsights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>🚀</span> Career Suggestions
                {insights && !loading && (
                  <Badge variant="outline" className="ml-2 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                    Tailored
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayInsights.careers.map((career, index) => (
                  <Badge key={index} variant="outline" className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                    {career}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button onClick={onRetakeTest} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3">
            Retake Assessment
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
