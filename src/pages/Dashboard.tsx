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
  Loader2,
  AlertTriangle,
  Award,
  UserCheck
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

  const getUserTypeLabel = (type?: string) => {
    switch (type) {
      case 'high_impact': return { label: 'High Impact', icon: Award, color: 'text-yellow-500 bg-yellow-500/10' };
      case 'active': return { label: 'Active User', icon: Zap, color: 'text-blue-500 bg-blue-500/10' };
      case 'bot_suspect': return { label: 'Bot Suspect', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' };
      default: return { label: 'New User', icon: UserCheck, color: 'text-green-500 bg-green-500/10' };
    }
  };

  const userTypeInfo = getUserTypeLabel(poiScore.userType);

  return (
    <div className="space-y-8 pb-8">
      {/* Ego Hit Section */}
      <section className="flex flex-col items-center text-center py-10 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
        
        {poiScore.isAnomaly && (
          <Badge variant="destructive" className="animate-bounce flex items-center gap-1 px-4 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Anomaly Detected
          </Badge>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10"></div>
          <div className="text-8xl font-black tracking-tighter text-foreground tabular-nums">
            {poiScore.total}
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="flex gap-2 justify-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-sm px-4 py-1 rounded-full">
              TOP {Math.max(1, Math.floor(100 - (poiScore.percentile || 0)))}% ON BASE
            </Badge>
            <Badge className={cn("text-sm px-4 py-1 rounded-full border-none font-bold flex items-center gap-1", userTypeInfo.color)}>
              <userTypeInfo.icon className="w-3 h-3" />
              {userTypeInfo.label}
            </Badge>
          </div>
          <p className="text-green-500 font-bold flex items-center justify-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            +32 today
          </p>
        </div>

        <div className="flex gap-4 w-full pt-4">
          <Button 
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Score
          </Button>
          <Button 
            variant="outline"
            className="w-14 h-14 border-border rounded-2xl flex items-center justify-center"
            onClick={handleSync}
            disabled={isSyncing}
          >
            {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
          </Button>
        </div>
      </section>

      {/* Reputation Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none bg-card/50 backdrop-blur-sm p-4 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Influence</p>
          <p className="text-2xl font-black text-foreground">{poiScore.influence}</p>
          <Progress value={poiScore.influence / 10} className="h-1 bg-muted" />
        </Card>
        <Card className="border-none bg-card/50 backdrop-blur-sm p-4 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Trust</p>
          <p className="text-2xl font-black text-foreground">{poiScore.trust}</p>
          <Progress value={poiScore.trust / 10} className="h-1 bg-muted" />
        </Card>
        <Card className="border-none bg-card/50 backdrop-blur-sm p-4 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Activity</p>
          <p className="text-2xl font-black text-foreground">{poiScore.activity}</p>
          <Progress value={poiScore.activity / 10} className="h-1 bg-muted" />
        </Card>
        <Card className="border-none bg-card/50 backdrop-blur-sm p-4 space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Alpha</p>
          <p className="text-2xl font-black text-foreground">{poiScore.alpha}</p>
          <Progress value={poiScore.alpha / 10} className="h-1 bg-muted" />
        </Card>
      </div>

      {/* Proof Feed */}
      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Proof Feed
          </CardTitle>
          <CardDescription className="text-xs">Recent onchain actions attributed to you.</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-2">
            {[
              { type: 'mint', user: '0x71...2a', action: 'Minted "Base Summer"', points: '+20', time: '2m ago' },
              { type: 'swap', user: '0x34...1b', action: 'Swapped ETH for $DEGEN', points: '+25', time: '15m ago' },
              { type: 'referral', user: 'farcaster_user', action: 'Joined via your link', points: '+50', time: '1h ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    item.type === 'mint' ? "bg-blue-500/10 text-blue-500" :
                    item.type === 'swap' ? "bg-green-500/10 text-green-500" :
                    "bg-purple-500/10 text-purple-500"
                  )}>
                    {item.type === 'mint' ? <Zap className="w-4 h-4" /> :
                     item.type === 'swap' ? <RefreshCw className="w-4 h-4" /> :
                     <Users className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-primary">{item.points}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
