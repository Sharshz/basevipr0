import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { POIScore, UserProfile, LeaderboardEntry } from '../types';
import { ActionEvent } from '../lib/scoringEngine';

export const POI_SERVICE = {
  async uploadAvatar(uid: string, file: File): Promise<string> {
    const storageRef = ref(storage, `avatars/${uid}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
  // ... existing methods ...
  async getLeaderboard(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('poiScore.total', 'desc'), limit(limitCount));
    
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc, index) => {
        const data = doc.data() as UserProfile;
        return {
          rank: index + 1,
          displayName: data.displayName,
          farcasterHandle: data.farcasterHandle,
          score: data.poiScore.total,
          avatarUrl: data.avatarUrl
        };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  },
  /**
   * Calculates a POI score using the backend scoring engine.
   * This includes anti-gaming, time decay, and anomaly detection.
   */
  async calculateScore(uid: string, address?: string, farcasterHandle?: string): Promise<POIScore> {
    // In a real app, we would fetch real events from the database/indexer
    // For this demo, we generate a realistic set of events to show the engine in action
    const mockEvents: ActionEvent[] = [
      { type: 'like', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
      { type: 'recast', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2 },
      { type: 'mint', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5 },
      { type: 'swap', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10 },
      { type: 'vouch', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15 },
    ];

    // Add some "spam" to test capping (100 likes today)
    for (let i = 0; i < 100; i++) {
      mockEvents.push({ type: 'like', timestamp: Date.now() - 1000 * 60 * i });
    }

    try {
      const response = await fetch('/api/score/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: mockEvents })
      });
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      const result = data.result;

      return {
        total: result.total,
        influence: result.influence,
        trust: result.trust,
        activity: result.activity,
        alpha: result.alpha,
        trend: 'up',
        rank: Math.floor(Math.random() * 1000) + 1,
        percentile: 95 + Math.random() * 4,
        isAnomaly: result.isAnomaly,
        userType: result.userType
      };
    } catch (error) {
      console.error('Scoring calculation failed:', error);
      // Fallback to simple simulation if API fails
      return {
        total: 500,
        influence: 500,
        trust: 500,
        activity: 500,
        alpha: 500,
        trend: 'up',
        rank: 999,
        percentile: 50,
      };
    }
  },

  async syncProfile(uid: string, profileData: Partial<UserProfile>) {
    const userDocRef = doc(db, 'users', uid);
    
    // Ensure impact stats exist if not provided
    const defaultImpact = {
      mintsDriven: Math.floor(Math.random() * 100),
      volumeInfluenced: Math.floor(Math.random() * 50000),
      usersOnboarded: Math.floor(Math.random() * 50),
      totalActions: Math.floor(Math.random() * 500)
    };

    const dataToSync = {
      ...profileData,
      impact: profileData.impact || defaultImpact,
      vouchCount: profileData.vouchCount || Math.floor(Math.random() * 20),
      isVerified: profileData.isVerified ?? true
    };

    try {
      await setDoc(userDocRef, dataToSync, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  },

  async vouch(voterUid: string, targetUid: string) {
    const targetDocRef = doc(db, 'users', targetUid);
    try {
      await updateDoc(targetDocRef, {
        vouchCount: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetUid}`);
    }
  },

  async joinCampaign(uid: string, campaignId: string) {
    const userDocRef = doc(db, 'users', uid);
    const campaignDocRef = doc(db, 'campaigns', campaignId);

    try {
      // Add campaign to user's joined list
      await updateDoc(userDocRef, {
        joinedCampaigns: increment(1) // Simplified for now
      });

      // Increment campaign participants
      await updateDoc(campaignDocRef, {
        participants: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid} or campaigns/${campaignId}`);
    }
  },

  async getProfile(uid: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`/api/profile/${uid}`);
      const data = await response.json();
      if (data.success) {
        return data.profile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile from API:', error);
      return null;
    }
  }
};
