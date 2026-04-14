import { 
  User as UserIcon, 
  Settings, 
  Share2, 
  Copy, 
  ExternalLink,
  Award,
  Calendar,
  Shield,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { useFarcaster } from '@/src/context/FarcasterContext';
import { useAccount } from 'wagmi';
import React, { useState, useRef } from 'react';
import { POI_SERVICE } from '@/src/services/poiService';
import sdk from '@farcaster/frame-sdk';

export default function Profile() {
  const { user, profile } = useAuth();
  const { context, isFrame } = useFarcaster();
  const { address, isConnected } = useAccount();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use real profile if available, otherwise fallback to mock for demo
  const displayProfile = profile || MOCK_USER;
  const displayName = context?.user?.displayName || user?.displayName || displayProfile.displayName;
  const farcasterHandle = context?.user?.username || profile?.farcasterHandle || displayProfile.farcasterHandle;
  const displayAddress = address || profile?.address || displayProfile.address;

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const newScore = await POI_SERVICE.calculateScore(
        user.uid, 
        address, 
        farcasterHandle
      );
      
      await POI_SERVICE.syncProfile(user.uid, {
        poiScore: newScore,
        address: address || profile?.address,
        farcasterHandle: farcasterHandle,
        displayName: displayName
      });
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const downloadURL = await POI_SERVICE.uploadAvatar(user.uid, file);
      await POI_SERVICE.syncProfile(user.uid, {
        avatarUrl: downloadURL
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShare = () => {
    const text = `Check out my Proof of Influence (POI) profile! My score is ${displayProfile.poiScore.total}.`;
    if (isFrame) {
      sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`);
    } else {
      window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="relative h-48 rounded-2xl bg-gradient-to-r from-primary to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-16 left-8 group">
          <Avatar className="w-32 h-32 border-4 border-card shadow-xl relative overflow-hidden">
            <AvatarImage src={displayProfile.avatarUrl || context?.user?.pfpUrl || user?.photoURL} />
            <AvatarFallback>{displayName[0]}</AvatarFallback>
            
            {user && (
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            )}
          </Avatar>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="pt-16 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Verified Influencer
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            @{farcasterHandle} • {displayAddress?.slice(0, 6)}...{displayAddress?.slice(-4)}
            <button 
              className="p-1 hover:bg-accent rounded transition-colors"
              onClick={() => navigator.clipboard.writeText(displayAddress || '')}
            >
              <Copy className="w-3 h-3" />
            </button>
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !user}
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            Upload Avatar
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
            onClick={() => user && POI_SERVICE.vouch(user.uid, displayProfile.uid)}
          >
            <Award className="w-4 h-4" />
            Vouch
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-muted/30 pb-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground">Reputation Stats</CardTitle>
                  <CardDescription>Multi-dimensional influence breakdown</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{displayProfile.poiScore.total}</div>
                  <div className="text-xs text-muted-foreground">POI Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Influence</p>
                  <p className="text-xl font-bold text-foreground">{displayProfile.poiScore.influence}</p>
                  <Progress value={displayProfile.poiScore.influence / 10} className="h-1 bg-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Trust</p>
                  <p className="text-xl font-bold text-foreground">{displayProfile.poiScore.trust}</p>
                  <Progress value={displayProfile.poiScore.trust / 10} className="h-1 bg-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Activity</p>
                  <p className="text-xl font-bold text-foreground">{displayProfile.poiScore.activity}</p>
                  <Progress value={displayProfile.poiScore.activity / 10} className="h-1 bg-muted" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Alpha</p>
                  <p className="text-xl font-bold text-foreground">{displayProfile.poiScore.alpha}</p>
                  <Progress value={displayProfile.poiScore.alpha / 10} className="h-1 bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Proof of Impact
              </CardTitle>
              <CardDescription>Actions driven across the Base ecosystem</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{displayProfile.impact.mintsDriven}</p>
                    <p className="text-xs text-muted-foreground">Mints Driven</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">${(displayProfile.impact.volumeInfluenced / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Volume Influenced</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{displayProfile.impact.usersOnboarded}</p>
                    <p className="text-xs text-muted-foreground">Users Onboarded</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{displayProfile.impact.totalActions}</p>
                    <p className="text-xs text-muted-foreground">Total Actions</p>
                  </div>
                </div>
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
                <p className="text-sm font-medium text-foreground">Just now</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-primary/20 text-primary hover:bg-primary/10 gap-2"
                onClick={handleSync}
                disabled={isSyncing || !user}
              >
                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
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
