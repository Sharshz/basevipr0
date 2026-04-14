import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { ScoringEngine, ActionEvent } from "./src/lib/scoringEngine.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Real Scoring API
  app.post("/api/score/calculate", (req, res) => {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ success: false, error: "Invalid events data" });
    }

    try {
      const result = ScoringEngine.calculate(events as ActionEvent[]);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: "Scoring calculation failed" });
    }
  });

  // Mock Lead Scraper API
  app.get("/api/leads/scrape", async (req, res) => {
    try {
      // In a real app, we would call Neynar API here
      // const res = await fetch("https://api.neynar.com/v2/farcaster/feed/trending", { headers: { api_key: process.env.NEYNAR_API_KEY } });
      
      const mockLeads = [
        { fid: 1, username: "base_god", text: "Minting live on Base! Check it out.", score: 850 },
        { fid: 2, username: "farcaster_dev", text: "New token launch this Friday. #Base", score: 720 },
        { fid: 3, username: "crypto_alpha", text: "Looking for high-quality users for my new Base project.", score: 910 }
      ];

      res.json({ success: true, leads: mockLeads });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to scrape leads" });
    }
  });

  // Campaign Builder API
  app.post("/api/campaigns/create", (req, res) => {
    const { goal, budget, duration } = req.body;
    
    // Logic from campaignBuilder.ts
    let minScore = 500;
    let reward = 1;
    let estimatedUsers = 0;

    if (goal === "mint") {
      minScore = 650;
      reward = budget / 100;
      estimatedUsers = 800;
    } else if (goal === "swap") {
      minScore = 700;
      reward = budget / 80;
      estimatedUsers = 500;
    }

    const campaign = {
      goal,
      budget,
      duration,
      minScore,
      reward,
      estimatedUsers,
      estimatedActions: Math.floor(estimatedUsers * 0.25),
      estimatedCpa: budget / (estimatedUsers * 0.25)
    };

    res.json({ success: true, campaign });
  });

  // Profile API
  app.get("/api/profile/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
      // In a real app, we would fetch from Firestore/DB here
      // For now, we return a mock profile that matches the UserProfile type
      const mockProfile = {
        uid,
        displayName: "User " + uid.slice(0, 4),
        farcasterHandle: "user_" + uid.slice(0, 4),
        poiScore: {
          total: 750,
          influence: 800,
          trust: 700,
          activity: 600,
          alpha: 900,
          trend: 'up',
          rank: 120,
          percentile: 98,
          userType: 'high_impact'
        },
        impact: {
          mintsDriven: 45,
          volumeInfluenced: 12500,
          usersOnboarded: 12,
          totalActions: 320
        },
        badges: [],
        vouchCount: 15,
        isVerified: true
      };
      res.json({ success: true, profile: mockProfile });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch profile" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
