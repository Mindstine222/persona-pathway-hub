import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateMBTIType } from "@/utils/mbtiCalculator";
import { mbtiTypes } from "@/data/mbtiTypes";
import MBTIBarChart from "@/components/MBTIBarChart";

interface AssessmentResultsProps {
  responses: number[];
  onRetakeTest: () => void;
}

const AssessmentResults = ({ responses, onRetakeTest }: AssessmentResultsProps) => {
  const result = calculateMBTIType(responses);
  const typeInfo = mbtiTypes[result.type];

  // Generate dynamic insights based on actual scores
  const generatePersonalizedInsights = () => {
    const insights = [];
    const type = result.type;
    const scores = result.scores;

    // Energy Direction Insights
    const energyGap = Math.abs(scores.E - scores.I);
    if (type[0] === 'E') {
      if (energyGap > 30) {
        insights.push({
          title: "Strong Extraversion",
          content: "You have a very clear preference for Extraversion. You likely feel most energized when interacting with others and may find isolation draining. Consider leveraging your natural networking abilities and collaborative spirit in your work."
        });
      } else if (energyGap > 15) {
        insights.push({
          title: "Moderate Extraversion",
          content: "While you prefer Extraversion, you also have some comfort with Introversion. This flexibility allows you to adapt to both social and solitary work situations effectively."
        });
      } else {
        insights.push({
          title: "Flexible Energy Direction",
          content: "Your energy preference is quite balanced. You can draw energy from both social interaction and quiet reflection, making you adaptable to various work environments."
        });
      }
    } else {
      if (energyGap > 30) {
        insights.push({
          title: "Strong Introversion",
          content: "You have a clear preference for Introversion. You likely do your best thinking in quiet environments and may need time alone to recharge after social interactions. Your depth of focus is a significant strength."
        });
      } else if (energyGap > 15) {
        insights.push({
          title: "Moderate Introversion",
          content: "While you prefer Introversion, you can also engage effectively in social situations. This balance allows you to contribute thoughtfully in groups while maintaining your need for reflection."
        });
      } else {
        insights.push({
          title: "Flexible Energy Direction",
          content: "Your energy preference is quite balanced. You can draw energy from both quiet reflection and social interaction, giving you versatility in different situations."
        });
      }
    }

    // Information Processing Insights
    const infoGap = Math.abs(scores.S - scores.N);
    if (type[1] === 'S') {
      if (infoGap > 30) {
        insights.push({
          title: "Strong Sensing Preference",
          content: "You have a clear preference for concrete, practical information. You excel at noticing details and working with real, tangible data. Your practical approach helps you implement ideas effectively."
        });
      } else {
        insights.push({
          title: "Balanced Information Processing",
          content: "While you lean toward Sensing, you can also appreciate abstract concepts and future possibilities. This gives you both practical grounding and innovative potential."
        });
      }
    } else {
      if (infoGap > 30) {
        insights.push({
          title: "Strong Intuitive Preference",
          content: "You have a clear preference for patterns, possibilities, and future potential. You excel at seeing the big picture and generating innovative ideas. Your visionary thinking is a key strength."
        });
      } else {
        insights.push({
          title: "Balanced Information Processing",
          content: "While you lean toward Intuition, you can also work effectively with concrete details when needed. This balance helps you both innovate and implement."
        });
      }
    }

    // Decision Making Insights
    const decisionGap = Math.abs(scores.T - scores.F);
    if (type[2] === 'T') {
      if (decisionGap > 30) {
        insights.push({
          title: "Strong Thinking Preference",
          content: "You have a clear preference for logical, objective decision-making. You excel at analyzing situations rationally and making tough decisions based on facts and principles."
        });
      } else {
        insights.push({
          title: "Balanced Decision Making",
          content: "While you prefer logical analysis, you also consider the human impact of decisions. This balance helps you make decisions that are both rational and considerate."
        });
      }
    } else {
      if (decisionGap > 30) {
        insights.push({
          title: "Strong Feeling Preference",
          content: "You have a clear preference for value-based, people-centered decision-making. You excel at considering the human impact and maintaining harmony while making decisions."
        });
      } else {
        insights.push({
          title: "Balanced Decision Making",
          content: "While you prefer considering values and people, you can also apply logical analysis when needed. This balance helps you make well-rounded decisions."
        });
      }
    }

    // Lifestyle Insights
    const lifestyleGap = Math.abs(scores.J - scores.P);
    if (type[3] === 'J') {
      if (lifestyleGap > 30) {
        insights.push({
          title: "Strong Judging Preference",
          content: "You have a clear preference for structure and closure. You excel at planning, organizing, and bringing projects to completion. Your reliability and follow-through are significant strengths."
        });
      } else {
        insights.push({
          title: "Balanced Lifestyle Approach",
          content: "While you prefer structure, you can also adapt to changing circumstances. This flexibility allows you to plan effectively while remaining open to new opportunities."
        });
      }
    } else {
      if (lifestyleGap > 30) {
        insights.push({
          title: "Strong Perceiving Preference",
          content: "You have a clear preference for flexibility and keeping options open. You excel at adapting to change and exploring new possibilities. Your spontaneity and adaptability are key strengths."
        });
      } else {
        insights.push({
          title: "Balanced Lifestyle Approach",
          content: "While you prefer flexibility, you can also work within structured environments when needed. This balance helps you adapt while still meeting deadlines and commitments."
        });
      }
    }

    return insights;
  };

  const personalizedInsights = generatePersonalizedInsights();

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
              <p className="text-gray-600 dark:text-gray-400 mt-2">{typeInfo.description}</p>
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {personalizedInsights.map((insight, index) => (
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {typeInfo.strengths.map((strength, index) => (
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {typeInfo.careers.map((career, index) => (
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