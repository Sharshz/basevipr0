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
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_CAMPAIGNS, MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { POI_SERVICE } from '@/src/services/poiService';
import { Link } from 'react-router-dom';

export default function Campaigns() {
  const { user, profile } = useAuth();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  
  const userScore = profile?.poiScore?.total || MOCK_USER.poiScore.total;
  const impact = profile?.impact || MOCK_USER.impact;

  // Simulate joined campaigns for demo
  const joinedCampaigns = ['c1']; 

  const handleJoin = async (campaignId: string) => {
    if (!user) return;
    setJoiningId(campaignId);
    try {
      await POI_SERVICE.joinCampaign(user.uid, campaignId);
    } catch (error) {
      console.error('Join failed:', error);
    } finally {
      setJoiningId(null);
    }
  };

  const getRequirementValue = (type: string) => {
    switch (type) {
      case 'mints': return impact.mintsDriven;
      case 'volume': return impact.volumeInfluenced;
      case 'referrals': return impact.usersOnboarded;
      case 'actions': return impact.totalActions;
      default: return 0;
    }
  };

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(c => 
    activeTab === 'active' ? c.status === 'active' : c.status === 'completed'
  );

  return (
    <div className="space-y-6 pb-20">
      <header className="pt-4">
        <h1 className="text-2xl font-black tracking-tight uppercase">Campaigns</h1>
        <p className="text-sm text-muted-foreground">Turn your influence into economic rewards.</p>
      </header>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="active" className="rounded-lg font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm">Active</TabsTrigger>
          <TabsTrigger value="past" className="rounded-lg font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No active campaigns at the moment.</div>
            ) : (
              filteredCampaigns.map((campaign) => {
                const isEligible = userScore >= campaign.minPOI;
                const isJoining = joiningId === campaign.id;
                const hasJoined = joinedCampaigns.includes(campaign.id);
                
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
                        {hasJoined && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Badge className="bg-primary text-white border-none">JOINED</Badge>
                          </div>
                        )}
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

                        {/* Progress Section for Joined Campaigns */}
                        {hasJoined && campaign.requirements && (
                          <div className="space-y-3 py-2 border-y border-border/50">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Campaign Progress
                            </p>
                            <div className="space-y-2">
                              {campaign.requirements.map((req, i) => {
                                const current = getRequirementValue(req.type);
                                const progress = Math.min(100, (current / req.target) * 100);
                                const isComplete = current >= req.target;

                                return (
                                  <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[10px] font-bold">
                                      <span className="text-muted-foreground">{req.label}</span>
                                      <span className={cn(isComplete ? "text-green-500" : "text-primary")}>
                                        {req.type === 'volume' ? `${current.toLocaleString()}` : current} / {req.type === 'volume' ? `${req.target.toLocaleString()}` : req.target}
                                      </span>
                                    </div>
                                    <Progress value={progress} className="h-1 bg-muted" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

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
                            hasJoined ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" :
                            isEligible ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                          )}
                          variant={hasJoined ? "outline" : "default"}
                          disabled={(!isEligible && !hasJoined) || isJoining || !user}
                          onClick={() => !hasJoined && handleJoin(campaign.id)}
                        >
                          {isJoining ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          {hasJoined ? "In Progress" : isEligible ? "Join Campaign" : "Locked"}
                          {!isJoining && !hasJoined && isEligible && <ArrowRight className="w-3 h-3" />}
                          {!isJoining && !hasJoined && !isEligible && <Lock className="w-3 h-3" />}
                          {hasJoined && <CheckCircle2 className="w-3 h-3" />}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4">
             {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No past campaigns found.</div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border border-border bg-card rounded-3xl overflow-hidden opacity-75 grayscale hover:grayscale-0 transition-all">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32 sm:h-auto overflow-hidden relative flex-shrink-0">
                      <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-muted text-muted-foreground border-none">COMPLETED</Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-black text-foreground leading-tight">{campaign.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          <span>{campaign.participants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-primary">
                          <Zap className="w-3 h-3 fill-primary/20" />
                          <span>{campaign.reward}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Onboarding CTA */}
      <Link to="/projects">
        <Card className="border border-primary/20 bg-primary/5 p-6 rounded-3xl group cursor-pointer hover:bg-primary/10 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Access Full Project Portal
              </h2>
              <p className="text-xs text-muted-foreground">Launch campaigns and target influential users.</p>
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
