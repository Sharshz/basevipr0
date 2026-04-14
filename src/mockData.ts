import { UserProfile, Campaign, LeaderboardEntry } from './types';

export const MOCK_USER: UserProfile = {
  uid: 'user1',
  address: '0x1234...5678',
  farcasterHandle: 'base_influencer',
  displayName: 'Alex Base',
  avatarUrl: 'https://picsum.photos/seed/alex/200/200',
  poiScore: {
    total: 82,
    social: 88,
    onchain: 75,
    network: 83,
    trend: 'up',
    rank: 42,
    percentile: 98,
  },
  badges: [
    {
      id: 'b1',
      name: 'Alpha Influencer',
      description: 'Top 1% of influence on Base',
      imageUrl: 'https://picsum.photos/seed/badge1/100/100',
      tier: 'platinum',
      dateEarned: '2024-03-15',
    },
    {
      id: 'b2',
      name: 'Early Bridger',
      description: 'Bridged to Base in the first week',
      imageUrl: 'https://picsum.photos/seed/badge2/100/100',
      tier: 'gold',
      dateEarned: '2023-08-10',
    },
  ],
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Base Summer Rewards',
    description: 'Exclusive rewards for high-influence users on Base.',
    reward: '500 $BASE',
    minPOI: 70,
    status: 'active',
    participants: 1240,
    imageUrl: 'https://picsum.photos/seed/camp1/400/200',
  },
  {
    id: 'c2',
    title: 'Farcaster Frenzy',
    description: 'Boost your social score and earn limited NFTs.',
    reward: 'Limited Edition NFT',
    minPOI: 50,
    status: 'active',
    participants: 3500,
    imageUrl: 'https://picsum.photos/seed/camp2/400/200',
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, displayName: 'Vitalik', farcasterHandle: 'vitalik', score: 99, avatarUrl: 'https://picsum.photos/seed/v/100/100' },
  { rank: 2, displayName: 'Jesse Pollak', farcasterHandle: 'jesse', score: 98, avatarUrl: 'https://picsum.photos/seed/j/100/100' },
  { rank: 3, displayName: 'Brian Armstrong', farcasterHandle: 'brian', score: 97, avatarUrl: 'https://picsum.photos/seed/b/100/100' },
  { rank: 4, displayName: 'Base God', farcasterHandle: 'basegod', score: 95, avatarUrl: 'https://picsum.photos/seed/bg/100/100' },
  { rank: 5, displayName: 'DeFi Degenerate', farcasterHandle: 'defidegen', score: 92, avatarUrl: 'https://picsum.photos/seed/dd/100/100' },
];
