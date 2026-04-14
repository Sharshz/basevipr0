import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const SCORE_MILESTONES = [100, 500, 750, 900, 1000];
const ACTION_MILESTONES = [10, 50, 100, 500, 1000];

export function useMilestoneNotifications() {
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile) return;

    const checkMilestones = () => {
      const currentScore = profile.poiScore.total;
      const currentActions = profile.impact.totalActions;

      // Check Score Milestones
      SCORE_MILESTONES.forEach((milestone) => {
        const storageKey = `notified_score_${user.uid}_${milestone}`;
        if (currentScore >= milestone && !localStorage.getItem(storageKey)) {
          toast.success(`🎉 Milestone Reached!`, {
            description: `You've achieved a POI score of ${milestone}! Keep up the great work on Base.`,
            duration: 5000,
          });
          localStorage.setItem(storageKey, 'true');
        }
      });

      // Check Action Milestones
      ACTION_MILESTONES.forEach((milestone) => {
        const storageKey = `notified_action_${user.uid}_${milestone}`;
        if (currentActions >= milestone && !localStorage.getItem(storageKey)) {
          toast.success(`🔥 On Fire!`, {
            description: `You've completed ${milestone} total actions! Your influence is growing.`,
            duration: 5000,
          });
          localStorage.setItem(storageKey, 'true');
        }
      });
    };

    checkMilestones();
  }, [user, profile]);
}
