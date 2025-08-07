import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/enhanced-button";
import { Calendar, Users, TrendingUp } from "lucide-react";
import { AIProposalAnalysis } from "./AIProposalAnalysis";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  aiScore?: number;
}

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary';
      case 'passed': return 'bg-success';
      case 'failed': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const supportPercentage = proposal.totalVotes > 0 
    ? (proposal.votesFor / proposal.totalVotes) * 100 
    : 0;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-glass hover:bg-card/70 transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-smooth">
            {proposal.title}
          </CardTitle>
          <Badge className={`${getStatusColor(proposal.status)} text-white`}>
            {proposal.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {proposal.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voting Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-success">For: {proposal.votesFor}</span>
            <span className="text-destructive">Against: {proposal.votesAgainst}</span>
          </div>
          <Progress value={supportPercentage} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {supportPercentage.toFixed(1)}% support
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {proposal.totalVotes} votes
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Ends {new Date(proposal.endDate).toLocaleDateString()}
          </div>
          {proposal.aiScore && (
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="h-3 w-3" />
              AI Score: {proposal.aiScore}%
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="ai" size="sm" className="flex-1">
            Vote For
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Vote Against
          </Button>
        </div>
      </CardContent>
      
      <div className="px-6 pb-6">
        <AIProposalAnalysis proposal={{
          id: proposal.id,
          title: proposal.title,
          description: proposal.description,
          votes: {
            for: proposal.votesFor,
            against: proposal.votesAgainst,
            abstain: 0
          }
        }} />
      </div>
    </Card>
  );
};