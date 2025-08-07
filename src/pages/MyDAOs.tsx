import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { 
  Users, 
  Vote, 
  Brain, 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';

interface DAO {
  id: string;
  name: string;
  description: string;
  votingPeriod: number;
  quorum: number;
  proposalThreshold: number;
  enableAI: boolean;
  aiGovernanceFeatures: {
    proposalAnalysis: boolean;
    sentimentTracking: boolean;
    participationIncentives: boolean;
    riskAssessment: boolean;
  };
  createdAt: string;
  proposalCount: number;
  memberCount: number;
}

const MyDAOs = () => {
  const navigate = useNavigate();
  const [daos, setDAOs] = useState<DAO[]>([]);

  useEffect(() => {
    // Load DAOs from localStorage
    const storedDAOs = JSON.parse(localStorage.getItem('user-daos') || '[]');
    setDAOs(storedDAOs);
  }, []);

  const getAIFeaturesCount = (dao: DAO) => {
    if (!dao.enableAI) return 0;
    return Object.values(dao.aiGovernanceFeatures).filter(Boolean).length;
  };

  const getActivityLevel = (proposalCount: number) => {
    if (proposalCount >= 10) return { level: 'High', color: 'bg-success', percentage: 90 };
    if (proposalCount >= 5) return { level: 'Medium', color: 'bg-warning', percentage: 60 };
    if (proposalCount >= 1) return { level: 'Low', color: 'bg-primary', percentage: 30 };
    return { level: 'New', color: 'bg-muted', percentage: 10 };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My DAOs</h1>
            <p className="text-muted-foreground">
              Manage your decentralized autonomous organizations
            </p>
          </div>
          
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => navigate('/create-dao')}
            className="shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New DAO
          </Button>
        </div>

        {daos.length === 0 ? (
          <Card className="border-border bg-card/50 backdrop-blur-glass text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No DAOs Found
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first DAO to start building your decentralized community
              </p>
              <Button 
                variant="gradient" 
                size="lg"
                onClick={() => navigate('/create-dao')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First DAO
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daos.map((dao) => {
              const activity = getActivityLevel(dao.proposalCount);
              const aiFeatures = getAIFeaturesCount(dao);
              
              return (
                <Card 
                  key={dao.id} 
                  className="border-border bg-card/50 backdrop-blur-glass hover:bg-card/70 transition-smooth group cursor-pointer"
                  onClick={() => navigate(`/dao/${dao.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-smooth">
                          {dao.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {dao.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Badge className={`${activity.color} text-white`}>
                          {activity.level}
                        </Badge>
                        {dao.enableAI && (
                          <Badge className="bg-primary/20 text-primary">
                            <Brain className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {dao.memberCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {dao.proposalCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Proposals</div>
                      </div>
                    </div>

                    {/* Activity Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Activity Level</span>
                        <span className="text-foreground">{activity.level}</span>
                      </div>
                      <Progress value={activity.percentage} className="h-2" />
                    </div>

                    {/* Governance Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Vote className="h-3 w-3" />
                        {dao.votingPeriod}d voting
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {dao.quorum}% quorum
                      </div>
                    </div>

                    {/* AI Features */}
                    {dao.enableAI && (
                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-2">
                          AI Features ({aiFeatures}/4 enabled)
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {dao.aiGovernanceFeatures.proposalAnalysis && (
                            <Badge variant="outline" className="text-xs">Analysis</Badge>
                          )}
                          {dao.aiGovernanceFeatures.sentimentTracking && (
                            <Badge variant="outline" className="text-xs">Sentiment</Badge>
                          )}
                          {dao.aiGovernanceFeatures.riskAssessment && (
                            <Badge variant="outline" className="text-xs">Risk</Badge>
                          )}
                          {dao.aiGovernanceFeatures.participationIncentives && (
                            <Badge variant="outline" className="text-xs">Incentives</Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Created {new Date(dao.createdAt).toLocaleDateString()}
                      </div>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {daos.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardContent className="text-center py-6">
                <Brain className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered governance recommendations
                </p>
                <Button variant="outline" size="sm">
                  View Insights
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardContent className="text-center py-6">
                <Vote className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Active Votes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Participate in ongoing governance decisions
                </p>
                <Button variant="outline" size="sm">
                  View Proposals
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardContent className="text-center py-6">
                <Settings className="h-8 w-8 mx-auto text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Governance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure your DAO settings and parameters
                </p>
                <Button variant="outline" size="sm">
                  Manage Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDAOs;