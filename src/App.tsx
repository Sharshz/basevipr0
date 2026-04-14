import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Campaigns from './pages/Campaigns';
import Profile from './pages/Profile';
import Entry from './pages/Entry';
import BottomNav from './components/BottomNav';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-primary/5 flex flex-col items-center text-foreground overflow-x-hidden">
        {/* Mobile Frame for Desktop */}
        <div className="w-full max-w-md min-h-screen bg-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col relative pb-20 border-x border-border/50">
          {user && <Header />}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Routes>
                <Route path="/entry" element={user ? <Navigate to="/" /> : <Entry />} />
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/entry" />} />
                <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/entry" />} />
                <Route path="/campaigns" element={user ? <Campaigns /> : <Navigate to="/entry" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/entry" />} />
              </Routes>
            </div>
          </main>
          {user && <BottomNav />}
        </div>
      </div>
    </Router>
  );
}
