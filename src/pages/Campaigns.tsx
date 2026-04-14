import { useState } from 'react';
import { 
  Target, 
  Users, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_CAMPAIGNS, MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { POI_SERVICE } from '@/src/services/poiService';
import { Link } from 'react-router-dom';

export default function Campaigns() {
  const { user, profile } = useAuth();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  
  const userScore = profile?.poiScore?.total || MOCK_USER.poiScore.total;

  const handleJoin = async (campaignId: string) => {
    if (!user) return;
    setJoiningId(campaignId);
    try {
      await POI_SERVICE.joinCampaign(user.uid, campaignId);
      // In a real app, we'd update the local state or wait for Firestore sync
    } catch (error) {
      console.error('Join failed:', error);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="pt-4">
        <h1 className="text-2xl font-black tracking-tight">ACTIVE CAMPAIGNS</h1>
        <p className="text-sm text-muted-foreground">Turn your influence into economic rewards.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const isEligible = userScore >= campaign.minPOI;
          const isJoining = joiningId === campaign.id;
          
          return (
            <Card key={campaign.id} className="border border-border bg-card rounded-3xl overflow-hidden group">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-32 h-32 sm:h-auto overflow-hidden relative flex-shrink-0">
                  <img 
                    src={campaign.imageUrl} 
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-black text-foreground leading-tight">{campaign.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
                    </div>
                    <Badge className={cn(
                      "flex-shrink-0",
                      isEligible ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                    )}>
                      {isEligible ? "Eligible" : `Score > ${campaign.minPOI}`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{campaign.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>7d left</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary">
                      <Zap className="w-3 h-3 fill-primary/20" />
                      <span>{campaign.reward}</span>
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      "w-full h-10 gap-2 rounded-xl font-bold text-xs transition-all",
                      isEligible ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                    )}
                    disabled={!isEligible || isJoining || !user}
                    onClick={() => handleJoin(campaign.id)}
                  >
                    {isJoining ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {isEligible ? "Claim Reward" : "Locked"}
                    {!isJoining && isEligible && <ArrowRight className="w-3 h-3" />}
                    {!isJoining && !isEligible && <Lock className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Onboarding CTA */}
      <Link to="/projects">
        <Card className="border border-primary/20 bg-primary/5 p-6 rounded-3xl group cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Launch Your Campaign
              </h2>
              <p className="text-xs text-muted-foreground">Target the most influential users on Base.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5 text-primary" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
