import { 
  User, 
  Settings, 
  Share2, 
  Copy, 
  ExternalLink,
  Award,
  Calendar,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';

export default function Profile() {
  const user = MOCK_USER;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-primary to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-16 left-8">
          <Avatar className="w-32 h-32 border-4 border-card shadow-xl">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{user.displayName}</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Verified Influencer
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            @{user.farcasterHandle} • {user.address}
            <button className="p-1 hover:bg-accent rounded transition-colors">
              <Copy className="w-3 h-3" />
            </button>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-accent">
            <Settings className="w-4 h-4" />
            Edit Profile
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Building the future of decentralized social on Base. Passionate about community growth, 
                onchain governance, and the intersection of social media and finance. 
                Top 1% POI contributor.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {['Base', 'Farcaster', 'DeFi', 'NFTs', 'Governance'].map(tag => (
                  <Badge key={tag} variant="outline" className="bg-muted border-border text-foreground">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Influence Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.badges.map((badge) => (
                <Card key={badge.id} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                      <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground">{badge.name}</h3>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge className={cn(
                          "text-[10px] px-1.5 py-0 h-4",
                          badge.tier === 'platinum' ? "bg-foreground text-background" : "bg-yellow-500 text-white"
                        )}>
                          {badge.tier.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {badge.dateEarned}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5 text-primary" />
                POI Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Status</p>
                <p className="text-sm font-medium text-foreground">Fully Verified</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Last Sync</p>
                <p className="text-sm font-medium text-foreground">2 hours ago</p>
              </div>
              <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
                Re-sync Data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center">
                    <span className="text-background font-bold text-xs">F</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">Farcaster</span>
                </div>
                <Badge className="bg-green-500 text-white">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-xs">B</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">Base Wallet</span>
                </div>
                <Badge className="bg-green-500 text-white">Connected</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
