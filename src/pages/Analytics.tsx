import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Share2,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MOCK_USER } from '@/src/mockData';

const MOCK_CHART_DATA = [
  { day: 'Mon', actions: 120, users: 450, conversion: 15 },
  { day: 'Tue', actions: 150, users: 480, conversion: 18 },
  { day: 'Wed', actions: 180, users: 520, conversion: 22 },
  { day: 'Thu', actions: 140, users: 490, conversion: 16 },
  { day: 'Fri', actions: 210, users: 580, conversion: 25 },
  { day: 'Sat', actions: 250, users: 620, conversion: 28 },
  { day: 'Sun', actions: 230, users: 600, conversion: 26 },
];

const TOP_INFLUENCERS = [
  { username: 'alice', actions: 45, score: 980, avatar: 'https://picsum.photos/seed/alice/100/100' },
  { username: 'bob', actions: 32, score: 940, avatar: 'https://picsum.photos/seed/bob/100/100' },
  { username: 'charlie', actions: 28, score: 890, avatar: 'https://picsum.photos/seed/charlie/100/100' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">CAMPAIGN ANALYTICS</h1>
          <p className="text-sm text-muted-foreground">Real-time performance of your Base distribution.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 border-border rounded-xl font-bold">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-border rounded-xl font-bold">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Users Reached", value: "12.4K", change: "+12%", up: true, icon: Users },
          { label: "Actions", value: "2,120", change: "+18%", up: true, icon: Target },
          { label: "Conversion", value: "17.2%", change: "+2.4%", up: true, icon: TrendingUp },
          { label: "Avg CPA", value: "$0.42", change: "-8%", up: true, icon: DollarSign },
        ].map((kpi, i) => (
          <Card key={i} className="bg-card border-border p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-lg bg-primary/10">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
              <div className={cn(
                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                kpi.up ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{kpi.label}</p>
              <p className="text-2xl font-black text-foreground">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="bg-card border-border rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <div>
            <CardTitle className="text-lg font-bold">Performance Over Time</CardTitle>
            <CardDescription className="text-xs">Daily actions and user reach</CardDescription>
          </div>
          <div className="flex bg-muted/30 p-1 rounded-xl">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-lg transition-all",
                  timeRange === range ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actions" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActions)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Insights */}
        <Card className="bg-card border-border rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              User Insights
            </CardTitle>
            <CardDescription className="text-xs">Top performing segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Alpha Users", conversion: "32%", color: "bg-purple-500" },
              { label: "High Volume", conversion: "24%", color: "bg-blue-500" },
              { label: "Viral Casters", conversion: "18%", color: "bg-green-500" },
            ].map((segment, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{segment.label}</span>
                  <span className="text-primary">{segment.conversion} Conv.</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", segment.color)} style={{ width: segment.conversion }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Influencers */}
        <Card className="bg-card border-border rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Top Performers</CardTitle>
              <CardDescription className="text-xs">Users driving the most impact</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-bold text-[10px]">VIEW ALL</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOP_INFLUENCERS.map((influencer, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    <img src={influencer.avatar} alt={influencer.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">@{influencer.username}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">POI {influencer.score}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{influencer.actions}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Actions</p>
                </div>
              </div>
            ))}
            <Button className="w-full h-10 bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold rounded-xl text-xs">
              Invite Top Performers Again
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          Live Activity
        </h2>
        <div className="space-y-2">
          {[
            { text: "New mint completed by @alice", time: "2m ago", value: "+25 POI" },
            { text: "Campaign 'NFT Push' reached 10k users", time: "15m ago", value: "Milestone" },
            { text: "New referral joined via @bob", time: "1h ago", value: "+10 POI" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">{item.text}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.time}</span>
                <span className="text-primary font-bold">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
