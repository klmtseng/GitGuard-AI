export interface RepoAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  security: {
    score: number;
    issues: string[];
    details: string;
  };
  maintenance: {
    score: number;
    lastUpdateStatus: string;
    communityHealth: string;
  };
  quality: {
    score: number;
    complexity: string;
    documentation: string;
  };
  license: {
    name: string;
    compliant: boolean;
    type: string;
  };
}

export interface FetchedRepoData {
  owner: string;
  name: string;
  readme: string | null;
  packageJson: string | null;
  requirements: string | null;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}