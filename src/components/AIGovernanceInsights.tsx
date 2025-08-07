import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { alithService } from '@/services/alith';

interface DAO {
  id: string;
  name: string;
  memberCount: number;
  proposalCount: number;
  aiGovernanceFeatures: {
    proposalAnalysis: boolean;
    sentimentTracking: boolean;
    participationIncentives: boolean;
    riskAssessment: boolean;
  };
}

interface GovernanceInsights {
  healthScore: number;
  insights: string[];
  recommendations: string[];
}

interface AIGovernanceInsightsProps {
  dao: DAO;
}

export const AIGovernanceInsights: React.FC<AIGovernanceInsightsProps> = ({ dao }) => {
  const [insights, setInsights] = useState<GovernanceInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    if (!alithService.isConfigured()) {
      setError('AI service not configured. Please add API keys in settings.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock governance data for demonstration
      const governanceData = {
        totalProposals: dao.proposalCount,
        activeProposals: Math.floor(dao.proposalCount * 0.3),
        participationRate: Math.min(dao.memberCount * 2, 95), // Mock participation
        averageVotingPower: 100 / dao.memberCount
      };

      const result = await alithService.generateInsights(governanceData);
      if (result) {
        setInsights(result);
      } else {
        setError('Failed to generate insights. Please try again.');
      }
    } catch (err) {
      setError('AI analysis failed. Please check your configuration.');
      console.error('AI insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate insights when component loads
    if (dao.aiGovernanceFeatures.sentimentTracking) {
      generateInsights();
    }
  }, [dao]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-success' };
    if (score >= 60) return { label: 'Good', color: 'bg-warning' };
    return { label: 'Needs Attention', color: 'bg-destructive' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-foreground">AI Governance Insights</h3>
          <p className="text-muted-foreground">AI-powered analysis of your DAO's health and performance</p>
        </div>
        <Button 
          variant="outline" 
          onClick={generateInsights}
          disabled={loading || !alithService.isConfigured()}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert className="border-red-500/20 bg-red-500/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-border bg-card/50 backdrop-blur-glass">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing governance patterns...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Insights */}
      {insights && !loading && (
        <>
          {/* Health Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getHealthScoreColor(insights.healthScore)}`}>
                  {insights.healthScore}/100
                </div>
                <Badge className={`${getHealthScoreBadge(insights.healthScore).color} text-white mb-4`}>
                  {getHealthScoreBadge(insights.healthScore).label}
                </Badge>
                <Progress value={insights.healthScore} className="h-3" />
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-success mb-2">+12%</div>
                <p className="text-sm text-muted-foreground mb-4">Participation increase</p>
                <Badge className="bg-success/20 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending Up
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">8.7/10</div>
                <p className="text-sm text-muted-foreground mb-4">Community activity</p>
                <Badge className="bg-primary/20 text-primary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature-Specific Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dao.aiGovernanceFeatures.proposalAnalysis && (
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardContent className="p-6 text-center">
                  <Brain className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Proposal Analysis</h4>
                  <div className="text-2xl font-bold text-primary mb-1">94%</div>
                  <p className="text-xs text-muted-foreground">Accuracy rate</p>
                </CardContent>
              </Card>
            )}

            {dao.aiGovernanceFeatures.sentimentTracking && (
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Sentiment Tracking</h4>
                  <div className="text-2xl font-bold text-success mb-1">+73%</div>
                  <p className="text-xs text-muted-foreground">Positive sentiment</p>
                </CardContent>
              </Card>
            )}

            {dao.aiGovernanceFeatures.riskAssessment && (
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Risk Assessment</h4>
                  <div className="text-2xl font-bold text-warning mb-1">Low</div>
                  <p className="text-xs text-muted-foreground">Risk level</p>
                </CardContent>
              </Card>
            )}

            {dao.aiGovernanceFeatures.participationIncentives && (
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Participation</h4>
                  <div className="text-2xl font-bold text-primary mb-1">+18%</div>
                  <p className="text-xs text-muted-foreground">Increase this month</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};