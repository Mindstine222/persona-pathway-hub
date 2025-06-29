import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateMBTIType } from "@/utils/mbtiCalculator";
import { mbtiTypes } from "@/data/mbtiTypes";

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

  // Enhanced bar chart component with proper labeling
  const EnhancedBarChart = () => {
    const dimensions = [
      { 
        name: 'Energy Direction', 
        left: { label: 'E - Extraversion', score: result.scores.E }, 
        right: { label: 'I - Introversion', score: result.scores.I }
      },
      { 
        name: 'Information Processing', 
        left: { label: 'S - Sensing', score: result.scores.S }, 
        right: { label: 'N - Intuition', score: result.scores.N }
      },
      { 
        name: 'Decision Making', 
        left: { label: 'T - Thinking', score: result.scores.T }, 
        right: { label: 'F - Feeling', score: result.scores.F }
      },
      { 
        name: 'Lifestyle Approach', 
        left: { label: 'J - Judging', score: result.scores.J }, 
        right: { label: 'P - Perceiving', score: result.scores.P }
      }
    ];

    return (
      <div className="space-y-6">
        {dimensions.map((dim, index) => {
          const total = dim.left.score + dim.right.score;
          const leftPercentage = Math.round((dim.left.score / total) * 100);
          const rightPercentage = 100 - leftPercentage;
          
          return (
            <div key={index} className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-center">{dim.name}</h4>
              
              {/* Labels at the ends */}
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <span>{dim.left.label}</span>
                <span>{dim.right.label}</span>
              </div>
              
              {/* Bar chart */}
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${leftPercentage}%` }}
                />
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${rightPercentage}%` }}
                />
                
                {/* Percentage labels on the bar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {leftPercentage}% | {rightPercentage}%
                  </span>
                </div>
              </div>
              
              {/* Preference strength indicator */}
              <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                {Math.abs(leftPercentage - rightPercentage) > 30 ? 'Strong preference' : 
                 Math.abs(leftPercentage - rightPercentage) > 15 ? 'Moderate preference' : 'Flexible'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Main Type Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-900 dark:text-gray-100">Your INTRA16 Type</CardTitle>
          <div className="flex justify-center mt-4">
            <Badge className="text-2xl px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
              {result.type}
            </Badge>
          </div>
          <h2 className="text-xl text-gray-700 dark:text-gray-300 mt-2">{typeInfo.name}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Enhanced Visual Chart */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">Personality Preference Chart</h3>
            <EnhancedBarChart />
          </div>

          {/* Personalized Insights */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">💡 Your Personalized Insights</h3>
            <div className="space-y-4">
              {personalizedInsights.map((insight, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{insight.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Type Description */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{typeInfo.description}</p>
          </div>

          {/* Strengths and Development Areas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">💪 Key Strengths</h3>
              <div className="space-y-2">
                {typeInfo.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🎯 Development Areas</h3>
              <div className="space-y-2">
                {typeInfo.careers.slice(0, 6).map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Consider: {area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Career Suggestions */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">🚀 Career Suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {typeInfo.careers.map((career, index) => (
                <Badge key={index} variant="outline" className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                  {career}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button onClick={onRetakeTest} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Retake Assessment
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentResults;