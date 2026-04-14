import { POIScore } from '../types';

/**
 * Proof of Influence (POI) Scoring Engine
 * 
 * Formula: POI Score = (Social × 0.4) + (Onchain × 0.3) + (Network × 0.3)
 */

export class ScoreEngine {
  static calculateScore(social: number, onchain: number, network: number): number {
    const rawScore = (social * 0.4) + (onchain * 0.3) + (network * 0.3);
    return Math.round(rawScore);
  }

  static async fetchUserPOI(uid: string): Promise<POIScore> {
    // In a real app, this would fetch data from Farcaster API and Base Indexer
    // For now, we simulate the calculation
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      total: 82,
      social: 88,
      onchain: 75,
      network: 83,
      trend: 'up',
      rank: 42,
      percentile: 98,
    };
  }

  static getBadgeTier(score: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (score >= 90) return 'platinum';
    if (score >= 75) return 'gold';
    if (score >= 50) return 'silver';
    return 'bronze';
  }
}
