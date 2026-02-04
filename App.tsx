import React, { useState } from 'react';
import { Search, Github, AlertTriangle, Loader2 } from 'lucide-react';
import { AnalysisStatus, RepoAnalysis } from './types';
import { fetchRepoContext } from './services/githubService';
import { analyzeRepoWithGemini } from './services/geminiService';
import Dashboard from './components/Dashboard';

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('github.com')) {
      setErrorMsg('Please enter a valid GitHub repository URL');
      return;
    }

    setStatus(AnalysisStatus.FETCHING);
    setErrorMsg('');
    setAnalysis(null);

    try {
      // 1. Fetch Data
      const repoData = await fetchRepoContext(url);
      
      // 2. Analyze with Gemini
      setStatus(AnalysisStatus.ANALYZING);
      const result = await analyzeRepoWithGemini(repoData);
      
      setAnalysis(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(AnalysisStatus.ERROR);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred during analysis.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Extension-like Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 no-print">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">GitGuard AI</h1>
              <p className="text-xs text-gray-500">Risk Assessment Tool</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">
            v1.0.0 • Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Section - Hide when printing */}
        <div className="mb-8 no-print">
          <form onSubmit={handleScan} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Github className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-32 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-lg placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={status === AnalysisStatus.FETCHING || status === AnalysisStatus.ANALYZING}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(status === AnalysisStatus.FETCHING || status === AnalysisStatus.ANALYZING) ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Scanning</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Scan</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-3 flex gap-4 text-xs text-gray-500 justify-center">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Security Check</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>License Scan</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Maintenance History</span>
          </div>
        </div>

        {/* Status Indicators */}
        {status === AnalysisStatus.FETCHING && (
          <LoadingState text="Fetching repository metadata..." subtext="Analyzing README, package.json and structure" />
        )}
        {status === AnalysisStatus.ANALYZING && (
          <LoadingState text="Gemini AI is analyzing risks..." subtext="Evaluating code patterns, dependencies and license compliance" />
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center animate-fade-in">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
            <h3 className="text-lg font-bold text-red-400 mb-1">Analysis Failed</h3>
            <p className="text-red-200/70">{errorMsg}</p>
            <button 
              onClick={() => setStatus(AnalysisStatus.IDLE)}
              className="mt-4 text-sm text-red-400 hover:text-red-300 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Dashboard */}
        {status === AnalysisStatus.SUCCESS && analysis && (
          <Dashboard data={analysis} repoUrl={url} />
        )}

        {/* Empty State / Welcome */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center py-12 opacity-50">
             <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
               <Search size={32} />
             </div>
             <p className="text-lg">Enter a GitHub repository URL to start the risk assessment.</p>
          </div>
        )}
      </main>
    </div>
  );
}

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LoadingState: React.FC<{text: string; subtext: string}> = ({text, subtext}) => (
  <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
      <div className="relative bg-gray-800 p-4 rounded-full border border-gray-700">
        <Loader2 className="animate-spin text-blue-400" size={32} />
      </div>
    </div>
    <h3 className="text-xl font-medium text-white mb-2">{text}</h3>
    <p className="text-gray-400 text-sm max-w-xs text-center">{subtext}</p>
  </div>
);