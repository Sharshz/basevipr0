export interface Lead {
  fid: number;
  username: string;
  text: string;
  score: number;
}

export const LEAD_SERVICE = {
  async scrapeLeads(): Promise<Lead[]> {
    try {
      const response = await fetch('/api/leads/scrape');
      const data = await response.json();
      if (data.success) {
        return data.leads;
      }
      throw new Error(data.error || 'Failed to scrape leads');
    } catch (error) {
      console.error('Lead scraping error:', error);
      return [];
    }
  },

  async createCampaign(goal: string, budget: number, duration: number) {
    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, budget, duration })
      });
      return await response.json();
    } catch (error) {
      console.error('Campaign creation error:', error);
      return { success: false, error: 'Failed to create campaign' };
    }
  }
};
