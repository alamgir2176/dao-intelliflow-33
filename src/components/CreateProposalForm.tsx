import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, FileText, Lightbulb, X, Loader2 } from 'lucide-react';
import { alithService } from '@/services/alith';
import { toast } from '@/hooks/use-toast';

interface CreateProposalFormProps {
  daoId: string;
  onClose: () => void;
  onSubmit: (proposal: any) => void;
}

interface ProposalData {
  title: string;
  description: string;
  type: 'funding' | 'governance' | 'technical' | 'community';
  requestAmount?: string;
  duration?: string;
}

export const CreateProposalForm: React.FC<CreateProposalFormProps> = ({
  daoId,
  onClose,
  onSubmit
}) => {
  const [proposal, setProposal] = useState<ProposalData>({
    title: '',
    description: '',
    type: 'community'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAIAnalysis = async () => {
    if (!proposal.title || !proposal.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and description for AI analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!alithService.isConfigured()) {
      toast({
        title: "AI Not Configured",
        description: "Please configure AI settings to use proposal analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const suggestions = await alithService.suggestProposalImprovements(
        `Title: ${proposal.title}\nDescription: ${proposal.description}\nType: ${proposal.type}`
      );
      
      setAiSuggestions(suggestions);
      
      toast({
        title: "AI Analysis Complete",
        description: "Review the suggestions to improve your proposal.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!proposal.title || !proposal.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate proposal submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProposal = {
        id: Date.now().toString(),
        ...proposal,
        status: 'active',
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        daoId
      };
      
      onSubmit(newProposal);
      
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted for voting.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const proposalTypes = [
    { value: 'funding', label: 'Funding Request', description: 'Request funds for a project or initiative' },
    { value: 'governance', label: 'Governance Change', description: 'Modify DAO rules or parameters' },
    { value: 'technical', label: 'Technical Upgrade', description: 'Protocol or platform improvements' },
    { value: 'community', label: 'Community Initiative', description: 'Community-focused proposals' }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Create New Proposal
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={proposal.title}
                    onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                    placeholder="Enter a clear, descriptive title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Proposal Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {proposalTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setProposal({ ...proposal, type: type.value as any })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          proposal.type === type.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={proposal.description}
                    onChange={(e) => setProposal({ ...proposal, description: e.target.value })}
                    placeholder="Provide a detailed description of your proposal..."
                    rows={6}
                  />
                </div>

                {/* Additional fields based on type */}
                {proposal.type === 'funding' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Requested Amount</Label>
                      <Input
                        id="amount"
                        value={proposal.requestAmount || ''}
                        onChange={(e) => setProposal({ ...proposal, requestAmount: e.target.value })}
                        placeholder="e.g., 10,000 USDC"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Project Duration</Label>
                      <Input
                        id="duration"
                        value={proposal.duration || ''}
                        onChange={(e) => setProposal({ ...proposal, duration: e.target.value })}
                        placeholder="e.g., 3 months"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Analysis
                  <Badge className="bg-primary/20 text-primary">Powered by Alith</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || !alithService.isConfigured()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Proposal...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">AI Suggestions:</h4>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <Lightbulb className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm text-foreground">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {proposal.title || 'Proposal Title'}
                  </h3>
                  <Badge className="mt-2 capitalize">
                    {proposal.type.replace(/([A-Z])/g, ' $1')}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    {proposal.description || 'Proposal description will appear here...'}
                  </p>
                </div>

                {proposal.type === 'funding' && (proposal.requestAmount || proposal.duration) && (
                  <div className="pt-3 border-t border-border space-y-2">
                    {proposal.requestAmount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="text-foreground">{proposal.requestAmount}</span>
                      </div>
                    )}
                    {proposal.duration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="text-foreground">{proposal.duration}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full shadow-glow"
                onClick={handleSubmit}
                disabled={isSubmitting || !proposal.title || !proposal.description}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Proposal...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};