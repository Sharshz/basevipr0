import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Medal, 
  Search,
  ExternalLink,
  Loader2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_LEADERBOARD } from '@/src/mockData';
import { POI_SERVICE } from '@/src/services/poiService';
import { LeaderboardEntry } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

export default function Leaderboard() {
  const { user, profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await POI_SERVICE.getLeaderboard(20);
      setLeaderboard(data.length > 0 ? data : MOCK_LEADERBOARD);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);
  const currentUserRank = profile ? { rank: profile.poiScore.rank, displayName: 'You', score: profile.poiScore.total, avatarUrl: profile.avatarUrl } : null;

  return (
    <div className="space-y-6 pb-8">
      {/* Leaderboard Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight italic">LEADERBOARD</h1>
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <span>Weekly Reset</span>
          <span className="text-primary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            2d 14h left
          </span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 items-end pt-4 pb-2">
        {[topThree[1], topThree[0], topThree[2]].map((item, i) => {
          if (!item) return null;
          const isWinner = item.rank === 1;
          return (
            <div key={item.displayName} className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className={cn(
                  "border-2 shadow-lg",
                  isWinner ? "w-20 h-20 border-yellow-500 scale-110" : "w-16 h-16 border-muted"
                )}>
                  <AvatarImage src={item.avatarUrl} />
                  <AvatarFallback>{item.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-card shadow-md",
                  isWinner ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                )}>
                  {item.rank}
                </div>
              </div>
              <p className="text-[10px] font-bold text-foreground truncate w-full text-center">
                {item.displayName}
              </p>
              <p className="text-xs font-black text-primary">{item.score}</p>
            </div>
          );
        })}
      </div>

      {/* User's Current Rank */}
      {currentUserRank && (
        <Card className="border-none bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-primary/5">
          <div className="flex items-center gap-4">
            <div className="text-xl font-black text-primary italic">#{currentUserRank.rank}</div>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-primary/30">
                <AvatarImage src={currentUserRank.avatarUrl} />
                <AvatarFallback>{currentUserRank.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">You</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Top 5%</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-primary">{currentUserRank.score}</p>
            <p className="text-[10px] text-green-500 font-bold">+12 pts</p>
          </div>
        </Card>
      )}

      {/* Full List */}
      <div className="space-y-2">
        {others.map((item) => (
          <div 
            key={item.displayName} 
            className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 text-xs font-bold text-muted-foreground italic">#{item.rank}</div>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={item.avatarUrl} />
                  <AvatarFallback>{item.displayName[0]}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-bold text-foreground">{item.displayName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-foreground">{item.score}</p>
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
        View Full Rankings
      </Button>
    </div>
  );
}
