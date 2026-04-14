import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Megaphone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Rank', path: '/leaderboard', icon: Trophy },
  { name: 'Quests', path: '/campaigns', icon: Megaphone },
  { name: 'Me', path: '/profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-card/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-md transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "fill-primary/20" : "")} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
