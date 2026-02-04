import React from 'react';

interface AnalysisCardProps {
  title: string;
  score: number; // 0-100, where 100 is GOOD/SECURE
  details: React.ReactNode;
  icon: React.ReactNode;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, score, details, icon }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 print-break-inside">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-700 rounded-lg text-gray-300">
            {icon}
          </div>
          <h3 className="font-semibold text-gray-200">{title}</h3>
        </div>
        <div className={`font-mono text-xl font-bold ${getScoreColor(score)}`}>
          {score}/100
        </div>
      </div>
      <div className="text-sm text-gray-400 space-y-2">
        {details}
      </div>
    </div>
  );
};

export default AnalysisCard;