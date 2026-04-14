import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Share2, 
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Zap,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_USER } from '@/src/mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid 
} from 'recharts';
import { useAuth } from '@/src/context/AuthContext';
import { useAccount } from 'wagmi';
import { useFarcaster } from '@/src/context/FarcasterContext';
import { POI_SERVICE } from '@/src/services/poiService';
import sdk from '@farcaster/frame-sdk';

const chartData = [
  { name: 'Mon', score: 650 },
  { name: 'Tue', score: 680 },
  { name: 'Wed', score: 720 },
  { name: 'Thu', score: 700 },
  { name: 'Fri', score: 780 },
  { name: 'Sat', score: 800 },
  { name: 'Sun', score: 820 },
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { address } = useAccount();
  const { context, isFrame } = useFarcaster();
  const [isSyncing, setIsSyncing] = useState(false);

  const poiScore = profile?.poiScore || MOCK_USER.poiScore;

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const newScore = await POI_SERVICE.calculateScore(
        user.uid, 
        address, 
        context?.user?.username || profile?.farcasterHandle
      );
      
      await POI_SERVICE.syncProfile(user.uid, {
        poiScore: newScore,
        address: address || profile?.address,
        farcasterHandle: context?.user?.username || profile?.farcasterHandle,
        displayName: context?.user?.displayName || user.displayName || 'User'
      });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleShare = () => {
    const text = `My Proof of Influence (POI) score is ${poiScore.total}! Check your impact on Base & Farcaster.`;
    if (isFrame) {
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`);
    } else {
      window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Influence Overview</h1>
          <p className="text-muted-foreground">Real-time analysis of your impact on Base & Farcaster.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2 border-border"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90 text-white"
            onClick={handleSync}
            disabled={isSyncing || !user}
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Sync Influence
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Zap className="w-16 h-16 fill-current" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80">POI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{poiScore.total}</div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium opacity-90">
              <TrendingUp className="w-3 h-3" />
              <span>Top {100 - poiScore.percentile}% of users</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">#{poiScore.rank}</div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-500">
              <ArrowUpRight className="w-3 h-3" />
              <span>Up 5 spots this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">12.4k</div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>Unique interactions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Onchain Trust</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{poiScore.trust}</div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-primary">
              <ShieldCheck className="w-3 h-3" />
              <span>Sybil-resistant verified</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Reputation Timeline</CardTitle>
            <CardDescription className="text-muted-foreground">Your influence growth over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F1F1F" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121212',
                    borderRadius: '8px', 
                    border: '1px solid #1F1F1F', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    color: '#FFFFFF'
                  }}
                  itemStyle={{ color: '#0052FF' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0052FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Reputation Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground">Weighted impact across layers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-purple-500" />
                  Influence
                </span>
                <span className="font-bold text-foreground">{poiScore.influence}</span>
              </div>
              <Progress value={poiScore.influence / 10} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Trust
                </span>
                <span className="font-bold text-foreground">{poiScore.trust}</span>
              </div>
              <Progress value={poiScore.trust / 10} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4 text-green-500" />
                  Activity
                </span>
                <span className="font-bold text-foreground">{poiScore.activity}</span>
              </div>
              <Progress value={poiScore.activity / 10} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Alpha
                </span>
                <span className="font-bold text-foreground">{poiScore.alpha}</span>
              </div>
              <Progress value={poiScore.alpha / 10} className="h-2 bg-muted" />
            </div>

            <div className="pt-4 mt-4 border-t border-border">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">Improving Fast</p>
                    <p className="text-muted-foreground">Keep casting to boost social</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-card border-border text-foreground">Next: 850</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Proof Feed
          </CardTitle>
          <CardDescription className="text-muted-foreground">Recent onchain actions attributed to your influence.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'mint', user: '0x71...2a', action: 'Minted "Base Summer" NFT', points: '+20', time: '2m ago' },
              { type: 'swap', user: '0x34...1b', action: 'Swapped 0.5 ETH for $DEGEN', points: '+25', time: '15m ago' },
              { type: 'referral', user: 'farcaster_user', action: 'Joined POI via your link', points: '+50', time: '1h ago' },
              { type: 'interaction', user: 'whale_wallet', action: 'Recasted your latest post', points: '+100', time: '3h ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    item.type === 'mint' ? "bg-blue-500/10 text-blue-500" :
                    item.type === 'swap' ? "bg-green-500/10 text-green-500" :
                    item.type === 'referral' ? "bg-purple-500/10 text-purple-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {item.type === 'mint' ? <Zap className="w-5 h-5" /> :
                     item.type === 'swap' ? <RefreshCw className="w-5 h-5" /> :
                     item.type === 'referral' ? <Users className="w-5 h-5" /> :
                     <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">By {item.user} • {item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{item.points} POI</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Verified</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
