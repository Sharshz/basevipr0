import { Link, useLocation } from 'react-router-dom';
import { Zap, Trophy, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Score', path: '/', icon: Zap },
  { name: 'Rank', path: '/leaderboard', icon: Trophy },
  { name: 'Quests', path: '/campaigns', icon: Target },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-card/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "fill-primary/10" : "")} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-tighter",
              isActive ? "opacity-100" : "opacity-60"
            )}>
              {item.name}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,82,255,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
