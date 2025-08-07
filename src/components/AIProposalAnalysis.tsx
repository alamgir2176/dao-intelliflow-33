import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { alithService } from '@/services/alith';

interface ProposalData {
  id: string;
  title: string;
  description: string;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
}

interface AIAnalysisResult {
  riskScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  recommendations: string[];
  predictedOutcome: string;
}

interface AIProposalAnalysisProps {
  proposal: ProposalData;
}

export const AIProposalAnalysis: React.FC<AIProposalAnalysisProps> = ({ proposal }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeProposal = async () => {
    if (!alithService.isConfigured()) {
      setError('AI service not configured. Please add API keys in AI Insights tab.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await alithService.analyzeProposal(proposal);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze proposal. Please try again.');
      console.error('AI analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score < 30) return 'default';
    if (score < 70) return 'secondary';
    return 'destructive';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="glass-morphism border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Analysis
          {analysis && (
            <Badge variant={getRiskBadgeColor(analysis.riskScore)}>
              Risk: {analysis.riskScore}/100
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && !loading && (
          <Button 
            onClick={analyzeProposal} 
            className="w-full"
            disabled={!alithService.isConfigured()}
          >
            <Brain className="h-4 w-4 mr-2" />
            Analyze with AI
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Analyzing proposal...</span>
          </div>
        )}

        {error && (
          <Alert className="border-red-500/20 bg-red-500/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {getSentimentIcon(analysis.sentiment)}
              <span className="text-sm font-medium capitalize">
                {analysis.sentiment} Sentiment
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Predicted Outcome</h4>
              <p className="text-sm text-muted-foreground">
                {analysis.predictedOutcome}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">AI Recommendations</h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={analyzeProposal}
              className="w-full"
            >
              Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};