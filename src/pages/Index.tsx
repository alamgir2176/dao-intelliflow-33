import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { ProposalCard } from "@/components/ProposalCard";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Users, Brain } from "lucide-react";
import { AlithConfigPanel } from "@/components/AlithConfig";
import heroImage from "@/assets/dao-hero.jpg";

// Mock data for proposals
const mockProposals = [
  {
    id: '1',
    title: 'Increase Community Treasury Allocation',
    description: 'Proposal to allocate 15% more funding to community development initiatives and developer grants.',
    status: 'active' as const,
    votesFor: 1247,
    votesAgainst: 423,
    totalVotes: 1670,
    endDate: '2024-08-15',
    aiScore: 87
  },
  {
    id: '2',
    title: 'Protocol Upgrade v2.1.0',
    description: 'Major protocol upgrade including gas optimization and new governance features.',
    status: 'active' as const,
    votesFor: 892,
    votesAgainst: 156,
    totalVotes: 1048,
    endDate: '2024-08-20',
    aiScore: 94
  },
  {
    id: '3',
    title: 'Partnership with DeFi Protocol',
    description: 'Strategic partnership proposal to integrate with leading DeFi lending protocol.',
    status: 'passed' as const,
    votesFor: 2156,
    votesAgainst: 344,
    totalVotes: 2500,
    endDate: '2024-08-01',
    aiScore: 91
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'proposals':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Proposals</h2>
                <p className="text-muted-foreground">Vote on governance proposals and shape the future</p>
              </div>
              <Button variant="gradient" size="lg">
                Create Proposal
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProposals.map((proposal) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </div>
        );
      
      case 'create':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Create New Proposal</h2>
              <p className="text-muted-foreground">Submit your governance proposal to the community</p>
            </div>
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input 
                    className="w-full mt-1 p-3 rounded-lg border border-border bg-background text-foreground"
                    placeholder="Enter proposal title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea 
                    className="w-full mt-1 p-3 rounded-lg border border-border bg-background text-foreground h-32"
                    placeholder="Describe your proposal in detail..."
                  />
                </div>
                <Button variant="gradient" size="lg" className="w-full">
                  Submit Proposal
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'ai-insights':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">AI-Powered Insights</h2>
              <p className="text-muted-foreground">Advanced analytics and predictions for governance decisions</p>
            </div>
            <AlithConfigPanel />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success mb-2">+73%</div>
                  <p className="text-sm text-muted-foreground">Community sentiment trending positive</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Prediction Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">94.2%</div>
                  <p className="text-sm text-muted-foreground">Accuracy on proposal outcomes</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50 backdrop-blur-glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Engagement Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning mb-2">8.7/10</div>
                  <p className="text-sm text-muted-foreground">Community participation level</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Hero Section - only show on dashboard */}
      {activeTab === 'dashboard' && (
        <div className="relative overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(230, 35, 7, 0.7), rgba(230, 35, 7, 0.8)), url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Zap className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                The Future of
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  DAO Governance
                </span>
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Harness the power of AI to make smarter governance decisions, 
                automate workflows, and build a more efficient decentralized organization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button variant="gradient" size="xl" className="shadow-glow">
                  Start Governing
                </Button>
                <Button variant="glass" size="xl">
                  View Proposals
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
