import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Megaphone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Rank', path: '/leaderboard', icon: Trophy },
  { name: 'Quests', path: '/campaigns', icon: Megaphone },
  { name: 'Me', path: '/profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50">
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
