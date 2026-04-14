import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';

export default function Entry() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/');
    } else {
      login();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 px-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_40px_-10px_rgba(0,82,255,0.5)]"
      >
        <Zap className="text-white w-12 h-12 fill-current" />
      </motion.div>

      <div className="space-y-4">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black tracking-tighter text-foreground leading-tight"
        >
          CHECK YOUR <br />
          <span className="text-primary">REAL INFLUENCE</span> <br />
          ON BASE
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-lg max-w-xs mx-auto"
        >
          Not followers. Not vanity metrics. <br />
          <span className="font-bold text-foreground">Real onchain impact.</span>
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-4"
      >
        <Button 
          size="lg" 
          className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl group"
          onClick={handleStart}
        >
          Show My Score
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          Securely verified via Farcaster & Base
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 w-full pt-8 opacity-50"
      >
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">1M+</p>
          <p className="text-[10px] uppercase tracking-widest">Actions</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">50k+</p>
          <p className="text-[10px] uppercase tracking-widest">Users</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-foreground">$10M+</p>
          <p className="text-[10px] uppercase tracking-widest">Volume</p>
        </div>
      </motion.div>
    </div>
  );
}
