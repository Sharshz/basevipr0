import { Wallet, LogIn, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">POI</span>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 gap-1 border-primary/20 text-primary hover:bg-primary/10 text-[10px]"
          onClick={handleConnect}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wallet className="w-3 h-3" />}
          {isConnected ? `${address?.slice(0, 4)}...${address?.slice(-2)}` : 'Connect'}
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-2 border-l border-border ml-1">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={profile?.avatarUrl || user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel className="text-foreground">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{user.displayName}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {profile?.farcasterHandle ? `@${profile.farcasterHandle}` : user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
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
          <Button onClick={login} size="sm" className="h-8 bg-primary hover:bg-primary/90 text-white gap-1 text-[10px]">
            <LogIn className="w-3 h-3" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
