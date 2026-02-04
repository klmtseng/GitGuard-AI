import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  // Score is risk score (0-100), where 100 is Bad.
  // We want to display "Safety Score" perhaps, or just Risk.
  // Let's visualize RISK. 0 = Green, 100 = Red.
  
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safety', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s < 20) return '#10B981'; // Green
    if (s < 50) return '#FBBF24'; // Yellow
    if (s < 80) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const riskColor = getColor(score);
  const emptyColor = '#374151'; // Gray-700

  return (
    <div className="relative w-48 h-24 mx-auto mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-0" fill={riskColor} />
            <Cell key="cell-1" fill={emptyColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center transform translate-y-1">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Risk Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;