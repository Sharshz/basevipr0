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
          <h1 className="text-3xl font-bold text-slate-900">Global Leaderboard</h1>
          <p className="text-slate-500">The most influential builders and creators on Base.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search handle or address..." className="pl-10 bg-white border-slate-200" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_LEADERBOARD.slice(0, 3).map((user, idx) => (
          <Card key={user.displayName} className="border-none shadow-sm relative overflow-hidden">
            {idx === 0 && (
              <div className="absolute top-0 right-0 p-4">
                <Trophy className="w-12 h-12 text-yellow-400 opacity-20" />
              </div>
            )}
            <CardContent className="pt-6 text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 border-4 border-white shadow-md mx-auto">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold border-2 border-white",
                  idx === 0 ? "bg-yellow-400" : idx === 1 ? "bg-slate-300" : "bg-orange-400"
                )}>
                  {user.rank}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{user.displayName}</h3>
                <p className="text-sm text-slate-500">@{user.farcasterHandle}</p>
              </div>
              <div className="pt-2">
                <Badge variant="secondary" className="text-lg px-4 py-1 bg-blue-50 text-blue-600 border-blue-100">
                  {user.score} POI
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-20 text-center">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Farcaster</TableHead>
              <TableHead className="text-right">POI Score</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LEADERBOARD.map((user) => (
              <TableRow key={user.displayName} className="hover:bg-slate-50 transition-colors">
                <TableCell className="text-center font-bold text-slate-500">
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
                    <span className="font-semibold text-slate-900">{user.displayName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">@{user.farcasterHandle}</TableCell>
                <TableCell className="text-right font-bold text-blue-600">{user.score}</TableCell>
                <TableCell>
                  <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
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

import { cn } from '@/lib/utils';
