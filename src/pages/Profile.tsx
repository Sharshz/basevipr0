import { 
  User as UserIcon, 
  Settings, 
  Share2, 
  Copy, 
  ExternalLink,
  Award,
  Calendar,
  Shield,
  ShieldCheck,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Camera,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { MOCK_USER } from '@/src/mockData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/context/AuthContext';
import { useFarcaster } from '@/src/context/FarcasterContext';
import { useAccount } from 'wagmi';
import React, { useState, useRef, useEffect } from 'react';
import { POI_SERVICE } from '@/src/services/poiService';
import sdk from '@farcaster/frame-sdk';

export default function Profile() {
  const { user, profile } = useAuth();
  const { context, isFrame } = useFarcaster();
  const { address, isConnected } = useAccount();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editFarcasterHandle, setEditFarcasterHandle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use real profile if available, otherwise fallback to mock for demo
  const displayProfile = profile || MOCK_USER;
  const displayName = context?.user?.displayName || user?.displayName || displayProfile.displayName;
  const farcasterHandle = context?.user?.username || profile?.farcasterHandle || displayProfile.farcasterHandle;
  const displayAddress = address || profile?.address || displayProfile.address;

  useEffect(() => {
    if (profile) {
      setEditDisplayName(profile.displayName || '');
      setEditFarcasterHandle(profile.farcasterHandle || '');
    } else {
      setEditDisplayName(displayName);
      setEditFarcasterHandle(farcasterHandle);
    }
  }, [profile, displayName, farcasterHandle]);

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

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await POI_SERVICE.syncProfile(user.uid, {
        displayName: editDisplayName,
        farcasterHandle: editFarcasterHandle
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
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
    <div className="space-y-6 pb-8">
      {/* Identity Header */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4 relative">
        {!isEditing && user && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0 text-muted-foreground hover:text-primary"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}

        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-card shadow-2xl relative overflow-hidden">
            <AvatarImage src={displayProfile.avatarUrl || context?.user?.pfpUrl || user?.photoURL} />
            <AvatarFallback className="text-2xl font-bold">{displayName[0]}</AvatarFallback>
            
            {user && (
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
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
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-full border-2 border-card shadow-lg">
            <Shield className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2 w-full max-w-[240px]">
          {isEditing ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <Input 
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Display Name"
                  className="h-9 text-center font-bold bg-muted/50 border-border"
                />
                <Input 
                  value={editFarcasterHandle}
                  onChange={(e) => setEditFarcasterHandle(e.target.value)}
                  placeholder="Farcaster Handle"
                  className="h-9 text-center text-sm bg-muted/50 border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 h-8 bg-primary text-white font-bold"
                  onClick={handleSaveProfile}
                  disabled={isSyncing}
                >
                  {isSyncing ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 border-border font-bold"
                  onClick={() => setIsEditing(false)}
                  disabled={isSyncing}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-foreground">{displayName}</h1>
              <a 
                href={`https://warpcast.com/${farcasterHandle}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center justify-center gap-1 group"
              >
                @{farcasterHandle}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold">
            RANK #{displayProfile.poiScore.rank}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-bold">
            POI {displayProfile.poiScore.total}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
        <Button 
          variant="outline" 
          className="h-12 border-border rounded-xl font-bold px-4"
          onClick={() => user && POI_SERVICE.vouch(user.uid, displayProfile.uid)}
        >
          <Award className="w-4 h-4 mr-2 text-yellow-500" />
          Vouch
        </Button>
      </div>

      {/* Engagement Stats Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Engagement Stats
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mints Driven</p>
            <p className="text-xl font-black text-foreground">{displayProfile.impact.mintsDriven}</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Volume</p>
            <p className="text-xl font-black text-foreground">${(displayProfile.impact.volumeInfluenced / 1000).toFixed(1)}k</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Onboarded</p>
            <p className="text-xl font-black text-foreground">{displayProfile.impact.usersOnboarded}</p>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Actions</p>
            <p className="text-xl font-black text-foreground">{displayProfile.impact.totalActions}</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Earned Badges
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {displayProfile.badges?.map((badge) => (
            <div key={badge.id} className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                <img src={badge.imageUrl} alt={badge.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{badge.tier}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Card */}
      <Card className="border-none bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Fully Verified</p>
            <p className="text-[10px] text-muted-foreground">Onchain identity secured</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-primary hover:bg-primary/10"
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </Card>
    </div>
  );
}
