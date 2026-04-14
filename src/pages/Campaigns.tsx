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
        <h1 className="text-3xl font-bold text-slate-900">Campaign Hub</h1>
        <p className="text-slate-500">Earn rewards based on your Proof of Influence.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_CAMPAIGNS.map((campaign) => {
          const isEligible = userScore >= campaign.minPOI;
          
          return (
            <Card key={campaign.id} className="border-none shadow-sm overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={campaign.imageUrl} 
                  alt={campaign.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={cn(
                    isEligible ? "bg-green-500" : "bg-slate-500"
                  )}>
                    {isEligible ? "Eligible" : `Requires ${campaign.minPOI} POI`}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="mt-1">{campaign.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{campaign.participants.toLocaleString()} joined</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>7 days left</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reward</p>
                    <p className="text-lg font-bold text-blue-600">{campaign.reward}</p>
                  </div>
                  {isEligible ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-300" />
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full gap-2",
                    isEligible ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed"
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

      <Card className="border-none shadow-sm bg-slate-900 text-white p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-bold">Launch your own campaign</h2>
            <p className="text-slate-400">Target the most influential users on Base for your project's growth.</p>
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 hover:text-white">
              Contact Sales
            </Button>
          </div>
          <div className="w-full md:w-64 h-40 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
             <Megaphone className="w-16 h-16 text-slate-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}
