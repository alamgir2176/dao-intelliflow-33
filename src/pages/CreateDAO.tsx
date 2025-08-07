import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Vote, Settings, ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { alithService } from '@/services/alith';
import { toast } from '@/hooks/use-toast';

interface DAOConfig {
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
}

const CreateDAO = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<DAOConfig>({
    name: '',
    description: '',
    votingPeriod: 7,
    quorum: 50,
    proposalThreshold: 1,
    enableAI: true,
    aiGovernanceFeatures: {
      proposalAnalysis: true,
      sentimentTracking: true,
      participationIncentives: false,
      riskAssessment: true,
    }
  });
  
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDAO = async () => {
    if (!config.name || !config.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // Use Alith SDK to analyze DAO configuration
      if (config.enableAI && alithService.isConfigured()) {
        const suggestions = await alithService.suggestProposalImprovements(
          `DAO Configuration: ${config.name} - ${config.description}. Voting period: ${config.votingPeriod} days, Quorum: ${config.quorum}%, Proposal threshold: ${config.proposalThreshold} tokens.`
        );
        
        console.log('AI suggestions for DAO config:', suggestions);
      }

      // Simulate DAO creation (in real implementation, this would interact with smart contracts)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store DAO in localStorage for demo purposes
      const newDAO = {
        id: Date.now().toString(),
        ...config,
        createdAt: new Date().toISOString(),
        proposalCount: 0,
        memberCount: 1,
      };
      
      const existingDAOs = JSON.parse(localStorage.getItem('user-daos') || '[]');
      localStorage.setItem('user-daos', JSON.stringify([...existingDAOs, newDAO]));
      
      toast({
        title: "DAO Created Successfully!",
        description: `${config.name} has been created with AI-powered governance features.`,
      });
      
      navigate('/my-daos');
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create DAO. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create New DAO</h1>
            <p className="text-muted-foreground">
              Launch your decentralized autonomous organization with AI-powered governance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">DAO Name *</Label>
                  <Input
                    id="name"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    placeholder="e.g., DeFi Innovation DAO"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    placeholder="Describe your DAO's mission and goals..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5 text-primary" />
                  Governance Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="votingPeriod">Voting Period (days)</Label>
                    <Input
                      id="votingPeriod"
                      type="number"
                      value={config.votingPeriod}
                      onChange={(e) => setConfig({ ...config, votingPeriod: parseInt(e.target.value) })}
                      min="1"
                      max="30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quorum">Quorum (%)</Label>
                    <Input
                      id="quorum"
                      type="number"
                      value={config.quorum}
                      onChange={(e) => setConfig({ ...config, quorum: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Proposal Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={config.proposalThreshold}
                      onChange={(e) => setConfig({ ...config, proposalThreshold: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Governance Features
                  <Badge className="bg-primary/20 text-primary">Powered by Alith</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAI">Enable AI Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Activate AI-powered governance assistance
                    </p>
                  </div>
                  <Switch
                    id="enableAI"
                    checked={config.enableAI}
                    onCheckedChange={(checked) => setConfig({ ...config, enableAI: checked })}
                  />
                </div>
                
                {config.enableAI && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-medium">AI Features Selection</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="proposalAnalysis">Proposal Analysis</Label>
                            <p className="text-xs text-muted-foreground">
                              AI-powered risk assessment and sentiment analysis
                            </p>
                          </div>
                          <Switch
                            id="proposalAnalysis"
                            checked={config.aiGovernanceFeatures.proposalAnalysis}
                            onCheckedChange={(checked) => 
                              setConfig({
                                ...config,
                                aiGovernanceFeatures: { 
                                  ...config.aiGovernanceFeatures, 
                                  proposalAnalysis: checked 
                                }
                              })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sentimentTracking">Sentiment Tracking</Label>
                            <p className="text-xs text-muted-foreground">
                              Monitor community sentiment in real-time
                            </p>
                          </div>
                          <Switch
                            id="sentimentTracking"
                            checked={config.aiGovernanceFeatures.sentimentTracking}
                            onCheckedChange={(checked) => 
                              setConfig({
                                ...config,
                                aiGovernanceFeatures: { 
                                  ...config.aiGovernanceFeatures, 
                                  sentimentTracking: checked 
                                }
                              })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="riskAssessment">Risk Assessment</Label>
                            <p className="text-xs text-muted-foreground">
                              Automated risk scoring for proposals
                            </p>
                          </div>
                          <Switch
                            id="riskAssessment"
                            checked={config.aiGovernanceFeatures.riskAssessment}
                            onCheckedChange={(checked) => 
                              setConfig({
                                ...config,
                                aiGovernanceFeatures: { 
                                  ...config.aiGovernanceFeatures, 
                                  riskAssessment: checked 
                                }
                              })
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="participationIncentives">Participation Incentives</Label>
                            <p className="text-xs text-muted-foreground">
                              AI-driven engagement recommendations
                            </p>
                          </div>
                          <Switch
                            id="participationIncentives"
                            checked={config.aiGovernanceFeatures.participationIncentives}
                            onCheckedChange={(checked) => 
                              setConfig({
                                ...config,
                                aiGovernanceFeatures: { 
                                  ...config.aiGovernanceFeatures, 
                                  participationIncentives: checked 
                                }
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="border-border bg-card/50 backdrop-blur-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  DAO Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {config.name || 'Your DAO Name'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.description || 'Your DAO description will appear here...'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voting Period:</span>
                    <span className="text-foreground">{config.votingPeriod} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quorum:</span>
                    <span className="text-foreground">{config.quorum}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Proposal Threshold:</span>
                    <span className="text-foreground">{config.proposalThreshold}</span>
                  </div>
                </div>
                
                {config.enableAI && (
                  <>
                    <Separator />
                    <div>
                      <Badge className="bg-primary/20 text-primary mb-2">
                        <Brain className="h-3 w-3 mr-1" />
                        AI-Powered
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {Object.values(config.aiGovernanceFeatures).filter(Boolean).length} AI features enabled
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="gradient" 
              size="lg" 
              className="w-full shadow-glow"
              onClick={handleCreateDAO}
              disabled={isCreating || !config.name || !config.description}
            >
              {isCreating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Creating DAO...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Create DAO
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDAO;