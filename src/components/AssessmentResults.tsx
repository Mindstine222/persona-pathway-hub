
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-900">Your INTRA16 Type</CardTitle>
          <div className="flex justify-center mt-4">
            <Badge className="text-2xl px-6 py-3 bg-blue-600 hover:bg-blue-700">
              {result.type}
            </Badge>
          </div>
          <h2 className="text-xl text-gray-700 mt-2">{typeInfo.name}</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Visual Personality Breakdown:</h3>
          <MBTIBarChart scores={result.scores} />
        </div>

        
        
        <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Your Preferences:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Energy Direction:</span>
                  <Badge variant="outline">{result.scores.E > result.scores.I ? 'Extraversion (E)' : 'Introversion (I)'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Information Processing:</span>
                  <Badge variant="outline">{result.scores.S > result.scores.N ? 'Sensing (S)' : 'Intuition (N)'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Decision Making:</span>
                  <Badge variant="outline">{result.scores.T > result.scores.F ? 'Thinking (T)' : 'Feeling (F)'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lifestyle Approach:</span>
                  <Badge variant="outline">{result.scores.J > result.scores.P ? 'Judging (J)' : 'Perceiving (P)'}</Badge>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Preference Strength:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>E vs I:</span>
                  <span>{Math.abs(result.scores.E - result.scores.I)} points</span>
                </div>
                <div className="flex justify-between">
                  <span>S vs N:</span>
                  <span>{Math.abs(result.scores.S - result.scores.N)} points</span>
                </div>
                <div className="flex justify-between">
                  <span>T vs F:</span>
                  <span>{Math.abs(result.scores.T - result.scores.F)} points</span>
                </div>
                <div className="flex justify-between">
                  <span>J vs P:</span>
                  <span>{Math.abs(result.scores.J - result.scores.P)} points</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Description:</h3>
            <p className="text-gray-700 leading-relaxed">{typeInfo.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Strengths:</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {typeInfo.strengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Career Suggestions:</h3>
            <div className="flex flex-wrap gap-2">
              {typeInfo.careers.map((career, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {career}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button onClick={onRetakeTest} variant="outline" className="mr-4">
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
