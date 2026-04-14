import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, ShieldCheck, Activity, Award, Wallet, LogIn, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { useAccount, useConnect } from 'wagmi';

export default function Entry() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleConnectWallet = () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
    }
  };

  const handleSignIn = async () => {
    await login();
    // App.tsx handles the redirect to '/' once user is populated
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-12 w-full max-w-sm flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_40px_-10px_rgba(0,82,255,0.5)]"
            >
              <Zap className="text-white w-12 h-12 fill-current" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-foreground leading-tight">
                CHECK YOUR <br />
                <span className="text-primary">REAL INFLUENCE</span> <br />
                ON BASE
              </h1>
              <p className="text-muted-foreground text-lg">
                Not followers. Not vanity metrics. <br />
                <span className="font-bold text-foreground">Real onchain impact.</span>
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl group"
              onClick={handleNext}
            >
              Get Started
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 w-full max-w-sm"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">What is POI?</h2>
              <p className="text-muted-foreground">Proof of Influence (POI) is your definitive onchain reputation score.</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-card border border-border rounded-2xl flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Onchain Activity</h3>
                  <p className="text-xs text-muted-foreground">We analyze your mints, swaps, and smart contract interactions.</p>
                </div>
              </div>
              <div className="p-4 bg-card border border-border rounded-2xl flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Social Trust</h3>
                  <p className="text-xs text-muted-foreground">Your Farcaster graph and peer vouches build your trust score.</p>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold bg-foreground hover:bg-foreground/90 text-background rounded-2xl"
              onClick={handleNext}
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8 w-full max-w-sm"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Connect Accounts</h2>
              <p className="text-muted-foreground">Link your identity to calculate your score and unlock rewards.</p>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline"
                className={`w-full h-16 justify-between px-6 rounded-2xl border-2 ${isConnected ? 'border-green-500/50 bg-green-500/5' : 'border-border hover:border-primary/50'}`}
                onClick={handleConnectWallet}
                disabled={isConnected || isPending}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-500/20 text-green-500' : 'bg-muted text-foreground'}`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-foreground">Web3 Wallet</p>
                    <p className="text-[10px] text-muted-foreground">
                      {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Base Wallet'}
                    </p>
                  </div>
                </div>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : 
                 isConnected ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                 <ArrowRight className="w-5 h-5 text-muted-foreground" />}
              </Button>

              <Button 
                className="w-full h-16 justify-between px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={handleSignIn}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Create Profile</p>
                    <p className="text-[10px] text-white/70">Sign in to generate score</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
              <ShieldCheck className="w-4 h-4" />
              Securely verified via Farcaster & Base
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-10 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'bg-primary w-6' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}
