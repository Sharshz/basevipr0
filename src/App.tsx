import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Campaigns from './pages/Campaigns';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-primary/5 flex flex-col items-center text-foreground overflow-x-hidden">
        {/* Mobile Frame for Desktop */}
        <div className="w-full max-w-md min-h-screen bg-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col relative pb-20 border-x border-border/50">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}
