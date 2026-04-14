export interface POIScore {
  total: number;
  influence: number;
  trust: number;
  activity: number;
  alpha: number;
  trend: 'up' | 'down' | 'stable';
  rank: number;
  percentile: number;
}

export interface ImpactStats {
  mintsDriven: number;
  volumeInfluenced: number;
  usersOnboarded: number;
  totalActions: number;
}

export interface UserProfile {
  uid: string;
  address?: string;
  farcasterHandle?: string;
  displayName: string;
  avatarUrl?: string;
  poiScore: POIScore;
  impact: ImpactStats;
  badges: Badge[];
  vouchCount: number;
  isVerified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  dateEarned: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  reward: string;
  minPOI: number;
  status: 'active' | 'completed';
  participants: number;
  imageUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  farcasterHandle?: string;
  score: number;
  avatarUrl?: string;
}
