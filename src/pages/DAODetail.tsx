import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { ProposalCard } from '@/components/ProposalCard';
import { CreateProposalForm } from '@/components/CreateProposalForm';
import { AIGovernanceInsights } from '@/components/AIGovernanceInsights';
import { 
  Users, 
  Vote, 
  Brain, 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar,
  ArrowLeft,
  Activity,
  BarChart3
} from 'lucide-react';
import { alithService } from '@/services/alith';

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

// Mock proposals for the DAO
const mockDAOProposals = [
  {
    id: '1',
    title: 'Increase Development Fund Allocation',
    description: 'Proposal to allocate 20% more funding to development initiatives and bug bounties.',
    status: 'active' as const,
    votesFor: 342,
    votesAgainst: 87,
    totalVotes: 429,
    endDate: '2024-08-20',
    aiScore: 92
  },
  {
    id: '2',
    title: 'Community Grant Program Launch',
    description: 'Establish a $50,000 quarterly grant program for community projects and educational content.',
    status: 'active' as const,
    votesFor: 256,
    votesAgainst: 54,
    totalVotes: 310,
    endDate: '2024-08-25',
    aiScore: 88
  }
];

const DAODetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dao, setDAO] = useState<DAO | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateProposal, setShowCreateProposal] = useState(false);

  useEffect(() => {
    // Load DAO from localStorage
    const storedDAOs = JSON.parse(localStorage.getItem('user-daos') || '[]');
    const foundDAO = storedDAOs.find((d: DAO) => d.id === id);
    if (foundDAO) {
      setDAO(foundDAO);
    } else {
      navigate('/my-daos');
    }
  }, [id, navigate]);

  if (!dao) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">DAO not found</h2>
            <Button onClick={() => navigate('/my-daos')} className="mt-4">
              Back to My DAOs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getAIFeaturesCount = () => {
    if (!dao.enableAI) return 0;
    return Object.values(dao.aiGovernanceFeatures).filter(Boolean).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/my-daos')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My DAOs
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{dao.name}</h1>
                {dao.enableAI && (
                  <Badge className="bg-primary/20 text-primary">
                    <Brain className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{dao.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="gradient" 
                onClick={() => setShowCreateProposal(true)}
                className="shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card/50 backdrop-blur-glass">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{dao.memberCount}</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card/50 backdrop-blur-glass">
            <CardContent className="p-6 text-center">
              <Vote className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{dao.proposalCount}</div>
              <div className="text-sm text-muted-foreground">Proposals</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card/50 backdrop-blur-glass">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{dao.quorum}%</div>
              <div className="text-sm text-muted-foreground">Quorum</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card/50 backdrop-blur-glass">
            <CardContent className="p-6 text-center">
              <Brain className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{getAIFeaturesCount()}</div>
              <div className="text-sm text-muted-foreground">AI Features</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Governance Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participation Rate</span>
                      <span className="text-foreground">73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proposal Success Rate</span>
                      <span className="text-foreground">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Community Engagement</span>
                      <span className="text-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">New proposal created</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">Vote cast by 23 members</span>
                      <span className="text-xs text-muted-foreground">4 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">AI analysis completed</span>
                      <span className="text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Active Proposals</h3>
                <p className="text-muted-foreground">Participate in governance decisions</p>
              </div>
              <Button 
                variant="gradient" 
                onClick={() => setShowCreateProposal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockDAOProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6 mt-6">
            {dao.enableAI ? (
              <AIGovernanceInsights dao={dao} />
            ) : (
              <Card className="border-border bg-card/50 backdrop-blur-glass text-center py-12">
                <CardContent>
                  <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    AI Features Disabled
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Enable AI features in settings to access advanced governance insights
                  </p>
                  <Button 
                    variant="gradient" 
                    onClick={() => setActiveTab('settings')}
                  >
                    Configure AI Features
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle>DAO Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Voting Period</label>
                    <div className="text-lg font-semibold text-primary">{dao.votingPeriod} days</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Quorum</label>
                    <div className="text-lg font-semibold text-primary">{dao.quorum}%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Proposal Threshold</label>
                    <div className="text-lg font-semibold text-primary">{dao.proposalThreshold}</div>
                  </div>
                </div>
                
                {dao.enableAI && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-3">AI Features Status</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(dao.aiGovernanceFeatures).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-foreground">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <Badge className={enabled ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                            {enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Proposal Modal */}
      {showCreateProposal && (
        <CreateProposalForm 
          daoId={dao.id}
          onClose={() => setShowCreateProposal(false)}
          onSubmit={(proposal) => {
            console.log('New proposal:', proposal);
            setShowCreateProposal(false);
          }}
        />
      )}
    </div>
  );
};

export default DAODetail;