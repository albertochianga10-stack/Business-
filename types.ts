
export interface FinancialData {
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface InvestmentProject {
  id: string;
  title: string;
  industry: string;
  executiveSummary: string;
  conceptImageUrl?: string;
  audioPitchBase64?: string;
  groundingSources?: GroundingSource[];
  marketAnalysis: {
    overview: string;
    targetAudience: string;
    competitors: string;
  };
  marketingPlan: {
    strategy: string;
    channels: string[];
    positioning: string;
  };
  operationsPlan: string;
  financialProjection: {
    summary: string;
    yearlyData: FinancialData[];
    breakEvenPoint: string;
    roiEstimate: string;
  };
  swotAnalysis: SWOT;
  conclusion: string;
}

export interface ProjectFormData {
  projectName: string;
  industry: string;
  targetMarket: string;
  investmentAmount: string;
  mainGoals: string;
  keyFeatures: string;
}
