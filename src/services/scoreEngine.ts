import { POIScore } from '../types';

/**
 * Proof of Influence (POI) Scoring Engine
 * 
 * Formula: POI Score = (Influence × 0.4) + (Trust × 0.3) + (Activity × 0.2) + (Alpha × 0.1)
 */

export class ScoreEngine {
  static calculateScore(influence: number, trust: number, activity: number, alpha: number): number {
    const rawScore = (influence * 0.4) + (trust * 0.3) + (activity * 0.2) + (alpha * 0.1);
    return Math.round(rawScore);
  }

  static async fetchUserPOI(uid: string): Promise<POIScore> {
    // In a real app, this would fetch data from Farcaster API and Base Indexer
    // For now, we simulate the calculation
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      total: 820,
      influence: 720,
      trust: 910,
      activity: 640,
      alpha: 780,
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
