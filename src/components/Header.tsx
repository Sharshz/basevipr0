import { Bell, Search, Wallet, LogIn, LogOut, Loader2 } from 'lucide-react';
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
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useFarcaster } from '@/src/context/FarcasterContext';

export default function Header() {
  const { user, profile, login, logout } = useAuth();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { isFrame, context } = useFarcaster();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Connect to the first available connector (usually injected or coinbase)
      connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between">
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search for users, campaigns, or badges..." 
          className="pl-10 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary" 
        />
      </div>

      <div className="flex items-center gap-4">
        {isFrame && context?.user && (
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-xs font-bold text-primary">@{context.user.username}</span>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 text-primary hover:bg-primary/10"
          onClick={handleConnect}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
          {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
        </Button>

        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
        </button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 border-l border-border ml-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatarUrl || user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-bold text-foreground leading-none">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {profile?.farcasterHandle ? `@${profile.farcasterHandle}` : user.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-accent-foreground">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={login} className="bg-primary hover:bg-primary/90 text-white gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
