import { cn } from '@/lib/utils';
import { 
  Trophy, 
  Medal, 
  Search,
  ExternalLink
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
import { MOCK_LEADERBOARD } from '@/src/mockData';

export default function Leaderboard() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Global Leaderboard</h1>
          <p className="text-muted-foreground">The most influential builders and creators on Base.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search handle or address..." className="pl-10 bg-card border-border text-foreground" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_LEADERBOARD.slice(0, 3).map((user, idx) => (
          <Card key={user.displayName} className="border-none shadow-sm relative overflow-hidden bg-card">
            {idx === 0 && (
              <div className="absolute top-0 right-0 p-4">
                <Trophy className="w-12 h-12 text-yellow-400 opacity-20" />
              </div>
            )}
            <CardContent className="pt-6 text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 border-4 border-card shadow-md mx-auto">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold border-2 border-card",
                  idx === 0 ? "bg-yellow-400" : idx === 1 ? "bg-slate-300" : "bg-orange-400"
                )}>
                  {user.rank}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">@{user.farcasterHandle}</p>
              </div>
              <div className="pt-2">
                <Badge variant="secondary" className="text-lg px-4 py-1 bg-primary/10 text-primary border-primary/20">
                  {user.score} POI
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-20 text-center text-muted-foreground">Rank</TableHead>
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Farcaster</TableHead>
              <TableHead className="text-right text-muted-foreground">POI Score</TableHead>
              <TableHead className="w-20 text-muted-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LEADERBOARD.map((user) => (
              <TableRow key={user.displayName} className="hover:bg-accent/50 transition-colors border-border">
                <TableCell className="text-center font-bold text-muted-foreground">
                  {user.rank <= 3 ? (
                    <div className="flex justify-center">
                       <Medal className={cn(
                         "w-5 h-5",
                         user.rank === 1 ? "text-yellow-400" : user.rank === 2 ? "text-slate-300" : "text-orange-400"
                       )} />
                    </div>
                  ) : user.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">{user.displayName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">@{user.farcasterHandle}</TableCell>
                <TableCell className="text-right font-bold text-primary">{user.score}</TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-accent rounded-full transition-colors">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
