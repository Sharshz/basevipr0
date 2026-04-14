import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { POIScore, UserProfile, LeaderboardEntry } from '../types';

export const POI_SERVICE = {
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
   * Simulates calculating a POI score based on multi-dimensional metrics.
   * In a real app, this would call a backend that indexes Farcaster and Base data.
   */
  async calculateScore(uid: string, address?: string, farcasterHandle?: string): Promise<POIScore> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Base scores (simulated)
    const influence = farcasterHandle ? Math.floor(Math.random() * 400) + 500 : 100;
    const trust = address ? Math.floor(Math.random() * 300) + 600 : 200;
    const activity = Math.floor(Math.random() * 500) + 400;
    const alpha = Math.floor(Math.random() * 400) + 400;

    const total = Math.floor((influence * 0.4) + (trust * 0.3) + (activity * 0.2) + (alpha * 0.1));

    return {
      total,
      influence,
      trust,
      activity,
      alpha,
      trend: 'up',
      rank: Math.floor(Math.random() * 1000) + 1,
      percentile: 95 + Math.random() * 4,
    };
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
  }
};
