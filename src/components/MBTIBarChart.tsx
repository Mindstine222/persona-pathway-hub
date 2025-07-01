import React from "react";

interface MBTIBarChartProps {
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

const MBTIBarChart = ({ scores }: MBTIBarChartProps) => {
  const getPercentage = (a: number, b: number) => {
    const total = a + b;
    return total === 0 ? 50 : Math.round((a / total) * 100);
  };

  const dimensions = [
    {
      name: "Energy",
      leftLabel: "Extraverted",
      rightLabel: "Introverted", 
      leftScore: scores.E,
      rightScore: scores.I,
      color: "#3B82F6", // Blue
      icon: "⚡"
    },
    {
      name: "Information",
      leftLabel: "Intuitive", 
      rightLabel: "Observant",
      leftScore: scores.N,
      rightScore: scores.S,
      color: "#F59E0B", // Amber/Orange
      icon: "👁️"
    },
    {
      name: "Decision",
      leftLabel: "Thinking",
      rightLabel: "Feeling", 
      leftScore: scores.T,
      rightScore: scores.F,
      color: "#10B981", // Green
      icon: "🧠"
    },
    {
      name: "Structure",
      leftLabel: "Judging",
      rightLabel: "Prospecting",
      leftScore: scores.J,
      rightScore: scores.P,
      color: "#8B5CF6", // Purple
      icon: "📋"
    },
    {
      name: "Confidence",
      leftLabel: "Assertive",
      rightLabel: "Turbulent",
      leftScore: 54, // Mock data for now
      rightScore: 46,
      color: "#EF4444", // Red
      icon: "💪"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Your Traits</h3>
      
      <div className="space-y-8">
        {dimensions.map((dim, index) => {
          const total = dim.leftScore + dim.rightScore;
          const leftPercentage = Math.round((dim.leftScore / total) * 100);
          const rightPercentage = 100 - leftPercentage;
          const dominantSide = leftPercentage > rightPercentage ? 'left' : 'right';
          const dominantPercentage = Math.max(leftPercentage, rightPercentage);
          const dominantLabel = dominantSide === 'left' ? dim.leftLabel : dim.rightLabel;
          
          return (
            <div key={index} className="space-y-3">
              {/* Percentage and dominant trait */}
              <div className="text-center mb-2">
                <div className="text-2xl font-bold" style={{ color: dim.color }}>
                  {dominantPercentage}% {dominantLabel}
                </div>
              </div>
              
              {/* Labels */}
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <span>{dim.leftLabel}</span>
                <span>{dim.rightLabel}</span>
              </div>
              
              {/* Progress bar */}
              <div className="relative">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      background: `linear-gradient(90deg, ${dim.color} 0%, ${dim.color}dd 100%)`,
                      width: `${dominantSide === 'left' ? leftPercentage : rightPercentage}%`,
                      marginLeft: dominantSide === 'right' ? `${leftPercentage}%` : '0'
                    }}
                  />
                </div>
                
                {/* Center indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm"></div>
                </div>
              </div>
              
              {/* Category label */}
              <div className="text-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {dim.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Test date */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Test taken: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
          <button className="text-blue-500 hover:text-blue-600 font-medium">
            View past results
          </button>
        </div>
      </div>
    </div>
  );
};

export default MBTIBarChart;