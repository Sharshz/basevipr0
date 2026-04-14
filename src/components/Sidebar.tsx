import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Megaphone, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="text-white w-5 h-5 fill-current" />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">POI Engine</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Influence</p>
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl font-bold text-foreground">82</span>
            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">↑ 12%</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
