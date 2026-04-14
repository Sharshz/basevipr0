import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Share2, 
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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

const chartData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 70 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 80 },
  { name: 'Sun', score: 82 },
];

export default function Dashboard() {
  const { poiScore } = MOCK_USER;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Influence Overview</h1>
        <p className="text-muted-foreground">Real-time analysis of your impact on Base & Farcaster.</p>
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
            <div className="text-4xl font-bold text-foreground">High</div>
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
            <CardTitle className="text-foreground">Score Progression</CardTitle>
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
            <CardTitle className="text-foreground">Influence Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground">Weighted impact across layers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 text-purple-500" />
                  Social Impact
                </span>
                <span className="font-bold text-foreground">{poiScore.social}%</span>
              </div>
              <Progress value={poiScore.social} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Onchain Behavior
                </span>
                <span className="font-bold text-foreground">{poiScore.onchain}%</span>
              </div>
              <Progress value={poiScore.onchain} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Share2 className="w-4 h-4 text-green-500" />
                  Network Influence
                </span>
                <span className="font-bold text-foreground">{poiScore.network}%</span>
              </div>
              <Progress value={poiScore.network} className="h-2 bg-muted" />
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
                <Badge variant="outline" className="bg-card border-border text-foreground">Next: 85</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
