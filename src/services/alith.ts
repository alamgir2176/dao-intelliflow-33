// AI-powered DAO governance service using direct API calls
// Note: This is a frontend-only integration using localStorage for API keys

// Configuration interface for API keys
export interface AlithConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  lazaiApiKey?: string;
}

// Store configuration in localStorage
export const saveAlithConfig = (config: AlithConfig): void => {
  localStorage.setItem('alith-config', JSON.stringify(config));
};

// Retrieve configuration from localStorage
export const getAlithConfig = (): AlithConfig => {
  const stored = localStorage.getItem('alith-config');
  return stored ? JSON.parse(stored) : {};
};

// Clear configuration
export const clearAlithConfig = (): void => {
  localStorage.removeItem('alith-config');
};

// AI Agent Interface
interface AIAgent {
  prompt(message: string): Promise<string>;
}

// Simple AI Agent implementation using direct API calls
class GovernanceAgent implements AIAgent {
  private apiKey: string;
  private provider: 'openai' | 'anthropic' | 'lazai';

  constructor(apiKey: string, provider: 'openai' | 'anthropic' | 'lazai') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async prompt(message: string): Promise<string> {
    try {
      switch (this.provider) {
        case 'openai':
          return await this.callOpenAI(message);
        case 'anthropic':
          return await this.callAnthropic(message);
        case 'lazai':
          return await this.callLazAI(message);
        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      console.error('AI API call failed:', error);
      return 'AI service temporarily unavailable';
    }
  }

  private async callOpenAI(message: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI advisor for DAO governance and decision-making. Your role is to:
            
            1. Analyze proposals for potential risks, benefits, and community impact
            2. Provide sentiment analysis on community discussions
            3. Suggest optimal voting strategies based on historical data
            4. Identify patterns in governance participation
            5. Recommend improvements to proposal quality
            6. Monitor governance health metrics
            
            Always provide data-driven insights and remain neutral in your analysis.
            Focus on the technical, financial, and community aspects of governance decisions.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received';
  }

  private async callAnthropic(message: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are an AI advisor for DAO governance. ${message}`
          }
        ]
      }),
    });

    const data = await response.json();
    return data.content?.[0]?.text || 'No response received';
  }

  private async callLazAI(message: string): Promise<string> {
    // Placeholder for LazAI API integration
    // This would need the actual LazAI API endpoint and format
    return `LazAI Analysis: ${message.slice(0, 100)}... (Integration pending)`;
  }
}

// Alith Service Class
export class AlithService {
  private config: AlithConfig;
  
  constructor(config?: AlithConfig) {
    this.config = config || getAlithConfig();
  }

  // Update configuration
  updateConfig(config: AlithConfig): void {
    this.config = { ...this.config, ...config };
    saveAlithConfig(this.config);
  }

  // Check if AI is configured
  isConfigured(): boolean {
    return !!(this.config.openaiApiKey || this.config.anthropicApiKey || this.config.lazaiApiKey);
  }

  // Create AI agent for DAO governance insights
  async createGovernanceAgent(): Promise<AIAgent | null> {
    try {
      if (!this.isConfigured()) {
        throw new Error('No API keys configured');
      }

      // Create agent based on available API key
      if (this.config.openaiApiKey) {
        return new GovernanceAgent(this.config.openaiApiKey, 'openai');
      } else if (this.config.anthropicApiKey) {
        return new GovernanceAgent(this.config.anthropicApiKey, 'anthropic');
      } else if (this.config.lazaiApiKey) {
        return new GovernanceAgent(this.config.lazaiApiKey, 'lazai');
      }

      return null;
    } catch (error) {
      console.error('Failed to create governance agent:', error);
      return null;
    }
  }

  // Analyze a proposal using AI
  async analyzeProposal(proposal: {
    title: string;
    description: string;
    votes: { for: number; against: number; abstain: number };
  }): Promise<{
    riskScore: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    recommendations: string[];
    predictedOutcome: string;
  } | null> {
    try {
      const agent = await this.createGovernanceAgent();
      if (!agent) return null;

      const prompt = `
        Analyze this DAO proposal:
        
        Title: ${proposal.title}
        Description: ${proposal.description}
        Current Votes: ${proposal.votes.for} for, ${proposal.votes.against} against, ${proposal.votes.abstain} abstain
        
        Provide analysis in JSON format:
        {
          "riskScore": number (0-100),
          "sentiment": "positive|negative|neutral",
          "recommendations": ["recommendation1", "recommendation2"],
          "predictedOutcome": "likely outcome description"
        }
      `;

      const response = await agent.prompt(prompt);
      
      try {
        return JSON.parse(response);
      } catch {
        // Fallback if AI doesn't return proper JSON
        return {
          riskScore: 50,
          sentiment: 'neutral' as const,
          recommendations: ['AI analysis unavailable - using default values'],
          predictedOutcome: 'Outcome uncertain - requires human analysis'
        };
      }
    } catch (error) {
      console.error('Proposal analysis failed:', error);
      return null;
    }
  }

  // Generate governance insights
  async generateInsights(governanceData: {
    totalProposals: number;
    activeProposals: number;
    participationRate: number;
    averageVotingPower: number;
  }): Promise<{
    healthScore: number;
    insights: string[];
    recommendations: string[];
  } | null> {
    try {
      const agent = await this.createGovernanceAgent();
      if (!agent) return null;

      const prompt = `
        Analyze this DAO governance data:
        
        Total Proposals: ${governanceData.totalProposals}
        Active Proposals: ${governanceData.activeProposals}
        Participation Rate: ${governanceData.participationRate}%
        Average Voting Power: ${governanceData.averageVotingPower}
        
        Provide governance health analysis in JSON format:
        {
          "healthScore": number (0-100),
          "insights": ["insight1", "insight2", "insight3"],
          "recommendations": ["recommendation1", "recommendation2"]
        }
      `;

      const response = await agent.prompt(prompt);
      
      try {
        return JSON.parse(response);
      } catch {
        // Fallback analysis
        return {
          healthScore: Math.min(governanceData.participationRate * 2, 100),
          insights: [
            `${governanceData.activeProposals} proposals currently active`,
            `Participation rate: ${governanceData.participationRate}%`,
            'AI analysis service temporarily unavailable'
          ],
          recommendations: [
            'Increase community engagement initiatives',
            'Simplify proposal submission process'
          ]
        };
      }
    } catch (error) {
      console.error('Insights generation failed:', error);
      return null;
    }
  }

  // Automated workflow: Smart proposal suggestions
  async suggestProposalImprovements(proposalDraft: string): Promise<string[]> {
    try {
      const agent = await this.createGovernanceAgent();
      if (!agent) return ['AI service unavailable - please review manually'];

      const prompt = `
        Review this DAO proposal draft and suggest improvements:
        
        "${proposalDraft}"
        
        Provide 3-5 specific suggestions to improve clarity, feasibility, and community appeal.
        Return as a simple array of strings.
      `;

      const response = await agent.prompt(prompt);
      
      // Try to parse as JSON array, fallback to split by lines
      try {
        return JSON.parse(response);
      } catch {
        return response.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Proposal suggestions failed:', error);
      return ['Error generating suggestions - please review manually'];
    }
  }
}

// Export singleton instance
export const alithService = new AlithService();