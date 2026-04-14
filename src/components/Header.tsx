import { Bell, Search, Wallet, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/src/context/AuthContext';

export default function Header() {
  const { user, profile, login, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search for users, campaigns, or badges..." 
          className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500" 
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>

        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user.displayName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {profile?.farcasterHandle ? `@${profile.farcasterHandle}` : user.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={login} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
