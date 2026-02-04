import React from 'react';
import { RepoAnalysis } from '../types';
import ScoreGauge from './ScoreGauge';
import AnalysisCard from './AnalysisCard';
import { ShieldCheck, Wrench, FileCode, Scale } from 'lucide-react';

interface DashboardProps {
  data: RepoAnalysis;
  repoUrl: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, repoUrl }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
             <ScoreGauge score={data.riskScore} />
             <div className="text-center mt-2">
               <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider 
                 ${data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH' ? 'bg-red-900/50 text-red-200 border border-red-700' : 
                   data.riskLevel === 'MEDIUM' ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700' : 
                   'bg-green-900/50 text-green-200 border border-green-700'}`}>
                 {data.riskLevel} RISK
               </span>
             </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2 truncate" title={repoUrl}>
              {repoUrl.replace('https://github.com/', '')}
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {data.summary}
            </p>
            <button 
              onClick={handlePrint}
              className="no-print px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
              Export PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalysisCard 
          title="Security Audit" 
          score={data.security.score}
          icon={<ShieldCheck size={20} />}
          details={
            <>
              <p className="mb-2">{data.security.details}</p>
              {data.security.issues.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-red-300/80 text-xs">
                  {data.security.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              )}
            </>
          }
        />
        
        <AnalysisCard 
          title="Maintenance Health" 
          score={data.maintenance.score}
          icon={<Wrench size={20} />}
          details={
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Update Status:</span>
                <span className="text-gray-200">{data.maintenance.lastUpdateStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Community:</span>
                <span className="text-gray-200">{data.maintenance.communityHealth}</span>
              </div>
            </div>
          }
        />

        <AnalysisCard 
          title="Code Quality" 
          score={data.quality.score}
          icon={<FileCode size={20} />}
          details={
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Complexity:</span>
                <span className="text-gray-200">{data.quality.complexity}</span>
              </div>
              <div className="flex justify-between">
                <span>Docs Quality:</span>
                <span className="text-gray-200">{data.quality.documentation}</span>
              </div>
            </div>
          }
        />

        <AnalysisCard 
          title="Licensing" 
          score={data.license.compliant ? 100 : 0}
          icon={<Scale size={20} />}
          details={
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>License:</span>
                <span className="font-mono text-blue-300">{data.license.name || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="text-gray-200">{data.license.type}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700/50 text-xs">
                {data.license.compliant 
                  ? <span className="text-green-400 flex items-center gap-1">✓ Likely Commercial Friendly</span>
                  : <span className="text-red-400 flex items-center gap-1">⚠ Check Usage Rights</span>
                }
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;