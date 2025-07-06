
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
  const dimensions = [
    {
      name: "Energy Direction",
      leftLabel: "Extraverted",
      rightLabel: "Introverted", 
      leftScore: scores.E,
      rightScore: scores.I,
      color: "#3B82F6", // Blue
      icon: "⚡"
    },
    {
      name: "Information Processing",
      leftLabel: "Intuitive", 
      rightLabel: "Observant",
      leftScore: scores.N,
      rightScore: scores.S,
      color: "#F59E0B", // Amber/Orange
      icon: "👁️"
    },
    {
      name: "Decision Making",
      leftLabel: "Thinking",
      rightLabel: "Feeling", 
      leftScore: scores.T,
      rightScore: scores.F,
      color: "#10B981", // Green
      icon: "🧠"
    },
    {
      name: "Lifestyle Approach",
      leftLabel: "Judging",
      rightLabel: "Prospecting",
      leftScore: scores.J,
      rightScore: scores.P,
      color: "#8B5CF6", // Purple
      icon: "📋"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your Personality Preference Chart
        </h3>
      </div>
      
      <div className="space-y-8">
        {dimensions.map((dim, index) => {
          const total = dim.leftScore + dim.rightScore;
          const leftPercentage = Math.round((dim.leftScore / total) * 100);
          const rightPercentage = 100 - leftPercentage;
          const dominantSide = leftPercentage > rightPercentage ? 'left' : 'right';
          const dominantPercentage = Math.max(leftPercentage, rightPercentage);
          const dominantLabel = dominantSide === 'left' ? dim.leftLabel : dim.rightLabel;
          
          // Calculate the correct position of the center indicator
          // If left side is dominant (>50%), indicator should be positioned towards left
          // If right side is dominant (>50%), indicator should be positioned towards right
          const indicatorPosition = leftPercentage;
          
          return (
            <div key={index} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{dim.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {dim.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dominantPercentage}% {dominantLabel}
                  </p>
                </div>
              </div>
              
              {/* Labels with percentages */}
              <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                <div className="flex items-center gap-2">
                  <span>{dim.leftLabel}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {leftPercentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {rightPercentage}%
                  </span>
                  <span>{dim.rightLabel}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  {/* Left side bar - fills from left based on left percentage */}
                  <div 
                    className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
                    style={{ 
                      background: `linear-gradient(90deg, ${dim.color} 0%, ${dim.color}dd 100%)`,
                      width: `${leftPercentage}%`,
                      borderRadius: leftPercentage > 50 ? '9999px' : '9999px 0 0 9999px'
                    }}
                  />
                  {/* Right side bar - fills from right based on right percentage */}
                  <div 
                    className="absolute right-0 top-0 h-full transition-all duration-700 ease-out"
                    style={{ 
                      background: `linear-gradient(270deg, ${dim.color} 0%, ${dim.color}dd 100%)`,
                      width: `${rightPercentage}%`,
                      borderRadius: rightPercentage > 50 ? '9999px' : '0 9999px 9999px 0'
                    }}
                  />
                </div>
                
                {/* Center indicator - positioned correctly based on dominant side */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-out"
                  style={{ 
                    left: `${indicatorPosition}%`, 
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                >
                  <div className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-md flex items-center justify-center">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: dominantSide === 'left' ? dim.color : dim.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Percentage indicators */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Test date and metadata */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📅</span>
            <span>Assessment completed: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          <button className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
            View Detailed Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MBTIBarChart;
