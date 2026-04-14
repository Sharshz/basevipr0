/**
 * POI Scoring Engine
 * Implements anti-gaming measures, time decay, and anomaly detection.
 */

export interface ActionEvent {
  type: 'like' | 'recast' | 'reply' | 'mint' | 'swap' | 'vouch' | 'scam_interaction';
  timestamp: number; // ms
  sourceUid?: string; // The user who performed the action
  weight?: number;
  metadata?: any;
}

export interface ScoringResult {
  total: number;
  influence: number;
  trust: number;
  activity: number;
  alpha: number;
  isAnomaly: boolean;
  userType: 'high_impact' | 'active' | 'bot_suspect' | 'new_user';
}

export const SCORING_CONFIG = {
  DECAY_HALFLIFE_DAYS: 30,
  MAX_ACTIONS_PER_DAY: 50,
  SCAM_PENALTY: -500,
  ANOMALY_THRESHOLD_Z: 3.0, // Standard deviations for anomaly detection
};

export class ScoringEngine {
  /**
   * Calculates the multi-dimensional POI score.
   */
  static calculate(events: ActionEvent[]): ScoringResult {
    const now = Date.now();
    let influence = 0;
    let activity = 0;
    let trust = 1000; // Base trust
    let alpha = 0;

    // 1. Group events by day for capping
    const eventsByDay: Record<string, number> = {};
    
    // 2. Track unique interactions for weighting
    const uniqueUsers = new Set<string>();
    events.forEach(e => { if (e.sourceUid) uniqueUsers.add(e.sourceUid); });
    const uniqueUserMultiplier = 1 + (Math.min(uniqueUsers.size, 100) / 100); // Up to 2x boost for 100+ unique users

    events.forEach(event => {
      const dayKey = new Date(event.timestamp).toDateString();
      eventsByDay[dayKey] = (eventsByDay[dayKey] || 0) + 1;

      // Anti-Gaming: Cap repetitive actions per day
      if (eventsByDay[dayKey] > SCORING_CONFIG.MAX_ACTIONS_PER_DAY) return;

      // Time Decay: weight = e^(-ln(2) * t / halflife)
      const daysOld = (now - event.timestamp) / (1000 * 60 * 60 * 24);
      const timeWeight = Math.exp(-Math.log(2) * daysOld / SCORING_CONFIG.DECAY_HALFLIFE_DAYS);

      let baseValue = 0;
      switch (event.type) {
        case 'like':
          baseValue = 10;
          influence += baseValue * timeWeight * uniqueUserMultiplier;
          break;
        case 'recast':
          baseValue = 30;
          influence += baseValue * timeWeight * uniqueUserMultiplier;
          break;
        case 'reply':
          baseValue = 20;
          influence += baseValue * timeWeight * uniqueUserMultiplier;
          break;
        case 'mint':
          baseValue = 100;
          alpha += baseValue * timeWeight;
          influence += 20 * timeWeight * uniqueUserMultiplier;
          break;
        case 'swap':
          baseValue = 150;
          alpha += baseValue * timeWeight;
          break;
        case 'vouch':
          baseValue = 50;
          trust += baseValue * timeWeight * uniqueUserMultiplier;
          break;
        case 'scam_interaction':
          trust += SCORING_CONFIG.SCAM_PENALTY; // Heavy penalty
          break;
      }

      activity += 1 * timeWeight;
    });

    // 3. Anomaly Detection (Lightweight ML - Z-Score)
    // We check if the frequency of actions is statistically improbable
    const isAnomaly = this.detectAnomaly(events);

    // 4. User Classification
    const userType = this.classifyUser(influence, trust, activity, isAnomaly);

    // Final Total Calculation
    const total = Math.max(0, Math.floor(
      (influence * 0.4) + 
      (trust * 0.3) + 
      (activity * 0.2) + 
      (alpha * 0.1)
    ));

    return {
      total: isAnomaly ? Math.floor(total * 0.2) : total, // Slash score if anomaly detected
      influence: Math.floor(influence),
      trust: Math.floor(trust),
      activity: Math.floor(activity),
      alpha: Math.floor(alpha),
      isAnomaly,
      userType
    };
  }

  /**
   * Simple Z-Score based anomaly detection for action frequency.
   */
  private static detectAnomaly(events: ActionEvent[]): boolean {
    if (events.length < 10) return false;

    // Calculate actions per hour for the last 24h
    const now = Date.now();
    const last24h = events.filter(e => now - e.timestamp < 24 * 60 * 60 * 1000);
    
    const hourlyCounts = new Array(24).fill(0);
    last24h.forEach(e => {
      const hour = Math.floor((now - e.timestamp) / (60 * 60 * 1000));
      if (hour < 24) hourlyCounts[hour]++;
    });

    const mean = hourlyCounts.reduce((a, b) => a + b, 0) / 24;
    const stdDev = Math.sqrt(hourlyCounts.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / 24);

    // If any hour has a count > mean + 3*stdDev, it's a burst anomaly (potential bot)
    return hourlyCounts.some(count => count > mean + (SCORING_CONFIG.ANOMALY_THRESHOLD_Z * stdDev) && count > 10);
  }

  /**
   * Classifies user behavior based on metrics.
   */
  private static classifyUser(influence: number, trust: number, activity: number, isAnomaly: boolean): ScoringResult['userType'] {
    if (isAnomaly) return 'bot_suspect';
    if (influence > 1000 && trust > 1000) return 'high_impact';
    if (activity > 500) return 'active';
    return 'new_user';
  }
}
