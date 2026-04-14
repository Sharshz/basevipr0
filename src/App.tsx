import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Campaigns from './pages/Campaigns';
import Profile from './pages/Profile';

import MobileNav from './components/MobileNav';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex text-foreground">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex flex-col pb-16 md:pb-0">
          <Header />
          <main className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    </Router>
  );
}
