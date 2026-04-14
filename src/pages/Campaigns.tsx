import { 
  Megaphone, 
  Users, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_CAMPAIGNS, MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';

export default function Campaigns() {
  const userScore = MOCK_USER.poiScore.total;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Campaign Hub</h1>
        <p className="text-muted-foreground">Earn rewards based on your Proof of Influence.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const isEligible = userScore >= campaign.minPOI;
          
          return (
            <Card key={campaign.id} className="border-none shadow-sm overflow-hidden group bg-card">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={campaign.imageUrl} 
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    isEligible ? "bg-green-500" : "bg-muted text-muted-foreground border-border"
                  )}>
                    {isEligible ? "Eligible" : `Requires ${campaign.minPOI} POI`}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-foreground">{campaign.title}</CardTitle>
                    <CardDescription className="mt-1 text-muted-foreground">{campaign.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{campaign.participants.toLocaleString()} joined</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>7 days left</span>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reward</p>
                    <p className="text-lg font-bold text-primary">{campaign.reward}</p>
                  </div>
                  {isEligible ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full gap-2",
                    isEligible ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  )}
                  disabled={!isEligible}
                >
                  {isEligible ? "Join Campaign" : "Boost POI to Unlock"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card className="border-none shadow-sm bg-primary text-white p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-bold">Launch your own campaign</h2>
            <p className="text-primary-foreground/80">Target the most influential users on Base for your project's growth.</p>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              Contact Sales
            </Button>
          </div>
          <div className="w-full md:w-64 h-40 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
             <Megaphone className="w-16 h-16 text-white/40" />
          </div>
        </div>
      </Card>
    </div>
  );
}
